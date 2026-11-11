require('./stub.js');
eval(require('fs').readFileSync('t.js','utf8')+`
S=JSON.parse(require('fs').readFileSync('cur_save.json','utf8'));G=S.game||null;
const old=(S.pollHist&&S.pollHist.season===S.season)?JSON.parse(JSON.stringify(S.pollHist.w)):{};
applyCareerGlobals();
console.log('season',S.season,'week',S.week,'lastDone',lastWeekDone());
const pre=(S.preRank||[]).slice(0,PN),p=poll().slice(0,PN),ol=old[0]||[];
const res=id=>{const g=S.games.find(x=>x.done&&x.wk===0&&(x.h===id||x.a===id));if(!g)return 'bye';const my=g.h===id?g.hs:g.as,th=g.h===id?g.as:g.hs;return (my>th?'W ':'L ')+my+'-'+th+' vs '+team(g.h===id?g.a:g.h).abbr};
for(let i=0;i<PN;i++)console.log(String(i+1).padStart(2),'pre',team(pre[i]).abbr.padEnd(4),'| old',(ol[i]!=null?team(ol[i]).abbr:'').padEnd(4),'| NEW',team(p[i]).abbr.padEnd(4),res(p[i]),'(pre #'+(S.preRank.indexOf(p[i])+1)+')');
const out=pre.filter(id=>!p.includes(id));console.log('dropped out:',out.map(id=>team(id).abbr+' '+res(id)).join(', '));
console.log('stamp updated',JSON.stringify(S.pollHist.w[0])===JSON.stringify(p));
`);
