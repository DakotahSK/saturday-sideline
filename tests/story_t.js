// Storylines harness: sims full seasons from the real save, counts story types, arc starts/resolutions, duplicate titles, coach turnover.
// Usage: node story_t.js [seasons=3] [sample=0] (sample>0 prints that many headlines with bodies)
require('./stub.js');
global.NSEAS=+(process.argv[2]||3);global.NSAMP=+(process.argv[3]||0);
eval(require('fs').readFileSync('t.js','utf8')+`
S=JSON.parse(require('fs').readFileSync('../saves/career.json','utf8'));G=S.game||null;applyCareerGlobals();
const errs=[];const chk=(n,f)=>{try{return f()}catch(e){errs.push(n+': '+(e.stack||e).toString().slice(0,300));return ''}};
const norm=t=>{let x=String(t);for(const tm of S.teams){x=x.split(tm.name).join('T').split(tm.abbr).join('T')}return x.replace(/[A-Z][a-z]+ [A-Z][a-zA-Z']+/g,'P').replace(/\\d+/g,'#').slice(0,46)};
const tot={},types={},sample=[];let dupT=0,dupB=0,allN=0,midFire=0,endFire=0,arcS=0,arcR=0,weeks=0,thin=0,bad=0,choices=0;const arcTypes={},wins=[];
for(let season=0;season<NSEAS;season++){
  let guard=0;const seen={},seenB={},seenArc={};
  const scan=k=>{const L=(S.news&&S.news[k])||[];if(k!=='pre'){weeks++;if(L.length<5)thin++}
    for(const n of L){allN++;tot[n.tag]=(tot[n.tag]||0)+1;const ty=n.tag+' | '+norm(n.title);types[ty]=(types[ty]||0)+1;
      if(seen[n.title])dupT++;seen[n.title]=1;const b=String(n.body).split(/(?<=[.!?"]) /);for(const s of b){if(s.length>38){if(seenB[s])dupB++;seenB[s]=1}}
      if(/\\u2014|undefined|NaN|\\[object|null/.test(n.title+' '+n.body)){bad++;if(bad<6)console.log('BAD TEXT',n.title,'::',n.body)}
      if(/Coaching/.test(n.tag)&&/ fires | is out at |parts ways|pulls the plug|makes a change/.test(n.title))midFire++;
      sample.push(n)}};
  scan('pre');
  while(S.view!=='summary'&&guard++<60){
    const w=S.week;
    for(const a of (S.arcs&&S.arcs.season===S.season?S.arcs.list:[])){const id=a.k+':'+a.t+':'+(a.o==null?'':a.o);if(!seenArc[id]){seenArc[id]=a;arcS++;arcTypes[a.k]=(arcTypes[a.k]||0)+1}}
    chk('league all',()=>leagueTab('all'));chk('hub',()=>{S.tab='league';const h=hubView();S.tab='week';return h});chk('week all',()=>weekTab('all'));
    if(S.choice&&S.view==='hub'){choices++;chk('choice',()=>act('stchoice',{i:String(guard%2)}))}
    const ug=userGame(S.week);
    if(ug&&!ug.done){act('play',{});simToEnd();act('finish',{});for(let k=0;k<3&&S.view==='presser';k++)act('press',{i:String(k%2)});}
    if(S.view==='summary'){scan(String(w));break}
    act('advance',{});for(let k=0;k<3&&S.view==='presser';k++)act('press',{i:'0'});
    scan(String(w));
  }
  for(const id in seenArc)if(seenArc[id].done)arcR++;
  endFire+=(S.carousel||[]).length;
  for(const t of S.teams)wins.push(rec(t.id).w);
  chk('summary',()=>summaryView());
  console.log('season',S.season,'fired at end',(S.carousel||[]).length,'arcs seen',Object.keys(seenArc).length,'arcs field',JSON.stringify(S.arcs||null).length,'save',JSON.stringify(S).length);
  act('pport',{i:'0'});act('pstay',{});act('next',{});
}
const srt=o=>Object.entries(o).sort((a,b)=>b[1]-a[1]);
console.log('TAGS per season:',srt(tot).map(([k,v])=>k+' '+(v/NSEAS).toFixed(1)).join(', '));
console.log('distinct title shapes',Object.keys(types).length,'| items/season',(allN/NSEAS).toFixed(0),'| weeks with <5 items',thin+'/'+weeks);
if(NSAMP<0){console.log(srt(types).map(([k,v])=>(v/NSEAS).toFixed(1)+'  '+k).join('\\n'))}
console.log('arcs started/season',(arcS/NSEAS).toFixed(1),'resolved/season',(arcR/NSEAS).toFixed(1),JSON.stringify(arcTypes),'choices',choices);
console.log('coach turnover/season: midseason',(midFire/NSEAS).toFixed(1),'end',(endFire/NSEAS).toFixed(1));
const mean=wins.reduce((a,b)=>a+b,0)/wins.length,sd=Math.sqrt(wins.reduce((a,b)=>a+(b-mean)**2,0)/wins.length);
console.log('wins mean',mean.toFixed(2),'sd',sd.toFixed(2),'max',Math.max(...wins),'min',Math.min(...wins));
console.log('dup titles in-season',dupT,'('+(100*dupT/allN).toFixed(1)+'%) dup body sentences',dupB,'bad text',bad);
if(NSAMP>0){const r=srng(7),pool=sample.filter(n=>n.st||NSAMP>900);const pk=[];const used={};for(let i=0;i<5000&&pk.length<NSAMP&&pool.length;i++){const n=pool[Math.floor(r()*pool.length)];const key=n.tag+norm(n.title).slice(0,14);if(used[key])continue;used[key]=1;pk.push(n)}
  for(const n of pk)console.log('['+n.tag+'] '+n.title+'\\n    '+n.body)}
console.log(errs.slice(0,8).join('\\n')||'no errors');console.log('errs',errs.length+bad);
`);
