// Usage: node tests/seq.js <outPrefix> <playKey> <defKey|-> "<t1,t2,...>" [side u|c] [extraJS] [width]
// Starts the user's game from the real career, lines up the given play, then freezes the clock and steps the
// play animation to each time, saving a cropped canvas screenshot per time: shots/<prefix>_<t>.png
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
(async()=>{const [out='shots/seq',pk='mesh',dc='-',ts='0.3,0.8,1.3,1.8,2.4',side='u',extra='',w='430']=process.argv.slice(2);
const b=await chromium.launch();const p=await b.newPage({viewport:{width:+w,height:900},deviceScaleFactor:2});
p.on('pageerror',e=>console.log('PAGEERR',e.message));p.on('console',m=>{if(m.type()==='error'&&!/font|Failed to load/i.test(m.text()))console.log('CONSOLE',m.text().slice(0,300))});
const save=fs.readFileSync(path.join(__dirname,'../saves/career.json'),'utf8');
await p.addInitScript(s=>{try{if(!localStorage.getItem('saturday_sideline_v1'))localStorage.setItem('saturday_sideline_v1',s)}catch(e){}},save);
await p.goto('file://'+path.join(__dirname,'../dist/preview.html'));await p.waitForTimeout(1200);
const r=await p.evaluate(([pk,dc,side,extra])=>{
  while(!userGame(S.week))act('advance',{});act('play',{});endIntro();G.cheer=0;
  let i=0;while(G.phase!=='off'&&G.phase!=='def'&&i++<50){if(SC.A)skipAnimForce(SC.A);if(G.phase==='coin')doInput('receive');else if(G.phase==='pat')doInput('xp');else if(G.phase==='ckick'||G.phase==='patk'||G.phase==='live')autoStep();G.koAnim=null}
  G.phase=side==='u'?'off':'def';G.poss=side;G.ball=42;G.down=1;G.togo=10;G.bx=MID;render();
  if(extra)eval(extra);
  const d=dc==='-'?(G.dpend||'c3'):dc;const P=buildPlay(side,pk,d);G.sel=side==='u'?pk:null;startPlay(P,false);SC.A.spd=0;if(SC.A.t<0){SC.A.t=0;for(const [q,tx,ty] of SC.A.pre||[]){q.x=tx;q.y=ty;q.hx=q.hy=0}}
  SC.cam.x=MID;SC.cam.y=G.ball+4;
  return {dc:d,res:SC.A.res,auto:SC.A.auto,tp:P.tp,ts:P.ts,isRun:P.isRun,blk:(SC.A.blk||[]).map(b=>b.os+'/'+b.ds+(b.help?'+'+b.help.slot:''))}},[pk,dc,side,extra]);
console.log(JSON.stringify(r));
const box=await p.evaluate(()=>{const r=SC.cv.getBoundingClientRect();return {x:r.left,y:r.top,width:r.width,height:r.height}});
for(const t of ts.split(',')){
  const info=await p.evaluate(T=>{const A=SC.A;if(!A)return 'done';while(SC.A===A&&A.t<T)stepAnim(A,1/60);if(SC.A===A){const c=camTarget();SC.cam.x=c.x;SC.cam.y=c.y}return SC.A?SC.A.t.toFixed(2)+' '+(SC.A.res?SC.A.res.kind+' '+(SC.A.res.yds||''):''):'ended'},+t);
  await p.waitForTimeout(160);await p.screenshot({path:out+'_'+t+'.png',clip:box});console.log(t,info)}
await b.close()})();
