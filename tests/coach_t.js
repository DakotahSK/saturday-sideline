require('./stub.js');
eval(require('fs').readFileSync('t.js','utf8')+`
act('pick',{id:'22'});
const hist={};let errs=0;
for(let season=0;season<8;season++){
  let guard=0;
  while(S.view!=='summary'&&guard++<60){
    const ug=userGame(S.week);
    if(ug&&!ug.done){act('play',{});simToEnd();act('finish',{});for(let k=0;k<3&&S.view==='presser';k++)act('press',{i:'0'});}
    if(S.view==='summary')break;
    act('advance',{});for(let k=0;k<3&&S.view==='presser';k++)act('press',{i:'0'});
  }
  try{leagueTab&&leagueTab()}catch(e){errs++;console.log('ERR league',e.message)}
  const rows=S.teams.filter(t=>t.id!==S.userId).map(t=>({id:t.id,rt:coachRt(t),w:rec(t.id).w,off:t.off+t.def}));
  const hi=rows.filter(r=>r.rt>=82),lo=rows.filter(r=>r.rt<58),avg=a=>a.length?(a.reduce((s,r)=>s+r.w,0)/a.length).toFixed(1):'-';
  const rts=rows.map(r=>r.rt).sort((a,b)=>a-b);
  console.log('S'+S.season,'rt min/med/max',rts[0],rts[rts.length>>1],rts[rts.length-1],'82+ n',hi.length,'avgW',avg(hi),'| <58 n',lo.length,'avgW',avg(lo),'| fired',(S.carousel||[]).length,'hires',(S.carousel||[]).map(c=>c.rt).join(','),'moves',JSON.stringify((S.coachMoves||{}).up||[]).slice(0,90));
  for(const t of S.teams){(hist[t.id]=hist[t.id]||[]).push(rec(t.id).w)}
  act('pport',{i:'0'});act('pstay',{});act('next',{});
}
// turnover: how many different teams finish top 8 by wins
const tops=new Set();for(let s=0;s<8;s++){const arr=Object.entries(hist).map(([id,a])=>[id,a[s]]).sort((a,b)=>b[1]-a[1]).slice(0,8);arr.forEach(x=>tops.add(x[0]))}
console.log('distinct top-8 teams over 8 seasons',tops.size,'errs',errs);
S.feed=Array(80).fill({t:'x'});trimSave(3);console.log('trim ok',S.feed.length,S.teams[0].past.length,S.trimmed.lv);
try{leagueTab();}catch(e){console.log('ERR after trim',e.message)}
`);
