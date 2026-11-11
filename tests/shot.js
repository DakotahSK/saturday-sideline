// Usage: node tests/shot.js <out.png> [width] [height] "<js to eval after load>" [waitMs]
// Loads dist/preview.html with the real Season 6 career in localStorage, runs your JS, screenshots.
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
(async()=>{const [out='shots/out.png',w='430',h='900',js='',wait='1500']=process.argv.slice(2);
const b=await chromium.launch();const p=await b.newPage({viewport:{width:+w,height:+h}});
p.on('pageerror',e=>console.log('PAGEERR',e.message));p.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text().slice(0,300))});
const save=fs.readFileSync(path.join(__dirname,'../saves/career.json'),'utf8');
await p.addInitScript(s=>{try{if(!localStorage.getItem('saturday_sideline_v1'))localStorage.setItem('saturday_sideline_v1',s)}catch(e){}},save);
await p.goto('file://'+path.join(__dirname,'../dist/preview.html'));await p.waitForTimeout(1500);
if(js){try{const r=await p.evaluate(js);if(r!==undefined)console.log('RESULT',JSON.stringify(r).slice(0,2000))}catch(e){console.log('EVALERR',e.message.slice(0,500))}}
await p.waitForTimeout(+wait);await p.screenshot({path:out});await b.close();console.log('saved',out)})();
