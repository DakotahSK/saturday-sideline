require('./stub.js');
eval(require('fs').readFileSync('t.js','utf8')+`
act('pick',{id:'4'});while(!userGame(S.week))act('advance',{});act('play',{});
const out={};let n=0;
for(const pk of PASSES){if(pk==='hail')continue;const c={};for(let k=0;k<120;k++){G.phase='off';G.poss='u';G.ball=35;G.down=1+k%3;G.togo=[10,6,3][k%3];G.bx=MID;
  const dc=pick(Object.keys(DC));const P=buildPlay('u',pk,dc);const a=autoThrow(P,1.6);let key=a.sack?'sack':a.scr?'scr':a.away?'away':P.recv[a.i].rk;c[key]=(c[key]||0)+1}
  out[pk]=Object.entries(c).sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+':'+v).join(' ')}
for(const k in out)console.log(k.padEnd(9),out[k]);
`);
