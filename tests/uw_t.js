require('./stub.js');
eval(require('fs').readFileSync('t.js','utf8')+`
act('pick',{id:'22'});
for(let gm=0;gm<3;gm++){
  while(!userGame(S.week)){act('advance',{})}
  const g=userGame(S.week),wk=S.week;act('uwatch',{});console.log('watching mine',G.watch,G.mine,'ctrl has takeover',controls().includes('takeover'));
  G.auto=false;let i=0,fr=0;
  while(G.phase!=='over'&&i++<4000){
    if(gm===1&&i===60){act('takeover',{});console.log(' took over at',G.q,G.phase,'watch',G.watch);}
    if(SC.A){const A=SC.A;let j=0;while(SC.A===A&&j++<3000){if(A.await&&A.t>.6)act('throw',{i:'0'});update(1/30);draw();fr++}continue}
    if(G.watch){watchStep();if(G&&G.phase==='ckick')render();continue}
    if(G.phase==='coin'){act('in',{a:'receive'});continue}
    if(G.phase==='half'){act('in',{a:'air'});continue}
    if(G.phase==='pat'){act('in',{a:'xp'});continue}
    if(G.phase==='ckick'){render();continue}
    if(G.phase==='off'){const k=G.sug||'iz';if(k==='fg'){act('call',{k:'fg'});act('tap',{});continue}if(k==='punt'||k==='kneel'||k==='spike'){act('call',{k});continue}act('call',{k});act('snap',{});continue}
    if(G.phase==='def'){if(!PB[G.pend]){act('dcall',{k:'c3'});continue}G.dsel='c3';startPlay(buildPlay('c',G.pend,G.dsel),false);continue}
  }
  const ctl=controls();console.log(' final',G.su+'-'+G.sc,'postgame button',ctl.includes('data-act="finish"'),'frames',fr);
  act('finish',{});console.log(' result saved',g.done,g.hs+'-'+g.as,'view',S.view,'week now',S.week,'stats',JSON.stringify(g.ust&&g.ust.qb));
  for(let k=0;k<3&&S.view==='presser';k++)act('press',{i:'0'});
}
`);
