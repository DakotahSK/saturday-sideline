require('./stub.js');
eval(require('fs').readFileSync('t.js','utf8')+`
const store={};let writes=0;
CLOUD.db={doc:p=>({get:async()=>({exists:p in store,data:()=>store[p]}),set:async v=>{const sz=JSON.stringify(v).length;if(sz>262144)throw new Error('too big '+sz);writes++;store[p]=JSON.parse(JSON.stringify(v))}})};CLOUD.uid='u';
(async()=>{
  const big='gz:'+'x'.repeat(600000);
  await writeSplit('career',big,{ts:1});console.log('parts',store['data/users/u/career'].parts,store['data/users/u/career'].gen);
  console.log('roundtrip',(await docJson('career',store['data/users/u/career']))===big);
  await writeSplit('career',big+'y',{ts:2});console.log('gen2',store['data/users/u/career'].gen,(await docJson('career',store['data/users/u/career']))===big+'y');
  await cloudSnap('snap1',store['data/users/u/career']);console.log('snap',(await docJson('snap1',store['data/users/u/snap1']))===big+'y');
  await writeSplit('career','gz:small',{ts:3});console.log('small',store['data/users/u/career'].json,!!store['data/users/u/career'].parts);
  // full push of a real career, oversized via padding history
  act('pick',{id:'4'});for(const t of S.teams){t.past=t.past||[];for(let i=0;i<3000;i++)t.past.push({s:i,w:i%12,l:12-i%12,rk:99,coach:'Coach '+Math.random().toString(36).slice(2,9)})}
  S._ts=Date.now();CLOUD.ready=true;CLOUD.cts=0;const pastLen=S.teams[0].past.length;
  await cloudPush();const d=store['data/users/u/career'];console.log('push state',CLOUD.state,'parts',d.parts,'past kept',S.teams[0].past.length===pastLen);
  const back=JSON.parse(await zunpack(await docJson('career',d)));console.log('reload past',back.teams[0].past.length);
})();
`);
