require('./stub.js');
eval(require('fs').readFileSync('t.js','utf8')+`
act('pick',{id:'4'});while(!userGame(S.week))act('advance',{});act('play',{});
function test(pk,slot){const out={n:0,comp:0,yds:0,loss:0,inc:0,int:0,sack:0,o:0,crowd:0};
for(const dc of Object.keys(DC))for(let k=0;k<40;k++){G.phase='off';G.poss='u';G.ball=35;G.down=1;G.togo=10;G.bx=MID;
  const P=buildPlay('u',pk,dc);const i=P.recv.findIndex(r=>r.slot===slot);if(i<0)continue;
  const tt=(RT[P.recv[i].rk].delay||0)+.35;if(tt>=P.ts){out.n++;out.sack++;continue}
  const r=throwRes(P,i,tt);out.n++;out.o+=openAt(P.recv[i],tt);out.crowd+=r.crowd||0;
  if(r.kind==='comp'){out.comp++;out.yds+=r.yds;if(r.yds<0)out.loss++}else if(r.kind==='int')out.int++;else out.inc++}
return pk+' '+slot+' n'+out.n+' comp%'+(100*out.comp/out.n).toFixed(0)+' avgY/att '+(out.yds/out.n).toFixed(1)+' loss'+out.loss+' int'+out.int+' sackish'+out.sack+' open'+(out.o/out.n).toFixed(2)+' crowd'+(out.crowd/out.n).toFixed(2)}
console.log(test('screen','RB'));console.log(test('bubble','S'));console.log(test('slants','X'));
`);
