require('./stub.js');
eval(require('fs').readFileSync('t.js','utf8')+`
act('pick',{id:'22'});while(!userGame(S.week))act('advance',{});act('play',{});
const pre=S.games.filter(g=>g.pre).map(g=>({gi:S.games.indexOf(g),hs:g.pre.hs,as:g.pre.as,sum:[g.pre.ev.filter(e=>e.s==='h').reduce((s,e)=>s+e.p,0),g.pre.ev.filter(e=>e.s==='a').reduce((s,e)=>s+e.p,0)]}));
console.log('pre games',pre.length,'plan sums ok',pre.every(x=>x.sum[0]===x.hs&&x.sum[1]===x.as),JSON.stringify(pre.slice(0,3)));
G.q=3;G.clock=100;console.log(tickerHTML().html.replace(/<[^>]+>/g,' ').replace(/\\s+/g,' ').slice(0,300));
{G.phase='off';const K0=[];for(let i=0;i<400;i++){G.clock-=1.5;if(G.clock<0){G.q++;G.clock=G.qlen}if(G.q>4)break;tickStep(.5);if(G.tk.cur&&K0[K0.length-1]!==G.tk.cur.lab+G.tk.cur.gi)K0.push(G.tk.cur.lab+G.tk.cur.gi)}console.log('pops',K0.length,K0.slice(0,8).join(' | '));console.log(tickerHTML().html.replace(/<[^>]+>/g,' ').replace(/\\s+/g,' ').slice(0,200))}
simToEnd();act('finish',{});for(let k=0;k<3&&S.view==='presser';k++)act('press',{i:'0'});act('advance',{});
console.log('finals match',pre.every(x=>{const g=S.games[x.gi];return g.done&&g.hs===x.hs&&g.as===x.as}));
`);
