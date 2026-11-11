require('./stub.js');
eval(require('fs').readFileSync('t.js','utf8')+`
S=JSON.parse(require('fs').readFileSync('cur_save.json','utf8'));G=S.game||null;applyCareerGlobals();
const r=S.teams.filter(t=>t.id!==S.userId).map(t=>[coachRt(t),t.name,t.coach.name,(t.past||[]).slice(-3).map(x=>x.w+'-'+x.l).join(' ')]).sort((a,b)=>b[0]-a[0]);
console.log(r.slice(0,6).map(x=>x.join(' | ')).join('\\n'));console.log('...');console.log(r.slice(-4).map(x=>x.join(' | ')).join('\\n'));
S.tab='league';leagueTab();console.log('league ok');
`);
