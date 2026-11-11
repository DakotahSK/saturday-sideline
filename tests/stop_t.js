require('./stub.js');
const SRC=require('fs').readFileSync('t.js','utf8');
eval(SRC+`
act('pick',{id:'4'});
const ST={plays:0,stallPlays:0,stallEx:[],tackleFar:0,tackles:0,farEx:[],kicks:0,koAnims:0};
function inst(A){
  let last=null,stall=0,maxStall=0,tk=false;
  return ()=>{
    const car=A.kind==='play'?(A.carrier&&A.live?SC.pl[A.carrier]:null):(A.retSet?SC.pl[other(A.side)+'.FS']:null);
    if(!car)return;
    if(last){const sp=Math.hypot(car.x-last[0],car.y-last[1])*30;let nd=99;for(const k in SC.pl){const p=SC.pl[k];if(!p.vis||p.team===car.team)continue;nd=Math.min(nd,Math.hypot(p.x-car.x,p.y-car.y))}
      const before=A.t<A.endT-.05;
      if(before&&sp<1&&nd>3){stall++;maxStall=Math.max(maxStall,stall)}else stall=0;
      if(A.tackled&&!tk&&A.kind==='play'){tk=true;const r=A.res||{};if(['run','comp','scr'].includes(r.kind)&&!(car.y>=100)&&!r.oob){ST.tackles++;if(nd>3.5){ST.tackleFar++;if(ST.farEx.length<6)ST.farEx.push(r.kind+' yds '+r.yds+' nd '+nd.toFixed(1)+' brk '+A.brk)}}}
      if(A.kind==='kick'&&A.t>=A.endT&&!tk){tk=true;ST.kicks++;if(nd>3.5){ST.tackleFar++;if(ST.farEx.length<12)ST.farEx.push('KICK '+A.k.type+' nd '+nd.toFixed(1))}}
    }
    last=[car.x,car.y];A._ms=maxStall;
  }}
for(let gm=0;gm<5;gm++){
  while(!userGame(S.week))act('advance',{});
  act('play',{});let guard=0;
  while(G.phase!=='over'&&guard++<4000){
    if(SC.A){const A=SC.A,f=inst(A);let i=0;while(SC.A===A&&i++<2000){if(A.await&&A.t>.3+R()*2){const r=R();if(r<.85)act('throw',{i:String(ri(0,A.P.recv.length-1))});else act('scramble',{})}update(1/30);f()}
      if(A.kind==='play'){ST.plays++;if(A._ms>8){ST.stallPlays++;if(ST.stallEx.length<6)ST.stallEx.push((A.res&&A.res.kind)+' '+(A.P.pk)+' stall '+(A._ms/30).toFixed(2)+'s')}}else if(A.k&&A.k.type==='ko')ST.koAnims++;continue}
    if(G.phase==='coin'){act('in',{a:'receive'});continue}
    if(G.phase==='half'){act('in',{a:'air'});continue}
    if(G.phase==='kochoice'){act('in',{a:(R()<.5?'onside':'deep')});continue}
    if(G.phase==='pat'){act('in',{a:'xp'});continue}if(G.phase==='patk'||G.phase==='ckick'){render();if(!SC.A)throw 'no kick anim '+G.phase;continue}
    if(G.phase==='off'){const k=G.sug||'iz';if(k==='fg'){act('call',{k:'fg'});act('tap',{});continue}if(k==='punt'||k==='kneel'||k==='spike'){act('call',{k});continue}act('call',{k});act('snap',{});continue}
    if(G.phase==='def'){if(!PB[G.pend]){act('dcall',{k:'c3'});continue}G.dsel=pick(Object.keys(DC));startPlay(buildPlay('c',G.pend,G.dsel),false);continue}
    if(G.phase==='live'){render();continue}
    throw 'unknown phase '+G.phase;
  }
  act('finish',{});
}
console.log(JSON.stringify(ST,null,1));
`);
