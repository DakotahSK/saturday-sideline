require('./stub.js');
eval(require('fs').readFileSync('t.js','utf8')+`
act('pick',{id:'22'});
const errs=[];const chk=(n,f)=>{try{const h=f();if(typeof h!=='string')throw 'not string';return h}catch(e){errs.push(n+': '+(e.stack||e).toString().slice(0,200));return ''}};
let gdc=0,recNews=0,themed=0,sd=0;
for(let season=0;season<2;season++){
  let guard=0;const B0=recBoard();for(const r of B0.list.slice(4,7))act('rtarget',{r:String(r.id)});
  while(S.view!=='summary'&&guard++<60){
    S.tab='week';chk('week',()=>weekTab());chk('week all',()=>weekTab('all'));chk('buzz',()=>weekTab('buzz'));chk('prog',()=>progTab());chk('prog all',()=>progTab('all'));chk('league all',()=>leagueTab('all'));chk('teams all',()=>schedTab('all'));for(const f of ['top','all','rk','c0','up']){S.lgF=f;for(const w of [null,S.week-1]){S.scWeek=w;chk('scores '+f,()=>scoresView(poll()))}}S.lgF=null;S.scWeek=null;for(const t of ['week','league','poll','stand','bracket','sched','prog']){S.tab=t;chk('hub '+t,()=>hubView())}S.tab='week';const gd=chk('gd',()=>gdCard());if(gd)gdc++;
    for(const g of S.games.filter(g=>g.wk===S.week)){if(gameEnv(g).theme)themed++;if(isSeniorDay(g))sd++}
    if(S.selPending){S.selPending=false}
    const ug=userGame(S.week);
    if(ug&&!ug.done){act('play',{});simToEnd();act('finish',{});for(let k=0;k<3&&S.view==='presser';k++)act('press',{i:'0'});}
    if(S.view==='summary')break;
    act('advance',{});for(let k=0;k<3&&S.view==='presser';k++)act('press',{i:'0'});
  }
  for(const k in S.news)for(const n of S.news[k]||[])if(n.tag==='Recruiting')recNews++;
  const s=chk('summary',()=>summaryView());
  console.log('targets',JSON.stringify(recBoard().targets),'mine signed',JSON.stringify((S.signed.mine||[]).map(x=>x.stars+'* '+x.pos)));console.log('season',S.season,'view',S.view,'signed',S.signed&&S.signed.list.length,'mine',S.signed&&S.signed.mine.length,'portal out',!!(S.portal&&S.portal.out),'book',S.book&&S.book.seasons.length,'hof',ringOfHonor().length,'heis fin',(S.summary.hfin||[]).length,'sumlen',s.length);
  act('pport',{i:'0'});act('pstay',{});
  act('next',{});
}
console.log('gameday cards',gdc,'recruit news',recNews,'themed',themed,'senior days',sd);
console.log('identities',JSON.stringify(S.teams.reduce((m,t)=>{const k=identOf(t.id).k;m[k]=(m[k]||0)+1;return m},{})));
console.log(errs.slice(0,8).join('\\n')||'no errors');
`);
