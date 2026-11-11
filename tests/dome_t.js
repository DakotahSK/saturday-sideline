require('./stub.js');
const fs=require('fs');
eval(fs.readFileSync('t.js','utf8')+`
let bad=0;const fail=m=>{bad++;console.log('FAIL',m)};
act('pick',{id:'22'});
/* every team has a valid stadium variant */
for(const t of S.teams){const V=stadiumOf(t);
  if(!STYPES.includes(V.type)||!REGS.includes(V.region)||!(V.cap>=.2&&V.cap<=1)||!['towers','poles','rim','roof'].includes(V.light)||!['tall','wide','jumbo','ribbon'].includes(V.board)||!(V.rows>=5&&V.n>1))fail('variant '+t.abbr+' '+JSON.stringify(V));
  if(V.dome!==DOMED.has(t.abbr))fail('dome flag '+t.abbr)}
const types=new Set(S.teams.map(t=>stadiumOf(t).type));if(types.size<4)fail('too few types '+[...types]);
/* domed teams never get weather, even from a cached env or a mid-season roll */
let n=0;
for(const t of S.teams.filter(t=>teamDome(t.id)))for(let wk=0;wk<14;wk++){
  const g={wk,h:t.id,a:S.teams[(t.id+3)%S.teams.length].id,done:false};
  S.games.push(g);const e=gameEnv(g);if(!e.dome||e.weather!=='clear')fail('dome weather '+t.abbr+' '+e.weather);
  g.env={night:true,weather:'snow',theme:null,dome:false};const e2=gameEnv(g);if(!e2.dome||e2.weather!=='clear')fail('cached env '+t.abbr);n++;S.games.pop()}
S.teams[0].dome=false;if(teamDome(0))fail('override off');S.teams[5].dome=true;if(!teamDome(5))fail('override on');delete S.teams[0].dome;delete S.teams[5].dome;
/* a game resumed mid-intro does not throw (SC.ext is not set yet) */
const ctx=document.getElementById('fieldc').getContext('2d');
for(const tid of [S.teams.find(t=>t.abbr==='SYR').id,S.userId])for(const tt of [1,4,7,9,10.5,12]){
  const g=S.games.find(x=>!x.done);g.h=tid;g.a=(tid+1)%S.teams.length;delete g.env;
  startWatch(g);G.intro.t=tt;SC.ext=undefined;SC.ip=null;SC.ctx=ctx;SC.W=390;SC.H=400;SC.dpr=1;
  try{update(.016);draw()}catch(e){fail('resume t='+tt+' '+e.stack.split('\\n').slice(0,2).join(' '))}
  const P=introPlan();if(P.EX<8||P.EX>12)fail('intro length '+P.EX)}
console.log('dome_t checked',n,'errs',bad);
`);
