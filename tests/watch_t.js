require('./stub.js');
const fs=require('fs');
eval(fs.readFileSync('t.js','utf8')+`
act('pick',{id:'22'});
let guard=0;
while(S.week<13&&guard++<80){for(let k=0;k<3&&S.view==='presser';k++)act('press',{i:'0'});if(S.week>=13)break;if(userGame(S.week))act('sim',{});else act('advance',{})}
for(let k=0;k<3&&S.view==='presser';k++)act('press',{i:'0'});if(S.view==='selection')act('selclose',{});
S.tab='bracket';let h=hubView();console.log('bracket ok',!/undefined|NaN/.test(h.replace(/data-[a-z]+="[^"]*"/g,'')),'watch buttons',(h.match(/data-act="watch"/g)||[]).length);
let frames=0;
for(let wk=13;wk<=16&&S.view!=='summary';wk++){
  // watch one CPU game each week with animation, using every control once
  const cand=S.games.filter(g=>g.wk===S.week&&!g.done&&g.h!==S.userId&&g.a!==S.userId);
  if(cand.length){const g=cand[0];act('watch',{g:String(S.games.indexOf(g))});G.auto=false;let i=0;
    while(G.phase!=='over'&&i++<4000){
      if(SC.A){const A=SC.A;let j=0;while(SC.A===A&&j++<3000){update(1/30);draw();frames++}if(SC.A===A)throw 'stuck '+A.kind;continue}
      const r=R();if(i===40)act('wdrive',{});else if(i===80)act('wq',{});else watchStep();
      if(G&&G.phase==='ckick')render();
    }
    const gi=G.gid;const sc=G.su+'-'+G.sc;act('wfinish',{});const gg=S.games[gi];
    const X=boxFor(gg);console.log('wk',wk,'watched',team(gg.a).abbr,gg.as,'@',team(gg.h).abbr,gg.hs,'(live',sc,') seeds',seedN(gg.a),seedN(gg.h),'quarters ok',X.qH.reduce((a,b)=>a+b,0)===gg.hs&&X.qA.reduce((a,b)=>a+b,0)===gg.as,'view',S.view,S.tab);
  }
  if(userGame(S.week)){act('sim',{});for(let k=0;k<3&&S.view==='presser';k++)act('press',{i:'0'})}
  else act('advance',{});
  for(let k=0;k<3&&S.view==='presser';k++)act('press',{i:'0'});
  S.tab='bracket';h=hubView();if(/undefined|NaN/.test(h.replace(/data-[a-z]+="[^"]*"/g,'')))console.log('BAD bracket html');
}
console.log('frames',frames,'final view',S.view,'champ',S.champs.natl!=null?team(S.champs.natl).abbr:null);
// seed check: every playoff game card shows seeds
const pg=S.games.filter(g=>g.po);let okSeed=pg.every(g=>seedTag(g,g.h)&&seedTag(g,g.a));console.log('playoff games',pg.length,'all show seeds',okSeed);
`);
