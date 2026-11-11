require('./stub.js');
eval(require('fs').readFileSync('t.js','utf8')+`
act('pick',{id:'4'});
const cnt={games:0,spike:0,hail:0,onsideTry:0,onsideRec:0,to:0,kneel:0,q2pts:0,errs:0,oobComp:0,lastPlay:0,choice:0};
const oAI=offAI;offAI=function(s,a){const r=oAI(s,a);if(r==='hail')cnt.hail++;if(r==='spike')cnt.spike++;if(r==='kneel')cnt.kneel++;if(G.clock<=8&&(G.q===2||G.q===4))cnt.lastPlay++;return r};
for(let n=0;n<160;n++){
  const gs=S.games.filter(g=>!g.done&&g.wk===S.week&&g.h!==S.userId&&g.a!==S.userId);if(!gs.length){act('advance',{});n--;if(S.view==='summary')break;continue}
  const g=gs[0];try{act('watch',{g:String(S.games.indexOf(g))});endIntro();G.auto=false;let q2=null;let i=0;
    while(G.phase!=='over'&&i++<3000){if(G.q===2&&G.clock<=120&&q2==null)q2=G.su+G.sc;autoStep();}
    for(const l of G.log){if(/onside/i.test(l.t)){cnt.onsideTry++;if(/RECOVERS/.test(l.t))cnt.onsideRec++}if(/timeout/i.test(l.t))cnt.to++}
    cnt.games++;S.view='hub';g.done=true;g.hs=G.su;g.as=G.sc;G=null;S.game=null;
  }catch(e){cnt.errs++;if(cnt.errs<3)console.log(e.stack.slice(0,400));S.view='hub';G=null;S.game=null;g.done=true;g.hs=1;g.as=0}
}
console.log(JSON.stringify(cnt));
`);
