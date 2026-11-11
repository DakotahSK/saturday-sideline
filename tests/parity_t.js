// Dynasty / parity check from the real save. Usage: node parity_t.js [seasons]
require('./stub.js');
eval(require('fs').readFileSync('t.js','utf8')+`
S=JSON.parse(require('fs').readFileSync('../saves/career.json','utf8'));G=S.game||null;applyCareerGlobals();
const N=+process.argv[2]||8,tops=[],top8=[];let errs=0;
for(let season=0;season<N;season++){
  let guard=0;
  while(S.view!=='summary'&&guard++<80){
    const ug=userGame(S.week);
    if(ug&&!ug.done){act('play',{});simToEnd();act('finish',{});for(let k=0;k<3&&S.view==='presser';k++)act('press',{i:'0'});}
    if(S.view==='summary')break;
    act('advance',{});for(let k=0;k<4&&S.view==='presser';k++)act('press',{i:'0'});
  }
  const p=poll();tops.push(p.slice(0,4).map(id=>team(id).abbr));top8.push(p.slice(0,8));
  try{act('pport',{i:'0'});act('pstay',{});act('next',{})}catch(e){errs++;console.log('ERR',e.message)}
}
const all4=new Set(tops.flat()),all8=new Set(top8.flat());
let carry=0;for(let i=1;i<top8.length;i++)carry+=top8[i].filter(x=>top8[i-1].includes(x)).length;
tops.forEach((t,i)=>console.log('season',i+1,'top4',t.join(' ')));
const pr=S.teams.map(t=>t.prestige).sort((a,b)=>a-b);
console.log('distinct top4',all4.size,'distinct top8',all8.size,'avg top8 carryover',(carry/(top8.length-1)).toFixed(1),'prestige min/med/max',pr[0],pr[pr.length>>1],pr[pr.length-1],'errs',errs);
`);
