require('./stub.js');
const fs=require('fs');
eval(fs.readFileSync('t.js','utf8')+`
let bad=0;const fail=m=>{bad++;console.log('FAIL',m)};
act('pick',{id:'22'});
const FIN={};
const repeats={tot:0,rep:0,games:0,lines:0};
const drain=seen=>{const F=SC.fc;if(!F)return;for(const m of F.qu)if(m.s!=='n')seen.push(m.tx);F.msgs.length=0;F.qu.length=0};
/* run the current G to the end one play at a time, feeding the chat like the dock does */
function runGame(label){
  const seen=[];let half=0,i=0,lastQ=G.q;
  while(G.phase!=='over'&&i++<3000){
    autoStep();
    try{fcSync()}catch(e){fail(label+' fcSync threw '+e)}
    drain(seen);
    if(G.phase==='half'&&!half){half=1;
      try{htMaybe()}catch(e){fail(label+' htMaybe threw '+e)}
      let cards;try{cards=htCards()}catch(e){fail(label+' htCards threw '+e);cards=[]}
      if(cards.length<2||cards.length>6)fail(label+' card count '+cards.length);
      if(/undefined|NaN|\\[object/.test(cards.map(c=>c.t+c.h).join('')))fail(label+' bad card text');
      /* league scores must match the ticker and tickState(g,.5) */
      const hg=htGames(),T=tickItems(),f=T?T.f:null;let checked=0;
      for(const x of hg){const q=tickState(x.g,.5);if(x.st.h!==q.h||x.st.a!==q.a)fail(label+' htGames not tickState .5');
        const it=T&&T.items.find(y=>y.g===x.g);if(it){checked++;const tk=tickState(x.g,T.f);if(it.st.h!==tk.h||it.st.a!==tk.a)fail(label+' ticker item differs from tickState');
          if(Math.abs(T.f-.5)<.02&&(it.st.h!==x.st.h||it.st.a!==x.st.a))fail(label+' ticker and halftime disagree at f='+T.f)}}
      if(hg.length&&!checked)fail(label+' no halftime game found in ticker');
      for(const x of hg)if(x.st.h>x.g.pre.hs||x.st.a>x.g.pre.as)fail(label+' halftime score above final');
      console.log(label,'halftime cards',cards.length,'league games',hg.length,'ticker frac',f,'matched',checked);
      for(const x of hg)FIN[S.games.indexOf(x.g)]=[x.g.pre.hs,x.g.pre.as,tickState(x.g,1).h,tickState(x.g,1).a];
      SC.ht=null;
    }
    if(G.phase==='half'&&i>2000)fail(label+' stalled at half');
  }
  if(G.phase!=='over')fail(label+' never finished (phase '+G.phase+')');
  if(!half)fail(label+' never reached halftime');
  return seen;
}
function tally(seen){const c={};let rep=0;for(const t of seen){if(c[t])rep++;c[t]=1}repeats.tot+=seen.length;repeats.rep+=rep;repeats.games++}
/* user game */
const ug=userGame(S.week);act('play',{});
const gi=G.gid;tally(runGame('user'));
const pre=S.games[gi].pre;act('finish',{});
for(let k=0;k<3&&S.view==='presser';k++)act('press',{i:'0'});
/* watched games over a few weeks */
for(let w=0;w<3&&S.week<12;w++){
  const cand=S.games.filter(g=>g.wk===S.week&&!g.done&&g.h!==S.userId&&g.a!==S.userId);
  if(cand.length){const g=cand[0],idx=S.games.indexOf(g);act('watch',{g:String(idx)});G.auto=false;tally(runGame('watch'+w));
    const fh=G.su,fa=G.sc;act('wfinish',{});const gg=S.games[idx];if(!gg.done)fail('watched game not done');}
  if(userGame(S.week)){act('play',{});tally(runGame('user'+w));act('finish',{})}else act('advance',{});
  for(let k=0;k<3&&S.view==='presser';k++)act('press',{i:'0'});
}
let fm=0,fn=0;for(const k in FIN){const g=S.games[k];if(g.done){fn++;const F=FIN[k];if(g.hs!==F[0]||g.as!==F[1]||F[2]!==F[0]||F[3]!==F[1])fm++}}
if(!fn||fm)fail('recorded finals vs pre-sim: checked '+fn+' mismatched '+fm);console.log('finals checked',fn,'mismatch',fm);
const rate=repeats.tot?100*repeats.rep/repeats.tot:0;
console.log('chat lines',repeats.tot,'games',repeats.games,'repeat rate '+rate.toFixed(1)+'%');
if(rate>=10)fail('repeat rate too high');
console.log('half_t errs',bad);
if(bad)throw new Error('half_t failed');
`);
