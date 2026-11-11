// Usage: node tests/fullshot.js <outdir> <width> <height> [save.json] -- full-page screenshots of every main page.
// Pages: name=js pairs below; pass extra "name=js" args to add more.
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
(async()=>{const [dir='shots/pages',w='430',h='900',sv='',...extra]=process.argv.slice(2);
fs.mkdirSync(dir,{recursive:true});
const b=await chromium.launch();const p=await b.newPage({viewport:{width:+w,height:+h}});
p.on('pageerror',e=>console.log('PAGEERR',e.message));
const save=fs.readFileSync(sv||path.join(__dirname,'../saves/career.json'),'utf8');
await p.addInitScript(s=>{try{if(!localStorage.getItem('saturday_sideline_v1'))localStorage.setItem('saturday_sideline_v1',s)}catch(e){}},save);
await p.goto('file://'+path.join(__dirname,'../dist/preview.html'));await p.waitForTimeout(1200);
let pages=extra.length?extra.map(x=>[x.slice(0,x.indexOf('=')),x.slice(x.indexOf('=')+1)]):await p.evaluate(()=>typeof SUBS==='undefined'?['week','league','sched','stand','poll','bracket','prog'].map(t=>[t,"S.tab='"+t+"'"]):[].concat(...Object.keys(SUBS).map(sec=>SUBS[sec].o.map(o=>[sec+'-'+o[0],"S.tab='"+sec+"';S."+SUBS[sec].k+"='"+o[0]+"'"])),['poll','stand','bracket'].map(t=>['rank-'+t,"S.tab='"+t+"'"])));
for(const [n,js] of pages){
  const r=await p.evaluate(js=>{eval(js);S.gview=null;render();window.scrollTo(0,0);const d=document.documentElement;return [d.scrollHeight,d.scrollWidth,window.innerWidth]},js);
  await p.waitForTimeout(250);await p.screenshot({path:path.join(dir,n+'-'+w+'.png'),fullPage:true});
  console.log(n,'height',r[0],r[1]>r[2]?'HORIZONTAL OVERFLOW '+r[1]+'>'+r[2]:'');}
await b.close()})();
