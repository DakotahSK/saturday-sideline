// Balance snapshot: sims watch games through autoStep and prints league-wide rates. Compare before/after engine changes.
require('./stub.js');
eval(require('fs').readFileSync('t.js','utf8')+`
act('pick',{id:'4'});
const N=+(process.argv[2]||240);
const c={games:0,pts:0,plays:0,att:0,cmp:0,pyds:0,int:0,sack:0,fum:0,car:0,ryds:0,scr:0,errs:0,calls:{},dcalls:{}};
const aR=applyResult;applyResult=function(side,pk,dc,r){
  if(PB[pk]){c.plays++;c.calls[pk]=(c.calls[pk]||0)+1;if(dc)c.dcalls[dc]=(c.dcalls[dc]||0)+1;
    if(r.kind==='comp'){c.att++;c.cmp++;c.pyds+=r.yds}else if(r.kind==='inc'){c.att++}else if(r.kind==='int'){c.att++;c.int++}
    else if(r.kind==='sack'){c.sack++}else if(r.kind==='run'){c.car++;c.ryds+=r.yds}else if(r.kind==='scr'){c.scr++;c.car++;c.ryds+=r.yds}else if(r.kind==='fum')c.fum++}
  return aR(side,pk,dc,r)};
for(let n=0;n<N;n++){
  const gs=S.games.filter(g=>!g.done&&g.wk===S.week&&g.h!==S.userId&&g.a!==S.userId);if(!gs.length){act('advance',{});n--;if(S.view==='summary')break;continue}
  const g=gs[0];try{act('watch',{g:String(S.games.indexOf(g))});endIntro();G.auto=false;let i=0;
    while(G.phase!=='over'&&i++<3000)autoStep();
    c.games++;c.pts+=G.su+G.sc;S.view='hub';g.done=true;g.hs=G.su;g.as=G.sc;G=null;S.game=null;
  }catch(e){c.errs++;if(c.errs<3)console.log(e.stack.slice(0,400));S.view='hub';G=null;S.game=null;g.done=true;g.hs=1;g.as=0}
}
const db=c.att+c.sack+c.scr;
if(process.argv[3])console.log(JSON.stringify(c.calls),JSON.stringify(c.dcalls));
console.log('games '+c.games+' pts/g '+(c.pts/c.games).toFixed(1)+' plays/g '+(c.plays/c.games).toFixed(0)+' comp% '+(100*c.cmp/c.att).toFixed(1)+' yds/att '+(c.pyds/c.att).toFixed(2)+' int% '+(100*c.int/c.att).toFixed(2)+' sack% '+(100*c.sack/db).toFixed(2)+' scr% '+(100*c.scr/db).toFixed(2)+' ypc '+(c.ryds/c.car).toFixed(2)+' pass% '+(100*db/c.plays).toFixed(1)+' fum/g '+(c.fum/c.games).toFixed(2)+' errs '+c.errs);
`);
