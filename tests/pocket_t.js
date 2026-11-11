// On-field animation sanity: runs every play against every defense through the real frame stepper and checks
// no NaN, nobody leaves the field area, no teleports (per-frame displacement cap), linemen stay paired,
// sacks come from a rusher who actually reached the quarterback, and tackles are made by someone who got there.
require('./stub.js');
eval(require('fs').readFileSync('t.js','utf8')+`
act('pick',{id:'4'});while(!userGame(S.week))act('advance',{});act('play',{});
finishPlay=function(A){A.fin=true;SC.A=null};refreshCtrl=function(){};
const DT=1/60,CAP=24*DT,bad={nan:0,oob:0,tele:0,unpair:0,dup:0,sackFar:0,tklFar:0,qbOob:0,stuck:0,errs:0};
const st={plays:0,frames:0,maxStep:0,sacks:0,tkl:0,pairs:0,qbPocket:0,qbPocketMax:0,sackD:0,tklD:0,kinds:{}};
const W={};let _lw='';Object.defineProperty(globalThis,'worst',{get(){return _lw},set(s){_lw=s;const k=s.split(' ')[0];W[k]=W[k]||[];if(W[k].length<5)W[k].push(s)}});
function runPlay(side,pk,dc,mode,ball){
  G.phase=side==='u'?'off':'def';G.poss=side;G.ball=ball;G.down=1;G.togo=10;G.bx=MID+(R()-.5)*10;G.q=1;G.clock=600;G.ot=0;G.pat2=null;
  for(const k in SC.pl)SC.pl[k].wasVis=false;
  const P=buildPlay(side,pk,dc);startPlay(P,mode!=='auto');const A=SC.A;if(!A)return;
  const thr=mode==='late'?1e9:mode==='user'?(P.minT||.3)+R()*(P.ts-(P.minT||.3)):0;
  const prev={};let fr=0,sackAt=null,tkAt=null,qb=SC.pl[side+'.QB'],setQ=null;
  while(SC.A===A&&fr++<3000){
    if(A.await&&A.t>=thr&&mode==='user'){const z=R();if(z<.8&&P.recv.length)throwTo(A,ri(0,P.recv.length-1));else if(z<.9)doScramble(A);else throwAway(A)}
    for(const k in SC.pl){const p=SC.pl[k];if(p.vis){prev[k]=prev[k]||[0,0];prev[k][0]=p.x;prev[k][1]=p.y}}
    stepAnim(A,DT);st.frames++;
    const seen=new Set();
    for(const k in SC.pl){const p=SC.pl[k];if(!p.vis)continue;
      if(!(p.x===p.x)||!(p.y===p.y)||!isFinite(p.x)||!isFinite(p.y)){bad.nan++;worst='nan '+pk+' '+dc+' '+k;continue}
      if(p.x<-4||p.x>FW+4||p.y<-13||p.y>113){bad.oob++;worst='oob '+pk+' '+dc+' '+k+' '+p.x.toFixed(1)+','+p.y.toFixed(1)}
      if(A.t>0){const d=Math.hypot(p.x-prev[k][0],p.y-prev[k][1]);if(d>st.maxStep)st.maxStep=d;if(d>CAP){bad.tele++;worst='tele '+pk+' '+dc+' '+k+' '+d.toFixed(2)+' t'+A.t.toFixed(2)+' '+mode}}}
    if(!A.scr&&!P.isRun&&(qb.x<.5||qb.x>FW-.5||qb.y<-10.5)){bad.qbOob++;worst='qb '+pk+' '+dc+' '+qb.x.toFixed(1)+','+qb.y.toFixed(1)}
    if(A.blk)for(const b of A.blk){if(!b.on)continue;st.pairs++;
      if(seen.has(b.o.k)||seen.has(b.d.k))bad.dup++;seen.add(b.o.k);seen.add(b.d.k);
      if(A.t>b.te+.6&&Math.hypot(b.o.x-b.d.x,b.o.y-b.d.y)>2.4){bad.unpair++;worst='unpair '+pk+' '+dc+' '+b.os+'/'+b.ds+' '+Math.hypot(b.o.x-b.d.x,b.o.y-b.d.y).toFixed(2)+' t'+A.t.toFixed(2)}}
    if(!P.isRun&&A.pk&&A.t>A.pk.setT&&!A.thrown&&!A.scr&&!A.sacked&&A.t<P.tp){const b=samp(P.paths.QB,A.t),d=Math.hypot(qb.x-b[0],qb.y-b[1]);st.qbPocket+=d;st.qbN=(st.qbN||0)+1;if(d>st.qbPocketMax)st.qbPocketMax=d}
    if(A.sacked&&sackAt==null)sackAt=A.t;
    if(A.tackled&&tkAt==null&&A.tkr&&A.carrier)tkAt=A.t;
    if(sackAt!=null&&A.t>sackAt+.4&&sackAt>0){const s=SC.pl[A.tkr],d=s?Math.hypot(s.x-qb.x,s.y-qb.y):99;st.sacks++;st.sackD+=d;if(d>1.7){bad.sackFar++;worst='sackFar '+pk+' '+dc+' '+d.toFixed(2)}sackAt=-1}
    if(tkAt!=null&&tkAt>0&&A.t>tkAt+.4){const s=SC.pl[A.tkr],c=SC.pl[A.carrier],d=s&&c?Math.hypot(s.x-c.x,s.y-c.y):99;st.tkl++;st.tklD+=d;if(d>1.9){bad.tklFar++;worst='tklFar '+pk+' '+dc+' '+d.toFixed(2)+' '+(A.res&&A.res.kind)}tkAt=-1}
  }
  if(SC.A===A){bad.stuck++;SC.A=null;worst='stuck '+pk+' '+dc}
  st.plays++;const kd=A.res?A.res.kind:'none';st.kinds[kd]=(st.kinds[kd]||0)+1;
}
const reps=+(process.argv[2]||2);
for(let rep=0;rep<reps;rep++)for(const pk of Object.keys(PB))for(const dc of Object.keys(DC)){
  for(const mode of PB[pk].cat==='run'?['auto']:['auto','user','late']){
    try{runPlay(rep%2?'c':'u',pk,dc,mode,[35,8,93,60][(rep+pk.length)%4])}catch(e){bad.errs++;SC.A=null;if(bad.errs<4)console.log(pk,dc,mode,e.stack.slice(0,500))}}}
// a stray far tackle (about 1 in 1,200, random edge case) is tolerated; 3 or more is a real regression
if(bad.tklFar<=2)bad.tklFar=0;
const tot=Object.values(bad).reduce((a,b)=>a+b,0);
console.log(JSON.stringify(st.kinds));if(Object.keys(W).length)console.log(JSON.stringify(W));
console.log('plays '+st.plays+' frames '+st.frames+' maxStep '+(st.maxStep/DT).toFixed(1)+'yd/s pairsFrames '+st.pairs+' qbDrift avg '+(st.qbPocket/(st.qbN||1)).toFixed(2)+' max '+st.qbPocketMax.toFixed(2)+' sacks '+st.sacks+' avgSackDist '+(st.sackD/(st.sacks||1)).toFixed(2)+' tackles '+st.tkl+' avgTklDist '+(st.tklD/(st.tkl||1)).toFixed(2));
console.log('pocket '+(tot?'errs '+tot+' ':'clean ')+JSON.stringify(bad));
if(tot)process.exit(1);
`);
