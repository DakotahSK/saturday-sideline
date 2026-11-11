// Browser test (Playwright): navigation state must survive background work.
// Emulates a phone, fakes the claude.ai account store with slow writes, and checks that
// cloud sync, timers, resize events and touch scrolling never change the page or jump the scroll.
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:412,height:820},hasTouch:true,isMobile:true,deviceScaleFactor:2});
const p=await ctx.newPage();let errs=0;const fails=[];
p.on('pageerror',e=>{errs++;console.log('PAGEERR',e.message)});
const save=fs.readFileSync(path.join(__dirname,'../saves/career.json'),'utf8');
await p.addInitScript(s=>{
  try{if(!localStorage.getItem('saturday_sideline_v1'))localStorage.setItem('saturday_sideline_v1',s)}catch(e){}
  // fake account store: every read/write takes a while, like a phone on a slow network
  const docs={},lat={get:120,set:900};window.__docs=docs;window.__lat=lat;window.__sets=0;
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const db={doc:k=>({get:async()=>{await wait(lat.get);const v=docs[k];return {exists:v!==undefined,data:()=>v===undefined?undefined:JSON.parse(v)}},set:async o=>{const js=JSON.stringify(o);await wait(lat.set);docs[k]=js;window.__sets++}})};
  window.claude={use:async n=>n==='db'?db:{id:async()=>'u1'}};
},save);
await p.goto('file://'+path.join(__dirname,'../dist/preview.html'));
const ev=(f,a)=>p.evaluate(f,a);
const state=()=>ev(()=>({tab:S.tab,view:S.view,y:Math.round(window.scrollY),ready:CLOUD.ready,st:CLOUD.state}));
const tap=async t=>{await ev(t=>{const el=document.querySelector('[data-act="tab"][data-t="'+t+'"]');if(!el)throw new Error('no nav button for '+t);el.click()},t)};
const check=(name,ok,info)=>{if(!ok){fails.push(name);console.log('FAIL',name,JSON.stringify(info||''))}else console.log('pass',name)};
for(let i=0;i<80;i++){const s=await state();if(s.ready&&s.st==='synced')break;await sleep(250)}
check('cloud connected',(await state()).ready);

// 1. taps while a slow account write is in flight, then keep scrolling: the page must not flip back
await tap('league');await sleep(1500);            // write of "league" is now in flight (900ms)
await tap('stand');await sleep(200);await tap('league');await sleep(2600);   // let it settle
await tap('prog');
let flipped=null,jump=null;
for(let i=0;i<40;i++){await p.mouse.wheel(0,120);await sleep(100);const s=await state();if(s.tab!=='prog'&&!flipped)flipped=s;}
check('no flip back after overlapping saves',!flipped,flipped);

// 1b. real saves that overlap a slow write: the older copy must never be loaded back over the newer one
await ev(()=>{S.qlen=180;save()});await sleep(1500);
await ev(()=>{S.qlen=480;save()});await tap('stand');await sleep(3800);
await ev(()=>{S.focus=S.focus==='off'?'def':'off';save()});const fc=await ev(()=>S.focus);
let lost=null;for(let i=0;i<30;i++){await sleep(100);const s=await ev(()=>({tab:S.tab,q:S.qlen,f:S.focus}));if(s.tab!=='stand'||s.q!==480||s.f!==fc)lost=lost||s}
check('overlapping saves never roll the career back',!lost,lost);
await sleep(1500);const cl=await ev(()=>{const d=JSON.parse(window.__docs['data/users/u1/career']);return {ts:d.ts,cts:CLOUD.cts,lts:S._ts}});
check('account ends up with the latest save',cl.ts===cl.lts&&cl.cts===cl.lts,cl);

// 2. another device writes an equal-progress copy that sits on a different page
await ev(()=>window.scrollTo(0,0));await tap('league');await sleep(3000);
await ev(async()=>{const c=JSON.parse(JSON.stringify(S));c.tab='week';c.gview=null;c._ts=Date.now()+5000;window.__docs['data/users/u1/career']=JSON.stringify({json:JSON.stringify(c),ts:c._ts})});
await ev(()=>window.scrollTo(0,900));const y0=(await state()).y;
await ev(()=>{S.qlen=S.qlen===300?480:300;save()});   // any real save triggers a sync round
flipped=null;for(let i=0;i<30;i++){await sleep(100);const s=await state();if(s.tab!=='league')flipped=flipped||s;if(Math.abs(s.y-y0)>4)jump=jump||s}
check('foreign sync keeps the page',!flipped,flipped);check('foreign sync keeps the scroll position',!jump,{y0,jump});

// 3. account errors re-render in the background: scroll and page stay put
await ev(()=>{window.scrollTo(0,700);window.__lat.fail=true;const d=window.claude;});
const y1=(await state()).y;
await ev(()=>{CLOUD.state='error';CLOUD.errAt=Date.now()-20000;if(typeof bgRender==='function')bgRender();else render()});
let s3=await state();check('background render keeps scroll',Math.abs(s3.y-y1)<=4&&s3.tab==='league',{y1,s3});
await ev(()=>{CLOUD.state='synced';CLOUD.errAt=0;render()});

// 4. resize storms (mobile browser bars showing and hiding during a scroll)
await ev(()=>window.scrollTo(0,600));const y2=(await state()).y;
for(const h of [760,820,744,820]){await p.setViewportSize({width:412,height:h});await sleep(120)}
let s4=await state();check('resize keeps page and scroll',s4.tab==='league'&&Math.abs(s4.y-y2)<=4,{y2,s4});

// 5. a vertical touch drag that starts on the navigation must not change the page
const nav=await ev(()=>{const n=document.querySelector('[data-act="tab"][data-t="stand"]');const r=n.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}});
const cdp=await ctx.newCDPSession(p);
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:nav.x,y:nav.y}]});
for(let i=1;i<=10;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:nav.x+i,y:nav.y-i*22}]});await sleep(16)}
await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(400);
let s5=await state();check('touch scroll over the nav is not a tap',s5.tab==='league',s5);

// 6. plain navigation does not hit the account at all, and still survives a reload
const n0=await ev(()=>window.__sets);await tap('poll');await sleep(2500);const n1=await ev(()=>window.__sets);
check('page changes are not account writes',n1===n0,{n0,n1});
await p.reload();await sleep(2500);let s6=await state();check('page remembered after reload',s6.tab==='poll',s6);

// 7. a real newer save from another device still comes through (and keeps the page you are on)
const wk=await ev(()=>{const c=JSON.parse(JSON.stringify(S));c.tab='week';c.ad.conf=c.ad.conf===77?76:77;c._ts=Date.now()+60000;c.__mark=1;window.__docs['data/users/u1/career']=JSON.stringify({json:JSON.stringify(c),ts:c._ts});return c.ad.conf});
await ev(()=>{CLOUD.sprog=careerProg(S);S._ts=Date.now();cloudPush()});await sleep(1500);
const s7=await ev(()=>({tab:S.tab,conf:S.ad.conf,mark:S.__mark}));
check('newer account copy is adopted without moving the page',s7.mark===1&&s7.conf===wk&&s7.tab==='poll',s7);

await b.close();
console.log('nav_t errs '+(errs+fails.length)+(fails.length?' FAILED: '+fails.join(' | '):' all navigation checks passed'));
process.exit(fails.length||errs?1:0);
})();
