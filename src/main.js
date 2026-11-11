const $=s=>document.querySelector(s);
const R=Math.random, rnd=(a,b)=>a+R()*(b-a), ri=(a,b)=>Math.floor(rnd(a,b+1));
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const pick=a=>a[Math.floor(R()*a.length)];
const gauss=()=>{let u=0,v=0;while(!u)u=R();while(!v)v=R();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const wpick=w=>{let t=0;for(const k in w)t+=Math.max(0,w[k]);let x=R()*t;for(const k in w){x-=Math.max(0,w[k]);if(x<=0)return k}return Object.keys(w)[0]};
const ord=n=>['','1st','2nd','3rd','4th'][n]||n+'th';
function shade(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=amt<0?0:255,p=Math.abs(amt);r=Math.round((f-r)*p+r);g=Math.round((f-g)*p+g);b=Math.round((f-b)*p+b);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}

let CONFS=['Heartland','Seaboard','Frontier','Delta'],DIVS=null;
let PN=15;
const BASE=[
 ['Prairie State','PRA','Plowmen','#b9502f',0,90],['Illinois Valley','IVU','Rivermen','#2f5fae',0,84],['Northwoods','NWD','Lumberjacks','#2e7d4f',0,76],['Cornbelt A&M','CBA','Threshers','#b88a1c',0,72],
 ['Kaskaskia','KAS','Voyageurs','#7a3e9d',0,68],['Lake Erie Tech','LET','Gulls','#3f86b8',0,66],['Ironton','IRN','Smelters','#6e7480',0,62],['Fox River','FOX','Foxes','#cf6326',0,58],
 ['Tidewater','TID','Admirals','#283f86',1,89],['Gulfstream','GUL','Barracudas','#df7a35',1,83],['Bayport','BAY','Mariners','#1f708c',1,80],['Palmetto Coast','PAL','Herons','#2f9686',1,74],
 ['Savannah Bluff','SBL','Live Oaks','#587a2b',1,70],['Hatteras Tech','HAT','Keepers','#c03a3a',1,64],['Chesapeake','CHS','Watermen','#4a6fa5',1,60],['Outer Banks','OBX','Wreckers','#8a5a3c',1,56],
 ['Red Mesa','RMS','Raptors','#a9332d',2,87],['Cascade','CAS','Timberwolves','#2e7a59',2,82],['Front Range','FRR','Peaks','#5468bb',2,78],['Sawtooth','SAW','Wolves','#646b78',2,73],
 ['High Desert','HDS','Javelinas','#c46a2c',2,70],['Tetonia','TET','Elk','#3d5c8c',2,66],['Absaroka','ABS','Bison','#7a5230',2,63],['Bonneville','BON','Salt Kings','#a8933e',2,59],
 ['Magnolia A&M','MAG','Bulldogs','#6a3f9f',3,92],['Brazos Valley','BRZ','Stampede','#c25b1f',3,85],['Blue Ridge','BRS','Summit','#3a6ea5',3,77],['Teche','TCH','Crawdads','#b4302b',3,74],
 ['Ozark Tech','OZK','Hillmen','#8a2a4a',3,69],['Natchez Trace','NAT','Riverboats','#2c5d8a',3,65],['Cumberland Gap','CUM','Pioneers','#4b7a3a',3,61],['Sabine River','SAB','Mustangs','#9a7a2a',3,57]
];
const FIRST=['Jalen','Marcus','Tyler','Caden','Deshawn','Brooks','Isaiah','Cole','Malik','Trey','Hunter','Jaxon','Darius','Eli','Kamari','Luke','Rashad','Bryce','Andre','Wyatt','Tobias','Kendrick','Sawyer','Quinn','Micah','Zeke','Roman','Amari'];
const LAST=['Okafor','Hollis','Bradford','Reyes','Whitaker','Dunmore','Castillo','Pruitt','Abernathy','Monroe','Fairley','Kimbrough','Sato','Lindqvist','Barrow','Mercer','Ashby','Delacroix','Ruffin','Strand','Ocampo','Vance','Beaudry','Tillman','Greer','Achebe','Holloway','Pettaway'];
const BOWLS=['Gateway Bowl','Harvest Bowl','Bluegrass Bowl','Lone Star Bowl','Great Lakes Bowl','Frontier Bowl'];
const STYLE={run:'Run-first',pass:'Air raid',bal:'Balanced'};
const HALF={air:['Open it up','+3 on every pass play'],ground:['Pound the rock','+3 on every run play'],lock:['Tighten up','+3 on defense']};

/* ---------- field + playbook data ---------- */
const FW=53.33, MID=26.67, HASHL=20, HASHR=33.33;
const OLN=['LT','LG','C','RG','RT'], OLX=[-4.4,-2.2,0,2.2,4.4];
const DSLOTS=['DE1','DT1','DT2','DE2','LB1','LB2','LB3','CB1','CB2','FS','SS'];
const FORMS={
 gun:{n:'Shotgun',qb:-5,sl:{RB:[-2,-5],X:'L',S:[-10,-.95],TE:[6.6,-.95],Z:'R'}},
 single:{n:'Singleback',qb:-1.3,sl:{RB:[0,-6.5],X:'L',S:[-10,-.95],TE:[6.6,-.95],Z:'R'}},
 iform:{n:'I-Form',qb:-1.3,sl:{FB:[0,-4],RB:[0,-7],X:'L',TE:[6.6,-.95],Z:'R'}},
 pistol:{n:'Pistol',qb:-4,sl:{RB:[0,-7],X:'L',S:[-10,-.95],TE:[6.6,-.95],Z:'R'}},
 empty:{n:'Empty',qb:-5,sl:{X:'L',S:[-10,-.95],RB:[6.6,-.95],S2:[11,-.95],Z:'R'}}
};
const PB={
 iz:{n:'Inside Zone',cat:'run',f:'single',d:'Downhill between the tackles. Steady.',run:{m:3.6,sd:3,big:.05,loss:.06,hole:1.5,c:'RB'},vs:{goal:-1,prev:1,c2:.5,c0:-.5}},
 power:{n:'Power O',cat:'run',f:'iform',d:'Guard pulls and leads. Built for short yardage.',run:{m:3.4,sd:3.2,big:.05,loss:.05,hole:3.2,c:'RB',sy:1},vs:{c2:.8,c4:.5,goal:-.6}},
 counter:{n:'Counter',cat:'run',f:'pistol',d:'Fake one way, hit the other. Punishes blitzes.',run:{m:3.5,sd:4.6,big:.08,loss:.09,hole:3.5,c:'RB',fake:1},vs:{c0:2.5,fire:2,c1:1,goal:-1}},
 stretch:{n:'Outside Stretch',cat:'run',f:'single',d:'Race to the edge. Boom or bust.',run:{m:3.4,sd:5.5,big:.09,loss:.12,hole:9,c:'RB',edge:1},vs:{c4:1,c3:.5,goal:-1.5,c0:-1.5,fire:-1}},
 option:{n:'Read Option',cat:'run',f:'gun',d:'QB reads the end, then keeps or hands off. Kills man coverage.',run:{m:3.6,sd:5,big:.07,loss:.08,hole:2,c:'RB'},vs:{c1:2,c0:2.5,goal:-1,c2:.5}},
 draw:{n:'HB Draw',cat:'run',f:'gun',d:'Show pass, then hand it off. Gashes blitzes and soft zones.',run:{m:2.7,sd:4.6,big:.07,loss:.08,hole:0,c:'RB',delay:1},vs:{c0:3.5,fire:3,prev:3.5,c4:1.2,c3:.6,goal:-2.5,c1:.3}},
 jet:{n:'Jet Sweep',cat:'run',f:'gun',d:'Slot in full motion around the edge. Beats a stacked box.',run:{m:3.7,sd:6,big:.1,loss:.13,hole:14,c:'S',edge:1},vs:{goal:2,c2:-1,c0:-1,prev:1.5}},
 sneak:{n:'QB Sneak',cat:'run',f:'iform',d:'Push the pile for a yard.',run:{m:1.6,sd:1.1,big:0,loss:.03,hole:0,c:'QB'},vs:{goal:-.5}},
 slants:{n:'Quick Slants',cat:'pass',f:'gun',d:'Ball out in a blink. The answer to the blitz.',drop:'quick',routes:{X:'slant',Z:'slant',S:'flat'}},
 stick:{n:'Y-Stick',cat:'pass',f:'single',d:'Tight end sits at six, slot to the flat. Third-and-short money.',drop:'quick',routes:{X:'go',Z:'go',S:'flat',TE:'hitch'}},
 screen:{n:'HB Screen',cat:'pass',f:'gun',d:'Let the rush in, dump it to the back behind blockers.',drop:'screen',routes:{X:'go',Z:'go',S:'hitch',RB:'screen'}},
 mesh:{n:'Mesh',cat:'pass',f:'gun',d:'Two crossers rub past each other. Torches man coverage.',drop:'normal',routes:{X:'post',S:'drag',TE:'cross',Z:'curl',RB:'checkdown'}},
 curlflat:{n:'Curl Flats',cat:'pass',f:'single',d:'Curls outside, flats underneath. Beats Cover 3.',drop:'normal',routes:{X:'curl',Z:'curl',S:'flat',TE:'seam'}},
 smash:{n:'Smash',cat:'pass',f:'gun',d:'Corner route over a hitch. Beats Cover 2.',drop:'normal',routes:{X:'hitch',S:'corner',Z:'hitch',TE:'corner',RB:'flat'}},
 sail:{n:'Sail',cat:'pass',f:'gun',d:'Go, out and flat to one side. Stretches zones.',drop:'normal',routes:{X:'go',S:'out',RB:'flat',Z:'curl',TE:'drag'}},
 boot:{n:'PA Boot',cat:'pass',f:'iform',d:'Fake the run, roll right. Better once the run is working.',drop:'boot',routes:{X:'dig',Z:'corner',TE:'flat'}},
 verts:{n:'Four Verticals',cat:'pass',f:'empty',d:'Everyone deep. Beats single-high safety looks.',drop:'deep',routes:{X:'go',S:'seam',S2:'seam',Z:'go',RB:'checkdown'}},
 pashot:{n:'PA Post Shot',cat:'pass',f:'single',d:'Sell the run, then take the top off.',drop:'pa',routes:{X:'post',Z:'dig',S:'go'}},
 toss:{n:'Toss Sweep',cat:'run',f:'iform',d:'Pitch it wide with the fullback leading. Gets outside a crashing defense.',run:{m:3.5,sd:5.2,big:.09,loss:.1,hole:10,c:'RB',edge:1},vs:{c4:1,c3:.6,c1:.4,goal:-1.2,c0:-1,fire:-.6}},
 trap:{n:'Trap',cat:'run',f:'single',d:'Let a tackle in free, then kick him out. Quick hitter up the gut.',run:{m:3.3,sd:3.6,big:.06,loss:.06,hole:1,c:'RB'},vs:{fire:2,c0:1.6,c1:.6,goal:-.8,c3:-.3}},
 qbdraw:{n:'QB Draw',cat:'run',f:'gun',d:'Quarterback shows pass, then takes off up the middle.',run:{m:3,sd:4.6,big:.07,loss:.07,hole:1,c:'QB',delay:1},vs:{c0:2.5,fire:2,prev:3,c4:1,c1:1.2,goal:-2}},
 dagger:{n:'Dagger',cat:'pass',f:'gun',d:'Slot clears the seam, outside receiver digs in behind it. Kills Cover 3.',drop:'normal',routes:{S:'seam',X:'dig',Z:'go',RB:'checkdown'}},
 bubble:{n:'WR Bubble Screen',cat:'pass',f:'gun',d:'Slot bubbles out behind blockers. Free yards against off coverage.',drop:'quick',routes:{S:'bubble',X:'go',Z:'slant',TE:'drag'}},
 wheel:{n:'RB Wheel',cat:'pass',f:'gun',d:'Back flares out, then turns it up the sideline. Linebackers hate it.',drop:'normal',routes:{RB:'wheel',X:'slant',S:'drag',Z:'curl'}},
 levels:{n:'Levels',cat:'pass',f:'single',d:'Shallow, dig and curl stacked at three depths. A read for every look.',drop:'normal',routes:{X:'dig',S:'drag',TE:'curl',Z:'go'}},
 ycross:{n:'Y-Cross',cat:'pass',f:'gun',d:'Tight end runs the deep crosser under a post. Great on third and long.',drop:'deep',routes:{TE:'cross',X:'post',Z:'curl',S:'flat',RB:'checkdown'}},
 fade:{n:'Back-Shoulder Fade',cat:'pass',f:'gun',d:'Throw it where only your guy can get it. A red zone weapon.',drop:'quick',routes:{X:'fade',Z:'fade',S:'slant'}},
 tunnel:{n:'WR Tunnel Screen',cat:'pass',f:'gun',d:'Outside receiver steps back and cuts inside behind a wall of linemen.',drop:'screen',routes:{X:'tunnel',S:'go',Z:'go',TE:'drag'}},
 shallow:{n:'Shallow Cross',cat:'pass',f:'gun',d:'Slot drags underneath with a dig over the top. Easy completions against man.',drop:'normal',routes:{S:'drag',X:'dig',Z:'go',TE:'curl',RB:'flat'}},
 sluggo:{n:'Sluggo',cat:'pass',f:'gun',d:'Sell the slant, then go. Punishes a jumpy corner.',drop:'deep',routes:{X:'sluggo',Z:'sluggo',S:'hitch',RB:'checkdown'}},
 hitchseam:{n:'Hitch Seam',cat:'pass',f:'single',d:'Hitches outside, seams up the hashes. Splits two-high safeties.',drop:'quick',routes:{X:'hitch',Z:'hitch',S:'seam',TE:'seam',RB:'flat'}},
 iso:{n:'Iso',cat:'run',f:'iform',d:'Fullback leads straight into the linebacker. Old-school downhill football.',run:{m:3.5,sd:3.3,big:.05,loss:.05,hole:1,c:'RB',sy:1},vs:{c2:.6,c4:.4,c0:-.3,goal:-.4}},
 hail:{n:'Hail Mary',cat:'pass',f:'empty',d:'Everyone to the end zone. Pray.',drop:'deep',routes:{X:'hail',S:'hail',S2:'hail',Z:'hail'}}
};
const RUNS=Object.keys(PB).filter(k=>PB[k].cat==='run'), PASSES=Object.keys(PB).filter(k=>PB[k].cat==='pass');
const RT={
 go:{w:[[0,5],[-.6,34]],c:'deepO'},
 seam:{w:[[0,34]],c:'deepI'},
 post:{w:[[0,11],[7,32]],c:'deepI'},
 corner:{w:[[0,10],[-8,22]],c:'deepO'},
 slant:{w:[[0,2],[8,8],[14,12]],c:'quick'},
 hitch:{w:[[0,6.5],[-.4,5.5]],c:'quick',stop:1},
 curl:{w:[[0,12],[.8,10.5]],c:'mid',stop:1},
 out:{w:[[0,11],[-8,11.5]],c:'mid'},
 dig:{w:[[0,12],[12,12.5],[24,13]],c:'mid'},
 cross:{w:[[0,5],[30,8]],c:'cross'},
 drag:{w:[[0,2],[28,3.5]],c:'cross'},
 flat:{w:[[-4,1.5],[-9,3],[-13,3.5]],c:'flat'},
 checkdown:{w:[[2.5,3.5],[3.5,5.5]],c:'flat',stop:1},
 screen:{w:[[-3,-1],[-6,-1.5]],c:'screen',delay:.85,stop:1},
 bubble:{w:[[-2,-1],[-5,-.6],[-8,1.4]],c:'flat',od:.2},
 wheel:{w:[[-5,1],[-8.5,5],[-9,30]],c:'deepO'},
 fade:{w:[[0,3],[-1.6,13],[-1.2,15]],c:'deepO',stop:1,od:-.13},
 hail:{w:[[0,4],[0,48]],c:'hail'},
 tunnel:{w:[[2,-1.2],[5,-1.6]],c:'screen',delay:.7,stop:1},
 sluggo:{w:[[0,3],[3.5,7],[2,32]],c:'deepO'}
};
const DC={
 c2:{n:'Cover 2',d:'Two deep halves. Squeezes the sidelines, soft in the seams.',run:.9,tp:3.0,rush:4},
 c3:{n:'Cover 3',d:'Three deep, four under. Sound against the run.',run:0,tp:3.1,rush:4},
 c4:{n:'Cover 4',d:'Quarters. Nothing gets behind you.',run:.6,tp:3.0,rush:4},
 c1:{n:'Cover 1 Man',d:'Press man, one safety deep. Tight on routes, weak to crossers.',run:-.2,tp:2.8,rush:5},
 c0:{n:'Cover 0 Blitz',d:'Send six. Sacks or a touchdown, little in between.',run:-.6,tp:1.9,rush:6},
 fire:{n:'Fire Zone',d:'Five-man zone blitz. Pressure without leaving it all open.',run:-.4,tp:2.3,rush:5},
 goal:{n:'Goal Line',d:'Eight in the box. Stops the run, prays against the pass.',run:-2.5,tp:2.6,rush:5},
 c2m:{n:'Cover 2 Man',d:'Man under, two safeties over the top. Smothers routes, soft to the run.',run:.5,tp:2.9,rush:4},
 tampa:{n:'Tampa 2',d:'Middle linebacker sprints to the deep middle. Closes the seam.',run:.6,tp:3.0,rush:4},
 prev:{n:'Prevent',d:'Rush three, drop eight. Gives up underneath, nothing deep.',run:2.5,tp:3.9,rush:3}
};
const COV={
 c2:{quick:-.04,flat:-.1,mid:.08,cross:.02,deepI:.14,deepO:-.1,screen:-.1,hail:-.05},
 c3:{quick:.07,flat:.1,mid:-.03,cross:.02,deepI:-.12,deepO:-.05,screen:0,hail:-.02},
 c4:{quick:.1,flat:.07,mid:.03,cross:.06,deepI:-.2,deepO:-.16,screen:.05,hail:-.05},
 c1:{quick:-.07,flat:0,mid:-.05,cross:.16,deepI:.04,deepO:.06,screen:-.05,hail:0},
 c0:{quick:-.08,flat:.06,mid:0,cross:.14,deepI:.2,deepO:.2,screen:.28,hail:.05},
 fire:{quick:-.12,flat:-.06,mid:.05,cross:0,deepI:.07,deepO:.05,screen:.14,hail:0},
 goal:{quick:.05,flat:.08,mid:.1,cross:.05,deepI:.24,deepO:.2,screen:.04,hail:.05},
 c2m:{quick:-.1,flat:.03,mid:-.07,cross:.06,deepI:-.04,deepO:-.1,screen:.02,hail:-.06},
 tampa:{quick:.02,flat:-.05,mid:.03,cross:-.02,deepI:-.12,deepO:-.08,screen:-.06,hail:-.06},
 prev:{quick:.14,flat:.15,mid:.08,cross:.06,deepI:-.34,deepO:-.34,screen:.05,hail:-.12}
};
const LOOK={c2:'Two deep safeties, corners pressed',c3:'One high safety, another rolled down',c4:'Two safeties at 11 yards, corners off',c1:'One high, corners pressed tight',c0:'No deep safety. Everyone crowding the line',fire:'Linebackers creeping up, one high',goal:'Eight in the box',prev:'Everyone 15 yards deep',c2m:'Two deep safeties, corners in press',tampa:'Two deep, middle linebacker cheating back'};
const NUMR={QB:[1,19],RB:[20,39],FB:[30,49],X:[1,19],Z:[1,19],S:[1,19],S2:[80,89],TE:[80,89],LT:[70,79],LG:[60,69],C:[50,59],RG:[60,69],RT:[70,79],K:[30,49],DE1:[90,99],DT1:[90,99],DT2:[90,99],DE2:[40,58],LB1:[30,59],LB2:[30,59],LB3:[30,59],CB1:[1,29],CB2:[1,29],FS:[1,29],SS:[1,29]};

let S=null, G=null, L=null, confirmReset=false;

function save(){if(S)S._ts=Date.now();try{localStorage.setItem('saturday_sideline_v1',JSON.stringify(S))}catch(e){}cloudQueue()}
function load(){try{const s=localStorage.getItem('saturday_sideline_v1');if(s){S=JSON.parse(s);G=S.game||null}}catch(e){S=null}}

function newLeague(){
  if(LS&&LS.use==='church'){const m=leagueMeta();CONFS=m.confs;DIVS=m.divs;return churchLeague()}
  CONFS=['Heartland','Seaboard','Frontier','Delta'];DIVS=null;
  return BASE.map((b,i)=>({id:i,name:b[0],abbr:b[1],mascot:b[2],color:b[3],conf:b[4],prestige:b[5],
    off:clamp(Math.round(b[5]+rnd(-6,6)),50,99),def:clamp(Math.round(b[5]+rnd(-6,6)),50,99),
    style:pick(['run','pass','bal','bal']),cc:false}));
}
const team=id=>S.teams[id];
const U=()=>team(S.userId);
const fullName=()=>pick(FIRST)+' '+pick(LAST);
const short=n=>{const p=n.split(' ');return p[0][0]+'. '+p.slice(1).join(' ')};
function genStars(pr){
  return ['QB','RB','WR'].map(pos=>({pos,name:fullName(),yr:ri(1,3),num:pos==='RB'?ri(20,39):ri(1,19),ovr:clamp(Math.round(pr-4+rnd(-5,7)),60,97),s:blankStat(pos)}));
}
function blankStat(pos){return pos==='QB'?{att:0,cmp:0,yds:0,td:0,int:0}:pos==='RB'?{car:0,yds:0,td:0}:{rec:0,yds:0,td:0}}
const YR=['','FR','SO','JR','SR'];

/* ---------- schedule ---------- */
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
/* ---------- league expansion: 16 new programs, 12-team conferences ---------- */
// [name, abbr, mascot, color, color2, city, conf, div]
const EXP_TEAMS=[
 ['Ellicott Baptist','ELL','Elk','#2f5d3a','#efe6cf','Ellicott, CO',0,1],['First Baptist Englewood','FBE','Miners','#1f2f4f','#c27b3e','Englewood, CO',0,1],
 ['Grand Island Baptist','GIB','Islanders','#1d3a6b','#7cc0ea','Grand Island, NE',0,0],['Shawnee Baptist','SHW','Bison','#5a3b22','#e0b03a','Shawnee, KS',0,0],
 ['Grace Baptist','GRC','Lancers','#2348a8','#c9ced6','Moore, OK',1,0],['Calvary Edmond','CVE','Sentinels','#18284a','#ee7a24','Edmond, OK',1,0],
 ['Houston Baptist','HOU','Comets','#127a80','#f08a24','Houston, TX',1,1],['Chickasha Baptist','CHK','Bears','#bf5a1a','#ffffff','Chickasha, OK',1,1],
 ['South Campbell Avenue','SCA','Rangers','#2c5a34','#cdb68a','Springfield, MO',2,0],['Columbia Baptist','COL','Tigers','#16161a','#c9a033','Columbia, MO',2,0],
 ['Akron Baptist','AKR','Pioneers','#b3242c','#16161a','Akron, IA',2,1],['Brookings Baptist','BRK','Jackrabbits','#b0612b','#2f6b3a','Brookings, SD',2,1],
 ['Union Baptist','UNI','Royals','#4b2a83','#e0b33a','Queens, NY',3,1],['New Manna Baptist','NMB','Ravens','#127a7a','#111418','New Jersey',3,1],
 ['Victory Baptist','VIC','Archers','#b51f2e','#c4c9d0','St. Louis, MO',3,0],['Riverside Baptist','RSB','Express','#c0262f','#1d2d55','St. Joseph, MO',3,0]
];
// new main rivalries by abbreviation
const EXP_RIV=[['ELL','FBE','The Front Range Bell'],['GIB','SHW','The Prairie Wagon'],['GRC','CVE','The Red Earth Cup'],['EBC','HAL','The Chisholm Trail Trophy'],['HOU','CHK','The Lone Derrick'],['FBO','BAB','The Turnpike Trophy'],['SCA','COL','The Show-Me Shield'],['AKR','BRK','The Big Sioux Paddle'],['UNI','NMB','The Hudson Lantern'],['VIC','RSB','The Gateway Spur']];
const byAbbr=ab=>S.teams.find(t=>t.abbr===ab);
function expandQueue(){
  if(!S||!S.teams||S.lname!=='Church League'||S.teams.length!==32||S.expandQ||S.expanded!=null)return;
  if(!byAbbr('HAL')||!byAbbr('BAB'))return;
  S.expandQ={season:S.season+1};
}
function setPN(){PN=15}
function pollFix(){if(S.meritPoll&&S.pollHist&&S.pollHist.season===S.season&&S.pollV4!==S.season){const ks=Object.keys(S.pollHist.w||{}).map(Number).sort((a,b)=>a-b);if(ks.length&&ks[ks.length-1]===lastWeekDone()){RSC={k:null};PCC={k:null};S.pollHist.w[ks[ks.length-1]]=poll().slice(0,PN)}S.pollV4=S.season}
if(S.meritPoll&&S.pollHist&&S.pollHist.season===S.season&&S.pollFix1!==S.season){const ks=Object.keys(S.pollHist.w||{});if(ks.length){RSC={k:null};PCC={k:null};S.pollHist.w[ks[ks.length-1]]=poll().slice(0,PN)}S.pollFix1=S.season}}
function applyExpansion(){
  if(!S||!S.expandQ||S.season<S.expandQ.season||S.teams.length!==32)return false;
  const H=byAbbr('HAL'),B=byAbbr('BAB');
  if(H&&B){const c=H.conf,d=H.div;H.conf=B.conf;H.div=B.div;B.conf=c;B.div=d}
  const T=LS&&LS.tpl&&LS.tpl.teams&&LS.tpl.teams.length===32?LS.tpl:null;
  if(T&&H&&B){const th=T.teams[H.id],tb=T.teams[B.id];if(th&&tb){th.conf=H.conf;th.div=H.div;tb.conf=B.conf;tb.div=B.div}}
  for(const x of EXP_TEAMS){
    const id=S.teams.length,pr=ri(40,46);
    S.teams.push({id,name:x[0],abbr:x[1],mascot:x[2],color:x[3],color2:x[4],city:x[5],conf:x[6],div:x[7],prestige:pr,
      off:ri(50,55),def:ri(50,55),style:pick(['run','pass','bal','bal']),cc:false,born:S.season,
      hist:{tier:'startup',natl:0,ct:0,w:0,l:0,last:null},coach:{name:fullName(),heat:5,yrs:0,founder:true},star:newStar(),pr:{o:0,d:0},past:[]});
    if(T)T.teams.push({name:x[0],abbr:x[1],mascot:x[2],color:x[3],color2:x[4],city:x[5],conf:x[6],div:x[7],tier:'startup',natl:0,ct:0,w:0,l:0,last:null,born:S.season});
  }
  // Wheat Sheaf and Arrowhead become annual non-conference rivalries
  const toAnnual=list=>(list||[]).forEach(r=>{const ab=[team(r.a).abbr,team(r.b).abbr].sort().join('-');if(ab==='FBO-HAL'||ab==='BAB-EBC')r.type='annual'});
  toAnnual(S.rivals);toAnnual(S.rivalDefs);if(T)toAnnual(T.rivals);
  const defs=EXP_RIV.map(([a,b,tr])=>({a:byAbbr(a).id,b:byAbbr(b).id,trophy:tr,type:'main',fresh:true}));
  if(T)T.rivals.push(...defs.map(d=>({...d})));
  S.rivalDefs=(S.rivalDefs||[]).concat(defs.map(d=>({...d})));
  for(const d of defs)S.rivals.push({a:d.a,b:d.b,trophy:d.trophy,type:'main',sa:0,sb:0,holder:null,prev:null,last:null,base:{a:0,b:0,h:null},hist:[],arch:[],z0:true});
  if(T){try{saveLSQuiet()}catch(e){}}
  S.expanded=S.season;delete S.expandQ;setPN();S.newProg={};
  return true;
}
function freshRivals(){
  if(!S||!S.rivals)return;const defs=(S.rivalDefs||[]).filter(d=>d.fresh);
  for(const r of S.rivals){if(r.z0)continue;if(defs.some(d=>(d.a===r.a&&d.b===r.b)||(d.a===r.b&&d.b===r.a))&&!(r.hist||[]).length){r.sa=0;r.sb=0;r.holder=null;r.prev=null;r.last=null;r.base={a:0,b:0,h:null};r.hist=[];r.arch=[];r.z0=true}}
}
function expansionNews(){
  if(S.expanded!==S.season||!S.news)return;const nt=S.teams.filter(t=>t.born===S.season);
  S.news.pre=S.news.pre||[];
  S.news.pre.unshift({tag:'Expansion',score:70,team:nt[0].id,title:'The league grows to 48 teams',body:'Sixteen brand-new programs kick off their first season: '+nt.map(t=>t.name+' '+t.mascot).join(', ')+'. Every conference now has 12 teams in two divisions of six. Teams play their division every year plus three from the other side.'});
  const H=byAbbr('HAL'),B=byAbbr('BAB');
  if(H&&B)S.news.pre.splice(1,0,{tag:'Realignment',score:62,team:H.id,title:'Halstead and Broken Arrow trade places',body:H.name+' heads to the '+CONFS[H.conf]+' '+(S.divs?S.divs[H.conf][H.div]:'')+' division. '+B.name+' moves to the '+CONFS[B.conf]+' '+(S.divs?S.divs[B.conf][B.div]:'')+'. The Wheat Sheaf and the Arrowhead live on as annual non-conference games.'});
}
/* milestones for brand-new programs */
function newProgWeek(w){
  if(!S.teams.some(t=>t.born!=null))return;S.newProg=S.newProg||{};const p=poll(),k=String(w);
  const push=(t,title,body)=>{S.news[k]=S.news[k]||[];S.news[k].push({tag:'New program',score:34,team:t.id,title,body});try{post(t.id,pick(['History made. '+t.name+' will remember this one forever.','Year '+(S.season-t.born+1)+' and we are already making noise.','Told you. '+t.mascot+' football is here to stay.']),'fan')}catch(e){}};
  for(const g of S.games.filter(x=>x.wk===w&&x.done))for(const id of [g.h,g.a]){const t=team(id);if(t.born==null)continue;const won=winnerOf(g)===id,o=team(id===g.h?g.a:g.h),F=S.newProg[id]=S.newProg[id]||{};
    if(won&&!F.win){F.win=S.season;push(t,t.name+' gets the first win in program history','The '+t.mascot+' beat '+o.name+' '+Math.max(g.hs,g.as)+'-'+Math.min(g.hs,g.as)+'. Somebody frame that game ball.')}
    else if(won&&g.conf&&!F.cwin){F.cwin=S.season;push(t,'First conference win for '+t.name,'The '+t.mascot+' took down '+o.name+' for their first '+CONFS[t.conf]+' win ever.')}
    if(won&&!F.rwin&&(g.hr&&g.ar)&&(id===g.h?g.ar:g.hr)<=PN){F.rwin=S.season;push(t,t.name+' knocks off a ranked team for the first time','Nobody gave them a chance against No. '+(id===g.h?g.ar:g.hr)+' '+o.name+'. Program-defining win.')}}
  for(const t of S.teams){if(t.born==null)continue;const F=S.newProg[t.id]=S.newProg[t.id]||{};const r=p.indexOf(t.id)+1;if(r&&r<=PN&&!F.rank){F.rank=S.season;push(t,t.name+' is ranked for the first time','The '+t.mascot+' check in at No. '+r+'. Not bad for a program that did not exist '+(S.season-t.born+1)+' year'+(S.season-t.born?'s':'')+' ago.')}}
}
/* schedule for 12-team conferences with two divisions of six */
function buildSchedule12(){
  const games=[],played=new Set(),key=(a,b)=>a<b?a+'-'+b:b+'-'+a,yr=S.season||1;
  const rivPair=(a,b)=>(S.rivals||[]).some(r=>(r.a===a&&r.b===b)||(r.a===b&&r.b===a));
  const mainRiv=(a,b)=>(S.rivals||[]).some(r=>(r.type||'main')==='main'&&((r.a===a&&r.b===b)||(r.a===b&&r.b===a)));
  const add=(w,a,b,conf)=>{played.add(key(a,b));const h=R()<.5?a:b;games.push({wk:w,h,a:h===a?b:a,conf,done:false})};
  const rr6=ids=>{let best=null;for(let t=0;t<400;t++){const a=shuffle([...ids]),rounds=[];let arr=[...a];for(let r=0;r<5;r++){const rd=[];for(let i=0;i<3;i++)rd.push([arr[i],arr[5-i]]);rounds.push(rd);arr=[arr[0],arr[5],...arr.slice(1,5)]}
      const sc=rounds.map(rd=>rd.filter(([x,y])=>mainRiv(x,y)).length),mx=Math.max(...sc),need=ids.reduce((n,x)=>n+ids.filter(y=>y>x&&mainRiv(x,y)).length,0);
      if(!best||mx>best.mx){best={rounds,mx,ri:sc.indexOf(mx)}}if(mx>=need)break}
    const R2=[...best.rounds];const last=R2.splice(best.ri,1)[0];R2.push(last);return R2};
  for(let c=0;c<CONFS.length;c++){
    const D0=S.teams.filter(t=>t.conf===c&&t.div===0).map(t=>t.id),D1=S.teams.filter(t=>t.conf===c&&t.div===1).map(t=>t.id);
    if(D0.length!==6||D1.length!==6)continue;
    const r0=rr6(D0),r1=rr6(D1);
    // permanent cross-division partner: rivals first, then by prestige
    const perm=[],left1=[...D1];
    const o0=[...D0].sort((a,b)=>team(b).prestige-team(a).prestige);
    for(const a of o0){const k=left1.findIndex(b=>rivPair(a,b));if(k>=0)perm[D0.indexOf(a)]=left1.splice(k,1)[0]}
    const rest1=left1.sort((a,b)=>team(b).prestige-team(a).prestige);for(const a of o0)if(perm[D0.indexOf(a)]==null)perm[D0.indexOf(a)]=rest1.shift();
    const SH=[[1,2],[3,4],[5,1],[2,3],[4,5]][yr%5],cross=[0,...SH].map(s=>D0.map((a,i)=>[a,perm[(i+s)%6]]));
    const crossMain=cross[0].filter(([a,b])=>mainRiv(a,b)).length,divMain=r0[4].concat(r1[4]).filter(([a,b])=>mainRiv(a,b)).length;
    // 8 conference rounds in weeks 4..11; rivalry round lands in week 11
    let rounds=[...r0.slice(0,4).map((rd,i)=>rd.concat(r1[i])),cross[1],cross[2]];const permR=cross[0],divLast=r0[4].concat(r1[4]);
    const finalR=crossMain>divMain?permR:divLast,other=crossMain>divMain?divLast:permR;
    rounds=shuffle(rounds.concat([other]));rounds.push(finalR);
    rounds.forEach((rd,i)=>rd.forEach(([a,b])=>add(4+i,a,b,true)));
  }
  // non-conference: annual rivals first, then fill weeks 0..3
  const busy=[0,1,2,3].map(()=>new Set()),cnt={},ids=S.teams.map(t=>t.id);
  const ann=(S.rivals||[]).filter(r=>r.type==='annual'&&team(r.a).conf!==team(r.b).conf);
  for(const r of shuffle([...ann])){if((cnt[r.a]||0)>=4||(cnt[r.b]||0)>=4||played.has(key(r.a,r.b)))continue;
    const wks=shuffle([0,1,2,3]).filter(w=>!busy[w].has(r.a)&&!busy[w].has(r.b));if(!wks.length)continue;const w=wks[0];busy[w].add(r.a);busy[w].add(r.b);cnt[r.a]=(cnt[r.a]||0)+1;cnt[r.b]=(cnt[r.b]||0)+1;
    played.add(key(r.a,r.b));const h=yr%2?r.a:r.b;games.push({wk:w,h,a:h===r.a?r.b:r.a,conf:false,done:false})}
  const matchWeek=(list,relax)=>{const out=[],pool=[...list];while(pool.length){const a=pool.shift();const k=pool.findIndex(b=>relax||(team(b).conf!==team(a).conf&&!played.has(key(a,b))));if(k<0)return null;out.push([a,pool.splice(k,1)[0]])}return out};
  for(let w=0;w<4;w++){const free=ids.filter(id=>!busy[w].has(id));let pr=null;for(let t=0;t<400&&!pr;t++)pr=matchWeek(shuffle([...free]),false);if(!pr)pr=matchWeek(shuffle([...free]),true);for(const [a,b] of pr)add(w,a,b,false)}
  return balanceHA(games);
}
function buildSchedule(){
  if(S.teams.length>=48)return buildSchedule12();
  const games=[];
  const byConf=[0,1,2,3].map(c=>shuffle(S.teams.filter(t=>t.conf===c).map(t=>t.id)));
  const ids=S.teams.map(t=>t.id),busy=[0,1,2,3,4].map(()=>new Set()),played=new Set(),key=(a,b)=>a<b?a+'-'+b:b+'-'+a,cnt={};
  const ann=(S.rivals||[]).filter(r=>r.type==='annual'&&team(r.a).conf!==team(r.b).conf);
  for(const r of shuffle([...ann])){
    if((cnt[r.a]||0)>=5||(cnt[r.b]||0)>=5||played.has(key(r.a,r.b)))continue;
    const wks=shuffle([0,1,2,3,4]).filter(w=>!busy[w].has(r.a)&&!busy[w].has(r.b));if(!wks.length)continue;
    const w=wks[0];busy[w].add(r.a);busy[w].add(r.b);played.add(key(r.a,r.b));cnt[r.a]=(cnt[r.a]||0)+1;cnt[r.b]=(cnt[r.b]||0)+1;
    const h=(S.season||1)%2?r.a:r.b;games.push({wk:w,h,a:h===r.a?r.b:r.a,conf:false,done:false});
  }
  const matchWeek=(list,relax)=>{const out=[],pool=[...list];while(pool.length){const a=pool.shift();let k=pool.findIndex(b=>relax||(team(b).conf!==team(a).conf&&!played.has(key(a,b))));if(k<0)return null;out.push([a,pool.splice(k,1)[0]])}return out};
  for(let w=0;w<5;w++){
    const free=ids.filter(id=>!busy[w].has(id));let pr=null;
    for(let t=0;t<300&&!pr;t++)pr=matchWeek(shuffle([...free]),false);
    if(!pr)pr=matchWeek(shuffle([...free]),true);
    for(const [a,b] of pr){played.add(key(a,b));const h=R()<.5?a:b;games.push({wk:w,h,a:h===a?b:a,conf:false,done:false})}
  }
  const mains=(S.rivals||[]).filter(r=>(r.type||'main')==='main'),rv=mains.length===16,order=rv?[6,...shuffle([0,1,2,3,4,5])]:shuffle([0,1,2,3,4,5,6]);
  for(let c=0;c<4;c++){
    let arr=[...byConf[c]];
    if(rv){const pr=mains.filter(r=>team(r.a).conf===c);if(pr.length===4)arr=[pr[0].a,pr[1].a,pr[2].a,pr[3].a,pr[3].b,pr[2].b,pr[1].b,pr[0].b]}
    for(let r=0;r<7;r++){
      for(let i=0;i<4;i++){const A=arr[i],B=arr[7-i],h=(r+i)%2?A:B;games.push({wk:5+order[r],h,a:h===A?B:A,conf:true,done:false})}
      arr=[arr[0],arr[7],...arr.slice(1,7)];
    }
  }
  return balanceHA(games);
}

/* ---------- records & polls ---------- */
function recAt(id,g0){let w=0,l=0,cw=0,cl=0;for(const g of S.games){if(!g.done||(g.h!==id&&g.a!==id))continue;if(!(g===g0||g.wk<g0.wk))continue;const my=g.h===id?g.hs:g.as,ot=g.h===id?g.as:g.hs,win=my>ot;win?w++:l++;if(g.conf)win?cw++:cl++}return w+'-'+l+' ('+cw+'-'+cl+')'}
function rec(id){
  let w=0,l=0,cw=0,cl=0,pf=0,pa=0;
  for(const g of S.games){
    if(!g.done||(g.h!==id&&g.a!==id))continue;
    const my=g.h===id?g.hs:g.as, ot=g.h===id?g.as:g.hs, win=my>ot;
    win?w++:l++; pf+=my; pa+=ot;
    if(g.conf)win?cw++:cl++;
  }
  return {w,l,cw,cl,pf,pa};
}
function regRec(id){let w=0,l=0;for(const g of S.games){if(!g.done||g.wk>=12||(g.h!==id&&g.a!==id))continue;winnerOf(g)===id?w++:l++}return {w,l}}
/* ---------- merit poll: results only, with last season's finish as an early-season prior ---------- */
/* preseason hype: roster, reputation, last year's finish, the new class, returning star */
function hypeScores(){const N=S.teams.length,v={},D={};
  for(const t of S.teams){const x=(t.past||[]).slice(-1)[0],lr=x&&x.s===S.season-1?x.rk:null,o=(t.off+t.def)/2;
    const fin=lr&&lr<=25?(26-lr)*.9:0,cls=t.clsRank?(N-t.clsRank)/N*7:0,st=t.star&&t.star.yr>=2?2.5:0,me=t.id===S.userId?(S.stars||[]).filter(s=>s.yr>=3).length*1.2:0,np=t.born===S.season?-6:0;
    v[t.id]=o*1.2+t.prestige*.45+fin+cls+st+me+np;D[t.id]={qw:0,bl:0,sos:0,eye:0,prior:v[t.id],hype:{roster:o,prestige:t.prestige,last:lr,cls:t.clsRank||null}}}
  return {v,D};
}
function meritScores(){
  const done=S.games.filter(g=>g.done),N=S.teams.length;
  if(!done.length)return hypeScores();
  const prior={},q0={};
  for(const t of S.teams){const x=(t.past||[]).slice(-1)[0],lr=x&&x.s===S.season-1?x.rk:null;
    const pr=lr?clamp((N*.6-lr)*1.4,-20,30):-14;prior[t.id]=pr+(t.prestige-65)*.45;
    q0[t.id]=clamp(lr?1-lr/N:.25,.05,.95)*.6+clamp((t.prestige-45)/50,0,1)*.4}
  const RG={};for(const t of S.teams)RG[t.id]=regRec(t.id);
  const q=id=>{const r=RG[id],n=r.w+r.l,wp=(r.w+1.5)/(n+3),k=Math.min(1,n/5);return q0[id]*(1-k)+wp*k};
  const QV={};for(const t of S.teams)QV[t.id]=q(t.id);
  const useLine=lastWeekDone()<=1,WR={};for(const t of S.teams){const r=RG[t.id];WR[t.id]=(r.w+1.5)/(r.w+r.l+3)}
  const v={},D={};
  for(const t of S.teams){const id=t.id,r=rec(id),rg=RG[id],n=r.w+r.l,gs=done.filter(g=>g.h===id||g.a===id).sort((a,b)=>a.wk-b.wk);
    let s=rg.w*7.5-rg.l*10;for(const g of gs){if(g.wk<12)continue;s+=winnerOf(g)===id?7.5:(g.ccg!=null?-3:-6)}
    if(t.cc)s+=6;
    const pw=0;
    let qw=0,bl=0,sos=0,mg=0;
    for(const g of gs){const o=g.h===id?g.a:g.h,my=g.h===id?g.hs:g.as,th=g.h===id?g.as:g.hs,won=my>th,oq=QV[o];sos+=oq;const ex=useLine&&g.pl!=null?(g.h===id?g.pl:-g.pl):(WR[id]-WR[o])*40+(g.neutral?0:(g.h===id?2.5:-2.5));mg+=clamp((my-th)-ex,-17,17);
      if(won){if(oq>.55)qw+=(oq-.55)*28+(oq>=.72?2.5:0)}else if(oq<.45)bl+=(.45-oq)*30+(oq<.28?2:0)}
    let form=0;if(n){sos=(sos/n-.5)*36*Math.min(1,n/5);if(sos<0&&n<=3)sos*=.5;mg=mg/n*(n<=4?.45:.35);const last=gs.slice(-3);form=(last.filter(g=>winnerOf(g)===id).length-last.length/2)*1.2}
    {const m=rg.w+rg.l;if(m>=4&&rg.w<=rg.l)s-=16;if(m>=6&&rg.w<rg.l)s-=60}
    s+=qw-bl+sos+mg+form;v[id]=s;D[id]={qw,bl,sos,eye:mg+form,prior:prior[id]*pw};
  }
  return {v,D};
}
/* Poll score: talent and prestige, record, margin, plus resume (quality wins, bad losses, schedule strength) and the eye test (play vs the line, recent form). */
let RSC={k:null,v:null};
function rankScores(){
  const done=S.games.filter(g=>g.done),key=S.season+':'+done.length+':'+S.teams.filter(t=>t.cc).length+':'+(S.champs&&S.champs.natl)+':'+S.teams.reduce((a,t)=>a+t.off*3+t.def*7+t.prestige,0);
  if(RSC.k===key&&RSC.v)return RSC.v;
  if(S.meritPoll){const M=meritScores();
    const L=lastWeekDone(),wP=L<0?1:([.7,.6,.5,.35,.2][L]||0);
    if(L>=0&&wP>0){const H=hypeScores().v,z=o=>{const a=Object.values(o),m=a.reduce((s,x)=>s+x,0)/a.length,sd=Math.sqrt(a.reduce((s,x)=>s+(x-m)*(x-m),0)/a.length)||1,r={};for(const k in o)r[k]=(o[k]-m)/sd;return r},zh=z(H),zm=z(M.v);
      for(const k in M.v){M.v[k]=(wP*zh[k]+(1-wP)*zm[k])*20;if(M.D[k])M.D[k].prior=Math.round(wP*100)}}
    RSC={k:key,v:M.v,d:M.D};return M.v}
  const R2={},B={};
  for(const t of S.teams){const r=rec(t.id),rg=regRec(t.id);R2[t.id]=r;let pw=0;for(const g of done){if(g.wk<12||(g.h!==t.id&&g.a!==t.id))continue;const won=winnerOf(g)===t.id;pw+=won?7.5:(g.ccg!=null?-3:-6)}B[t.id]=(t.off+t.def)/2*0.9+t.prestige*0.15+rg.w*7.5-rg.l*10+pw}
  const bs=Object.values(B).sort((a,b)=>a-b),ref=bs[Math.floor(bs.length/2)],top=bs[Math.floor(bs.length*.75)];
  const v={},D={};
  for(const t of S.teams){
    const id=t.id,r=R2[id],n=r.w+r.l,gs=done.filter(g=>g.h===id||g.a===id).sort((a,b)=>a.wk-b.wk);
    let s=B[id];if(n)s+=clamp((r.pf-r.pa)/n,-21,21)*0.2;if(t.cc)s+=6;
    let qw=0,bl=0,sos=0,eye=0;
    for(const g of gs){const o=g.h===id?g.a:g.h,my=g.h===id?g.hs:g.as,th=g.h===id?g.as:g.hs,won=my>th;
      sos+=B[o];
      if(won)qw+=clamp((B[o]-ref)/6,0,6)+(B[o]>=top?2.5:0);
      else bl+=clamp((ref-B[o])/6,0,7)+(B[o]<ref-15?2:0);
      const exp=g.pl!=null?(g.h===id?g.pl:-g.pl):0;eye+=clamp((my-th)-exp,-17,17);}
    if(n){sos=(sos/n-ref)*0.4;eye=eye/n*0.35;const last=gs.slice(-3),form=last.filter(g=>winnerOf(g)===id).length-last.length/2;eye+=form*1.2}
    {const rg=regRec(id),m=rg.w+rg.l;if(m>=4&&rg.w<=rg.l)s-=16;if(m>=6&&rg.w<rg.l)s-=60}
    s+=qw-bl+sos+eye;v[id]=s;D[id]={qw,bl,sos,eye};
  }
  RSC={k:key,v,d:D};return v;
}
function rankScore(id){return rankScores()[id]}
function lastWeekDone(){let L=-1;for(const g of S.games)if(g.done&&g.wk<12&&g.wk>L)L=g.wk;return L}
/* poll inertia: a team that wins (or sits on a bye) only slides a little, unless it is the postseason */
function pollInertia(ord){
  if(!S.meritPoll)return ord;const L=lastWeekDone();if(L<0||L>=11||S.games.some(g=>g.done&&g.wk>=12))return ord;
  const prev=L===0?(S.preRank||[]).slice(0,PN):(S.pollHist&&S.pollHist.season===S.season&&S.pollHist.w[L-1]);if(!prev||!prev.length)return ord;
  const cap=L>=5?3:2;
  for(let i=0;i<prev.length;i++){const id=prev[i],g=S.games.find(x=>x.wk===L&&(x.h===id||x.a===id));
    if(g&&(!g.done||winnerOf(g)!==id))continue;const lim=i+(g?cap:cap+1),cur=ord.indexOf(id);
    if(cur>lim){ord.splice(cur,1);ord.splice(lim,0,id)}}
  return ord}
let PCC={k:null,p:null};
function poll(){const v=rankScores();if(PCC.k===RSC.k&&PCC.p)return PCC.p.slice();
  const ord=S.teams.map(t=>({id:t.id,s:v[t.id]})).sort((a,b)=>b.s-a.s).map(x=>x.id);
  try{h2hAdjust(ord,v)}catch(e){}PCC={k:RSC.k,p:ord};return ord.slice()}
/* head-to-head: when two teams are close and one beat the other, the winner sits ahead */
function h2hAdjust(ord,v){
  const beat={};for(const g of S.games){if(!g.done)continue;const w=winnerOf(g),l=w===g.h?g.a:g.h;beat[w+'>'+l]=(beat[w+'>'+l]||0)+1}
  const W=(a,b)=>(beat[a+'>'+b]||0)-(beat[b+'>'+a]||0);
  for(let pass=0;pass<3;pass++){let moved=false;
    for(let j=1;j<ord.length;j++){const b=ord[j],rb=rec(b);
      for(let i=Math.max(0,j-3);i<j;i++){const a=ord[i],ra=rec(a);
        if(W(b,a)>0&&v[a]-v[b]<=8&&Math.abs(ra.w-rb.w)<=1&&Math.abs(ra.l-rb.l)<=1){ord.splice(j,1);ord.splice(i,0,b);moved=true;break}}}
    if(!moved)break}
  return ord;
}
function rankOf(id,p){return (p||poll()).indexOf(id)+1}
const rk=(id,p)=>{const r=rankOf(id,p);return r<=PN?'#'+r+' ':''};
const recStr=id=>{const r=rec(id);return r.w+'-'+r.l};

/* ---------- quick sim ---------- */
function bonus(id){
  if(id!==S.userId)return{off:0,def:0};
  const pb=S.pb&&S.pb.wk===S.week?S.pb.v:0;
  return S.focus==='off'?{off:3+pb,def:pb}:S.focus==='def'?{off:pb,def:3+pb}:{off:1+pb,def:1+pb};
}
function snapPts(x){
  let td=Math.floor(x/7),fg=(x-td*7)>=2.5?1:0;
  if(td>0&&R()<.22){td--;fg+=2}
  let pts=td*7+fg*3; if(td>0&&R()<.1)pts-=1;
  return Math.max(0,pts);
}
/* ---------- team identities ---------- */
const IDENT={
 ground:{n:'Ground and Pound',s:'Ground',d:'Leans on the run game and wins up front.',off:0,def:.5,pace:.94,run:1.7,pass:.75,deep:.6},
 air:{n:'Air Raid',s:'Air Raid',d:'Spreads it out and throws it all over the yard.',off:.5,def:0,pace:1.12,run:.55,pass:1.4,deep:1.6},
 clock:{n:'Clock Killers',s:'Clock',d:'Long drives, huddle up, burn clock and shorten the game.',off:0,def:.5,pace:.84,run:1.5,pass:.9,deep:.45},
 defense:{n:'Defense First',s:'Defense',d:'Wins with defense. The offense keeps it simple.',off:-2,def:3,pace:.88,run:1.25,pass:.9,deep:.7},
 shootout:{n:'Score in Bunches',s:'Shootout',d:'Explosive offense, leaky defense. Every game is a track meet.',off:3,def:-2,pace:1.18,run:.9,pass:1.25,deep:1.35},
 balanced:{n:'Balanced',s:'Balanced',d:'No glaring tendencies. Takes what the defense gives.',off:0,def:0,pace:1,run:1,pass:1,deep:1}
};
const IDK=Object.keys(IDENT);
function seedIdent(t){
  const avg=S.teams.reduce((s,x)=>s+(x.off||70)-(x.def||70),0)/S.teams.length,h=hashS((t.name||'')+':ident:'+((t.coach||{}).name||''))>>>0,df=(t.off||70)-(t.def||70)-avg;
  let k;if(df>=7)k=h%3?'shootout':'air';else if(df<=-8)k=h%3?'defense':'clock';else if(t.style==='run')k=['ground','clock','ground','balanced'][h%4];else if(t.style==='pass')k=['air','shootout','air','balanced'][h%4];else k=['balanced','ground','air','defense','clock','shootout','air','ground'][h%8];
  return {k,since:yearOf(S.season||1),coach:(t.coach||{}).name||''};
}
function newIdent(t){const old=t.ident&&t.ident.k,pool=IDK.filter(k=>k!==old);const k=pool[Math.floor(R()*pool.length)];t.ident={k,since:yearOf(S.season||1),coach:(t.coach||{}).name||'',fresh:S.season};return t.ident}
function userIdent(){
  const t=team(S.userId),c=S.uCalls||{run:0,pass:0,g:0};
  if(c.g<3){if(!t.ident)t.ident={k:'balanced',since:yearOf(S.season),coach:S.coach,mine:true};return t.ident}
  const rs=c.run/Math.max(1,c.run+c.pass),r=rec(S.userId),gp=Math.max(1,r.w+r.l),pf=r.pf/gp,pa=r.pa/gp;
  let k='balanced';if(pf>=33&&pa>=26)k='shootout';else if(pa<=16&&pf<=24)k='defense';else if(rs>=.62)k=c.slow/Math.max(1,c.g)>=.5?'clock':'ground';else if(rs<=.4)k='air';
  if(!t.ident||t.ident.k!==k)t.ident={k,since:yearOf(S.season),coach:S.coach,mine:true};return t.ident;
}
function identOf(id){if(!S||!S.teams)return {k:'balanced'};if(id===S.userId)return userIdent();const t=team(id);if(!t.ident)t.ident=seedIdent(t);return t.ident}
function identBlock(id){const I=identOf(id),M=IDENT[I.k]||IDENT.balanced;return '<div class="identb"><span class="chip amber">'+esc(M.n)+'</span><span class="muted" style="font-size:12.5px">'+esc(M.d)+(I.mine?' Earned by how you call games.':' Since '+I.since+(I.coach?' under Coach '+esc(I.coach):'')+'.')+(I.fresh===S.season?' New this season.':'')+'</span></div>'}
function IDm(id){return IDENT[identOf(id).k]||IDENT.balanced}
function idMod(id){if(!S||id===S.userId)return {off:0,def:0};const m=IDm(id);return {off:m.off,def:m.def}}
function quickScore(off,def,adv,pace=1){return snapPts(Math.max(0,24*pace+(off-def)*0.55+adv+gauss()*9.5*Math.sqrt(pace)))}
function simGame(g){
  stampGame(g);
  if(g.pre){g.hs=g.pre.hs;g.as=g.pre.as;if(g.pre.ot)g.ot=true;g.done=true;delete g.pre;starStats(g);return}
  const adv=g.neutral?0:1.6+(gameEnv(g).theme?(gameEnv(g).night?1.6:1.1):0);
  const bh=rivBoost(g,g.h),ba=rivBoost(g,g.a);
  const EV=gameEnv(g),pace=Math.sqrt(IDm(g.h).pace*IDm(g.a).pace)*(EV.weather==='snow'?.84:EV.weather==='rain'?.92:EV.weather==='wind'?.94:1);
  let hs=quickScore(rOff(g.h)+bh,rDef(g.a)+ba,adv,pace),as=quickScore(rOff(g.a)+ba,rDef(g.h)+bh,-adv,pace);
  if(hs===as){R()<.5?hs+=3:as+=3;g.ot=true}
  g.hs=hs;g.as=as;g.done=true;starStats(g);
}
function spreadMargin(g){
  const m=((pOff(g.h)-pDef(g.a))-(pOff(g.a)-pDef(g.h)))*0.55+(g.neutral?0:3.2);
  return g.riv!=null?m*.82:m;
}
/* ---------- rivalries ---------- */
const TROPHIES=['The Iron Skillet','The Old Lantern','The Copper Kettle','The Brass Spur','The Golden Plow','The Lighthouse Bell','The Silver Oar','The Rusted Rail','The Cedar Bucket','The Canyon Cup','The Bayou Bell','The Anvil','The Pioneer Saddle','The River Paddle','The Timber Axe','The Magnolia Bell'];
function mkRival(a,b,tr,type){const n=type==='occ'?ri(3,9):Math.max(1,(S.baseYear||2025)-2006+1),pa=team(a).prestige/(team(a).prestige+team(b).prestige),sa=Math.round(n*clamp(pa+rnd(-.08,.08),.3,.7));return {a,b,trophy:tr,type:type||'main',sa,sb:n-sa,holder:R()<pa?a:b,prev:null,last:null}}
function rivalsFromDefs(defs,old){
  const out=[],used=new Set();let k=0;
  const find=(a,b)=>(old||[]).find(r=>(r.a===a&&r.b===b)||(r.a===b&&r.b===a));
  const add=(a,b,tr,ty)=>{const ex=find(a,b);if(ex){ex.trophy=tr;ex.type=ty;out.push(ex)}else out.push(mkRival(a,b,tr,ty))};
  for(const r of defs){const ty=r.type||'main';if(ty!=='main'||used.has(r.a)||used.has(r.b)||team(r.a).conf!==team(r.b).conf)continue;used.add(r.a);used.add(r.b);add(r.a,r.b,r.trophy,'main')}
  for(let c=0;c<4;c++){const left=shuffle(S.teams.filter(t=>t.conf===c&&!used.has(t.id)).map(t=>t.id));for(let i=0;i+1<left.length;i+=2)add(left[i],left[i+1],TROPHIES[(k++)%16],'main')}
  for(const r of defs){const ty=r.type||'main';if(ty==='main'||r.a===r.b||out.some(x=>(x.a===r.a&&x.b===r.b)||(x.a===r.b&&x.b===r.a)))continue;add(r.a,r.b,r.trophy,ty)}
  return out;
}
function syncRivals(){
  if(!S||S.lname!=='Church League'||!LS||!LS.tpl||LS.tpl.teams.length!==S.teams.length)return;
  S.rivals=rivalsFromDefs(LS.tpl.rivals,S.rivals);S.rivalDefs=LS.tpl.rivals.map(r=>({...r}));
  if(S.games){for(const g of S.games)delete g.riv;tagRivals()}
}
function patchRivals(){
  if(S.rivals){S.rivals.forEach(r=>{if(!r.type)r.type='main'});return}
  S.rivals=[];let k=0;
  if(S.rivalDefs){S.rivals=rivalsFromDefs(S.rivalDefs,null);return}
  for(let c=0;c<4;c++){
    const ids=shuffle(S.teams.filter(t=>t.conf===c).map(t=>t.id));
    for(let i=0;i<8;i+=2){const a=ids[i],b=ids[i+1],n=ri(40,110),pa=team(a).prestige/(team(a).prestige+team(b).prestige),sa=Math.round(n*clamp(pa+rnd(-.08,.08),.3,.7));
      S.rivals.push({a,b,trophy:TROPHIES[k++],type:'main',sa,sb:n-sa,holder:R()<pa?a:b,prev:null,last:null})}
  }
}
function rivOf(id){return (S.rivals||[]).find(r=>(r.a===id||r.b===id)&&(r.type||'main')==='main')||(S.rivals||[]).find(r=>r.a===id||r.b===id)}
function rivalsOf(id){return (S.rivals||[]).filter(r=>r.a===id||r.b===id)}
const RTYPE={main:'Rivalry Week',annual:'Annual rivalry',occ:'Rivalry game'};
function rivIdx(g){return (S.rivals||[]).findIndex(r=>(r.a===g.h&&r.b===g.a)||(r.a===g.a&&r.b===g.h))}
function tagRivals(){for(const g of S.games){if(g.riv!=null)continue;const i=rivIdx(g);if(i>=0)g.riv=i}}
function seriesTxt(rv,id){const me=rv.a===id?rv.sa:rv.sb,th=rv.a===id?rv.sb:rv.sa;return (me>th?'Lead ':me<th?'Trail ':'Tied ')+me+'-'+th}
function rivalryResult(g){
  const ix=rivIdx(g);if(ix<0){delete g.riv;return false}g.riv=ix;
  const rv=S.rivals[ix],W=winnerOf(g);rv.prev=rv.holder;rv.holder=W;W===rv.a?rv.sa++:rv.sb++;
  rv.last={season:S.season,w:W,s:Math.max(g.hs,g.as)+'-'+Math.min(g.hs,g.as)};
  rv.hist=rv.hist||[];const fav=winnerOf(g)===g.h?(g.pl||0):-(g.pl||0);rv.hist.push({y:yearOf(S.season),w:W,s:rv.last.s,h:g.neutral?null:g.h,ot:!!g.ot,up:fav<=-7,flip:rv.prev!==W,t:g.tag||''});
  return rv.prev!==W;
}

/* ---------- fan feed ---------- */
function srng(seed){let a=seed|0;return ()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hashS(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
const FIRSTN=['Terry','Tina','Ted','Tammy','Sam','Jo','Lou','Dee','Kyle','Maddie','Trey','Beth','Bill','Pam','Gus','Rhonda','Hank','Shelby','Cody','Brenda','Dale','Wes','Kim','Ray'];
function handle(id,kind,rr){
  const r=rr||R,pk=a=>a[Math.floor(r()*a.length)],ri2=(a,b)=>a+Math.floor(r()*(b-a+1));
  const t=team(id),m=t.mascot.replace(/[^A-Za-z]/g,''),c=(t.city||'').split(',')[0].replace(/[^A-Za-z]/g,'');
  if(kind==='media')return pk(['SidelineReport','SaturdayNotebook',(CONFS[t.conf]||'').replace(/[^A-Za-z]/g,'')+'Huddle','CFBBeatWriter','PollWatcher',(c||t.abbr)+'Sports','TheFilmRoomPod','KickoffDesk']);
  return pk([t.abbr+'Faithful',m+'Nation',m+'4Life','Tailgate'+pk(FIRSTN),'Section'+ri2(101,140)+pk(FIRSTN),'OldGrad'+ri2(64,99),t.abbr+'Dad'+ri2(2,9),'BandParent'+pk(FIRSTN),'StudentSection'+pk(FIRSTN),(c||t.abbr)+pk(['Born','Proud','Raised'])+ri2(1,99),pk(FIRSTN)+'Loves'+m,'SeasonTickets'+ri2(1,40)+'yrs',m+'Mom'+ri2(1,9),'FrontRow'+pk(FIRSTN)]);
}
function post(id,txt,kind='fan'){S.feed=S.feed||[];S.feed.unshift({h:'@'+handle(id,kind),txt,likes:kind==='media'?ri(80,2400):ri(4,3900),kind,team:id,season:S.season,wk:S.week});if(S.feed.length>60)S.feed.length=60}
function fill(s,v){return s.replace(/\{(\w+)\}/g,(m,k)=>v[k]!=null?v[k]:m).replace(/\b([Tt]he) [Tt]he /g,'$1 ')}
const FP={
 win:['Never doubted them. Okay, I doubted them a little.','{rec} and rolling.','{star} was dealing today.','Book the bowl trip, honey.','That is how you take care of business.','Clean win. Boring is beautiful.','Somebody tell {opp} the bus is leaving.','I can finally eat my Sunday pot roast in peace.','My voice is gone and I regret nothing.','Good win. Now do it again next week.','Coach {coach} pushed every right button today.','Defense showed UP. Pay those men. (Figuratively.)'],
 bigwin:['We hung {pts} on them and it was not even close.','{star} is HIM.','Somebody call the playoff committee.','Mercy rule should be a thing. Glad it is not.','I left in the third quarter to beat traffic and still felt great.','The backups got snaps. The BACKUPS.','{opp} fans, you okay? Blink twice.','That was a statement. Read it out loud.'],
 upsetW:['WE STORMED THE FIELD AND I LOST A SHOE','Nobody believed. We believed.','{coach} for governor.','I have watched the last drive nine times.','Somebody frame that scoreboard.','The {mascot} are BACK and I am crying in a parking lot.','Ranked teams beware.','Tell your friends you were there.'],
 close:['My heart cannot take many more of these.','Ugly win. Still a win. Frame it.','Aged ten years in the fourth quarter.','We do not do easy around here apparently.','I paced so much I wore a path in my carpet.','That last drive. That LAST DRIVE.'],
 loss:['Who called that third-down play?','Still proud of these guys. On to the next one.','{rec}. We need to talk about it.','Not our day. Back at it Monday.','Too many penalties. Way too many.','Tackling is optional apparently.','I am going to need the offensive line to find their lunch pails.','We will be fine. Probably. Maybe.','Turning my phone off for the night.','Blame the new jersey combo. I am serious.'],
 bigloss:['I left at halftime and I was not the first one.','That was a lot. Back at it next week I guess.','Who drew up that game plan?','We got run out of our own building.','Do not text me about this game.','I have seen better tackling at a church picnic.','Somebody check on the defense. Wellness check.'],
 upsetL:['Lost to {opp}. {opp}. I have no words.','Worst Saturday I have had in years, and I once broke my arm at a tailgate.','Somebody explain that second half to me.','How do you lose to THEM?','I would like a refund on my emotions.','Embarrassing. Plain embarrassing.'],
 closeL:['So close. So painfully close.','One play. That is all it took.','Heartbreaker. Proud of the fight though.','I am not okay but I will be.','Ref, you have the whole week to think about that call.'],
 rivW:['{trophy} stays where it belongs.','Text your {opp} friends. I will wait.','Best day of the year. Every year.','Rivalry week hits different when you win.','{opp} fans have been real quiet today.','Bragging rights secured for 365 days.'],
 rivL:['Cannot show my face at work tomorrow.','{opp} has the {trophy}. I am moving.','Losing to them is a different kind of pain.','A long year of hearing about it. Great.','My cousin roots for {opp}. Thanksgiving is going to be rough.'],
 streakW:['{streak} straight. Do not touch anything.','Same seat, same shirt, same snacks until this ends.','{streak} in a row and I am not tired of winning.','Nobody wants to play us right now.'],
 streakL:['{streak} straight losses. I am out of jokes.','Something has to change.','Please just one win. One.','At this point I am rooting for character development.'],
 top:['Playoff bye is in play. Say it with me.','No. {rank} in the country. Act like you have been there.','I have the bracket printed on my fridge.','National title talk is not crazy anymore.'],
 ranked:['No. {rank}. Love seeing that number by our name.','Ranked and nobody can take it back. Well, they can. Please do not.','Look at us, ranked and everything.'],
 bubble:['Bubble watch. My blood pressure says hello.','Win out and we are in. Simple as that.','Need some help from other teams. Rooting for chaos.'],
 hotseat:['Love Coach {coach} as a person. Just saying.','Hot seat? More like a bonfire.','Something needs to change at the top.','Boosters are making phone calls. You know it.','I want to believe. I am running out of reasons.','Five more losses and I start the petition.','Ten years from now we will look back on this and still be mad.'],
 coachLove:['Coach {coach} is the guy. Lifetime contract.','Never leave us, Coach.','Best hire this program has made in my lifetime.','In {coach} we trust.'],
 injury:['Prayers up for {inj}.','Losing {inj} hurts. Next man up.','Get well soon, {inj}. We need you.','That injury changes everything. Big week for the backups.'],
 next:['{next} week. Get your tickets.','Already counting down to {next}.','Film study starts now. {next} is no joke.','Bring on the {nextm}.','I have {next} circled in red.','Beat {next}. Nothing else matters this week.','Tailgate menu for {next} week is going to be elite.'],
 nextRiv:['RIVALRY WEEK. Wear the colors to work.','It is {next} week. You already know.','I hate {next}. Respectfully. No, not respectfully.','The {trophy} is on the line. Everything else is noise.','Counting the hours until we play {next}.'],
 nextUp:['Upset alert this week and I do not like it.','Trap game vibes. Stay focused.','Everyone says we are on upset alert. Prove them wrong.'],
 star:['{star} is a cheat code.','Heisman campaign starts now. {star} for the trophy.','Somebody put {star} on a billboard.','Has anyone stopped {star}? Asking for the rest of the league.','{star} has been ridiculous this year.'],
 dynasty:['Another year, another title run. That is just who we are.','Banners on banners on banners.','We do not rebuild, we reload.','Hate us all you want. Check the trophy case.'],
 fallen:['Remember when we used to win titles? I do. Barely.','My grandpa saw us win it all. I would like a turn.','Glory days are coming back. I can feel it. Sort of.','The banners are getting dusty.','We used to own this league. Used to.'],
 basement:['A bowl game would change my life.','At least the tailgates are undefeated.','We are due. We have been due for 40 years.','Moral victories count, right? Right?','Lowered expectations, raised spirits.'],
 rising:['The arrow is pointing straight up.','Get on the bandwagon now before it is full.','Recruits are noticing. Everyone is noticing.','Three years ago nobody knew our name.'],
 pre:['This is our year. I say it every year. This time I mean it.','Season tickets renewed. Hope renewed.','Counting down to kickoff like a kid at Christmas.','New season, clean slate, same tailgate spot.','I have a good feeling. A dangerous feeling.','Fall is here. Football is here. Life is good.','Our schedule sets up nicely. Do not jinx it.'],
 confRace:['We control our own destiny in the {conf}.','Division title is right there for the taking.','Win the division, play for the {conf} title. Simple.','Conference title game would be huge for this program.'],
 rivalTroll:['Hey {team} fans, how does it feel?','Another week, another {team} disappointment.','We all saw that, {team}.','Imagine losing to them. Couldn\'t be us. Oh wait.','The {mascot} are the {mascot}. Some things never change.','LOL {abbr}.','Thoughts and prayers to the {team} fan base.'],
 rivalSalty:['Enjoy it while it lasts, {team}.','{team} got lucky. That is all I will say.','Wait until rivalry week.','Not impressed, {abbr}. Not impressed.','Fine, {team} played well. Whatever.'],
 titled:['Remember {lastYear}? Let us do it again.','{natl} national titles and counting.','Banner number {nextBanner} is coming. I can feel it.','We have been here before. {lastYear} was not that long ago.'],
 noTitle:['Twenty years and still no national title. This is the year.','Just one title. That is all I ask.','Everybody else has a banner. Our turn.'],
 life:['Smoked brisket at the tailgate. Life is good.','The band was absolutely on fire today.','Brought my kids to their first game. They are hooked.','Rain or shine, I will be in my seat.','Best part of fall: Saturdays.','My dog has a {mascot} jersey. He knows things.','Halftime hot dogs are a spiritual experience.','Section {sec} is the loudest section and I will die on this hill.']
};
const FX={
 comebackW:['Down {def} and we never blinked. What a comeback.','I turned it off down {def}. I am a fraud and I am sorry.','Comeback kids. Put it in the history books.','Down {def}?? Nah. Not today.','That second half was the best football I have seen in years.','Somebody check the locker room for whatever they were drinking at halftime.','Never leave early. Never. Leave. Early.','{coach} made the halftime adjustments of a genius.','Down {def} and the {mascot} just said no thank you.','My wife asked why I was screaming at the TV. Then she started screaming too.'],
 comebackL:['We were up {def}. UP {def}.','Blew a {def} point lead. I need to lie down.','How do you give that lead away? Asking for everybody.','Prevent defense prevented us from winning.','We played not to lose and guess what happened.','Up {def} and we still found a way. Incredible stuff.','That collapse is going to haunt me all week.'],
 defW:['The defense held {opp} to {lpts}. Somebody buy those guys dinner.','{opp} could not find the end zone with a map.','Defense wins championships and ours just put on a clinic.','That front seven lived in the backfield all day.','The secondary was locked in. Nobody was open all day.','Defensive coordinator deserves a raise. And a parade.','The D played with their hair on fire.'],
 defYds:['Held them to {lyds} yards. {lyds}. Love this defense.','{lyds} total yards allowed. That is a wall, not a defense.','{opp} managed {lyds} yards all day. Cute.'],
 defTO:['We forced {lto} turnovers. Takeaway kings.','{lto} takeaways. The defense was hunting today.','Ball hawks. {lto} turnovers and every one of them mattered.'],
 shutW:['SHUTOUT. Put a zero on the board and frame it.','Zero. Zip. Nada. Goose egg. Beautiful.','A shutout in this league? The defense is different this year.','{opp} got blanked. Let that sink in.'],
 shutL:['We did not score a single point. Not one.','Shut out. I am speechless and not in the good way.','Zero points. The offense owes us an apology.','Somebody find our offense. Last seen in the first quarter.'],
 offW:['{pts} points! The offense was unstoppable.','Scoreboard operator needs overtime pay after that.','{yds} yards of offense. Put it on a poster.','We could have scored 80 if we wanted to.','The play calling was perfect. Every button worked.','That offense is a problem for the whole league.'],
 passHero:['{qb} threw for {pyds}. Somebody stop him. Actually do not.','{qb} was carving them up all day. {pyds} yards.','{qb} is the best quarterback in this league and I am tired of pretending otherwise.','{pyds} yards for {qb}. Heisman campaign starts now.','{qb} dropped dimes like he was getting paid by the yard.'],
 rushHero:['{rb} ran for {ryds}. Their defense will feel that tomorrow.','{rb} was running through people all day.','{ryds} rushing yards for {rb}. Feed him every down.','Our offensive line moved bodies and {rb} did the rest.','{rb} broke more tackles than I can count.'],
 recHero:['{wr} with {recy} receiving yards. Uncoverable.','{wr} caught everything thrown his way. {recy} yards.','Throw it up to {wr}. Every time. Forever.'],
 closeExpW:['A win is a win but that should not have been that close.','We were supposed to roll. Instead I aged five years.','Favored by {line} and won by {mar}. Not a great look.','Sloppy. Way too sloppy against {opp}.','We will take it but the coaches have some film to watch.','That was a little too exciting for a game we were supposed to win easy.'],
 closeExpL:['Nobody gave us a chance and we almost took them down.','Lost by {mar} as a {line} point underdog. I am proud of this team.','Moral victory? Maybe. But I believe in this group now.','We went toe to toe with {opp}. The future is bright.','Close but no cigar. Still, that was the best we have played all year.','Everybody picked us to get blown out. We did not.'],
 blowExpW:['Vegas had it at {line}. We won by {mar}. Vegas was wrong.','Expected a win. Did not expect THAT.','Way better than anyone predicted.','We were favored and still beat expectations by a mile.'],
 blowExpL:['We knew it would be tough but that was ugly.','Expected to lose. Did not expect to get embarrassed.','That went worse than even the pessimists thought.'],
 shootW:['{pts} to {lpts}. Nobody played defense and I loved every second.','That was a track meet and we won the last lap.','Defense optional. Points mandatory. What a game.'],
 shootL:['We scored {lpts} and still lost. How??','{lpts} points should be enough to win any game.','Our defense let them score {pts}. Unacceptable.','The offense did its part. The defense took the day off.'],
 grindW:['Ugly, physical, old school. I loved it.','Three yards and a cloud of dust. My kind of football.','Not pretty but it does not have to be.','A grown man game. We won the trenches.'],
 otW:['OVERTIME WINNERS. I need a nap.','Free football and we won it. Best kind.','Overtime always goes to the team that wants it more.'],
 otL:['Lost in overtime. Pain.','So close. Overtime is cruel.','Overtime heartbreak. I cannot.'],
 toL:['{lto} turnovers. You cannot win like that.','We gave the ball away {lto} times. That is the game.','Hold on to the football. Please. I am begging.'],
 defCollapse:['Gave up {pts}. The defense needs to look in the mirror.','We could not stop a nosebleed today.','Missed tackles everywhere. Fundamentals, people.'],
 overAch:['Picked No. {pre} in the preseason and we are {rec}. Nobody saw this coming.','Everybody slept on us. Look at us now.','Way ahead of schedule. This staff is building something.','The experts had us middle of the pack. The experts were wrong.'],
 underAch:['We were picked No. {pre} and we are {rec}. That is not good enough.','So much talent and so little to show for it.','Preseason hype feels like a long time ago.','We were supposed to be better than this.'],
 badBloodW:['{yrs} meetings all time and beating {opp} never gets old.','Series is {ser} now. Keep counting, {oppabbr}.','{trophy} is not leaving our building. Not on my watch.','They talked all week. Scoreboard did the talking today.','My grandpa hated {opp}. My dad hated {opp}. I hate {opp}. Family tradition.','Remember when {opp} fans said this was their year? I do.','Beat {opp}. Everything else is just extra.','I will be wearing my {mascot} gear to their side of town tomorrow.'],
 badBloodL:['Losing to {opp} ruins my whole year.','I will never forgive them for this. Or the last ten times.','Our series record is {ser} and today did not help.','{opp} fans are unbearable and now they get to be louder. Great.','Do not talk to me about {opp} until next year.','Next year. Circle it. We remember everything.','That {trophy} better be dusted off when we take it back.'],
 trophyBack:['{trophy} is COMING HOME!','We got our trophy back. Put it front and center.','Took the {trophy} back from {opp}. Feels incredible.','That trophy looked better in our case anyway.'],
 trophyLost:['{opp} has our trophy. I feel sick.','We had the {trophy} and we let it walk out the door.','A whole year of seeing the {trophy} in their building. Brutal.'],
 rivPre:['{next} week. You know what it is.','They have been talking for a year. Time to shut them up.','Series is {nser}. Time to add one more.','Win this one and the season is already a success.','I do not care about rankings this week. Beat {next}.','The {ntrophy} is the only trophy that matters this week.','Bad blood does not even begin to cover it.','Already got my {next} trash talk loaded up for Monday.','Nobody in this town sleeps the night before {next}.'],
 rivChirpPre:['See you Saturday, {abbr}.','{team} fans, enjoy your last week of hope.','The {trophy} is staying right where it is.','{team} thinks this is their year. Cute.','Nervous yet, {abbr}?','Circle the date, {team}. We already did.','I have been waiting all year to beat {team}.'],
 rivChirpL:['Lost to {opp}? Classic {abbr}.','{team} fans real quiet tonight. Wonder why.','Imagine losing to {opp}. Could not be me.','The {mascot} are cooked and everyone knows it.','Hey {abbr}, the {opp} game was on TV. Everybody saw.','Thoughts and prayers, {team}. Mostly thoughts.','{abbr} folding again. Tradition never graduates.','Just checking in on {team} fans. How are we doing?','Same old {team}.'],
 rivChirpW:['{team} beat {opp}. Big deal. Wait until they play us.','Cute win, {abbr}. See you soon.','{team} fans acting like they won a title. It was {opp}.','Even a broken clock is right twice a day. Congrats, {abbr}.','Do not get comfortable, {team}.','{team} got lucky. Again.'],
 rivHistT:['{abbr} has {tn} national titles. We have {mn}. Carry on.','Count the banners, {abbr}. We will wait.','{mn} titles to {tn}. Some programs win, some programs post.'],
 rivHistS:['We lead the all-time series {ser}. Not that anyone is counting. We are counting.','Series is {ser}. History does not lie, {abbr}.','{ser} all time. {team} fans hate that number.'],
 rivHistY:['Some of us remember {yr}. {team} fans try to forget it.','{yr} called. It still has the title. Ours, not yours, {abbr}.','Hey {abbr}, remember {yr}? We do.'],
 rivHistUnder:['They lead the series. Fine. History is history. Saturday is what matters.','{team} has more banners. We have more heart. Mostly.','We will get them. It has been a long time coming.'],
 lore216:['2016. Jerome beat Berean in the title game and the rivalry was born. Never forget.','Knutson walked out of Berean and won a title against them. Best story in league history.','Berean fans still cannot say the word Jerome without flinching.','Ask any Berean fan about 2016. Watch their face.'],
 lore162:['Jerome stole our guy and our title in 2016. We remember.','Every Berean fan has 2016 circled forever. Revenge is a lifelong project.','Knutson in a Jerome jersey still makes me sick.','We got our title back in 2025. Jerome can keep living in 2016.']
};
const MEDIA2={
 comeback:['COMEBACK: {team} rallies from {def} down to beat {opp}, {score}.','{team} erases a {def} point deficit and stuns {opp}, {score}.','What a finish: {team} storms back from {def} down to top {opp}, {score}.'],
 shutout:['{team} blanks {opp}, {score}. The defense never cracked.','Shutout: {team} {score} over {opp}.'],
 defense:['Defense carries {team} past {opp}, {score}.','{team} holds {opp} to {lyds} yards in a {score} win.'],
 hero:['{hero} goes off as {team} beats {opp}, {score}.','{hero} leads {team} past {opp}, {score}.'],
 closer:['Closer than expected: {team} survives {opp}, {score}.','{team} sweats one out against {opp}, {score}. Favored by {line}.','{opp} gives {team} all it can handle in a {score} finish.'],
 rout:['{team} rolls {opp}, {score}, and it was over early.','{team} beats {opp} by {mar} in a game that was never close.'],
 ot:['{team} wins it in overtime over {opp}, {score}.'],
 rivalry:['{team} wins the {trophy}, {score}. Series now {ser}.','{trophy}: {team} {score} over {opp}. {team} now {ser} all time.','Bad blood boils over as {team} beats {opp} for the {trophy}, {score}.']
};

const FPX={
 win:['Win column. That is the only column that matters.','Another W. Keep stacking them.','Did what we had to do. Next.','{coach} has these boys believing.','The tailgate tasted better after that one.','Every win is a good win. Write that down.'],
 bigwin:['That was a {pts} point clinic.','Starters were on the bench eating sunflower seeds by the fourth.','We did not take our foot off the gas and I respect it.','Total domination from start to finish.'],
 upsetW:['Experts can delete their picks now.','Nobody outside this building believed. That is fine.','Signs from the student section are going straight in the trophy case.','Dancing in the parking lot at midnight. No regrets.'],
 close:['Nails are gone. Fingers are next.','Never in doubt. (It was in doubt the whole time.)','Survive and advance.','We like it dramatic around here.'],
 loss:['We will learn from it. We have to.','Rough one. Shake it off.','I need to see more energy next week.','Not good enough. Everybody knows it.','The effort was there. The execution was not.'],
 bigloss:['Erase the tape. Burn it actually.','I have no explanation and neither does anyone else.','That was a long afternoon in the stands.','We looked a step slow all day.'],
 upsetL:['That one is going to sting all season.','There is no excuse for that one.','Flat. Just completely flat.','I would like to know who scheduled them. I want words.'],
 closeL:['A few inches from a different week.','Played well enough to win. Did not win. Football is cruel.','Every play matters. We found out the hard way.'],
 rivW:['Rivalry win. Best feeling in sports.','Happy {trophy} day to everybody except {opp}.','We own this rivalry right now.'],
 rivL:['Worst loss of the year. Every year it is this one.','My {opp} coworkers have already sent the memes.','Rivalry losses hit different. Not in a good way.'],
 next:['One game at a time. {next} is the only game that matters.','Bring the noise against {next}.','{next} is coming to town. Pack the stands.'],
 life:['Wore my lucky socks. They are retiring after this season.','The concession stand nachos have gotten better. That is growth.','Tailgating in a hoodie is the best part of the year.','Got to the stadium three hours early. Still the latest one at our spot.'],
 star:['{star} plays the game at a different speed.','When {star} has the ball something good happens.','Opposing coaches lose sleep over {star}.'],
 hotseat:['Patience is running thin around here.','I want the program back where it belongs.','Changes need to happen. Soon.']
};
for(const k in FPX)FP[k].push(...FPX[k]);
const SLANG={
 win:['WE ARE SO BACK','that was a business trip. in and out.','ball game. lights out.','W. thats the tweet.','Coach {coach} cooked and the boys ate.','another dub. stack em.','{star} is HIM. no further questions.','statement made. {rec} and nobody wants this smoke.','respectfully, we are good at football.'],
 bigwin:['body bag game. send flowers to {opp}.','that was a boat race from the opening kick.','{opp} got sent to the shadow realm.','cleared the bench by the third. bully ball.','running it up? nah we were just playing football.','{pts} points. mercy. MERCY.'],
 upsetW:['WE ARE SO BACK','upset city, population: us.','chaos reigns and WE are the chaos.','the vibes are immaculate right now.','every pundit who picked against us owes us an apology. in writing.','sickos window is open and they are cheering for US.','delete your picks. all of them.'],
 close:['happy jump sad jump happy jump. what a game.','cardiac kids strike again.','ugly dub is still a dub. frame it.','win ugly, sleep pretty.','i need a defibrillator and a nap.','we do NOT do easy here.'],
 loss:['its so over.','we are cooked.','this offense is mid at best.','fire the OC. respectfully.','who keeps calling a run on 3rd and 9','L. thats the tweet.','tough watch. tough tough watch.','the vibes are not it right now.','back to the drawing board. bring a new drawing board.'],
 bigloss:['we got body bagged.','its so over. its been so over.','surrender cobra the whole second half.','turn off the tv and go touch grass.','we got washed. in our own building.','that was not football. that was a cry for help.'],
 upsetL:['trap game. we walked right into it.','fraud alert and it is US.','we were the frauds all along.','lost to {opp}. delete the program.','never been more cooked in my life.','letdown spot and we let everybody down.'],
 closeL:['happy jump sad jump. mostly sad jump.','football is a cruel game.','one play from a dub. ONE.','pain. just pain.'],
 rivW:['{opp} is cooked and their fans know it.','own the state. own the trophy. own the group chat.','{trophy} stays home. stay mad.','ratio\'d the entire {opp} fan base.','rivalry dub hits different. WE ARE SO BACK.'],
 rivL:['the group chat is unbearable right now.','{opp} fans will not let me live.','its so over and it is rivalry week. double pain.','losing the {trophy} is a crime and the jury is me.'],
 streakW:['do NOT touch the remote. we are on a heater.','heater mode: activated.','{streak} straight. we are so back and we never left.'],
 streakL:['its so over x{streak}.','rock bottom has a basement apparently.','{streak} straight Ls. somebody check on the fanbase.'],
 top:['natty talk. say it louder for the people in the back.','No. {rank}. respect the name.','playoff bye? in THIS economy?'],
 ranked:['ranked. respect the name.','No. {rank}. we are so back.'],
 bubble:['rooting for chaos. sicko mode activated.','scoreboard watching is a full time job now.'],
 hotseat:['buyout calculator is open in another tab.','not saying it. just thinking it very loudly.','coach is cooked and i think he knows it.','boosters are in the group chat. you know what that means.'],
 coachLove:['Coach {coach} is HIM.','pay that man whatever he wants.','this coaching staff is undefeated in my heart.'],
 next:['{next} week. lock in.','lookahead spot? not on our watch.','no trap games. only Saturdays.'],
 nextUp:['trap game written all over this one.','letdown spot. i can feel it in my bones.','upset alert. the sickos are watching.'],
 star:['{star} is HIM.','{star} is built different.','let {star} cook.','{star} ate and left no crumbs.','{star} for Heisman. not a joke anymore.'],
 pre:['we are so back (we have not played a game yet).','hype train leaving the station. all aboard.','bowl or bust. ok natty or bust. ok bowl.'],
 rivalTroll:['{abbr} fraud watch continues.','imagine being a {team} fan right now.','{team} is cooked lol.','who wants to tell {team} fans?','paper tiger {team} strikes again.'],
 rivalSalty:['{team} is a paper tiger and i will die on this hill.','{team} schedule is all cupcakes.','{team} fans acting like that was a statement win. it was not.'],
 life:['tailgate was undefeated. the team was not consulted.','Saturdays > everything.','college football is the best sport and it is not close.']
};
const SLANGX={
 comebackW:['down {def} and WE ARE SO BACK.','down {def}? the comeback was HIM.','never doubted them. (i turned it off down {def}.)'],
 comebackL:['blew a {def} point lead. its so over.','up {def} and we still found a way. cooked.'],
 defW:['the defense ATE today.','{opp} offense is cooked.','the D was cooking all game.'],
 defTO:['takeaway szn. {lto} of them.','{lto} takeaways. the defense is HIM.'],
 shutW:['goose egg szn.','{opp} put up a zero. sickos are thrilled.'],
 shutL:['the offense is cooked. charcoal.','zero points. its so over.'],
 offW:['the OC was cooking with gas.','{pts} points. the offense is HIM.'],
 passHero:['{qb} is HIM.','dimes all day from {qb}. {pyds} yards.','let {qb} cook. {pyds} yards.'],
 rushHero:['{rb} said no thank you to tackling. {ryds} yards.','{rb} is HIM. {ryds} on the ground.'],
 recHero:['{wr} is uncoverable. {recy} yards.','{wr} was mossing people all day.'],
 closeExpW:['favored by {line} and won by {mar}. winning frauds but winning.','not the vibes we wanted but a dub is a dub.'],
 closeExpL:['moral victory szn. we are coming.','lost by {mar} as a {line}-point dog. the future is so back.'],
 blowExpW:['covered by a mile. Vegas in shambles.','we were not supposed to do that. we did that.'],
 blowExpL:['worse than the worst case. its so over.'],
 shootW:['sicko shootout and we won it.','defense was optional. vibes were mandatory.'],
 grindW:['big boy football. we won the trenches.','sickos loved that one. so did i.'],
 otW:['FREE FOOTBALL AND WE WON IT.'],
 otL:['free football is not free. it cost me my soul.'],
 toL:['{lto} turnovers. we are cooked.'],
 badBloodW:['series {ser}. keep counting, {oppabbr}.','{opp} talked all week. scoreboard said shhh.'],
 badBloodL:['{opp} fans are going to be insufferable. its so over.'],
 rivPre:['{next} week. lock in. no excuses.','beat {next}. nothing else matters.'],
 rivChirpPre:['see you saturday, {abbr}. bring tissues.','{team} fans are already making excuses. love to see it.','{team} paper tiger alert.'],
 rivChirpL:['{team} is cooked. its so over for them.','{abbr} fraud watch: confirmed.','{team} fans in shambles. love that for them.'],
 rivChirpW:['fraud watch on {team} continues.','cute dub, {abbr}. see you soon.']
};
for(const k in SLANG)if(FP[k])FP[k].push(...SLANG[k]);
for(const k in SLANGX)if(FX[k])FX[k].push(...SLANGX[k]);

const MEDIA={
 W:['{team} beats {opp} {score}. {team} moves to {rec}.','FINAL: {team} {score} over {opp}. {star} led the way.','{team} handles {opp}, {score}. Up next: {next}.'],
 L:['{opp} tops {team} {score}. {team} falls to {rec}.','FINAL: {opp} {score}. Tough day for {team}.','{team} drops one to {opp}, {score}. Questions loom before {next}.'],
 upW:['UPSET: {team} stuns {opp}, {score}.','Shock result: {team} {score} over {opp}.'],
 upL:['UPSET: {opp} knocks off {team}, {score}.','Stunner as {team} falls to {opp}, {score}.'],
 riv:['{winner} wins {trophy}, {score}.'],
 pre:['{team} enters the season '+'{rankTxt}. Coach {coach} faces {first} to open.'],
 heat:['Sources: pressure building on {coach} at {team}.','{coach} on the hot seat? Boosters at {team} want answers.'],
 inj:['{team} {pos} {inj} expected out {wks}.']
};
function gameSig(g){
  const X=boxFor(g),W=winnerOf(g),hw=W===g.h,Lo=hw?g.a:g.h,Wq=hw?X.qH:X.qA,Lq=hw?X.qA:X.qH,Ws=hw?X.H:X.A,Ls=hw?X.A:X.H;
  const ws=Math.max(g.hs,g.as),ls=Math.min(g.hs,g.as),mar=ws-ls;
  let cw=0,cl=0,def=0,trail3=0;
  for(let q=0;q<4;q++){cw+=Wq[q];cl+=Lq[q];def=Math.max(def,cl-cw);if(q===2)trail3=cl-cw}
  if(g.big){const d=W===S.userId?g.big.u:Lo===S.userId?g.big.c:0;def=Math.max(def,d||0)}
  const favW=(hw?g.pl:-g.pl)||0,pyds=Ws.pass,ryds=Math.round(Ws.rush*.62),recy=Math.round(Ws.pass*.38);
  return {W,Lo,ws,ls,mar,def,favW,ot:!!g.ot,
    comeback:def>=10||trail3>=4,shut:ls===0,defense:ls<=10||Ls.yds<=260||(Ls.to>=3&&ls<=20),lowYds:Ls.yds<=280,
    offense:ws>=42||Ws.yds>=500,shootout:ws+ls>=66&&ls>=28,grind:ws<=20&&ls<=17,
    closer:favW>=10&&mar<=Math.max(7,Math.round(favW*.35)),blowout:favW>=3&&mar>=Math.max(28,favW+17),upset:favW<=-6,
    passHero:pyds>=300,rushHero:ryds>=140,recHero:recy>=130,lto:Ls.to,
    v:{qb:Ws.qb,rb:Ws.rb,wr:Ws.wr,pyds,ryds,recy,lyds:Ls.yds,yds:Ws.yds,lto:Ls.to,def,mar,line:Math.abs(favW),pts:ws,lpts:ls,score:ws+'-'+ls}};
}
/* pools that describe how a game went, from one side's point of view */
function sigPools(G2,win){
  const o=[],a=(p,w)=>o.push([p,w]);
  if(win){
    if(G2.comeback)a(FX.comebackW,6);if(G2.shut)a(FX.shutW,5);else if(G2.defense)a(FX.defW,4);if(G2.lowYds)a(FX.defYds,3);if(G2.lto>=3)a(FX.defTO,3);
    if(G2.offense)a(FX.offW,3);if(G2.passHero)a(FX.passHero,3.5);if(G2.rushHero)a(FX.rushHero,3.5);if(G2.recHero)a(FX.recHero,2.5);
    if(G2.closer)a(FX.closeExpW,4.5);if(G2.blowout)a(FX.blowExpW,3);if(G2.shootout)a(FX.shootW,3);if(G2.grind)a(FX.grindW,2.5);if(G2.ot)a(FX.otW,3.5);
  }else{
    if(G2.comeback)a(FX.comebackL,6);if(G2.shut)a(FX.shutL,5);if(G2.closer)a(FX.closeExpL,4.5);if(G2.blowout)a(FX.blowExpL,3);
    if(G2.shootout)a(FX.shootL,3.5);else if(G2.ws>=45)a(FX.defCollapse,3);if(G2.lto>=3)a(FX.toL,3);if(G2.ot)a(FX.otL,3.5);
  }
  return o;
}
function rivCtx(c,id){
  const rv=(S.rivals||[]).find(r=>(r.a===c&&r.b===id)||(r.a===id&&r.b===c));if(!rv)return null;
  const me=rv.a===c?rv.sa:rv.sb,th=rv.a===c?rv.sb:rv.sa;return {rv,me,th,ser:me+'-'+th};
}
function natlOf(id){const t=team(id);return (t.hist&&t.hist.natl)||0}
function lorePair(c,id){
  if(!S.lore||!S.lore.length)return null;const n=x=>(team(x).name||'');
  if(c===16&&id===2&&/Berean/.test(n(16))&&/Jerome/.test(n(2)))return FX.lore162;
  if(c===2&&id===16&&/Berean/.test(n(16))&&/Jerome/.test(n(2)))return FX.lore216;
  return null;
}
/* fans of id's rivals chirping at id. res: 'W' (id won), 'L' (id lost), 'pre' (they meet next) */
function rivalChirps(id,res,rr,n,extra,only){
  const pk=a=>a[Math.floor(rr()*a.length)],out=[],T=team(id);
  let rs=only!=null?[only]:rivalsOf(id).map(r=>r.a===id?r.b:r.a).filter((x,i,a)=>a.indexOf(x)===i&&(!extra||x!==extra.excl));
  for(let i=rs.length-1;i>0;i--){const j=Math.floor(rr()*(i+1));[rs[i],rs[j]]=[rs[j],rs[i]]}
  for(const c of rs.slice(0,n)){
    const C=rivCtx(c,id);if(!C)continue;
    const won=(S.lore||[]).filter(x=>x.t===c).map(x=>x.y).concat((S.champHist||[]).filter(x=>x.natl===c).map(x=>yearOf(x.s)));
    const v={...(extra||{}),team:T.name,abbr:T.abbr,mascot:T.mascot,ser:C.ser,trophy:C.rv.trophy,tn:natlOf(id),mn:natlOf(c),yr:won.length?pk(won):null};
    const hist=[];if(v.mn>v.tn)hist.push(...FX.rivHistT);if(C.me>C.th)hist.push(...FX.rivHistS);if(v.yr)hist.push(...FX.rivHistY);
    const lp=lorePair(c,id);let pool;
    if(lp&&rr()<.4)pool=lp;
    else if(rr()<.38)pool=hist.length?hist:FX.rivHistUnder;
    else pool=res==='L'?FX.rivChirpL.concat(FP.rivalTroll):res==='W'?FX.rivChirpW.concat(FP.rivalSalty):FX.rivChirpPre;
    for(let k=0;k<6;k++){const txt=fill(pk(pool),v);if(!/\{\w+\}/.test(txt)){out.push({h:'@'+handle(c,'fan',rr),txt,likes:Math.floor(4+rr()*2400),kind:'rival',team:c});break}}
  }
  return out;
}
function wpickL(list,rr){const tot=list.reduce((a,c)=>a+c[1],0);let x=rr()*tot;for(const c of list){x-=c[1];if(x<=0)return c}return list[list.length-1]}
function teamState(id){
  const p=poll(),r=rec(id),gs=S.games.filter(g=>g.done&&(g.h===id||g.a===id)).sort((a,b)=>a.wk-b.wk),last=gs[gs.length-1];
  const k=rankOf(id,p),pre=(S.preRank||p).indexOf(id)+1||16,expPct=clamp(.85-(pre-1)*.022,.2,.85),exp=expPct*(r.w+r.l);
  const st=streak(id),t=team(id),mine=id===S.userId;
  const heat=mine?100-S.ad.conf:(t.coach?t.coach.heat:40);
  let lastInfo=null;
  if(last){const my=last.h===id?last.hs:last.as,th=last.h===id?last.as:last.hs,favBy=(last.h===id?last.pl:-last.pl)||0;lastInfo={g:last,my,th,win:my>th,mar:Math.abs(my-th),favBy,opp:last.h===id?last.a:last.h,riv:last.riv!=null}}
  let mood=52+(r.w-exp)*9+(st.n?(st.w?Math.min(st.n,6)*4:-Math.min(st.n,6)*5):0)+(k<=5?14:k<=PN?6:0)-(heat-40)*.25;
  if(lastInfo){if(lastInfo.win&&lastInfo.favBy<=-6)mood+=12;if(!lastInfo.win&&lastInfo.favBy>=6)mood-=14;if(lastInfo.riv)mood+=lastInfo.win?8:-8}
  mood=Math.round(clamp(mood,2,98));
  const label=mood>=86?'Euphoric':mood>=72?'Fired up':mood>=58?'Hopeful':mood>=44?'Uneasy':mood>=30?'Restless':mood>=16?'Furious':'Checked out';
  return {p,r,k,pre,st,heat,exp,last:lastInfo,mood,label,next:S.games.filter(g=>!g.done&&(g.h===id||g.a===id)).sort((a,b)=>a.wk-b.wk)[0],mine};
}
function teamFeed(id,n){
  const T=team(id),X=teamState(id),rr=srng(hashS(S.season+':'+S.week+':'+id+':'+(S.feedSeed||0))),pk=a=>a[Math.floor(rr()*a.length)];
  const qb=id===S.userId?S.stars.find(s=>s.pos==='QB'):null;
  const star=id===S.userId?(qb?short(qb.name):'our QB'):(T.star?short(T.star.name):'our QB');
  const rv=rivOf(id),rivId=rv?(rv.a===id?rv.b:rv.a):null;
  const nx=X.next,nxo=nx?(nx.h===id?nx.a:nx.h):null,inj=(S.inj||[]).find(j=>j.team===id&&j.wk>0);
  const v={team:T.name,mascot:T.mascot,abbr:T.abbr,rec:X.r.w+'-'+X.r.l,coach:id===S.userId?S.coach:(T.coach?T.coach.name:'Coach'),star,rank:X.k,streak:X.st.n,conf:CONFS[T.conf],sec:100+Math.floor(rr()*40),
    next:nxo!=null?team(nxo).name:'the bowl game',nextm:nxo!=null?team(nxo).mascot:'opponent',trophy:rv?rv.trophy:'',inj:inj?short(inj.name):''};
  if(X.last){const L=X.last;Object.assign(v,{opp:team(L.opp).name,oppm:team(L.opp).mascot,pts:L.my,score:Math.max(L.my,L.th)+'-'+Math.min(L.my,L.th)});if(L.riv){const rv2=S.rivals[L.g.riv];v.trophy=rv2.trophy}}
  const cand=[];const add=(pool,w,kind)=>cand.push({pool,w,kind:kind||'fan'});
  if(!X.last){add(FP.pre,5);add(FP.next,2)}
  else{const L=X.last;
    if(L.riv)add(L.win?FP.rivW:FP.rivL,6);
    if(L.win){if(L.favBy<=-6)add(FP.upsetW,6);else if(L.mar>=24)add(FP.bigwin,4);else if(L.mar<=3||L.g.ot)add(FP.close,4);add(FP.win,4)}
    else{if(L.favBy>=6)add(FP.upsetL,6);else if(L.mar>=24)add(FP.bigloss,4);else if(L.mar<=3||L.g.ot)add(FP.closeL,4);add(FP.loss,4)}
    const G2=gameSig(L.g);Object.assign(v,G2.v,{pts:G2.ws,oppabbr:team(L.opp).abbr});for(const [pl,w] of sigPools(G2,L.win))add(pl,w);
    if(L.riv){const C=rivCtx(id,L.opp);if(C){Object.assign(v,{ser:C.ser,yrs:C.me+C.th,trophy:C.rv.trophy});add(L.win?FX.badBloodW:FX.badBloodL,4.5);if(C.rv.prev!=null&&C.rv.prev!==C.rv.holder)add(L.win?FX.trophyBack:FX.trophyLost,5);const lp=lorePair(id,L.opp);if(lp)add(lp,2.5)}}
  }
  if(X.r.w+X.r.l>=3){v.pre=X.pre;const lw=X.last?X.last.win:true;if(X.r.w-X.exp>=1.5&&X.pre>=6&&lw)add(FX.overAch,3);else if(X.exp-X.r.w>=1.5&&X.pre<=10&&!lw)add(FX.underAch,3)}
  if(X.st.n>=3)add(X.st.w?FP.streakW:FP.streakL,3);
  if(X.k<=4)add(FP.top,3);else if(X.k<=PN)add(FP.ranked,2);
  if(S.week>=5&&S.week<12){const F=cfpField();if(F.out.includes(id)||(F.seeds.indexOf(id)>=9))add(FP.bubble,3)}
  if(X.heat>=70)add(FP.hotseat,X.heat>=85?5:3);else if(X.mood>=72)add(FP.coachLove,2);
  if(inj)add(FP.injury,3);
  if(nx){if(nx.riv!=null){add(FP.nextRiv,4);const C=rivCtx(id,nxo);if(C){v.nser=C.ser;v.ntrophy=C.rv.trophy;add(FX.rivPre,4);const lp=lorePair(id,nxo);if(lp)add(lp,2)}}else add(FP.next,2);if(upsetAlerts().some(a=>a.g===nx&&a.fav===id))add(FP.nextUp,3)}
  if(rr()<.7)add(FP.star,1.5);
  const tier=T.hist&&T.hist.tier;if(tier==='dynasty')add(FP.dynasty,2);if(tier==='fallen')add(FP.fallen,2.5);if(tier==='basement')add(FP.basement,2.5);if(tier==='rising')add(FP.rising,2);
  if(S.week>=6&&S.week<12&&DIVS){const L2=divLeaders(T.conf,X.p);if(L2.includes(id))add(FP.confRace,2.5)}
  if(T.hist&&T.hist.natl>0){v.lastYear=T.hist.last;v.natl=T.hist.natl;v.nextBanner=T.hist.natl+1;add(FP.titled,1.5)}else if(S.lore&&S.lore.length)add(FP.noTitle,1.2);
  add(FP.life,1.5);
  const out=[],used=new Set();
  const wsum=()=>cand.reduce((a,c)=>a+c.w,0);
  for(let i=0;i<n*3&&out.length<n;i++){
    let x=rr()*wsum(),c=cand[0];for(const cc of cand){x-=cc.w;if(x<=0){c=cc;break}}
    const txt=fill(pk(c.pool),v);if(used.has(txt)||/\{\w+\}/.test(txt))continue;used.add(txt);
    out.push({h:'@'+handle(id,'fan',rr),txt,likes:Math.floor(4+rr()*3900),kind:'fan',team:id});
  }
  if(X.last){const L=X.last,m=L.riv&&S.rivals[L.g.riv]?pk(MEDIA.riv):L.win?(L.favBy<=-6?pk(MEDIA.upW):pk(MEDIA.W)):(L.favBy>=6?pk(MEDIA.upL):pk(MEDIA.L));
    const mv={...v,winner:L.win?T.name:team(L.opp).name};const txt=fill(m,mv);if(!/\{\w+\}/.test(txt))out.splice(1,0,{h:'@'+handle(id,'media',rr),txt,likes:Math.floor(80+rr()*2400),kind:'media',team:id})}
  if(X.heat>=85&&rr()<.8){const txt=fill(pk(MEDIA.heat),v);out.splice(2,0,{h:'@'+handle(id,'media',rr),txt,likes:Math.floor(80+rr()*2400),kind:'media',team:id})}
  const ch=[];
  if(nx&&nx.riv!=null&&rr()<.85)ch.push(...rivalChirps(id,'pre',rr,1,null,nxo));
  if(X.last&&rr()<.85){const L=X.last;ch.push(...rivalChirps(id,L.win?'W':'L',rr,rr()<.5?2:1,{opp:team(L.opp).name,excl:nx&&nx.riv!=null?nxo:-1}))}
  else if(!X.last&&rr()<.5)ch.push(...rivalChirps(id,'pre',rr,1,null));
  ch.forEach((c,i)=>out.splice(Math.min(out.length,2+i*3),0,c));
  return out.slice(0,n);
}
function postsHTML(list){
  return '<div class="feed">'+list.map(p=>{const t=team(p.team);return '<div class="post'+(p.kind==='media'?' media':'')+(p.kind==='rival'?' rival':'')+'"><span class="av" style="background:'+(p.kind==='media'?'#3a4459':t.color)+'">'+(p.kind==='media'?'NEWS':esc(t.abbr))+'</span><div style="min-width:0"><b>'+esc(p.h)+'</b>'+(p.kind==='rival'?' <span class="muted" style="font-size:11.5px">rival fan</span>':'')+'<p>'+esc(p.txt)+'</p><span class="muted num" style="font-size:11.5px">'+p.likes.toLocaleString()+' likes</span></div></div>'}).join('')+'</div>';
}
function moodHTML(id){
  const X=teamState(id),c=X.mood>=58?'var(--good)':X.mood>=30?'var(--amber)':'var(--bad)';
  const why=[];
  if(X.last)why.push((X.last.win?'Won':'Lost')+' '+X.last.my+'-'+X.last.th+' vs '+team(X.last.opp).abbr+(X.last.riv?' (rivalry)':''));
  if(X.st.n>=2)why.push((X.st.w?'Won ':'Lost ')+X.st.n+' straight');
  why.push(X.r.w+'-'+X.r.l+(X.r.w+X.r.l?' vs preseason No. '+X.pre:''));
  if(X.heat>=70)why.push(X.mine?'AD patience running low':'Coach on the hot seat');
  return '<div class="mood"><div class="spread"><span class="eyebrow">Fan mood</span><b style="color:'+c+'">'+X.label+'</b></div><div class="meter"><i style="width:'+X.mood+'%;background:'+c+'"></i></div><span class="muted" style="font-size:12.5px">'+esc(why.join(' · '))+'</span></div>';
}
function feedResult(g){
  const u=S.userId,my=g.h===u?g.hs:g.as,th=g.h===u?g.as:g.hs,opp=g.h===u?g.a:g.h,win=my>th,mar=Math.abs(my-th);
  const favBy=(g.h===u?g.pl:-g.pl)||0,rv=g.riv!=null?S.rivals[g.riv]:null,qb=S.stars.find(s=>s.pos==='QB'),nx=userGame(S.week+1)||null;
  const v={opp:team(opp).name,oppm:team(opp).mascot,team:U().name,mascot:U().mascot,abbr:U().abbr,coach:S.coach,pts:my,star:qb?short(qb.name):'our QB',trophy:rv?rv.trophy:'',rec:recStr(u),streak:streak(u).n,next:nx?team(nx.h===u?nx.a:nx.h).name:'next week',sec:ri(101,140)};
  let pools=[];
  if(rv)pools.push(win?FP.rivW:FP.rivL);
  if(win)pools.push(favBy<=-6?FP.upsetW:mar>=24?FP.bigwin:(mar<=3||g.ot)?FP.close:FP.win,FP.win);
  else pools.push(favBy>=6?FP.upsetL:mar>=24?FP.bigloss:(mar<=3||g.ot)?FP.closeL:FP.loss,FP.loss);
  const st=g.ust;if(st&&st.qb&&st.qb.yds>=300)pools.push(['{star} threw for '+st.qb.yds+' yards. Give him the keys to the city.']);
  if(st&&st.qb&&st.qb.int>=2)pools.push(['Two picks from {star}. We need to talk.','Throw it to the guys in our jerseys, {star}.']);
  const seen=new Set();for(let i=0;i<2;i++){let t='',k=0;do{t=fill(pick(pick(pools)),v);k++}while(seen.has(t)&&k<8);seen.add(t);post(u,t)}
  post(opp,fill(pick(win?(rv?FP.rivalTroll.map(x=>x):FP.loss):(rv?FP.rivW:FP.win)),{...v,team:U().name,opp:U().name,oppm:U().mascot,mascot:team(opp).mascot,abbr:U().abbr,rec:recStr(opp),coach:'Coach',trophy:v.trophy,star:'our QB',streak:streak(opp).n,next:'next week'}));
  const sc=Math.max(my,th)+'-'+Math.min(my,th),mv={...v,score:sc,rec:recStr(u),winner:win?U().name:team(opp).name};
  post(u,fill(pick(rv?MEDIA.riv:win?(favBy<=-6?MEDIA.upW:MEDIA.W):(favBy>=6?MEDIA.upL:MEDIA.L)),mv),'media');
  if(S.ad.conf<35&&R()<.7)post(u,fill(pick(FP.hotseat),v));
}

/* ---------- press conference ---------- */
const PQ={
 W:['Solid win today. How do you feel about where this team is?','What did you see from your team today that you liked?','You moved to {rec}. What is working right now?','Was that the complete game you have been looking for?','Talk about the energy on your sideline today.'],
 L:['Tough loss. What do you tell your locker room tonight?','What went wrong out there today?','You fall to {rec}. How do you get this turned around?','Was this a talent issue or an execution issue?','Where does this team go from here?'],
 upW:['Nobody outside your building gave you a chance today. What changed?','You were a {line}-point underdog. Did you believe you would win this?','Is this the biggest win of your tenure?','What does this win do for your program nationally?'],
 upL:['You were {line}-point favorites. What happened out there?','Did your team overlook {opp}?','How do you explain losing a game like that?','Is this a wake-up call?'],
 bigW:['You put {my} on {opp}. Was there any thought of easing off?','How much of that was your team, and how much was {opp}?','Is this team as good as it looked today?'],
 bigL:['That one got away early. Where does this team go from here?','Your team looked overmatched. Fair or unfair?','What did you say at halftime?'],
 rivW:['You {keep} {trophy}. What does this rivalry mean to your program?','How sweet is it to beat {opp}?','What did you tell the team about this rivalry before kickoff?'],
 rivL:['{opp} takes {trophy}. What do you say to your fans tonight?','How much does losing this rivalry sting?','Your fans wanted this one badly. What happened?'],
 post:['Huge win on a big stage. What does this do for your program?','Your team rose to the moment. What was the difference?','How far can this team go?'],
 postL:['Your season ends tonight. What will you remember about this group?','What do you say to your seniors?','Where does the program go from here?'],
 star:['{star} was outstanding today. What makes him so tough to stop?','Is {star} the best player in this league?'],
 to:['{to} turnovers today. How concerning is that?','Ball security was a problem. How do you fix it?'],
 inj:['How is your team handling the loss of {inj}?','Who steps up with {inj} out?'],
 next:['{next} is up next. What worries you about them?','You face {next} next week. How do you prepare for that?','Rivalry week is next. Are your players thinking about {next} already?'],
 hot:['There is a lot of talk about your job security. Your response?','Do you feel the pressure from the administration right now?'],
 rivPoW:['You ended {opp}\'s season in a rivalry game. Describe that feeling.','Is this the biggest win in the history of this rivalry?','How do you keep your team grounded after a win like this?'],
 playoff:['You are in the playoff picture. Are you watching the rankings?','What would making the 12-team field mean for this program?']
};
const PA={
 humble:['It is all about our players. They prepared all week and it showed.','Credit to our kids. They did the work.','Our assistants put together a great plan and the players executed it.','I just try to stay out of their way. These guys are special.','Proud of how hard this group plays for each other.'],
 bold:['We expect to win every week. Nobody in this league wants to see us.','We are just getting started.','Write it down. This team is going to make some noise.','We belong with anybody in the country.','Everybody counted us out. Keep doing it.'],
 focus:['We will enjoy it tonight. Tomorrow it is on to {next}.','One game at a time. That is all we care about.','Nice win, but we left plays out there. Back to work.','Twenty-four hours to enjoy it, then it is {next} week.'],
 own:['That one is on me. I did not have us ready.','I have to coach better. Simple as that.','Put this one on my shoulders, not the players.','We were not prepared, and that starts with me.'],
 callout:['Some guys need to look in the mirror. The effort was not good enough.','We have players who are not playing to our standard. That changes Monday.','Nobody is guaranteed a starting spot after today.','We will find out who wants to compete this week in practice.'],
 refs:['I am not going to talk about the officiating. You all saw it.','I will let the conference office look at the film.','I have some questions about a few calls, but I will keep them to myself.','Tough to win when it feels like 11 against 14.']
};
const PRA={
 W:{humble:['0|Where is this team? Exactly where our players put it. They did the boring stuff right all week.','1|What I liked was how hard we played for each other. Nobody cared who got the credit.','2|What is working is our kids trusting the plan. Credit to them and to our assistants.','3|Complete? Close. And every bit of it was our players, not me.','4|That energy was all our players. They brought it from the first snap.','Proud of these kids. They earned this one.'],
  bold:['0|Where is this team? Climbing. Nobody wants to see us right now.','1|What did I like? Everything. And we have not even played our best yet.','2|{rec} and it is working because we are better than people think. Keep sleeping on us.','3|Complete game? Not yet, and that should scare the rest of this league.','4|That sideline was rocking. That is the standard now.','We are just getting started.'],
  focus:['0|Where we are does not matter. Where we are next week does. That is {next}.','3|We left plays out there. We fix those Monday and move on to {next}.','Good win. We enjoy it tonight, and tomorrow it is all {next}.','One week at a time. This week is {next}.']},
 L:{own:['0|I told them this one is on me. I did not have them ready.','1|What went wrong starts with the head coach. I called a bad game and we did not adjust.','2|How do we turn it around? I coach better. It starts in my office tomorrow morning.','3|Talent or execution? Neither. It was coaching, and that is me.','4|Where do we go? Wherever I lead them. I have to be better.','Put this one on me, not the players.'],
  callout:['0|I told them the truth. Some guys did not play to our standard, and that changes Monday.','1|What went wrong is effort. We had guys loafing, and the film will show it.','2|We turn it around with competition. Every starting spot is open this week.','3|Execution. We have the talent. Some guys just did not show up today.','4|We go to practice and find out who wants to play. Some guys answered that today.','Some guys need to look in the mirror.'],
  refs:['0|I told them they played hard enough to win. Some things were out of our control today.','1|What went wrong? A couple of calls I will let the conference office look at.','3|Talent was fine. Hard to execute when it feels like eleven against fourteen.','I am not going to talk about the officiating. You all saw it.'],
  focus:['Flush it, learn from it, go get {next}.','We watch the film, we fix it, and we move on. {next} does not care how we feel tonight.']},
 upW:{humble:['0|What changed is our players believed. Nobody gave them a chance and they did not care.','1|Did I believe? I believed in this group. The {line} points were for everybody else.','2|Biggest win? Ask me in December. Tonight it is about how hard these kids played.','3|Nationally? I hope people notice our players. They deserve it.','Credit to our kids. They believed when nobody else did.'],
  bold:['0|Nothing changed. We knew we could play with them. Now everybody knows.','1|A {line}-point underdog? Keep doing that. We like it.','2|Biggest win so far. There are bigger ones coming.','3|What does it do nationally? It tells people to stop sleeping on us.','Everybody counted us out. Keep doing it.'],
  focus:['Great win, but it only counts once. {next} is next and that is all that matters now.','We will enjoy this one tonight. Tomorrow we turn the page to {next}.']},
 upL:{own:['0|What happened is I did not have them ready. Favored by {line} and we played like we read the headlines. That is on me.','1|Did we overlook {opp}? If we did, that is my fault. I set the tone all week.','2|How do I explain it? I cannot, other than I did not do my job this week.','3|Wake-up call? For me first. I have to be better.'],
  callout:['0|What happened is some guys thought this one would be easy.','1|We overlooked {opp}. I saw it in practice and did not like it.','2|I explain it with effort. We did not bring it, plain and simple.','3|It is a wake-up call for anybody who thinks the name on the jersey wins games.'],
  refs:['0|A few calls went the wrong way at the wrong time. I will leave it there.','I am not saying we got robbed. I am just saying go watch the film.']},
 bigW:{humble:['0|Easing off? We played a lot of young guys late. That is a credit to our depth.','1|It was our guys executing. {opp} is a good program and they will bounce back.','2|Is this team that good? Our players think so, and they earned that.'],
  bold:['0|Ease off? Sixty minutes, every week. That is who we are.','1|That was all us. {my} points and I think we left some out there.','2|That good? Turn on the film and tell me who wants to play us.'],
  focus:['A win is a win. One or forty, it does not matter. On to {next}.','Style points do not matter to us. Clean up the mistakes and get ready for {next}.']},
 bigL:{own:['0|It got away early because I did not have a plan for what they did. That is on me.','1|Overmatched? Today, yes. And the head coach is responsible for that.','2|At halftime I told them I owed them a better plan.'],
  callout:['0|Where do we go? We find out who wants to compete. Some guys quit today.','1|Overmatched is fair. Some guys played scared.','2|At halftime I asked who wanted to play. Not enough hands went up.'],
  focus:['It counts as one loss. Look at the film, get better, move to {next}.','You do not make it worse by moping. We fix it and get ready for {next}.']},
 rivW:{humble:['0|This rivalry means everything to our community. {trophy} belongs to our fans and our seniors.','1|It is sweet because of how hard our kids worked for it. Credit to {opp} for a heck of a game.','2|Before kickoff I told them to play for the guys who came before them. They did.'],
  bold:['0|{trophy} is staying where it belongs. Tell {opp} to come try again next year.','1|How sweet? Sweetest thing in the world. Our house, our trophy.','2|I told them this is our state. They went out and proved it.'],
  focus:['We celebrate tonight, no question. Then {next} is next.','Great win, great rivalry. One night and then back to work.']},
 rivL:{own:['0|To our fans: I am sorry. This game matters more than any other and I did not get it done.','1|It stings. It should sting. And the guy who fixes it is me.','2|What happened is I got outcoached in the game that matters most.'],
  callout:['0|I will tell our fans what I told the team. That effort is not good enough in this rivalry.','1|It stings, and some guys did not understand what this game means. They will now.','2|{opp} wanted it more today. That should bother every guy in our locker room.'],
  refs:['0|Our fans saw what I saw. I will leave it to the conference office.','1|It stings more when a couple of calls decide a rivalry game.']},
 post:{humble:['0|What it does is reward these kids for every early morning. This is their moment.','1|The difference was our seniors. They would not let this group lose.','2|How far? As far as our players take it. I just get to watch.'],
  bold:['0|It tells the country we are for real. And we are not done.','1|The difference? We are better. Simple as that.','2|How far can we go? All the way. Why not us?'],
  focus:['Huge win. We get a night and then we are right back at it.','We will enjoy it, but there is more football to play.']},
 postL:{humble:['0|I will remember a group that loved each other. Proud of every one of them.','1|To our seniors: thank you. You changed this program.','2|Where do we go? Forward. These guys built something.'],
  own:['0|I will remember how hard they played, and that I did not get them over the hump.','1|Our seniors deserved a better ending. That falls on me.','2|Where do we go? It starts with me being better.'],
  bold:['0|I will remember that they set the standard. We will be back here.','1|To our seniors: we will finish what you started.','2|Right back to this stage. And next time we win it.']},
 star:{humble:['0|What makes {star} tough? He makes everybody around him better. He would tell you it is the guys up front.','1|Best in the league? He would say it is his line. I will just say he is special.'],
  bold:['0|Nobody has an answer for {star}. Good luck to everybody else.','1|Best in the league? Not close. Put {star} against anybody in the country.'],
  focus:['{star} played great, and he will tell you he left plays out there.','He had a good day. We need another one against {next}.']},
 to:{own:['0|{to} turnovers is on me. We have to coach ball security better, period.','1|We fix it by coaching it harder. That starts with me.'],
  callout:['0|{to} turnovers is unacceptable. Guys who do not protect the football will not play.','1|You fix it by benching people. That is how it gets fixed.'],
  focus:['0|You cannot turn it over {to} times and expect to win. We drill it all week.','1|Ball security every single day this week. That is the fix.']},
 inj:{humble:['0|Losing {inj} hurts. He is a leader. Our guys have rallied around each other.','1|Whoever steps up, he prepared like a starter. Credit to our backups.'],
  focus:['0|We do not make excuses. {inj} is out, and the next guy has to be ready.','1|Whoever earns it in practice this week.'],
  bold:['0|Missing {inj} and we keep finding ways. Tells you about our depth.','1|Somebody new is going to make a name for himself. Watch.']},
 next:{focus:['0|What worries me about {next}? Everything. They are well coached.','1|Same as every week. {next} gets our full attention starting tomorrow.','2|Our guys know what rivalry week means. We will be ready for {next}.'],
  bold:['0|Worried? We are excited. {next} should be worried about us.','1|How do we prepare? Same as always. And then we go win.','2|Our guys have been thinking about {next} since last year. Bring it on.'],
  humble:['0|{next} is as good as anybody we will see. A lot of respect for that program.','1|We will have to play our best game of the year against {next}.','2|It is the game our fans circle every year. We have a lot of respect for {next}.']},
 hot:{own:['0|My job security? I get paid to win, and right now I am not doing enough of it. I own that.','1|Pressure comes with the job. I put more on myself than anybody.'],
  bold:['0|I am not going anywhere. This program is heading the right way and I will prove it.','1|Pressure? I do not feel it. I feel like we are close.'],
  focus:['0|I do not think about that. I think about {next}.','1|Not my concern. My concern is getting this team better this week.'],
  humble:['0|Our administration has been great to me. I put my head down and work.','1|I am grateful for this job every day. My focus is on our players.'],
  callout:['1|The pressure should be on our players too. Everybody needs to look in the mirror.']},
 rivPoW:{humble:['0|Our players will remember this forever. Our fans deserved it. Credit to {opp}, they made us earn every inch.','1|Biggest? Ask our fans. I just know these kids played their hearts out.','2|These guys are humble. They know we have more football to play.'],
  bold:['0|Feels like the {trophy} is ours for a long time. Sorry, {opp}.','1|Biggest win in this rivalry ever. Our fans will be talking about it for fifty years.','2|Grounded? We are not done. Everybody left in this bracket should be nervous.'],
  focus:['0|Great feeling. We get a night. Then we move on, because there is more football to play.','1|History can wait. We have another game.','2|We celebrate tonight and we are back in the building tomorrow.']},
 playoff:{focus:['0|Watching the rankings? No. Take care of {next} and the rankings take care of themselves.','1|We do not look at the bracket. We look at the next opponent.'],
  bold:['0|Sure I am watching, and we should be higher. Put us in.','1|It would mean we did what we said we would do. And we are not done.'],
  humble:['0|Our players have earned the right to be in the conversation.','1|It would mean the world to this community. A lot of football left, though.']}
};
function praPick(arr,qi){const tagged=arr.filter(a=>a.startsWith(qi+'|')),gen=arr.filter(a=>!/^\d\|/.test(a));const pool=tagged.length&&(R()<.8||!gen.length)?tagged:(gen.length?gen:arr);return pick(pool).replace(/^\d\|/,'')}
const PFX={humble:'Steady. +1 next game, the AD likes it.',bold:'Fires your team up (+2 next game). Win next week and the AD loves it. Lose and it stings.',focus:'Locked in. +2 next game, no drama.',own:'The AD respects it (+2). +1 next game.',callout:'Team responds (+3 next game). AD -1.',refs:'Fans love it. The AD does not (-3).'};
function buildPresser(g){
  const u=S.userId,my=g.h===u?g.hs:g.as,th=g.h===u?g.as:g.hs,opp=g.h===u?g.a:g.h,win=my>th,mar=Math.abs(my-th);
  const favBy=(g.h===u?g.pl:-g.pl)||0,rv=g.riv!=null?S.rivals[g.riv]:null,O=team(opp).name;
  const nx=userGame(S.week),nxo=nx?team(nx.h===u?nx.a:nx.h).name:'the offseason',qb=S.stars.find(s=>s.pos==='QB'),inj=(S.inj||[]).find(j=>j.team===u&&j.wk>0);
  const over=(g.po||g.bowl)&&!win;
  const v={rec:recStr(u),line:fmtLine(Math.abs(favBy)),opp:O,my,trophy:rv?rv.trophy:'',keep:rv&&rv.prev===u?'keep':'take back',star:qb?short(qb.name):'your quarterback',to:g.ust&&g.ust.to!=null?g.ust.to:0,inj:inj?short(inj.name):'',next:nxo};
  let main;
  if(over)main='postL';else if(rv&&win&&bigRiv(g))main='rivPoW';else if(rv)main=win?'rivW':'rivL';else if(win&&favBy<=-6)main='upW';else if(!win&&favBy>=6)main='upL';else if(win&&mar>=24)main='bigW';else if(!win&&mar>=24)main='bigL';else if(win&&(g.po||g.bowl||g.ccg!=null))main='post';else main=win?'W':'L';
  const side=[];
  if(win&&g.ust&&g.ust.qb&&g.ust.qb.yds>=280&&qb&&!userInj('QB'))side.push('star');
  if(g.ust&&g.ust.to>=3)side.push('to');
  if(inj)side.push('inj');
  if(nx&&(nx.riv!=null||rankOf(nx.h===u?nx.a:nx.h)<=8))side.push('next');
  if(S.ad.conf<35)side.push('hot');
  if(S.week>=6&&S.week<12&&cfpField().seeds.indexOf(u)>=6)side.push('playoff');
  const key=side.length&&R()<.4?pick(side):main;
  let qi=Math.floor(R()*PQ[key].length);if(key==='next'&&!(nx&&nx.riv!=null)&&qi===2)qi=Math.floor(R()*2);if(key==='next'&&nx&&nx.riv!=null)qi=2;
  const q=fill(PQ[key][qi],v);
  const base=PRA[key]||PRA[win?'W':'L'];
  let keys=Object.keys(base);
  const pref=win?['humble','bold','focus']:['own','callout','refs','focus'];
  const rk=k=>{const i=pref.indexOf(k);return i<0?50+Object.keys(base).indexOf(k):i};
  keys=keys.sort((a,b)=>rk(a)-rk(b)).slice(0,3);
  const lbl={humble:'Credit the players',bold:'Talk big',focus:'Next game only',own:'Take the blame',callout:'Call out the team',refs:'Hint at the refs'};
  if(over)lbl.bold='Promise a comeback';
  const opts=keys.map(k=>({k,l:lbl[k],q:fill(praPick(base[k],PRA[key]?qi:-1),v),fx:over?'Sets the tone for the offseason.':PFX[k]}));
  const reporter=pick(['Dana','Mike','Rachel','Tom','Jess','Carl','Leah','Marcus'])+' '+pick(['Holt','Reyes','Park','Bennett','Cole','Ward','Ibarra','Finch']);
  return {q,opts,score:(win?U().abbr+' '+my+', '+team(opp).abbr+' '+th:team(opp).abbr+' '+th+', '+U().abbr+' '+my),win,wk:g.wk,outlet:reporter+', '+pick(['Sideline Report',CONFS[U().conf]+' Huddle','Saturday Notebook','Channel 6 Sports','The Film Room Pod','KickoffDesk'])};
}
function answerPresser(i){
  const P=S.presser,o=P&&P.opts[i];
  if(o){
    const fx={humble:[1,1],bold:[2,0],focus:[2,0],own:[1,2],callout:[3,-1],refs:[1,-3]}[o.k];
    S.pb={v:fx[0],wk:S.week,bold:o.k==='bold'};S.ad.conf=clamp(S.ad.conf+fx[1],0,100);
    const body={humble:'A classy answer that went over well with the administration.',bold:'Bulletin board material for '+(userGame(S.week)?team(userGame(S.week).h===S.userId?userGame(S.week).a:userGame(S.week).h).name:'next season')+'.',focus:'All business. The team is already on to next week.',own:'Accountability from the head coach after a rough day.',callout:'A pointed message for the locker room. Expect a response at practice.',refs:'The conference office may have something to say about that.'}[o.k];
    const k=String(P.wk);S.news[k]=S.news[k]||[];S.news[k].splice(1,0,{tag:'Press',score:30,team:S.userId,title:S.coach+': "'+o.q+'"',body});
    const react={humble:['Classy as always, Coach.','This is why we love {coach}.'],bold:['COACH SAID WHAT HE SAID','Bulletin board material and I am here for it.','Love the confidence. Now back it up.'],focus:['No celebrating, just work. Love it.'],own:['Respect for owning it, Coach.','Accountability. That is a leader.'],callout:['Somebody is running stairs tomorrow.','Needed to be said.'],refs:['Coach is right. Refs were awful.','He said it without saying it.','The zebras were not on our side today.']}[o.k];
    post(S.userId,pick(react).replace('{coach}',S.coach));
  }
  S.presser=null;S.view=S.afterPress||'hub';
}
function presserView(){
  const P=S.presser;
  return '<div class="hero"><span class="eyebrow">Postgame press conference</span><h1>'+esc(P.score)+'</h1></div>'+
    '<section class="card podium"><span class="muted" style="font-size:12.5px">'+esc(P.outlet)+'</span><p class="pq">"'+esc(P.q)+'"</p></section>'+
    '<div class="calls one">'+P.opts.map((o,i)=>'<button class="call" data-act="press" data-i="'+i+'"><span class="f">'+esc(o.l)+'</span><b class="qb">"'+esc(o.q)+'"</b><span>'+esc(o.fx)+'</span></button>').join('')+'</div>'+
    '<button class="toggle" data-act="press" data-i="-1">No comment. Skip the presser.</button>';
}
function feedCard(n){
  const mineFeed=(S.feed||[]).filter(p=>p.season===S.season||p.season==null).slice(0,3);
  const gen=teamFeed(S.userId,Math.max(2,n-mineFeed.length));
  const list=[...mineFeed,...gen].slice(0,n);if(!list.length)return '';
  return '<section class="card"><div class="spread"><h3>Fan feed</h3><button class="lnk" data-act="vsched" data-id="'+S.userId+'">See more</button></div>'+moodHTML(S.userId)+postsHTML(list)+'</section>';
}

/* ---------- bowl projections ---------- */
function bowlProj(){
  const p=poll(),elig=p.filter(id=>{const r=rec(id),gp=r.w+r.l;return gp?r.w/gp*12>=6:true});
  const playoff=cfpField().seeds,rest=elig.filter(id=>!playoff.includes(id)).slice(0,12),bowls=[];
  for(let i=0;i+1<rest.length&&bowls.length<BOWLS.length;i+=2)bowls.push({name:BOWLS[bowls.length],a:rest[i],b:rest[i+1]});
  return {playoff,bowls};
}
function myProj(){
  const b=bowlProj(),u=S.userId,pi=b.playoff.indexOf(u);
  if(pi>=0)return 'Playoff, No. '+(pi+1)+' seed'+(pi<4?' (bye)':'');
  if(cfpField().out.includes(u))return 'First four out of the playoff';
  const bw=b.bowls.find(x=>x.a===u||x.b===u);
  if(bw)return bw.name+' vs '+team(bw.a===u?bw.b:bw.a).abbr;
  return rec(u).w+rec(u).l>0?'On the bowl bubble':null;
}

/* ---------- 12-team playoff ---------- */
const CFP_QF=['Lakeshore Bowl','Prairie Wind Bowl','Saltwater Bowl','Copper Canyon Bowl'],CFP_SF=['Riverboat Bowl','Magnolia Blossom Bowl'];
const R1=[['A',8,9],['B',5,12],['C',7,10],['D',6,11]],QF=[['QA',1,'A'],['QB',4,'B'],['QC',2,'C'],['QD',3,'D']];
/* Standings order: conference win pct. Ties: head to head among the tied teams. If that does not separate them (like a three-way circle), best overall record. */
function confPct(id){const r=rec(id);return r.cw+r.cl?r.cw/(r.cw+r.cl):0}
function breakTie(grp,p){
  if(grp.length<2)return grp;
  const ov=id=>{const r=regRec(id);return r.w+r.l?r.w/(r.w+r.l):0};
  // pick the top team; whenever a step trims the tie, start over with head-to-head among the teams still tied
  const top=g=>{if(g.length===1)return g[0];
    const h2h=id=>{let w=0,l=0;for(const x of S.games)if(x.done&&x.conf&&x.ccg==null&&((x.h===id&&g.includes(x.a))||(x.a===id&&g.includes(x.h))))winnerOf(x)===id?w++:l++;return w+l?w/(w+l):.5};
    for(const f of [h2h,ov]){const v={};g.forEach(id=>v[id]=f(id));const mx=Math.max(...g.map(id=>v[id]));const b=g.filter(id=>v[id]===mx);if(b.length<g.length)return top(b)}
    return g.slice().sort((a,b)=>rankOf(a,p)-rankOf(b,p))[0]};
  const out=[],rest=grp.slice();while(rest.length){const t=top(rest);out.push(t);rest.splice(rest.indexOf(t),1)}
  return out;
}
/* one-time repair: a playoff field picked before conference title game losses were treated fairly */
function fixField(){
  if(!S||!S.post||!S.post.seeds||S.post.seeds.length!==12||S.fieldFix===S.season||S.week!==13)return;S.fieldFix=S.season;
  if(S.games.some(g=>g.wk>=13&&g.done)||S.game)return;
  const old=S.post.seeds.slice();S.post.seeds=null;const F=cfpField();
  if(F.seeds.join(',')===old.join(',')){S.post.seeds=old;return}
  S.games=S.games.filter(g=>!(g.wk===13&&(g.po||g.bowl)));S.post={};if(S.news&&S.news[12])S.news[12]=S.news[12].filter(n=>!(n.tag==='Playoff'||(n.tag==='Your team'&&/seed|first four out/.test(n.title))));
  makePlayoff();tagRivals();
  const inn=F.seeds.filter(id=>!old.includes(id)),out=old.filter(id=>!F.seeds.includes(id));
  if(inn.length&&S.news){S.news[12]=S.news[12]||[];S.news[12].splice(1,0,{tag:'Playoff',score:59,team:inn[0],title:'Committee correction: '+inn.map(id=>team(id).name).join(', ')+' in',body:'Losing a conference title game no longer drags a team under a losing-record penalty. '+inn.map(id=>team(id).name+' ('+recStr(id)+')').join(', ')+' moves into the field and '+out.map(id=>team(id).name+' ('+recStr(id)+')').join(', ')+' moves out.'})}
}
/* one-time repair: title games set under the old tiebreaker */
function fixCCG(){
  if(!S||!S.games||S.ccgFix===S.season)return;S.ccgFix=S.season;
  const p=poll(),out=[];
  for(const g of S.games){if(g.ccg==null||g.done||g.pre||(S.game&&S.games[S.game.gid]===g))continue;
    const L2=confOrder([divLeaders(g.ccg,p)[0],divLeaders(g.ccg,p)[1]],p);const was=[g.h,g.a];
    if(new Set(L2).size===2&&!(was.includes(L2[0])&&was.includes(L2[1]))){g.h=L2[0];g.a=L2[1];delete g.env;delete g.hr;delete g.ar;delete g.pl;out.push({c:g.ccg,was,now:L2})}}
  if(out.length&&S.news){const k=String(S.week-1);S.news[k]=S.news[k]||[];for(const x of out){const gone=x.was.find(id=>!x.now.includes(id)),inn=x.now.find(id=>!x.was.includes(id));if(gone!=null&&inn!=null)S.news[k].unshift({tag:'Your league',score:55,team:inn,title:team(inn).name+' gets the '+CONFS[x.c]+' title game spot',body:'A second look at the tiebreaker: once the three-way tie was down to two teams, head-to-head decides it. '+team(inn).name+' beat '+team(gone).name+' this season, so '+team(inn).name+' plays for the '+CONFS[x.c]+' title.'})}}
  return out;
}
function confOrder(ids,p){
  const base=ids.slice().sort((a,b)=>confPct(b)-confPct(a)),out=[];
  for(let i=0;i<base.length;){let j=i+1;while(j<base.length&&confPct(base[j])===confPct(base[i]))j++;out.push(...breakTie(base.slice(i,j),p));i=j}
  ids.length=0;ids.push(...out);return ids;
}
function divLeaders(c,p){
  const ids=S.teams.filter(t=>t.conf===c).map(t=>t.id);
  if(ids.every(id=>team(id).div!=null)){const d0=confOrder(ids.filter(id=>team(id).div===0),p),d1=confOrder(ids.filter(id=>team(id).div===1),p);if(d0.length&&d1.length)return [d0[0],d1[0]]}
  const o=confOrder(ids,p);return [o[0],o[1]];
}
function projChamp(c,p){
  if(S.champs&&S.champs.conf[c]!=null)return S.champs.conf[c];
  const cg=S.games.find(g=>g.ccg===c);if(cg&&cg.done)return winnerOf(cg);
  const L2=divLeaders(c,p);return rankOf(L2[0],p)<=rankOf(L2[1],p)?L2[0]:L2[1];
}
function cfpField(){
  const p=poll();
  if(S.post&&S.post.seeds&&S.post.seeds.length===12)return {seeds:S.post.seeds,auto:new Set(S.post.auto||[]),out:S.post.out||[],locked:true};
  const champs=[0,1,2,3].map(c=>projChamp(c,p)),auto=new Set(champs);
  const field=[...auto];for(const id of p){if(field.length>=12)break;if(!field.includes(id))field.push(id)}
  const seeds=field.sort((a,b)=>p.indexOf(a)-p.indexOf(b));
  return {seeds,auto,out:p.filter(id=>!seeds.includes(id)).slice(0,4),locked:false};
}
const brGame=br=>S.games.find(g=>g.po&&g.br===br);
const brWin=br=>{const g=brGame(br);return g&&g.done?winnerOf(g):null};
const seedN=id=>S.post&&S.post.seeds?S.post.seeds.indexOf(id)+1:0;
function makePlayoff(){
  const F=cfpField();S.post.seeds=F.seeds;S.post.auto=[...F.auto];S.post.out=F.out;
  const sd=n=>F.seeds[n-1];
  for(const [br,a,b] of R1)S.games.push({wk:13,h:sd(a),a:sd(b),neutral:false,done:false,tag:'CFP First Round',po:true,br});
  const r=rec(S.userId);
  if(!F.seeds.includes(S.userId)&&r.w>=6){
    const bp=bowlProj().bowls.find(x=>x.a===S.userId||x.b===S.userId);
    const p=poll(),pool=p.filter(id=>id!==S.userId&&!F.seeds.includes(id)).sort((a,b)=>Math.abs(rankOf(a,p)-rankOf(S.userId,p))-Math.abs(rankOf(b,p)-rankOf(S.userId,p)));
    let opp=pool[0],name=pick(BOWLS);if(bp){name=bp.name;const o=bp.a===S.userId?bp.b:bp.a;if(!F.seeds.includes(o))opp=o}
    S.post.bowl={opp,name};S.games.push({wk:13,h:S.userId,a:opp,neutral:true,done:false,tag:name,bowl:true});
  }
  const N=id=>team(id).name;
  S.news[12]=S.news[12]||[];
  S.news[12].unshift({tag:'Playoff',score:60,team:F.seeds[0],title:'The 12-team field is set',body:'Byes: '+F.seeds.slice(0,4).map((id,i)=>(i+1)+'. '+N(id)).join(', ')+'. First round: '+R1.map(([br,a,b])=>a+' '+team(sd(a)).abbr+' hosts '+b+' '+team(sd(b)).abbr).join('; ')+'. First four out: '+F.out.map(id=>team(id).abbr).join(', ')+'.'});
  if(F.seeds.includes(S.userId)){const n=F.seeds.indexOf(S.userId)+1;S.news[12].splice(1,0,{tag:'Your team',score:58,team:S.userId,title:N(S.userId)+' is in as the No. '+n+' seed',body:n<=4?'A first-round bye and a quarterfinal in the '+CFP_QF[[0,2,3,1][n-1]]+'.':'A home playoff game in the first round'+(n>8?' on the road':'')+'.'})}
  else if(F.out.includes(S.userId))S.news[12].splice(1,0,{tag:'Your team',score:58,team:S.userId,title:N(S.userId)+' is among the first four out',body:'So close. The committee left you on the outside.'});
}
function makeQF(){
  const sd=n=>S.post.seeds[n-1];
  QF.forEach(([br,s,from],i)=>{const a=sd(s),b=brWin(from);if(b!=null)S.games.push({wk:14,h:a,a:b,neutral:true,done:false,tag:'CFP Quarterfinal · '+CFP_QF[i],po:true,br})});
}
function makeSF(){
  [['SA','QA','QB'],['SB','QC','QD']].forEach(([br,x,y],i)=>{let a=brWin(x),b=brWin(y);if(a==null||b==null)return;if(seedN(b)<seedN(a))[a,b]=[b,a];S.games.push({wk:15,h:a,a:b,neutral:true,done:false,tag:'CFP Semifinal · '+CFP_SF[i],po:true,br})});
}
function makeFinal(){
  let a=brWin('SA'),b=brWin('SB');if(a==null||b==null)return;if(seedN(b)<seedN(a))[a,b]=[b,a];
  S.games.push({wk:16,h:a,a:b,neutral:true,done:false,tag:'National Championship',po:true,final:true,br:'F'});
}
function bracketCard(){
  const F=cfpField(),u=S.userId,sd=n=>F.seeds[n-1];
  const tm=(id,n)=>'<span class="bt'+(id===u?' me':'')+'"><span class="sn">'+n+'</span>'+mlogo(team(id))+''+esc(team(id).abbr)+(F.auto.has(id)?'<span class="abid" title="Conference champion">C</span>':'')+' <span class="muted num">'+recStr(id)+'</span></span>';
  const gm=(g)=>{const w=g.done?winnerOf(g):null;const side=(id,pts)=>'<span class="bt'+(id===u?' me':'')+(w===id?' bw':'')+'"><span class="sn">'+seedN(id)+'</span>'+mlogo(team(id))+''+esc(team(id).abbr)+(g.done?' <b class="num">'+pts+'</b>':'')+'</span>';return '<div class="bm">'+side(g.a,g.as)+'<span class="muted">'+(g.neutral?'vs':'at')+'</span>'+side(g.h,g.hs)+(g.tag&&g.tag.includes('·')?'<span class="muted bmt">'+esc(g.tag.split('· ')[1])+'</span>':'')+'</div>'};
  const proj=(a,txt)=>'<div class="bm">'+a+'<span class="muted">vs</span><span class="muted" style="font-size:12.5px">'+txt+'</span></div>';
  let h='<section class="card"><div class="spread"><h3>'+(F.locked?'College Football Playoff':'Playoff outlook')+'</h3><span class="muted" style="font-size:12px">'+(F.locked?'12-team bracket':'If the season ended today')+'</span></div>';
  h+='<p class="muted" style="font-size:12.5px">12 teams: the 4 conference champions (C) plus the next 8 highest ranked. Seeded by ranking. Seeds 1 to 4 get byes.</p>'+(F.locked&&S.view!=='selection'?'<div class="row"><button class="btn ghost small" data-act="selwatch">Rewatch the selection show</button></div>':'');
  h+='<p class="eyebrow">First round'+(F.locked?'':' (at the higher seed)')+'</p><div class="br">'+R1.map(([br,a,b])=>{const g=brGame(br);return g?gm(g):'<div class="bm">'+tm(sd(b),b)+'<span class="muted">at</span>'+tm(sd(a),a)+'</div>'}).join('')+'</div>';
  h+='<p class="eyebrow">Quarterfinals</p><div class="br">'+QF.map(([br,s,from],i)=>{const g=brGame(br);if(g)return gm(g);const w=brWin(from);const r1=R1.find(x=>x[0]===from);return w!=null?proj(tm(sd(s),s),'No. '+seedN(w)+' '+team(w).abbr+' · '+CFP_QF[i]):proj(tm(sd(s),s),'Winner of '+r1[1]+'/'+r1[2]+' · '+CFP_QF[i])}).join('')+'</div>';
  const sf=['SA','SB'].map(brGame).filter(Boolean),fin=brGame('F');
  if(sf.length)h+='<p class="eyebrow">Semifinals</p><div class="br">'+sf.map(gm).join('')+'</div>';
  if(fin)h+='<p class="eyebrow">National Championship</p><div class="br">'+gm(fin)+'</div>';
  if(!F.locked&&F.out.length)h+='<p class="muted" style="font-size:13px">First four out: '+F.out.map(id=>'<span class="'+(id===u?'amber':'')+'">'+esc(team(id).abbr)+' ('+recStr(id)+')</span>').join(', ')+'</p>';
  const mi=F.seeds.indexOf(u);
  h+='<p style="font-size:13.5px;font-weight:600">'+(mi>=0?'You: No. '+(mi+1)+' seed'+(mi<4?' with a bye':'')+(F.auto.has(u)?', conference champion':''):F.out.includes(u)?'You: first four out. Win and get help.':'You: outside the field right now.')+'</p></section>';
  return h;
}

/* ---------- strength of schedule ---------- */
let SOSC={k:'',r:null};
function sosRanks(){
  const key=S.season+':'+S.week+':'+S.games.filter(g=>g.done).length;
  if(SOSC.k===key&&SOSC.r)return SOSC.r;
  const str=id=>{const t=team(id),r=rec(id),gp=r.w+r.l;return (t.off+t.def)/2+(gp?(r.w/gp-.5)*14:0)};
  const sc=S.teams.map(t=>{const op=S.games.filter(g=>g.wk<12&&(g.h===t.id||g.a===t.id)).map(g=>g.h===t.id?g.a:g.h);return {id:t.id,v:op.reduce((a,o)=>a+str(o),0)/Math.max(1,op.length)}}).sort((a,b)=>b.v-a.v);
  const r={};sc.forEach((x,i)=>r[x.id]=i+1);SOSC={k:key,r};return r;
}
const ordN=n=>n+(n%100>=11&&n%100<=13?'th':['th','st','nd','rd','th','th','th','th','th','th'][n%10]);
function sosTxt(id){return ordN(sosRanks()[id])+' toughest schedule'}

/* ---------- recruiting + parity ---------- */
function recruitAll(){
  const p=poll(),news=[];
  for(const t of S.teams){
    const r=rec(t.id),rk=p.indexOf(t.id)+1,past=(t.past||[]).slice(-4);
    let c=72+(t.prestige-72)*.5+(r.w-6)*.6+(rk<=4?2:0)+gauss()*9+(t.id===S.userId?0:(coachRt(t)-70)*.3);
    t._ev=null;
    if((S.carousel||[]).some(x=>x.t===t.id))c+=gauss()*5;
    if(R()<.1&&t.prestige<82){c+=rnd(8,15);t._ev='breakout'}
    const elite=past.filter(x=>x.rk<=4).length;
    if(elite>=3&&R()<.5){c-=rnd(9,15);t._ev='drain'}
    else if(elite>=2&&R()<.2){c-=rnd(5,9);t._ev='drain'}
    if(R()<.06)c+=(R()<.5?-1:1)*rnd(4,8);
    if(t.born!=null){const y=S.season-t.born;c+=y<1?-1:y<6?5:0}
    t.cls=Math.round(clamp(c,45,99));
  }
  const order=[...S.teams].sort((a,b)=>b.cls-a.cls),NT=S.teams.length/32;order.forEach((t,i)=>{t.clsRank=i+1;const q=i/NT;t.clsStars=q<3?5:q<9?4:q<18?3:q<26?2:1});
  for(const t of S.teams){
    const r=rec(t.id),before=t.off+t.def,keep=.55;
    const dv=t.id===S.userId?0:(coachRt(t)-70)*.05;
    t.off=Math.round(clamp(t.off*keep+t.cls*(1-keep)+gauss()*2.5+dv,50,99));
    t.def=Math.round(clamp(t.def*keep+(t.cls+gauss()*3)*(1-keep)+gauss()*2.5+dv,50,99));
    const target=48+r.w*3.6+(t.cc?3:0)+(S.champs.natl===t.id?5:0);
    {const np=Math.round(clamp(t.prestige*.8+target*.2,t.born!=null?36:50,96));t.prestige=t.born!=null&&S.season-t.born<6?Math.min(np,t.prestige+7):np}
    t._delta=(t.off+t.def)-before;
  }
  const N=t=>t.name;
  news.push({tag:'Recruiting',team:order[0].id,title:N(order[0])+' signs the No. 1 recruiting class',body:'Top five classes: '+order.slice(0,5).map((t,i)=>(i+1)+'. '+t.name).join(', ')+'.'});
  const br=S.teams.filter(t=>t._ev==='breakout').sort((a,b)=>b.cls-a.cls)[0];if(br)news.push({tag:'Recruiting',team:br.id,title:'Out of nowhere: '+N(br)+' lands a breakout class',body:'A program nobody was watching signs the No. '+br.clsRank+' class in the league. Watch out.'});
  const dr=S.teams.filter(t=>t._ev==='drain').sort((a,b)=>b.prestige-a.prestige)[0];if(dr)news.push({tag:'Recruiting',team:dr.id,title:'Cracks in the dynasty at '+N(dr)+'?',body:'Staff departures and early exits hit '+N(dr)+' hard. Their class ranks No. '+dr.clsRank+'.'});
  const up=[...S.teams].sort((a,b)=>b._delta-a._delta)[0];if(up&&up._delta>=4)news.push({tag:'Recruiting',team:up.id,title:N(up)+' reloads in a big way',body:'Biggest talent jump in the league this offseason.'});
  const dn=[...S.teams].sort((a,b)=>a._delta-b._delta)[0];if(dn&&dn._delta<=-4)news.push({tag:'Recruiting',team:dn.id,title:'Rebuild mode at '+N(dn),body:'Heavy graduation losses and a thin class. Biggest talent drop in the league.'});
  S.offNews=news;
}
/* ---------- coach ratings: proven coaches win more, recruit better, and their number moves with results ---------- */
function coachRt(t){const c=t&&t.coach;if(!c)return 60;if(c.rt==null)seedCoachRt(t);return c.rt}
function seedCoachRt(t){const c=t.coach;if(c.founder||t.born!=null&&S.season-t.born<2){c.rt=Math.round(clamp(52+gauss()*9,38,86));return}
  const mine=(t.past||[]).filter(x=>x.coach===c.name).slice(-5),gp=mine.reduce((s,x)=>s+x.w+x.l,0),wp=gp?mine.reduce((s,x)=>s+x.w,0)/gp:.5;
  let r=58+(wp-.5)*38+((t.prestige||65)-65)*.22+(wp>.6?Math.min(c.yrs||0,8)*.7:0)+(c.ring!=null?6:0)+mine.filter(x=>x.cc).length*1.5+gauss()*7+(R()<.08?rnd(10,18):0);
  c.rt=Math.round(clamp(r,42,95));c.d=0}
function coachMod(id){if(!S||id===S.userId)return 0;const t=team(id);return t&&t.coach?(coachRt(t)-70)/10:0}
function hireRt(t,interim){if(interim)return Math.round(clamp(48+gauss()*5,38,62));const pr=t.prestige||65;
  if(R()<.1+(pr>=80?.08:0))return Math.round(rnd(81,93));
  return Math.round(clamp(54+(pr-60)*.32+gauss()*9,40,90))}
function coachSeasonEnd(){
  const pre=S.preRank||poll(),N=S.teams.length,out=[];
  for(const t of S.teams){if(t.id===S.userId||!t.coach||t.coach.interim)continue;const c=t.coach,r=regRec(t.id),i=pre.indexOf(t.id),exp=i<0?6:10-8*(i/Math.max(1,N-1));
    const champ=S.champs&&S.champs.natl===t.id,po=!!(S.post&&S.post.seeds&&S.post.seeds.includes(t.id));
    let d=clamp((r.w-exp)*1.1+(t.cc?1.5:0)+(po?1.5:0)+(champ?3:0),-7,7)*.7+gauss()*1.1;
    if((c.yrs||0)<=3&&d>0)d*=1.3;d-=(coachRt(t)-62)*.07;if((c.yrs||0)>=15)d-=rnd(0,1.5);if(coachRt(t)>=90&&d>0)d*=.5;
    const old=coachRt(t);c.rt=Math.round(clamp(old+d,35,98));c.d=c.rt-old;out.push({t,d:c.d})}
  out.sort((a,b)=>b.d-a.d);S.coachMoves={season:S.season,up:out.slice(0,3).filter(x=>x.d>=3).map(x=>({id:x.t.id,name:x.t.coach.name,rt:x.t.coach.rt,d:x.d})),dn:out.slice(-3).filter(x=>x.d<=-3).map(x=>({id:x.t.id,name:x.t.coach.name,rt:x.t.coach.rt,d:x.d}))};
}
function rtTag(t){const c=t.coach;if(!c)return '';const r=coachRt(t);return '<span class="crt'+(r>=85?' hi':r<55?' lo':'')+'" title="Coach rating">'+r+(c.d?'<small>'+(c.d>0?'▲':'▼')+Math.abs(c.d)+'</small>':'')+'</span>'}
/* A big season buys a coach real job security. */
function seasonRelief(t,x){
  if(!t.coach||t.id===S.userId||!x)return;let h=t.coach.heat;
  if(x.natl)h=Math.min(h,4);else{if(x.cc)h-=18;if(x.po)h-=10;if(x.w>=10)h-=6;if(x.w<x.l)h+=6;if(coachRt(t)>=85)h-=5}
  t.coach.heat=clamp(Math.round(h),0,100);if(x.natl)t.coach.ring=x.s;
}
function recordSeason(){
  const p=poll();try{updateRecords()}catch(e){}
  for(const t of S.teams){
    const r=rec(t.id),rk=p.indexOf(t.id)+1;t.past=t.past||[];
    t.past.push({s:S.season,w:r.w,l:r.l,rk,cc:!!t.cc,natl:S.champs.natl===t.id,po:!!(S.post&&S.post.seeds&&S.post.seeds.includes(t.id)),coach:t.id===S.userId?S.coach:(t.coach?t.coach.name:''),pg:postGamesFor(t.id)});
    seasonRelief(t,t.past[t.past.length-1]);
  }
  S.champHist=S.champHist||[];
  S.champHist.unshift({s:S.season,natl:S.champs.natl,confs:[...(S.champs.conf||[])]});
}
function pastHTML(t){
  const ps=(t.past||[]).slice().reverse();
  let h='<section class="card"><span class="eyebrow">Program history</span>'+(t.hist?'<p style="font-size:14px">'+esc(histLine(t))+'</p>':'');
  const lt=loreForTeam(t.id),ct=(S.champHist||[]).filter(x=>x.natl===t.id).map(x=>yearOf(x.s));
  if(lt.length||ct.length)h+='<p style="font-size:13.5px"><b>Title years:</b> '+[...lt.map(x=>x.y),...ct].sort().join(', ')+'</p>'+lt.slice().reverse().map(x=>'<p class="muted" style="font-size:12.5px">'+x.y+': '+esc(x.note)+'</p>').join('');
  h+='<div class="row"><button class="btn ghost small" data-act="phist" data-id="'+t.id+'">Full program history</button></div>';
  const rs=rivalsOf(t.id);if(rs.length)h+='<p class="eyebrow" style="margin-top:6px">Rivalries</p><div class="row">'+rs.map(r=>'<button class="btn ghost small" data-act="rview" data-r="'+S.rivals.indexOf(r)+'">'+esc(r.trophy.replace(/^The /,''))+' vs '+esc(team(r.a===t.id?r.b:r.a).abbr)+'</button>').join('')+'</div>';
  if(t.clsRank)h+='<p class="muted" style="font-size:13px">Latest recruiting class: No. '+t.clsRank+' ('+'★'.repeat(t.clsStars||1)+')</p>';
  h+=ps.length?'<div class="sched">'+ps.slice(0,8).map(x=>'<div class="g"><span class="wk">'+yearOf(x.s)+'</span><span style="min-width:0"><b class="num">'+x.w+'-'+x.l+'</b>'+(x.rk<=PN?' · No. '+x.rk:'')+(x.natl?' · <span class="amber">National champs</span>':x.po?' · Playoff':'')+(x.cc?' · Conf champs':'')+'<br><small class="muted">Coach '+esc(x.coach||'')+'</small></span><span></span></div>').join('')+'</div>':'<p class="muted" style="font-size:13px">Season-by-season results show up here after this season.</p>';
  return h+'</section>';
}

/* ---------- league lore (2006 to 2025) ---------- */
const yearOf=s=>((S&&S.baseYear)||2025)+s;
const LORE=[
 [2006,22,'Averyville Baptist wins the first title in league history.'],
 [2007,22,'Averyville Baptist goes back-to-back.'],
 [2008,16,'Berean Baptist wins it behind the arm of Ben Forrester.'],
 [2009,8,'Southwest Baptist takes the crown. Jason Gaddis is a rising star.'],
 [2010,16,'Berean Baptist strikes back. WR Tim Knutson explodes for the Heisman.'],
 [2011,11,'Broken Arrow wins it all. The rise of the Brown family.'],
 [2012,26,'Sauk Trail Temple wins the title. Andrew Albert takes home the Heisman.'],
 [2013,24,'Cleveland Baptist wins it as Folger rises to the occasion.'],
 [2014,16,'Dakotah Knutson leads Berean Baptist back to the promised land.'],
 [2015,8,'Among the chaos, Southwest Baptist prevails.'],
 [2016,2,'After the team move to Jerome, Dakotah Knutson leads Jerome over Berean in an emotional championship win. A rivalry is born.'],
 [2017,2,'Jerome Bible Baptist repeats. A dynasty is born, and Dakotah Knutson is cemented as a legend.'],
 [2018,4,'David Hetzer closes out his first San Diego stint with a title.'],
 [2019,2,'Dakotah Knutson grabs his final title with Jerome.'],
 [2020,10,'Stillwater dispels the curse. Wayne Hardy leads them to a title.'],
 [2021,13,'Pritchett guides Arden Road to the title, the first team from Texas to win it.'],
 [2022,29,'Paul Coyle and Burton Gates take a title in their last year together at Liberty Baptist.'],
 [2023,6,'Northway runs over the competition behind the Vaughts.'],
 [2024,8,'Andrew Albert returns to the spotlight, this time as Southwest\'s head coach.'],
 [2025,16,'Berean Baptist ends its title drought behind Dawson Brown and Tim Alexander. Head coach Jeff Able\'s final title.']
];
const LORE_HEIS=[[2010,'Tim Knutson','WR',16],[2012,'Andrew Albert','',26]];
function loreHist(T){
  // T: array of {conf,tier} by index; returns per-index {natl,ct,last,w,l}
  const rr=srng(20062025),out=T.map(()=>({natl:0,ct:0,last:null,w:0,l:0}));
  for(const [y,i] of LORE){out[i].natl++;out[i].last=y}
  const wt={dynasty:5,power:4,contender:3,fallen:2.5,middle:1.5,rising:1,rebuild:1,basement:.3};
  for(let c=0;c<4;c++){
    const ids=T.map((t,i)=>i).filter(i=>T[i].conf===c);
    ids.forEach(i=>out[i].ct=out[i].natl);
    let left=20-ids.reduce((a,i)=>a+out[i].ct,0);
    while(left>0){const ws=ids.map(i=>(wt[T[i].tier]||1.5)+out[i].natl*.8),tot=ws.reduce((a,b)=>a+b,0);let x=rr()*tot,k=0;for(;k<ids.length;k++){x-=ws[k];if(x<=0)break}out[ids[Math.min(k,ids.length-1)]].ct++;left--}
  }
  const pct={dynasty:.72,power:.66,contender:.6,fallen:.55,middle:.52,rising:.47,rebuild:.45,basement:.34};
  T.forEach((t,i)=>{const gp=240+Math.floor(rr()*25),p=clamp((pct[t.tier]||.5)+out[i].natl*.018+(rr()-.5)*.05,.25,.82);out[i].w=Math.round(gp*p);out[i].l=gp-out[i].w});
  return out;
}
function applyLoreTpl(){
  if(!LS||!LS.tpl||LS.loreV1)return;
  const H=loreHist(LS.tpl.teams);
  LS.tpl.teams.forEach((t,i)=>Object.assign(t,H[i]));
  if(!LS.tpl.rivals.some(r=>(r.a===2&&r.b===16)||(r.a===16&&r.b===2)))LS.tpl.rivals.push({a:2,b:16,type:'annual',trophy:'The Knutson Trophy'});
  LS.loreV1=true;saveLSQuiet();
}
function applyLoreCareer(){
  if(!S||S.lname!=='Church League'||S.loreV1||!S.teams||S.teams.length!==32)return;
  S.baseYear=2025;
  const H=loreHist(S.teams.map((t,i)=>({conf:LS&&LS.tpl?LS.tpl.teams[i].conf:t.conf,tier:t.hist?t.hist.tier:'middle'})));
  S.teams.forEach((t,i)=>{
    const won=(S.champHist||[]).filter(x=>x.natl===i),pastW=(t.past||[]).reduce((a,x)=>a+x.w,0),pastL=(t.past||[]).reduce((a,x)=>a+x.l,0),cc=(t.past||[]).filter(x=>x.cc).length;
    t.hist=t.hist||{tier:'middle'};
    t.hist.natl=H[i].natl+won.length;t.hist.ct=H[i].ct+cc;t.hist.w=H[i].w+pastW;t.hist.l=H[i].l+pastL;
    t.hist.last=won.length?yearOf(Math.max(...won.map(x=>x.s))):H[i].last;
  });
  S.lore=LORE.map(([y,i,note])=>({y,t:i,note}));
  S.loreHeis=LORE_HEIS.map(([y,name,pos,i])=>({y,name,pos,t:i}));
  const sw=team(8);if(sw&&sw.coach&&S.userId!==8){sw.coach.name='Andrew Albert';sw.coach.yrs=Math.max(2,S.season+1);sw.coach.heat=Math.min(sw.coach.heat,25)}
  const ber=team(16);if(ber&&ber.coach&&S.userId!==16&&S.season<=1){ber.coach.yrs=0;ber.coach.heat=Math.min(ber.coach.heat,20)}
  if(S.rivalDefs&&!S.rivalDefs.some(r=>(r.a===2&&r.b===16)||(r.a===16&&r.b===2)))S.rivalDefs.push({a:2,b:16,type:'annual',trophy:'The Knutson Trophy'});
  syncRivals();
  S.news=S.news||{};S.news.pre=S.news.pre||[];
  if(!S.news.pre.some(x=>x.tag==='History'))S.news.pre.unshift({tag:'History',team:16,title:'Twenty years of history: the defending champs are Berean Baptist',body:'Berean ended its title drought in 2025 behind Dawson Brown and Tim Alexander, sending head coach Jeff Able out a champion. Jerome and Southwest each own three titles. Berean leads everyone with four.'});
  S.loreV1=true;save();
}
function loreForTeam(id){return (S.lore||[]).filter(x=>x.t===id)}
function champListHTML(){
  const cur=(S.champHist||[]).map(x=>({y:yearOf(x.s),t:x.natl,note:x.confs.map((c,i)=>c!=null?CONFS[i]+': '+team(c).abbr:'').filter(Boolean).join(' · ')}));
  const all=[...cur,...(S.lore||[]).slice().reverse()];
  if(!all.length)return '';
  const counts={};all.forEach(x=>{if(x.t!=null)counts[x.t]=(counts[x.t]||0)+1});
  const lead=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([id,n])=>esc(team(+id).abbr)+' '+n).join(' · ');
  const heis=[...((S.heisHist||[]).map(x=>({y:yearOf(x.s),name:x.name,pos:x.pos,team:x.team}))),...(S.loreHeis||[]).slice().reverse().map(x=>({y:x.y,name:x.name,pos:x.pos,team:team(x.t).name}))];
  return '<section class="card"><div class="spread"><h3>League history</h3><span class="muted" style="font-size:12px">Since '+(S.lore&&S.lore.length?S.lore[0].y:yearOf(1))+'</span></div><p class="muted" style="font-size:12.5px">Most titles: '+lead+'</p><div class="sched">'+
    all.slice(0,S.histAll?99:8).map(x=>'<div class="g"><span class="wk">'+x.y+'</span><span style="min-width:0"><span class="dot" style="background:'+(x.t!=null?team(x.t).color:'#555')+'"></span><b>'+(x.t!=null?'<button class="lnk" data-act="vsched" data-id="'+x.t+'">'+esc(team(x.t).name)+'</button>':'')+'</b><br><small class="muted">'+esc(x.note||'')+'</small></span><span></span></div>').join('')+'</div>'+
    (all.length>8?'<button class="btn ghost small" data-act="histall">'+(S.histAll?'Show fewer':'Show all '+all.length+' seasons')+'</button>':'')+
    (heis.length?'<h3 style="margin-top:6px">Heisman winners</h3><div class="sched">'+heis.map(x=>'<div class="g"><span class="wk">'+x.y+'</span><span style="min-width:0">'+esc(x.name)+' <span class="muted">'+esc(x.pos?x.pos+', ':'')+esc(x.team)+'</span></span><span></span></div>').join('')+'</div>':'')+'</section>';
}

/* ---------- game pages: box score + reactions ---------- */
function boxFor(g){
  if(g.boxo)return g.boxo;
  const rr=srng(hashS(S.season+':'+g.wk+':'+g.h+':'+g.a+':box')),ri3=(a,b)=>a+Math.floor(rr()*(b-a+1)),pk=a=>a[Math.floor(rr()*a.length)];
  const nm=(id,slot)=>{
    if(id===S.userId){const m={QB:'QB',RB:'RB',WR:'WR'},s=S.stars.find(x=>x.pos===m[slot]);if(s)return short(s.name)}
    const t=team(id);if(t.star&&t.star.pos===slot)return short(t.star.name);
    const nm2=(t.named||[]).find(n=>n.pos===slot&&!(t.star&&t.star.pos===slot));if(nm2)return short(nm2.name);
    return pick2(FIRST,rr)[0]+'. '+pick2(LAST,rr);
  };
  function pick2(a,r){return a[Math.floor(r()*a.length)]}
  const decomp=pts=>{
    const plays=[],opts=[];
    for(let t7=Math.floor(pts/7);t7>=0;t7--)for(let t8=0;t8<=2;t8++)for(let t6=0;t6<=2;t6++)for(let s2=0;s2<=1;s2++){const rem=pts-7*t7-8*t8-6*t6-2*s2;if(rem>=0&&rem%3===0)opts.push([t7,t6,s2,rem/3,t8])}
    const pen=a=>a[1]*2+a[2]*4+Math.max(0,a[3]-3)+a[4]*1.5;opts.sort((a,b)=>pen(a)-pen(b));
    const o=opts.length?opts[rr()<.93||opts.length<2?0:1]:[0,0,0,0,0];
    for(let k=0;k<o[0];k++)plays.push(7);for(let k=0;k<o[4];k++)plays.push(8);for(let k=0;k<o[1];k++)plays.push(6);for(let k=0;k<o[2];k++)plays.push(2);for(let k=0;k<o[3];k++)plays.push(3);
    return plays;
  };
  const uq=g.uq&&g.uq.u&&g.uq.c&&g.uq.u.reduce((a,b)=>a+b,0)===(g.h===S.userId?g.hs:g.as)&&g.uq.c.reduce((a,b)=>a+b,0)===(g.h===S.userId?g.as:g.hs)?g.uq:null;
  const wq=!uq&&g.wq&&g.wq.h&&g.wq.a&&g.wq.h.reduce((a,b)=>a+b,0)===g.hs&&g.wq.a.reduce((a,b)=>a+b,0)===g.as?g.wq:null;
  const side=(id,pts,opp)=>{
    let plays,qt=null;
    if(uq||wq){const arr=uq?(id===S.userId?uq.u:uq.c):(id===g.h?wq.h:wq.a);plays=[];qt=[];arr.forEach((qp,qi)=>decomp(qp).forEach(x=>{plays.push(x);qt.push(qi+1)}))}
    else plays=decomp(pts);
    const yds=Math.round(clamp(205+pts*6.3+(rr()-.5)*90,120,640)),pass=Math.round(yds*clamp(.42+rr()*.3,.3,.8));
    return {id,pts,plays,qt,yds,pass,rush:yds-pass,fd:Math.round(yds/17+rr()*3),to:0,qb:nm(id,'QB'),rb:nm(id,'RB'),wr:nm(id,'WR'),wr2:pick2(FIRST,rr)[0]+'. '+pick2(LAST,rr)};
  };
  const H=side(g.h,g.hs),A=side(g.a,g.as),loser=g.hs>g.as?A:H;
  loser.to=ri3(0,3);(loser===A?H:A).to=ri3(0,1);
  if(g.ust){const u=g.h===S.userId?H:A;u.pass=g.ust.qb.yds||u.pass;u.rush=g.ust.rb?Math.max(u.rush,g.ust.rb.yds):u.rush;u.yds=u.pass+u.rush;if(g.ust.to!=null)u.to=g.ust.to}
  const sum=[];
  for(const s of [H,A])s.plays.forEach((p,pi)=>{
    const q=s.qt?s.qt[pi]:g.ot&&s===(g.hs>g.as?H:A)&&p===s.plays[s.plays.length-1]&&rr()<.8?5:ri3(1,4);
    const ty=p>=6?(rr()<.58?'pass':'run'):p===3?'fg':'saf';
    let txt=ty==='pass'?s.qb+' '+ri3(3,62)+'-yd TD pass to '+(rr()<.6?s.wr:s.wr2):ty==='run'?s.rb+' '+ri3(1,48)+'-yd TD run':ty==='fg'?ri3(22,51)+'-yd field goal':'Safety';
    if(p===6)txt+=' (kick failed)';if(p===8)txt+=' (two-point try good)';sum.push({q,abbr:team(s.id).abbr,id:s.id,txt,pts:p});
  });
  sum.sort((a,b)=>a.q-b.q);
  const qs=id=>{const a=[0,0,0,0,0];sum.filter(x=>x.id===id).forEach(x=>a[x.q-1]+=x.pts);return a};
  const ld=s=>{const att=Math.round(s.pass/ (6.5+rr()*4)),cmp=Math.round(att*(.55+rr()*.15)),tds=s.plays.filter(p=>p>=6).length;return {pass:s.qb+': '+cmp+'/'+Math.max(cmp,att)+', '+s.pass+' yds, '+Math.round(tds*.55)+' TD'+(s.to>=1&&rr()<.6?', '+Math.min(s.to,2)+' INT':''),rush:s.rb+': '+ri3(12,26)+' car, '+Math.round(s.rush*.62)+' yds',rec:s.wr+': '+ri3(3,9)+' rec, '+Math.round(s.pass*.38)+' yds'}};
  return {H,A,sum,qH:qs(g.h),qA:qs(g.a),lH:ld(H),lA:ld(A)};
}
function gameFeed(g){
  const rr=srng(hashS(S.season+':'+g.wk+':'+g.h+':'+g.a+':feed')),pk=a=>a[Math.floor(rr()*a.length)];
  const W=winnerOf(g),Lo=W===g.h?g.a:g.h,ws=Math.max(g.hs,g.as),ls=Math.min(g.hs,g.as),mar=ws-ls,dogBy=W===g.h?-(g.pl||0):(g.pl||0),rv=g.riv!=null?S.rivals[g.riv]:null;
  const vW={team:team(W).name,mascot:team(W).mascot,abbr:team(W).abbr,opp:team(Lo).name,oppm:team(Lo).mascot,pts:ws,rec:recStr(W),coach:W===S.userId?S.coach:(team(W).coach?team(W).coach.name:'Coach'),star:team(W).star?short(team(W).star.name):'our QB',trophy:rv?rv.trophy:'',streak:streak(W).n,next:'next week',sec:100+Math.floor(rr()*40)};
  const vL={...vW,team:team(Lo).name,mascot:team(Lo).mascot,abbr:team(Lo).abbr,opp:team(W).name,oppm:team(W).mascot,pts:ls,rec:recStr(Lo),coach:Lo===S.userId?S.coach:(team(Lo).coach?team(Lo).coach.name:'Coach'),star:team(Lo).star?short(team(Lo).star.name):'our QB',streak:streak(Lo).n};
  const wp=rv?FP.rivW:dogBy>=6?FP.upsetW:mar>=24?FP.bigwin:(mar<=3||g.ot)?FP.close:FP.win;
  const lp=rv?FP.rivL:dogBy>=6?FP.upsetL:mar>=24?FP.bigloss:(mar<=3||g.ot)?FP.closeL:FP.loss;
  const G2=gameSig(g);Object.assign(vW,G2.v,{oppabbr:team(Lo).abbr});Object.assign(vL,G2.v,{oppabbr:team(W).abbr});
  if(rv){const Cw=rivCtx(W,Lo),Cl=rivCtx(Lo,W);vW.ser=Cw.ser;vL.ser=Cl.ser;vW.yrs=vL.yrs=Cw.me+Cw.th}
  const out=[],seen=new Set(),mk=(id,pool,v,kind)=>{for(let k=0;k<6;k++){const t=fill(pk(pool),v);if(!seen.has(t)&&!/\{\w+\}/.test(t)){seen.add(t);out.push({h:'@'+handle(id,kind||'fan',rr),txt:t,likes:Math.floor((kind==='media'?80:4)+rr()*(kind==='media'?2400:3900)),kind:kind||'fan',team:id});return}}};
  const mv={...vW,score:ws+'-'+ls,winner:team(W).name,team:team(W).name,opp:team(Lo).name,hero:G2.passHero?G2.v.qb:G2.rushHero?G2.v.rb:G2.v.wr};
  const mp=[];if(rv)mp.push(MEDIA2.rivalry);if(dogBy>=6)mp.push(MEDIA.upW);if(G2.comeback)mp.push(MEDIA2.comeback);if(G2.shut)mp.push(MEDIA2.shutout);if(G2.ot)mp.push(MEDIA2.ot);
  if(G2.closer)mp.push(MEDIA2.closer);if(G2.passHero||G2.rushHero||G2.recHero)mp.push(MEDIA2.hero);if(G2.blowout||mar>=35)mp.push(MEDIA2.rout);if(G2.defense)mp.push(MEDIA2.defense);mp.push(MEDIA.W);
  mk(W,rr()<.65?mp[0]:pk(mp),mv,'media');
  const ch=[],rest=[];
  const wSig=sigPools(G2,true),lSig=sigPools(G2,false);
  if(rv){const C=rivCtx(W,Lo);wSig.push([FX.badBloodW,5]);lSig.push([FX.badBloodL,5]);if(rv.prev!=null&&rv.prev!==rv.holder&&rv.last&&rv.last.s===ws+'-'+ls){wSig.push([FX.trophyBack,6]);lSig.push([FX.trophyLost,6])}
    const lw=lorePair(W,Lo),ll=lorePair(Lo,W);if(lw)wSig.push([lw,3]);if(ll)lSig.push([ll,3])}
  const take=(id,list,v,k)=>{list=list.slice();for(let i=0;i<k&&list.length;i++){const c=wpickL(list,rr);list.splice(list.indexOf(c),1);mk(id,c[0],v)}};
  mk(W,wp,vW);mk(Lo,lp,vL);
  take(W,wSig,vW,rv||G2.upset?3:2);take(Lo,lSig,vL,2);
  if(rr()<.6)mk(W,FP.win,vW);if(rr()<.6)mk(Lo,FP.loss,vL);
  const body=out.splice(1);
  if(!rv){ch.push(...rivalChirps(Lo,'L',rr,rr()<.55?2:1,{opp:team(W).name,excl:W}));if(dogBy>=6||mar>=24||rr()<.4)ch.push(...rivalChirps(W,'W',rr,1,{opp:team(Lo).name,excl:Lo}))}
  for(let i=body.length-1;i>0;i--){const j=Math.floor(rr()*(i+1));[body[i],body[j]]=[body[j],body[i]]}
  ch.forEach((c,i)=>body.splice(Math.min(body.length,1+i*3),0,c));
  return out.concat(body);
}
/* ---------- Instant Classics: games the coach inducts by hand ---------- */
function clsOf(g){return (S.classics||[]).find(c=>c.season===S.season&&c.wk===g.wk&&c.h===g.h&&c.a===g.a)}
function inductGame(gi,title){
  const g=S.games[gi];if(!g||!g.done||clsOf(g))return null;const X=boxFor(g),H=team(g.h),A=team(g.a);
  const c={id:Date.now().toString(36)+Math.floor(Math.random()*1e4),season:S.season,year:yearOf(S.season),wk:g.wk,tag:g.tag||weekLabel(g.wk),riv:g.riv!=null&&S.rivals[g.riv]?S.rivals[g.riv].trophy:null,
    h:g.h,a:g.a,hs:g.hs,as:g.as,ot:!!g.ot,otn:g.otn||null,hr:g.hr||null,ar:g.ar||null,hrec:recAt(g.h,g),arec:recAt(g.a,g),neutral:!!g.neutral,
    hn:H.name,an:A.name,hab:H.abbr,aab:A.abbr,title:(title||'').trim()||'Instant Classic',on:Date.now(),
    box:{qA:X.qA,qH:X.qH,sum:X.sum,A:X.A,H:X.H,lA:X.lA,lH:X.lH}};
  (S.classics=S.classics||[]).unshift(c);return c;
}
function clsSeed(){
  if(!S||!S.games||S.clsSeed1)return;
  const T=S.teams.find(t=>t.abbr==='TEM'),W=S.teams.find(t=>t.abbr==='WGT');if(!T||!W)return;
  const gi=S.games.findIndex(g=>g.done&&g.po&&((g.h===T.id&&g.a===W.id)||(g.h===W.id&&g.a===T.id)));if(gi<0)return;
  inductGame(gi,'The Greatest Game Ever Played');S.clsSeed1=true;
}
function clsRow(c,i){const W=c.hs>c.as?'h':'a',sc=t=>'<b class="num'+(W===t?'':' muted')+'">'+(t==='a'?c.as:c.hs)+'</b>';
  return '<button class="clsr" data-act="clview" data-i="'+i+'"><span class="clst">'+esc(c.title)+'</span><span class="clsg">'+mlogo(team(c.a))+'<span>'+(c.ar&&c.ar<=20?'<small>'+c.ar+'</small> ':'')+esc(c.aab)+'</span>'+sc('a')+'<span class="muted">'+(c.neutral?'vs':'at')+'</span>'+mlogo(team(c.h))+'<span>'+(c.hr&&c.hr<=20?'<small>'+c.hr+'</small> ':'')+esc(c.hab)+'</span>'+sc('h')+(c.ot?'<small class="muted">'+(c.otn>1?c.otn:'')+'OT</small>':'')+'</span><span class="muted" style="font-size:12px">'+c.year+' · '+esc(c.tag)+(c.riv?' · '+esc(c.riv):'')+'</span></button>'}
function classicsCard(){
  const L=S.classics||[];
  return '<section class="card clsc"><span class="eyebrow">Hall of games</span><h3>Instant Classics</h3>'+(L.length?'<div class="clsl">'+L.slice(0,S.clsAll?99:5).map(clsRow).join('')+'</div>'+(L.length>5?'<button class="btn ghost small" data-act="clsall">'+(S.clsAll?'Show fewer':'Show all '+L.length)+'</button>':''):'<p class="muted" style="font-size:13px">Only you can induct a game. Open any final box score and hit "Induct into Instant Classics."</p>')+'</section>';
}
function clsForm(gi,g){const c=clsOf(g);
  if(c)return '<div class="clsbadge"><span class="eyebrow">Instant Classic</span><b>'+esc(c.title)+'</b><button class="btn ghost small" data-act="clsdel" data-id="'+c.id+'">Remove from Instant Classics</button></div>';
  return '<div class="clsform"><span class="eyebrow">Instant Classics</span><input id="clsT" maxlength="60" placeholder="Name it, like &quot;The Miracle at Midfield&quot;"><button class="btn small" data-act="clsadd" data-g="'+gi+'">Induct into Instant Classics</button></div>';
}
function classicModal(){
  const c=(S.classics||[])[S.clview];if(!c)return '';const X=c.box||{},A=team(c.a),H=team(c.h);
  const qh=(id,ab,rec,arr,pts)=>'<tr><td style="white-space:nowrap">'+mlogo(team(id))+esc(ab)+' <small class="muted num">'+esc(rec||'')+'</small></td>'+(arr||[]).slice(0,c.ot?5:4).map(v=>'<td class="r">'+v+'</td>').join('')+'<td class="r"><b>'+pts+'</b></td></tr>';
  let b='<p class="clsbig">'+esc(c.title)+'</p>'+(c.note?'<p style="font-size:14px;margin:0 0 6px">'+esc(c.note)+'</p>':'')+'<p class="muted" style="font-size:13px">'+c.year+' · '+esc(c.tag)+(c.riv?' · '+esc(c.riv):'')+(c.neutral?' · Neutral site':' · at '+esc(c.hn))+'</p>';
  if(X.qA)b+='<div style="overflow-x:auto"><table class="tbl"><thead><tr><th></th><th class="r">1</th><th class="r">2</th><th class="r">3</th><th class="r">4</th>'+(c.ot?'<th class="r">OT</th>':'')+'<th class="r">T</th></tr></thead><tbody>'+qh(c.a,c.aab,c.arec,X.qA,c.as)+qh(c.h,c.hab,c.hrec,X.qH,c.hs)+'</tbody></table></div>';
  if(X.A)b+='<div class="box"><span class="h">Team stats</span><span class="h">'+esc(c.aab)+'</span><span class="h">'+esc(c.hab)+'</span>'+[['Total yards',X.A.yds,X.H.yds],['Passing',X.A.pass,X.H.pass],['Rushing',X.A.rush,X.H.rush],['First downs',X.A.fd,X.H.fd],['Turnovers',X.A.to,X.H.to]].map(r=>'<span>'+r[0]+'</span><b>'+r[1]+'</b><b>'+r[2]+'</b>').join('')+'</div>';
  if(X.sum)b+='<h3>Scoring summary</h3><div class="sched">'+X.sum.map(x=>'<div class="g"><span class="wk">'+(x.q===5?'OT':'Q'+x.q)+'</span><span style="min-width:0"><b>'+esc(x.abbr)+'</b> '+esc(x.txt)+'</span><span class="muted num">+'+x.pts+'</span></div>').join('')+'</div>';
  if(X.lA)b+='<h3>Top performers</h3><div class="perf">'+[[c.aab,X.lA],[c.hab,X.lH]].map(([t,l])=>'<div><span class="eyebrow">'+esc(t)+'</span><p>'+esc(l.pass)+'</p><p>'+esc(l.rush)+'</p><p>'+esc(l.rec)+'</p></div>').join('')+'</div>';
  b+='<div class="row"><button class="btn ghost small" data-act="clsdel" data-id="'+c.id+'">Remove from Instant Classics</button></div>';
  const title=c.aab+' '+c.as+', '+c.hab+' '+c.hs+(c.ot?' ('+(c.otn>1?c.otn:'')+'OT)':'');
  return '<div class="modal" role="dialog" aria-modal="true" aria-label="'+esc(title)+'"><div class="mpanel"><div class="spread mhead"><div><span class="eyebrow">Instant Classic</span><h2>'+esc(title)+'</h2></div><button class="btn ghost small" data-act="clclose">Close</button></div><div class="mbody">'+b+'</div></div></div>';
}
function gameModal(){
  const g=S.games[S.gview];if(!g)return '';
  const H=team(g.h),A=team(g.a),p=poll();let b='';
  const nmL=(id,r)=>'<button class="lnk" data-act="vsched" data-id="'+id+'">'+(r<=PN?'No. '+r+' ':'')+esc(team(id).name)+'</button>';
  if(!g.done){
    const sr=sosRanks();
    b+='<p class="muted" style="font-size:13px">'+esc(g.tag||weekLabel(g.wk))+(g.riv!=null?' · '+esc(S.rivals[g.riv].trophy):'')+' · Line '+spreadText(g)+'</p>';
    b+='<div class="box"><span class="h">Matchup</span><span class="h">'+esc(A.abbr)+'</span><span class="h">'+esc(H.abbr)+'</span>'+[['Record',recStr(g.a),recStr(g.h)],['Identity',IDm(g.a).s,IDm(g.h).s],['Offense',A.off,H.off],['Defense',A.def,H.def],['Line trend',prTxt(g.a),prTxt(g.h)],['SOS rank',sr[g.a],sr[g.h]],['Fan mood',teamState(g.a).label,teamState(g.h).label]].map(r=>'<span>'+r[0]+'</span><b>'+r[1]+'</b><b>'+r[2]+'</b>').join('')+'</div>';
    if(g.wk===S.week&&g.h!==S.userId&&g.a!==S.userId)b+='<div class="row"><button class="btn" data-act="watch" data-g="'+S.gview+'">Watch this game</button></div>';
    if(g.riv!=null)b+='<div class="row"><button class="btn ghost small" data-act="rview" data-r="'+g.riv+'">Rivalry history</button></div>';
    b+=feedBlock('p'+S.gview,matchupFeed(g,16),g.a,g.h,'Pregame buzz');
  }else{
    const X=boxFor(g),qh=(n,arr,id,pts)=>'<tr><td style="white-space:nowrap">'+mlogo(team(id))+''+esc(team(id).abbr)+' <small class="muted num">'+recAt(id,g)+'</small></td>'+arr.slice(0,g.ot?5:4).map(v=>'<td class="r">'+v+'</td>').join('')+'<td class="r"><b>'+pts+'</b></td></tr>';
    b+='<p class="muted" style="font-size:13px">'+esc(g.tag||weekLabel(g.wk))+(g.riv!=null?' · '+esc(S.rivals[g.riv].trophy):'')+(g.neutral?' · Neutral site':' · at '+esc(H.name))+'</p>';
    b+='<div style="overflow-x:auto"><table class="tbl"><thead><tr><th></th><th class="r">1</th><th class="r">2</th><th class="r">3</th><th class="r">4</th>'+(g.ot?'<th class="r">OT</th>':'')+'<th class="r">T</th></tr></thead><tbody>'+qh('a',X.qA,g.a,g.as)+qh('h',X.qH,g.h,g.hs)+'</tbody></table></div>';
    b+='<div class="box"><span class="h">Team stats</span><span class="h">'+esc(A.abbr)+'</span><span class="h">'+esc(H.abbr)+'</span>'+[['Total yards',X.A.yds,X.H.yds],['Passing',X.A.pass,X.H.pass],['Rushing',X.A.rush,X.H.rush],['First downs',X.A.fd,X.H.fd],['Turnovers',X.A.to,X.H.to]].map(r=>'<span>'+r[0]+'</span><b>'+r[1]+'</b><b>'+r[2]+'</b>').join('')+'</div>';
    b+='<h3>Scoring summary</h3><div class="sched">'+X.sum.map(x=>'<div class="g"><span class="wk">'+(x.q===5?'OT':'Q'+x.q)+'</span><span style="min-width:0"><b>'+esc(x.abbr)+'</b> '+esc(x.txt)+'</span><span class="muted num">+'+x.pts+'</span></div>').join('')+'</div>';
    b+='<h3>Top performers</h3><div class="perf">'+[[A,X.lA],[H,X.lH]].map(([t,l])=>'<div><span class="eyebrow">'+esc(t.abbr)+'</span><p>'+esc(l.pass)+'</p><p>'+esc(l.rush)+'</p><p>'+esc(l.rec)+'</p></div>').join('')+'</div>';
    b+=clsForm(S.gview,g);
    b+=feedBlock('g'+S.gview,gameFeedBig(g),g.a,g.h,'Fan reaction');
  }
  const title=g.done?(A.abbr+' '+g.as+', '+H.abbr+' '+g.hs+(g.ot?' ('+(g.otn>1?g.otn:'')+'OT)':'')):(A.abbr+' '+(g.neutral?'vs':'at')+' '+H.abbr);
  return '<div class="modal" role="dialog" aria-modal="true" aria-label="'+esc(title)+'"><div class="mpanel"><div class="spread mhead"><div><span class="eyebrow">'+(g.done?'Final':'Preview')+'</span><h2>'+esc(title)+'</h2><p class="muted" style="font-size:12.5px">'+nmL(g.a,g.done?g.ar:rankOf(g.a,p))+' '+(g.neutral?'vs':'at')+' '+nmL(g.h,g.done?g.hr:rankOf(g.h,p))+'</p></div><button class="btn ghost small" data-act="gclose">Close</button></div><div class="mbody">'+b+'</div></div></div>';
}

/* ---------- Selection Sunday show ---------- */
function selSteps(){
  const P=S.post;if(!P||!P.seeds||P.seeds.length<12)return [];
  const st=[{k:'intro'},{k:'champs'}];
  ['A','C','D','B'].forEach(br=>st.push({k:'r1',br}));
  [4,3,2,1].forEach(n=>st.push({k:'bye',n}));
  st.push({k:'out'});
  if(!P.seeds.includes(S.userId))st.push({k:'you'});
  st.push({k:'react'},{k:'bracket'});
  return st;
}
function selRng(tag){return srng(hashS(S.season+':sel:'+tag))}
function selBlurb(id,n){
  const rr=selRng('b'+id),pk=a=>a[Math.floor(rr()*a.length)],t=team(id),r=rec(id),sos=sosRanks()[id],auto=(S.post.auto||[]).includes(id),cn=CONFS[t.conf];
  const L=[];
  if(auto)L.push(pk(['Punched its ticket by winning the '+cn+' title game.','The '+cn+' champion. That trophy carried a lot of weight in the room.','Took care of business in the '+cn+' championship and the committee rewarded it.']));
  if(sos<=6)L.push(pk(['The committee loved the schedule. No. '+sos+' strength of schedule in the country.','Played one of the toughest schedules in the league (No. '+sos+') and it showed up in the seeding.']));
  else if(sos>=24&&n<=8)L.push(pk(['Some will question a schedule ranked No. '+sos+', but '+r.w+' wins is '+r.w+' wins.','The schedule was soft (No. '+sos+'), but the committee let the record speak.']));
  if(r.l===0)L.push('Unbeaten. Nobody in this league could solve them.');
  else if(r.l===1)L.push(pk(['One loss all year. Hard to argue with that.','Just one blemish on the resume.']));
  if(n>=11&&!auto)L.push(pk(['This was the last debate in the room. They are in.','On the bubble all week. Exhale.','The final at-large spot was a long conversation. It went their way.']));
  if(team(id).hist&&team(id).hist.tier==='basement')L.push('A program that has rarely been here. What a moment.');
  else if(team(id).hist&&team(id).hist.natl>=2&&n<=4)L.push('Blue blood energy. They have done this before.');
  const pp=poll(),bw=S.games.filter(g=>g.done&&(g.h===id||g.a===id)&&winnerOf(g)===id).map(g=>g.h===id?g.a:g.h).sort((a,b)=>rankOf(a,pp)-rankOf(b,pp))[0];
  if(bw!=null&&rankOf(bw,pp)<=12&&L.length<2)L.push(pk(['Best win: No. '+rankOf(bw,pp)+' '+team(bw).name+'.','The win over No. '+rankOf(bw,pp)+' '+team(bw).name+' was a big part of the case.','Beat No. '+rankOf(bw,pp)+' '+team(bw).name+', and the committee did not forget it.']));
  if(L.length<1)L.push(pk(['Went '+r.w+'-'+r.l+' and took care of the games they were supposed to win.',r.w+' wins and a steady resume. Nothing flashy, just solid.','A '+r.w+'-'+r.l+' team that nobody wants to see in a road game.']));
  if(id===S.userId)L.push(pk(['Coach '+S.coach+' and the team erupt in the film room.','Cameras catch the locker room going absolutely wild.','Your players are on their feet. Phones are buzzing.']));
  return L.slice(0,2).join(' ')||'The committee had them No. '+n+'.';
}
function selTeam(id,n,big){
  const t=team(id),me=id===S.userId,auto=(S.post.auto||[]).includes(id);
  return '<div class="seltm'+(me?' me':'')+(big?' big':'')+'"><span class="seln">'+n+'</span><span class="selbadge" style="background:none">'+logoSVG(t)+'</span><div style="min-width:0"><b>'+esc(t.name)+'</b><span class="muted">'+recStr(id)+(auto?' · '+esc(CONFS[t.conf])+' champion':'')+'</span></div></div>';
}
function selBoard(upto){
  const P=S.post,shown=new Set(),fresh={},steps=selSteps().slice(0,upto+1);
  steps.forEach((s,k)=>{const cur=k===upto;if(s.k==='r1'){const r=R1.find(x=>x[0]===s.br);shown.add(r[1]);shown.add(r[2]);if(cur){fresh[r[2]]=.3;fresh[r[1]]=.8}}if(s.k==='bye'){shown.add(s.n);if(cur)fresh[s.n]=s.n===1?1.4:.6}});
  let h='<div class="selboard">';
  for(let n=1;n<=12;n++){const id=P.seeds[n-1],on=shown.has(n);h+='<div class="selslot'+(on?' on':'')+(fresh[n]!=null?' fresh':'')+(on&&id===S.userId?' me':'')+'"'+(fresh[n]!=null?' style="animation-delay:'+fresh[n]+'s"':'')+'><span class="seln">'+n+'</span>'+(on?''+mlogo(team(id))+''+esc(team(id).abbr):'<span class="muted">?</span>')+'</div>'}
  return h+'</div>';
}
function selectionView(){
  const steps=selSteps(),i=clamp(S.sel?S.sel.i:0,0,steps.length-1),s=steps[i],P=S.post,sd=n=>P.seeds[n-1],yr=yearOf(S.season),u=S.userId;
  let stage='';
  if(s.k==='intro'){
    const rr=selRng('intro');
    stage='<span class="eyebrow">Live · Selection Sunday</span><h1 class="selh">The '+yr+' Playoff field</h1><p class="selq">'+esc(['Twelve teams. Four conference champions. Eight at-large spots. The committee has been locked in a room all day. It is time.','The debates are over. The committee chair is at the podium. Somebody is about to get great news, and somebody is about to have a long night.','Thirty-two programs started the season with a dream. Twelve are about to hear their name called.'][Math.floor(rr()*3)])+'</p>'+
      '<p class="muted" style="font-size:13px">'+(P.seeds.includes(u)||P.out.includes(u)?'Your team is in the conversation. Stay close to the TV.':'Your team is not in the mix this year, but the drama is still worth watching.')+'</p>';
  }else if(s.k==='champs'){
    stage='<span class="eyebrow">Conference champions · automatic bids</span><h2 class="selh2">Four tickets already punched</h2><div class="selgrid">'+[0,1,2,3].map(c=>{const id=S.champs.conf[c],g=S.games.find(x=>x.ccg===c);if(id==null)return '';const lo=g?(winnerOf(g)===g.h?g.a:g.h):null;return '<div class="selcard in"><span class="eyebrow">'+esc(CONFS[c])+'</span>'+selTeam(id,P.seeds.indexOf(id)+1>0?'C':'',false)+(g?'<p class="muted" style="font-size:12.5px">Beat '+esc(team(lo).name)+' '+Math.max(g.hs,g.as)+'-'+Math.min(g.hs,g.as)+(g.ot?' in OT':'')+'</p>':'')+'</div>'}).join('')+'</div>';
  }else if(s.k==='r1'){
    const r=R1.find(x=>x[0]===s.br),hi=sd(r[1]),lo=sd(r[2]),mine=hi===u||lo===u;
    stage='<span class="eyebrow">First round · on campus</span><h2 class="selh2">No. '+r[2]+' at No. '+r[1]+'</h2>'+(mine?'<div class="selyou">YOU ARE IN</div>':'')+
      '<div class="selcard in">'+selTeam(lo,r[2],true)+'<p class="selb">'+esc(selBlurb(lo,r[2]))+'</p></div><div class="selvs">at</div><div class="selcard in" style="animation-delay:.5s">'+selTeam(hi,r[1],true)+'<p class="selb">'+esc(selBlurb(hi,r[1]))+'</p></div>'+
      '<p class="muted" style="font-size:12.5px">Winner faces No. '+QF.find(q=>q[2]===s.br)[1]+' '+esc(team(sd(QF.find(q=>q[2]===s.br)[1])).abbr)+' in the '+CFP_QF[QF.findIndex(q=>q[2]===s.br)]+'.</p>';
  }else if(s.k==='bye'){
    const id=sd(s.n),qi=QF.findIndex(q=>q[1]===s.n),mine=id===u;
    stage='<span class="eyebrow">'+(s.n===1?'And the top seed':'First-round bye')+'</span><h2 class="selh2">'+(s.n===1?'The No. 1 seed is...':'No. '+s.n+' seed')+'</h2>'+(mine?'<div class="selyou">'+(s.n===1?'NUMBER ONE. THAT IS YOU.':'A BYE. THAT IS YOU.')+'</div>':'')+
      '<div class="selcard in'+(s.n===1?' gold':'')+'" style="animation-delay:'+(s.n===1?'1.1s':'.3s')+'">'+selTeam(id,s.n,true)+'<p class="selb">'+esc(selBlurb(id,s.n))+'</p><p class="muted" style="font-size:12.5px">Rests a week, then plays in the '+CFP_QF[qi]+'.</p></div>';
  }else if(s.k==='out'){
    stage='<span class="eyebrow">The bubble</span><h2 class="selh2">First four out</h2><div class="selgrid">'+P.out.map((id,k)=>'<div class="selcard out" style="animation-delay:'+(k*.25)+'s">'+selTeam(id,'—',false).replace('<span class="seln">—</span>','<span class="seln">'+(13+k)+'</span>')+'<p class="muted" style="font-size:12.5px">'+esc(rec(id).l>=4?'Too many losses to overcome.':sosRanks()[id]>=20?'The schedule did them in.':'Left on the outside by a whisker.')+'</p></div>').join('')+'</div>'+(P.out.includes(u)?'<div class="selyou bad">SO CLOSE. YOU ARE OUT.</div>':'');
  }else if(s.k==='you'){
    const b=S.post.bowl;
    stage='<span class="eyebrow">Your team</span><h2 class="selh2">'+esc(team(u).name)+'</h2>'+(b?'<div class="selcard in">'+selTeam(u,'',true)+'<p class="selb">No playoff this year, but you are going bowling: the '+esc(b.name)+' against '+esc(team(b.opp).name)+' ('+recStr(b.opp)+').</p></div>':'<div class="selcard out">'+selTeam(u,'',true)+'<p class="selb">No postseason this year. The offseason starts now.</p></div>');
  }else if(s.k==='react'){
    const rr=selRng('react'),pk=a=>a[Math.floor(rr()*a.length)],posts=[];
    const mk=(id,pool,kind)=>posts.push({h:'@'+handle(id,kind||'fan',rr),txt:pk(pool).replace(/\{t\}/g,team(id).name).replace(/\{n\}/g,P.seeds.indexOf(id)+1),likes:Math.floor(40+rr()*3800),kind:kind||'fan',team:id});
    mk(sd(1),['WE GOT THE ONE SEED. Book the hotel for the semis.','No. 1 overall. Respect finally paid.','Top seed. Now go finish it.'],'fan');
    if(P.seeds.includes(u))mk(u,['WE ARE IN. I am crying at a Sunday lunch buffet.','No. {n} seed! Playoff football is coming!','They called our name and the whole house screamed.']);
    P.out.slice(0,2).forEach(id=>mk(id,['Robbed. Absolutely robbed.','The committee watched one game of ours and decided. Unreal.','We beat teams in that field. Explain it.','First four out is the worst place to be.']));
    if(sd(12)!==u)mk(sd(12),['Last ones in, first ones to make noise. Watch us.','Nobody wants to play us. Nobody.','Bubble survived. Now we hunt.']);
    const rv=P.out.length?rivalsOf(P.out[0]).map(r=>r.a===P.out[0]?r.b:r.a).find(x=>x!==P.out[0]):null;if(rv!=null)posts.push({h:'@'+handle(rv,'fan',rr),txt:pick2(['{t} left out? The committee got one right.','Enjoy watching from the couch, {t}.','Sorry {t}. Actually, not sorry.']).replace(/\{t\}/g,team(P.out[0]).name),likes:Math.floor(40+rr()*2400),kind:'rival',team:rv});
    function pick2(a){return a[Math.floor(rr()*a.length)]}
    posts.unshift({h:'@'+handle(sd(1),'media',rr),txt:'The '+yr+' Playoff field is set. '+team(sd(1)).name+' is the No. 1 seed. First four out: '+P.out.map(id=>team(id).abbr).join(', ')+'.',likes:Math.floor(500+rr()*2400),kind:'media',team:sd(1)});
    stage='<span class="eyebrow">Reaction</span><h2 class="selh2">The internet has thoughts</h2>'+postsHTML(posts);
  }else if(s.k==='bracket'){
    stage='<span class="eyebrow">Field set</span><h2 class="selh2">Your '+yr+' Playoff bracket</h2>'+bracketCard();
  }
  const last=i>=steps.length-1;
  return '<div class="sel"><div class="selbar"><span class="live">LIVE</span><b>Selection Sunday</b><span class="muted num">'+(i+1)+'/'+steps.length+'</span></div>'+selBoard(i)+'<div class="selstage" key="'+i+'">'+stage+'</div><div class="row selctl">'+(i>0?'<button class="btn ghost" data-act="selprev">Back</button>':'')+(last?'<button class="btn" data-act="selclose">Done</button>':'<button class="btn" data-act="selnext">'+(i===0?'Start the show':'Next')+'</button><button class="btn ghost small" data-act="selend">Skip to bracket</button>')+'</div></div>';
}

/* ---------- home/away balance ---------- */
function balanceHA(games){
  const rivKey=(a,b)=>(S.rivals||[]).find(r=>(r.a===a&&r.b===b)||(r.a===b&&r.b===a));
  const pin=new Set();
  games.forEach((g,i)=>{const r=rivKey(g.h,g.a);if(r){const h=(S.season||1)%2?r.a:r.b;if(g.h!==h){g.a=g.h;g.h=h}pin.add(i)}});
  const T={};S.teams.forEach(t=>T[t.id]=[]);games.forEach((g,i)=>{T[g.h].push(i);T[g.a].push(i)});
  for(const id in T)T[id].sort((x,y)=>games[x].wk-games[y].wk);
  const cost=id=>{const L=T[id];let h=0,run=0,last=null,pen=0;for(const i of L){const hm=games[i].h==id;if(hm)h++;if(hm===last)run++;else run=1;last=hm;if(run>=3)pen+=(run-2)*(run-2)*3+2}return Math.abs(h-L.length/2)*60+pen*5};
  const rr=srng(hashS('ha'+(S.season||1)+':'+games.length)),free=games.map((g,i)=>i).filter(i=>!pin.has(i));
  const flip=i=>{const g=games[i],t=g.h;g.h=g.a;g.a=t};
  for(let it=0;it<60000;it++){
    if(it%2){const i=free[Math.floor(rr()*free.length)],g=games[i],c0=cost(g.h)+cost(g.a);flip(i);const c1=cost(g.h)+cost(g.a);if(c1>c0||(c1===c0&&rr()<.5))flip(i);continue}
    const ids=Object.keys(T),x=+ids[Math.floor(rr()*ids.length)],L=T[x].filter(i=>!pin.has(i)),hs=L.filter(i=>games[i].h===x),as=L.filter(i=>games[i].a===x);if(!hs.length||!as.length)continue;
    const i=hs[Math.floor(rr()*hs.length)],j=as[Math.floor(rr()*as.length)],ts=new Set([x,games[i].a,games[j].h]),c0=[...ts].reduce((a,t)=>a+cost(t),0);
    flip(i);flip(j);const c1=[...ts].reduce((a,t)=>a+cost(t),0);if(c1>c0||(c1===c0&&rr()<.5)){flip(i);flip(j)}
  }
  return games;
}
/* ---------- rivalry intensity ---------- */
function rivBoost(g,id){
  if(!g||g.riv==null)return 0;const o=g.h===id?g.a:g.h;
  const me=rOff(id)+rDef(id),th=rOff(o)+rDef(o);if(me>=th)return 0;
  return clamp((th-me)*.3,0,6.5);
}
/* ---------- series history since 2006 ---------- */
function fixSeries(){
  if(S&&S.rivals&&S.serV2&&!S.serV3){
    const nm=x=>team(x).name||'';
    for(const rv of S.rivals){if(!(/Knutson/.test(rv.trophy||'')||(/Jerome/.test(nm(rv.a)+nm(rv.b))&&/Berean/.test(nm(rv.a)+nm(rv.b)))))continue;
      const jA=/Jerome/.test(nm(rv.a));rv.sa=jA?5:4;rv.sb=jA?4:5;rv.holder=jA?rv.a:rv.b;rv.prev=null;rv.last={season:0,w:rv.holder,s:''};
      const i=S.rivals.indexOf(rv);for(const g of (S.games||[]).filter(g=>g.done&&g.riv===i).sort((a,b)=>a.wk-b.wk)){const W=winnerOf(g);rv.prev=rv.holder;rv.holder=W;W===rv.a?rv.sa++:rv.sb++;rv.last={season:S.season,w:W,s:Math.max(g.hs,g.as)+'-'+Math.min(g.hs,g.as)}}}
    S.serV3=true;return;
  }
  if(!S||!S.rivals||S.serV2)return;
  const yrs=Math.max(1,(S.baseYear||2025)-2006+1);
  const tw={dynasty:.06,power:.04,contender:.02,fallen:0,middle:0,rising:-.02,rebuild:-.03,basement:-.06};
  for(const rv of S.rivals){
    const rr=srng(hashS('series:'+Math.min(rv.a,rv.b)+':'+Math.max(rv.a,rv.b)));
    const nm=x=>team(x).name||'',isK=/Knutson/.test(rv.trophy||'')||(/Jerome/.test(nm(rv.a)+nm(rv.b))&&/Berean/.test(nm(rv.a)+nm(rv.b)));
    let n=isK?(rv.type==='occ'?6:Math.min(yrs,(S.baseYear||2025)-2016+1)):(rv.type==='occ')?3+Math.floor(rr()*7):yrs;
    const A=team(rv.a),B=team(rv.b),ta=(A.hist&&tw[A.hist.tier])||0,tb=(B.hist&&tw[B.hist.tier])||0;
    const pa=clamp(.5+(A.prestige-B.prestige)*.012+(ta-tb)+(rr()-.5)*.16,.2,.8);
    rv.sa=Math.round(n*pa);rv.sb=n-rv.sa;rv.holder=rr()<pa?rv.a:rv.b;rv.prev=null;rv.last={season:0,w:rv.holder,s:''};
    if(isK){const jA=/Jerome/.test(nm(rv.a));rv.sa=jA?5:4;rv.sb=jA?4:5;rv.holder=jA?rv.a:rv.b}
    if(rv.base&&rv.base.a!=null){rv.sa=rv.base.a;rv.sb=rv.base.b;if(rv.base.h!=null)rv.holder=rv.base.h}else rv.base={a:rv.sa,b:rv.sb,h:rv.holder};
    const prior=(rv.hist||[]).filter(m=>m.y<yearOf(S.season)&&(m.w===rv.a||m.w===rv.b)).sort((a,b)=>a.y-b.y);
    for(const m of prior){rv.prev=rv.holder;rv.holder=m.w;m.w===rv.a?rv.sa++:rv.sb++;rv.last={season:m.y-((S.baseYear||2025)),w:m.w,s:m.s}}
    rv.hist=prior;
  }
  const done=(S.games||[]).filter(g=>g.done&&g.riv!=null).sort((a,b)=>a.wk-b.wk);
  for(const g of done){const rv=S.rivals[g.riv];if(!rv)continue;const W=winnerOf(g);rv.prev=rv.holder;rv.holder=W;W===rv.a?rv.sa++:rv.sb++;rv.last={season:S.season,w:W,s:Math.max(g.hs,g.as)+'-'+Math.min(g.hs,g.as)};rv.hist=rv.hist||[];rv.hist.push({y:yearOf(S.season),w:W,s:rv.last.s,h:g.neutral?null:g.h,ot:!!g.ot,t:g.tag||''})}
  S.serV2=true;S.serV3=true;
}
/* ---------- matchup and reaction feeds ---------- */
const FY={
 trashW:['Hey {oppabbr}, the {trophy} looks great in our trophy case.','{score}. Say it slow, {opp} fans.','Series is {ser} now and it is only going one direction.','Somebody check on the {oppm}. They have not been the same since kickoff.','{opp} fans, see you next year. Bring tissues.','We live rent free in every {opp} fan\'s head.','Tell your coach the {trophy} is not coming back.','Little brother {oppabbr} tried it again. Cute.','Every {opp} fan in my group chat just went silent. Beautiful.','{opp} talked all week. Scoreboard says {score}.','Framing this box score and mailing it to my {opp} cousin.','Wearing my {mascot} gear to work Monday. Every {opp} fan is going to see it.','{opp} folded like a lawn chair.','Hope the bus ride home was long and quiet, {oppabbr}.','Is it still a rivalry if one side keeps winning? Asking for {opp}.','The {trophy} is not a rental, {oppabbr}. It lives here.','Imagine being an {oppm} fan right now. I cannot.','Put {opp} on the schedule twice next year. We will take both.'],
 copeL:['Deleting the internet for a week.','Do not let {opp} fans know where I live.','Muting the word {trophy} on every app I have.','Monday at work is going to be a nightmare.','That one hurts more than any other loss. Every year.','I have to watch {opp} fans celebrate for 365 days. Pray for me.','Next year. I am counting the days already.'],
 winTrash:['{opp} came in talking and left quiet.','Thanks for stopping by, {oppabbr}. Drive safe.','Hope {opp} enjoyed the scenery. We sure did.','{oppm} fans were loud in the first quarter. Funny how that works.'],
 pvHype:['Saturday cannot get here fast enough. {opp} is next.','Big week. {opp} is no joke.','Already planning the tailgate menu for {opp}.','Beat {oppabbr}. That is the whole message this week.','Film study says {opp} is beatable. My heart agrees.','Who else has been thinking about {opp} since Sunday?'],
 pvHome:['Pack the stands. {opp} needs to feel it.','Home game this week. Make it loud for {opp}.','Our place, our rules. Welcome, {oppabbr}.'],
 pvRoad:['Road trip to see {opp}. Who is driving?','Hostile crowd at {opp} this week. Good. Silence them.','Bringing a full section to {oppabbr}. Wear the colors.'],
 pvFav:['Should be a comfortable one against {opp}. Should be.','Favored by {line}. Do not sleep on {opp} though.','Business trip. Handle {opp} and move on.','Trap game vibes against {opp}. Stay focused.'],
 pvDog:['Nobody thinks we can beat {opp}. Perfect.','{line} point underdogs? Disrespect fuels us.','Everybody has us losing to {opp}. Upset brewing.','The pressure is all on {opp}. We have nothing to lose.'],
 pvBig:['Ranked showdown with {opp}. Clear your Saturday.','Playoff implications all over this {opp} game.','This {opp} game decides a lot. Let us go.'],
 pvRevenge:['{opp} got us last time. Not happening twice.','We remember last year, {oppabbr}. Revenge tour starts Saturday.','Been waiting a whole year to get {opp} back.'],
 pvRiv:['See you Saturday, {oppabbr}. We will keep the {trophy} safe for you.','{opp} fans are already making excuses. Love to see it.','Hope {opp} is ready for the loudest game of their lives.','The {oppm} have circled this game all year. So have we.','{opp} week. Bad blood. No friends this week.','Win this one and the season is already a success.','Bring the {trophy}, {oppabbr}. Or come take ours. Either way.','I do not care about rankings this week. Beat {opp}.','My {opp} neighbor put a flag up. War has been declared.'],
 pvRivLead:['Series is {ser}. Time to remind {oppabbr} who runs this.','We lead it {ser} all time. Make it one more.','{ser} all time and {opp} fans still think they have a shot.'],
 pvThird:['Rooting for anybody but {team} this week.','Hope {opp} takes care of {team}. Never thought I would say that.','Grabbing popcorn for {team} vs {opp}.','{team} vs {opp}? I hope it goes to six overtimes and both lose.']
};
/* ---------- postseason rivalry games: everything turns up ---------- */
function bigRiv(g){return !!(g&&g.riv!=null&&S.rivals&&S.rivals[g.riv]&&(g.po||g.ccg!=null||g.bowl))}
function troN(rv){return (rv.trophy||'').replace(/^The /,'')}
function bigStage(g){return g.final?'the national championship':g.po?'the '+(g.tag||'playoff').split(' · ')[0].replace('CFP ','playoff ').toLowerCase():g.ccg!=null?'the conference title game':'a bowl game'}
function bigSer(rv){return team(rv.a).abbr+' '+rv.sa+', '+team(rv.b).abbr+' '+rv.sb}
const BIGR={
 pv:['Rivalry game. In the PLAYOFFS. I have not slept since the bracket dropped.','Tailgates started Wednesday. I am not joking.','Imagine ending {opp}\'s season in the playoffs. I imagine it every night.','{oppabbr} fans, you are not ready for this.','The {trophy} AND a playoff win? Christmas came early.','Lose to {opp} in the playoffs and I am moving to another state.','Tickets are going for a mortgage payment. Worth every penny.','Biggest game in the history of this rivalry. Not close.','Win and advance. Lose and hear about it forever.','bad blood szn: playoff edition.','whole town is SO back. whole town is also terrified.','Season on the line against THEM. You cannot script this.','Nobody at my work is speaking to each other this week. Half of them are {oppm} fans.','Series is {ser}. Time to add the biggest one yet.','My {oppm} neighbor put up a flag. I put up two.','I have watched every {trophy} game since I was six. None of them meant this much.','If we lose this I am changing my name and moving.','{opp} fans think they have a chance. Adorable.','They have been talking since the bracket came out. Saturday we answer.','I bought a new jersey for this. Lucky socks are coming out of retirement too.'],
 third:['Best game of the playoff and it is not close.','Grabbing popcorn. These two genuinely hate each other.','Neutral fan here. I need this one to go to triple overtime.','Whoever loses this is going to be insufferable until August.','Rivalry game in the playoff? Sickos, this is our Super Bowl.','I do not care about either team and I am still nervous.'],
 media:['BAD BLOOD IN THE BRACKET: {a} and {h} meet in {stage} with the {trophy} rivalry and a season on the line. Series: {ser}.','Rivalry week came early: {a} and {h} collide in {stage}. Series: {ser}. One of them goes home for good.','Tickets for {a} at {h} are the hottest in the bracket. The {trophy} rivalry has never had stakes like this.'],
 trash:['We ended {opp}\'s season. In the PLAYOFFS. Let that sink in.','Season over for {oppabbr}. Courtesy of us.','{opp} fans, enjoy the offseason. It is going to be a long one.','Knocked our rival out of the playoff. Best day of my life.','Survive and advance, and send {opp} home. Perfect Saturday.','The {trophy} AND a playoff win. WE ARE SO BACK.','{opp} season: cooked. charcoal. ash.','Sent them home in front of everybody. Frame it.','Tell your kids about this one. Tell their kids too.','I have never been louder in my life. My voice is gone. Worth it.'],
 cope:['Losing to them is bad. Losing to them in the playoffs is a nightmare.','Season over. To THEM. I cannot.','I will hear about this until the day I die.','Worst way for a season to end. The absolute worst.','its so over. and THEY did it.','Not leaving my house until spring.','Somebody hold me. Not a {oppm} fan though.'],
 res:['{w} ends rival {l}\'s season, {score}, in {stage}.','Bad blood decided: {w} knocks out {l}, {score}.','{w} wins the biggest {trophy} game ever played, {score}. {l} goes home.'],
 log:['The stadium is SHAKING on third down.','You cannot hear yourself think in here.','Both fan bases on their feet. This place is electric.','Phone flashlights everywhere. This crowd is unreal.','The student section has not sat down since kickoff.','Bad blood all over this one. Pushing and shoving after the whistle.']
};
/* ---------- GameDay: the Saturday morning show ---------- */
const GD_PANEL=['Marcus Bell','Dee Hollins','Coach Ray Tolliver'];
const GD_CELEB=['Country singer Travis Kemper','Former All-American QB Rusty Dalton','Actor Mason Reid','Comedian Lenny Ortiz','Olympic sprinter Jada Fields','Pro bass fisherman Hank Doyle','Food truck legend Big Earl','Weather anchor Gale Whitfield','Former coach Buck Wheeler','Gospel singer Ruth Ann Moss'];
function gdGame(wk){
  const p=poll(),gs=S.games.filter(g=>g.wk===wk&&!g.final);let best=null,bs=-1e9;
  const recent=(S.gdHist||[]).filter(x=>x.season===S.season).slice(-3).map(x=>x.h);
  for(const g of gs){const a=rankOf(g.a,p),h=rankOf(g.h,p);let v=60-Math.min(a,h)*2-Math.max(a,h)*1.2+(g.riv!=null?14:0)+(bigRiv(g)?20:0)+(g.po?10:0)+(g.ccg!=null?8:0)+(gameEnv(g).theme?6:0)+(g.h===S.userId||g.a===S.userId?3:0)-(recent.includes(g.h)?25:0);if(v>bs){bs=v;best=g}}
  return best;
}
function gdShow(){
  if(S.week>15)return null;
  if(S.gd&&S.gd.season===S.season&&S.gd.wk===S.week)return S.gd;
  const g=gdGame(S.week);if(!g)return null;
  const rr=srng(hashS(S.season+':gd:'+S.week)),pk=a=>a[Math.floor(rr()*a.length)],A=team(g.a),H=team(g.h),gi=S.games.indexOf(g),p=poll();
  const signs=[pk(['Mom said I could skip church if I went to GameDay. Kidding, Mom. See you at 11.','{hm} by 30. I did the math. Trust me.','I drove 9 hours for this sign and I still spelled it wrong','{aa} fans: the bus home leaves at halftime','Will trade my little brother for {aa} tickets','My grandma has been tailgating since 1971. Respect her.','Wake up, it is GameDay','Dad, I promise I studied (this sign counts)','{hm} ate my homework and I am fine with it']),pk(['Hi Mom! Send snacks','{a} has not won here since dial-up internet','Pick {hm} or we riot (peacefully, we are Baptists)','{ha} > your team','Somebody tell {aa} the {tr} is not coming with them','I came for the free donuts and stayed for the bad blood','Third and Saturday told me to come','Sickos Committee, local chapter']),pk(['Panel, please pick {hm}. My wife is watching.','Rate my sign: 10/10','{am} fans are just {hm} fans who gave up','Will this get me on TV?','I made this at 3am. Worth it.'])];
  const fill2=s=>s.replace(/\{hm\}/g,H.mascot).replace(/\{am\}/g,A.mascot).replace(/\{aa\}/g,A.abbr).replace(/\{ha\}/g,H.abbr).replace(/\{a\}/g,A.name).replace(/\{tr\}/g,g.riv!=null?S.rivals[g.riv].trophy.replace(/^The /,''):'game');
  const top=S.games.filter(x=>x.wk===S.week&&x!==g).map(x=>{stampGame(x);return x}).sort((x,y)=>Math.min(rankOf(x.h,p),rankOf(x.a,p))-Math.min(rankOf(y.h,p),rankOf(y.a,p))).slice(0,3);
  const games=[g,...top];stampGame(g);
  const picks=games.map(x=>{const fav=(x.pl||0)>=0?x.h:x.a,dog=fav===x.h?x.a:x.h,sp=Math.abs(x.pl||0);return {gi:S.games.indexOf(x),p:GD_PANEL.map((_,j)=>rr()<(sp<4?.42:sp<10?.26:.1)?dog:fav)}});
  const celeb=pk(GD_CELEB),hp=rr()<(g.pl>=0?.72:.55)?g.h:g.a;
  S.gd={season:S.season,wk:S.week,gi,signs:signs.map(fill2),picks,celeb,head:hp,hfav:rr()<.15?GD_PANEL[2]:null};
  S.gdHist=S.gdHist||[];if(!S.gdHist.some(x=>x.season===S.season&&x.wk===S.week))S.gdHist.push({season:S.season,wk:S.week,h:g.h});
  return S.gd;
}
function gdCard(){
  const D=gdShow();if(!D)return '';const g=S.games[D.gi];if(!g)return '';const A=team(g.a),H=team(g.h),mine=g.h===S.userId||g.a===S.userId,where=g.neutral?(g.tag&&g.tag.includes('·')?g.tag.split('· ')[1]:g.tag||'a neutral site'):(H.city||H.name);
  const pickRow=x=>{const gg=S.games[x.gi];if(!gg)return '';return '<div class="gdp"><span class="gdm">'+mlogo(team(gg.a))+esc(team(gg.a).abbr)+' '+(gg.neutral?'vs':'at')+' '+mlogo(team(gg.h))+esc(team(gg.h).abbr)+'</span>'+x.p.map((t,j)=>'<span class="gdv" title="'+esc(GD_PANEL[j])+'">'+mlogo(team(t))+'</span>').join('')+'</div>'};
  return '<section class="card gd"><div class="spread"><span class="eyebrow">Saturday GameDay</span><span class="gdlive">LIVE</span></div><h2 style="margin:2px 0">GameDay is in '+esc(where)+'</h2>'+
    '<p class="muted" style="font-size:13px;margin:0 0 6px">'+esc(A.name)+' '+(g.neutral?'vs':'at')+' '+esc(H.name)+(g.riv!=null?' for '+esc(S.rivals[g.riv].trophy):'')+'. The crowd showed up at 4 a.m.</p>'+envChips(g)+
    '<div class="gdsigns">'+D.signs.map((s,i)=>'<div class="gdsign" style="--r:'+((i-1)*3)+'deg;--d:'+(.2+i*.35)+'s">'+esc(s)+'</div>').join('')+'</div>'+
    '<h3 style="margin:10px 0 4px">Panel picks</h3><div class="gdhead"><span></span>'+GD_PANEL.map(n=>'<small>'+esc(n.split(' ').pop())+'</small>').join('')+'</div>'+D.picks.map(pickRow).join('')+
    '<div class="gdhg"><span class="eyebrow">Guest picker: '+esc(D.celeb)+'</span><p class="gdtease">Reaches under the desk for the headgear...</p><div class="gdpick">'+mlogo(team(D.head),'big')+'<b>'+esc(team(D.head).mascot)+' head goes ON.</b><span class="muted">'+(D.head===g.h&&!g.neutral?'The crowd goes absolutely nuts.':'Boos rain down from the home crowd.')+'</span></div></div>'+
    (mine?'':'<div class="row"><button class="btn ghost small" data-act="watch" data-g="'+D.gi+'">Watch this game</button></div>')+'</section>';
}
function themeSpot(){
  const gs=S.games.filter(g=>g.wk===S.week&&!g.done&&!bigRiv(g)&&gameEnv(g).theme);if(!gs.length)return '';
  return '<section class="card"><span class="eyebrow">Game day atmosphere</span>'+gs.map(g=>{const e=gameEnv(g),gi=S.games.indexOf(g),mine=g.h===S.userId||g.a===S.userId,lcs=gi===lcsWO();return '<div class="atm">'+mlogo(team(g.a))+'<b>'+esc(team(g.a).abbr)+'</b> at '+mlogo(team(g.h))+'<b>'+esc(team(g.h).abbr)+'</b> '+envChips(g)+'<p class="muted" style="font-size:12.5px;margin:4px 0">'+(lcs?'The famous annual Lighthouse Colorado whiteout. Opposing teams talk about it for years.':esc(team(g.h).name)+' fans are calling for a '+THEME[e.theme].w+(e.night?' under the lights':'')+'. Expect it to be loud.')+'</p>'+(mine?'':'<button class="btn ghost small" data-act="watch" data-g="'+gi+'">Watch</button>')+'</div>'}).join('')+'</section>';
}
function bigRivSpot(){
  const gs=S.games.filter(g=>g.wk===S.week&&!g.done&&bigRiv(g));if(!gs.length)return themeSpot();
  return themeSpot()+gs.map(g=>{const rv=S.rivals[g.riv],gi=S.games.indexOf(g),mine=g.h===S.userId||g.a===S.userId,A=team(g.a),H=team(g.h),rr=srng(hashS(S.season+':spot:'+gi)),post=[g.h,g.a,g.h].map((id,i)=>{const o=id===g.h?g.a:g.h,C=rivCtx(id,o);return {team:id,h:'@'+handle(id,'fan',rr),txt:fill(BIGR.pv[Math.floor(rr()*BIGR.pv.length)],{opp:team(o).name,oppabbr:team(o).abbr,oppm:team(o).mascot,trophy:rv.trophy,ser:C?C.ser:bigSer(rv)})}}).filter((p,i,a)=>a.findIndex(q=>q.txt===p.txt)===i);
    return '<section class="card rivcard electric"><span class="eyebrow">Playoff rivalry · '+esc(g.tag||'Postseason')+'</span><h2 style="margin:4px 0">Bad blood in the bracket</h2>'+
      '<div class="vs"><div class="t">'+badge(A)+'<b>'+(seedTag(g,A.id)?'('+seedTag(g,A.id)+') ':'')+A.abbr+'</b><small class="num">'+recStr(A.id)+'</small></div><span class="at">'+(g.neutral?'VS':'AT')+'</span><div class="t">'+badge(H)+'<b>'+(seedTag(g,H.id)?'('+seedTag(g,H.id)+') ':'')+H.abbr+'</b><small class="num">'+recStr(H.id)+'</small></div></div>'+
      '<p style="text-align:center">'+esc(rv.trophy)+' · Series '+esc(bigSer(rv))+'. One of them goes home for good.</p>'+
      '<div class="chips"><span class="chip bad">Sold out</span><span class="chip amber">Tickets: $$$$</span><span class="chip">Tailgates since Wednesday</span><span class="chip">Students camping out</span></div>'+
      '<div class="feed">'+post.map(p=>'<div class="post"><span class="av" style="background:'+team(p.team).color+'">'+esc(team(p.team).abbr)+'</span><div style="min-width:0"><b>'+esc(p.h)+'</b><p>'+esc(p.txt)+'</p></div></div>').join('')+'</div>'+
      '<div class="row">'+(mine?'':'<button class="btn" data-act="watch" data-g="'+gi+'">Watch it live</button>')+'<button class="btn ghost" data-act="gview" data-g="'+gi+'">Full preview and buzz</button><button class="btn ghost small" data-act="rview" data-r="'+g.riv+'">Rivalry history</button></div></section>'}).join('');
}
function matchupFeed(g,n){
  const rr=srng(hashS(S.season+':'+g.wk+':'+g.h+':'+g.a+':pre')),pk=a=>a[Math.floor(rr()*a.length)],p=poll(),rv=g.riv!=null?S.rivals[g.riv]:null;
  stampGame(g);const out=[],seen=new Set(),BR=bigRiv(g);if(BR)n=Math.max(n,22);
  const push=(id,pool,v,kind)=>{for(let k=0;k<6;k++){const t=fill(pk(pool),v);if(!seen.has(t)&&!/\{\w+\}/.test(t)){seen.add(t);out.push({h:'@'+handle(id,kind||'fan',rr),txt:t,likes:Math.floor((kind==='media'?80:4)+rr()*(kind==='media'?2400:3900)),kind:kind||'fan',team:id});return}}};
  const side=id=>{const o=id===g.h?g.a:g.h,fav=(id===g.h?g.pl:-g.pl)||0,C=rv?rivCtx(id,o):null,T=team(id),O=team(o);
    const v={team:T.name,abbr:T.abbr,mascot:T.mascot,opp:O.name,oppabbr:O.abbr,oppm:O.mascot,line:Math.abs(fav),trophy:rv?rv.trophy:'',ser:C?C.ser:''};
    const pools=[[FY.pvHype,3]];if(!g.neutral)pools.push([g.h===id?FY.pvHome:FY.pvRoad,2]);
    if(fav>=4)pools.push([FY.pvFav,3]);else if(fav<=-4)pools.push([FY.pvDog,3.5]);
    if(rankOf(id,p)<=PN&&rankOf(o,p)<=PN)pools.push([FY.pvBig,3]);
    if(BR)pools.push([BIGR.pv,16]);
    if(isSeniorDay(g)&&id===g.h)pools.push([['Senior Day. Send these guys out the right way.','Bring tissues Saturday. Senior Day always gets me.','Last time these seniors run out of our tunnel. Pack the place.','Thank you, seniors. Now go win one more at home.'],10]);
    {const EV=gameEnv(g);if(EV.theme&&id===g.h)pools.push([THEMEFEED[EV.theme],14]);if(EV.theme&&id===g.a)pools.push([['Heard they are doing a '+THEME[EV.theme].w+'. Cute. We are still winning.','Bring the noise. We will be fine. Probably.','Our QB better have the silent count ready.'],6])}
    if(rv){pools.push([FY.pvRiv,9]);if(C&&C.me>C.th)pools.push([FY.pvRivLead,3]);if(rv.last&&rv.last.w===o&&rv.last.season)pools.push([FY.pvRevenge,4])}
    return {id,o,v,pools}};
  const A=side(g.a),H=side(g.h);
  const fav=g.pl>=0?g.h:g.a;
  push(g.h,[rv?'Rivalry week: {a} at {h} for the {trophy}. Series: {ser}. {f} by {l}.':g.neutral?'{a} vs {h} on a neutral field. {f} favored by {l}.':'{a} at {h}. {f} favored by {l}.'],{a:team(g.a).name,h:team(g.h).name,trophy:rv?rv.trophy:'',ser:rv?team(rv.a).abbr+' '+rv.sa+', '+team(rv.b).abbr+' '+rv.sb:'',f:team(fav).name,l:Math.abs(g.pl||0)},'media');
  if(BR){out.length=0;seen.clear();push(g.h,BIGR.media,{a:team(g.a).name,h:team(g.h).name,stage:bigStage(g),trophy:rv.trophy,ser:bigSer(rv)},'media')}
  const per=Math.ceil((n-2)/2);
  for(let k=0;k<per;k++)for(const S2 of [H,A]){const c=wpickL(S2.pools,rr);push(S2.id,c[0],S2.v)}
  for(const S2 of [H,A]){const thr=rivalsOf(S2.id).map(r=>r.a===S2.id?r.b:r.a).filter(x=>x!==S2.o);if(thr.length&&rr()<.7){const t3=thr[Math.floor(rr()*thr.length)];push(t3,FY.pvThird,{team:team(S2.id).name,opp:team(S2.o).name},'rival')}}
  if(BR){const others=S.teams.filter(t=>t.id!==g.h&&t.id!==g.a);for(let i=0;i<3;i++)push(others[Math.floor(rr()*others.length)].id,BIGR.third,{},'rival')}
  const head=out.shift(),body=out;for(let i=body.length-1;i>0;i--){const j=Math.floor(rr()*(i+1));[body[i],body[j]]=[body[j],body[i]]}
  return [head,...body].slice(0,n);
}
function gameFeedBig(g){
  const base=gameFeed(g),rr=srng(hashS(S.season+':'+g.wk+':'+g.h+':'+g.a+':more')),pk=a=>a[Math.floor(rr()*a.length)],seen=new Set(base.map(x=>x.txt));
  const W=winnerOf(g),Lo=W===g.h?g.a:g.h,rv=g.riv!=null?S.rivals[g.riv]:null,ws=Math.max(g.hs,g.as),ls=Math.min(g.hs,g.as);
  const C=rv?rivCtx(W,Lo):null;
  const vW={opp:team(Lo).name,oppabbr:team(Lo).abbr,oppm:team(Lo).mascot,mascot:team(W).mascot,trophy:rv?rv.trophy:'',ser:C?C.ser:'',score:ws+'-'+ls};
  const vL={opp:team(W).name,oppabbr:team(W).abbr,trophy:rv?rv.trophy:''};
  const more=[],add=(id,pool,v)=>{for(let k=0;k<6;k++){const t=fill(pk(pool),v);if(!seen.has(t)&&!/\{\w+\}/.test(t)){seen.add(t);more.push({h:'@'+handle(id,'fan',rr),txt:t,likes:Math.floor(4+rr()*3900),kind:'fan',team:id});return}}};
  if(bigRiv(g)){for(let i=0;i<6;i++)add(W,BIGR.trash,vW);for(let i=0;i<4;i++)add(Lo,BIGR.cope,{...vL,oppm:team(W).mascot});const mr=fill(pk(BIGR.res),{w:team(W).name,l:team(Lo).name,score:ws+'-'+ls,stage:bigStage(g),trophy:troN(rv)});more.push({h:'@'+handle(W,'media',rr),txt:mr,likes:Math.floor(900+rr()*2400),kind:'media',team:W});const others=S.teams.filter(t=>t.id!==g.h&&t.id!==g.a);for(let i=0;i<2;i++){const o=others[Math.floor(rr()*others.length)].id;add(o,['That was the best game of the year. I need a nap.','Never seen two fan bases hate each other that much. Incredible.','Sickos, we ate tonight.','I have no dog in this fight and I am exhausted.'],{})}}
  if(rv){for(let i=0;i<7;i++)add(W,FY.trashW,vW);for(let i=0;i<2;i++)add(Lo,FY.copeL,vL)}
  else{add(W,FY.winTrash,vW);if(rr()<.5)add(W,FY.winTrash,vW)}
  for(const [pl] of sigPools(gameSig(g),true).slice(0,2))add(W,pl,{...gameSig(g).v,opp:team(Lo).name,coach:'Coach',mascot:team(W).mascot});
  more.push(...rivalChirps(Lo,'L',rr,2,{opp:team(W).name,excl:W}));
  const out=[...base];more.forEach((m,i)=>out.splice(Math.min(out.length,2+i*2),0,m));
  return out;
}
let FEEDUI={};const LIKED=new Set();
function feedBlock(key,list,a,b,title){
  const st=FEEDUI[key]||(FEEDUI[key]={f:'all',n:8}),f=st.f;
  const show=list.filter(p=>f==='all'||(f==='a'&&p.team===a&&p.kind!=='rival')||(f==='b'&&p.team===b&&p.kind!=='rival')||(f==='riv'&&p.kind==='rival')||(f==='media'&&p.kind==='media'));
  const tabs=[['all','All'],['a',team(a).abbr+' fans'],['b',team(b).abbr+' fans'],['riv','Rivals'],['media','Media']].filter(([k])=>k==='all'||list.some(p=>(k==='a'&&p.team===a&&p.kind!=='rival')||(k==='b'&&p.team===b&&p.kind!=='rival')||(k==='riv'&&p.kind==='rival')||(k==='media'&&p.kind==='media')));
  const items=show.slice(0,st.n);
  return '<div class="fblk"><div class="spread"><h3>'+esc(title)+'</h3><span class="muted" style="font-size:12px">'+show.length+' posts</span></div><div class="ftabs">'+tabs.map(([k,l])=>'<button data-act="ff" data-k="'+key+'" data-f="'+k+'" aria-pressed="'+(f===k)+'">'+esc(l)+'</button>').join('')+'</div>'+
    '<div class="feed">'+items.map(p=>{const t=team(p.team),lk=LIKED.has(p.txt);return '<div class="post'+(p.kind==='media'?' media':'')+(p.kind==='rival'?' rival':'')+'"><span class="av" style="background:'+(p.kind==='media'?'#3a4459':t.color)+'">'+(p.kind==='media'?'NEWS':esc(t.abbr))+'</span><div style="min-width:0"><b>'+esc(p.h)+'</b>'+(p.kind==='rival'?' <span class="muted" style="font-size:11.5px">'+esc(t.abbr)+' fan</span>':'')+'<p>'+esc(p.txt)+'</p><button class="likeb'+(lk?' on':'')+'" data-act="flike" data-t="'+esc(p.txt)+'" aria-pressed="'+lk+'"><span aria-hidden="true">'+(lk?'♥':'♡')+'</span> <span class="num">'+(p.likes+(lk?1:0)).toLocaleString()+'</span></button></div></div>'}).join('')+'</div>'+
    (show.length>items.length?'<button class="btn ghost small" data-act="fmore" data-k="'+key+'">More reactions ('+(show.length-items.length)+')</button>':'')+'</div>';
}

/* ---------- playoff bracket view ---------- */
function seedTag(g,id){return g&&g.po&&S.post&&S.post.seeds&&S.post.seeds.includes(id)?seedN(id):null}
function brSlot(id,seed,score,win,lose){
  if(id==null)return '<div class="bslot tbd"><span class="bs">'+(seed||'')+'</span><span class="muted">'+(seed?'':'TBD')+'</span></div>';
  const t=team(id);return '<div class="bslot'+(win?' bw':'')+(lose?' bl':'')+(id===S.userId?' me':'')+'"><span class="bs">'+seed+'</span>'+mlogo(t)+'<b>'+esc(t.abbr)+'</b>'+(score!=null?'<span class="bsc num">'+score+'</span>':'')+'</div>';
}
function brMatch(g,top,bot,label,canWatch){
  const sd=id=>id==null?'':seedN(id)||'';
  let inner;
  if(g){const w=g.done?winnerOf(g):null;const a=g.a,h=g.h;
    const first=seedN(a)<seedN(h)?a:h,second=first===a?h:a,sc=id=>g.done?(id===g.h?g.hs:g.as):null;
    inner=brSlot(first,sd(first),sc(first),w===first,w!=null&&w!==first)+brSlot(second,sd(second),sc(second),w===second,w!=null&&w!==second);
  }else inner=brSlot(top,sd(top),null)+brSlot(bot,bot==null?'':sd(bot),null).replace('<span class="muted">TBD</span>','<span class="muted">'+esc(label||'TBD')+'</span>');
  const gi=g?S.games.indexOf(g):-1,watch=g&&!g.done&&canWatch&&g.wk===S.week&&g.h!==S.userId&&g.a!==S.userId;
  return '<div class="bmatch">'+(g?'<button class="bbox" data-act="gview" data-g="'+gi+'" aria-label="'+esc(g.tag||'Playoff game')+'">'+inner+'</button>':'<div class="bbox">'+inner+'</div>')+
    (bigRiv(g)?'<span class="bname briv">Rivalry: '+esc(S.rivals[g.riv].trophy)+'</span>':'')+(g&&g.tag&&g.tag.includes('·')?'<span class="bname">'+esc(g.tag.split('· ')[1])+'</span>':'')+(watch?'<button class="btn small bwatch" data-act="watch" data-g="'+gi+'">Watch</button>':'')+'</div>';
}
function bracketView(){
  const F=cfpField(),sd=n=>F.seeds[n-1],locked=F.locked,u=S.userId;
  let h='<section class="card"><div class="spread"><h3>'+(locked?yearOf(S.season)+' Playoff':'Projected bracket')+'</h3><span class="muted" style="font-size:12px">'+(locked?'Seeds stay fixed all the way through':'If the season ended today')+'</span></div>';
  const fin=brGame('F');
  if(fin&&fin.done){const W=winnerOf(fin);h+='<div class="bchamp" style="--tc:'+team(W).color+'"><span class="eyebrow">National champion</span><b>'+esc(team(W).name)+'</b><span class="muted">No. '+seedN(W)+' seed</span></div>'}
  const col=(title,items)=>'<div class="bcol"><span class="eyebrow">'+title+'</span><div class="bstack">'+items.join('')+'</div></div>';
  const r1=R1.map(([br,a,b])=>brMatch(brGame(br),sd(a),sd(b),null,true));
  const qf=QF.map(([br,s,from],i)=>{const g=brGame(br),r=R1.find(x=>x[0]===from);return brMatch(g,sd(s),brWin(from),'Winner '+r[1]+'/'+r[2],true)});
  const sfp=[['SA','QA','QB'],['SB','QC','QD']].map(([br,x,y],i)=>brMatch(brGame(br),brWin(x),brWin(y),'Semifinal',true));
  const fn=[brMatch(fin,brWin('SA'),brWin('SB'),'Title game',true)];
  h+='<div class="bwrap"><div class="bgrid">'+col('First round',r1)+col('Quarterfinals',qf)+col('Semifinals',sfp)+col('Championship',fn)+'</div></div>';
  h+='<p class="muted" style="font-size:12.5px">Seeds 1 to 4 get byes. The 1 seed meets the 8/9 winner, 4 gets 5/12, 2 gets 7/10, 3 gets 6/11. Tap a game for the box score or preview.</p>';
  if(locked&&S.week>=13&&S.week<=16){
    const wk=S.games.filter(g=>g.wk===S.week&&!g.done&&g.h!==u&&g.a!==u);
    const mine=userGame(S.week);
    h+='<div class="row">'+(mine?'<button class="btn" data-act="tab" data-t="week">Play your game first</button>':'<button class="btn" data-act="advance">Sim the rest of the week</button>')+'</div>'+(wk.length?'<p class="muted" style="font-size:12.5px">'+wk.length+' game'+(wk.length>1?'s':'')+' left this week. Watch any of them, or sim the week.</p>':'');
  }
  if(F.out&&F.out.length&&!locked)h+='<p class="muted" style="font-size:13px">First four out: '+F.out.map(id=>esc(team(id).abbr)+' ('+recStr(id)+')').join(', ')+'</p>';
  return h+'</section>'+(locked?'<div class="row"><button class="btn ghost small" data-act="selwatch">Rewatch the selection show</button></div>':'');
}
/* ---------- watch mode: computer runs both sidelines ---------- */
function GU(){return G&&G.watch?G.uid:S.userId}
/* ---------- all-time head to head (rivals are tracked exactly; others seeded since 2006) ---------- */
function h2hRec(a,b){
  const C=rivCtx(a,b);if(C)return {a:C.me,b:C.th,n:C.me+C.th,riv:C.rv};
  S.h2h=S.h2h||{};const key=Math.min(a,b)+'-'+Math.max(a,b);let e=S.h2h[key];
  if(!e){const lo=Math.min(a,b),hi=Math.max(a,b),h=hashS('h2h:'+key)>>>0,same=team(a).conf===team(b).conf,n=same?8+h%11:(h%7===0?0:1+h%6),pl=team(lo).prestige/(team(lo).prestige+team(hi).prestige);let wl=0;for(let i=0;i<n;i++){if(((hashS(key+':'+i)>>>0)%1000)/1000<clamp(pl+.04*Math.sin(i),.2,.8))wl++}e=S.h2h[key]={lo:wl,hi:n-wl,seen:{}}}
  for(const g of S.games){if(!g.done||!((g.h===a&&g.a===b)||(g.h===b&&g.a===a)))continue;const gk=S.season+':'+S.games.indexOf(g);if(e.seen[gk])continue;e.seen[gk]=1;winnerOf(g)===Math.min(a,b)?e.lo++:e.hi++}
  const mine=a<b?e.lo:e.hi,th=a<b?e.hi:e.lo;return {a:mine,b:th,n:mine+th};
}
function h2hText(a,b){const r=h2hRec(a,b);if(!r.n)return 'First ever meeting';return r.a===r.b?'Series tied '+r.a+'-'+r.b:(r.a>r.b?team(a).abbr:team(b).abbr)+' leads '+Math.max(r.a,r.b)+'-'+Math.min(r.a,r.b)}
function keyPlayer(id){
  if(id===S.userId){const s=[...(S.stars||[])].sort((x,y)=>((y.s||{}).yds||0)-((x.s||{}).yds||0))[0];if(!s)return null;const x=s.s||{};return {name:s.name,pos:s.pos,line:(x.yds||0).toLocaleString()+' yds · '+(x.td||0)+' TD'}}
  const s=team(id).star;if(!s)return null;return {name:s.name,pos:s.pos,line:(s.yds||0).toLocaleString()+' yds · '+(s.td||0)+' TD'};
}
function introHTML(){
  const g=S.games[G.gid];if(!g)return '';const A=team(g.a),H=team(g.h),p=poll(),E=gameEnv(g);
  const rkS=id=>{const s=seedTag(g,id);if(s)return '('+s+')';const r=rankOf(id,p);return r<=PN?'No. '+r:''};
  const side=(T,cls)=>{const k=keyPlayer(T.id),I=IDm(T.id);return '<div class="tv-t '+cls+'"><div class="tv-logo">'+logoSVG(T)+'</div><span class="tv-rk">'+rkS(T.id)+'</span><b class="tv-nm">'+esc(T.name)+'</b><span class="tv-rec num">'+recStr(T.id)+'</span><span class="tv-id">'+esc(I.n)+'</span>'+(k?'<div class="tv-kp"><span>'+esc(k.pos)+' '+esc(short(k.name))+'</span><small class="num">'+esc(k.line)+'</small></div>':'')+'</div>'};
  const where=g.neutral?(g.tag&&g.tag.includes('·')?g.tag.split('· ')[1]:(g.tag||'Neutral site')):H.name+' home field';
  const cond=[E.night?'Under the lights':'Afternoon kickoff',E.dome?'Indoors':E.weather!=='clear'?WXN[E.weather]:'',E.theme?THEME[E.theme].n:''].filter(Boolean).join(' · ');
  const bl=g.neutral?[]:bannerList(g.h),nN=bl.filter(x=>x.natl).length,nC=bl.length-nN,O=(G.intro&&G.intro.o)||0;
  const EX=(G.intro&&G.intro.x!=null?G.intro.x:EXT_LEN);return '<div class="tvin" data-act="introskip" style="--o:'+(O+EX)+'s;--b:'+O+'s;--e:'+EX+'s">'+(O?'<div class="tv-ban"><span class="tv-live">HISTORY</span><div><b>'+esc(H.name)+'</b><span>'+(nN?nN+' national title'+(nN>1?'s':'')+(nC?' · ':''):'')+(nC?nC+' conference title'+(nC>1?'s':''):'')+'</span></div></div>':'')+'<div class="tv-l3"><span class="tv-live">LIVE</span><div><b>'+esc(where)+'</b><span>'+esc((g.neutral?'':(H.city||''))+(g.neutral?'':' · ')+cond)+'</span></div></div>'+
    '<div class="tv-card"><div class="tv-head">'+esc(g.tag||weekLabel(g.wk))+(g.riv!=null?' · '+esc(S.rivals[g.riv].trophy):'')+'</div><div class="tv-teams">'+side(A,'l')+'<div class="tv-vs">'+(g.neutral?'VS':'AT')+'</div>'+side(H,'r')+'</div>'+
    '<div class="tv-rows"><div><span>All-time</span><b>'+esc(h2hText(g.a,g.h))+'</b></div><div><span>Line</span><b>'+esc(spreadText(g))+'</b></div></div></div><button class="tv-skip" data-act="introskip">Skip intro</button></div>';
}
function endIntro(){if(!G||!G.intro)return;G.intro=null;SC.cam.pitch=.86;SC.cam.span=49;SC.cam.yaw=0;SC.cam.z=0;const el=typeof document.getElementById==='function'&&document.getElementById('g-intro');if(el)el.innerHTML='';if(G.watch)watchSchedule()}
/* ---------- live scoreboard ticker ---------- */
function scorePlan(pts){
  let n7=Math.floor(pts/7),r=pts%7;const out=[];
  if(r===1){if(n7>0){n7--;out.push(8)}else out.push(2)}else if(r===2)out.push(2);else if(r===3)out.push(3);else if(r===4){if(n7>0){n7--;out.push(8,3)}else out.push(2,2)}else if(r===5){if(n7>0){n7--;out.push(6,3,3)}else out.push(3,2)}else if(r===6){if(R()<.5)out.push(6);else out.push(3,3)}
  for(let i=0;i<n7;i++)out.push(7);return out.filter(x=>x>0);
}
function preSimWeek(skipGi){
  if(S.week>=12){for(const g of S.games)if(g.wk===S.week&&!g.done&&g.pre)delete g.pre;return}
  for(const g of S.games){const gi=S.games.indexOf(g);if(g.wk!==S.week||g.done||g.pre||gi===skipGi||g.h===S.userId||g.a===S.userId)continue;
    const sv={done:g.done,hs:g.hs,as:g.as,ot:g.ot};NOSTAR=true;try{simGame(g)}finally{NOSTAR=false}const fin={hs:g.hs,as:g.as,ot:!!g.ot};Object.assign(g,sv);g.done=false;delete g.hs;delete g.as;delete g.ot;
    const ev=[];for(const [side,pts] of [['h',fin.hs-(fin.ot&&fin.hs>fin.as?3:0)],['a',fin.as-(fin.ot&&fin.as>fin.hs?3:0)]])for(const p of scorePlan(Math.max(0,pts)))ev.push({s:side,p,f:.02+R()*.95});
    if(fin.ot)ev.push({s:fin.hs>fin.as?'h':'a',p:3,f:1});
    ev.sort((x,y)=>x.f-y.f);g.pre={...fin,ev};
  }
}
function gameFrac(){if(!G)return 0;if(G.phase==='over'||G.ot)return 1;return clamp(((G.q-1)*G.qlen+(G.qlen-G.clock))/(4*G.qlen),0,.999)}
function tickState(g,f){let h=0,a=0;for(const e of g.pre.ev){if(e.f>f)break;e.s==='h'?h+=e.p:a+=e.p}const fin=f>=1||g.pre.ev.every(e=>e.f<=f)&&f>=.985;return {h:fin?g.pre.hs:h,a:fin?g.pre.as:a,fin:f>=1}}
function tickItems(){
  if(!G||S.week>=12)return null;const gs=S.games.filter(g=>g.pre&&g.wk===S.week&&S.games.indexOf(g)!==G.gid&&!g.done);if(!gs.length)return '';
  const f=gameFrac(),p=poll(),q=f>=1?'Final':'Q'+Math.min(4,1+Math.floor(f*4));G.tickF=G.tickF||{};
  const items=gs.map(g=>{const st=tickState(g,f),hr=rankOf(g.h,p),ar=rankOf(g.a,p),fav=(g.pl||0)>=0?g.h:g.a,fr=fav===g.h?hr:ar,dogUp=fav===g.h?st.a>st.h:st.h>st.a,alert=fr<=PN&&dogUp&&f>=.62;
    const gi=S.games.indexOf(g);let upset=false;if(st.fin&&dogUp&&fr<=PN)upset=true;
    if(st.fin&&!G.tickF[gi]){G.tickF[gi]=1;if(upset){const W=st.h>st.a?g.h:g.a,Lo=W===g.h?g.a:g.h;log('FINAL elsewhere: '+team(W).name+' upsets '+(rankOf(Lo,p)<=PN?'No. '+rankOf(Lo,p)+' ':'')+team(Lo).name+', '+Math.max(st.h,st.a)+'-'+Math.min(st.h,st.a)+'.','k')}}
    const best=Math.min(hr,ar),both=hr<=PN&&ar<=PN,close=Math.abs(st.h-st.a)<=8&&f>=.5;
    const pr=(alert||upset?1000:0)+(best<=PN?(PN+1-best)*6:0)+(both?40:0)+(close?18:0)+(g.riv!=null?14:0)+(g.ccg!=null||g.po?60:0);
    const tag=upset?'<em class="tku">UPSET</em>':alert?'<em class="tku live">UPSET ALERT</em>':both?'<em class="tkt">TOP '+PN+' CLASH</em>':close&&!st.fin?'<em class="tkt">CLOSE</em>':g.riv!=null?'<em class="tkt">RIVALRY</em>':'';
    const row=(id,r,pts,win)=>'<div class="tks'+(win?' w':'')+'">'+mlogo(team(id))+'<span>'+(r<=PN?'<small>'+r+'</small>':'')+esc(team(id).abbr)+'</span><b class="num">'+pts+'</b></div>';
    return {pr,gi,g,st,hr,ar,alert,upset,both,close,tag,html:'<div class="tkg'+(alert||upset?' up':'')+(st.fin?' fin':'')+'">'+row(g.a,ar,st.a,st.fin&&st.a>st.h)+row(g.h,hr,st.h,st.fin&&st.h>st.a)+'<div class="tkm"><span>'+(st.fin?'Final':q)+'</span>'+tag+'</div></div>'}}).sort((a,b)=>b.pr-a.pr);
  return {items,f,q};
}
function btGame(x,q,hot){const p1=(id,r,pts,lose)=>'<span class="bt1'+(lose?' l':'')+(hot===id?' hot':'')+'">'+mlogo(team(id))+(r<=PN?'<small>'+r+'</small>':'')+esc(team(id).abbr)+' <b>'+pts+'</b></span>';const st=x.st;return p1(x.g.a,x.ar,st.a,st.fin&&st.a<st.h)+p1(x.g.h,x.hr,st.h,st.fin&&st.h<st.a)}
function tickerHTML(){
  const T=tickItems();if(!T||!T.items.length)return '';const {items,f,q}=T;G.tk=G.tk||{i:0,t:0,seen:null,qu:[],cur:null,ct:0};const K=G.tk;
  let body,key;
  if(K.cur){const x=items.find(y=>y.gi===K.cur.gi);if(x){key='p'+K.cur.id;body='<div class="bti pop'+(K.cur.up?' up':'')+'"><em class="'+(K.cur.up?'tku':'sc')+'">'+K.cur.lab+'</em><span class="btr">'+btGame(x,q,K.cur.who)+'<span class="btq">'+(x.st.fin?'Final':q)+'</span></span></div>'}}
  if(!body){const x=items[K.i%items.length];key='g'+x.gi+'|'+x.st.h+'-'+x.st.a+'|'+(x.st.fin?'F':q)+'|'+K.i;body='<div class="bti">'+btGame(x,q,null)+(x.tag?x.tag:'')+'<span class="btq">'+(x.st.fin?'Final':q)+'</span></div>'}
  const all=!!S.tkAll;
  return {key:key+(all?'A':''),html:'<div class="btl" role="status" aria-live="polite"><span class="bth">Around<br>the league</span><div class="bts">'+body+'</div><span class="btc">'+(K.i%items.length+1)+'/'+items.length+'</span><button class="btn ghost small" data-act="tkmore">'+(all?'Hide':'All')+'</button></div>'+(all?'<div class="tkp">'+items.map(y=>y.html).join('')+'</div>':'')};
}
function tickStep(dt){
  if(!G||S.week>=12||G.phase==='coin')return;const K=G.tk=G.tk||{i:0,t:0,seen:null,qu:[],cur:null,ct:0};K.t+=dt;K.acc=(K.acc||0)+dt;if(K.acc<.4)return;const el0=K.acc;K.acc=0;
  const T=tickItems();if(!T||!T.items.length)return;const p=poll();
  if(!K.seen){K.seen={};for(const x of T.items)K.seen[x.gi]={h:x.st.h,a:x.st.a,al:x.alert,fin:x.st.fin};}
  else for(const x of T.items){const s=K.seen[x.gi]||{h:0,a:0};const nm=id=>team(id).abbr;
    const key=x.both||x.g.riv!=null||Math.min(x.hr,x.ar)<=5||(Math.min(x.hr,x.ar)<=PN&&Math.abs(x.st.h-x.st.a)<=8&&T.f>=.5)||x.alert;
    for(const sd of ['h','a']){const d=x.st[sd]-s[sd];if(d>0&&key){const who=sd==='h'?x.g.h:x.g.a,lab=d>=6?'TOUCHDOWN '+nm(who):d===3?'FIELD GOAL '+nm(who):d===2?'SAFETY':'SCORE '+nm(who);K.qu.push({gi:x.gi,lab,who,up:false,pr:x.pr,id:++K.ct})}}
    if(x.alert&&!s.al)K.qu.push({gi:x.gi,lab:'UPSET ALERT',who:null,up:true,pr:x.pr+500,id:++K.ct});
    if(x.st.fin&&!s.fin&&x.upset)K.qu.push({gi:x.gi,lab:'FINAL · UPSET',who:x.st.h>x.st.a?x.g.h:x.g.a,up:true,pr:x.pr+800,id:++K.ct});
    K.seen[x.gi]={h:x.st.h,a:x.st.a,al:x.alert,fin:x.st.fin}}
  if(K.qu.length>4){K.qu.sort((a,b)=>b.pr-a.pr);K.qu=K.qu.slice(0,4)}
  K.ht=(K.ht||0)+el0;
  if(K.cur){if(K.ht>=7){K.cur=null;K.ht=0}}
  else if(K.qu.length){K.qu.sort((a,b)=>b.pr-a.pr||a.id-b.id);K.cur=K.qu.shift();K.ht=0}
  else if(K.ht>=5.5){K.i=(K.i+1)%T.items.length;K.ht=0}
  tickRefresh();
}
function tickRefresh(){if(typeof document.getElementById!=='function')return;const el=document.getElementById('g-tick');if(!el)return;const r=tickerHTML();const k=r?r.key:'',h=r?r.html:'';if(el._h!==k){el._h=k;el.innerHTML=h}}
function startWatch(g){
  stampGame(g);const p=poll(),m=spreadMargin(g),qlen=S.qlen||300;
  S.watchFrom=S.tab;S.game={gid:S.games.indexOf(g),watch:true,uid:g.h,opp:g.a,uHome:true,neutral:!!g.neutral,su:0,sc:0,q:1,qlen,clock:qlen,poss:'u',ball:25,bx:MID,down:1,togo:10,
    phase:'coin',coinWon:R()<.5,log:[],calls:[],tempo:'normal',kickFirst:'c',ot:0,otStep:0,otFirst:'u',possN:0,last:null,auto:true,
    box:{u:{yds:0,pass:0,rush:0,fd:0,to:0},c:{yds:0,pass:0,rush:0,fd:0,to:0}},
    st:{qb:blankStat('QB'),rb:blankStat('RB'),wr:blankStat('WR')},
    ros:{u:genRoster(false,g.h),c:genRoster(false,g.a)},line:m,rk:{u:rankOf(g.h,p),c:rankOf(g.a,p)}};
  delete g.pre;S.tkAll=false;try{preSimWeek(S.games.indexOf(g))}catch(e){}G=S.game;patchG();G.intro={t:0,o:(!g.neutral&&bannerList(g.h).length)?3.2:0};S.view='game';SC.reset=true;SC.stormDone=false;SC.stormFlash=false;SC.fans=[];SC.conf=[];SC.tro=null;
  log((g.neutral?'Live from the '+(g.tag&&g.tag.includes('·')?g.tag.split('· ')[1]:(g.tag||'neutral site'))+': ':'Welcome to '+team(g.h).name+'. ')+(seedTag(g,g.a)?'No. '+seedN(g.a)+' ':'')+team(g.a).name+' vs '+(seedTag(g,g.h)?'No. '+seedN(g.h)+' ':'')+team(g.h).name+'.','k');
}
let WT=null;
function watchStep(){
  if(!G||!G.watch||G.phase==='over'||SC.A)return;
  G.meter=null;
  if(G.phase==='off'){
    const pk=offAI('u');
    if(pk==='punt'||pk==='fg'){startKick('u',kickRoll('u',pk,rnd(.5,.9)));render();return}
    if(!PB[pk]){commitPlay('u',pk,null,{kind:pk});afterCommit();return}
    const dc=G.dpend||defAI('c');G.sel=pk;startPlay(buildPlay('u',pk,dc),false);render();return;
  }
  if(G.phase==='def'){
    const pk=G.pend||offAI('c',false);if(!PB[pk]){commitPlay('c',pk,null,{kind:pk});afterCommit();return}
    G.dsel=defAI('u');startPlay(buildPlay('c',pk,G.dsel),false);render();return;
  }
  if(G.phase==='ckick'||G.phase==='patk'){render();return}
  if(G.phase==='coin'){if(G.cheer>performance.now())return;if(openCheer(()=>{autoStep();afterCommit()}))return}
  autoStep();afterCommit();
}
function watchSchedule(){clearTimeout(WT);if(G&&G.watch&&G.auto&&G.phase!=='over'&&!SC.A&&!G.intro)WT=setTimeout(()=>{if(G&&G.watch&&G.auto&&S.view==='game')watchStep()},S.fast?450:900)}
function finishWatch(){
  const g=S.games[G.gid];clearTimeout(WT);
  g.hs=G.su;g.as=G.sc;g.done=true;g.ot=G.ot>0;g.watched=true;
  if(G.qp)g.wq={h:G.qp.u,a:G.qp.c};
  starStats(g);
  S.game=null;G=null;S.view='hub';S.tab=S.watchFrom||'league';S.watchFrom=null;
}
function watchControls(){
  const a=teamOf('u'),b=teamOf('c');
  if(G.phase==='over'){
    const B=G.box,row=(n,x,y)=>'<span>'+n+'</span><b>'+x+'</b><b>'+y+'</b>',w=G.su>G.sc?a:b;
    return '<section class="card"><span class="eyebrow">Final</span><h2>'+esc(w.name)+' wins</h2><div class="box"><span class="h">Team stats</span><span class="h">'+a.abbr+'</span><span class="h">'+b.abbr+'</span>'+row('Total yards',B.u.yds,B.c.yds)+row('Passing',B.u.pass,B.c.pass)+row('Rushing',B.u.rush,B.c.rush)+row('First downs',B.u.fd,B.c.fd)+row('Turnovers',B.u.to,B.c.to)+'</div>'+(G.mine?'<button class="btn" data-act="finish">Go to the postgame</button>':'<button class="btn" data-act="wfinish">'+(S.watchFrom==='bracket'?'Back to the bracket':'Back to the league')+'</button>')+'</section>';
  }
  return '<section class="card"><div class="spread"><h3>'+(G.mine?'Your staff is calling it':'Watching')+'</h3><span class="muted" style="font-size:12px">'+esc(a.abbr)+' vs '+esc(b.abbr)+'</span></div>'+
    '<div class="row"><button class="btn" data-act="wauto">'+(G.auto?'Pause':'Play')+'</button>'+(SC.A?'<button class="btn ghost" data-act="skip">Skip play</button>':G.auto?'':'<button class="btn ghost" data-act="wstep">Next play</button>')+'</div>'+
    '<div class="row"><button class="btn ghost small" data-act="wdrive">Sim this drive</button><button class="btn ghost small" data-act="wq">Sim to end of quarter</button><button class="btn ghost small" data-act="wend">Sim to final</button><button class="btn ghost small" data-act="fast">'+(S.fast?'Normal speed':'Fast speed')+'</button></div>'+(G.mine?'<button class="btn ghost" data-act="takeover">Take over the play calling</button>':'')+'</section>';
}

/* ---------- league archive 2006 to 2025: seasons, title games, brackets, bowls, Heismans, records, rivalry meetings ---------- */
const AY0=2006;
function archYears(){return Math.max(0,(S.baseYear||2025)-AY0+1)}
function genScore(rr,close){
  let w=Math.max(7,Math.round(27+(rr()-.5)*28)),l=Math.max(0,Math.round(w-(close?1+rr()*10:3+rr()*rr()*38)));
  const sn=x=>{const td=Math.floor(x/7),r=x-td*7;return td*7+(r>=5?6:r>=3?3:r>=2?2:0)};w=sn(w);l=sn(l);if(l>=w)l=Math.max(0,w-(close?3:7));if(w===l)w+=3;return [w,l];
}
function genArchive(){
  if(!S||!S.teams||!S.lore||!S.lore.length)return;
  const N=archYears();if(!N)return;
  const rr=srng(hashS('archive:'+S.teams.map(t=>t.name).join('|'))),gs=()=>{let u=0;for(let i=0;i<6;i++)u+=rr();return u-3};
  const ids=S.teams.filter(t=>t.born==null).map(t=>t.id),Y=i=>AY0+i;
  const tierB={dynasty:8.6,power:7.8,contender:7,fallen:6,middle:6,rising:5.2,rebuild:4.6,basement:3.2};
  const natlBy={};for(const x of S.lore)natlBy[x.y]=x.t;
  // strength by year: tier base, era drift, random walk, title-year boosts
  const st={};
  for(const id of ids){const t=team(id),tr=(t.hist&&t.hist.tier)||'middle';let walk=0;st[id]=[];
    for(let i=0;i<N;i++){walk=walk*.82+gs()*.55;let b=tierB[tr]||6;const f=i/(N-1||1);
      if(tr==='fallen')b=8.2-f*3.4;if(tr==='rising')b=3.6+f*3.6;if(tr==='rebuild')b=6.4-f*2.2;
      let v=b+walk;for(const [y,tid] of Object.entries(natlBy))if(tid===id){const d=Math.abs(+y-Y(i));v+=d===0?3:d===1?1.4:d===2?.5:0}
      st[id].push(v)}}
  // regular season wins
  const rw={};for(const id of ids)rw[id]=st[id].map(v=>clamp(Math.round(6+(v-6)*1.25+gs()*1.4),1,12));
  // conference champions, honoring each team's title count
  const careerCC=id=>{const t=team(id);return (t.past||[]).filter(x=>x.cc).length+(t.cc?1:0)};
  const cc=[];for(let i=0;i<N;i++)cc.push([null,null,null,null]);
  for(let c=0;c<4;c++){
    const tm=ids.filter(id=>team(id).conf===c),q={};
    const tpl=S.lname==='Church League'&&LS&&LS.tpl&&LS.tpl.teams&&LS.tpl.teams.length===S.teams.length?LS.tpl.teams:null;
    tm.forEach(id=>{const h=team(id).hist||{};q[id]=tpl&&tpl[id]&&tpl[id].ct!=null?Math.max(0,+tpl[id].ct||0):Math.max(0,(h.ct||0)-careerCC(id))});
    for(let i=0;i<N;i++){const n=natlBy[Y(i)];if(n!=null&&team(n).conf===c){cc[i][c]=n;q[n]=Math.max(0,q[n]-1)}}
    let tot=tm.reduce((a,id)=>a+q[id],0),open=[];for(let i=0;i<N;i++)if(cc[i][c]==null)open.push(i);
    while(tot<open.length){const id=tm.sort((a,b)=>st[b][0]-st[a][0])[Math.floor(rr()*3)];q[id]++;tot++}
    for(const i of open.sort(()=>rr()-.5)){
      const cand=tm.filter(id=>q[id]>0);if(!cand.length)break;
      const w=cand.map(id=>Math.exp((st[id][i]-6)*.9)*(q[id]));let x=rr()*w.reduce((a,b)=>a+b,0),k=0;for(;k<cand.length-1;k++){x-=w[k];if(x<=0)break}
      cc[i][c]=cand[k];q[cand[k]]--;
    }
    for(let i=0;i<N;i++){const ch=cc[i][c];if(ch==null)continue;const mx=Math.max(...tm.filter(x=>x!==ch).map(x=>rw[x][i]));rw[ch][i]=clamp(Math.max(rw[ch][i],mx,9),0,12)}
  }
  for(let i=0;i<N;i++){const n=natlBy[Y(i)];if(n!=null)rw[n][i]=Math.max(rw[n][i],rr()<.6?12:11)}
  // postseason games
  const G2=[],pw={},pl={};ids.forEach(id=>{pw[id]=Array(N).fill(0);pl[id]=Array(N).fill(0)});
  const play=(i,kind,a,b,winner,label,close)=>{const [ws,ls]=genScore(rr,close);const lo=winner===a?b:a;G2.push([Y(i),kind,winner,lo,ws,ls,label||'']);pw[winner][i]++;pl[lo][i]++;return winner};
  const pick=(i,a,b,force)=>{if(force!=null)return force;const pa=1/(1+Math.exp(-(st[a][i]+rw[a][i]*.3-st[b][i]-rw[b][i]*.3)*.55));return rr()<pa?a:b};
  for(let i=0;i<N;i++){
    const y=Y(i),nat=natlBy[y];
    for(let c=0;c<4;c++){const ch=cc[i][c];if(ch==null)continue;const tm=ids.filter(id=>team(id).conf===c&&id!==ch);
      const dv=team(ch).div,pool=tm.filter(id=>dv==null||team(id).div==null||team(id).div!==dv);const cands=(pool.length?pool:tm).sort((a,b)=>rw[b][i]-rw[a][i]||st[b][i]-st[a][i]).slice(0,3),cw=[.5,.32,.18].slice(0,cands.length);let xr=rr()*cw.reduce((a,b)=>a+b,0),ki=0;for(;ki<cands.length-1;ki++){xr-=cw[ki];if(xr<=0)break}const ru=cands[ki];
      play(i,'ccg',ch,ru,ch,CONFS[c]+' Championship',rr()<.5)}
    const champs=cc[i].filter(x=>x!=null),sc=id=>rw[id][i]*10+st[id][i]+(champs.includes(id)?6:0);
    let field=[...champs];for(const id of ids.slice().sort((a,b)=>sc(b)-sc(a))){if(field.length>=12)break;if(!field.includes(id))field.push(id)}
    if(nat!=null&&!field.includes(nat))field[11]=nat;
    let seeds=field.slice().sort((a,b)=>sc(b)-sc(a));
    if(y===2016){const J=ids.find(id=>/Jerome/.test(team(id).name)),B=ids.find(id=>/Berean/.test(team(id).name));if(J!=null&&B!=null){if(!seeds.includes(B))seeds[11]=B;seeds=[J,B,...seeds.filter(x=>x!==J&&x!==B)]}}
    const sd=n=>seeds[n-1],force=(a,b)=>{if(y===2016){const J=sd(1),B=sd(2);if(a===J||b===J)return J;if(a===B||b===B)return B}return a===nat?a:b===nat?b:null};
    const r1={};for(const [br,a,b] of R1){const A=sd(a),B=sd(b);r1[br]=play(i,'r1',A,B,pick(i,A,B,force(A,B)),'First Round',rr()<.4)}
    const qf={};QF.forEach(([br,s,from],k)=>{const A=sd(s),B=r1[from];qf[br]=play(i,'qf',A,B,pick(i,A,B,force(A,B)),CFP_QF[k],rr()<.4)});
    const sfA=play(i,'sf',qf.QA,qf.QB,pick(i,qf.QA,qf.QB,force(qf.QA,qf.QB)),CFP_SF[0],rr()<.4),sfB=play(i,'sf',qf.QC,qf.QD,pick(i,qf.QC,qf.QD,force(qf.QC,qf.QD)),CFP_SF[1],rr()<.4);
    play(i,'f',sfA,sfB,nat!=null?nat:pick(i,sfA,sfB,null),'National Championship',rr()<.5);
    const bowlers=ids.filter(id=>!seeds.includes(id)&&rw[id][i]>=6).sort((a,b)=>sc(b)-sc(a));
    for(let k=0;k+1<bowlers.length;k+=2)play(i,'bowl',bowlers[k],bowlers[k+1],pick(i,bowlers[k],bowlers[k+1],null),BOWLS[(k/2+i)%BOWLS.length],rr()<.4);
  }
  // Heisman winners
  const heis=[];for(let i=0;i<N;i++){const y=Y(i),l=(S.loreHeis||[]).find(x=>x.y===y);
    if(l){heis.push([l.name,l.pos||'',l.t]);continue}
    const top=ids.slice().sort((a,b)=>(rw[b][i]*10+st[b][i])-(rw[a][i]*10+st[a][i])).slice(0,5),tid=top[Math.floor(rr()*rr()*5)],r=rr();
    heis.push([FIRST[Math.floor(rr()*FIRST.length)]+' '+LAST[Math.floor(rr()*LAST.length)],r<.68?'QB':r<.88?'RB':'WR',tid])}
  // program records
  const rec2={};for(const id of ids){const s0=Math.max(...st[id]),yi=()=>Math.floor(rr()*N),nm=()=>FIRST[Math.floor(rr()*FIRST.length)]+' '+LAST[Math.floor(rr()*LAST.length)];
    const o=()=>{const c=ids.filter(x=>x!==id);return c[Math.floor(rr()*c.length)]};
    const pts=Math.round(52+rr()*20+(s0-6)*2),mg=Math.round(35+rr()*24);
    rec2[id]={pass:[nm(),Math.round(2700+rr()*1500+(s0-6)*90),Y(yi())],rush:[nm(),Math.round(1150+rr()*800+(s0-6)*40),Y(yi())],rcv:[nm(),Math.round(950+rr()*650+(s0-6)*35),Y(yi())],
      pts:[pts,Math.round(rr()*24),o(),Y(yi())],mg:[mg+Math.round(rr()*10),Math.max(0,Math.round(rr()*10)),o(),Y(yi())]};
    rec2[id].mg[0]=rec2[id].mg[1]+mg}
  S.arch={v:1,N,rw:Object.fromEntries(ids.map(id=>[id,ids.length?rw[id].map((r,i)=>[r+pw[id][i],12-r+pl[id][i]]):[]])),cc,g:G2,h:heis,rec:rec2};
  // align program totals with the archive plus the seasons played since
  for(const id of ids){const t=team(id);if(!t.hist)continue;const a=S.arch.rw[id];
    const pw2=(t.past||[]).reduce((s,x)=>s+x.w,0),pl2=(t.past||[]).reduce((s,x)=>s+x.l,0);
    t.hist.w=a.reduce((s,x)=>s+x[0],0)+pw2;t.hist.l=a.reduce((s,x)=>s+x[1],0)+pl2;
    t.hist.ct=cc.reduce((s,row)=>s+row.filter(x=>x===id).length,0)+careerCC(id)}
  genRivalArchive(st);
}
function genRivalArchive(st){
  const N=archYears();
  S.rivals.forEach((rv,ri2)=>{
    const rr=srng(hashS('rivarch:'+Math.min(rv.a,rv.b)+':'+Math.max(rv.a,rv.b)));
    const cur=(S.games||[]).filter(g=>g.done&&g.riv===ri2).sort((a,b)=>a.wk-b.wk);
    rv.hist=rv.hist&&rv.hist.length?rv.hist:cur.map(g=>({y:yearOf(S.season),w:winnerOf(g),s:Math.max(g.hs,g.as)+'-'+Math.min(g.hs,g.as),h:g.neutral?null:g.h,ot:!!g.ot}));
    const careerA=rv.hist.filter(m=>m.w===rv.a).length,careerB=rv.hist.length-careerA;
    let na=Math.max(0,rv.sa-careerA),nb=Math.max(0,rv.sb-careerB),n=na+nb;
    const nm=x=>team(x).name||'',isK=/Jerome/.test(nm(rv.a)+nm(rv.b))&&/Berean/.test(nm(rv.a)+nm(rv.b));
    let yrs=[];for(let i=0;i<N;i++)yrs.push(AY0+i);
    if(isK)yrs=yrs.filter(y=>y>=2016);
    if(n<yrs.length){const keep=new Set(isK?[2016]:[]);const rest=yrs.filter(y=>!keep.has(y)).sort(()=>rr()-.5).slice(0,n-keep.size);yrs=[...keep,...rest].sort((a,b)=>a-b)}
    else if(n>yrs.length){n=yrs.length;if(na>n)na=n;nb=n-na}
    const sA=y=>st&&st[rv.a]?st[rv.a][y-AY0]:6,sB=y=>st&&st[rv.b]?st[rv.b][y-AY0]:6;
    const M=yrs.map(y=>{const pa=1/(1+Math.exp(-(sA(y)-sB(y))*.45)),w=rr()<pa?rv.a:rv.b;return {y,pa,w}});
    const lock=m=>isK&&m.y===2016;
    const J=isK?(/Jerome/.test(nm(rv.a))?rv.a:rv.b):null;M.forEach(m=>{if(lock(m))m.w=J});
    const lastHolder=rv.hist.length?null:rv.holder;
    if(lastHolder!=null&&M.length&&!lock(M[M.length-1]))M[M.length-1].w=lastHolder;
    const fixed=m=>lock(m)||(lastHolder!=null&&m===M[M.length-1]);
    let ca=M.filter(m=>m.w===rv.a).length;
    while(ca>na){const c=M.filter(m=>m.w===rv.a&&!fixed(m)).sort((x,y)=>x.pa-y.pa)[0];if(!c)break;c.w=rv.b;ca--}
    while(ca<na){const c=M.filter(m=>m.w===rv.b&&!fixed(m)).sort((x,y)=>y.pa-x.pa)[0];if(!c)break;c.w=rv.a;ca++}
    rv.arch=M.map(m=>{const [ws,ls]=genScore(rr,rr()<.55),ot=ws-ls<=3&&rr()<.3,home=(m.y%2)?rv.a:rv.b,pw=m.w===rv.a?m.pa:1-m.pa;
      let sc2=ws+'-'+ls;if(isK&&m.y===2016){const fg=(S.arch&&S.arch.g||[]).find(g=>g[0]===2016&&g[1]==='f');if(fg)sc2=fg[4]+'-'+fg[5]}
      return {y:m.y,w:m.w,s:sc2,h:isK&&m.y===2016?null:home,ot:ot&&!(isK&&m.y===2016),up:pw<.3,t:isK&&m.y===2016?'National Championship':''}});
  });
}
/* ---------- program history and rivalry history views ---------- */
const KLAB={ccg:'Conference title game',r1:'Playoff first round',qf:'Playoff quarterfinal',sf:'Playoff semifinal',f:'National Championship',bowl:'Bowl'};
function teamGames(id){
  const out=[];
  for(const g of (S.arch&&S.arch.g)||[])if(g[2]===id||g[3]===id){const won=g[2]===id;out.push({y:g[0],k:g[1],o:won?g[3]:g[2],won,my:won?g[4]:g[5],th:won?g[5]:g[4],lab:g[6]})}
  for(const x of team(id).past||[])for(const p of x.pg||[])out.push({y:yearOf(x.s),k:p[0],o:p[2],won:p[3]>p[4],my:p[3],th:p[4],lab:p[1]});
  return out.sort((a,b)=>b.y-a.y||['f','sf','qf','r1','ccg','bowl'].indexOf(a.k)-['f','sf','qf','r1','ccg','bowl'].indexOf(b.k));
}
function teamSeasons(id){
  const out=[],A=S.arch,gs=teamGames(id);
  if(A&&A.rw[id])A.rw[id].forEach((r,i)=>{const y=AY0+i;out.push({y,w:r[0],l:r[1],cc:A.cc[i]&&A.cc[i].includes(id),natl:gs.some(g=>g.y===y&&g.k==='f'&&g.won),po:gs.some(g=>g.y===y&&['r1','qf','sf','f'].includes(g.k)),coach:''})});
  for(const x of team(id).past||[])out.push({y:yearOf(x.s),w:x.w,l:x.l,cc:x.cc,natl:x.natl,po:x.po,rk:x.rk,coach:x.coach});
  return out.sort((a,b)=>b.y-a.y);
}
function teamHeis(id){
  const out=[];const A=S.arch;if(A)A.h.forEach((h,i)=>{if(h[2]===id)out.push({y:AY0+i,name:h[0],pos:h[1]})});
  for(const x of S.heisHist||[])if(x.team===team(id).name)out.push({y:yearOf(x.s),name:x.name,pos:x.pos});
  return out.sort((a,b)=>b.y-a.y);
}
function sline(g){return (g.won?'W ':'L ')+g.my+'-'+g.th+(g.won?' over ':' to ')+team(g.o).name}
function histModal(){
  if(S.phist==null)return '';
  const id=S.phist,t=team(id),h=t.hist||{},tab=S.phTab||'over',gs=teamGames(id),ss=teamSeasons(id),hz=teamHeis(id);
  const natl=gs.filter(g=>g.k==='f'&&g.won),ccg=gs.filter(g=>g.k==='ccg'&&g.won),po=gs.filter(g=>['r1','qf','sf','f'].includes(g.k)),bw=gs.filter(g=>g.k==='bowl');
  const poW=po.filter(g=>g.won).length,bwW=bw.filter(g=>g.won).length,best=ss.slice().sort((a,b)=>(b.w-b.l)-(a.w-a.l)||b.w-a.w)[0];
  const tabs=[['over','Overview'],['seasons','Seasons'],['titles','Titles'],['post','Bowls & playoffs'],['heis','Heisman'],['recs','Records']];
  let b='<div class="ftabs">'+tabs.map(([k,n])=>'<button data-act="phtab" data-t="'+k+'" aria-pressed="'+(tab===k)+'">'+n+'</button>').join('')+'</div>';
  const row=(a,c,d)=>'<div class="g"><span class="wk">'+a+'</span><span style="min-width:0">'+c+'</span><span class="muted num">'+(d||'')+'</span></div>';
  if(tab==='over'){
    b+='<div class="hstat">'+[[h.w+'-'+h.l,'All-time record'],[natl.length,'National titles'],[ccg.length+(ccg.length<(h.ct||0)?'':''),'Conference titles'],[hz.length,'Heisman winners'],[po.length?poW+'-'+(po.length-poW):'0','Playoff record'],[bw.length?bwW+'-'+(bw.length-bwW):'0','Bowl record']].map(([v,l])=>'<div><b class="num">'+v+'</b><span>'+l+'</span></div>').join('')+'</div>';
    if(best)b+='<p style="font-size:13.5px"><b>Best season:</b> '+best.y+', '+best.w+'-'+best.l+(best.natl?', national champions':best.cc?', conference champions':'')+'</p>';
    const lt=loreForTeam(id);if(lt.length)b+=lt.slice().reverse().map(x=>'<p class="muted" style="font-size:13px">'+x.y+': '+esc(x.note)+'</p>').join('');
    b+='<p class="muted" style="font-size:12.5px">History since the league began in '+AY0+'.</p>';
  }else if(tab==='seasons'){
    b+='<div class="sched">'+ss.map(x=>{const pg=gs.filter(g=>g.y===x.y&&g.k!=='ccg');const last=pg[0];
      return row(x.y,'<b class="num">'+x.w+'-'+x.l+'</b>'+(x.rk&&x.rk<=PN?' · No. '+x.rk:'')+(x.natl?' · <span class="amber">National champions</span>':'')+(x.cc?' · Conference champs':'')+(last&&!x.natl?'<br><small class="muted">'+esc(last.k==='bowl'?last.lab:KLAB[last.k])+': '+esc(sline(last))+'</small>':'')+(x.coach?'<br><small class="muted">Coach '+esc(x.coach)+'</small>':''),'')}).join('')+'</div>';
  }else if(tab==='titles'){
    b+='<h3>National championships</h3>'+(natl.length?'<div class="sched">'+natl.map(g=>row(g.y,'Beat '+esc(team(g.o).name),g.my+'-'+g.th)).join('')+'</div>':'<p class="muted">None yet.</p>');
    b+='<h3>Conference championships</h3>'+(ccg.length?'<div class="sched">'+ccg.map(g=>row(g.y,'Beat '+esc(team(g.o).name)+' in the '+esc(g.lab||'title game'),g.my+'-'+g.th)).join('')+'</div>':'<p class="muted">None yet.</p>');
    const ccl=gs.filter(g=>g.k==='ccg'&&!g.won);if(ccl.length)b+='<p class="muted" style="font-size:13px">Title game losses: '+ccl.map(g=>g.y+' to '+esc(team(g.o).abbr)+' ('+g.th+'-'+g.my+')').join(', ')+'</p>';
  }else if(tab==='post'){
    const L2=gs.filter(g=>g.k!=='ccg');
    b+=L2.length?'<div class="sched">'+L2.map(g=>row(g.y,'<b>'+esc(g.k==='bowl'?g.lab:KLAB[g.k]+(g.lab&&g.k!=='f'&&g.k!=='r1'?' ('+g.lab+')':''))+'</b><br><small class="'+(g.won?'':'muted')+'">'+esc(sline(g))+'</small>','')).join('')+'</div>':'<p class="muted">No bowl or playoff games yet.</p>';
  }else if(tab==='heis'){
    b+=hz.length?'<div class="sched">'+hz.map(x=>row(x.y,'<b>'+esc(x.name)+'</b>'+(x.pos?' · '+esc(x.pos):''),'')).join('')+'</div>':'<p class="muted">No Heisman winners yet.</p>';
  }else if(tab==='recs'){
    const R2=S.arch&&S.arch.rec[id];
    const mw=ss.slice().sort((a,b)=>b.w-a.w)[0];
    let streak=0,bs=0,bsY='';ss.slice().reverse().forEach(x=>{if(x.w>x.l){streak++;if(streak>bs){bs=streak;bsY=x.y}}else streak=0});
    let pst=0,bp=0;ss.slice().reverse().forEach(x=>{const any=gs.some(g=>g.y===x.y&&g.k!=='ccg');if(any){pst++;bp=Math.max(bp,pst)}else pst=0});
    b+='<h3>Team records</h3><div class="sched">'+
      (mw?row('Wins','Most wins in a season: <b>'+mw.w+'</b> ('+mw.y+', '+mw.w+'-'+mw.l+')',''):'')+
      row('Run','Most straight winning seasons: <b>'+bs+'</b>'+(bs?' (through '+bsY+')':''),'')+
      row('Post','Most straight postseason trips: <b>'+bp+'</b>','')+
      (R2?row('Points','Most points in a game: <b>'+R2.pts[0]+'</b> vs '+esc(team(R2.pts[2]).name)+' ('+R2.pts[3]+', '+R2.pts[0]+'-'+R2.pts[1]+')','')+row('Margin','Biggest win: <b>'+(R2.mg[0]-R2.mg[1])+' points</b> over '+esc(team(R2.mg[2]).name)+' ('+R2.mg[3]+', '+R2.mg[0]+'-'+R2.mg[1]+')',''):'')+'</div>';
    if(R2)b+='<h3>Single-season records</h3><div class="sched">'+row('Pass','<b>'+esc(R2.pass[0])+'</b>: '+R2.pass[1].toLocaleString()+' passing yards',R2.pass[2])+row('Rush','<b>'+esc(R2.rush[0])+'</b>: '+R2.rush[1].toLocaleString()+' rushing yards',R2.rush[2])+row('Rec','<b>'+esc(R2.rcv[0])+'</b>: '+R2.rcv[1].toLocaleString()+' receiving yards',R2.rcv[2])+'</div>';
  }
  return '<div class="modal" role="dialog" aria-modal="true" aria-label="'+esc(t.name)+' program history"><div class="mpanel"><div class="spread mhead"><div style="display:flex;gap:10px;align-items:center"><span class="lgo">'+logoSVG(t)+'</span><span class="lgo">'+logoSVG(t,'alt')+'</span><div><span class="eyebrow">Program history</span><h2>'+esc(t.name)+'</h2><p class="muted" style="font-size:12.5px">'+esc(histLine(t))+'</p></div></div><button class="btn ghost small" data-act="phclose">Close</button></div><div class="mbody">'+b+'</div></div></div>';
}
function rivMoments(rv){
  const all=[...(rv.arch||[]),...(rv.hist||[])].sort((a,b)=>a.y-b.y),M=[];if(!all.length)return M;
  const nm=x=>team(x).name,lo=m=>m.w===rv.a?rv.b:rv.a,mar=m=>{const [a,b]=m.s.split('-').map(Number);return a-b};
  const f=all[0];M.push({y:f.y,h:'Where it all started',t:nm(f.w)+' won the first meeting, '+f.s+'.'});
  const k=all.find(m=>m.t==='National Championship');if(k)M.push({y:k.y,h:'The title game',t:nm(k.w)+' beat '+nm(lo(k))+' '+k.s+' for the national championship. Nothing has been the same since.'});
  const cl=all.filter(m=>m.ot).concat(all.slice().sort((a,b)=>mar(a)-mar(b))).find(Boolean);if(cl)M.push({y:cl.y,h:cl.ot?'Overtime classic':'Instant classic',t:(cl.ot?'It took overtime, but ':'')+nm(cl.w)+' survived '+cl.s+'. People still argue about the last drive.'});
  const bl=all.slice().sort((a,b)=>mar(b)-mar(a))[0];if(bl&&mar(bl)>=17)M.push({y:bl.y,h:'The beatdown',t:nm(bl.w)+' rolled '+nm(lo(bl))+' '+bl.s+'. The other side does not talk about it.'});
  const up=all.filter(m=>m.up);if(up.length){const u=up[up.length-1];M.push({y:u.y,h:'Nobody saw it coming',t:'A big underdog, '+nm(u.w)+' shocked '+nm(lo(u))+' '+u.s+' and the fans stormed the field.'})}
  let best={n:0},cur={n:0};all.forEach(m=>{if(cur.w===m.w){cur.n++;cur.e=m.y}else cur={w:m.w,n:1,s0:m.y,e:m.y};if(cur.n>best.n)best={...cur}});
  if(best.n>=3)M.push({y:best.s0,h:'The streak',t:nm(best.w)+' won '+best.n+' straight from '+best.s0+' to '+best.e+'.'});
  for(const m of rv.hist||[]){if(m.ot&&m!==cl)M.push({y:m.y,h:'Overtime thriller',t:nm(m.w)+' won it in overtime, '+m.s+'.'});if(m.flip)M.push({y:m.y,h:'Trophy changes hands',t:nm(m.w)+' took the '+rv.trophy.replace(/^The /,'')+' back, '+m.s+'.'})}
  return M.sort((a,b)=>b.y-a.y);
}
function rivModal(){
  if(S.rview==null||!S.rivals[S.rview])return '';
  const rv=S.rivals[S.rview],tab=S.rvTab||'meet',A=team(rv.a),B=team(rv.b);
  const all=[...(rv.arch||[]),...(rv.hist||[])].sort((a,b)=>b.y-a.y);
  let b='<div class="hstat">'+[[A.abbr+' '+rv.sa+' · '+B.abbr+' '+rv.sb,'All-time series'],[rv.holder==null?'None':esc(team(rv.holder).abbr),'Holds the trophy'],[all.length,'Meetings']].map(([v,l])=>'<div><b class="num">'+v+'</b><span>'+l+'</span></div>').join('')+'</div>';
  b+='<div class="ftabs">'+[['meet','All meetings'],['mom','All-time moments']].map(([k,n])=>'<button data-act="rvtab" data-t="'+k+'" aria-pressed="'+(tab===k)+'">'+n+'</button>').join('')+'</div>';
  if(tab==='meet')b+='<div class="sched rmeet">'+all.map(m=>'<div class="g"><span class="wk">'+m.y+'</span><span style="min-width:0">'+mlogo(team(m.w))+'<b>'+esc(team(m.w).name)+'</b> '+m.s+(m.ot?' (OT)':'')+'<br><small class="muted">'+(m.t?esc(m.t)+' · ':'')+(m.h==null?'Neutral site':'at '+esc(team(m.h).name))+(m.up?' · Upset':'')+'</small></span><span></span></div>').join('')+'</div>';
  else b+='<div class="sched">'+rivMoments(rv).map(x=>'<div class="g"><span class="wk">'+x.y+'</span><span style="min-width:0"><b>'+esc(x.h)+'</b><br><small>'+esc(x.t)+'</small></span><span></span></div>').join('')+'</div>';
  return '<div class="modal" role="dialog" aria-modal="true" aria-label="'+esc(rv.trophy)+'"><div class="mpanel"><div class="spread mhead"><div><div style="display:flex;gap:6px;margin-bottom:4px"><span class="lgo" style="width:38px;height:38px">'+logoSVG(A)+'</span><span class="lgo" style="width:38px;height:38px">'+logoSVG(B)+'</span></div><span class="eyebrow">'+esc(RTYPE[rv.type||'main'])+'</span><h2>'+esc(rv.trophy)+'</h2><p class="muted" style="font-size:12.5px">'+esc(A.name)+' vs '+esc(B.name)+'</p></div><button class="btn ghost small" data-act="rvclose">Close</button></div><div class="mbody">'+b+'</div></div></div>';
}
function postGamesFor(id){
  return S.games.filter(g=>g.done&&g.wk>=12&&(g.h===id||g.a===id)).map(g=>{const my=g.h===id?g.hs:g.as,th=g.h===id?g.as:g.hs,o=g.h===id?g.a:g.h;
    const k=g.ccg!=null?'ccg':g.bowl?'bowl':g.final?'f':g.wk===15?'sf':g.wk===14?'qf':'r1';return [k,g.tag||'',o,my,th]});
}
function updateRecords(){
  if(!S.arch||!S.arch.rec)return;const y=yearOf(S.season);
  for(const t of S.teams){const R2=S.arch.rec[t.id];if(!R2)continue;
    for(const g of S.games.filter(g=>g.done&&(g.h===t.id||g.a===t.id))){const my=g.h===t.id?g.hs:g.as,th=g.h===t.id?g.as:g.hs,o=g.h===t.id?g.a:g.h;
      if(my>R2.pts[0])R2.pts=[my,th,o,y,true];if(my-th>R2.mg[0]-R2.mg[1])R2.mg=[my,th,o,y,true]}
    const chk=(key,name,yds)=>{if(yds>R2[key][1])R2[key]=[name,yds,y,true]};
    if(t.id===S.userId){for(const s of S.stars){const yd=(s.s&&s.s.yds)||0;chk(s.pos==='QB'?'pass':s.pos==='RB'?'rush':'rcv',s.name,yd)}}
    else if(t.star)chk(t.star.pos==='QB'?'pass':t.star.pos==='RB'?'rush':'rcv',t.star.name,t.star.yds||0);
  }
}

/* ---------- Third & Saturday: a weekly podcast with Wade Hollister ---------- */
const POD={host:'Wade Hollister',co:'Big Ced Boykin',show:'Third & Saturday'};
function podState(){if(!S.pod||S.pod.season!==S.season)S.pod={season:S.season,eps:[],rec:{w:0,l:0}};return S.pod}
function podGrade(){
  const P=podState();
  for(const ep of P.eps)for(const pk of ep.picks||[]){if(pk.res)continue;const g=S.games[pk.g];if(!g||!g.done)continue;const ok=winnerOf(g)===pk.pick;pk.res=ok?'W':'L';ok?P.rec.w++:P.rec.l++}
}
function podWeek(){
  const P=podState();podGrade();
  const done=S.games.filter(g=>g.done),lastWk=done.length?Math.max(...done.map(g=>g.wk)):null,key=lastWk==null?'pre':String(lastWk);
  if(P.eps.some(e=>e.key===key&&(e.v===3||P.eps.indexOf(e)>0)))return;
  {const ix=P.eps.findIndex(e=>e.key===key);if(ix===0)P.eps.splice(0,1)}
  const rr=srng(hashS(S.season+':pod:'+key)),usedL=new Set(),pk=a=>{const f=a.filter(x=>!usedL.has(x)),src=f.length?f:a,v=src[Math.floor(rr()*src.length)];usedL.add(v);return v},p=poll(),N=id=>team(id).name,A=id=>team(id).abbr,cName=(S.coach||'').replace(/^Coach\s+/i,'')||'the head coach';
  const D=(rankScores(),RSC.d||{}),pre=S.preRank||p,segs=[],seg=(h,lines)=>segs.push({h,lines:lines.filter(Boolean)});
  const opens=['[air horn] WELCOME BACK to Third and Saturday! Big Ced is here, I am caffeinated, let\'s GO.','Alright alright alright. Big Ced, how we feeling?','I have not slept. Ced has not slept. The fan base has not slept. Let\'s go.','We are LIVE. Somebody hold my coffee because this week was insane.','Pull up a chair. This one\'s gonna get spicy and I\'m not apologizing for any of it.'];
  const C=t=>'C|'+t,cedIn=['C|Wade, I have been waiting ALL WEEK to yell about this.','C|I brought receipts. Let\'s do this.','C|Feeling great. Picks were mid last week but we are SO back.','C|I already disagree with whatever you are about to say.'];
  // cold open
  const news=key==='pre'?[]:(S.news&&S.news[key])||[];
  if(key==='pre'){
    seg('Cold open',[pk(opens),'Season '+yearOf(S.season)+' is here and I have opinions about all thirty-two of these programs.',N(p[0])+' starts at No. 1. I want to see them do it on a Saturday in November before I hand them anything.']);
  }else{
    const top=news[0];
    seg('Cold open',[pk(opens),pk(cedIn),top?'Headline of the week: '+top.title+'.':'Quiet week? No such thing.',top?pk(['I watched it twice. I still don\'t know how I feel.','If you missed it, I\'m sorry. Go find the replay.','That\'s the story and I don\'t care what anybody else tells you.','Hear me out on this one.']):'']);
  }
  if(key!=='pre'){
    // who's real
    const rk=id=>p.indexOf(id)+1,pr=id=>(pre.indexOf(id)+1)||32;
    const risers=S.teams.filter(t=>rk(t.id)<=PN&&pr(t.id)-rk(t.id)>=5).sort((a,b)=>(pr(b.id)-rk(b.id))-(pr(a.id)-rk(a.id)));
    const sinkers=S.teams.filter(t=>pr(t.id)<=10&&rk(t.id)-pr(t.id)>=6&&rec(t.id).l>=2);
    const L=[];
    if(risers[0]){const t=risers[0],d=D[t.id]||{},real=(d.qw||0)>=6||(d.sos||0)>0;L.push(N(t.id)+' at '+recStr(t.id)+'. Preseason No. '+pr(t.id)+', now No. '+rk(t.id)+'.');L.push(real?pk(['I\'m buying. They\'ve beaten real people. That\'s not luck.','Real. I said what I said. The wins are legit.']):pk(['Not real. Show me who they\'ve beaten. I\'ll wait.','I need to see it against somebody with a pulse first. Not buying yet.']))}
    if(sinkers[0]){const t=sinkers[0];L.push(N(t.id)+' was supposed to be a top 10 team and they\'re '+recStr(t.id)+'.');L.push(pk(['That\'s not a slump. That\'s a program problem.','Something is broken in that building and everybody can see it.','They\'ll be fine. Probably. I said probably.']))}
    if(L.length){L.push(C(pk(['Hard disagree. Watch the film, Wade.','For once we agree. Mark the date.','I am NOT getting fooled by that again. Not buying.','They are HIM-adjacent. Not HIM. Adjacent.'])));seg('Who\'s real, who\'s not',L)}
    // panic meter
    const losers=S.games.filter(g=>g.done&&String(g.wk)===key).map(g=>{const Lo=winnerOf(g)===g.h?g.a:g.h,lr=Lo===g.h?g.hr:g.ar,mar=Math.abs(g.hs-g.as),W=winnerOf(g),wr=W===g.h?g.hr:g.ar;return {Lo,W,lr,wr,mar}}).filter(x=>x.lr<=PN).slice(0,4);
    if(losers.length)seg('Panic meter',losers.map(x=>{let m=3+(x.wr>PN?3:0)+(x.mar>=21?2:x.mar>=10?1:0)+(rec(x.Lo).l>=2?2:0);m=clamp(m,1,10);
      return N(x.Lo)+': '+m+' out of 10. '+(m>=8?pk(['Sell the stock. Sell all of it.','Fans should be worried. I am worried and I don\'t even root for them.','That was ugly and it wasn\'t a fluke.','I don\'t know what that was, but it wasn\'t a contender.']):m>=5?pk(['Concerning, not fatal. Fix the lines of scrimmage.','I\'d be nervous but I wouldn\'t be jumping off anything yet.','Yellow light. Not red. Yellow.','One more like that and we\'re having a different conversation.']):pk(['Relax. Good teams lose to '+N(x.W)+'.','Lost to a good team. Move on.','Shake it off. Nothing to see here.','That happens. Nobody\'s perfect in this league.']))}));
    if(segs.length&&segs[segs.length-1].h==='Panic meter')segs[segs.length-1].lines.push(C(pk(['Panic meter? Their fan base broke the meter. It is so over.','I would be at a ten. I am a dramatic man.','Everybody relax. It is October. Nobody is cooked in October. Okay SOME people are cooked.'])));
    // sicko corner + overreaction
    {const wkG=S.games.filter(g=>g.done&&String(g.wk)===key);if(wkG.length){const lo=[...wkG].sort((a,b)=>(a.hs+a.as)-(b.hs+b.as))[0],hi=[...wkG].sort((a,b)=>(b.hs+b.as)-(a.hs+a.as))[0],sc=g=>A(g.a)+' '+g.as+', '+A(g.h)+' '+g.hs;
      seg('Sicko corner',['Every week we honor the games only a real sicko could love.',(lo.hs+lo.as)<=24?'Our rock fight of the week: '+sc(lo)+'. Punts. Field position. Three yards and a cloud of dust.':'No true rock fight this week, which honestly hurts me.',C((lo.hs+lo.as)<=24?'[YES. HAHAHA. YES.] That is the purest football in America.':'Sickos are in mourning, Wade.'),(hi.hs+hi.as)>=60?'And on the other end, '+sc(hi)+'. Defense was optional. Points were mandatory.':'',(hi.hs+hi.as)>=60?C('That one was a track meet. Somebody check on those defensive coordinators.'):''].filter(Boolean));
      const big=wkG.filter(g=>Math.abs(g.hs-g.as)>=21)[0],ups=wkG.find(g=>{const w=winnerOf(g),wr=w===g.h?g.hr:g.ar,lr=w===g.h?g.ar:g.hr;return lr<=PN&&(wr>PN||wr-lr>=6)});
      const O=[];if(ups){const w=winnerOf(ups);O.push('Statement one: '+N(w)+' is a contender now.');O.push(pk(['Overreaction. One great Saturday does not make a contender.','Reaction! I am buying the stock right now.']));O.push(C(pk(['Overreaction. Let them do it twice.','Reaction. They are SO back.'])))}
      if(big){const w=winnerOf(big),l=w===big.h?big.a:big.h;O.push('Statement two: '+N(l)+' is cooked for the year.');O.push(pk(['Overreaction. One bad loss. Everybody chill.','Reaction. That was not a fluke. It is so over.']));O.push(C(pk(['Cooked. Well done. Charcoal.','Overreaction. They are mid, not cooked. Different thing.'])))}
      if(O.length)seg('Overreaction or reaction',O)}}
    // tiers
    const t1=p.slice(0,PN).filter(id=>rec(id).l<=1&&((D[id]||{}).qw||0)>=4).slice(0,3),pret=p.slice(4,PN).filter(id=>((D[id]||{}).sos||0)<-3&&((D[id]||{}).qw||0)<3).slice(0,2),t2=p.slice(0,8).filter(id=>!t1.includes(id)&&!pret.includes(id)).slice(0,3);
    if(rec(p[0]).w+rec(p[0]).l>=3)seg('Tiers',[t1.length?'Tier one, the teams that can win it all: '+t1.map(A).join(', ')+'.':'I don\'t have a true tier one team yet. Nobody\'s earned it.',t2.length?'Tier two, could get hot in December: '+t2.map(A).join(', ')+'.':'',pret.length?'Pretenders. Ranked, but I don\'t trust them: '+pret.map(A).join(', ')+'.':'']);
  }else{
    seg('Preseason tiers',['Tier one: '+p.slice(0,3).map(A).join(', ')+'. Everybody else is chasing.','My dark horse is '+N(pk(p.slice(8,16)))+'. Write it down.','The team I\'m most worried about? '+N(pk(p.slice(3,8)))+'. Too many questions up front.']);
  }
  if(key!=='pre'&&S.week>=3){try{const hz=heisman().sort((a,b)=>b.sc-a.sc).slice(0,3);if(hz.length)seg('Heisman watch',['Top of my Heisman board: '+hz.map((c,i)=>(i+1)+'. '+short(c.name)+' ('+c.t.abbr+', '+c.pos+')').join('  ')+'.',pk(['Number one is HIM. Not close right now.','It is a race. Anybody in that top three can steal it in November.','If '+short(hz[0].name)+' keeps this pace, start engraving.']),C(pk(['My guy is '+short(hz[hz.length-1].name)+'. Watch. Remember I said it.','Wade, you are a frontrunner. I respect it but I hate it.','Number one is a stat padder. I said what I said.']))])}catch(e){}}
  if(key!=='pre'){const lg=S.games.filter(g=>g.done&&String(g.wk)===key&&g.h!==S.userId&&g.a!==S.userId),cg=lg.length?lg[Math.floor(rr()*lg.length)]:null;if(cg){const lt=winnerOf(cg)===cg.h?cg.a:cg.h,T=team(lt);
    seg('Caller line',['Line two, you are on Third and Saturday.','Caller: "Yeah Wade, first time, long time. I am a '+T.mascot+' fan and I need to vent. '+pk(['We are COOKED. Fire everybody. Fire the band. Fire the guy who sells the peanuts.','I watched that game in my truck because my wife would not let me watch it inside.','That play calling was a crime against football. I want answers.','Wade I have been a season ticket holder for 30 years and that was the worst football I have ever seen.'])+'"',pk(['Sir, I hear you. Go drink some water. It is gonna be okay.','Respectfully, it is one game. Touch grass. Then call me back.','I feel your pain. I do. But you might be a little cooked yourself.']),C('Ced here. Sir, you are welcome on this show anytime. That was beautiful.')])}}
  seg('Hot take',[C(pk(['Hot take of the week: '+N(pk(p.slice(5,PN)))+' wins the whole thing. I am not joking.','Hot take: '+N(pk(p.slice(0,4)))+' is a FRAUD. Paper tiger. Beat somebody.','Hot take: the best coach in this league is not who you think. It is whoever is at '+N(pk(p.slice(8,20)))+'.','Hot take: '+N(pk(p.slice(0,6)))+' loses twice before the playoff.'])),pk(['Ced... no.','You cannot say that on the air.','I hate how much I agree with that.','That is going to age terribly and I cannot wait.'])]);
  // coaching
  const hot=S.teams.filter(t=>t.id!==S.userId&&t.coach.heat>=60).sort((a,b)=>b.coach.heat-a.coach.heat)[0];
  if(hot)seg('Coaching carousel',['Let\'s talk about Coach '+hot.coach.name+' at '+N(hot.id)+'.',pk(['I like the man. The results aren\'t there. That\'s the job.','If it doesn\'t turn around in the next three weeks, the boosters are going to make phone calls.','You can feel it. That fan base is done waiting.'])]);
  // your team
  const u=S.userId,ur=rec(u),k2=p.indexOf(u)+1,X=teamState(u),ug=userGame(S.week);
  seg(N(u)+' check-in',[ 'Coach '+cName+' and '+N(u)+' at '+ur.w+'-'+ur.l+(k2<=PN?', No. '+k2+' in the country.':', unranked.'),
    X.mood>=72?pk(['That team is playing with a chip on its shoulder and I love it.','I\'ll say it. '+(cName.split(' ').pop())+' has got that place rolling.']):X.mood<=35?pk(['The fan base is restless and honestly, I get it.','Something has to change there, and soon.']):pk(['Solid. Not spectacular. They need a signature win.','I go back and forth on them every week, which tells you something.']),
    ug?'Next up: '+N(ug.h===u?ug.a:ug.h)+'. '+(ug.riv!=null?'It\'s a rivalry game. Throw the records out.':pk(['Win that one and people start talking.','That\'s a trap game if I\'ve ever seen one.','Should be a W. Should be.'])):'']);
  // mailbag
  const mbT=team(pk(p.slice(0,20)));
  const mq=[['Is '+mbT.name+' for real or am I getting my heart broken again?',['Both. You\'re a fan. That\'s the deal you signed.','For real. But they\'ll break your heart in the process. That\'s football.','Ask me again after the next two games. I\'m not ready to commit.']],
    ['Who has the best fan base in the league? Asking for a friend. The friend is me. I\'m a '+mbT.mascot+' fan.',['I\'m not touching that. I like being able to travel.','Whoever travels best to a road game in the rain. That\'s the test.','Nice try. Everybody thinks it\'s them.']],
    ['Should '+mbT.name+' be higher in the poll?',['Win the next one and the poll takes care of itself.','No. Beat somebody good first.','Probably, yeah. Voters are sleeping on them.']],
    ['What\'s one thing '+mbT.name+' has to fix before November?',['Third down defense. It\'s not close.','Stop turning it over. Every loss has the same story.','The offensive line. Everything starts there.']]];
  const mm=pk(mq);seg('Mailbag',['@'+handle(mbT.id,'fan',rr)+' asks: "'+mm[0]+'"',pk(mm[1])]);
  // picks for this week
  const up=S.games.filter(g=>g.wk===S.week&&!g.done).map(g=>{stampGame(g);return g}).sort((a,b)=>Math.min(rankOf(a.h,p),rankOf(a.a,p))-Math.min(rankOf(b.h,p),rankOf(b.a,p))).slice(0,5);
  {const bg=up.find(g=>bigRiv(g));if(bg){const rv=S.rivals[bg.riv];seg('Bad blood in the bracket',['Ced. CED. '+N(bg.a)+' and '+N(bg.h)+'. In '+bigStage(bg)+'. The '+troN(rv)+'. I need a minute.',C(pk(['Wade, these two fan bases cannot stand each other on a normal Saturday. Now somebody\'s season ENDS? I am sweating.','I talked to a guy who has had tickets for 40 years. He said he is bringing his blood pressure medicine.','The bracket gods are sickos. I love them for this.'])),'Series is '+bigSer(rv)+'. Throw out the seeds. Throw out the records. Throw out everything.',pk(['Whoever loses this does not just lose a game. They lose a year of bragging rights and their season. Brutal.','That stadium is going to be shaking. Bring earplugs. Bring a helmet.','This is the game I would pay to watch from a tree outside the stadium.']),C('Prediction: somebody cries on the field. Players, fans, me. Everybody.')])}}
  const picks=[];
  up.forEach((g,i)=>{const fav=(g.pl||0)>=0?g.h:g.a,dog=fav===g.h?g.a:g.h,spread=Math.abs(g.pl||0);
    let pick=fav,tag='lean';if(spread>=14)tag='lock';
    if(i===up.length-1&&spread<14){pick=dog;tag='upset special'}else if((spread<6&&rr()<.32)||(spread<10&&rr()<.12)){pick=dog;tag='gut call'}
    picks.push({g:S.games.indexOf(g),pick,tag})});
  if(picks.length)seg('Picks',[...picks.map(x=>{const g=S.games[x.g];return team(g.a).abbr+' at '+team(g.h).abbr+': '+N(x.pick)+(x.tag==='lock'?pk(['. That\'s a lock.','. Easy.','. Not overthinking it.','. Comfortably.','. Bank it.']):x.tag==='upset special'?'. Upset special. Don\'t @ me.':x.tag==='gut call'?'. Gut call. Going against the number.':pk(['. Lean.','. Close one, but yes.','. Slight lean.','.']))}),'Season record: '+P.rec.w+'-'+P.rec.l+'.']);
  // bulletin board quote for a big game this week
  const bbG=up.find(g=>g.riv!=null)||up[0];
  if(bbG&&rr()<.75){const sp=rr()<.5?bbG.h:bbG.a,op=sp===bbG.h?bbG.a:bbG.h,who=team(sp).star?team(sp).star.name:fullName();
    const q=pk(['We\'re going to their place and we\'re going to make it quiet.','Honestly, I don\'t think they can hang with us for four quarters.','Circle it. We\'ve been waiting on this one all year.','They\'re overrated. Everybody knows it.']);
    S.bb={season:S.season,wk:S.week,team:sp,opp:op,g:S.games.indexOf(bbG),who,q};
    seg('Bulletin board',[short(who)+' of '+N(sp)+' on '+N(op)+': "'+q+'"',pk(['That\'s going straight on the wall in their locker room.','Bold. I respect it. Now go back it up.','I would not have said that out loud. But here we are.'])]);
  }
  seg('Sign-off',[pk(['That is the show. Go touch grass, call your mother, and I will see you Saturday.','That is a wrap. Rate, review, and stop texting me about the poll. See you Saturday.','We out. Be good to each other. Except on Saturdays.']),C(pk(['Big Ced out. Stay sicko.','PEACE. We are so back.','Ced out. Somebody check on the panic meter.']))]);
  const titles=key==='pre'?'Season preview: tiers, dark horses and a bold call':pk(['Overreactions and real reactions','Who\'s real, who\'s not, and a panic meter','Somebody\'s getting fired, probably','The week that broke the poll','Picks, panic and a heated mailbag','We are SO back (some of us)','Cooked or not cooked','Ced loses his mind, again','Sickos rise up']);
  P.eps.unshift({v:3,key,n:P.eps.length+1,title:titles,len:ri(48,84),segs,picks});
}
function podHTML(){
  try{const P0=podState();if(P0.eps.length&&P0.eps[0].v!==3)podWeek()}catch(e){}
  const P=podState();podGrade();if(!P.eps.length)return '';
  const sel=S.podSel!=null&&P.eps[S.podSel]?S.podSel:0,ep=P.eps[sel];
  let h='<section class="card pod"><div class="pod-h"><span class="pod-art" aria-hidden="true">3&amp;S</span><div style="min-width:0"><span class="eyebrow">'+esc(POD.show)+' · '+esc(POD.host)+' &amp; '+esc(POD.co)+'</span><h3>Ep. '+ep.n+': '+esc(ep.title)+'</h3><span class="muted" style="font-size:12px">'+ep.len+' min · '+(ep.key==='pre'?'Preseason':weekLabel(+ep.key)+' recap')+' · Picks '+P.rec.w+'-'+P.rec.l+'</span></div></div>';
  h+=ep.segs.map((s,i)=>'<details class="pseg"'+(i<2?' open':'')+'><summary>'+esc(s.h)+'</summary>'+s.lines.map(l=>{const c=/^C\|/.test(l),t=l.replace(/^[WC]\|/,'');return '<p class="pl'+(c?' ced':'')+'"><b class="pspk">'+(c?'CED':'WADE')+'</b>'+esc(t)+'</p>'}).join('')+(s.h==='Picks'?'<div class="ppicks">'+(ep.picks||[]).map(x=>{const g=S.games[x.g];return g?'<span class="chip '+(x.res==='W'?'good':x.res==='L'?'bad':'')+'">'+esc(team(x.pick).abbr)+(x.res?' '+x.res:'')+'</span>':''}).join('')+'</div>':'')+'</details>').join('');
  if(P.eps.length>1)h+='<div class="chips">'+P.eps.slice(0,8).map((e,i)=>'<button class="chip'+(i===sel?' amber':'')+'" data-act="podsel" data-i="'+i+'">Ep. '+e.n+'</button>').join('')+'</div>';
  return h+'</section>';
}
/* extra drama for the weekly storylines */
function dramaNews(w,add){
  const p=poll(),N=id=>team(id).name,games=S.games.filter(g=>g.wk===w&&g.done),rr=srng(hashS(S.season+':drama:'+w)),pk=a=>a[Math.floor(rr()*a.length)];
  for(const g of games){if(!bigRiv(g))continue;const rv=S.rivals[g.riv],W=winnerOf(g),Lo=W===g.h?g.a:g.h,sc=Math.max(g.hs,g.as)+'-'+Math.min(g.hs,g.as);add('Rivalry',48,W,fill(pk(BIGR.res),{w:N(W),l:N(Lo),score:sc,stage:bigStage(g),trophy:troN(rv)}),'The '+troN(rv)+' rivalry has never had stakes like this. '+N(W)+' fans will be talking about it for decades. '+N(Lo)+' fans will be trying to forget it for just as long.')}
  for(const g of S.games.filter(g=>g.wk===w+1&&!g.done&&!bigRiv(g)&&gameEnv(g).theme)){const e=gameEnv(g),gi=S.games.indexOf(g);add('Game day',gi===lcsWO()?44:34,g.h,gi===lcsWO()?'The Lighthouse Colorado whiteout is here':THEME[e.theme].n+' called for '+N(g.a)+' at '+N(g.h),(gi===lcsWO()?'The annual night whiteout is the loudest game in the league. ':'')+N(g.a)+' gets the full '+THEME[e.theme].w+' treatment'+(e.night?' under the lights':'')+'. Road teams have struggled with the noise.')}
  for(const g of S.games.filter(g=>g.wk===w+1&&!g.done&&bigRiv(g))){const rv=S.rivals[g.riv];add('Rivalry',46,g.h,'Bad blood in the bracket: '+N(g.a)+' vs '+N(g.h),'The '+troN(rv)+' rivalry heads to '+bigStage(g)+'. Series: '+bigSer(rv)+'. Tickets are gone, tailgates start early, and one fan base goes home miserable.')}
  // bulletin board payoff
  const bb=S.bb;if(bb&&bb.season===S.season&&bb.wk===w){const g=S.games[bb.g];if(g&&g.done){const won=winnerOf(g)===bb.team,sc=Math.max(g.hs,g.as)+'-'+Math.min(g.hs,g.as);
    add('Drama',won?30:36,won?bb.team:bb.opp,won?pk([short(bb.who)+' backs up the talk',short(bb.who)+' said it, then did it',N(bb.team)+' puts its money where its mouth is']):pk(['Words come back to bite '+N(bb.team),N(bb.opp)+' makes '+N(bb.team)+' eat its words','Bulletin board material backfires on '+N(bb.team)]),won?'He said "'+bb.q+'" and then '+N(bb.team)+' went out and won '+sc+'.':N(bb.opp)+' heard every word. "'+bb.q+'" ended in a '+sc+' loss for '+N(bb.team)+'.')}}
  for(const t of S.teams){if(t.id===S.userId)continue;const s=streak(t.id),r=rec(t.id),rk=p.indexOf(t.id)+1;
    // QB controversy
    if(!S.qbcW||S.qbcW.wk!==w)S.qbcW={wk:w,n:0};
    if(!s.w&&s.n>=2&&s.n<=4&&t.star&&t.star.pos==='QB'&&S.qbcW.n<1&&!(S.qbc&&S.qbc[t.id]===S.season)&&rr()<.35&&(S.qbcW.n++,(S.qbc=S.qbc||{})[t.id]=S.season,true))add('Drama',23,t.id,'QB controversy brewing at '+t.name,'After '+s.n+' straight losses, '+short(t.star.name)+' split reps with the backup in practice. Coach '+t.coach.name+' won\'t name a starter.');
    // fans turning
    if(w>=3&&rk>PN&&((S.preRank||p).indexOf(t.id)+1)<=8&&teamState(t.id).mood<25&&rr()<.5){const fp=teamFeed(t.id,3)[0];add('Drama',22,t.id,t.name+' fans have had enough',(fp?'"'+fp.txt+'" ':'')+'Preseason expectations were sky high. '+recStr(t.id)+' is not what anybody signed up for.')}
    // record chase
    const R2=S.arch&&S.arch.rec&&S.arch.rec[t.id];if(R2&&t.star&&w>=5&&w<12){const kk=t.star.pos==='QB'?'pass':t.star.pos==='RB'?'rush':'rcv',rec2=R2[kk],y=t.star.yds||0;
      if(rec2&&y<rec2[1]&&y>=rec2[1]*.82&&rr()<.6)add('Record watch',19,t.id,short(t.star.name)+' is closing in on a '+t.name+' record',short(t.star.name)+' has '+y.toLocaleString()+' yards. The program record is '+rec2[1].toLocaleString()+', set by '+rec2[0]+' in '+rec2[2]+'.')}
  }
  // first rivalry win in years
  for(const g of games){if(g.riv==null)continue;const rv=S.rivals[g.riv],W=winnerOf(g),Lo=W===g.h?g.a:g.h,prevW=[...(rv.arch||[]),...(rv.hist||[]).slice(0,-1)].filter(m=>m.w===W).map(m=>m.y);
    const last=prevW.length?Math.max(...prevW):null;if(last!=null&&yearOf(S.season)-last>=4)add('Rivalry',34,W,N(W)+' beats '+N(Lo)+' for the first time since '+last,'The drought is over. The '+rv.trophy.replace(/^The /,'')+' is going home with '+N(W)+'.')}
  // Heisman stock drop
  const hz=heisman().slice(0,3);for(const c of hz){if(c.mine)continue;const g=games.find(x=>x.h===c.t.id||x.a===c.t.id);if(g&&winnerOf(g)!==c.t.id&&rr()<.7)add('Heisman',21,c.t.id,'Heisman stock drops for '+short(c.name),N(c.t.id)+' lost to '+N(g.h===c.t.id?g.a:g.h)+', and voters noticed.')}
  // coaching rumor
  const hot=S.teams.filter(t=>t.id!==S.userId&&t.coach.heat>=70).sort((a,b)=>b.coach.heat-a.coach.heat)[0];
  const star=S.teams.filter(t=>t.id!==S.userId&&t.id!==(hot&&hot.id)&&t.prestige<(hot?hot.prestige:99)&&p.indexOf(t.id)<PN&&((S.preRank||p).indexOf(t.id)-p.indexOf(t.id))>=4)[0];
  if(hot&&star&&w>=4&&rr()<.5)add('Coaching',27,star.id,'Coach '+star.coach.name+'\'s name surfaces for the '+hot.name+' job',hot.name+' boosters are already making calls. Nobody has been fired yet, but '+star.coach.name+' has '+star.name+' playing way above expectations.');
}
/* one-game suspensions with a real effect */
function suspensions(w,fresh){
  if(w>=15)return;const rr=srng(hashS(S.season+':susp:'+w));
  for(const t of S.teams){if(t.id===S.userId||rr()>.012)continue;
    const pos=['WR','RB','CB','LB','DE'][Math.floor(rr()*5)],off=['WR','RB'].includes(pos),name=fullName();
    const j={team:t.id,pos,name,wk:1,side:off?'off':'def',imp:-2,susp:true};S.inj.push(j);fresh.push(j)}
}

/* ---------- team logos: shape, colors and a mascot emblem, unique per team ---------- */
const LOGO_ICONS={
 helmet:'<path d="M8 36 Q6 11 31 9 Q52 9 55 29 L55 35 L41 35 L39 46 L21 46 Q10 44 8 36Z" stroke="none"/><g fill="none" stroke-width="3.4" stroke-linecap="round"><path d="M41 31 H60 V47 H44"/><path d="M41 40 H60"/><path d="M50 31 V47"/></g><circle cx="27" cy="31" r="3.5" opacity=".35" stroke="none"/>',
 wing:'<path d="M10 40 Q20 16 54 13 Q45 19 50 21 Q38 24 45 27 Q34 29 40 33 Q27 33 10 40Z"/>',
 mountain:'<path d="M6 46 L23 18 L31 30 L40 14 L58 46Z"/><path d="M40 14 L46 24 L42 23 L40 27 L37 23 L34 24Z" fill="#fff" opacity=".9"/>',
 star:'<path d="M32 7 L38.5 25 L57 25 L42 36 L47.5 54 L32 43 L16.5 54 L22 36 L7 25 L25.5 25Z"/>',
 shoe:'<path d="M18 12 Q14 34 20 44 Q26 54 32 54 Q38 54 44 44 Q50 34 46 12 L38 12 Q42 30 38 40 Q35 46 32 46 Q29 46 26 40 Q22 30 26 12Z"/>',
 horns:'<path d="M6 16 Q10 36 26 34 L26 28 Q14 30 6 16Z"/><path d="M58 16 Q54 36 38 34 L38 28 Q50 30 58 16Z"/><path d="M24 26 Q32 22 40 26 L42 42 Q32 54 22 42Z"/>',
 anchor:'<circle cx="32" cy="12" r="5" fill="none" stroke-width="4"/><path d="M30 16 H34 V48 H30Z"/><path d="M20 26 H44 V30 H20Z"/><path d="M12 36 Q14 52 32 52 Q50 52 52 36 L56 38 Q52 58 32 58 Q12 58 8 38Z"/>',
 bolt:'<path d="M37 5 L18 34 L30 34 L25 58 L46 25 L34 25Z"/>',
 flame:'<path d="M32 6 Q45 20 41 33 Q47 29 46 22 Q54 35 46 47 Q40 56 32 56 Q22 56 18 46 Q13 33 26 21 Q26 30 30 32 Q25 17 32 6Z"/>',
 arrow:'<path d="M10 52 L46 16 L42 12 L56 8 L52 22 L48 18 L12 54Z"/><path d="M10 52 L4 50 L12 44Z M10 52 L12 58 L18 50Z"/>',
 paw:'<ellipse cx="32" cy="40" rx="12" ry="10"/><ellipse cx="18" cy="26" rx="5" ry="6"/><ellipse cx="27" cy="18" rx="5" ry="6"/><ellipse cx="37" cy="18" rx="5" ry="6"/><ellipse cx="46" cy="26" rx="5" ry="6"/>',
 wheat:'<path d="M30.5 14 H33.5 V58 H30.5Z"/><ellipse cx="32" cy="10" rx="3" ry="5"/><ellipse cx="26" cy="20" rx="3" ry="5.5" transform="rotate(-30 26 20)"/><ellipse cx="38" cy="20" rx="3" ry="5.5" transform="rotate(30 38 20)"/><ellipse cx="26" cy="31" rx="3" ry="5.5" transform="rotate(-30 26 31)"/><ellipse cx="38" cy="31" rx="3" ry="5.5" transform="rotate(30 38 31)"/><ellipse cx="26" cy="42" rx="3" ry="5.5" transform="rotate(-30 26 42)"/><ellipse cx="38" cy="42" rx="3" ry="5.5" transform="rotate(30 38 42)"/>',
 compass:'<circle cx="32" cy="32" r="20" fill="none" stroke-width="4"/><path d="M32 8 L37 32 L32 56 L27 32Z"/><path d="M8 32 L32 28 L56 32 L32 36Z" opacity=".6"/>',
 crown:'<path d="M10 44 L13 16 L23 30 L32 12 L41 30 L51 16 L54 44Z"/><path d="M10 48 H54 V54 H10Z"/>',
 cross:'<path d="M28 6 H36 V22 H52 V30 H36 V58 H28 V30 H12 V22 H28Z"/>',
 sting:'<path d="M18 50 Q8 30 22 18 Q36 6 48 16 Q56 24 48 30 L54 36 L42 34 Q46 24 38 20 Q28 18 24 28 Q20 38 28 48Z"/>',
 swirl:'<path d="M8 12 H56 V18 H8Z M14 24 H50 V30 H14Z M20 36 H44 V42 H20Z M26 48 H38 V54 H26Z"/>',
 wave:'<path d="M4 30 Q12 20 20 30 T36 30 T52 30 T68 30 V38 Q60 28 52 38 T36 38 T20 38 T4 38Z"/><path d="M4 44 Q12 34 20 44 T36 44 T52 44 T68 44 V52 Q60 42 52 52 T36 52 T20 52 T4 52Z" opacity=".7"/>'
};
function iconFor(m){
  const s=(m||'').toLowerCase();
  if(/spartan|trojan|titan|knight|warrior|gladiator/.test(s))return 'helmet';
  if(/eagle|falcon|hawk|aviator|pelican|angel|raven|owl|cardinal|jay|roadrunner|bird|skyhawk/.test(s))return 'wing';
  if(/mountain|peak|summit|climber/.test(s))return 'mountain';
  if(/mustang|colt|stallion|bronco|thoroughbred|cowboy|horse|racer/.test(s)&&!/racer/.test(s))return 'shoe';
  if(/racer|rocket|jet|thunder|storm|blazer$|bolt|lightning/.test(s)&&!/trailblazer/.test(s))return 'bolt';
  if(/ram|bison|buffalo|longhorn|steer|bull/.test(s))return 'horns';
  if(/mariner|laker|sailor|pirate|navigator|captain/.test(s))return 'anchor';
  if(/blazer|flame|fire|heat|inferno/.test(s))return 'flame';
  if(/brave|arrow|archer|warrior/.test(s))return 'arrow';
  if(/cougar|wolf|wolves|bulldog|bear|tiger|lion|panther|wildcat|cat|dog/.test(s))return 'paw';
  if(/harvest|farmer|reaper/.test(s))return 'wheat';
  if(/explorer|nomad|pioneer|voyager|trail|ranger/.test(s))return 'compass';
  if(/giant|king|royal|monarch/.test(s))return 'crown';
  if(/crusader|cavalier|saint|templar|apostle|bishop/.test(s))return 'cross';
  if(/scorpion|rattler|snake|viper|hornet|stinger/.test(s))return 'sting';
  if(/tornado|cyclone|twister|hurricane/.test(s))return 'swirl';
  if(/wave|tide|surf/.test(s))return 'wave';
  return 'star';
}
function lum(hex){const n=parseInt((hex||'#333').slice(1),16);const r=(n>>16)/255,g=(n>>8&255)/255,b=(n&255)/255;return .2126*r+.7152*g+.0722*b}
function color2Of(t){if(t.color2)return t.color2;const h=hashS(t.name||'x');return lum(t.color)<.42?(h%3===0?'#ffffff':'#f2c14e'):'#14213d'}
const LOGO_CACHE={};
/* LOGO_ART: custom primary logos, 100x100, no background shapes. Each fn(c1,c2,X) returns SVG markup. X = helpers {sh(hex,amt), TP text paths, D dark, W white} */
const LOGO_ART={
NWY:(c1,c2,X)=>{const seg=[[90,60,6.4],[94,50,6],[95,40,5.6],[92,31,5.2],[86,24,4.8],[79,21,4.4],[72,23,4]];let tl='';
  for(const [x,y,r] of seg)tl+='<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c1+'" stroke="#fff" stroke-width="1.6"/>';
  return '<g transform="rotate(-10 50 50)">'+tl+'<path d="M69 24 C64 26 62 31 64 37 C61 33 60 28 62 24 Z" fill="#0b1020" stroke="#fff" stroke-width="1.2"/>'+
  '<path d="M4 82 C30 76 60 76 84 70" stroke="'+c1+'" stroke-width="4" fill="none" stroke-linecap="round"/>'+
  '<path d="'+X.TP.northway+'" fill="'+c1+'" stroke="#fff" stroke-width="2.6" paint-order="stroke"/></g>'},
PVB:(c1,c2,X)=>{let h='';for(const [x,y] of [[26,26],[26,40],[27,54],[74,26],[74,40],[73,54],[38,74],[62,74]])h+='<rect x="'+(x-2.4)+'" y="'+(y-3.6)+'" width="4.8" height="7.2" rx="1.2" fill="'+c2+'" transform="rotate('+(x<50?(y>70?-40:0):(y>70?40:0))+' '+x+' '+y+')"/>';
  return '<path d="M26 12 L26 50 C26 72 36 86 50 86 C64 86 74 72 74 50 L74 12" stroke="'+c1+'" stroke-width="19" fill="none"/>'+
  '<path d="M16 10 H36 V16 H16 Z M64 10 H84 V16 H64 Z" fill="'+c1+'"/>'+
  '<path d="M26 14 L26 50 C26 72 36 86 50 86 C64 86 74 72 74 50 L74 14" stroke="'+c2+'" stroke-width="1.6" fill="none" opacity=".5"/>'+h},
SCB:(c1,c2,X)=>{const N=10;let s='';for(let i=0;i<N;i++){const t=i/(N-1),y=10+t*76,w=86*(1-t)+8,cx=46+t*12+Math.sin(t*5)*5;
  s+='<path d="M'+(cx-w/2).toFixed(1)+' '+y.toFixed(1)+' C'+(cx-w/2).toFixed(1)+' '+(y+7).toFixed(1)+' '+(cx+w/2).toFixed(1)+' '+(y+7).toFixed(1)+' '+(cx+w/2).toFixed(1)+' '+y.toFixed(1)+'" stroke="'+(i%2?X.sh(c2,.12):c1)+'" stroke-width="'+(9.5-t*4).toFixed(1)+'" fill="none" stroke-linecap="round"/>'}
  return '<g transform="rotate(8 50 50)">'+s+'</g><g fill="'+c2+'"><rect x="8" y="34" width="5" height="5" transform="rotate(20 10 36)"/><rect x="86" y="54" width="4.4" height="4.4" transform="rotate(40 88 56)"/><path d="M84 22 l6 2 -4 4 Z"/><rect x="16" y="66" width="3.6" height="3.6"/></g>'+
  '<path d="M38 95 C46 91 66 91 76 95" stroke="'+c2+'" stroke-width="3" fill="none" stroke-linecap="round"/>'},
HAL:(c1,c2,X)=>{let wh='';for(const [dx,rot] of [[-7,-14],[0,0],[7,14]]){wh+='<g transform="rotate('+rot+' 72 92)"><path d="M72 92 L72 30" stroke="'+c1+'" stroke-width="2.6"/>';for(let k=0;k<5;k++){const y=24+k*7;wh+='<ellipse cx="69.4" cy="'+y+'" rx="3" ry="5.4" fill="'+c1+'" transform="rotate(-26 69.4 '+y+')"/><ellipse cx="74.6" cy="'+(y+2)+'" rx="3" ry="5.4" fill="'+c1+'" transform="rotate(26 74.6 '+(y+2)+')"/>'}wh+='<ellipse cx="72" cy="17" rx="2.8" ry="5.6" fill="'+c1+'"/></g>'}
  return wh+'<path d="M64 72 L80 72" stroke="'+X.sh(c1,-.45)+'" stroke-width="5"/>'+
  '<path d="M24 96 C32 70 44 40 58 10" stroke="'+X.sh(c1,-.5)+'" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M31 72 L44 77 M44 44 L56 49" stroke="'+c2+'" stroke-width="5.4" stroke-linecap="round"/>'+
  '<path d="M58 8 C40 -2 12 8 2 36 C18 22 36 18 60 22 Z" fill="#dfe3e8"/><path d="M58 8 C40 -2 12 8 2 36 C10 24 20 17 32 14" stroke="#ffffff" stroke-width="1.6" fill="none"/><path d="M60 22 C40 18 22 22 6 32" stroke="#8a939e" stroke-width="2" fill="none"/>'},
CAL:(c1,c2,X)=>{const sab=(m)=>'<g'+(m?' transform="translate(100 0) scale(-1 1)"':'')+'><path d="M16 92 L84 30" stroke="#d6dbe2" stroke-width="5" stroke-linecap="round"/><path d="M84 30 L92 22 L88 32 Z" fill="#d6dbe2"/><path d="M12 82 C16 76 24 80 26 86 C22 92 16 92 12 82 Z" fill="'+c2+'"/><path d="M10 96 L16 90" stroke="'+X.sh(c1,-.3)+'" stroke-width="5" stroke-linecap="round"/></g>';
  return sab(0)+sab(1)+
  '<path d="M26 44 C14 22 38 4 62 8 C80 12 94 26 98 42 C86 30 72 24 58 24 C44 24 32 32 26 44 Z" fill="'+c2+'"/><path d="M34 30 C44 22 60 20 74 24 M40 36 C50 30 62 28 76 32" stroke="'+X.sh(c2,-.25)+'" stroke-width="1.6" fill="none"/>'+
  '<path d="M28 58 C28 38 40 30 52 32 C64 30 72 38 72 58 Z" fill="'+c1+'"/><path d="M28 52 H72" stroke="'+c2+'" stroke-width="4"/>'+
  '<path d="M4 60 C18 48 82 48 96 60 C82 68 18 68 4 60 Z" fill="'+X.sh(c1,-.2)+'"/>'},

SWB:(c1,c2,X)=>'<path d="'+X.TP.SWB+'" fill="none" stroke="'+X.sh(c1,-.5)+'" stroke-width="9" stroke-linejoin="round" transform="translate(1.6 2)"/><path d="'+X.TP.SWB+'" fill="'+c1+'" stroke="'+(X.lum(c2)>.5?c2:'#ffffff')+'" stroke-width="5" paint-order="stroke" stroke-linejoin="round"/><path d="'+X.TP.SWB+'" fill="none" stroke="'+c1+'" stroke-width="1.2"/>',
LCS:(c1,c2,X)=>{const toes=[[22,48,-28],[39,30,-10],[61,30,10],[78,48,28]];let s='';
  for(const [x,y,a] of toes){s+='<g transform="rotate('+a+' '+x+' '+y+')"><path d="M'+(x-3.4)+' '+(y-9)+' Q'+(x-3)+' '+(y-21)+' '+(x+4)+' '+(y-26)+' Q'+(x+1)+' '+(y-18)+' '+(x+3.4)+' '+(y-9)+' Z" fill="#eef0f4"/><ellipse cx="'+x+'" cy="'+y+'" rx="8.6" ry="11" fill="'+c1+'"/><ellipse cx="'+(x-2.4)+'" cy="'+(y-3)+'" rx="2.6" ry="4" fill="#fff" opacity=".25"/></g>'}
  return '<g transform="rotate(-6 50 60)">'+s+'<path d="'+X.sm([50,54,64,56,76,68,76,82,66,90,57,86,50,90,43,86,34,90,24,82,24,68,36,56],1)+'" fill="'+c1+'"/><path d="M36 64 C42 60 58 60 64 64" stroke="#fff" stroke-width="2.4" fill="none" opacity=".25" stroke-linecap="round"/></g>'},
AVY:(c1,c2,X)=>{const gold='#f2b632',dk=X.sh(c1,-.45);
  const top=X.sm([14,60,15,42,24,26,40,15,58,12,70,16,78,23,82,30]);
  const head=top+' L80 40 L74 48 L76 56 L70 62 L64 71 L59 64 L53 75 L47 66 L40 77 L34 67 L27 75 L22 65 L14 69 Z';
  return '<path d="M10 98 L13 72 L22 58 L44 62 L62 66 L72 70 L70 98 Z" fill="'+c1+'"/><g stroke="'+dk+'" stroke-width="2" fill="none"><path d="M22 82 L30 76 L36 84 L44 78 L50 86 L58 80 L64 88"/><path d="M18 94 L26 88 L32 96"/><path d="M40 96 L48 90 L54 97"/></g>'+
  '<path d="'+head+'" fill="#fff"/>'+
  '<g stroke="#c9ced6" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M22 40 C28 46 32 54 32 62"/><path d="M30 30 C38 38 42 48 42 58"/><path d="M44 24 C50 32 52 42 52 52"/></g>'+
  '<path d="M77 23 C86 21 94 27 98 37 C100 45 98 52 94 57 C93 51 90 48 86 47 L74 48 L80 40 Z" fill="'+gold+'"/><path d="M74 48 L87 47.5 C89 51 86 55 80 56.5 L76 56 Z" fill="'+X.sh(gold,-.22)+'"/>'+
  '<path d="M74 48 L88 47.4" stroke="#7a4a10" stroke-width="1.6"/><ellipse cx="86" cy="32" rx="2" ry="1.3" fill="#7a4a10"/>'+
  '<path d="M63 31 C66 28 72 28 75 31 C72 35 66 35 63 31 Z" fill="'+gold+'"/><circle cx="69.6" cy="31.4" r="2" fill="#0b0b0b"/>'+
  '<path d="M50 20 L82 26 L78 31 L60 27 Z" fill="#0b1020"/>'},

BER:(c1,c2,X)=>{const cx=51,cy=60,a0=Math.PI*1.04,a1=Math.PI*1.86,ri=36,ro=55;const arc=(r,from,to,n)=>{const o=[];for(let i=0;i<=n;i++){const a=from+(to-from)*i/n;o.push((cx+r*Math.cos(a)).toFixed(1)+' '+(cy+r*Math.sin(a)*.95).toFixed(1))}return o};
  const pl='M'+arc(ri,a0,a1,24).join(' L')+' L'+arc(ro,a1,a0,24).join(' L')+' Z';let tk='';for(let i=1;i<12;i++){const a=a0+(a1-a0)*i/12;tk+='<path d="M'+(cx+(ri+4)*Math.cos(a)).toFixed(1)+' '+(cy+(ri+4)*Math.sin(a)*.95).toFixed(1)+' L'+(cx+(ro-3)*Math.cos(a)).toFixed(1)+' '+(cy+(ro-3)*Math.sin(a)*.95).toFixed(1)+'" stroke="'+X.sh(c2,-.3)+'" stroke-width="1.5"/>'}
  return '<path d="'+pl+'" fill="'+c2+'"/>'+tk+
  '<path d="M14 62 C14 38 30 24 52 24 C74 24 88 38 88 58 L88 82 C88 89 83 93 76 93 L66 93 C62 93 60 89 60 85 L60 70 C52 70 46 74 42 80 L32 80 C28 84 28 88 32 93 L6 93 C11 88 14 82 14 76 Z" fill="'+c1+'"/>'+
  '<path d="M68 50 L90 50 L90 60 L74 60 C70 60 68 56 68 50 Z" fill="#0b1020"/>'+
  '<path d="M16 54 C30 50 48 48 64 49" stroke="'+c2+'" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M60 70 L60 85 C60 89 62 93 66 93" stroke="'+c2+'" stroke-width="2.8" fill="none"/><path d="M14 76 C14 82 11 88 6 93" stroke="'+c2+'" stroke-width="2.8" fill="none"/>'+
  '<circle cx="36" cy="66" r="2.6" fill="'+c2+'"/><path d="M40 32 C50 28 62 28 72 32" stroke="#fff" stroke-width="2.2" fill="none" opacity=".35"/>'},

ARB:(c1,c2,X)=>{const cx=54,cy=52,pts=[],inn=[],N=70;for(let i=0;i<=N;i++){const t=i/N,a=Math.PI*1.12+t*Math.PI*2.25,r=38*(1-.68*t),w=26*(1-.8*t);pts.push([cx+(r+w/2)*Math.cos(a),cy+(r+w/2)*Math.sin(a)]);inn.push([cx+(r-w/2)*Math.cos(a),cy+(r-w/2)*Math.sin(a)])}
  const f=a=>a.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1));const d='M'+f(pts).join(' L')+' L'+f([...inn].reverse()).join(' L')+' Z';
  const half='M'+f(pts).join(' L')+' L'+f([...pts.map((p,i)=>[(p[0]+inn[i][0])/2,(p[1]+inn[i][1])/2])].reverse()).join(' L')+' Z';
  let ridges='';for(let i=2;i<N-5;i+=4){ridges+='<path d="M'+pts[i][0].toFixed(1)+' '+pts[i][1].toFixed(1)+' Q'+((pts[i][0]+inn[i][0])/2+2).toFixed(1)+' '+((pts[i][1]+inn[i][1])/2+2).toFixed(1)+' '+inn[i][0].toFixed(1)+' '+inn[i][1].toFixed(1)+'" stroke="'+X.sh(c2,-.35)+'" stroke-width="1.8" fill="none"/>'}
  return '<path d="'+d+'" fill="'+c2+'"/><path d="'+half+'" fill="'+X.sh(c2,-.15)+'"/>'+ridges+'<path d="'+d+'" fill="none" stroke="'+c1+'" stroke-width="3"/>'},
JBB:(c1,c2,X)=>{const cr=X.sh(c1,-.3);let br='';for(let i=0;i<=12;i++){const a=Math.PI*(1.05+i*.075);br+='<path d="M'+(50+20*Math.cos(a)).toFixed(1)+' '+(34+20*Math.sin(a)).toFixed(1)+' L'+(50+36*Math.cos(a)).toFixed(1)+' '+(34+32*Math.sin(a)).toFixed(1)+'" stroke="'+X.sh(c1,-.55)+'" stroke-width="1.4"/>'}
  return '<path d="M12 34 C12 12 30 2 50 2 C70 2 88 12 88 34 L74 32 C70 22 60 18 50 18 C40 18 30 22 26 32 Z" fill="'+cr+'"/>'+br+
  '<path d="M20 46 C20 26 34 18 50 18 C66 18 80 26 80 46 L82 70 C82 80 80 88 74 96 L60 96 L58 70 L42 70 L40 96 L26 96 C20 88 18 80 18 70 Z" fill="'+c1+'"/>'+
  '<path d="M24 50 C30 44 42 44 47 50 L47 58 L53 58 L53 50 C58 44 70 44 76 50 C72 56 62 58 56 60 L56 96 L44 96 L44 60 C38 58 28 56 24 50 Z" fill="'+c2+'"/>'+
  '<path d="M24 42 C28 30 38 25 50 25 C62 25 72 30 76 42" stroke="#fff" stroke-width="2.4" fill="none" opacity=".5"/><path d="M50 18 V44" stroke="'+X.sh(c1,-.25)+'" stroke-width="2"/>'},
BAY:(c1,c2,X)=>{const g='#f2b632';return '<path d="'+X.sm([40,30,30,24,18,22,6,26,14,30,4,36,14,40,6,48,18,50,10,58,24,58,20,66,38,62],1)+'" fill="#f4f2ec"/>'+
  '<g stroke="'+X.sh(c1,-.2)+'" stroke-width="1.6" fill="none"><path d="M38 34 L12 30"/><path d="M38 42 L12 44"/><path d="M38 50 L16 56"/></g>'+
  '<path d="'+X.TP.Bb+'" fill="'+c1+'" stroke="'+g+'" stroke-width="3.4" paint-order="stroke"/>'+
  '<path d="M58 30 C56 20 60 10 70 5 C78 2 86 4 90 9 L97 14 L98 23 L92 21 L88 25 C84 30 76 32 70 31 Z" fill="'+c1+'" stroke="'+g+'" stroke-width="2"/>'+
  '<path d="M88 9 L97 14 L98 23 L93 20 L89 21 Z" fill="'+g+'"/><path d="M93 20 L98 23 L96 27 Z" fill="'+X.sh(g,-.35)+'"/>'+
  '<path d="M70 18 C76 20 82 20 86 18 C82 26 74 28 68 26 Z" fill="#f4f2ec"/><path d="M72 11 L88 13 L84 17 L74 16 Z" fill="#0b1020"/><circle cx="81" cy="15" r="1.5" fill="'+g+'"/>'},
LHI:(c1,c2,X)=>{const wing='M32 54 C24 38 12 28 0 24 C4 29 8 32 12 34 C6 35 2 37 0 40 C8 42 14 42 18 44 C12 46 8 49 6 53 C14 53 20 53 25 55 C20 58 18 62 18 67 C24 63 28 61 32 61 Z';let sp='';for(let i=0;i<10;i++){const a=i*Math.PI/5;sp+='<path d="M'+(50+6*Math.cos(a)).toFixed(1)+' '+(54+6*Math.sin(a)).toFixed(1)+' L'+(50+16*Math.cos(a)).toFixed(1)+' '+(54+16*Math.sin(a)).toFixed(1)+'" stroke="#c9ced6" stroke-width="2.4"/>'}
  let ck='';for(let r=0;r<2;r++)for(let c=0;c<12;c++)if((r+c)%2===0)ck+='<rect x="'+(20+c*5)+'" y="'+(84+r*5)+'" width="5" height="5"/>';
  return '<path d="'+wing+'" fill="'+c1+'"/><path d="'+wing+'" fill="'+c1+'" transform="translate(100 0) scale(-1 1)"/>'+
  '<g stroke="'+X.sh(c1,-.35)+'" stroke-width="1.6" fill="none"><path d="M30 52 L8 34"/><path d="M30 56 L10 48"/><path d="M70 52 L92 34"/><path d="M70 56 L90 48"/></g>'+
  '<circle cx="50" cy="54" r="25" fill="#141821"/><circle cx="50" cy="54" r="17" fill="none" stroke="'+c1+'" stroke-width="3.4"/>'+sp+'<circle cx="50" cy="54" r="5" fill="'+c1+'"/>'+
  '<g stroke="#2c3240" stroke-width="2"><path d="M30 38 L34 41"/><path d="M27 54 L32 54"/><path d="M30 70 L34 67"/><path d="M70 38 L66 41"/><path d="M73 54 L68 54"/><path d="M70 70 L66 67"/></g>'+
  '<rect x="20" y="84" width="60" height="10" fill="#fff"/><g fill="#141821">'+ck+'</g>'},

YAK:(c1,c2,X)=>{const hn='#efe3c6',dk=X.sh(c1,-.45),hair=X.sh(c1,-.3);const horn='M30 36 C16 36 6 26 6 10 C12 20 20 24 32 25 Z';
  return   '<path d="'+X.sm([50,10,62,12,74,18,80,28,88,34,88,46,82,54,76,60,70,62,60,58,50,60,40,58,30,62,24,60,18,54,12,46,12,34,20,28,26,18,38,12],1)+'" fill="'+hair+'"/>'+
  '<path d="M20 30 L24 36 L18 38 M80 30 L76 36 L82 38 M38 14 L42 20 L36 22 M62 14 L58 20 L64 22" stroke="'+dk+'" stroke-width="2" fill="none"/>'+
  '<path d="M33 38 C34 31 42 29 50 29 C58 29 66 31 67 38 L69 64 C69 77 61 85 50 87 C39 85 31 77 31 64 Z" fill="'+c1+'"/>'+
  '<path d="M33 46 L47 51 L46 55 L35 52 Z M67 46 L53 51 L54 55 L65 52 Z" fill="#fff"/><circle cx="42" cy="52" r="1.9" fill="#c1121f"/><circle cx="58" cy="52" r="1.9" fill="#c1121f"/>'+
  '<path d="M31 41 L48 49 M69 41 L52 49" stroke="'+dk+'" stroke-width="4.4" stroke-linecap="round"/><path d="M50 34 V46" stroke="'+dk+'" stroke-width="2"/>'+
  '<ellipse cx="50" cy="74" rx="14" ry="9.5" fill="'+dk+'"/><ellipse cx="44.5" cy="74" rx="3" ry="4.4" fill="#0b0b0b" transform="rotate(-18 44.5 74)"/><ellipse cx="55.5" cy="74" rx="3" ry="4.4" fill="#0b0b0b" transform="rotate(18 55.5 74)"/>'+
  '<path d="M38 84 C40 92 45 97 50 99 C55 97 60 92 62 84 C58 87 54 88 50 88 C46 88 42 87 38 84 Z" fill="'+hair+'"/>'+'<path d="M39 80 C26 82 14 72 12 52 C20 64 29 70 39 72 Z" fill="'+hn+'"/><path d="M39 80 C26 82 14 72 12 52 C20 64 29 70 39 72 Z" fill="'+hn+'" transform="translate(100 0) scale(-1 1)"/><path d="M15 60 C20 67 28 71 36 72 M85 60 C80 67 72 71 64 72" stroke="'+X.sh(hn,-.35)+'" stroke-width="1.6" fill="none"/>'},
FBO:(c1,c2,X)=>{const dk=X.sh(c1,-.5);return '<path d="M30 34 L50 20 L72 16 L92 24 L80 30 L96 38 L82 43 L94 53 L77 55 L86 67 L67 65 L63 84 L52 70 L40 62 L30 58 Z" fill="'+c1+'"/>'+
  '<path d="M40 62 L52 70 L63 84 L56 62 C52 58 46 56 40 56 Z" fill="#f4f2ec"/>'+
  '<path d="M30 34 L16 38 L6 48 L8 58 L13 52 L20 51 L30 58 Z" fill="#f2b632"/><path d="M6 48 L8 58 L13 52" fill="'+X.sh('#f2b632',-.35)+'"/>'+
  '<path d="M34 36 L54 34 L48 42 L38 44 Z" fill="'+dk+'"/><path d="M40 38 L50 37 L47 42 L40 42 Z" fill="#f2c14e"/><circle cx="45" cy="40" r="1.6" fill="#0b0b0b"/>'+
  '<path d="M40 44 L46 46 L44 60 L38 52 Z" fill="'+dk+'"/><g stroke="'+X.sh(c1,.35)+'" stroke-width="1.8" fill="none"><path d="M60 26 L76 30"/><path d="M62 34 L82 40"/><path d="M62 44 L80 50"/></g>'},
SKY:(c1,c2,X)=>{const fl='M50 4 C58 18 72 24 74 42 C76 34 73 28 71 23 C85 34 91 50 87 66 C83 84 68 96 50 96 C32 96 16 84 14 66 C12 52 20 40 28 34 C28 42 30 48 36 52 C32 38 40 20 50 4 Z';
  const L=(s,c,dx)=>'<path d="'+fl+'" fill="'+c+'" transform="translate('+(50+(dx||0))+' 96) scale('+s+') translate(-50 -96)"/>';
  return L(1,c1)+L(.82,'#e63946',2)+L(.64,'#f77f00',-2)+L(.46,'#fcbf49',1)+L(.26,'#fff3b0')},
WVB:(c1,c2,X)=>'<path d="'+X.TP.W+'" fill="'+c2+'" stroke="'+c1+'" stroke-width="2.5" paint-order="stroke"/><path d="'+X.TP.V+'" fill="'+c1+'" stroke="'+c2+'" stroke-width="3.5" paint-order="stroke"/>',
SDB:(c1,c2,X)=>'<g fill="none" stroke="'+c1+'" stroke-width="9" stroke-linecap="round"><circle cx="50" cy="13" r="7"/><path d="M50 22 V88"/><path d="M28 32 H72"/><path d="M14 58 C16 80 34 92 50 92 C66 92 84 80 86 58"/></g>'+
  '<path d="M6 62 L14 50 L22 64 Z M94 62 L86 50 L78 64 Z" fill="'+c1+'"/>'+
  '<path d="M40 24 C58 30 60 40 44 46 C30 52 34 62 54 66 C66 70 62 80 48 84" stroke="'+c2+'" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle cx="28" cy="32" r="5" fill="'+c1+'"/><circle cx="72" cy="32" r="5" fill="'+c1+'"/>',
TEM:(c1,c2,X)=>'<path d="'+X.TP.T1+'" fill="'+c2+'" stroke="'+c1+'" stroke-width="3" paint-order="stroke"/><path d="'+X.TP.T2+'" fill="'+c1+'" stroke="'+c2+'" stroke-width="3.5" paint-order="stroke"/>',
EBC:(c1,c2,X)=>{const skin=X.sh(c2,.18);return '<path d="M30 36 L70 36 C72 48 70 60 64 70 C60 78 56 82 50 82 C44 82 40 78 36 70 C30 60 28 48 30 36 Z" fill="'+skin+'"/>'+
  '<path d="M34 46 L45 48 L44 51 L35 50 Z M66 46 L55 48 L56 51 L65 50 Z" fill="#fff"/><circle cx="41" cy="49.4" r="1.2" fill="'+X.D+'"/><circle cx="59" cy="49.4" r="1.2" fill="'+X.D+'"/>'+
  '<path d="M33 44 L46 46 M67 44 L54 46" stroke="'+X.D+'" stroke-width="2.4"/>'+
  '<path d="M27 54 C40 58 60 58 73 54 L71 66 C65 80 57 92 50 97 C43 92 35 80 29 66 Z" fill="'+c1+'"/>'+
  '<g fill="'+c2+'"><circle cx="40" cy="64" r="2"/><circle cx="50" cy="72" r="2"/><circle cx="60" cy="64" r="2"/><circle cx="50" cy="84" r="1.8"/><circle cx="44" cy="76" r="1.4"/><circle cx="56" cy="76" r="1.4"/></g>'+
  '<path d="M27 54 C40 58 60 58 73 54" stroke="'+X.sh(c1,-.3)+'" stroke-width="2" fill="none"/>'+
  '<path d="M28 37 C27 19 37 9 50 14 C63 9 73 19 72 37 Z" fill="'+c2+'"/><path d="M45 13 C48 18 52 18 55 13" stroke="'+X.sh(c2,-.3)+'" stroke-width="2" fill="none"/>'+
  '<path d="M28 31 L72 31 L72 36 L28 36 Z" fill="'+c1+'"/><path d="M4 38 C14 30 86 30 96 38 C86 44 14 44 4 38 Z" fill="'+c2+'"/>'},
STW:(c1,c2,X)=>{const R='#f3e8cf',horse='M10 44 C14 40 20 36 26 30 L28 19 L32 27 C38 30 42 34 46 38 C52 40 60 40 68 40 C78 40 86 42 90 48 C92 52 92 56 90 60 C90 66 92 72 98 78 L95 83 C88 78 84 72 80 66 C76 66 72 66 70 66 C70 72 66 80 64 89 L59 89 C59 80 61 72 62 66 L46 64 C42 70 36 74 30 76 L21 79 L21 74 C28 72 32 70 36 64 C34 60 34 56 36 52 C32 52 28 52 24 54 C20 56 14 56 12 54 C8 52 8 48 10 44 Z';
  return '<g transform="translate(97 12) scale(-.92 .92)"><path d="'+horse+'" fill="'+c1+'"/><path d="M40 62 C36 66 33 70 35 75 L40 77 L42 73 C40 70 42 66 45 64 Z" fill="'+X.sh(c1,-.25)+'"/><path d="M90 48 C99 43 101 54 99 64 C97 57 95 55 90 55 Z" fill="'+X.sh(c1,-.25)+'"/><path d="M27 22 C36 16 45 21 51 29 C55 34 59 36 66 38 C57 41 49 39 43 35 Z" fill="'+X.sh(c1,-.3)+'"/><circle cx="21" cy="38" r="1.8" fill="#fff"/></g>'+
  '<path d="M42 49 L51 49 L49 33 L41 32 Z" fill="'+R+'"/><path d="M46 47 L53 60 L49 62 L42 50 Z" fill="'+R+'"/><circle cx="45" cy="27.5" r="4.6" fill="'+R+'"/>'+
  '<path d="M36 23.5 L55 21.5" stroke="'+R+'" stroke-width="3.2" stroke-linecap="round"/><path d="M40 23 C40 15 50 15 51 22 Z" fill="'+R+'"/>'+
  '<path d="M48 35 L58 18" stroke="'+R+'" stroke-width="3.6" stroke-linecap="round"/><path d="M42 36 L36 44" stroke="'+R+'" stroke-width="3.2" stroke-linecap="round"/>'+
  '<g fill="none" stroke="'+R+'" stroke-width="2.6" stroke-linecap="round"><ellipse cx="68" cy="11" rx="16" ry="5" transform="rotate(-8 68 11)"/><path d="M58 18 C58 16 57 14 56 13"/></g>'},
BAB:(c1,c2,X)=>'<path d="M50 4 L84 70 L64 70 L64 82 L36 82 L36 70 L16 70 Z" fill="'+c1+'"/>'+
  '<g fill="'+X.sh(c1,-.25)+'"><path d="M50 4 L58 34 L50 30 Z"/><path d="M30 56 L44 50 L38 66 Z"/><path d="M68 56 L58 48 L62 64 Z"/></g>'+
  '<path d="M10 92 L84 18" stroke="'+c2+'" stroke-width="4.6" stroke-linecap="round"/><path d="M94 8 L76 14 L88 26 Z" fill="'+c2+'"/>'+
  '<path d="M12 90 L4 86 L8 78 L16 84 Z M18 84 L10 80 L14 72 L22 78 Z" fill="#fff"/>',
BLV:(c1,c2,X)=>{const dk=X.sh(c1,-.45);return '<path d="M22 30 C22 18 34 12 50 12 C66 12 78 18 78 30 L86 24 L92 36 L82 44 C86 54 86 66 80 74 C74 84 62 88 50 88 C38 88 26 84 20 74 C14 66 14 54 18 44 L8 36 L14 24 L22 30 Z" fill="'+c1+'"/>'+
  '<ellipse cx="50" cy="66" rx="23" ry="15" fill="'+X.sh(c1,.18)+'"/>'+
  '<path d="M29 40 L44 46 L42 51 L30 47 Z M71 40 L56 46 L58 51 L70 47 Z" fill="#fff"/><circle cx="39" cy="46.6" r="2" fill="'+dk+'"/><circle cx="61" cy="46.6" r="2" fill="'+dk+'"/>'+
  '<path d="M26 36 L46 43 M74 36 L54 43" stroke="'+dk+'" stroke-width="4" stroke-linecap="round"/><path d="M50 22 V36" stroke="'+dk+'" stroke-width="2.4"/>'+
  '<path d="M41 56 C41 52 59 52 59 56 C59 61 54 63 50 63 C46 63 41 61 41 56 Z" fill="'+dk+'"/>'+
  '<path d="M50 63 V68 M34 70 C40 76 60 76 66 70" stroke="'+dk+'" stroke-width="2.6" fill="none" stroke-linecap="round"/>'+
  '<path d="M38 72 L41 66 L44 73 Z M62 72 L59 66 L56 73 Z" fill="#fff"/>'+
  '<path d="M22 84 C36 92 64 92 78 84 L76 92 C62 98 38 98 24 92 Z" fill="'+c2+'"/><g fill="#d9dde3"><path d="M32 92 L35 86 L38 93 Z"/><path d="M47 94 L50 88 L53 94 Z"/><path d="M62 93 L65 86 L68 92 Z"/></g>'},
ELP:(c1,c2,X)=>{const blade='M14 90 L20 84 C40 68 66 42 88 8 C86 28 74 48 54 64 C42 74 32 82 24 92 Z';return   '<path d="M50 12 C70 12 82 30 82 52 C82 70 74 84 62 92 L38 92 C26 84 18 70 18 52 C18 30 30 12 50 12 Z" fill="'+c1+'"/>'+
  '<path d="M50 30 C62 30 68 40 68 52 C68 62 62 70 50 72 C38 70 32 62 32 52 C32 40 38 30 50 30 Z" fill="#17110c"/>'+
  '<path d="M36 44 L46 47 L45 50 L37 48 Z M64 44 L54 47 L55 50 L63 48 Z" fill="'+c2+'"/>'+
  '<path d="M31 54 C40 59 60 59 69 54 L67 66 C61 75 39 75 33 66 Z" fill="#d9c7a1"/><path d="M34 60 C42 64 58 64 66 60 M36 66 C44 69 56 69 64 66" stroke="#a8916a" stroke-width="1.6" fill="none"/>'+
  '<path d="M50 12 C44 22 40 30 38 40 M50 12 C56 22 60 30 62 40" stroke="'+X.sh(c1,-.3)+'" stroke-width="2" fill="none"/>'},
WBK:(c1,c2,X)=>{const wing='M52 72 C60 50 76 36 97 33 C95 43 89 49 81 53 C89 53 93 57 93 62 C85 66 77 66 71 66 C77 70 79 74 77 78 C69 80 61 78 52 72 Z';
  return '<path d="'+wing+'" fill="'+c1+'"/><path d="'+wing+'" fill="'+c1+'" transform="translate(100 0) scale(-1 1)"/>'+
  '<g stroke="#fff" stroke-width="1.8" fill="none" opacity=".7"><path d="M58 64 C68 52 80 44 92 38"/><path d="M62 68 C72 62 82 60 90 60"/><path d="M42 64 C32 52 20 44 8 38"/><path d="M38 68 C28 62 18 60 10 60"/></g>'+
  '<ellipse cx="50" cy="26" rx="24" ry="8" fill="none" stroke="'+c2+'" stroke-width="6"/><ellipse cx="50" cy="26" rx="24" ry="8" fill="none" stroke="#fff" stroke-width="1.6" opacity=".7"/>'+
  '<path d="M50 44 L54 56 L50 82 L46 56 Z" fill="'+c2+'"/>'},
UBC:(c1,c2,X)=>{const st=(r,ri)=>{let p='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,R=i%2?ri:r;p+=(i?'L':'M')+(50+R*Math.cos(a)).toFixed(1)+' '+(53+R*Math.sin(a)).toFixed(1)}return p+'Z'};
  return '<path d="'+st(48,19)+'" fill="'+c2+'"/><path d="'+st(39,15.5)+'" fill="'+c1+'"/><path d="'+st(17,7)+'" fill="'+c2+'"/>'},
ESB:(c1,c2,X)=>{let s='<circle cx="50" cy="50" r="30" fill="none" stroke="'+c2+'" stroke-width="4"/><circle cx="50" cy="50" r="30" fill="none" stroke="'+c1+'" stroke-width="1.2"/>';
  const pt=(a,L,w,ca,cb)=>{const r=a*Math.PI/180,cx=50,cy=50,tx=cx+L*Math.sin(r),ty=cy-L*Math.cos(r),lx=cx+w*Math.sin(r-Math.PI/2),ly=cy-w*Math.cos(r-Math.PI/2),rx=cx+w*Math.sin(r+Math.PI/2),ry=cy-w*Math.cos(r+Math.PI/2);
    return '<path d="M'+cx+' '+cy+' L'+lx.toFixed(1)+' '+ly.toFixed(1)+' L'+tx.toFixed(1)+' '+ty.toFixed(1)+' Z" fill="'+ca+'"/><path d="M'+cx+' '+cy+' L'+rx.toFixed(1)+' '+ry.toFixed(1)+' L'+tx.toFixed(1)+' '+ty.toFixed(1)+' Z" fill="'+cb+'"/>'};
  for(const a of [45,135,225,315])s+=pt(a,30,7,X.sh(c2,-.25),c2);for(const a of [0,90,180,270])s+=pt(a,48,10,c1,X.sh(c1,-.35));
  return s+'<circle cx="50" cy="50" r="5" fill="'+c2+'"/><circle cx="50" cy="50" r="2" fill="'+c1+'"/>'},
CLE:(c1,c2,X)=>{const st='#c9ced6',sd='#9aa2ad';return '<path d="M50 12 C58 -1 82 1 95 15 C85 11 73 13 65 21 C75 19 85 23 91 31 C77 27 63 25 52 21 Z" fill="'+c1+'"/>'+
  '<path d="M24 30 C24 18 36 10 50 10 C64 10 76 18 76 30 L78 76 C70 86 60 91 50 91 C40 91 30 86 22 76 Z" fill="'+st+'"/><path d="M50 10 C64 10 76 18 76 30 L78 76 C70 86 60 91 50 91 Z" fill="'+sd+'"/>'+
  '<path d="M25 40 H75 V46 H25 Z" fill="#0b1020"/>'+
  '<path d="M45 16 H55 V84 H45 Z M30 50 H70 V58 H30 Z" fill="'+c1+'"/><path d="M45 16 H55 V84 H45 Z M30 50 H70 V58 H30 Z" fill="none" stroke="'+c2+'" stroke-width="1.6"/>'+
  '<g fill="#0b1020">'+[66,72,78].map(y=>'<circle cx="34" cy="'+y+'" r="1.5"/><circle cx="66" cy="'+y+'" r="1.5"/>').join('')+'</g>'},
STT:(c1,c2,X)=>'<path d="'+X.TP.S+'" fill="'+c1+'" stroke="'+c2+'" stroke-width="3" paint-order="stroke"/><path d="'+X.TP.Tst+'" fill="'+c1+'" stroke="'+c2+'" stroke-width="3" paint-order="stroke"/>'+
  '<clipPath id="stt-clip"><rect x="0" y="0" width="56" height="54"/></clipPath><path d="'+X.TP.S+'" clip-path="url(#stt-clip)" fill="'+c1+'" stroke="'+c2+'" stroke-width="3" paint-order="stroke"/>',
WGT:(c1,c2,X)=>'<defs><linearGradient id="wgt-sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd76a"/><stop offset=".45" stop-color="'+c1+'"/><stop offset="1" stop-color="#d6336c"/></linearGradient><clipPath id="wgt-clip"><path d="M0 0 H100 V62 H0 Z M0 66 H100 V71 H0 Z M0 75 H100 V79 H0 Z M0 83 H100 V86 H0 Z"/></clipPath></defs>'+
  '<circle cx="50" cy="54" r="38" fill="url(#wgt-sun)" clip-path="url(#wgt-clip)"/>'+
  '<path d="M6 50 L30 48 C34 44 38 44 42 46 C46 48 50 48 54 46 C60 38 70 28 92 22 C84 32 78 40 74 46 C82 44 90 46 96 50 C86 53 76 55 66 57 C58 61 48 61 42 57 C36 55 32 53 28 54 L6 52 Z" fill="#2a1630"/><path d="M10 52 C16 56 22 57 28 54" stroke="#2a1630" stroke-width="3" fill="none"/>',
LIB:(c1,c2,X)=>{const half='M50 6 C60 18 64 30 58 46 L54 56 L50 56 Z M56 54 C62 40 76 30 88 36 C96 42 94 56 84 58 C80 52 72 52 70 60 C70 66 74 70 76 74 C66 72 60 66 58 60 Z M50 64 L56 64 L54 82 C53 87 51 88 50 88 Z M60 64 C64 74 70 78 76 80 C70 84 62 82 58 76 Z';
  return '<path d="'+half+'" fill="'+c1+'"/><path d="'+half+'" fill="'+c1+'" transform="translate(100 0) scale(-1 1)"/><rect x="28" y="55" width="44" height="10" rx="3" fill="'+c2+'"/>'+
  '<path d="M50 12 C56 22 58 32 54 44" stroke="'+c2+'" stroke-width="1.8" fill="none" opacity=".8"/>'},
SYR:(c1,c2,X)=>'<path d="'+X.TP.blockS+'" fill="'+c1+'" stroke="'+c2+'" stroke-width="7" paint-order="stroke" stroke-linejoin="round"/>',
};
const LOGO_ART_SM={SWB:(c1,c2,X)=>'<path d="'+X.TP.SW+'" fill="none" stroke="'+X.sh(c1,-.5)+'" stroke-width="9" stroke-linejoin="round" transform="translate(1.6 2)"/><path d="'+X.TP.SW+'" fill="'+c1+'" stroke="'+(X.lum(c2)>.5?c2:'#ffffff')+'" stroke-width="5" paint-order="stroke" stroke-linejoin="round"/>'};
/* shared builder (goes into sideline.html) */
const LOGO_TP={"W":"M68.1 25.0L68.1 14.0L89.5 14.0L89.5 25.0L86.9 25.0L76.9 66.0L56.9 66.0L50.8 37.1L50.2 37.1L43.8 66.0L23.8 66.0L13.1 25.0L10.5 25.0L10.5 14.0L35.2 14.0L35.2 25.0L32.7 25.0L35.3 42.0L35.9 42.0L42.3 14.0L61.5 14.0L67.4 42.0L68.1 42.0L70.7 25.0L68.1 25.0","V":"M52.4 54.4L52.4 46.0L69.6 46.0L69.6 54.4L67.5 54.4L58.3 86.0L41.7 86.0L32.5 54.4L30.4 54.4L30.4 46.0L50.2 46.0L50.2 54.4L47.5 54.4L51.0 71.7L51.5 71.7L55.1 54.4L52.4 54.4","T1":"M66.0 11.0L66.0 29.7L52.7 29.7L52.7 23.6L47.8 23.6L47.8 58.4L53.2 58.4L53.2 71.0L20.8 71.0L20.8 58.4L26.2 58.4L26.2 23.6L21.3 23.6L21.3 29.7L8.0 29.7L8.0 11.0L66.0 11.0","T2":"M92.0 32.0L92.0 50.1L79.2 50.1L79.2 44.2L74.4 44.2L74.4 77.8L79.6 77.8L79.6 90.0L48.4 90.0L48.4 77.8L53.6 77.8L53.6 44.2L48.8 44.2L48.8 50.1L36.0 50.1L36.0 32.0L92.0 32.0","S":"M34.8 80.7L34.8 80.7Q39.3 80.7 42.8 78.3Q46.3 75.9 46.3 70.9Q46.3 66.0 42.6 63.4Q38.8 60.7 31.9 58.8Q24.9 56.8 21.8 55.4Q18.7 53.9 15.9 51.6L15.9 51.6Q10.3 46.9 10.3 37.0L10.3 37.0Q10.3 28.9 16.0 23.2Q21.8 17.4 31.7 17.4L31.7 17.4Q36.5 17.4 41.7 18.8Q46.9 20.2 48.2 20.2Q49.5 20.2 50.5 18.4L50.5 18.4L51.5 18.4L52.1 36.6L50.7 36.6Q46.3 28.8 41.6 24.0Q36.8 19.3 31.2 19.3Q25.7 19.3 22.6 21.8Q19.5 24.4 19.5 28.7Q19.5 33.0 23.2 35.3Q26.8 37.6 32.2 39.1Q37.5 40.5 39.2 41.1Q40.9 41.6 43.4 42.6Q45.9 43.5 47.4 44.6Q49.0 45.6 50.8 47.2Q52.6 48.8 53.6 50.7L53.6 50.7Q56.0 55.0 56.0 61.0L56.0 61.0Q56.0 70.8 49.9 76.7Q43.8 82.6 33.8 82.6L33.8 82.6Q28.7 82.6 22.0 81.3Q15.3 79.9 14.6 79.9L14.6 79.9Q13.4 79.9 12.2 82.6L12.2 82.6L10.9 82.6L10.0 61.1L11.5 61.1Q15.5 69.0 21.7 74.9Q27.9 80.7 34.8 80.7","Tst":"M36.9 20.9L91.1 20.9L92.0 43.9L90.3 43.9Q86.2 31.7 83.1 27.2Q80.0 22.8 74.1 22.8L74.1 22.8L73.0 22.8L73.0 83.2L80.8 83.2L80.8 85.1L47.3 85.1L47.3 83.2L55.1 83.2L55.1 22.8L53.9 22.8Q48.0 22.8 44.8 27.4Q41.6 32.1 37.7 43.9L37.7 43.9L36.0 43.9L36.9 20.9","blockS":"M74.6 20.3L74.6 34.4L65.3 34.4L65.3 24.6L58.6 17.6L41.5 17.6L35.7 23.6L35.7 39.0L41.2 44.6L64.4 44.6L75.8 56.5L75.8 79.7L64.1 92.0L35.9 92.0L24.2 79.7L24.2 65.6L33.5 65.6L33.5 75.4L40.4 82.4L59.7 82.4L65.5 76.4L65.5 59.7L60.1 54.3L36.8 54.3L25.4 42.3L25.4 20.3L37.0 8.0L63.0 8.0L74.6 20.3","Bb":"M38.0 81.3L38.0 69.0L41.8 69.0L41.8 35.0L38.0 35.0L38.0 22.7L72.6 22.7Q82.0 22.7 87.3 26.5Q92.6 30.4 92.6 37.5L92.6 37.5Q92.6 42.0 90.5 45.0Q88.3 48.1 85.5 49.6Q82.7 51.2 80.1 51.7L80.1 51.7L80.1 52.5Q85.4 53.0 89.7 55.8Q94.0 58.7 94.0 66.1L94.0 66.1Q94.0 74.0 88.0 77.7Q82.1 81.3 72.6 81.3L72.6 81.3L38.0 81.3M62.9 47.4L66.9 47.4Q69.1 47.4 70.2 46.2Q71.3 45.1 71.3 42.6L71.3 42.6L71.3 39.9Q71.3 37.4 70.2 36.2Q69.1 35.0 66.9 35.0L66.9 35.0L62.9 35.0L62.9 47.4M62.9 69.0L67.5 69.0Q69.7 69.0 70.7 67.8Q71.8 66.6 71.8 64.1L71.8 64.1L71.8 60.8Q71.8 58.3 70.7 57.2Q69.7 56.0 67.5 56.0L67.5 56.0L62.9 56.0L62.9 69.0","SWB":"M23.2 38.7L23.2 44.1L19.6 44.1L19.6 40.3L17.1 37.7L10.6 37.7L8.3 39.9L8.3 45.8L10.4 48.0L19.3 48.0L23.6 52.5L23.6 61.3L19.2 66.0L8.4 66.0L4.0 61.3L4.0 55.9L7.5 55.9L7.5 59.7L10.1 62.3L17.5 62.3L19.7 60.1L19.7 53.7L17.6 51.6L8.8 51.6L4.4 47.1L4.4 38.7L8.9 34.0L18.7 34.0L23.2 38.7M29.4 37.4L27.4 37.4L27.4 34.0L36.5 34.0L36.5 37.4L33.3 37.4L39.5 61.3L45.7 37.4L43.8 37.4L43.8 34.0L53.0 34.0L53.0 37.4L51.1 37.4L57.3 61.3L63.5 37.4L60.4 37.4L60.4 34.0L69.4 34.0L69.4 37.4L67.4 37.4L60.1 66.0L54.8 66.0L48.4 41.3L42.0 66.0L36.8 66.0L29.4 37.4M73.7 37.4L73.7 34.0L90.7 34.0L95.1 38.7L95.1 46.4L92.8 48.8L96.0 52.1L96.0 61.3L91.6 66.0L73.7 66.0L73.7 62.6L76.7 62.6L76.7 37.4L73.7 37.4M89.7 50.8L80.6 50.8L80.6 62.3L89.9 62.3L92.3 59.8L92.3 53.6L89.7 50.8M89.1 37.7L80.6 37.7L80.6 47.4L89.0 47.4L91.5 44.9L91.5 40.2L89.1 37.7","SW":"M31.8 34.8L31.8 42.0L27.0 42.0L27.0 37.0L23.6 33.4L14.8 33.4L11.8 36.5L11.8 44.4L14.7 47.3L26.6 47.3L32.4 53.3L32.4 65.2L26.4 71.5L12.0 71.5L6.0 65.2L6.0 58.0L10.8 58.0L10.8 63.0L14.3 66.6L24.2 66.6L27.1 63.5L27.1 55.0L24.3 52.2L12.4 52.2L6.6 46.0L6.6 34.8L12.5 28.5L25.8 28.5L31.8 34.8M40.1 33.1L37.5 33.1L37.5 28.5L49.7 28.5L49.7 33.1L45.4 33.1L53.7 65.2L62.0 33.1L59.6 33.1L59.6 28.5L71.9 28.5L71.9 33.1L69.4 33.1L77.7 65.2L86.0 33.1L81.9 33.1L81.9 28.5L94.0 28.5L94.0 33.1L91.3 33.1L81.4 71.5L74.3 71.5L65.8 38.3L57.2 71.5L50.1 71.5L40.1 33.1","northway":"M14.5 41.5L15.1 41.6L16.0 41.4Q16.4 41.4 16.6 41.5Q16.8 41.7 16.8 41.8Q16.8 42.0 16.8 42.2Q16.7 42.5 15.7 47.2Q14.7 52.0 14.3 54.4L14.3 54.4Q16.5 51.4 19.4 47.0Q22.3 42.7 22.8 41.2L22.8 41.2Q23.0 40.8 23.2 40.5Q23.5 40.3 23.7 40.2Q23.9 40.2 24.3 40.2Q24.7 40.2 25.2 40.4Q25.7 40.5 25.7 40.9L25.7 40.9Q25.7 41.7 23.5 45.3Q21.2 49.0 18.3 53.0Q15.4 57.1 13.5 59.5L13.5 59.5Q13.1 59.9 12.6 59.9Q12.2 59.9 11.6 59.7Q11.1 59.6 11.1 59.1L11.1 59.1Q11.1 57.7 13.5 45.5L13.5 45.5Q11.4 48.2 8.4 53.2L8.4 53.2Q5.2 58.3 4.8 59.5L4.8 59.5Q4.6 60.2 4.3 60.3L4.3 60.3Q4.1 60.4 3.8 60.4L3.8 60.4L2.8 60.6Q2.5 60.6 2.3 60.4Q2.0 60.2 2.0 60.0L2.0 60.0Q2.0 59.5 3.4 57.0Q4.9 54.4 6.8 51.4Q8.7 48.4 10.7 45.5Q12.8 42.7 13.9 41.7L13.9 41.7Q14.2 41.5 14.5 41.5L14.5 41.5M29.1 50.1Q29.5 50.1 29.9 50.4Q30.3 50.8 30.3 51.5Q30.3 52.2 29.8 53.3Q29.3 54.5 28.4 55.7Q27.6 56.9 26.5 57.9Q25.5 58.9 24.2 59.6Q23.0 60.3 22.0 60.3Q21.0 60.3 20.4 59.6Q19.8 59.0 19.8 57.9Q19.8 56.8 20.4 55.4Q20.9 54.1 21.8 53.0Q22.7 52.0 23.7 51.2L23.7 51.2Q25.8 49.5 27.3 49.5L27.3 49.5Q28.1 49.5 28.4 49.8L28.4 49.8Q28.5 49.9 28.5 50.0L28.5 50.0L28.5 50.1Q28.7 50.1 29.1 50.1M27.8 51.8L27.8 51.8L27.7 51.8Q27.3 51.8 27.3 51.1L27.3 51.1Q26.3 51.4 25.3 52.2Q24.3 53.0 23.5 54.1L23.5 54.1Q21.8 56.2 21.8 57.6L21.8 57.6Q21.8 58.3 22.3 58.3Q22.8 58.3 23.9 57.7Q24.9 57.0 25.9 55.7Q27.0 54.4 27.5 53.4Q28.0 52.5 28.0 52.1Q28.0 51.8 27.8 51.8M34.8 52.1L34.2 52.9Q37.3 49.4 39.4 49.4L39.4 49.4Q40.0 49.4 40.3 49.7Q40.6 50.1 40.6 50.6Q40.6 51.1 39.9 52.2Q39.2 53.4 38.6 54.2L38.6 54.2Q38.3 54.6 37.9 54.6Q37.5 54.6 37.2 54.3Q37.0 54.1 37.0 53.7L37.0 53.7Q37.0 52.8 38.0 51.6L38.0 51.6L38.0 51.6Q37.5 51.7 35.8 53.3Q34.2 54.9 33.0 56.2Q31.8 57.5 30.4 59.4L30.4 59.4Q30.0 59.9 29.7 59.9Q29.5 59.9 29.0 59.8Q28.5 59.6 28.5 59.5Q28.4 59.4 28.4 59.3Q28.4 59.1 28.5 58.8Q28.6 58.6 28.8 58.2Q29.1 57.7 29.7 56.7Q30.2 55.8 31.4 53.8Q32.6 51.8 32.8 51.4L32.8 51.4Q33.3 50.5 33.6 50.1L33.6 50.1Q34.2 49.4 35.6 49.4L35.6 49.4Q35.9 49.4 35.9 49.8L35.9 49.8Q35.9 50.4 34.8 52.1L34.8 52.1M47.5 43.4L48.1 43.3L48.7 43.4Q48.8 43.4 48.9 43.5Q49.0 43.7 49.0 43.8Q49.0 43.9 48.7 44.3Q48.4 44.8 48.0 45.3Q47.7 45.9 47.7 46.0L47.7 46.0Q48.7 45.9 49.1 45.9Q49.5 45.9 49.7 45.9Q49.8 46.0 50.0 46.3Q50.2 46.5 50.4 46.7Q50.5 46.8 50.5 47.1Q50.5 47.3 50.2 47.5Q49.9 47.7 49.5 47.8L49.5 47.8Q46.5 48.1 46.2 48.1L46.2 48.1Q45.2 49.7 43.3 53.1Q41.4 56.4 41.3 57.3L41.3 57.3Q41.2 57.7 41.2 57.9L41.2 57.9Q41.2 58.4 41.8 58.4Q42.3 58.4 42.9 58.0Q43.6 57.6 44.1 57.1L44.1 57.1Q45.6 55.8 45.7 55.8L45.7 55.8Q46.0 55.8 46.0 57.0L46.0 57.0Q46.0 57.6 45.4 58.1L45.4 58.1Q44.1 59.3 43.2 59.8Q42.3 60.4 41.5 60.4L41.5 60.4Q41.3 60.4 41.1 60.4L41.1 60.4Q40.1 60.2 39.6 59.6Q39.1 59.0 39.1 58.1Q39.1 57.1 39.7 55.8Q40.2 54.4 41.1 52.9L41.1 52.9Q42.5 50.4 43.9 48.2L43.9 48.2L43.4 48.2Q41.9 48.4 41.6 48.4L41.6 48.4L41.5 48.4Q41.2 48.4 40.8 48.3Q40.5 48.1 40.5 47.9Q40.5 47.7 40.6 47.5Q40.8 47.3 40.9 47.2L40.9 47.2Q41.0 46.9 41.5 46.5Q42.1 46.2 42.4 46.2Q42.7 46.1 43.0 46.1Q43.3 46.1 43.6 46.1Q44.0 46.1 44.1 46.1L44.1 46.1L45.3 46.0Q46.4 44.4 46.8 43.9Q47.2 43.5 47.3 43.4Q47.3 43.4 47.5 43.4L47.5 43.4M56.3 56.1L56.3 56.1Q56.4 56.7 56.4 57.0Q56.4 57.4 56.2 57.6Q56.1 57.9 55.7 58.3Q55.3 58.8 54.7 59.3L54.7 59.3Q53.3 60.4 51.8 60.4L51.8 60.4Q49.7 60.4 49.7 58.5L49.7 58.5Q49.7 56.9 52.5 52.0L52.5 52.0Q52.6 51.8 52.7 51.7L52.7 51.7Q51.7 52.4 48.9 55.5Q46.1 58.6 45.1 59.9L45.1 59.9Q45.1 60.0 44.7 60.2Q44.4 60.3 44.3 60.3Q44.1 60.3 43.9 60.2Q43.7 60.1 43.6 60.1L43.6 60.1Q43.5 60.1 43.5 60.0Q43.5 59.9 43.9 58.8Q44.4 57.7 45.1 56.1L45.1 56.1Q47.2 51.7 51.2 44.6L51.2 44.6Q52.7 42.2 53.5 41.1L53.5 41.1Q54.0 40.4 55.4 40.4L55.4 40.4Q55.6 40.4 55.7 40.6Q55.7 40.7 55.7 40.9Q55.7 41.1 55.6 41.3L55.6 41.3L54.3 43.5Q50.2 49.9 48.1 54.1L48.1 54.1Q50.1 51.6 52.0 50.3L52.0 50.3Q53.2 49.4 53.8 49.4Q54.3 49.4 54.8 49.6Q55.3 49.8 55.3 50.5L55.3 50.5Q55.3 50.8 54.5 52.4L54.5 52.4Q51.9 57.4 51.9 57.9Q51.9 58.5 52.4 58.5L52.4 58.5Q53.1 58.5 54.4 57.2L54.4 57.2Q55.5 56.2 55.7 56.0L55.7 56.0Q55.9 55.9 56.0 55.9L56.0 55.9Q56.3 55.9 56.3 56.1M68.7 50.3L68.7 50.3L68.6 49.7Q68.6 49.2 68.9 48.9Q69.3 48.6 69.9 48.6L69.9 48.6Q70.9 48.6 70.9 49.9L70.9 49.9Q70.9 50.9 70.0 52.7Q69.0 54.4 67.6 56.1Q66.3 57.7 64.8 58.9Q63.3 60.1 62.5 60.1Q61.7 60.1 61.4 59.7Q61.0 59.2 61.0 58.8Q61.0 58.4 61.1 58.1L61.1 58.1Q61.2 56.8 61.8 55.7L61.8 55.7Q60.4 57.5 58.8 58.9Q57.2 60.3 56.1 60.3L56.1 60.3Q55.6 60.3 55.3 60.0Q55.0 59.7 55.0 59.0Q55.0 58.2 55.9 56.2Q56.8 54.1 57.6 52.9L57.6 52.9Q57.3 53.1 57.1 53.1Q56.8 53.1 56.6 52.8Q56.3 52.6 56.3 52.4Q56.3 52.3 56.5 52.0Q56.7 51.8 58.0 50.7Q59.3 49.6 59.8 49.6Q60.2 49.6 60.7 49.8Q61.1 50.0 61.1 50.3Q61.1 50.6 59.3 54.0Q57.5 57.4 57.5 57.6L57.5 57.6Q57.5 57.7 57.5 57.7L57.5 57.7Q57.8 57.7 60.2 54.9Q62.7 52.2 64.1 50.4L64.1 50.4Q64.3 50.1 64.7 50.1L64.7 50.1L64.8 50.1L65.5 49.9Q65.6 49.9 65.8 50.1Q66.0 50.2 66.0 50.3Q66.0 50.4 65.5 51.2Q65.1 52.0 64.0 54.3Q63.0 56.6 63.0 57.6L63.0 57.6Q63.0 57.8 63.2 57.8L63.2 57.8Q63.6 57.8 65.2 56.0Q66.8 54.2 67.7 52.6Q68.7 51.0 68.7 50.3M79.8 50.1L79.8 50.1Q80.8 50.1 80.8 50.8L80.8 50.8Q80.8 51.1 80.6 51.3Q80.4 51.5 79.9 52.4Q79.3 53.4 78.7 54.8Q78.0 56.3 77.8 57.4L77.8 57.4Q77.8 57.5 77.8 57.7L77.8 57.7Q77.8 58.4 78.2 58.4Q78.5 58.4 79.1 58.1Q79.6 57.7 80.0 57.3Q80.4 56.9 80.8 56.4Q81.2 56.0 81.3 55.9Q81.4 55.9 81.5 55.9L81.5 55.9Q81.8 55.9 81.8 56.2Q81.9 56.6 81.9 57.0Q81.9 57.4 81.8 57.6L81.8 57.6Q81.4 58.3 80.2 59.3Q78.9 60.4 77.8 60.4Q76.8 60.4 76.3 59.7Q75.8 59.1 75.8 58.3Q75.8 57.6 76.1 57.0L76.1 57.0Q75.0 58.4 73.6 59.3Q72.2 60.3 71.4 60.3Q70.5 60.3 69.9 59.8L69.9 59.8Q69.2 59.1 69.2 58.0Q69.2 56.8 69.7 55.6Q70.3 54.4 71.1 53.5Q72.0 52.5 73.0 51.7L73.0 51.7Q75.1 50.0 76.9 50.0L76.9 50.0Q77.6 50.0 78.1 50.2Q78.5 50.5 78.6 50.8L78.6 50.8Q78.9 50.3 79.1 50.2Q79.4 50.1 79.8 50.1M78.1 51.5L78.1 51.5Q75.9 51.5 73.5 54.0L73.5 54.0Q72.7 54.9 72.0 56.1Q71.3 57.3 71.3 57.8Q71.3 58.2 71.5 58.2L71.5 58.2Q71.9 58.2 73.5 56.8Q75.2 55.4 75.7 54.7L75.7 54.7Q76.3 53.9 78.1 51.5M84.6 64.2L84.6 64.2Q84.5 64.3 84.2 64.8Q83.9 65.4 83.5 66.0Q83.1 66.6 82.6 67.2Q82.0 67.7 81.7 67.8Q81.3 67.8 81.2 67.8L81.2 67.8Q80.0 67.8 80.0 66.6L80.0 66.6Q80.0 65.2 81.5 63.3L81.5 63.3Q82.0 62.6 82.9 61.8Q83.7 61.0 83.8 60.9Q83.9 60.7 85.7 57.2L85.7 57.2Q84.5 58.6 83.4 59.4Q82.4 60.3 81.4 60.4L81.4 60.4L81.3 60.4Q80.8 60.4 80.3 60.1Q79.8 59.7 79.8 58.9L79.8 58.9Q79.8 57.7 80.5 56.5L80.5 56.5Q80.7 56.1 81.3 55.2Q81.8 54.2 82.3 53.3L82.3 53.3Q82.8 52.6 83.3 51.7Q83.8 50.7 84.0 50.3Q84.3 49.9 84.5 49.9Q84.8 49.9 85.1 50.2Q85.5 50.5 85.5 50.9Q85.5 51.3 83.8 54.4Q82.1 57.4 82.1 57.9L82.1 57.9Q82.1 58.0 82.2 58.0L82.2 58.0Q82.6 58.0 83.8 57.0Q85.0 56.0 86.4 54.5L86.4 54.5Q88.0 52.7 88.9 51.3L88.9 51.3Q89.0 51.1 89.1 51.0Q89.2 50.9 89.3 50.8Q89.4 50.6 89.5 50.5Q89.5 50.4 89.6 50.3Q89.7 50.2 89.8 50.1Q89.9 50.1 90.0 50.0L90.0 50.0Q90.1 49.9 90.3 49.9Q90.5 49.9 90.8 49.9Q91.2 50.0 91.3 50.1Q91.3 50.2 91.4 50.3L91.4 50.3Q91.5 50.4 91.5 50.5Q91.5 50.7 91.4 50.9Q91.3 51.1 90.2 52.9L90.2 52.9Q87.0 58.4 85.8 60.9L85.8 60.9Q87.8 59.2 91.3 56.0L91.3 56.0Q91.5 55.9 91.6 55.9L91.6 55.9Q92.0 55.9 92.0 57.1L92.0 57.1Q92.0 57.4 91.9 57.6L91.9 57.6Q88.0 60.5 84.6 64.2"};
const LOGO_MASCOT={SKY:'Blazers',YAK:'Warthogs',JBB:'Spartans',WVB:'Mountaineers',SDB:'Mariners',TEM:'Titans',NWY:'Scorpions',LCS:'Cougars',SWB:'Mustangs',EBC:'Outlaws',STW:'Cowboys',BAB:'Braves',BLV:'Bulldogs',ARB:'Rams',ELP:'Nomads',WBK:'Angels',BER:'Trojans',UBC:'Patriots',FBO:'Falcons',HAL:'Harvesters',ESB:'Explorers',SCB:'Tornados',AVY:'Eagles',BAY:'Bayhawks',CLE:'Crusaders',CAL:'Cavaliers',STT:'Giants',LHI:'Racers',WGT:'Pelicans',LIB:'Saints',SYR:'Lakers',PVB:'Colts'};
function shadeHex(h,a){h=(h||'#888').replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);let r=n>>16,g=n>>8&255,b=n&255;
  if(a<0){r*=1+a;g*=1+a;b*=1+a}else{r+=(255-r)*a;g+=(255-g)*a;b+=(255-b)*a}return '#'+[r,g,b].map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('')}
const LOGO_X={sh:shadeHex,lum:h=>lum(h),TP:LOGO_TP,D:'#0b1020',W:'#ffffff',sm:(P,closed)=>{const p=[];for(let i=0;i<P.length;i+=2)p.push([P[i],P[i+1]]);const n=p.length,g=i=>closed?p[(i+n)%n]:p[Math.max(0,Math.min(n-1,i))];let d='M'+p[0][0]+' '+p[0][1];const L=closed?n:n-1;for(let i=0;i<L;i++){const a=g(i-1),b0=g(i),c=g(i+1),e=g(i+2);d+=' C'+(b0[0]+(c[0]-a[0])/6).toFixed(1)+' '+(b0[1]+(c[1]-a[1])/6).toFixed(1)+' '+(c[0]-(e[0]-b0[0])/6).toFixed(1)+' '+(c[1]-(e[1]-b0[1])/6).toFixed(1)+' '+c[0]+' '+c[1]}return d+(closed?'Z':'')},icon:(n,a,b)=>'<g fill="'+a+'" stroke="'+a+'">'+(LOGO_ICONS[n]||'')+'</g>'};
const LOGO_ALT={"SKY":[["M24.3 44.2L24.3 44.2Q24.3 46.1 23.2 47.6Q22.2 49.1 20.4 50.1L20.4 50.1Q21.5 50.9 22.2 52.1Q22.9 53.2 22.9 54.6L22.9 54.6Q22.9 56.3 21.9 57.9Q20.9 59.5 19.2 60.8Q17.6 62.0 15.4 62.8Q13.3 63.6 11.1 63.6L11.1 63.6Q8.6 63.6 6.8 62.7Q5.0 61.8 4.0 60.1L4.0 60.1Q4.3 59.2 4.8 57.8Q5.3 56.4 6.0 54.9Q6.6 53.3 7.2 51.8Q7.8 50.3 8.4 49.1L8.4 49.1Q9.6 46.5 10.5 44.7Q11.4 43.0 12.2 42.0L12.2 42.0Q10.5 42.5 9.1 43.2Q7.7 43.8 7.1 44.5L7.1 44.5Q6.8 44.3 6.5 43.9Q6.2 43.5 5.9 43.1Q5.7 42.6 5.5 42.2Q5.3 41.7 5.3 41.3L5.3 41.3Q6.1 40.8 7.4 40.3Q8.7 39.7 10.2 39.4Q11.7 39.0 13.3 38.8Q14.9 38.6 16.4 38.6L16.4 38.6Q20.1 38.6 22.2 40.1Q24.3 41.5 24.3 44.2M12.5 51.6L12.5 51.6Q11.9 51.3 11.4 50.7L11.4 50.7Q10.7 52.3 10.1 53.8Q9.4 55.4 8.9 56.7Q8.4 58.0 8.1 58.9Q7.8 59.9 7.8 60.3L7.8 60.3Q8.2 60.6 8.8 60.7Q9.4 60.8 10.3 60.8L10.3 60.8Q12.4 60.8 14.3 60.2Q16.3 59.6 17.7 58.6Q19.2 57.6 20.0 56.3Q20.9 55.0 20.9 53.6L20.9 53.6Q20.9 51.5 19.1 50.7L19.1 50.7Q16.7 51.6 13.7 51.6L13.7 51.6Q13.3 51.6 13.0 51.6Q12.8 51.6 12.5 51.6M18.5 40.8L18.5 40.8Q17.8 40.8 17.1 40.9Q16.4 41.0 15.6 41.1L15.6 41.1Q15.7 41.3 15.8 41.4Q15.9 41.5 15.9 41.7L15.9 41.7Q15.6 42.1 15.2 42.8Q14.8 43.5 14.3 44.4Q13.9 45.4 13.3 46.5Q12.8 47.7 12.2 48.9L12.2 48.9Q12.7 48.8 13.5 48.7Q14.3 48.6 15.0 48.6L15.0 48.6Q15.4 48.6 15.8 48.6Q16.2 48.7 16.5 48.7L16.5 48.7Q18.0 48.5 19.2 48.0Q20.4 47.5 21.3 46.9Q22.2 46.3 22.6 45.5Q23.1 44.7 23.1 43.8L23.1 43.8Q23.1 42.3 21.9 41.6Q20.7 40.8 18.5 40.8M24.8 59.3L24.8 59.3Q24.8 57.9 25.4 55.4Q26.1 53.0 27.2 49.7L27.2 49.7Q29.2 44.5 30.8 41.0Q32.5 37.5 34.1 35.5L34.1 35.5Q34.5 35.6 35.1 35.8Q35.6 36.1 36.1 36.4Q36.6 36.7 37.1 37.0Q37.5 37.3 37.6 37.5L37.6 37.5Q35.2 40.3 33.4 43.6Q31.5 46.9 30.0 51.1L30.0 51.1Q28.7 54.8 28.0 57.7Q27.4 60.7 27.4 62.6L27.4 62.6Q27.4 63.1 27.4 63.3Q27.4 63.4 27.4 63.5L27.4 63.5Q27.0 63.4 26.6 63.3Q26.3 63.1 26.2 62.9L26.2 62.9Q26.2 62.8 25.9 62.5Q25.6 62.2 25.4 62.0L25.4 62.0Q25.1 61.8 24.9 61.0Q24.8 60.3 24.8 59.3M42.7 48.7L42.7 48.7Q43.0 48.7 43.4 48.8Q43.8 48.9 44.1 49.1Q44.5 49.3 44.7 49.5Q45.0 49.7 45.0 49.8L45.0 49.8Q44.3 51.1 43.8 52.4Q43.3 53.7 42.9 55.0Q42.5 56.2 42.3 57.2Q42.1 58.3 42.1 59.0L42.1 59.0Q42.1 59.9 42.3 60.5Q42.5 61.1 42.9 61.3L42.9 61.3Q42.6 61.6 42.0 61.7Q41.4 61.9 40.9 61.9L40.9 61.9Q39.3 61.9 39.3 59.6L39.3 59.6Q39.3 57.8 40.4 54.7L40.4 54.7Q39.8 56.2 39.0 57.4Q38.2 58.7 37.4 59.6Q36.5 60.6 35.7 61.2Q34.8 61.8 34.1 61.9L34.1 61.9Q33.0 61.9 32.3 60.8Q31.5 59.8 31.5 58.2L31.5 58.2Q31.5 56.4 32.3 54.5Q33.0 52.6 34.2 51.0Q35.3 49.3 36.7 48.2Q38.1 47.1 39.3 47.1L39.3 47.1Q39.7 47.2 40.0 47.4Q40.4 47.7 40.8 48.1Q41.1 48.5 41.4 48.8Q41.6 49.2 41.7 49.5L41.7 49.5Q40.4 49.7 39.1 50.7Q37.8 51.7 36.7 53.2Q35.7 54.6 35.0 56.3Q34.3 57.9 34.3 59.3L34.3 59.3Q34.3 59.9 34.7 60.1L34.7 60.1Q35.6 59.9 36.8 58.5Q38.0 57.2 39.7 54.4L39.7 54.4Q40.0 53.8 40.4 53.1Q40.7 52.4 41.1 51.7Q41.5 51.0 41.9 50.2Q42.3 49.4 42.7 48.7M45.3 60.8L45.3 60.8Q45.3 60.3 46.2 59.2Q47.0 58.1 48.5 56.7Q49.9 55.3 51.8 53.7Q53.7 52.2 55.7 50.7L55.7 50.7Q54.4 50.4 53.6 50.3Q52.8 50.2 52.4 50.2L52.4 50.2Q51.5 50.2 50.8 50.4Q50.1 50.7 49.4 51.2L49.4 51.2Q48.0 50.0 48.0 48.4L48.0 48.4Q48.0 47.9 48.0 47.8L48.0 47.8Q48.5 47.3 49.2 47.0Q50.0 46.7 50.8 46.7L50.8 46.7Q51.6 46.7 52.5 47.0Q53.4 47.3 54.3 47.6Q55.2 47.9 55.9 48.2Q56.7 48.5 57.3 48.5L57.3 48.5Q57.6 48.5 58.0 48.4Q58.5 48.3 58.7 48.1L58.7 48.1Q59.0 48.4 59.2 49.0Q59.5 49.7 59.5 50.3L59.5 50.3Q58.5 50.7 57.2 51.6Q55.8 52.5 54.4 53.7Q53.0 54.9 51.7 56.3Q50.4 57.7 49.5 58.9L49.5 58.9Q50.2 59.1 51.3 59.1L51.3 59.1Q52.0 59.1 52.8 59.0Q53.5 58.9 54.2 58.7Q54.9 58.5 55.5 58.2Q56.1 57.9 56.5 57.5L56.5 57.5Q57.9 58.5 57.9 60.3L57.9 60.3Q57.9 60.5 57.9 60.7Q57.9 60.8 57.9 61.0L57.9 61.0Q56.4 61.9 54.8 61.9L54.8 61.9Q53.9 61.9 53.1 61.8Q52.3 61.6 51.5 61.4Q50.7 61.2 50.0 61.0Q49.3 60.9 48.7 60.9L48.7 60.9Q47.2 60.9 46.3 62.3L46.3 62.3Q45.9 62.1 45.6 61.7Q45.4 61.3 45.3 60.8M71.9 48.4L71.9 48.4Q71.8 50.3 71.2 51.7Q70.7 53.1 69.6 54.1Q68.6 55.2 67.1 56.0Q65.6 56.8 63.6 57.6L63.6 57.6Q63.6 57.8 63.6 58.0Q63.6 58.2 63.6 58.4L63.6 58.4Q63.6 58.8 63.7 59.3Q63.7 59.7 63.9 60.1Q64.0 60.4 64.3 60.7Q64.6 60.9 65.0 60.9L65.0 60.9Q65.9 60.9 66.7 60.5Q67.5 60.2 68.2 59.6Q68.9 59.1 69.6 58.4Q70.2 57.8 70.7 57.3L70.7 57.3Q71.0 57.6 71.2 57.8L71.2 57.8Q69.8 59.7 68.2 60.9Q66.5 62.1 65.0 62.5L65.0 62.5Q62.9 62.2 61.7 60.9Q60.5 59.6 60.5 57.7L60.5 57.7Q60.5 56.4 60.9 55.1Q61.2 53.8 61.8 52.6Q62.5 51.4 63.3 50.3Q64.2 49.2 65.2 48.4Q66.1 47.6 67.2 47.1Q68.2 46.7 69.2 46.7L69.2 46.7Q70.7 46.8 71.9 48.4M69.8 49.4L69.8 49.4Q68.9 49.6 68.0 50.1Q67.1 50.7 66.3 51.6Q65.6 52.5 64.9 53.8Q64.2 55.0 63.9 56.4L63.9 56.4Q66.4 55.2 68.0 53.4Q69.6 51.6 69.8 49.4M72.6 60.6L72.6 60.6Q72.7 59.7 73.1 58.3Q73.5 56.8 74.0 55.1Q74.6 53.5 75.2 51.8Q75.7 50.1 76.3 48.8L76.3 48.8Q76.7 47.8 77.0 47.3Q77.3 46.7 77.7 46.4L77.7 46.4Q78.1 46.4 78.6 46.6Q79.1 46.7 79.5 47.0Q79.9 47.2 80.3 47.4Q80.6 47.6 80.8 47.9L80.8 47.9Q80.0 48.9 79.3 50.1Q78.7 51.4 78.0 53.4L78.0 53.4Q79.7 51.9 81.0 50.5Q82.3 49.2 83.4 47.5L83.4 47.5Q83.6 47.3 84.0 47.3L84.0 47.3Q84.5 47.3 84.9 47.5Q85.3 47.6 85.4 47.9L85.4 47.9Q84.9 49.3 84.9 50.8L84.9 50.8Q84.9 52.2 85.3 52.8L85.3 52.8Q85.3 53.0 84.9 53.6Q84.5 54.1 84.0 54.6L84.0 54.6Q83.2 54.1 82.5 53.4Q81.9 52.6 81.6 51.7L81.6 51.7Q80.1 52.7 79.1 53.7Q78.1 54.7 77.3 55.9Q76.6 57.1 76.1 58.6Q75.6 60.2 75.1 62.3L75.1 62.3Q74.8 62.3 74.5 62.1Q74.1 61.9 73.7 61.7Q73.3 61.4 73.0 61.2Q72.7 60.9 72.6 60.6M96.0 48.9L96.0 48.9Q96.0 49.5 95.8 50.1Q95.6 50.8 95.4 51.3Q95.1 51.8 94.9 52.1Q94.6 52.5 94.3 52.5L94.3 52.5Q94.0 52.4 93.9 52.0L93.9 52.0Q93.9 51.9 94.0 51.7Q94.1 51.5 94.2 51.3Q94.3 51.0 94.3 50.8Q94.4 50.5 94.4 50.3L94.4 50.3Q94.4 49.9 94.2 49.6Q94.0 49.3 93.7 49.3L93.7 49.3Q92.4 49.3 91.8 50.9Q91.1 52.4 91.1 55.4L91.1 55.4Q91.1 55.7 91.2 55.8L91.2 55.8Q91.8 55.8 92.3 55.7Q92.8 55.7 93.3 55.7L93.3 55.7Q93.4 55.8 93.4 56.0L93.4 56.0Q93.4 56.3 93.2 56.4L93.2 56.4Q92.5 56.5 92.1 56.6Q91.7 56.8 91.5 56.8Q91.3 56.9 91.2 57.0Q91.2 57.2 91.2 57.3L91.2 57.3Q91.2 57.6 91.2 57.8Q91.2 58.1 91.2 58.5L91.2 58.5Q91.2 61.1 89.8 62.6Q88.4 64.2 85.9 64.5L85.9 64.5Q85.4 64.4 85.0 64.2Q84.5 64.0 84.1 63.7Q83.7 63.3 83.4 62.9Q83.1 62.5 82.9 62.0L82.9 62.0Q82.9 60.9 83.4 59.8Q83.9 58.7 84.8 57.9Q85.6 57.1 86.8 56.6Q87.9 56.1 89.3 56.0L89.3 56.0Q89.3 55.2 89.2 54.5Q89.0 53.7 88.8 53.0Q88.7 52.3 88.5 51.7Q88.3 51.0 88.3 50.3L88.3 50.3Q88.3 49.5 88.7 48.7Q89.0 47.9 89.6 47.2Q90.1 46.5 90.9 46.0Q91.6 45.5 92.4 45.3L92.4 45.3Q92.8 45.4 93.4 45.8Q93.9 46.3 94.5 46.8Q95.0 47.4 95.5 48.0Q95.9 48.5 96.0 48.9M85.8 63.0L85.8 63.0Q86.5 62.7 87.2 62.1Q87.9 61.6 88.3 60.8Q88.8 60.1 89.1 59.2Q89.4 58.4 89.4 57.6L89.4 57.6Q88.8 57.7 88.1 58.2Q87.3 58.6 86.7 59.3Q86.0 60.0 85.6 60.7Q85.2 61.4 85.2 61.9L85.2 61.9Q85.2 62.6 85.8 63.0","m"],["M10 76 C36 70 66 70 92 64","u"]],"YAK":[["M40.0 30.8L40.0 19.1L62.0 19.1L62.0 30.8L59.1 30.8L45.3 55.7L45.3 63.2L48.9 63.2L48.9 74.9L21.6 74.9L21.6 63.2L25.2 63.2L25.2 55.7L10.9 30.8L8.0 30.8L8.0 19.1L35.8 19.1L35.8 30.8L33.3 30.8L37.5 42.0L38.2 42.0L42.5 30.8L40.0 30.8","m"],["M40.0 86.2L40.0 74.7L43.5 74.7L43.5 43.3L40.0 43.3L40.0 31.8L72.1 31.8Q80.9 31.8 85.8 35.3Q90.7 38.9 90.7 45.6L90.7 45.6Q90.7 49.7 88.7 52.5Q86.8 55.4 84.1 56.8Q81.5 58.2 79.1 58.7L79.1 58.7L79.1 59.4Q84.0 59.9 88.0 62.6Q92.0 65.2 92.0 72.1L92.0 72.1Q92.0 79.4 86.5 82.8Q80.9 86.2 72.1 86.2L72.1 86.2L40.0 86.2M63.1 54.7L66.9 54.7Q68.9 54.7 69.9 53.6Q70.9 52.6 70.9 50.3L70.9 50.3L70.9 47.7Q70.9 45.4 69.9 44.3Q68.9 43.3 66.9 43.3L66.9 43.3L63.1 43.3L63.1 54.7M63.1 74.7L67.4 74.7Q69.4 74.7 70.4 73.7Q71.4 72.6 71.4 70.3L71.4 70.3L71.4 67.2Q71.4 64.9 70.4 63.8Q69.4 62.7 67.4 62.7L67.4 62.7L63.1 62.7L63.1 74.7","a"]],"JBB":[["M39.8 4.0L57.8 4.0L62.7 4.0L62.7 4.6L61.9 4.6Q60.3 4.6 59.1 5.8Q57.9 7.0 57.8 8.7L57.8 8.7L57.8 45.5Q57.8 49.6 56.1 52.8Q54.4 55.9 51.4 58.1Q48.5 60.2 44.8 61.1Q41.2 62.0 37.3 61.5L37.3 61.5L37.3 60.9Q40.3 59.5 42.0 57.0Q43.6 54.5 44.2 51.5Q44.7 48.4 44.7 45.3L44.7 45.3L44.7 8.7Q44.7 7.0 43.5 5.8Q42.3 4.6 40.6 4.6L40.6 4.6L39.8 4.6L39.8 4.0","m"],["M8.2 71.0L8.2 71.0Q8.5 71.0 9.2 71.1Q9.8 71.1 10.4 71.1L10.4 71.1Q10.7 71.2 10.9 71.2L10.9 71.2L12.3 71.2L12.2 71.5L12.2 71.5L11.9 73.9L11.8 73.9Q11.8 73.0 11.0 72.4Q10.3 71.9 9.1 71.9L9.1 71.9Q8.1 71.9 7.5 72.3Q6.9 72.6 6.8 73.3L6.8 73.3Q6.8 73.9 7.3 74.2Q7.7 74.5 8.3 74.8L8.3 74.8L11.4 76.3Q12.4 76.7 12.9 77.5Q13.4 78.3 13.3 79.5L13.3 79.5Q13.2 81.3 11.9 82.2Q10.5 83.1 8.1 83.1L8.1 83.1Q7.2 83.1 6.4 83.0Q5.6 82.8 5.0 82.6Q4.5 82.4 4.2 82.1L4.2 82.1Q4.0 81.6 4.0 81.0Q4.1 80.4 4.3 79.9Q4.4 79.3 4.7 78.9L4.7 78.9L4.9 78.9Q4.8 79.8 5.2 80.6Q5.6 81.3 6.5 81.8Q7.3 82.3 8.5 82.3L8.5 82.3Q9.7 82.3 10.2 81.8Q10.8 81.3 10.8 80.7L10.8 80.7Q10.8 80.1 10.4 79.7Q10.0 79.3 9.1 78.8L9.1 78.8L6.3 77.6Q5.2 77.0 4.7 76.1Q4.1 75.2 4.3 74.0L4.3 74.0Q4.4 73.0 4.9 72.4Q5.4 71.7 6.2 71.4Q7.1 71.0 8.2 71.0M15.7 81.7L15.7 81.7L15.7 72.5Q15.7 72.0 15.4 71.7Q15.1 71.4 14.6 71.4L14.6 71.4L14.4 71.4L14.4 71.3L20.8 71.3Q22.4 71.3 23.4 71.7Q24.4 72.1 24.9 72.9Q25.3 73.6 25.4 74.4L25.4 74.4Q25.4 75.4 25.1 76.1Q24.8 76.9 24.2 77.3Q23.6 77.8 22.8 78.1Q22.1 78.3 21.3 78.1Q20.5 78.0 19.7 77.4L19.7 77.4L19.7 77.3L19.9 77.2Q20.0 77.2 20.3 77.1Q20.5 77.0 20.8 76.8Q21.0 76.6 21.3 76.2Q21.5 75.9 21.7 75.3L21.7 75.3Q21.7 75.1 21.8 74.8Q21.8 74.5 21.8 74.3L21.8 74.3Q21.7 73.3 21.2 72.7Q20.7 72.1 19.7 72.1L19.7 72.1L19.1 72.1L19.1 81.7Q19.1 82.1 19.4 82.4Q19.8 82.7 20.2 82.7L20.2 82.7L20.4 82.7L20.4 82.9L14.4 82.9L14.4 82.7L14.6 82.7Q15.1 82.7 15.4 82.4Q15.7 82.1 15.7 81.7M30.2 70.9L30.4 70.9L35.7 81.9Q35.9 82.3 36.3 82.5L36.3 82.5Q36.7 82.7 37.0 82.7L37.0 82.7L37.2 82.7L37.2 82.9L30.9 82.9L30.9 82.7L31.0 82.7Q31.3 82.7 31.6 82.5Q31.9 82.2 31.6 81.7L31.6 81.7L31.7 81.7L31.0 80.1L27.5 80.1L26.8 81.7L26.8 81.7Q26.6 82.0 26.7 82.3Q26.8 82.5 27.0 82.6Q27.2 82.7 27.4 82.7L27.4 82.7L27.6 82.7L27.6 82.9L23.9 82.9L23.9 82.7L24.0 82.7Q24.4 82.7 24.8 82.5L24.8 82.5Q25.1 82.3 25.4 81.9L25.4 81.9L29.3 73.3Q29.3 73.2 29.5 72.9Q29.6 72.5 29.8 72.2Q29.9 71.8 30.1 71.4Q30.2 71.1 30.2 70.9L30.2 70.9M30.7 79.3L29.3 76.0L27.8 79.3L30.7 79.3M38.4 81.7L38.4 81.7L38.4 72.5Q38.3 72.0 38.0 71.7Q37.7 71.4 37.3 71.4L37.3 71.4L37.1 71.4L37.1 71.3L43.6 71.3Q44.3 71.3 45.1 71.4Q45.9 71.5 46.5 71.9Q47.2 72.2 47.6 72.8Q48.0 73.4 48.0 74.4L48.0 74.4Q48.0 75.0 47.8 75.7Q47.5 76.4 47.0 76.9Q46.4 77.4 45.3 77.6L45.3 77.6Q46.0 77.8 46.5 78.2Q47.1 78.7 47.4 79.2L47.4 79.2Q47.4 79.3 47.5 79.5Q47.7 79.7 47.9 80.1Q48.1 80.4 48.3 80.8Q48.5 81.2 48.8 81.5L48.8 81.5Q49.2 82.0 49.4 82.3Q49.7 82.5 50.0 82.6Q50.3 82.7 50.7 82.7L50.7 82.7L50.7 82.9L48.6 82.9Q47.6 82.9 46.8 82.8Q45.9 82.7 45.3 82.3Q44.6 81.9 44.1 81.0L44.1 81.0Q43.9 80.7 43.8 80.4Q43.7 80.1 43.6 79.8Q43.5 79.5 43.4 79.3Q43.4 79.0 43.3 78.8Q43.3 78.5 43.2 78.3L43.2 78.3Q43.0 77.7 42.8 77.5Q42.6 77.3 42.3 77.2L42.3 77.2L42.3 77.0L42.6 77.0Q43.1 77.0 43.4 76.8Q43.8 76.6 44.1 76.2Q44.3 75.7 44.4 75.0L44.4 75.0Q44.4 74.9 44.4 74.7Q44.4 74.6 44.4 74.3L44.4 74.3Q44.4 73.1 43.8 72.6Q43.3 72.1 42.5 72.1L42.5 72.1L41.8 72.1L41.8 81.7Q41.8 82.1 42.1 82.4Q42.4 82.7 42.9 82.7L42.9 82.7L43.1 82.7L43.1 82.9L37.1 82.9L37.1 82.7L37.3 82.7Q37.7 82.7 38.0 82.4Q38.3 82.1 38.4 81.7M60.7 70.9L60.7 70.9L60.7 74.4L60.6 74.4L60.6 74.2Q60.6 73.2 60.0 72.7Q59.4 72.1 58.4 72.1L58.4 72.1L56.8 72.1L56.8 81.7Q56.8 82.1 57.1 82.4Q57.4 82.7 57.9 82.7L57.9 82.7L58.1 82.7L58.1 82.9L52.1 82.9L52.1 82.7L52.3 82.7Q52.8 82.7 53.1 82.4Q53.4 82.1 53.4 81.7L53.4 81.7L53.4 72.1L51.8 72.1Q50.7 72.1 50.2 72.7Q49.6 73.2 49.6 74.2L49.6 74.2L49.6 74.4L49.4 74.4L49.4 70.9Q49.6 71.0 50.0 71.1Q50.3 71.1 50.7 71.2Q51.1 71.2 51.5 71.2L51.5 71.2L58.7 71.2Q59.1 71.2 59.5 71.2Q59.9 71.1 60.2 71.1Q60.6 71.0 60.7 70.9M64.9 70.9L65.1 70.9L70.4 81.9Q70.6 82.3 70.9 82.5L70.9 82.5Q71.3 82.7 71.7 82.7L71.7 82.7L71.9 82.7L71.9 82.9L65.6 82.9L65.6 82.7L65.7 82.7Q66.0 82.7 66.3 82.5Q66.6 82.2 66.3 81.7L66.3 81.7L66.4 81.7L65.7 80.1L62.2 80.1L61.5 81.7L61.5 81.7Q61.3 82.0 61.4 82.3Q61.5 82.5 61.7 82.6Q61.9 82.7 62.1 82.7L62.1 82.7L62.3 82.7L62.3 82.9L58.6 82.9L58.6 82.7L58.7 82.7Q59.1 82.7 59.5 82.5L59.5 82.5Q59.8 82.3 60.1 81.9L60.1 81.9L64.0 73.3Q64.0 73.2 64.2 72.9Q64.3 72.5 64.5 72.2Q64.6 71.8 64.8 71.4Q64.9 71.1 64.9 70.9L64.9 70.9M65.4 79.3L64.0 76.0L62.5 79.3L65.4 79.3M72.6 71.0L72.8 71.0L80.8 78.1L80.8 72.4Q80.8 72.0 80.5 71.7Q80.2 71.4 79.7 71.4L79.7 71.4L79.4 71.4L79.4 71.3L85.5 71.3L85.5 71.4L85.2 71.4Q84.8 71.4 84.5 71.7Q84.2 72.0 84.2 72.4L84.2 72.4L84.2 81.0Q84.2 81.7 84.2 82.2Q84.3 82.7 84.4 82.9L84.4 82.9L84.4 83.1L84.3 83.1L76.3 76.1L76.3 81.7L76.3 81.7Q76.3 82.1 76.6 82.4Q76.9 82.7 77.3 82.7L77.3 82.7L77.6 82.7L77.6 82.9L71.5 82.9L71.5 82.7L71.8 82.7Q72.3 82.7 72.6 82.4Q72.9 82.1 72.9 81.7L72.9 81.7L72.9 73.1Q72.9 72.1 72.8 71.6L72.8 71.6L72.6 71.0M90.7 71.0L90.7 71.0Q91.1 71.0 91.7 71.1Q92.3 71.1 93.0 71.1L93.0 71.1Q93.2 71.2 93.5 71.2L93.5 71.2L94.9 71.2L94.8 71.5L94.8 71.5L94.5 73.9L94.3 73.9Q94.3 73.0 93.6 72.4Q92.9 71.9 91.7 71.9L91.7 71.9Q90.7 71.9 90.1 72.3Q89.5 72.6 89.4 73.3L89.4 73.3Q89.4 73.9 89.8 74.2Q90.3 74.5 90.9 74.8L90.9 74.8L94.0 76.3Q94.9 76.7 95.5 77.5Q96.0 78.3 95.9 79.5L95.9 79.5Q95.8 81.3 94.4 82.2Q93.1 83.1 90.7 83.1L90.7 83.1Q89.7 83.1 88.9 83.0Q88.2 82.8 87.6 82.6Q87.1 82.4 86.8 82.1L86.8 82.1Q86.6 81.6 86.6 81.0Q86.6 80.4 86.8 79.9Q87.0 79.3 87.3 78.9L87.3 78.9L87.4 78.9Q87.4 79.8 87.8 80.6Q88.2 81.3 89.0 81.8Q89.9 82.3 91.0 82.3L91.0 82.3Q92.2 82.3 92.8 81.8Q93.4 81.3 93.4 80.7L93.4 80.7Q93.4 80.1 93.0 79.7Q92.6 79.3 91.6 78.8L91.6 78.8L88.9 77.6Q87.8 77.0 87.2 76.1Q86.7 75.2 86.9 74.0L86.9 74.0Q87.0 73.0 87.5 72.4Q88.0 71.7 88.8 71.4Q89.6 71.0 90.7 71.0","a"]],"WVB":[["M11.7 46.0L8.0 10.0L13.5 10.0L16.0 37.7L16.1 37.7L18.8 10.0L24.9 10.0L27.6 37.7L27.7 37.7L30.2 10.0L35.1 10.0L31.5 46.0L24.4 46.0L21.9 21.7L21.8 21.7L19.2 46.0L11.7 46.0M38.0 46.0L38.0 10.0L53.5 10.0L53.5 15.1L43.7 15.1L43.7 24.7L51.5 24.7L51.5 29.8L43.7 29.8L43.7 40.9L53.5 40.9L53.5 46.0L38.0 46.0M64.2 46.5Q60.1 46.5 58.0 44.2Q55.8 41.9 55.8 37.5L55.8 37.5L55.8 35.4L61.2 35.4L61.2 37.9Q61.2 41.4 64.1 41.4L64.1 41.4Q65.6 41.4 66.3 40.5Q67.1 39.7 67.1 37.8L67.1 37.8Q67.1 35.5 66.0 33.8Q65.0 32.1 62.2 29.6L62.2 29.6Q58.7 26.6 57.3 24.1Q55.9 21.6 55.9 18.4L55.9 18.4Q55.9 14.1 58.1 11.8Q60.3 9.5 64.4 9.5L64.4 9.5Q68.5 9.5 70.5 11.8Q72.6 14.1 72.6 18.5L72.6 18.5L72.6 20.0L67.3 20.0L67.3 18.2Q67.3 16.3 66.6 15.5Q65.8 14.6 64.4 14.6L64.4 14.6Q61.6 14.6 61.6 18.1L61.6 18.1Q61.6 20.0 62.7 21.7Q63.7 23.4 66.5 25.8L66.5 25.8Q70.1 28.9 71.4 31.5Q72.7 34.0 72.7 37.4L72.7 37.4Q72.7 41.8 70.5 44.2Q68.4 46.5 64.2 46.5L64.2 46.5M80.4 46.0L80.4 15.1L74.5 15.1L74.5 10.0L92.0 10.0L92.0 15.1L86.1 15.1L86.1 46.0L80.4 46.0","m"],["M12.1 85.5L8.0 58.5L12.3 58.5L15.1 79.4L15.1 79.4L17.9 58.5L21.8 58.5L17.7 85.5L12.1 85.5M21.6 85.5L26.0 58.5L31.8 58.5L36.2 85.5L31.9 85.5L31.2 80.1L31.2 80.2L26.3 80.2L25.6 85.5L21.6 85.5M26.9 76.5L30.7 76.5L28.8 63.2L28.7 63.2L26.9 76.5M38.2 85.5L38.2 58.5L42.5 58.5L42.5 81.6L49.4 81.6L49.4 85.5L38.2 85.5M51.5 85.5L51.5 58.5L55.7 58.5L55.7 81.6L62.7 81.6L62.7 85.5L51.5 85.5M64.7 85.5L64.7 58.5L76.3 58.5L76.3 62.4L69.0 62.4L69.0 69.5L74.8 69.5L74.8 73.3L69.0 73.3L69.0 81.6L76.3 81.6L76.3 85.5L64.7 85.5M82.6 85.5L82.6 74.0L77.5 58.5L82.0 58.5L84.9 68.4L85.0 68.4L87.9 58.5L92.0 58.5L86.9 74.0L86.9 85.5L82.6 85.5","a"]],"SDB":[["M4.0 57.6L10.5 39.9Q8.6 40.5 7.5 42.0Q6.4 43.5 6.4 45.7L6.4 45.7Q6.4 46.7 6.6 47.0Q6.8 47.4 6.8 47.5L6.8 47.5Q4.1 47.5 4.1 45.1L4.1 45.1Q4.1 43.5 5.3 41.9Q6.5 40.3 8.4 39.3Q10.3 38.3 12.2 38.3L12.2 38.3Q13.2 38.3 14.2 38.6L14.2 38.6L13.6 52.2L19.2 38.6L23.0 38.6L20.3 57.6L16.5 57.6L18.2 46.0L13.4 57.6L9.8 57.6L10.4 46.0L6.1 57.6L4.0 57.6M25.6 57.7Q24.1 57.7 23.2 56.7Q22.2 55.7 22.2 53.6L22.2 53.6Q22.2 51.7 22.9 49.6Q23.7 47.5 25.2 46.0Q26.7 44.6 28.8 44.6L28.8 44.6Q29.8 44.6 30.4 44.9Q30.9 45.3 30.9 45.9L30.9 45.9L30.9 46.1L31.2 44.7L34.9 44.7L33.0 53.5Q32.9 53.8 32.9 54.3L32.9 54.3Q32.9 55.4 34.0 55.4L34.0 55.4Q34.7 55.4 35.2 54.7Q35.7 54.0 36.0 53.0L36.0 53.0L37.1 53.0Q36.2 55.7 34.8 56.7Q33.4 57.7 31.9 57.7L31.9 57.7Q30.9 57.7 30.2 57.1Q29.6 56.5 29.4 55.4L29.4 55.4Q28.7 56.4 27.8 57.1Q26.9 57.7 25.6 57.7L25.6 57.7M27.3 55.2Q27.9 55.2 28.5 54.6Q29.2 54.0 29.4 53.0L29.4 53.0L30.6 47.2Q30.6 46.8 30.4 46.5Q30.1 46.2 29.6 46.2L29.6 46.2Q28.6 46.2 27.7 47.4Q26.9 48.6 26.4 50.2Q26.0 51.9 26.0 53.2L26.0 53.2Q26.0 54.5 26.4 54.9Q26.7 55.2 27.3 55.2L27.3 55.2M35.1 57.6L37.8 44.7L41.5 44.7L41.2 46.3Q42.0 45.5 42.7 45.1Q43.4 44.7 44.3 44.7L44.3 44.7Q45.1 44.7 45.6 45.3Q46.0 45.8 46.0 46.6L46.0 46.6Q46.0 47.4 45.6 47.9Q45.1 48.5 44.2 48.5L44.2 48.5Q43.6 48.5 43.4 48.2Q43.2 48.0 43.1 47.5L43.1 47.5Q43.1 47.1 43.0 47.0Q42.9 46.8 42.7 46.8L42.7 46.8Q42.2 46.8 41.8 47.0Q41.4 47.3 40.8 47.8L40.8 47.8L38.8 57.6L35.1 57.6M50.0 43.3Q49.2 43.3 48.6 42.7Q48.0 42.1 48.0 41.3L48.0 41.3Q48.0 40.4 48.6 39.8Q49.2 39.2 50.0 39.2L50.0 39.2Q50.8 39.2 51.5 39.8Q52.1 40.4 52.1 41.3L52.1 41.3Q52.1 42.1 51.5 42.7Q50.8 43.3 50.0 43.3L50.0 43.3M48.3 57.7Q47.0 57.7 46.3 56.9Q45.5 56.2 45.5 54.6L45.5 54.6Q45.5 54.0 45.7 53.0L45.7 53.0L47.5 44.7L51.2 44.7L49.3 53.5Q49.2 53.8 49.2 54.3L49.2 54.3Q49.2 54.8 49.4 55.0Q49.7 55.2 50.3 55.2L50.3 55.2Q51.0 55.2 51.6 54.6Q52.3 54.0 52.6 53.0L52.6 53.0L53.7 53.0Q52.7 55.7 51.2 56.7Q49.7 57.7 48.3 57.7L48.3 57.7M61.9 57.7Q60.3 57.7 59.6 56.9Q58.8 56.0 58.8 54.8L58.8 54.8Q58.8 54.3 58.9 53.6Q59.1 52.9 59.2 52.3Q59.4 51.6 59.4 51.4L59.4 51.4Q59.6 50.5 59.8 49.7Q60.0 48.8 60.0 48.3L60.0 48.3Q60.0 46.9 59.1 46.9L59.1 46.9Q58.4 46.9 57.9 47.6Q57.4 48.3 57.0 49.3L57.0 49.3L55.3 57.6L51.6 57.6L54.3 44.7L58.0 44.7L57.7 46.0Q59.0 44.6 60.7 44.6L60.7 44.6Q62.1 44.6 62.8 45.3Q63.6 46.0 63.6 47.5L63.6 47.5Q63.6 48.3 63.4 49.2Q63.2 50.1 62.9 51.4L62.9 51.4Q62.7 52.2 62.5 52.9Q62.4 53.7 62.4 54.1L62.4 54.1Q62.4 54.7 62.6 54.9Q62.8 55.2 63.4 55.2L63.4 55.2Q64.2 55.2 64.6 54.7Q65.1 54.1 65.6 53.0L65.6 53.0L66.6 53.0Q65.7 55.8 64.4 56.8Q63.2 57.7 61.9 57.7L61.9 57.7M69.2 57.7Q67.3 57.7 66.3 56.7Q65.2 55.7 65.2 53.6L65.2 53.6Q65.2 51.9 65.9 49.7Q66.6 47.6 68.2 46.0Q69.7 44.5 72.2 44.5L72.2 44.5Q75.0 44.5 75.0 46.9L75.0 46.9Q75.0 48.4 74.2 49.6Q73.3 50.8 72.0 51.5Q70.6 52.3 69.1 52.4L69.1 52.4Q69.0 53.1 69.0 53.4L69.0 53.4Q69.0 54.7 69.5 55.1Q69.9 55.6 70.9 55.6L70.9 55.6Q72.3 55.6 73.3 54.9Q74.2 54.3 75.4 53.0L75.4 53.0L76.3 53.0Q73.4 57.7 69.2 57.7L69.2 57.7M69.3 51.1Q70.2 51.1 71.1 50.5Q72.0 49.9 72.5 48.9Q73.0 47.9 73.0 46.9L73.0 46.9Q73.0 45.8 72.4 45.8L72.4 45.8Q71.4 45.8 70.6 47.5Q69.7 49.1 69.3 51.1L69.3 51.1M74.5 57.6L77.2 44.7L80.9 44.7L80.5 46.3Q81.4 45.5 82.1 45.1Q82.8 44.7 83.7 44.7L83.7 44.7Q84.5 44.7 85.0 45.3Q85.4 45.8 85.4 46.6L85.4 46.6Q85.4 47.4 84.9 47.9Q84.5 48.5 83.6 48.5L83.6 48.5Q83.0 48.5 82.8 48.2Q82.6 48.0 82.5 47.5L82.5 47.5Q82.4 47.1 82.4 47.0Q82.3 46.8 82.1 46.8L82.1 46.8Q81.5 46.8 81.2 47.0Q80.8 47.3 80.2 47.8L80.2 47.8L78.2 57.6L74.5 57.6M88.0 57.7Q86.8 57.7 85.9 57.2Q85.1 56.8 84.7 56.0Q84.3 55.3 84.3 54.4L84.3 54.4Q84.3 53.6 84.7 52.9Q85.1 52.3 85.6 52.0L85.6 52.0Q86.6 50.2 87.4 48.4Q88.1 46.6 88.8 44.4L88.8 44.4L92.6 43.9Q92.7 47.2 93.0 51.0L93.0 51.0Q93.2 52.6 93.2 53.3L93.2 53.3Q93.2 53.9 93.1 54.2L93.1 54.2Q94.3 53.6 94.9 53.0L94.9 53.0L96.0 53.0Q94.4 54.9 92.1 56.2L92.1 56.2Q91.3 57.0 90.2 57.3Q89.1 57.7 88.0 57.7L88.0 57.7M87.2 55.7Q88.2 55.7 88.8 55.1Q89.4 54.6 89.4 53.3L89.4 53.3Q89.4 52.5 89.3 51.1L89.3 51.1Q89.0 48.2 89.0 47.2L89.0 47.2Q88.3 49.2 86.9 52.1L86.9 52.1Q87.5 52.4 87.5 53.0L87.5 53.0Q87.5 53.5 87.1 53.8Q86.8 54.2 86.3 54.2L86.3 54.2Q85.8 54.2 85.6 53.9L85.6 53.9Q85.6 54.8 86.0 55.3Q86.4 55.7 87.2 55.7L87.2 55.7","m"],["M14 78 C40 72 64 72 90 66","u"]],"TEM":[["M18.9 41.3L18.9 46.7L15.0 46.7L15.0 44.9L13.6 44.9L13.6 55.1L15.2 55.1L15.2 58.7L5.7 58.7L5.7 55.1L7.3 55.1L7.3 44.9L5.9 44.9L5.9 46.7L2.0 46.7L2.0 41.3L18.9 41.3M28.2 58.7L19.7 58.7L19.7 55.1L20.8 55.1L20.8 44.9L19.7 44.9L19.7 41.3L28.2 41.3L28.2 44.9L27.1 44.9L27.1 55.1L28.2 55.1L28.2 58.7M45.9 41.3L45.9 46.7L42.0 46.7L42.0 44.9L40.6 44.9L40.6 55.1L42.2 55.1L42.2 58.7L32.7 58.7L32.7 55.1L34.3 55.1L34.3 44.9L32.8 44.9L32.8 46.7L29.0 46.7L29.0 41.3L45.9 41.3M56.9 41.3L60.7 55.1L61.6 55.1L61.6 58.7L52.8 58.7L52.8 55.1L54.1 55.1L53.8 53.3L50.7 53.3L50.3 55.1L51.7 55.1L51.7 58.7L44.0 58.7L44.0 55.1L44.9 55.1L48.7 41.3L56.9 41.3M52.1 46.4L51.2 50.9L53.3 50.9L52.3 46.4L52.1 46.4M75.2 44.9L75.2 41.3L82.6 41.3L82.6 44.9L81.5 44.9L81.5 58.7L75.2 58.7L68.6 48.6L68.6 55.1L69.7 55.1L69.7 58.7L62.3 58.7L62.3 55.1L63.4 55.1L63.4 44.9L62.3 44.9L62.3 41.3L70.4 41.3L76.3 50.3L76.3 44.9L75.2 44.9M90.4 59.1Q88.3 59.1 86.4 58.7Q84.4 58.3 83.4 57.8L83.4 57.8L83.4 53.4L88.4 53.4Q88.4 54.1 88.7 54.4Q89.0 54.7 89.8 54.7L89.8 54.7Q90.5 54.7 90.8 54.5Q91.1 54.3 91.1 53.9L91.1 53.9Q91.1 53.5 90.8 53.2Q90.5 53.0 89.8 52.7L89.8 52.7L87.9 52.0Q85.4 51.1 84.3 49.8Q83.2 48.5 83.2 46.4L83.2 46.4Q83.2 43.7 84.9 42.3Q86.7 40.9 90.8 40.9L90.8 40.9Q92.7 40.9 94.4 41.3Q96.2 41.7 97.2 42.4L97.2 42.4L97.2 46.4L92.7 46.4Q92.7 45.3 91.3 45.3L91.3 45.3Q90.6 45.3 90.4 45.4Q90.1 45.6 90.1 46.0L90.1 46.0Q90.1 46.4 90.4 46.7Q90.7 46.9 91.5 47.1L91.5 47.1L93.4 47.8Q95.8 48.6 96.9 49.9Q98.0 51.2 98.0 53.3L98.0 53.3Q98.0 56.1 96.1 57.6Q94.2 59.1 90.4 59.1L90.4 59.1","m"]],"NWY":[["M19.7 25.9L19.7 73.0L25.6 73.0L25.6 79.7L6.0 79.7L6.0 73.0L11.9 73.0L11.9 23.0L6.0 23.0L6.0 16.3L23.6 16.3L48.3 70.2L48.3 23.0L42.4 23.0L42.4 16.3L62.0 16.3L62.0 23.0L56.1 23.0L56.1 79.7L44.4 79.7L19.7 25.9","m"],["M38.7 40.6L36.0 40.6L36.0 35.9L48.5 35.9L48.5 40.6L44.1 40.6L52.6 73.6L61.2 40.6L58.6 40.6L58.6 35.9L71.4 35.9L71.4 40.6L68.8 40.6L77.3 73.6L85.8 40.6L81.5 40.6L81.5 35.9L94.0 35.9L94.0 40.6L91.2 40.6L81.1 80.1L73.8 80.1L65.0 46.0L56.2 80.1L48.9 80.1L38.7 40.6","a"]],"LCS":[["M12.0 20.5L12.0 18.7L42.2 18.7L42.2 20.5L33.3 20.5L33.3 75.5L36.3 75.5Q43.4 75.5 47.7 71.1Q51.9 66.8 56.2 57.7L56.2 57.7L58.0 57.7L56.4 77.3L12.0 77.3L12.0 75.5L16.9 75.5L16.9 20.5L12.0 20.5","m"],["M68.6 24.9L68.6 24.9Q55.4 24.9 55.4 50.5L55.4 50.5L55.4 57.2Q55.4 69.3 58.9 76.2Q62.4 83.1 69.2 83.1L69.2 83.1Q78.6 83.1 86.5 64.8L86.5 64.8L88.0 64.8L87.4 83.8L86.5 83.8Q86.0 82.9 85.5 82.5Q85.1 82.1 84.3 82.1Q83.5 82.1 78.1 83.4Q72.7 84.8 67.2 84.8L67.2 84.8Q53.3 84.8 45.6 77.3Q38.0 69.7 38.0 54.7Q38.0 39.6 46.0 31.4Q54.0 23.2 67.4 23.2L67.4 23.2Q72.6 23.2 77.6 24.6Q82.6 25.9 83.5 25.9Q84.3 25.9 84.8 25.5Q85.2 25.1 85.7 24.2L85.7 24.2L86.6 24.2L87.3 42.7L85.8 42.7Q81.9 34.1 77.9 29.5Q73.8 24.9 68.6 24.9","a"]],"SWB":[["M26.8 48.8L26.8 48.8L26.9 49.3Q26.9 49.6 26.6 50.1L26.6 50.1Q25.8 51.2 23.9 52.6Q22.0 54.1 21.1 54.1Q20.2 54.1 19.7 53.5Q19.2 53.0 19.2 52.3L19.2 52.3Q19.2 51.5 20.9 48.8L20.9 48.8Q23.4 44.7 27.3 39.3L27.3 39.3Q26.5 40.1 22.9 43.9L22.9 43.9Q15.0 52.2 13.7 53.3L13.7 53.3Q13.5 53.4 13.1 53.4Q12.7 53.4 12.2 53.1Q11.7 52.8 11.7 52.3L11.7 52.3L11.7 52.3Q11.8 51.7 14.2 47.0Q16.7 42.2 18.3 39.4L18.3 39.4Q15.9 42.1 13.4 45.4L13.4 45.4Q8.6 51.6 6.4 56.1L6.4 56.1Q6.2 56.5 6.0 56.5Q5.7 56.5 5.1 56.3L5.1 56.3Q4.0 56.0 4.0 55.2L4.0 55.2Q4.0 54.8 5.9 51.9Q7.8 49.1 10.3 45.7Q12.8 42.3 15.5 39.1L15.5 39.1Q19.2 34.8 20.3 34.8L20.3 34.8Q20.4 34.8 20.6 34.9Q20.7 35.0 20.8 35.0Q20.8 35.0 20.9 34.9L20.9 34.9Q21.0 34.7 21.5 34.7Q22.0 34.7 22.5 34.9Q23.0 35.1 23.0 35.4L23.0 35.4Q23.0 35.5 21.7 37.8L21.7 37.8Q17.3 45.5 15.9 48.4L15.9 48.4Q17.3 46.6 19.9 43.8Q22.6 41.0 25.5 38.1L25.5 38.1Q29.2 34.5 30.0 34.5L30.0 34.5Q30.3 34.5 30.7 34.6L30.7 34.6Q31.5 34.8 32.3 34.8L32.3 34.8Q32.5 34.9 32.6 35.0Q32.8 35.1 32.8 35.3Q32.8 35.4 32.7 35.5L32.7 35.5Q28.5 41.1 25.6 45.4Q22.7 49.6 22.1 51.1L22.1 51.1Q23.4 50.8 26.1 47.9L26.1 47.9Q26.2 47.7 26.3 47.7Q26.3 47.6 26.4 47.6L26.4 47.6Q26.6 47.3 26.7 47.9L26.7 47.9Q26.8 48.2 26.8 48.4Q26.8 48.5 26.8 48.6Q26.8 48.8 26.8 48.8M38.4 49.5L38.4 49.5Q38.7 49.5 38.7 49.9Q38.8 50.3 38.8 50.7Q38.8 51.1 38.7 51.3L38.7 51.3Q38.3 52.0 37.1 53.0Q35.8 54.1 34.7 54.1L34.7 54.1Q34.0 54.1 33.4 53.6Q32.8 53.2 32.8 52.2Q32.8 51.1 33.3 50.1L33.3 50.1Q30.1 54.1 28.3 54.1L28.3 54.1Q27.6 54.1 27.1 53.6Q26.7 53.1 26.7 52.6Q26.7 52.0 26.9 51.4Q27.0 50.8 27.2 50.4Q27.4 49.9 27.7 49.2Q28.0 48.5 28.2 48.2Q28.4 47.9 28.7 47.3Q29.1 46.7 29.7 45.6Q30.3 44.5 30.7 44.0Q31.1 43.5 31.5 43.5Q31.9 43.5 32.1 43.8Q32.4 44.1 32.4 44.3Q32.4 44.5 31.6 46.1L31.6 46.1Q29.0 50.7 29.0 51.4L29.0 51.4Q29.0 51.6 29.1 51.6L29.1 51.6Q29.8 51.6 32.2 49.0Q34.7 46.3 35.1 45.5Q35.5 44.8 35.8 44.2Q36.2 43.7 36.4 43.6L36.4 43.6Q36.9 43.2 37.8 43.2L37.8 43.2Q38.0 43.2 38.0 43.2Q38.1 43.2 38.2 43.5Q38.3 43.7 38.3 43.8L38.3 43.8Q38.2 44.1 37.3 45.7Q36.4 47.3 36.3 47.5L36.3 47.5Q34.8 50.6 34.8 51.6L34.8 51.6Q34.8 52.1 35.2 52.1L35.2 52.1Q35.9 52.0 37.0 50.9L37.0 50.9Q37.4 50.5 37.8 50.1Q38.1 49.7 38.2 49.6Q38.3 49.5 38.4 49.5M39.4 51.0L39.4 51.0L39.4 51.2Q39.4 51.6 39.6 51.8Q39.9 52.0 40.1 52.0L40.1 52.0Q41.6 52.0 42.8 51.6Q44.0 51.1 44.0 50.6L44.0 50.6Q44.0 50.4 43.6 50.2Q43.1 50.1 42.1 49.8Q41.1 49.6 40.6 49.5Q40.2 49.3 39.9 49.2Q39.6 49.1 39.3 48.9L39.3 48.9Q38.7 48.5 38.7 47.6Q38.7 46.8 39.4 45.9Q40.0 45.1 40.9 44.5Q41.9 43.9 42.9 43.5L42.9 43.5Q45.1 42.6 46.6 42.6L46.6 42.6Q48.0 42.6 48.3 43.2L48.3 43.2Q48.4 43.4 48.4 43.7L48.4 43.7L48.4 43.8Q48.4 44.5 48.1 44.8Q47.8 45.2 47.2 45.5Q46.6 45.9 46.2 45.9Q45.9 45.9 45.8 45.8Q45.7 45.8 45.6 45.7Q45.5 45.6 45.4 45.5Q45.3 45.5 45.3 45.4Q45.3 45.2 45.5 45.0Q45.6 44.9 45.6 44.7L45.6 44.7Q44.8 44.7 43.9 45.1Q42.9 45.4 42.3 45.9Q41.6 46.3 41.2 46.7Q40.7 47.1 40.7 47.3Q40.7 47.5 41.3 47.6L41.3 47.6Q44.0 48.1 44.8 48.5Q45.7 48.9 46.0 49.4Q46.3 49.9 46.3 50.3L46.3 50.3Q46.3 51.1 45.7 51.9Q45.0 52.6 44.0 53.1L44.0 53.1Q42.0 54.1 40.4 54.1Q38.9 54.1 38.3 53.6Q37.7 53.1 37.7 52.5Q37.7 51.8 38.0 51.3Q38.4 50.8 38.9 50.8Q39.4 50.8 39.4 51.0M56.0 37.0L56.6 37.0L57.1 37.1Q57.2 37.1 57.3 37.2Q57.4 37.3 57.4 37.4Q57.4 37.5 57.1 38.0Q56.9 38.4 56.5 39.0Q56.1 39.6 56.1 39.6L56.1 39.6Q57.1 39.6 57.5 39.6Q57.9 39.6 58.1 39.6Q58.3 39.7 58.5 39.9Q58.7 40.2 58.8 40.3Q59.0 40.5 59.0 40.8Q59.0 41.0 58.7 41.2Q58.3 41.4 58.0 41.4L58.0 41.4Q55.0 41.7 54.6 41.7L54.6 41.7Q53.6 43.4 51.7 46.7Q49.8 50.1 49.7 51.0L49.7 51.0Q49.7 51.4 49.7 51.6L49.7 51.6Q49.7 52.1 50.2 52.1Q50.7 52.1 51.4 51.7Q52.0 51.3 52.6 50.8L52.6 50.8Q54.0 49.5 54.1 49.5L54.1 49.5Q54.5 49.5 54.5 50.7L54.5 50.7Q54.5 51.3 53.9 51.8L53.9 51.8Q52.6 53.0 51.7 53.5Q50.8 54.1 49.9 54.1L49.9 54.1Q49.7 54.1 49.5 54.1L49.5 54.1Q48.5 53.9 48.0 53.3Q47.5 52.7 47.5 51.8Q47.5 50.8 48.1 49.5Q48.7 48.1 49.5 46.6L49.5 46.6Q50.9 44.1 52.3 41.9L52.3 41.9L51.8 41.9Q50.3 42.1 50.1 42.1L50.1 42.1L50.0 42.1Q49.6 42.1 49.2 41.9Q48.9 41.8 48.9 41.6Q48.9 41.4 49.1 41.2Q49.3 40.9 49.3 40.8L49.3 40.8Q49.4 40.5 50.0 40.2Q50.6 39.9 50.9 39.8Q51.2 39.8 51.4 39.8Q51.7 39.8 52.1 39.8Q52.4 39.8 52.6 39.7L52.6 39.7L53.7 39.7Q54.8 38.1 55.2 37.6Q55.6 37.1 55.7 37.1Q55.8 37.0 56.0 37.0L56.0 37.0M63.2 43.8L63.2 43.8Q64.2 43.8 64.2 44.5L64.2 44.5Q64.2 44.8 64.0 45.0Q63.9 45.2 63.3 46.1Q62.8 47.1 62.1 48.5Q61.4 50.0 61.2 51.1L61.2 51.1Q61.2 51.2 61.2 51.4L61.2 51.4Q61.2 52.1 61.6 52.1Q62.0 52.1 62.5 51.8Q63.0 51.4 63.5 51.0Q63.9 50.6 64.3 50.1Q64.7 49.7 64.7 49.6Q64.8 49.5 65.0 49.5L65.0 49.5Q65.2 49.5 65.3 49.9Q65.3 50.3 65.3 50.7Q65.3 51.1 65.2 51.3L65.2 51.3Q64.9 52.0 63.6 53.0Q62.3 54.1 61.3 54.1Q60.2 54.1 59.8 53.4Q59.3 52.8 59.3 52.0Q59.3 51.3 59.5 50.7L59.5 50.7Q58.4 52.1 57.1 53.0Q55.7 54.0 54.8 54.0Q53.9 54.0 53.4 53.5L53.4 53.5Q52.6 52.8 52.6 51.6Q52.6 50.5 53.2 49.3Q53.7 48.1 54.5 47.1Q55.4 46.2 56.4 45.4L56.4 45.4Q58.6 43.7 60.4 43.7L60.4 43.7Q61.1 43.7 61.5 43.9Q61.9 44.2 62.1 44.5L62.1 44.5Q62.4 44.0 62.6 43.9Q62.8 43.8 63.2 43.8M61.5 45.2L61.5 45.2Q59.3 45.2 56.9 47.7L56.9 47.7Q56.1 48.6 55.4 49.8Q54.7 51.0 54.7 51.5Q54.7 51.9 54.9 51.9L54.9 51.9Q55.3 51.9 57.0 50.5Q58.6 49.1 59.2 48.4L59.2 48.4Q59.8 47.6 61.5 45.2M70.9 51.6L70.9 51.6Q70.9 52.2 71.7 52.2L71.7 52.2Q72.1 52.2 72.7 51.8Q73.3 51.4 73.8 50.9L73.8 50.9Q75.2 49.5 75.4 49.5L75.4 49.5Q75.7 49.5 75.7 50.5Q75.7 51.5 75.1 51.8L75.1 51.8Q73.2 53.5 72.2 53.9L72.2 53.9Q71.7 54.1 71.0 54.0Q70.3 54.0 69.6 53.4Q68.9 52.9 68.9 52.0Q68.9 51.2 69.4 50.1Q69.8 49.1 70.3 48.3Q70.7 47.6 71.4 46.6Q72.1 45.6 72.1 45.3L72.1 45.3L72.1 45.3Q71.7 45.3 70.0 47.0Q68.3 48.6 67.2 49.8Q66.1 51.0 64.6 53.1L64.6 53.1Q64.2 53.6 63.9 53.6Q63.6 53.6 63.2 53.5Q62.7 53.3 62.6 53.2Q62.5 53.1 62.5 53.0Q62.5 52.8 62.6 52.6Q62.7 52.4 62.8 52.2Q62.8 52.1 63.0 51.8Q63.2 51.4 63.8 50.4Q64.4 49.4 65.6 47.5Q66.7 45.5 67.0 45.1L67.0 45.1Q67.5 44.2 67.8 43.8L67.8 43.8Q68.4 43.1 69.7 43.1L69.7 43.1Q70.1 43.1 70.1 43.5L70.1 43.5Q70.1 44.1 68.9 45.8L68.9 45.8L68.4 46.6Q70.6 44.1 72.2 43.4L72.2 43.4Q72.9 43.1 73.5 43.1Q74.1 43.1 74.5 43.4Q74.8 43.8 74.8 44.1Q74.8 44.5 74.5 45.1Q74.3 45.6 74.0 46.1Q73.7 46.5 73.3 47.2Q72.8 47.8 72.8 47.9Q72.7 47.9 72.6 48.2Q72.4 48.4 72.3 48.6Q72.3 48.7 72.1 49.0Q71.9 49.3 71.8 49.4Q71.7 49.6 71.5 49.9Q71.4 50.2 71.3 50.4Q71.2 50.6 71.1 50.9L71.1 50.9Q70.9 51.3 70.9 51.6M78.5 45.0Q79.7 44.2 80.9 43.7Q82.1 43.2 83.0 43.2Q83.9 43.2 84.1 43.7L84.1 43.7Q84.6 43.2 85.4 43.1L85.4 43.1Q85.6 43.1 85.9 43.1Q86.3 43.1 86.3 43.2Q86.4 43.3 86.5 43.5Q86.5 43.7 86.6 43.8Q86.6 43.8 86.6 43.8Q86.6 43.9 86.5 44.0Q86.4 44.1 86.4 44.2Q86.3 44.2 86.3 44.2L86.3 44.2Q83.4 48.3 80.4 53.6L80.4 53.6Q83.5 50.9 85.9 49.7L85.9 49.7Q86.1 49.6 86.2 49.6L86.2 49.6Q86.4 49.6 86.5 49.9Q86.6 50.1 86.6 50.6Q86.6 51.1 86.5 51.2Q86.4 51.3 85.9 51.7Q85.4 52.0 84.5 52.6Q83.6 53.1 82.7 53.8L82.7 53.8Q80.3 55.4 78.8 57.2L78.8 57.2Q76.9 59.5 76.1 61.0L76.1 61.0Q75.8 61.5 75.0 61.5L75.0 61.5Q73.6 61.5 73.6 60.2L73.6 60.2Q73.6 58.7 74.9 57.3L74.9 57.3Q76.0 56.2 76.8 55.5Q77.7 54.8 77.8 54.7L77.8 54.7Q78.7 53.3 80.4 50.6L80.4 50.6Q79.0 52.1 77.7 52.9Q76.4 53.8 75.7 53.8L75.7 53.8Q73.7 53.8 73.7 52.1L73.7 52.1Q73.7 50.8 74.4 49.4Q75.1 48.0 76.2 47.0Q77.2 45.9 78.5 45.0M83.4 44.7L83.4 44.7Q81.9 45.0 80.6 45.8Q79.3 46.5 78.4 47.3Q77.6 48.2 77.0 49.1L77.0 49.1Q75.8 50.8 75.8 51.7L75.8 51.7Q75.8 51.9 75.9 51.9Q76.0 51.9 76.4 51.7Q76.8 51.4 77.5 50.9Q78.2 50.3 79.0 49.5L79.0 49.5Q81.0 47.7 83.4 44.7M87.0 51.0L87.0 51.0L86.9 51.2Q86.9 51.6 87.2 51.8Q87.4 52.0 87.6 52.0L87.6 52.0Q89.2 52.0 90.4 51.6Q91.6 51.1 91.6 50.6L91.6 50.6Q91.6 50.4 91.2 50.2Q90.7 50.1 89.7 49.8Q88.7 49.6 88.2 49.5Q87.7 49.3 87.5 49.2Q87.2 49.1 86.9 48.9L86.9 48.9Q86.3 48.5 86.3 47.6Q86.3 46.8 86.9 45.9Q87.6 45.1 88.5 44.5Q89.4 43.9 90.5 43.5L90.5 43.5Q92.7 42.6 94.1 42.6L94.1 42.6Q95.6 42.6 95.9 43.2L95.9 43.2Q96.0 43.4 96.0 43.7L96.0 43.7L96.0 43.8Q96.0 44.5 95.7 44.8Q95.4 45.2 94.8 45.5Q94.2 45.9 93.8 45.9Q93.4 45.9 93.3 45.8Q93.2 45.8 93.2 45.7Q93.1 45.6 93.0 45.5Q92.9 45.5 92.9 45.4Q92.9 45.2 93.0 45.0Q93.2 44.9 93.2 44.7L93.2 44.7Q92.4 44.7 91.4 45.1Q90.5 45.4 89.8 45.9Q89.2 46.3 88.7 46.7Q88.3 47.1 88.3 47.3Q88.3 47.5 88.9 47.6L88.9 47.6Q91.6 48.1 92.4 48.5Q93.2 48.9 93.6 49.4Q93.9 49.9 93.9 50.3L93.9 50.3Q93.9 51.1 93.2 51.9Q92.6 52.6 91.6 53.1L91.6 53.1Q89.5 54.1 88.0 54.1Q86.4 54.1 85.9 53.6Q85.3 53.1 85.3 52.5Q85.3 51.8 85.6 51.3Q85.9 50.8 86.4 50.8Q87.0 50.8 87.0 51.0","m"],["M10 76 C36 70 66 70 92 64","u"]],"EBC":[["M13.8 44.3L13.8 44.3Q12.4 44.3 11.4 43.7L11.4 43.7Q10.3 44.3 9.4 44.3Q8.5 44.3 7.9 44.2Q7.3 44.0 6.9 43.8L6.9 43.8Q6.0 43.2 6.0 42.4L6.0 42.4Q6.0 42.0 6.2 41.7L6.2 41.7Q6.7 42.0 7.4 42.0L7.4 42.0Q9.3 42.0 10.0 40.4L10.0 40.4L10.0 30.3Q10.0 29.3 9.6 28.8L9.6 28.8Q8.9 28.1 7.4 27.3L7.4 27.3Q8.8 26.7 9.3 26.2L9.3 26.2Q10.0 25.4 10.0 24.3L10.0 24.3L10.0 15.6Q9.3 13.9 7.4 13.9L7.4 13.9Q6.7 13.9 6.2 14.3L6.2 14.3Q6.0 14.0 6.0 13.6Q6.0 13.2 6.2 12.8Q6.5 12.5 6.9 12.2L6.9 12.2Q7.9 11.6 9.1 11.6Q10.3 11.6 11.4 12.3L11.4 12.3Q12.5 11.6 13.9 11.6Q15.3 11.6 16.4 12.4L16.4 12.4Q18.6 11.6 21.5 11.6L21.5 11.6Q23.6 11.6 25.2 12.1L25.2 12.1L27.0 12.6Q27.4 12.6 27.7 12.6L27.7 12.6Q28.3 12.6 28.3 11.8L28.3 11.8Q28.3 11.6 28.1 11.1L28.1 11.1Q28.7 11.0 29.6 11.0Q30.5 11.0 31.1 11.6Q31.7 12.2 31.7 13.3Q31.7 14.4 31.3 14.9L31.3 14.9Q31.9 15.8 31.9 17.0Q31.9 18.2 31.1 19.0L31.1 19.0Q31.3 19.6 31.3 20.2Q31.3 20.8 31.1 21.3Q30.9 21.8 30.6 22.1L30.6 22.1Q30.1 22.7 29.5 22.7L29.5 22.7Q28.6 22.7 27.9 22.3L27.9 22.3Q28.1 21.8 28.1 20.8L28.1 20.8Q28.1 18.6 27.0 16.8L27.0 16.8Q25.4 14.4 22.3 14.4L22.3 14.4Q20.7 14.4 19.4 15.2Q18.1 16.0 17.6 17.4L17.6 17.4L17.6 25.5Q18.4 25.9 19.0 25.9Q19.6 25.9 19.9 25.9Q20.3 25.9 20.6 25.8L20.6 25.8Q21.5 25.7 21.9 25.5L21.9 25.5Q22.8 25.1 22.8 23.5L22.8 23.5Q22.8 22.6 22.4 22.1L22.4 22.1Q22.8 21.8 23.4 21.8L23.4 21.8Q24.8 21.8 25.4 22.9L25.4 22.9Q25.6 23.3 25.6 23.8Q25.6 24.2 25.4 24.9L25.4 24.9Q26.3 25.9 26.3 27.3Q26.3 28.6 25.4 29.6L25.4 29.6Q25.6 30.3 25.6 30.9Q25.6 31.4 25.4 32.0Q25.2 32.5 24.9 32.8L24.9 32.8Q24.2 33.4 23.4 33.4L23.4 33.4Q22.8 33.4 22.4 33.1L22.4 33.1Q22.8 32.3 22.8 31.3L22.8 31.3Q22.8 29.4 21.7 28.9L21.7 28.9Q20.8 28.6 19.6 28.6Q18.4 28.6 17.6 29.0L17.6 29.0L17.6 39.4Q18.8 41.6 22.3 41.6L22.3 41.6Q26.2 41.6 27.6 39.1L27.6 39.1Q29.3 36.4 29.3 33.2L29.3 33.2Q29.3 32.3 29.1 31.8L29.1 31.8Q29.6 31.3 30.2 31.3Q30.8 31.3 31.0 31.4Q31.3 31.6 31.6 31.8L31.6 31.8Q32.1 32.4 32.1 32.9L32.1 32.9L31.9 34.0Q31.9 34.4 32.1 34.6L32.1 34.6Q32.6 35.1 32.6 35.4Q32.6 35.8 32.3 36.4L32.3 36.4Q32.8 36.6 33.2 37.2Q33.6 37.7 33.6 38.3L33.6 38.3Q33.6 39.4 32.6 40.4L32.6 40.4Q33.0 41.0 33.0 42.2Q33.0 43.4 32.3 44.2Q31.6 45.0 30.6 45.0L30.6 45.0Q30.0 45.0 29.4 44.9L29.4 44.9Q29.4 44.4 29.4 44.0L29.4 44.0Q29.4 43.0 28.6 43.0L28.6 43.0Q27.6 43.0 26.6 43.4L26.6 43.4Q24.3 44.3 21.3 44.3Q18.4 44.3 16.3 43.6L16.3 43.6Q15.3 44.3 13.8 44.3M12.0 35.7L12.0 38.4Q13.0 38.0 13.1 35.7L13.1 35.7Q13.2 33.3 13.2 29.2Q13.2 25.1 13.2 23.7Q13.2 22.4 13.2 21.5L13.2 21.5Q13.1 19.1 12.7 18.6Q12.3 18.1 12.0 17.9L12.0 17.9Q12.0 25.1 11.7 26.1L11.7 26.1Q11.4 27.0 10.3 27.3L10.3 27.3Q11.5 27.8 11.7 28.4L11.7 28.4Q12.0 29.4 12.0 35.7L12.0 35.7M17.2 38.3L17.2 38.2Q17.2 38.3 17.2 38.3L17.2 38.3M43.8 44.3L43.8 44.3Q42.5 44.3 41.4 43.7L41.4 43.7Q40.3 44.3 39.4 44.3Q38.5 44.3 37.9 44.2Q37.4 44.0 36.9 43.8L36.9 43.8Q36.0 43.2 36.0 42.4L36.0 42.4Q36.0 42.0 36.3 41.7L36.3 41.7Q36.7 42.0 37.4 42.0L37.4 42.0Q39.3 42.0 40.0 40.4L40.0 40.4L40.0 30.3Q40.0 29.3 39.6 28.8L39.6 28.8Q39.0 28.0 37.4 27.3L37.4 27.3Q38.8 26.6 39.3 26.2L39.3 26.2Q40.0 25.3 40.0 24.3L40.0 24.3L40.0 15.6Q39.3 13.9 37.4 13.9L37.4 13.9Q36.7 13.9 36.3 14.3L36.3 14.3Q36.0 14.0 36.0 13.6Q36.0 13.2 36.3 12.8Q36.5 12.5 36.9 12.2L36.9 12.2Q37.9 11.6 39.1 11.6Q40.4 11.6 41.4 12.3L41.4 12.3Q42.5 11.6 43.8 11.6L43.8 11.6Q45.3 11.6 46.4 12.4L46.4 12.4Q48.7 11.4 51.0 11.4Q53.3 11.4 55.1 11.9Q57.0 12.3 58.5 13.1L58.5 13.1Q61.9 14.9 62.7 17.7L62.7 17.7Q63.1 19.2 64.6 20.0L64.6 20.0Q63.0 21.1 62.6 22.6L62.6 22.6Q61.7 25.9 59.0 26.9L59.0 26.9Q62.9 28.0 64.1 32.1L64.1 32.1Q64.5 33.5 66.1 34.4L66.1 34.4Q64.5 35.3 64.0 37.1Q63.4 38.9 62.1 40.4Q60.7 41.8 58.9 42.8L58.9 42.8Q55.4 44.6 51.0 44.6L51.0 44.6Q48.4 44.6 46.3 43.6L46.3 43.6Q45.2 44.3 43.8 44.3M47.6 25.9L51.5 25.9Q53.4 25.9 54.1 25.1L54.1 25.1Q55.0 24.2 55.0 22.0L55.0 22.0L55.0 17.2Q55.0 15.9 53.6 15.0L53.6 15.0Q52.5 14.2 51.5 14.2Q50.5 14.2 49.8 14.5Q49.2 14.7 48.7 15.1L48.7 15.1Q47.6 16.0 47.6 17.2L47.6 17.2L47.6 25.9M56.1 14.7L56.1 14.7Q56.9 16.3 56.9 19.3L56.9 19.3Q56.9 23.8 56.3 25.2L56.3 25.2Q57.1 25.0 57.8 23.5L57.8 23.5Q58.0 22.9 58.1 22.3Q58.2 21.7 58.3 21.3Q58.4 21.0 58.5 20.7L58.5 20.7Q58.8 20.2 59.6 19.9L59.6 19.9Q58.8 19.7 58.6 19.3L58.6 19.3Q58.3 19.0 58.1 18.1Q58.0 17.1 57.8 16.5Q57.5 15.9 57.3 15.6L57.3 15.6Q56.7 14.8 56.1 14.7M42.0 35.7L42.0 38.4Q43.0 38.0 43.1 35.7L43.1 35.7Q43.3 33.3 43.3 29.2Q43.3 25.1 43.2 23.7Q43.2 22.4 43.2 21.5L43.2 21.5Q43.1 19.1 42.7 18.6Q42.3 18.1 42.0 17.9L42.0 17.9Q42.0 25.1 41.7 26.1L41.7 26.1Q41.4 27.0 40.3 27.3L40.3 27.3Q41.6 27.8 41.7 28.4L41.7 28.4Q42.0 29.4 42.0 35.7L42.0 35.7M47.6 28.6L47.6 38.5Q47.6 39.9 48.8 40.9L48.8 40.9Q49.8 41.8 51.3 41.8L51.3 41.8Q52.7 41.8 53.7 41.1L53.7 41.1Q55.6 39.9 55.6 38.3L55.6 38.3L55.6 32.2Q55.6 30.3 54.4 29.4L54.4 29.4Q53.3 28.6 51.6 28.6L51.6 28.6L47.6 28.6M57.0 29.2L57.0 29.2Q57.5 30.3 57.5 34.4L57.5 34.4Q57.5 39.6 57.1 40.5L57.1 40.5Q57.5 40.4 58.0 39.4Q58.5 38.4 58.6 37.4Q58.8 36.3 58.9 36.0Q59.0 35.6 59.1 35.3L59.1 35.3Q59.5 34.7 60.3 34.4L60.3 34.4Q59.0 34.0 58.8 32.8Q58.6 31.6 58.4 31.0Q58.1 30.3 57.9 30.0L57.9 30.0Q57.5 29.3 57.0 29.2M87.7 40.3Q88.5 39.6 89.0 38.5Q89.5 37.4 89.5 36.1Q89.5 34.9 89.0 34.2L89.0 34.2Q89.4 33.6 90.4 33.6Q91.5 33.6 92.1 34.3Q92.6 35.0 92.6 36.4Q92.6 37.8 91.9 39.4Q91.1 40.9 89.7 42.1L89.7 42.1Q86.7 44.6 82.1 44.6L82.1 44.6Q76.7 44.6 73.2 41.1L73.2 41.1Q69.6 37.6 68.9 31.2L68.9 31.2Q68.5 28.2 66.8 27.3L66.8 27.3Q67.8 26.9 68.1 26.4L68.1 26.4Q68.7 25.5 68.9 24.0Q69.1 22.6 69.6 21.0Q70.1 19.4 70.9 18.0Q71.7 16.6 72.9 15.4Q74.0 14.2 75.5 13.3L75.5 13.3Q78.6 11.4 82.8 11.4L82.8 11.4Q86.9 11.4 89.5 13.5L89.5 13.5Q91.9 15.3 92.6 18.5L92.6 18.5Q93.0 20.1 93.5 20.5L93.5 20.5Q93.7 20.6 94.0 20.8L94.0 20.8Q93.4 21.8 92.1 21.9L92.1 21.9Q91.5 22.0 90.9 21.7L90.9 21.7Q89.8 23.7 87.7 23.8L87.7 23.8Q87.2 23.8 87.0 23.6L87.0 23.6Q87.6 22.9 87.5 21.9L87.5 21.9Q87.5 21.7 87.5 21.5L87.5 21.5Q86.5 21.7 85.8 21.3L85.8 21.3Q84.8 20.7 84.7 20.0L84.7 20.0Q84.7 19.8 84.8 19.6L84.8 19.6Q86.1 20.0 87.2 19.1L87.2 19.1Q88.0 18.4 88.0 17.6Q87.9 16.8 87.6 16.2Q87.3 15.6 86.6 15.1L86.6 15.1Q85.2 14.0 83.1 14.0L83.1 14.0Q79.5 14.0 78.4 17.2L78.4 17.2Q78.0 18.3 78.0 19.8L78.0 19.8L78.0 24.0Q78.0 26.3 80.3 27.3L80.3 27.3Q78.0 28.4 78.0 30.9L78.0 30.9L78.0 36.1Q78.0 40.0 81.2 41.3L81.2 41.3Q82.2 41.7 83.4 41.7Q84.7 41.7 85.8 41.4Q86.9 41.0 87.7 40.3M73.6 38.4L73.6 38.4Q73.9 38.3 73.9 38.0L73.9 38.0Q73.9 37.5 73.5 36.5L73.5 36.5Q72.4 34.0 72.4 27.3L72.4 27.3Q72.4 22.4 73.6 19.0L73.6 19.0Q73.7 18.5 73.7 18.2Q73.7 18.0 73.4 17.9L73.4 17.9Q72.5 19.1 72.0 20.3L72.0 20.3Q71.3 22.5 70.8 26.3L70.8 26.3Q70.8 26.8 69.6 27.3L69.6 27.3Q70.8 27.8 70.8 28.4L70.8 28.4Q71.6 34.8 72.7 37.0L72.7 37.0Q73.1 37.8 73.6 38.4","m"],["M8.5 75.0Q7.8 74.3 7.4 73.3Q7.0 72.3 6.9 71.4Q6.8 70.5 6.6 70.2Q6.4 69.8 6.0 69.7L6.0 69.7Q6.7 69.3 6.8 68.3Q7.0 67.2 7.4 66.3Q7.9 65.4 8.6 64.8L8.6 64.8Q10.0 63.4 12.1 63.4L12.1 63.4Q14.2 63.4 15.6 64.7L15.6 64.7Q17.1 66.0 17.3 68.3L17.3 68.3Q17.4 69.3 18.1 69.7L18.1 69.7Q17.4 70.0 17.3 71.2Q17.2 72.3 16.8 73.3Q16.4 74.3 15.8 75.0L15.8 75.0Q14.4 76.4 12.1 76.4L12.1 76.4Q9.9 76.4 8.5 75.0L8.5 75.0M11.2 69.7L11.2 69.7Q10.3 70.1 10.3 71.1L10.3 71.1L10.3 73.5Q10.3 74.8 11.4 75.2L11.4 75.2Q11.7 75.3 12.1 75.3Q12.5 75.3 12.8 75.2Q13.1 75.1 13.4 74.9L13.4 74.9Q13.8 74.4 13.8 73.5L13.8 73.5L13.8 71.1Q13.8 70.1 13.0 69.7L13.0 69.7Q13.8 69.3 13.8 68.3L13.8 68.3L13.8 66.4Q13.8 65.5 13.3 65.0L13.3 65.0Q12.8 64.5 12.1 64.5L12.1 64.5Q10.8 64.5 10.4 65.6L10.4 65.6Q10.3 65.9 10.3 66.4L10.3 66.4L10.3 68.3Q10.3 69.3 11.2 69.7M14.6 66.0L14.6 66.0Q14.8 66.6 14.8 68.3L14.8 68.3Q14.8 69.3 14.7 69.4Q14.7 69.5 14.6 69.5L14.6 69.5Q14.4 69.6 14.3 69.7L14.3 69.7Q14.8 69.9 14.8 70.1L14.8 70.1Q14.9 70.9 14.9 71.5Q14.9 72.1 14.8 72.4Q14.8 72.8 14.8 73.1L14.8 73.1Q14.7 73.7 14.6 74.0L14.6 74.0Q15.3 73.8 15.3 72.1L15.3 72.1Q15.4 71.2 15.4 70.0Q15.4 68.8 15.4 68.3Q15.3 67.7 15.3 67.3L15.3 67.3Q15.2 66.4 14.9 66.1L14.9 66.1Q14.8 66.0 14.6 66.0M8.7 74.0L8.7 74.0Q8.8 74.0 8.8 73.9L8.8 73.9Q8.8 73.7 8.6 73.3L8.6 73.3Q8.2 72.3 8.2 69.7L8.2 69.7Q8.2 67.7 8.7 66.4L8.7 66.4Q8.7 66.2 8.7 66.1Q8.7 66.0 8.6 66.0L8.6 66.0Q8.2 66.4 8.1 66.9L8.1 66.9Q7.8 67.8 7.6 69.3L7.6 69.3Q7.6 69.5 7.1 69.7L7.1 69.7Q7.6 69.9 7.6 70.1L7.6 70.1Q7.9 72.6 8.3 73.5L8.3 73.5Q8.5 73.8 8.7 74.0M29.4 70.7L29.4 73.5Q29.5 73.9 30.0 74.2L30.0 74.2Q29.7 74.3 29.2 74.8Q28.8 75.2 28.3 75.5Q27.8 75.9 27.2 76.1L27.2 76.1Q26.3 76.4 25.2 76.4Q24.1 76.4 23.2 76.2Q22.3 75.9 21.7 75.5L21.7 75.5Q20.5 74.6 20.5 73.1L20.5 73.1L20.5 70.8Q20.5 70.4 20.4 70.3L20.4 70.3Q20.1 70.0 19.5 69.7L19.5 69.7Q20.1 69.4 20.3 69.2L20.3 69.2Q20.5 68.9 20.5 68.5L20.5 68.5L20.5 65.0Q20.3 64.4 19.5 64.4L19.5 64.4Q19.2 64.4 19.1 64.5L19.1 64.5Q19.0 64.4 19.0 64.3Q19.0 64.1 19.1 64.0Q19.2 63.8 19.3 63.7L19.3 63.7Q19.7 63.5 20.2 63.5Q20.7 63.5 21.1 63.8L21.1 63.8Q21.5 63.5 22.0 63.5Q22.6 63.5 23.0 63.8L23.0 63.8Q23.4 63.5 23.8 63.5Q24.1 63.5 24.4 63.6Q24.6 63.6 24.8 63.7L24.8 63.7Q25.1 63.9 25.1 64.3L25.1 64.3Q25.1 64.4 25.0 64.5L25.0 64.5Q24.8 64.4 24.6 64.4L24.6 64.4Q23.8 64.4 23.5 65.0L23.5 65.0L23.5 68.5Q23.5 68.9 23.7 69.1L23.7 69.1Q24.0 69.4 24.5 69.7L24.5 69.7Q23.9 70.0 23.8 70.1L23.8 70.1Q23.5 70.4 23.5 70.8L23.5 70.8L23.5 73.1Q23.5 74.1 24.3 74.7L24.3 74.7Q25.0 75.3 25.9 75.3L25.9 75.3Q26.8 75.3 27.5 74.8L27.5 74.8Q28.2 74.2 28.2 73.4L28.2 73.4L28.2 70.7Q28.2 70.4 28.1 70.2L28.1 70.2Q27.8 70.0 27.2 69.7L27.2 69.7Q27.8 69.4 27.9 69.2L27.9 69.2Q28.2 68.9 28.2 68.6L28.2 68.6L28.2 64.9Q27.9 64.4 27.4 64.4Q26.8 64.4 26.6 64.5L26.6 64.5Q26.5 64.4 26.5 64.1Q26.5 63.9 26.8 63.7Q27.0 63.5 27.4 63.5Q27.8 63.5 28.2 63.7L28.2 63.7Q28.5 63.5 28.8 63.5Q29.2 63.5 29.5 63.7L29.5 63.7Q29.8 63.5 30.2 63.5Q30.6 63.5 30.8 63.7Q31.0 63.9 31.0 64.2Q31.0 64.4 31.0 64.5L31.0 64.5Q30.7 64.4 30.2 64.4Q29.7 64.4 29.4 64.9L29.4 64.9L29.4 68.6Q29.4 68.9 29.5 69.1L29.5 69.1Q29.8 69.4 30.4 69.7L30.4 69.7Q29.7 70.0 29.6 70.2L29.6 70.2Q29.4 70.4 29.4 70.7L29.4 70.7M21.7 74.0L21.7 74.0Q21.8 73.6 21.8 71.2Q21.8 68.8 21.8 68.3Q21.8 67.7 21.8 67.4L21.8 67.4Q21.8 66.4 21.6 66.2Q21.5 66.0 21.3 66.0L21.3 66.0Q21.3 68.8 21.2 69.2L21.2 69.2Q21.1 69.5 20.7 69.7L20.7 69.7Q21.2 69.8 21.2 70.1L21.2 70.1Q21.3 70.5 21.3 71.8Q21.3 73.1 21.4 73.3Q21.4 73.6 21.5 73.7L21.5 73.7Q21.6 74.0 21.7 74.0M38.3 76.1L38.3 76.1Q37.9 76.4 37.4 76.4Q36.9 76.4 36.4 76.1L36.4 76.1Q36.0 76.4 35.6 76.4Q35.2 76.4 35.0 76.3Q34.8 76.2 34.6 76.1L34.6 76.1Q34.2 75.9 34.2 75.6L34.2 75.6Q34.2 75.4 34.3 75.3L34.3 75.3Q34.5 75.4 34.8 75.4Q35.1 75.4 35.4 75.3Q35.7 75.1 35.9 74.8L35.9 74.8L35.9 70.8Q35.9 70.4 35.7 70.3L35.7 70.3Q35.5 70.0 34.9 69.7L34.9 69.7Q35.4 69.4 35.6 69.2L35.6 69.2Q35.9 68.9 35.9 68.5L35.9 68.5L35.9 64.7Q35.6 64.6 35.2 64.6Q34.9 64.6 34.5 64.8Q34.0 65.0 33.7 65.4L33.7 65.4Q33.0 66.2 33.0 67.6L33.0 67.6Q33.0 68.4 33.3 68.8L33.3 68.8Q33.2 69.0 32.9 69.0Q32.6 69.0 32.4 68.8Q32.2 68.7 32.0 68.5L32.0 68.5Q31.7 68.1 31.7 67.6Q31.7 67.1 31.9 66.8L31.9 66.8Q31.6 66.4 31.6 65.9Q31.6 65.5 31.8 65.2L31.8 65.2Q31.5 64.8 31.5 64.2L31.5 64.2Q31.5 63.5 32.2 63.2L32.2 63.2Q32.4 63.2 32.5 63.2L32.5 63.2Q32.8 63.2 32.9 63.3L32.9 63.3Q32.9 63.5 32.9 63.6L32.9 63.6Q32.9 63.9 33.1 63.9L33.1 63.9Q33.2 63.9 33.3 63.9L33.3 63.9L33.7 63.7Q34.7 63.5 35.3 63.5Q36.0 63.5 36.4 63.8L36.4 63.8Q36.9 63.5 37.4 63.5Q37.9 63.5 38.4 63.8L38.4 63.8Q38.8 63.5 39.3 63.5L39.3 63.5Q40.1 63.5 40.7 63.7L40.7 63.7L41.4 63.9Q41.6 63.9 41.7 63.9L41.7 63.9Q41.9 63.9 41.9 63.6L41.9 63.6Q41.9 63.5 41.9 63.3L41.9 63.3Q42.0 63.2 42.2 63.2Q42.4 63.2 42.6 63.2Q42.8 63.3 43.0 63.4L43.0 63.4Q43.3 63.7 43.3 64.3Q43.3 64.8 42.9 65.2L42.9 65.2Q43.2 65.5 43.2 65.9Q43.2 66.4 42.9 66.8L42.9 66.8Q43.1 67.1 43.1 67.4Q43.1 67.8 43.0 68.0Q42.9 68.3 42.7 68.5L42.7 68.5Q42.4 69.0 41.9 69.0L41.9 69.0Q41.6 69.0 41.5 68.8L41.5 68.8Q41.8 68.4 41.8 67.6Q41.8 66.9 41.6 66.3Q41.4 65.7 41.1 65.4L41.1 65.4Q40.4 64.6 39.5 64.6L39.5 64.6Q39.2 64.6 38.9 64.7L38.9 64.7L38.9 68.5Q38.9 68.9 39.1 69.1L39.1 69.1Q39.3 69.4 39.9 69.7L39.9 69.7Q39.3 70.0 39.1 70.1L39.1 70.1Q38.9 70.4 38.9 70.8L38.9 70.8L38.9 74.8Q39.0 75.1 39.4 75.3Q39.7 75.4 40.0 75.4Q40.3 75.4 40.4 75.3L40.4 75.3Q40.5 75.4 40.5 75.6Q40.5 75.8 40.4 75.9Q40.3 76.0 40.2 76.1L40.2 76.1Q39.8 76.4 39.3 76.4Q38.8 76.4 38.3 76.1M36.7 73.0L36.7 74.0Q37.1 73.9 37.1 72.9L37.1 72.9Q37.2 72.0 37.2 70.4Q37.2 68.8 37.2 68.3Q37.2 67.7 37.2 67.4L37.2 67.4Q37.1 66.4 37.0 66.2Q36.8 66.0 36.7 66.0L36.7 66.0Q36.7 68.8 36.6 69.2L36.6 69.2Q36.5 69.5 36.0 69.7L36.0 69.7Q36.5 69.8 36.6 70.1L36.6 70.1Q36.7 70.5 36.7 73.0L36.7 73.0M47.3 76.4L47.3 76.4Q46.7 76.4 46.3 76.1L46.3 76.1Q45.9 76.4 45.5 76.4Q45.2 76.4 44.9 76.3Q44.7 76.2 44.5 76.1L44.5 76.1Q44.2 75.9 44.2 75.6L44.2 75.6Q44.2 75.4 44.3 75.3L44.3 75.3Q44.5 75.4 44.7 75.4L44.7 75.4Q45.5 75.4 45.7 74.8L45.7 74.8L45.7 70.8Q45.7 70.4 45.6 70.3L45.6 70.3Q45.3 70.0 44.7 69.7L44.7 69.7Q45.3 69.4 45.5 69.2L45.5 69.2Q45.7 68.9 45.7 68.5L45.7 68.5L45.7 65.0Q45.5 64.4 44.7 64.4L44.7 64.4Q44.5 64.4 44.3 64.5L44.3 64.5Q44.2 64.4 44.2 64.3Q44.2 64.1 44.3 64.0Q44.4 63.8 44.5 63.7L44.5 63.7Q44.9 63.5 45.4 63.5Q45.9 63.5 46.3 63.8L46.3 63.8Q46.7 63.5 47.3 63.5Q47.8 63.5 48.2 63.8L48.2 63.8Q48.7 63.5 49.0 63.5Q49.4 63.5 49.6 63.6Q49.9 63.6 50.0 63.7L50.0 63.7Q50.4 63.9 50.4 64.3L50.4 64.3Q50.4 64.4 50.3 64.5L50.3 64.5Q50.1 64.4 49.8 64.4Q49.5 64.4 49.2 64.6Q48.9 64.7 48.8 65.0L48.8 65.0L48.8 68.5Q48.8 68.9 48.9 69.1L48.9 69.1Q49.2 69.4 49.8 69.7L49.8 69.7Q49.2 70.0 49.0 70.1L49.0 70.1Q48.8 70.4 48.8 70.8L48.8 70.8L48.8 74.4Q49.3 75.3 50.1 75.3L50.1 75.3Q52.1 75.3 52.7 73.6L52.7 73.6Q52.9 72.8 52.9 72.2Q52.9 71.5 52.8 71.3L52.8 71.3Q53.0 71.2 53.2 71.2Q53.4 71.2 53.5 71.3Q53.7 71.3 53.9 71.5L53.9 71.5Q54.1 71.8 54.1 72.3Q54.1 72.8 54.1 73.0L54.1 73.0Q54.4 73.3 54.4 73.9Q54.4 74.4 54.1 74.8L54.1 74.8Q54.4 75.1 54.4 75.4Q54.4 75.7 54.3 75.9Q54.2 76.1 54.1 76.3L54.1 76.3Q53.8 76.6 53.4 76.6L53.4 76.6Q53.1 76.6 53.0 76.5L53.0 76.5Q53.0 76.3 53.0 76.1L53.0 76.1Q53.0 75.8 52.6 75.8L52.6 75.8Q52.4 75.8 51.9 76.0L51.9 76.0Q51.1 76.4 50.0 76.4Q48.9 76.4 48.2 76.1L48.2 76.1Q47.8 76.4 47.3 76.4M46.5 73.0L46.5 74.0Q46.9 73.9 47.0 72.9L47.0 72.9Q47.0 72.0 47.0 70.4Q47.0 68.8 47.0 68.3Q47.0 67.7 47.0 67.4L47.0 67.4Q47.0 66.4 46.8 66.2Q46.7 66.0 46.5 66.0L46.5 66.0Q46.5 68.8 46.4 69.2L46.4 69.2Q46.3 69.5 45.9 69.7L45.9 69.7Q46.4 69.8 46.4 70.1L46.4 70.1Q46.5 70.5 46.5 73.0L46.5 73.0M55.6 76.1L55.6 76.1Q55.3 76.4 54.9 76.4Q54.5 76.4 54.3 76.2Q54.1 76.0 54.1 75.7Q54.1 75.4 54.2 75.3L54.2 75.3Q54.4 75.4 54.7 75.4Q55.1 75.4 55.3 75.4Q55.4 75.3 55.6 75.1L55.6 75.1L56.8 71.6L56.9 71.1Q57.0 70.8 57.0 70.6L57.0 70.6Q57.0 69.9 56.3 69.7L56.3 69.7Q56.9 69.4 57.2 69.1L57.2 69.1Q57.6 68.7 57.9 67.9L57.9 67.9L58.8 64.9Q58.5 64.6 58.1 64.6Q57.8 64.6 57.5 64.7L57.5 64.7Q57.4 64.6 57.4 64.4Q57.4 64.2 57.5 64.0Q57.5 63.9 57.7 63.8L57.7 63.8Q58.0 63.5 58.6 63.5Q59.1 63.5 59.5 63.8L59.5 63.8Q59.9 63.5 60.6 63.5Q61.2 63.5 61.5 63.8L61.5 63.8Q62.1 63.5 62.6 63.5Q63.1 63.5 63.4 63.7Q63.7 63.9 63.7 64.3L63.7 64.3Q63.7 64.4 63.6 64.5L63.6 64.5Q63.4 64.4 63.2 64.4L63.2 64.4Q62.6 64.4 62.5 65.2L62.5 65.2L63.5 68.5Q63.7 69.1 64.5 69.5L64.5 69.5Q64.7 69.6 65.0 69.7L65.0 69.7Q64.1 69.9 64.1 70.5L64.1 70.5Q64.1 70.7 64.2 70.8L64.2 70.8L65.8 75.0Q66.1 75.4 66.5 75.4Q66.9 75.4 67.1 75.3L67.1 75.3Q67.2 75.3 67.2 75.5Q67.2 75.7 67.1 75.8Q67.0 76.0 66.9 76.1L66.9 76.1Q66.7 76.4 66.2 76.4Q65.6 76.4 65.3 76.1L65.3 76.1Q64.8 76.4 64.3 76.4Q63.8 76.4 63.4 76.1L63.4 76.1Q63.0 76.4 62.5 76.4Q62.0 76.4 61.7 76.1Q61.4 75.9 61.3 75.6L61.3 75.6Q61.3 75.3 61.4 75.3L61.4 75.3Q61.7 75.4 61.9 75.4L61.9 75.4Q62.4 75.4 62.6 75.2L62.6 75.2L61.9 73.1L57.5 73.1L57.0 74.9Q57.3 75.4 57.8 75.4Q58.3 75.4 58.5 75.3L58.5 75.3Q58.6 75.5 58.6 75.7Q58.6 76.0 58.3 76.2Q58.1 76.4 57.7 76.4Q57.3 76.4 56.9 76.2L56.9 76.2Q56.7 76.4 56.3 76.4Q55.9 76.4 55.6 76.1M57.8 72.0L61.6 72.0L59.7 65.7L57.8 72.0M62.7 72.8L63.2 74.0Q63.3 74.0 63.3 73.7L63.3 73.7Q63.3 73.1 63.1 72.6L63.1 72.6L62.8 71.6Q62.5 70.5 62.5 70.3L62.5 70.3Q62.5 69.8 62.9 69.7L62.9 69.7Q62.3 69.5 62.2 69.3L62.2 69.3Q62.2 69.2 62.1 69.1Q62.1 69.1 62.1 69.0Q62.0 68.9 62.0 68.8Q61.9 68.7 61.8 68.5L61.8 68.5L61.3 66.9Q61.1 66.4 60.8 66.1L60.8 66.1Q60.7 66.0 60.6 66.0L60.6 66.0Q61.1 67.9 61.3 68.5L61.3 68.5Q62.5 72.1 62.7 72.8L62.7 72.8M65.6 74.8L65.6 74.8L65.6 74.8M82.0 69.0L82.0 69.0Q82.0 69.4 82.8 69.7L82.8 69.7Q82.1 69.9 81.8 70.2L81.8 70.2Q81.3 70.6 81.0 71.4L81.0 71.4L79.6 75.5Q79.1 76.6 78.9 76.8L78.9 76.8Q78.8 76.8 78.7 76.8Q78.6 76.8 78.6 76.8L78.6 76.8L75.8 68.7L73.2 75.5Q72.8 76.6 72.5 76.8L72.5 76.8Q72.4 76.8 72.3 76.8Q72.2 76.8 72.2 76.8L72.2 76.8L69.5 70.8Q69.3 70.4 69.1 70.2L69.1 70.2Q68.8 69.9 68.2 69.7L68.2 69.7Q68.9 69.3 68.9 68.9L68.9 68.9Q68.9 68.7 68.7 68.3L68.7 68.3L68.5 67.7L67.4 64.7Q67.0 64.4 66.7 64.4Q66.3 64.4 66.1 64.6L66.1 64.6Q66.0 64.5 66.0 64.3Q66.0 64.2 66.1 64.0Q66.2 63.9 66.3 63.7L66.3 63.7Q66.5 63.5 67.0 63.5Q67.5 63.5 67.9 63.8L67.9 63.8Q68.3 63.5 68.9 63.5Q69.5 63.5 69.8 63.8L69.8 63.8Q70.3 63.5 70.6 63.5Q71.0 63.5 71.2 63.5Q71.5 63.6 71.6 63.7L71.6 63.7Q72.0 63.9 72.0 64.3L72.0 64.3Q72.0 64.5 71.9 64.6L71.9 64.6Q71.7 64.4 71.5 64.4L71.5 64.4Q71.0 64.4 70.7 64.6L70.7 64.6L73.3 72.1L75.2 66.9L74.4 64.7Q74.0 64.4 73.7 64.4Q73.4 64.4 73.2 64.6L73.2 64.6Q73.1 64.5 73.1 64.3Q73.1 64.2 73.2 64.0Q73.2 63.9 73.3 63.7L73.3 63.7Q73.6 63.5 74.1 63.5Q74.6 63.5 75.0 63.8L75.0 63.8Q75.4 63.5 75.9 63.5Q76.5 63.5 76.9 63.8L76.9 63.8Q77.3 63.5 77.7 63.5Q78.1 63.5 78.3 63.5Q78.5 63.6 78.7 63.7L78.7 63.7Q79.1 63.9 79.1 64.3L79.1 64.3Q79.1 64.5 79.0 64.6L79.0 64.6Q78.8 64.4 78.5 64.4L78.5 64.4Q78.0 64.4 77.7 64.7L77.7 64.7L79.9 71.5L82.1 64.7Q81.9 64.4 81.4 64.4Q80.9 64.4 80.6 64.5L80.6 64.5Q80.6 64.4 80.6 64.2Q80.6 63.9 80.8 63.7Q81.0 63.5 81.4 63.5Q81.8 63.5 82.1 63.7L82.1 63.7Q82.4 63.5 82.8 63.5Q83.1 63.5 83.4 63.7L83.4 63.7Q83.7 63.5 84.1 63.5Q84.5 63.5 84.7 63.7Q84.9 64.0 84.9 64.3L84.9 64.3Q84.9 64.5 84.8 64.6L84.8 64.6Q84.6 64.4 84.3 64.4L84.3 64.4Q83.7 64.4 83.4 64.9L83.4 64.9L82.2 67.9Q82.0 68.7 82.0 69.0M78.3 72.0L76.0 65.9Q75.9 66.1 75.9 66.4Q75.9 66.8 76.1 67.2L76.1 67.2L76.4 68.1L78.6 74.0Q78.6 74.0 78.6 73.9Q78.6 73.7 78.6 73.5Q78.6 73.3 78.6 73.1Q78.5 72.9 78.5 72.7L78.5 72.7Q78.4 72.4 78.3 72.0L78.3 72.0M69.2 66.0L69.2 66.0Q69.0 66.1 69.0 66.3Q69.0 66.5 69.0 66.6Q69.1 66.7 69.1 66.9L69.1 66.9Q69.2 67.3 69.4 67.8Q69.6 68.2 69.6 68.4Q69.7 68.6 69.7 68.8Q69.7 68.9 69.7 69.0Q69.7 69.1 69.8 69.2L69.8 69.2Q69.8 69.4 69.2 69.6L69.2 69.6Q69.6 69.7 69.8 69.8Q70.0 69.8 70.0 69.9Q70.1 70.1 70.3 70.4Q70.4 70.7 70.6 71.1L70.6 71.1L71.0 71.9Q71.1 72.4 71.3 72.7Q71.4 73.1 71.5 73.3Q71.6 73.6 71.8 73.7L71.8 73.7Q72.0 74.0 72.2 74.0L72.2 74.0Q71.8 72.9 71.4 71.8Q71.0 70.8 70.6 69.8Q70.2 68.8 69.9 67.8Q69.5 66.9 69.2 66.0M87.2 75.9L87.2 75.9Q86.5 76.5 85.9 76.5L85.9 76.5Q85.6 76.5 85.4 76.3L85.4 76.3Q85.6 76.0 85.6 75.6L85.6 75.6L85.6 75.4Q85.6 75.4 85.6 75.3L85.6 75.3Q85.2 75.0 85.2 74.5Q85.2 74.0 85.7 73.4L85.7 73.4Q85.5 73.2 85.5 72.9Q85.5 72.5 85.6 72.3Q85.7 72.0 85.9 71.8L85.9 71.8Q86.2 71.3 86.6 71.3Q86.9 71.3 87.0 71.6L87.0 71.6Q86.7 71.9 86.7 72.6Q86.7 73.2 86.9 73.7Q87.1 74.2 87.5 74.6L87.5 74.6Q88.2 75.3 89.4 75.3L89.4 75.3Q90.2 75.3 90.7 74.9L90.7 74.9Q91.3 74.4 91.3 73.6L91.3 73.6Q91.3 73.0 91.0 72.6L91.0 72.6Q90.6 72.0 89.7 71.4L89.7 71.4Q89.0 70.9 88.5 70.9L88.5 70.9Q88.1 70.9 87.6 71.3L87.6 71.3Q87.7 70.8 87.7 70.5L87.7 70.5Q87.7 70.4 87.6 70.3L87.6 70.3L87.3 70.0Q85.8 68.7 85.6 67.5L85.6 67.5Q85.5 67.1 85.5 66.6Q85.5 66.0 85.8 65.4Q86.1 64.7 86.6 64.3L86.6 64.3Q87.6 63.4 89.3 63.4L89.3 63.4Q90.2 63.4 91.1 63.7L91.1 63.7Q91.4 63.9 91.9 63.9L91.9 63.9Q92.1 63.9 92.2 63.9Q92.4 63.8 92.5 63.7L92.5 63.7Q92.6 63.5 92.6 63.4Q92.6 63.3 92.6 63.2L92.6 63.2Q92.6 63.2 92.7 63.2Q92.8 63.2 92.9 63.2Q93.1 63.3 93.2 63.4L93.2 63.4Q93.4 63.7 93.4 64.1Q93.4 64.4 93.2 64.6L93.2 64.6Q93.5 64.8 93.5 65.4L93.5 65.4Q93.5 65.9 93.1 66.2L93.1 66.2Q93.2 66.4 93.2 66.6Q93.2 66.8 93.1 66.9Q93.1 67.1 93.0 67.2L93.0 67.2Q92.7 67.5 92.5 67.5L92.5 67.5Q92.2 67.5 91.9 67.4L91.9 67.4Q92.1 67.0 92.1 66.6Q92.1 66.3 91.9 65.9Q91.7 65.5 91.4 65.2L91.4 65.2Q90.8 64.6 89.8 64.6L89.8 64.6Q89.1 64.6 88.7 65.0L88.7 65.0Q88.3 65.4 88.3 65.9L88.3 65.9Q88.3 66.3 88.5 66.6L88.5 66.6Q88.8 67.0 89.6 67.5L89.6 67.5L90.0 67.8Q90.3 68.0 90.4 68.0Q90.5 68.0 90.7 68.0Q90.8 67.9 90.9 67.9L90.9 67.9Q91.2 67.8 91.5 67.6L91.5 67.6L91.4 68.1Q91.3 68.3 91.3 68.4L91.3 68.4Q91.3 68.6 91.5 68.7L91.5 68.7Q93.0 70.1 93.5 71.0L93.5 71.0Q94.0 71.7 94.0 72.6Q94.0 73.5 93.7 74.2Q93.4 74.8 92.8 75.3L92.8 75.3Q91.6 76.4 89.6 76.4L89.6 76.4Q88.2 76.4 87.2 75.9M86.6 66.0L86.6 66.0Q86.3 66.1 86.3 66.6L86.3 66.6Q86.3 67.8 87.8 69.1L87.8 69.1L88.3 69.5Q88.6 69.8 88.5 69.9Q88.5 70.0 88.5 70.1Q88.5 70.2 88.4 70.2Q88.4 70.3 88.4 70.3L88.4 70.3Q88.7 70.2 88.9 70.2L88.9 70.2Q89.2 70.2 89.5 70.4L89.5 70.4Q91.1 71.3 91.7 72.1L91.7 72.1Q92.1 72.7 92.1 73.5L92.1 73.5Q92.1 73.8 92.1 74.0L92.1 74.0Q92.5 73.7 92.5 73.1L92.5 73.1Q92.5 72.5 92.3 72.2Q92.2 71.9 92.0 71.7Q91.8 71.4 91.4 71.1Q91.1 70.8 90.6 70.5L90.6 70.5L89.4 69.7Q88.0 68.7 87.2 67.7L87.2 67.7Q86.6 66.8 86.6 66.0","a"]],"STW":[["M10.7 48.5L10.7 48.5Q9.7 48.5 9.7 48.1L9.7 48.1Q9.7 48.0 9.9 47.8Q10.1 47.5 10.3 47.1L10.3 47.1Q10.9 46.1 10.9 45.0L10.9 45.0Q10.9 43.7 10.4 43.4L10.4 43.4Q10.1 43.3 9.8 43.3Q9.4 43.3 9.1 43.4Q8.9 43.5 8.7 43.7Q8.5 43.9 8.5 44.2L8.5 44.2Q8.3 44.7 8.3 45.6Q8.3 46.5 8.4 47.3Q8.5 48.0 8.6 48.4Q8.8 48.8 8.9 49.0Q9.0 49.3 9.2 49.4L9.2 49.4Q9.5 49.6 9.5 49.8Q9.5 49.9 9.4 50.0Q9.2 50.1 9.1 50.3Q8.9 50.5 8.7 50.9L8.7 50.9Q8.3 51.7 8.3 53.7L8.3 53.7L8.3 54.3Q8.3 55.7 8.6 56.1L8.6 56.1Q8.8 56.5 9.0 56.6L9.0 56.6Q9.9 56.9 10.4 56.6L10.4 56.6Q10.9 56.3 10.9 54.9L10.9 54.9Q10.9 52.2 9.8 52.1L9.8 52.1Q9.8 51.7 10.3 51.5L10.3 51.5Q10.6 51.4 10.9 51.4L10.9 51.4Q11.6 51.4 12.1 52.0L12.1 52.0Q12.8 51.5 13.2 51.4Q13.7 51.2 13.9 51.2L13.9 51.2Q14.4 51.2 14.5 51.5L14.5 51.5L14.6 51.6Q14.1 52.1 14.0 52.9Q13.9 53.7 13.9 54.8Q13.9 55.9 13.6 56.5Q13.3 57.2 12.9 57.6Q12.5 58.0 11.9 58.3L11.9 58.3Q10.9 58.7 9.7 58.7L9.7 58.7Q7.5 58.7 6.3 57.5Q5.1 56.3 5.1 53.6L5.1 53.6Q5.1 51.2 4.4 50.4L4.4 50.4Q4.2 50.2 4.1 50.1Q4.0 50.0 4.0 49.9Q4.0 49.8 4.1 49.7Q4.2 49.6 4.4 49.4Q4.6 49.3 4.7 49.0L4.7 49.0Q5.1 48.2 5.1 46.4L5.1 46.4Q5.1 41.3 9.9 41.3L9.9 41.3Q11.8 41.3 12.9 42.3L12.9 42.3Q13.9 43.2 13.9 44.9L13.9 44.9Q13.9 47.3 14.7 48.3L14.7 48.3Q14.6 48.5 14.5 48.6Q14.3 48.7 14.0 48.7Q13.7 48.7 13.4 48.6Q13.1 48.5 12.9 48.4Q12.7 48.3 12.5 48.1Q12.4 48.0 12.3 47.9Q12.2 47.9 12.2 47.9Q12.1 48.0 12.0 48.1Q11.8 48.2 11.4 48.3Q11.0 48.5 10.7 48.5M20.3 53.2L20.3 53.2Q20.3 53.2 20.3 54.0L20.3 54.0Q20.3 55.3 20.4 55.6Q20.5 55.8 20.6 55.9Q20.6 56.1 20.7 56.2Q20.8 56.2 21.0 56.3L21.0 56.3Q21.3 56.5 22.0 56.4L22.0 56.4Q22.5 56.3 22.7 55.9L22.7 55.9Q23.0 55.4 23.0 54.7Q23.0 54.1 23.0 53.9L23.0 53.9L23.0 53.3Q23.0 51.3 22.4 50.4L22.4 50.4Q22.3 50.2 22.2 50.1Q22.1 50.0 22.1 50.0Q22.1 49.9 22.3 49.8Q22.4 49.6 22.6 49.3Q22.7 49.1 22.9 48.3Q23.0 47.6 23.0 46.7Q23.0 45.9 23.0 45.7Q23.0 45.4 23.0 45.0Q23.0 44.6 22.9 44.4Q22.9 44.3 22.8 44.0Q22.8 43.8 22.7 43.7Q22.6 43.6 22.4 43.5L22.4 43.5Q22.2 43.3 21.7 43.3Q21.3 43.3 21.1 43.3Q20.8 43.4 20.7 43.6Q20.5 43.8 20.4 44.0Q20.4 44.2 20.3 44.6L20.3 44.6Q20.3 45.2 20.3 46.3Q20.3 47.4 20.4 48.0Q20.4 48.7 20.6 49.0Q20.7 49.4 20.8 49.5Q21.0 49.7 21.1 49.8Q21.1 49.9 21.1 50.0Q21.1 50.0 21.1 50.1Q21.0 50.2 20.8 50.5Q20.7 50.7 20.6 51.0L20.6 51.0Q20.3 51.8 20.3 53.2M26.9 50.9Q26.7 51.2 26.6 51.9Q26.5 52.5 26.5 53.7Q26.5 54.9 26.2 55.9Q25.8 56.9 25.2 57.6Q24.6 58.2 23.7 58.5Q22.8 58.7 21.6 58.7Q20.4 58.7 19.6 58.5Q18.7 58.2 18.1 57.6L18.1 57.6Q16.8 56.3 16.8 53.4L16.8 53.4Q16.8 50.9 15.6 50.1L15.6 50.1Q15.5 50.0 15.5 50.0Q15.5 49.9 15.6 49.8Q15.8 49.7 16.0 49.6Q16.1 49.4 16.3 49.0L16.3 49.0Q16.8 48.2 16.8 46.9Q16.8 45.5 16.9 44.6Q17.1 43.8 17.4 43.2Q17.7 42.6 18.0 42.2Q18.4 41.9 19.0 41.6Q19.6 41.4 20.2 41.3Q20.8 41.3 21.6 41.3Q22.5 41.3 23.1 41.3Q23.7 41.4 24.3 41.6Q24.8 41.9 25.2 42.2Q25.6 42.6 25.9 43.2L25.9 43.2Q26.5 44.3 26.5 46.6L26.5 46.6Q26.5 49.0 27.5 49.8L27.5 49.8Q27.6 49.9 27.6 50.0Q27.6 50.0 27.5 50.1Q27.3 50.2 27.2 50.4Q27.1 50.5 26.9 50.9M46.9 41.5L46.9 41.5Q47.6 41.5 47.6 42.1L47.6 42.1L47.6 42.1Q46.7 43.0 46.2 44.7Q45.7 46.3 45.7 48.3L45.7 48.3Q45.7 49.0 45.8 49.4Q45.9 49.8 45.9 49.8L45.9 49.8Q44.6 52.0 44.1 54.3L44.1 54.3Q43.9 55.2 43.9 56.0Q43.9 56.8 44.4 57.7L44.4 57.7L44.4 57.7Q44.4 58.3 43.2 58.3L43.2 58.3Q42.7 58.3 42.4 58.0L42.4 58.0Q41.8 57.5 41.6 57.1L41.6 57.1Q41.3 57.8 40.4 58.2L40.4 58.2Q40.0 58.3 39.6 58.3Q39.2 58.3 39.0 58.1Q38.8 58.0 38.7 57.7L38.7 57.7Q39.3 56.8 39.3 55.7L39.3 55.7Q39.3 55.4 39.2 54.7Q39.0 54.1 38.9 53.5L38.9 53.5Q38.6 51.7 38.1 50.0L38.1 50.0L38.0 49.4Q37.4 51.2 36.9 53.2Q36.4 55.1 36.4 56.0Q36.4 56.8 36.9 57.7L36.9 57.7L36.9 57.7Q36.9 58.3 35.8 58.3L35.8 58.3Q35.3 58.3 34.9 58.0L34.9 58.0Q34.4 57.5 34.1 57.1L34.1 57.1Q33.8 57.8 32.9 58.2L32.9 58.2Q32.5 58.3 32.1 58.3Q31.8 58.3 31.5 58.1Q31.3 58.0 31.2 57.7L31.2 57.7Q31.8 56.8 31.8 55.7L31.8 55.7Q31.8 55.2 31.6 54.0Q31.3 52.8 31.0 52.0Q30.7 51.3 30.5 50.9Q30.2 50.6 30.0 50.4Q29.8 50.2 29.7 50.1Q29.6 50.0 29.6 49.9Q29.6 49.8 29.6 49.7Q29.7 49.6 29.8 49.4L29.8 49.4Q30.1 49.1 30.1 48.2L30.1 48.2Q30.1 46.3 29.5 44.6Q29.0 43.0 28.1 42.1L28.1 42.1L28.1 42.1Q28.1 41.5 29.0 41.5Q30.0 41.5 30.9 42.6L30.9 42.6Q31.4 41.5 32.6 41.5L32.6 41.5Q33.2 41.5 33.4 41.7L33.4 41.7Q33.7 41.9 33.8 42.1L33.8 42.1Q33.2 43.0 33.2 44.1L33.2 44.1Q33.2 44.7 33.3 45.5Q33.5 46.2 34.0 49.9Q34.6 53.5 34.6 53.9L34.6 53.9Q35.2 52.2 35.2 51.6Q35.2 51.0 35.1 50.7Q35.0 50.3 34.9 50.2Q34.8 50.1 34.8 50.0Q34.8 50.0 34.9 49.9L34.9 49.9Q36.5 48.1 36.5 44.5L36.5 44.5Q36.5 44.0 36.3 43.5Q36.1 43.0 36.0 42.7Q35.8 42.5 35.6 42.1L35.6 42.1L35.6 42.1Q35.6 41.9 35.8 41.8L35.8 41.8Q36.2 41.5 36.6 41.5Q37.0 41.5 37.3 41.6Q37.5 41.7 37.7 41.9L37.7 41.9Q38.1 42.2 38.3 42.6L38.3 42.6Q38.3 42.6 38.3 42.5Q38.3 42.4 38.5 42.2Q38.6 42.0 38.7 41.9Q38.9 41.8 39.2 41.6Q39.4 41.5 39.7 41.5Q40.0 41.5 40.3 41.6Q40.5 41.6 40.6 41.7L40.6 41.7Q40.9 41.9 41.0 42.1L41.0 42.1Q40.3 42.9 40.3 44.1L40.3 44.1Q40.3 45.3 41.2 49.4Q42.0 53.4 42.1 53.9L42.1 53.9Q42.4 52.2 42.4 51.6Q42.4 50.9 42.4 50.6Q42.3 50.2 42.2 50.1Q42.2 50.0 42.2 49.9Q42.2 49.9 42.2 49.8Q42.3 49.6 42.4 49.3Q42.5 48.9 42.6 48.5Q42.7 48.1 42.9 47.6Q43.0 47.0 43.1 46.5L43.1 46.5Q43.3 45.3 43.3 44.1Q43.3 42.9 42.8 42.1L42.8 42.1Q42.8 42.1 42.8 42.1Q42.8 42.0 42.9 41.9Q43.0 41.8 43.0 41.7L43.0 41.7Q43.3 41.5 43.6 41.5Q44.0 41.5 44.3 41.6Q44.5 41.7 44.7 41.9L44.7 41.9Q45.1 42.2 45.2 42.6L45.2 42.6Q45.6 42.2 46.0 41.8Q46.5 41.5 46.9 41.5M56.9 49.8L56.9 49.8Q57.4 49.9 57.8 50.3L57.8 50.3Q58.5 51.1 58.5 51.8L58.5 51.8Q58.5 52.4 59.2 53.2L59.2 53.2Q59.5 53.5 59.5 53.5Q59.5 53.6 59.2 53.9L59.2 53.9Q58.5 54.7 58.5 55.7Q58.5 56.6 58.0 57.2L58.0 57.2Q56.9 58.3 54.6 58.3L54.6 58.3Q53.5 58.3 52.7 58.1Q51.8 57.8 51.3 57.1L51.3 57.1Q51.3 57.2 51.0 57.5Q50.8 57.7 50.6 57.9L50.6 57.9Q50.0 58.3 49.5 58.3L49.5 58.3Q48.7 58.3 48.4 57.9L48.4 57.9L48.3 57.8Q49.0 57.2 49.3 56.2Q49.5 55.3 49.5 54.0Q49.5 52.8 49.4 52.0Q49.3 51.3 49.1 51.0Q49.0 50.6 48.8 50.4Q48.6 50.2 48.5 50.1Q48.4 50.0 48.4 49.9Q48.4 49.8 48.5 49.7Q48.6 49.6 48.8 49.4Q49.0 49.2 49.1 48.8L49.1 48.8Q49.5 48.0 49.5 46.2Q49.5 44.4 49.3 43.6Q49.0 42.8 48.3 42.1L48.3 42.1Q48.3 41.8 48.9 41.6L48.9 41.6Q49.1 41.5 49.5 41.5Q49.9 41.5 50.4 41.8Q50.9 42.1 51.1 42.3L51.1 42.3L51.3 42.6Q52.2 41.5 54.6 41.5L54.6 41.5Q56.2 41.5 57.3 42.1L57.3 42.1Q58.4 42.7 58.4 44.0L58.4 44.0Q58.4 44.8 58.9 45.4Q59.5 45.9 59.5 46.0Q59.5 46.0 59.3 46.2Q59.2 46.3 59.0 46.4L59.0 46.4Q58.5 46.9 58.5 47.8Q58.5 48.7 57.8 49.4L57.8 49.4Q57.4 49.8 56.9 49.8M55.6 45.9L55.6 45.9L55.6 45.3Q55.6 43.5 54.3 43.5L54.3 43.5Q53.5 43.5 53.2 43.7Q53.0 43.9 52.9 44.0Q52.8 44.2 52.7 44.4L52.7 44.4Q52.7 44.7 52.7 45.1L52.7 45.1L52.6 48.9L53.7 48.9Q55.4 48.9 55.6 46.8L55.6 46.8Q55.6 46.4 55.6 45.9M55.7 54.3L55.7 54.3L55.6 53.6Q55.6 51.9 55.0 51.3L55.0 51.3Q54.4 50.7 53.1 50.7L53.1 50.7L52.6 50.7Q52.7 50.9 52.7 52.9Q52.7 54.9 52.7 55.0Q52.7 55.2 52.8 55.5Q52.9 55.8 53.0 56.0L53.0 56.0Q53.4 56.4 54.3 56.4L54.3 56.4Q55.7 56.4 55.7 54.3M64.8 53.2L64.8 53.2Q64.8 53.2 64.8 54.0L64.8 54.0Q64.8 55.3 64.9 55.6Q65.0 55.8 65.1 55.9Q65.2 56.1 65.3 56.2Q65.4 56.2 65.5 56.3L65.5 56.3Q65.9 56.5 66.5 56.4L66.5 56.4Q67.1 56.3 67.2 55.9L67.2 55.9Q67.5 55.4 67.5 54.7Q67.5 54.1 67.5 53.9L67.5 53.9L67.5 53.3Q67.5 51.3 67.0 50.4L67.0 50.4Q66.8 50.2 66.7 50.1Q66.7 50.0 66.7 50.0Q66.7 49.9 66.8 49.8Q66.9 49.6 67.1 49.3Q67.3 49.1 67.4 48.3Q67.5 47.6 67.5 46.7Q67.5 45.9 67.5 45.7Q67.5 45.4 67.5 45.0Q67.5 44.6 67.5 44.4Q67.4 44.3 67.4 44.0Q67.3 43.8 67.2 43.7Q67.1 43.6 66.9 43.5L66.9 43.5Q66.7 43.3 66.3 43.3Q65.8 43.3 65.6 43.3Q65.4 43.4 65.2 43.6Q65.1 43.8 65.0 44.0Q64.9 44.2 64.9 44.6L64.9 44.6Q64.8 45.2 64.8 46.3Q64.8 47.4 64.9 48.0Q65.0 48.7 65.1 49.0Q65.2 49.4 65.4 49.5Q65.5 49.7 65.6 49.8Q65.7 49.9 65.7 50.0Q65.7 50.0 65.6 50.1Q65.5 50.2 65.4 50.5Q65.2 50.7 65.1 51.0L65.1 51.0Q64.8 51.8 64.8 53.2M71.4 50.9Q71.2 51.2 71.1 51.9Q71.0 52.5 71.0 53.7Q71.0 54.9 70.7 55.9Q70.4 56.9 69.7 57.6Q69.1 58.2 68.2 58.5Q67.4 58.7 66.2 58.7Q65.0 58.7 64.1 58.5Q63.2 58.2 62.6 57.6L62.6 57.6Q61.3 56.3 61.3 53.4L61.3 53.4Q61.3 50.9 60.2 50.1L60.2 50.1Q60.0 50.0 60.0 50.0Q60.0 49.9 60.2 49.8Q60.3 49.7 60.5 49.6Q60.7 49.4 60.9 49.0L60.9 49.0Q61.3 48.2 61.3 46.9Q61.3 45.5 61.5 44.6Q61.6 43.8 61.9 43.2Q62.2 42.6 62.6 42.2Q63.0 41.9 63.5 41.6Q64.1 41.4 64.7 41.3Q65.4 41.3 66.2 41.3Q67.0 41.3 67.6 41.3Q68.2 41.4 68.8 41.6Q69.4 41.9 69.8 42.2Q70.1 42.6 70.4 43.2L70.4 43.2Q71.0 44.3 71.0 46.6L71.0 46.6Q71.0 49.0 72.0 49.8L72.0 49.8Q72.2 49.9 72.2 50.0Q72.2 50.0 72.0 50.1Q71.9 50.2 71.7 50.4Q71.6 50.5 71.4 50.9M85.5 42.0L85.5 42.0L85.5 42.1Q84.4 43.0 83.4 44.6L83.4 44.6Q82.8 45.4 82.5 46.4Q82.2 47.4 82.2 48.1Q82.2 48.8 82.3 49.2Q82.5 49.6 82.6 49.8Q82.8 49.9 82.8 49.9L82.8 49.9Q82.8 50.0 82.8 50.1L82.8 50.1L82.6 50.2Q81.3 51.0 81.0 52.1L81.0 52.1Q80.8 52.6 80.8 53.8Q80.8 55.0 81.1 55.9Q81.3 56.8 82.1 57.7L82.1 57.7Q81.8 58.3 80.8 58.3Q79.8 58.3 79.0 57.1L79.0 57.1Q78.5 57.8 77.7 58.2L77.7 58.2Q77.4 58.3 77.1 58.3Q76.7 58.3 76.5 58.2Q76.2 58.1 76.1 58.0L76.1 58.0Q75.9 57.9 75.9 57.7L75.9 57.7Q76.6 56.8 76.9 55.9Q77.1 55.0 77.1 53.8Q77.1 52.7 77.0 52.2Q76.9 51.7 76.6 51.4Q76.3 51.1 76.1 50.9Q75.9 50.6 75.6 50.4Q75.3 50.2 75.1 50.0L75.1 50.0L75.1 50.0Q75.1 50.0 75.1 49.9Q75.1 49.9 75.2 49.8Q75.3 49.7 75.5 49.5L75.5 49.5Q75.8 49.1 75.8 48.2Q75.8 47.3 75.4 46.3Q75.1 45.3 74.6 44.5L74.6 44.5Q73.5 43.0 72.4 42.1L72.4 42.1Q72.4 42.0 72.4 42.0L72.4 42.0Q72.4 41.5 73.6 41.5L73.6 41.5Q74.3 41.5 75.7 42.8L75.7 42.8Q75.7 42.4 75.9 42.1L75.9 42.1Q76.3 41.5 76.7 41.5Q77.2 41.5 77.5 41.7L77.5 41.7Q78.0 41.9 78.2 42.2L78.2 42.2Q77.8 42.8 77.8 43.6Q77.8 44.3 78.3 46.7Q78.8 49.1 79.0 49.1L79.0 49.1Q79.2 49.1 79.7 46.7Q80.2 44.3 80.2 43.5Q80.2 42.8 79.9 42.2L79.9 42.2Q80.1 41.9 80.5 41.7Q80.9 41.5 81.2 41.5Q81.6 41.5 81.8 41.7Q82.1 41.8 82.2 42.0L82.2 42.0Q82.4 42.4 82.5 42.8L82.5 42.8Q83.2 42.0 83.9 41.7L83.9 41.7Q84.2 41.5 84.4 41.5L84.4 41.5Q85.5 41.5 85.5 42.0M92.4 54.6L92.4 54.6Q92.4 53.2 91.7 52.4Q91.0 51.5 89.9 51.5L89.9 51.5Q89.6 51.5 89.2 51.6Q88.9 51.7 88.8 51.7L88.8 51.7L88.7 51.6Q88.6 51.6 88.5 51.3L88.5 51.3Q88.3 50.5 87.7 50.0L87.7 50.0Q85.7 48.4 85.7 45.7L85.7 45.7Q85.7 43.6 87.1 42.4Q88.5 41.3 91.0 41.3L91.0 41.3Q92.1 41.3 92.9 41.7Q93.8 42.1 94.2 42.5L94.2 42.5Q95.2 43.4 95.2 44.8L95.2 44.8Q95.2 45.3 95.0 46.1Q94.7 46.9 94.7 47.1L94.7 47.1Q94.7 47.7 95.2 48.3L95.2 48.3Q95.0 48.2 94.7 48.2Q94.4 48.2 94.0 48.0Q93.7 47.9 93.6 47.6L93.6 47.6Q93.2 47.1 93.1 46.5L93.1 46.5Q93.0 46.6 92.5 46.7Q92.1 46.9 91.7 46.9Q91.4 46.9 91.2 46.8Q91.0 46.7 90.8 46.6Q90.7 46.5 90.7 46.3L90.7 46.3Q90.6 46.1 90.6 46.0L90.6 46.0Q91.3 46.0 91.7 45.7Q92.2 45.4 92.2 44.7Q92.2 44.0 91.8 43.7Q91.4 43.3 90.9 43.3L90.9 43.3Q89.3 43.3 89.3 45.2L89.3 45.2Q89.3 46.9 90.1 47.7L90.1 47.7Q90.6 48.1 91.0 48.1Q91.5 48.1 92.0 48.0Q92.5 47.9 92.6 47.9Q92.6 47.9 92.7 48.1L92.7 48.1Q93.1 49.0 93.5 49.4L93.5 49.4Q94.7 50.1 95.3 51.3Q96.0 52.5 96.0 53.8Q96.0 55.1 95.5 56.1Q95.1 57.0 94.3 57.6L94.3 57.6Q92.7 58.7 90.6 58.7L90.6 58.7Q88.7 58.7 87.3 57.7L87.3 57.7Q86.7 57.2 86.3 56.4Q85.9 55.6 85.9 54.9Q85.9 54.2 86.1 53.4Q86.4 52.6 86.4 52.2Q86.4 51.8 86.1 51.3L86.1 51.3Q86.2 51.2 86.4 51.2L86.4 51.2Q87.1 51.2 87.6 51.8Q88.1 52.5 88.1 53.1L88.1 53.1Q88.8 52.8 89.3 52.8Q89.8 52.8 90.0 52.9Q90.3 53.0 90.4 53.1L90.4 53.1Q90.6 53.4 90.6 53.6L90.6 53.6L90.6 53.6Q90.0 53.7 89.5 54.2Q89.1 54.6 89.1 55.3Q89.1 55.9 89.5 56.2Q89.9 56.6 90.6 56.6Q91.2 56.6 91.8 56.0Q92.4 55.5 92.4 54.6","m"]],"BAB":[["M27.1 39.4L27.1 39.4Q27.1 41.4 26.0 42.9Q24.9 44.5 23.0 45.5L23.0 45.5Q24.2 46.4 25.0 47.6Q25.7 48.8 25.7 50.2L25.7 50.2Q25.7 52.0 24.6 53.7Q23.6 55.3 21.9 56.7Q20.1 58.0 17.9 58.8Q15.7 59.6 13.3 59.6L13.3 59.6Q10.8 59.6 8.9 58.6Q7.1 57.7 6.0 55.9L6.0 55.9Q6.3 55.0 6.9 53.5Q7.4 52.1 8.0 50.5Q8.7 48.9 9.3 47.3Q10.0 45.7 10.6 44.5L10.6 44.5Q11.8 41.7 12.8 39.9Q13.7 38.1 14.5 37.1L14.5 37.1Q12.8 37.6 11.3 38.3Q9.9 39.0 9.2 39.7L9.2 39.7Q8.9 39.5 8.6 39.1Q8.3 38.7 8.0 38.2Q7.7 37.8 7.6 37.3Q7.4 36.8 7.4 36.4L7.4 36.4Q8.2 35.8 9.5 35.3Q10.9 34.8 12.4 34.4Q14.0 34.0 15.7 33.8Q17.3 33.5 18.9 33.5L18.9 33.5Q22.7 33.5 24.9 35.1Q27.1 36.6 27.1 39.4M14.8 47.1L14.8 47.1Q14.2 46.8 13.7 46.2L13.7 46.2Q13.0 47.8 12.3 49.4Q11.6 51.0 11.1 52.3Q10.6 53.7 10.3 54.7Q10.0 55.7 9.9 56.2L9.9 56.2Q10.4 56.4 11.0 56.5Q11.6 56.7 12.6 56.7L12.6 56.7Q14.8 56.7 16.8 56.1Q18.8 55.4 20.3 54.4Q21.8 53.3 22.7 52.0Q23.6 50.6 23.6 49.2L23.6 49.2Q23.6 47.0 21.8 46.1L21.8 46.1Q19.2 47.1 16.1 47.1L16.1 47.1Q15.6 47.1 15.4 47.1Q15.2 47.1 14.8 47.1M21.1 35.9L21.1 35.9Q20.4 35.9 19.6 36.0Q18.9 36.0 18.1 36.2L18.1 36.2Q18.2 36.3 18.3 36.5Q18.3 36.6 18.4 36.8L18.4 36.8Q18.1 37.2 17.7 37.9Q17.3 38.7 16.8 39.6Q16.2 40.6 15.7 41.8Q15.1 43.0 14.5 44.3L14.5 44.3Q15.1 44.1 15.9 44.1Q16.7 44.0 17.4 44.0L17.4 44.0Q17.9 44.0 18.3 44.0Q18.7 44.0 19.1 44.1L19.1 44.1Q20.6 43.8 21.8 43.3Q23.1 42.8 24.0 42.2Q24.9 41.5 25.4 40.7Q25.8 39.9 25.8 39.0L25.8 39.0Q25.8 37.5 24.6 36.7Q23.4 35.9 21.1 35.9M26.9 56.5L26.9 56.5Q27.1 55.5 27.5 54.0Q27.9 52.5 28.4 50.8Q29.0 49.0 29.6 47.3Q30.2 45.5 30.8 44.2L30.8 44.2Q31.2 43.2 31.5 42.6Q31.8 42.0 32.2 41.7L32.2 41.7Q32.7 41.7 33.2 41.9Q33.6 42.0 34.1 42.3Q34.5 42.5 34.9 42.7Q35.3 43.0 35.5 43.2L35.5 43.2Q34.6 44.2 33.9 45.5Q33.3 46.9 32.6 48.9L32.6 48.9Q34.3 47.4 35.7 46.0Q37.0 44.6 38.2 42.8L38.2 42.8Q38.4 42.6 38.8 42.6L38.8 42.6Q39.3 42.6 39.7 42.8Q40.1 42.9 40.3 43.2L40.3 43.2Q39.7 44.7 39.7 46.3L39.7 46.3Q39.7 47.7 40.1 48.4L40.1 48.4Q40.1 48.6 39.7 49.1Q39.3 49.7 38.8 50.2L38.8 50.2Q37.9 49.7 37.3 48.9Q36.6 48.1 36.3 47.2L36.3 47.2Q34.7 48.3 33.7 49.3Q32.6 50.3 31.9 51.5Q31.1 52.8 30.6 54.4Q30.0 56.0 29.6 58.2L29.6 58.2Q29.3 58.2 28.9 58.0Q28.5 57.8 28.1 57.6Q27.7 57.3 27.3 57.0Q27.0 56.7 26.9 56.5M51.8 44.1L51.8 44.1Q52.1 44.1 52.5 44.2Q53.0 44.3 53.3 44.5Q53.7 44.7 53.9 44.9Q54.2 45.1 54.2 45.2L54.2 45.2Q53.5 46.6 53.0 48.0Q52.4 49.3 52.0 50.6Q51.7 51.8 51.5 52.9Q51.2 54.0 51.2 54.8L51.2 54.8Q51.2 55.7 51.4 56.3Q51.6 56.9 52.1 57.2L52.1 57.2Q51.7 57.4 51.1 57.6Q50.5 57.8 50.0 57.8L50.0 57.8Q48.2 57.8 48.2 55.4L48.2 55.4Q48.2 53.5 49.5 50.4L49.5 50.4Q48.8 51.8 48.0 53.1Q47.1 54.4 46.3 55.4Q45.4 56.4 44.5 57.1Q43.6 57.7 42.9 57.8L42.9 57.8Q41.7 57.8 41.0 56.7Q40.2 55.6 40.2 53.9L40.2 53.9Q40.2 52.1 41.0 50.1Q41.8 48.1 43.0 46.4Q44.2 44.7 45.6 43.6Q47.0 42.4 48.3 42.4L48.3 42.4Q48.7 42.5 49.1 42.7Q49.5 43.0 49.8 43.4Q50.2 43.8 50.5 44.2Q50.7 44.6 50.8 44.9L50.8 44.9Q49.5 45.1 48.1 46.2Q46.7 47.2 45.6 48.7Q44.5 50.2 43.8 51.9Q43.1 53.6 43.1 55.1L43.1 55.1Q43.1 55.7 43.5 55.9L43.5 55.9Q44.5 55.7 45.7 54.3Q46.9 52.9 48.7 50.0L48.7 50.0Q49.0 49.4 49.4 48.7Q49.8 48.0 50.2 47.2Q50.6 46.4 51.0 45.6Q51.4 44.8 51.8 44.1M57.2 45.7L57.2 45.7Q57.2 45.1 57.3 44.6Q57.4 44.1 57.6 43.7Q57.9 43.4 58.3 43.1Q58.8 42.9 59.5 42.9L59.5 42.9Q60.0 42.9 60.5 43.0Q61.1 43.1 61.4 43.4L61.4 43.4Q61.2 43.9 61.1 44.4Q61.1 44.8 61.0 45.3Q61.0 45.8 60.9 46.5Q60.9 47.2 60.9 48.3L60.9 48.3Q60.8 50.4 60.7 52.2Q60.5 53.9 60.0 55.6L60.0 55.6Q60.0 55.7 60.1 55.7L60.1 55.7Q60.6 55.4 61.2 54.7Q61.8 54.0 62.5 53.2Q63.2 52.3 63.8 51.4Q64.5 50.4 65.1 49.4L65.1 49.4Q65.9 48.1 66.8 46.1Q67.7 44.0 68.4 41.7L68.4 41.7Q68.5 41.7 68.9 41.8Q69.2 41.9 69.5 42.0Q69.8 42.1 70.0 42.2Q70.3 42.4 70.3 42.5L70.3 42.5Q70.3 43.8 69.7 45.3Q69.1 46.7 68.3 48.1Q67.4 49.4 66.5 50.6Q65.5 51.8 64.8 52.7L64.8 52.7Q63.2 54.5 61.7 55.9Q60.1 57.3 57.9 58.7L57.9 58.7Q57.1 58.3 56.6 57.8Q56.1 57.3 56.1 56.7L56.1 56.7Q56.1 56.3 56.3 55.8Q56.5 55.3 56.7 54.5Q56.9 53.7 57.1 52.5Q57.3 51.4 57.3 49.5L57.3 49.5Q57.3 48.5 57.3 47.4Q57.2 46.3 57.2 45.7M81.4 43.8L81.4 43.8Q81.3 45.8 80.7 47.2Q80.1 48.6 79.0 49.7Q78.0 50.8 76.4 51.7Q74.9 52.5 72.8 53.3L72.8 53.3Q72.8 53.5 72.8 53.8Q72.8 54.0 72.8 54.2L72.8 54.2Q72.8 54.6 72.8 55.1Q72.9 55.5 73.1 55.9Q73.2 56.3 73.5 56.5Q73.8 56.8 74.2 56.8L74.2 56.8Q75.1 56.8 76.0 56.4Q76.8 56.0 77.6 55.4Q78.3 54.9 79.0 54.2Q79.6 53.5 80.1 53.0L80.1 53.0Q80.5 53.3 80.7 53.5L80.7 53.5Q79.2 55.5 77.5 56.7Q75.8 58.0 74.2 58.4L74.2 58.4Q72.0 58.1 70.8 56.7Q69.5 55.4 69.5 53.4L69.5 53.4Q69.5 52.1 69.9 50.8Q70.3 49.4 70.9 48.1Q71.6 46.8 72.5 45.7Q73.4 44.6 74.4 43.7Q75.4 42.9 76.5 42.4Q77.6 41.9 78.6 41.9L78.6 41.9Q80.1 42.1 81.4 43.8M79.2 44.8L79.2 44.8Q78.3 45.0 77.4 45.5Q76.4 46.1 75.6 47.1Q74.8 48.1 74.1 49.4Q73.4 50.6 73.1 52.1L73.1 52.1Q75.6 50.8 77.3 48.9Q79.0 47.1 79.2 44.8M94.0 44.3L94.0 44.3Q94.0 44.9 93.8 45.6Q93.6 46.2 93.4 46.8Q93.1 47.3 92.8 47.6Q92.5 48.0 92.3 48.0L92.3 48.0Q91.9 48.0 91.8 47.5L91.8 47.5Q91.8 47.4 91.9 47.2Q92.0 47.0 92.1 46.7Q92.2 46.5 92.3 46.2Q92.4 46.0 92.4 45.8L92.4 45.8Q92.4 45.3 92.1 45.0Q91.9 44.7 91.6 44.7L91.6 44.7Q90.3 44.7 89.6 46.3Q88.9 47.9 88.9 51.1L88.9 51.1Q88.9 51.4 89.0 51.4L89.0 51.4Q89.6 51.4 90.2 51.4Q90.7 51.4 91.2 51.4L91.2 51.4Q91.3 51.4 91.3 51.6L91.3 51.6Q91.3 51.9 91.1 52.1L91.1 52.1Q90.4 52.2 90.0 52.3Q89.5 52.4 89.3 52.5Q89.1 52.6 89.0 52.8Q89.0 52.9 89.0 53.1L89.0 53.1Q89.0 53.3 89.0 53.6Q89.0 53.8 89.0 54.2L89.0 54.2Q89.0 56.9 87.5 58.6Q86.1 60.2 83.5 60.5L83.5 60.5Q83.0 60.4 82.5 60.2Q82.0 60.0 81.6 59.6Q81.2 59.3 80.9 58.8Q80.5 58.4 80.4 58.0L80.4 58.0Q80.4 56.7 80.9 55.6Q81.4 54.5 82.3 53.7Q83.2 52.8 84.4 52.3Q85.6 51.7 87.0 51.6L87.0 51.6Q87.0 50.8 86.9 50.1Q86.7 49.3 86.5 48.6Q86.4 47.8 86.2 47.1Q86.0 46.5 86.0 45.8L86.0 45.8Q86.0 44.9 86.4 44.1Q86.7 43.2 87.3 42.5Q87.9 41.7 88.7 41.2Q89.5 40.7 90.3 40.5L90.3 40.5Q90.6 40.6 91.2 41.1Q91.8 41.6 92.4 42.1Q93.0 42.7 93.5 43.3Q93.9 43.9 94.0 44.3M83.4 59.0L83.4 59.0Q84.1 58.7 84.8 58.1Q85.5 57.4 86.0 56.7Q86.6 55.9 86.9 55.0Q87.2 54.2 87.2 53.3L87.2 53.3Q86.5 53.4 85.8 53.9Q85.0 54.4 84.3 55.1Q83.6 55.8 83.2 56.5Q82.7 57.3 82.7 57.8L82.7 57.8Q82.7 58.5 83.4 59.0","m"],["M12 78 L88 70 M80 64 L90 70 L80 76","u"]],"BLV":[["M13.7 59.3L13.7 59.3L4.9 59.3Q4.0 59.3 4.0 58.4L4.0 58.4L4.0 41.6Q4.0 40.7 4.9 40.7L4.9 40.7L13.7 40.7Q16.9 40.7 18.5 42.0Q20.0 43.3 20.0 46.0L20.0 46.0L20.0 54.0Q20.0 56.7 18.5 58.0Q16.9 59.3 13.7 59.3M13.0 45.6L9.9 45.6L9.9 54.4L13.0 54.4Q14.2 54.4 14.2 53.2L14.2 53.2L14.2 46.9Q14.2 45.6 13.0 45.6L13.0 45.6M28.6 54.8L28.6 58.4Q28.6 59.3 27.6 59.3L27.6 59.3L23.8 59.3Q22.9 59.3 22.9 58.4L22.9 58.4L22.9 51.6Q22.9 50.8 23.2 49.8Q23.4 48.8 23.9 47.4L23.9 47.4L26.2 41.5Q26.5 40.7 27.5 40.7L27.5 40.7L34.5 40.7Q35.5 40.7 35.7 41.5L35.7 41.5L38.0 47.4Q38.5 48.8 38.8 49.8Q39.0 50.8 39.0 51.6L39.0 51.6L39.0 58.4Q39.0 59.3 38.1 59.3L38.1 59.3L34.2 59.3Q33.2 59.3 33.2 58.4L33.2 58.4L33.2 54.8L28.6 54.8M30.1 46.1L30.1 46.1L28.8 50.1L32.9 50.1L31.7 46.1Q31.5 45.7 31.2 45.7L31.2 45.7L30.5 45.7Q30.2 45.7 30.1 46.1M55.6 40.7L55.6 40.7L59.4 40.7Q60.3 40.7 60.3 41.6L60.3 41.6L60.3 51.7Q60.3 52.5 60.3 53.2Q60.2 53.9 59.9 54.9L59.9 54.9L58.6 58.4Q58.5 58.8 58.2 59.0Q58.0 59.3 57.6 59.3L57.6 59.3L54.1 59.3Q53.7 59.3 53.4 59.1Q53.1 59.0 52.9 58.5L52.9 58.5L51.7 54.3Q51.6 53.9 51.3 53.9L51.3 53.9L51.0 53.9Q50.7 53.9 50.6 54.3L50.6 54.3L49.4 58.5Q49.1 59.3 48.3 59.3L48.3 59.3L44.9 59.3Q44.4 59.3 44.1 59.1Q43.8 58.8 43.7 58.4L43.7 58.4L42.4 54.8Q42.1 53.9 42.0 53.1Q42.0 52.4 42.0 51.6L42.0 51.6L42.0 41.6Q42.0 40.7 42.9 40.7L42.9 40.7L46.9 40.7Q47.8 40.7 47.8 41.6L47.8 41.6L47.8 51.1L49.3 47.9Q49.5 47.4 49.8 47.3Q50.2 47.1 50.7 47.1L50.7 47.1L51.8 47.1Q52.3 47.1 52.6 47.3Q52.9 47.4 53.1 47.9L53.1 47.9L54.6 51.1L54.6 41.6Q54.6 40.7 55.6 40.7M77.9 59.3L77.9 59.3L69.8 59.3Q66.5 59.3 65.0 58.0Q63.4 56.7 63.4 54.0L63.4 54.0L63.4 46.0Q63.4 43.3 65.0 42.0Q66.5 40.7 69.8 40.7L69.8 40.7L76.2 40.7Q77.2 40.7 77.2 41.6L77.2 41.6L77.2 44.7Q77.2 45.7 76.2 45.7L76.2 45.7L70.9 45.7Q69.3 45.7 69.3 47.0L69.3 47.0L69.3 53.2Q69.3 54.4 70.5 54.4L70.5 54.4L73.0 54.4L73.0 50.4Q73.0 49.5 73.9 49.5L73.9 49.5L77.9 49.5Q78.8 49.5 78.8 50.4L78.8 50.4L78.8 58.4Q78.8 59.3 77.9 59.3M90.6 59.3L90.6 59.3L82.5 59.3Q81.5 59.3 81.5 58.4L81.5 58.4L81.5 55.4Q81.5 54.4 82.5 54.4L82.5 54.4L89.4 54.4Q89.8 54.4 89.9 54.2Q90.1 54.0 90.1 53.7L90.1 53.7Q90.1 53.2 89.9 53.0Q89.8 52.8 89.4 52.8L89.4 52.8L85.5 52.3Q83.7 52.0 82.6 51.0Q81.5 50.1 81.5 48.0L81.5 48.0L81.5 45.2Q81.5 43.0 83.0 41.9Q84.4 40.7 86.9 40.7L86.9 40.7L94.1 40.7Q95.1 40.7 95.1 41.6L95.1 41.6L95.1 44.7Q95.1 45.6 94.1 45.6L94.1 45.6L88.1 45.6Q87.4 45.6 87.4 46.4L87.4 46.4Q87.4 47.2 88.1 47.2L88.1 47.2L92.0 47.7Q93.2 47.9 94.1 48.4Q95.0 48.8 95.5 49.7Q96.0 50.6 96.0 52.0L96.0 52.0L96.0 54.8Q96.0 57.0 94.6 58.1Q93.2 59.3 90.6 59.3","m"]],"ARB":[["M47.0 21.1L59.1 65.1L62.0 65.1L62.0 76.9L33.9 76.9L33.9 65.1L38.2 65.1L37.1 59.4L27.3 59.4L26.2 65.1L30.5 65.1L30.5 76.9L6.0 76.9L6.0 65.1L8.9 65.1L21.0 21.1L47.0 21.1M31.9 37.5L28.9 51.8L35.5 51.8L32.6 37.5L31.9 37.5","m"],["M40.0 84.5L40.0 72.9L43.5 72.9L43.5 41.1L40.0 41.1L40.0 29.5L72.4 29.5Q81.6 29.5 86.4 33.3Q91.2 37.0 91.2 45.4L91.2 45.4Q91.2 50.1 89.3 53.6Q87.4 57.1 83.8 58.4L83.8 58.4L83.9 59.1Q90.7 60.2 90.7 67.5L90.7 67.5L90.7 72.9L94.0 72.9L94.0 84.5L71.6 84.5L71.6 67.9Q71.6 65.1 70.8 63.7Q70.0 62.3 68.2 61.8Q66.5 61.3 63.3 61.3L63.3 61.3L63.3 72.9L68.0 72.9L68.0 84.5L40.0 84.5M63.3 52.7L67.1 52.7Q69.2 52.7 70.2 51.6Q71.2 50.5 71.2 48.2L71.2 48.2L71.2 45.6Q71.2 43.3 70.2 42.2Q69.2 41.1 67.1 41.1L67.1 41.1L63.3 41.1L63.3 52.7","a"]],"ELP":[["M16.9 56.7L12.2 56.7L4.0 43.3L8.7 43.3L16.9 56.7M16.9 43.3L16.9 55.5L13.0 49.0L13.0 43.3L16.9 43.3M7.9 56.7L4.0 56.7L4.0 44.5L7.9 50.9L7.9 56.7M29.4 56.7L25.9 56.7L25.9 54.0L27.6 54.0L27.6 46.0L25.9 46.0L25.9 43.3L29.4 43.3L32.1 46.0L32.1 54.0L29.4 56.7M25.2 56.7L21.7 56.7L19.0 54.0L19.0 46.0L21.7 43.3L25.2 43.3L25.2 46.0L23.5 46.0L23.5 54.0L25.2 54.0L25.2 56.7M45.4 51.2L42.1 56.7L34.2 43.3L38.9 43.3L42.5 49.3L45.4 44.4L45.4 51.2M50.5 56.7L46.0 56.7L46.0 43.3L50.5 43.3L50.5 56.7M38.3 56.7L34.1 56.7L34.1 44.5L38.3 51.5L38.3 56.7M66.8 56.7L62.3 56.7L61.7 55.3L57.3 55.3L58.3 52.6L60.7 52.6L57.1 43.3L61.5 43.3L66.8 56.7M56.1 56.7L51.8 56.7L56.6 43.9L58.6 49.2L56.1 56.7M78.4 56.7L73.3 56.7L73.3 54.0L76.6 54.0L76.6 46.0L73.3 46.0L73.3 43.3L78.4 43.3L81.1 46.0L81.1 54.0L78.4 56.7M72.6 56.7L68.1 56.7L68.1 43.3L72.6 43.3L72.6 56.7M93.3 56.7L91.5 56.7L91.5 51.7L85.7 51.7L83.0 49.0L83.0 46.0L85.7 43.3L87.2 43.3L87.2 48.0L93.4 48.0L96.0 50.7L96.0 54.0L93.3 56.7M95.6 47.0L91.5 47.0L91.5 45.7L87.9 45.7L87.9 43.3L93.3 43.3L95.6 45.6L95.6 47.0M90.8 56.7L85.2 56.7L83.0 54.0L83.0 52.7L87.5 52.7L87.5 54.3L90.8 54.3L90.8 56.7","m"]],"WBK":[["M24.0 26.0L24.0 26.0Q25.3 26.0 26.1 26.8Q26.9 27.5 26.8 29.3L26.8 29.3Q26.8 30.0 26.5 31.7Q26.3 33.4 25.9 35.7Q25.5 38.0 25.1 40.6Q24.6 43.3 24.2 45.8L24.2 45.8L25.0 45.8Q25.3 45.8 25.8 45.8Q26.2 45.7 26.7 45.7L26.7 45.7Q26.5 46.1 26.3 46.5Q26.1 46.9 25.9 47.2L25.9 47.2Q25.6 47.5 25.3 47.8L25.3 47.8Q25.0 48.2 24.6 48.5Q24.1 48.8 23.7 49.0L23.7 49.0Q23.5 50.8 23.3 52.2Q23.1 53.6 23.1 54.5L23.1 54.5Q23.0 55.9 23.2 57.1L23.2 57.1Q23.3 58.2 23.6 59.3Q24.0 60.3 24.7 61.0L24.7 61.0L20.4 62.4Q20.0 61.8 19.8 60.7Q19.6 59.7 19.5 58.7L19.5 58.7Q19.4 57.5 19.5 56.2L19.5 56.2Q19.6 54.9 19.9 52.8Q20.2 50.8 20.6 48.3L20.6 48.3Q19.9 48.1 19.0 47.9Q18.2 47.8 17.1 47.8L17.1 47.8Q16.2 47.8 15.1 47.9Q14.1 47.9 13.0 48.0L13.0 48.0Q12.6 49.7 12.2 51.5L12.2 51.5Q11.7 53.4 11.3 54.8Q10.9 56.1 10.6 57.1Q10.2 58.0 9.9 58.5Q9.5 59.1 9.1 59.3L9.1 59.3Q8.7 59.5 8.0 59.7L8.0 59.7Q7.4 59.9 6.5 60.1Q5.5 60.3 4.0 60.4L4.0 60.4Q4.5 59.7 5.0 59.2Q5.4 58.6 5.8 57.8Q6.2 57.0 6.7 55.8Q7.1 54.5 7.9 52.4L7.9 52.4Q8.2 51.6 8.6 50.6Q8.9 49.6 9.3 48.5L9.3 48.5Q8.0 48.7 7.1 48.9Q6.2 49.0 6.0 49.1L6.0 49.1Q5.7 49.1 5.5 49.1L5.5 49.1Q5.1 49.0 5.0 48.6L5.0 48.6Q5.1 48.1 5.4 47.9Q5.7 47.7 6.3 47.5L6.3 47.5Q6.6 47.3 7.6 46.9Q8.7 46.5 10.2 46.1L10.2 46.1Q10.7 44.6 11.3 43.1Q11.8 41.5 12.3 40.1Q12.8 38.7 13.3 37.5Q13.8 36.3 14.2 35.4L14.2 35.4Q14.8 34.1 15.8 32.4Q16.7 30.8 18.0 29.4Q19.3 27.9 20.8 27.0Q22.3 26.0 24.0 26.0M23.6 33.7L23.6 33.7Q24.0 32.0 24.1 31.0Q24.3 29.9 24.2 29.3Q24.2 28.7 24.0 28.4Q23.8 28.2 23.5 28.2L23.5 28.2Q23.0 28.2 22.3 28.6Q21.6 28.9 20.9 29.6Q20.1 30.3 19.4 31.3Q18.6 32.3 18.0 33.6L18.0 33.6Q17.2 35.5 16.1 38.3Q15.1 41.0 13.8 45.3L13.8 45.3Q14.5 45.2 15.3 45.1Q16.0 45.0 16.7 45.0L16.7 45.0Q17.9 45.0 19.0 45.1Q20.2 45.2 21.1 45.3L21.1 45.3Q21.5 43.6 21.8 41.9Q22.2 40.2 22.5 38.6Q22.8 37.1 23.1 35.8Q23.4 34.5 23.6 33.7M39.7 54.5L39.7 54.5Q38.9 54.5 38.3 54.2Q37.7 53.9 37.3 53.4Q36.9 52.9 36.8 52.2Q36.7 51.5 36.9 50.8L36.9 50.8Q37.0 50.2 37.3 49.4Q37.5 48.5 37.8 47.5Q38.1 46.5 38.3 45.5Q38.6 44.5 38.6 43.7Q38.7 42.8 38.6 42.3Q38.4 41.8 37.9 41.8L37.9 41.8Q37.4 41.8 36.7 42.2Q36.1 42.6 35.5 43.2Q34.8 43.9 34.2 44.7Q33.5 45.6 32.9 46.5L32.9 46.5Q32.6 47.8 32.4 48.7Q32.2 49.6 32.0 50.4Q31.8 51.1 31.7 51.7Q31.5 52.3 31.4 52.8L31.4 52.8Q31.3 53.1 30.8 53.5Q30.2 53.8 29.6 54.1Q29.0 54.3 28.5 54.3Q28.1 54.3 28.1 53.9L28.1 53.9Q28.2 53.7 28.4 53.0Q28.6 52.2 28.8 51.1Q29.1 50.1 29.4 48.9Q29.7 47.8 30.0 46.7L30.0 46.7Q30.1 45.9 30.4 44.8L30.4 44.8Q30.5 43.9 30.8 42.8Q31.1 41.6 31.5 40.2L31.5 40.2Q31.7 40.0 32.0 39.9Q32.3 39.7 32.6 39.7L32.6 39.7Q32.8 39.6 33.2 39.5L33.2 39.5Q33.5 39.5 33.8 39.6L33.8 39.6Q34.0 39.6 34.3 39.7Q34.6 39.8 34.8 40.0L34.8 40.0Q34.7 40.2 34.5 40.7Q34.4 41.1 34.2 41.6L34.2 41.6Q34.1 42.2 33.9 42.8L33.9 42.8Q34.3 42.2 35.0 41.5Q35.6 40.8 36.3 40.3Q37.0 39.7 37.8 39.4Q38.6 39.0 39.4 39.0L39.4 39.0Q40.1 39.0 40.7 39.4Q41.2 39.8 41.5 40.6Q41.9 41.3 41.9 42.3Q42.0 43.3 41.6 44.4L41.6 44.4L41.2 46.0Q41.0 46.8 40.8 47.8Q40.5 48.9 40.1 50.1L40.1 50.1Q39.9 50.9 39.9 51.5Q40.0 52.1 40.6 52.1L40.6 52.1Q41.3 52.1 42.3 51.3Q43.3 50.5 44.3 49.4Q45.4 48.2 46.3 47.0Q47.2 45.9 47.7 45.1L47.7 45.1Q48.0 44.6 48.3 44.5Q48.6 44.4 48.8 44.5Q48.9 44.6 48.9 45.0Q48.9 45.3 48.6 45.9L48.6 45.9Q48.4 46.4 47.8 47.3Q47.3 48.1 46.6 49.1Q45.8 50.0 45.0 51.0Q44.2 52.0 43.2 52.8Q42.3 53.5 41.4 54.0Q40.5 54.5 39.7 54.5M55.8 58.8L55.8 58.8Q55.7 59.7 55.4 61.0Q55.1 62.4 54.8 63.8Q54.4 65.3 54.0 66.7Q53.5 68.2 52.9 69.3Q52.4 70.5 51.7 71.2Q51.1 72.0 50.3 72.0L50.3 72.0Q49.1 72.0 48.2 71.2Q47.3 70.5 46.8 69.4Q46.2 68.4 45.9 67.1Q45.6 65.9 45.6 64.8L45.6 64.8Q45.6 63.4 45.9 62.4Q46.1 61.4 46.8 60.5Q47.4 59.7 48.5 58.7Q49.6 57.7 51.3 56.2L51.3 56.2Q52.2 55.5 52.9 54.8Q53.7 54.2 54.4 53.6L54.4 53.6Q54.6 52.9 54.8 52.2Q54.9 51.6 55.0 51.1L55.0 51.1Q54.1 52.4 52.7 53.2Q51.4 54.1 49.7 54.1L49.7 54.1Q48.1 54.1 47.1 52.7Q46.2 51.3 46.2 48.6L46.2 48.6Q46.2 47.2 46.7 45.4Q47.2 43.7 48.2 42.2Q49.1 40.6 50.5 39.6Q51.9 38.5 53.6 38.5L53.6 38.5Q54.4 38.5 55.0 38.9Q55.6 39.3 56.0 39.9Q56.4 40.5 56.6 41.2Q56.8 41.9 56.9 42.4L56.9 42.4Q57.0 42.2 57.0 42.0Q57.1 41.8 57.2 41.6L57.2 41.6Q57.5 40.3 58.0 39.9Q58.4 39.4 59.4 39.4L59.4 39.4Q59.9 39.4 60.2 39.6Q60.6 39.8 60.6 39.9L60.6 39.9Q60.4 40.3 60.3 40.5Q60.2 40.8 60.0 41.0Q59.9 41.2 59.8 41.6Q59.7 42.0 59.5 42.7L59.5 42.7Q59.5 42.9 59.3 43.9Q59.1 44.8 58.7 46.1Q58.4 47.4 58.1 48.9Q57.7 50.4 57.4 51.9L57.4 51.9Q58.4 51.3 59.5 50.5Q60.6 49.6 61.6 48.7Q62.6 47.9 63.4 47.1Q64.1 46.3 64.5 45.8L64.5 45.8Q64.8 45.3 65.2 45.2Q65.5 45.0 65.8 45.0Q66.1 45.1 66.1 45.4Q66.2 45.6 65.9 46.1L65.9 46.1Q65.1 47.5 63.9 48.7Q62.6 50.0 61.4 51.1Q60.1 52.1 58.9 53.0Q57.7 53.8 56.9 54.3L56.9 54.3Q56.5 56.0 56.3 57.0Q56.0 58.0 55.8 58.8M51.2 51.6L51.2 51.6Q52.0 51.6 52.7 51.2Q53.3 50.8 53.9 50.3Q54.4 49.8 54.8 49.2Q55.2 48.7 55.4 48.3L55.4 48.3Q55.5 48.0 55.7 47.5Q55.9 46.9 56.0 46.4Q56.1 45.9 56.1 45.5Q56.1 45.1 55.8 45.0L55.8 45.0Q55.6 45.0 55.5 44.8Q55.4 44.5 55.3 44.2Q55.2 43.8 55.2 43.5Q55.2 43.2 55.1 42.9L55.1 42.9Q55.0 41.6 54.5 41.1Q54.1 40.5 53.5 40.5L53.5 40.5Q52.6 40.5 51.8 41.2Q51.0 41.9 50.3 43.1Q49.7 44.2 49.3 45.6Q49.0 47.0 49.0 48.2L49.0 48.2Q49.0 49.8 49.4 50.7Q49.8 51.6 51.2 51.6M49.5 68.6L49.5 68.6Q50.3 68.6 50.7 67.5Q51.2 66.5 51.7 64.6L51.7 64.6Q51.8 64.2 52.0 63.3Q52.2 62.5 52.5 61.4Q52.8 60.4 53.1 59.2Q53.3 57.9 53.7 56.7L53.7 56.7Q53.4 56.9 53.1 57.2Q52.8 57.5 52.4 57.9L52.4 57.9Q51.6 58.6 50.9 59.3Q50.1 60.1 49.5 60.8Q49.0 61.6 48.6 62.5Q48.3 63.5 48.3 64.7L48.3 64.7Q48.3 65.9 48.4 66.6Q48.4 67.4 48.6 67.9Q48.8 68.3 49.0 68.5Q49.2 68.6 49.5 68.6M80.0 46.0L80.0 46.0Q78.9 47.6 77.5 49.1Q76.1 50.6 74.6 51.8Q73.0 53.0 71.4 53.8Q69.8 54.5 68.2 54.5L68.2 54.5Q67.4 54.5 66.5 54.1Q65.5 53.7 64.8 52.9Q64.0 52.1 63.5 50.8Q63.1 49.5 63.3 47.7L63.3 47.7Q63.4 46.2 64.2 44.6Q65.0 42.9 66.1 41.5Q67.3 40.1 68.7 39.2Q70.2 38.3 71.7 38.3L71.7 38.3Q73.0 38.3 73.7 39.0Q74.3 39.7 74.2 40.7L74.2 40.7Q74.1 41.8 73.6 42.8Q73.0 43.7 72.3 44.5Q71.6 45.3 70.8 45.9Q69.9 46.5 69.2 47.0L69.2 47.0Q68.4 47.6 67.7 48.1Q66.9 48.6 66.4 49.0L66.4 49.0Q66.4 49.9 66.7 50.5Q67.0 51.1 67.4 51.5Q67.9 51.9 68.5 52.1Q69.0 52.2 69.6 52.2L69.6 52.2Q70.8 52.2 72.2 51.4Q73.6 50.6 74.9 49.5Q76.2 48.4 77.3 47.2Q78.4 46.0 79.1 45.1L79.1 45.1Q79.4 44.8 79.7 44.8Q79.9 44.7 80.1 44.8Q80.3 45.0 80.3 45.3Q80.3 45.6 80.0 46.0M70.6 40.4L70.6 40.4Q70.2 40.4 69.6 40.8Q69.0 41.2 68.4 42.1Q67.8 42.9 67.3 44.1Q66.8 45.3 66.5 46.8L66.5 46.8Q67.0 46.5 67.5 46.1Q68.0 45.8 68.5 45.4L68.5 45.4Q70.1 44.2 70.7 43.3Q71.3 42.3 71.4 41.7L71.4 41.7Q71.5 41.0 71.3 40.7Q71.0 40.4 70.6 40.4M76.8 53.0L76.8 53.0Q78.4 46.3 79.4 42.2Q80.4 38.1 80.9 35.9L80.9 35.9Q81.5 33.3 81.7 32.3L81.7 32.3Q81.8 31.6 81.9 31.0L81.9 31.0Q81.9 30.4 81.9 29.8Q81.9 29.2 81.8 28.6L81.8 28.6Q82.1 28.5 82.5 28.4Q82.8 28.2 83.2 28.2L83.2 28.2Q83.6 28.1 84.0 28.0L84.0 28.0Q84.4 27.9 84.7 27.9L84.7 27.9Q85.0 27.9 85.2 28.0Q85.5 28.0 85.6 28.2L85.6 28.2Q85.8 28.4 85.8 28.9Q85.7 29.5 85.7 30.1L85.7 30.1Q85.5 30.8 85.3 31.6L85.3 31.6Q84.9 33.1 84.1 36.1L84.1 36.1Q83.5 38.6 82.4 43.0Q81.2 47.4 79.6 54.0L79.6 54.0Q79.4 54.2 79.1 54.2Q78.9 54.3 78.6 54.3L78.6 54.3Q78.4 54.3 78.1 54.3L78.1 54.3Q77.8 54.2 77.6 54.1L77.6 54.1Q77.4 53.9 77.1 53.7Q76.9 53.4 76.8 53.0M90.7 52.4L90.7 52.4Q90.9 52.5 91.3 52.5Q91.6 52.5 92.0 52.4Q92.3 52.2 92.7 52.0Q93.0 51.7 93.1 51.3L93.1 51.3Q93.3 50.9 93.1 50.2Q93.0 49.4 92.7 48.5Q92.3 47.7 92.0 46.8Q91.6 45.9 91.4 45.2L91.4 45.2Q91.1 44.6 91.0 44.2L91.0 44.2Q90.8 43.8 90.7 43.4Q90.6 43.0 90.5 42.8L90.5 42.8Q90.3 43.1 89.9 43.8Q89.4 44.5 88.9 45.2Q88.3 45.9 87.9 46.5Q87.4 47.1 87.2 47.3L87.2 47.3Q86.9 47.6 86.6 47.7Q86.4 47.8 86.2 47.6Q86.0 47.4 86.0 47.1Q86.0 46.8 86.3 46.4L86.3 46.4Q86.5 46.1 86.9 45.4Q87.4 44.8 87.8 44.1Q88.2 43.4 88.6 42.9Q89.0 42.4 89.0 42.3L89.0 42.3Q89.1 42.0 88.8 41.5Q88.5 41.0 88.7 40.4L88.7 40.4Q88.9 39.9 89.4 39.2Q89.9 38.5 90.6 38.0Q91.3 37.4 92.0 37.2Q92.7 36.9 93.3 37.2L93.3 37.2Q93.8 37.5 94.1 37.8Q94.4 38.2 94.3 38.5L94.3 38.5Q94.2 38.7 94.1 39.0L94.1 39.0Q93.9 39.3 93.7 39.7Q93.4 40.1 92.8 40.8L92.8 40.8Q92.9 41.6 93.1 42.3Q93.3 43.0 93.5 43.5L93.5 43.5Q93.7 44.2 94.0 44.7L94.0 44.7Q94.3 45.3 94.7 46.0Q95.0 46.7 95.3 47.4Q95.6 48.1 95.8 48.7Q96.0 49.3 95.9 49.7L95.9 49.7Q95.8 50.3 95.3 51.2Q94.8 52.0 94.0 52.9Q93.2 53.7 92.2 54.3Q91.2 54.9 90.1 54.9L90.1 54.9Q89.3 54.9 88.6 54.4Q87.9 53.9 87.4 53.3Q86.9 52.6 86.6 52.0Q86.4 51.4 86.6 51.1L86.6 51.1Q86.8 50.6 87.0 50.4Q87.2 50.1 87.5 49.8L87.5 49.8Q87.7 49.7 87.9 49.5L87.9 49.5Q88.1 49.4 88.4 49.3Q88.8 49.2 89.2 49.0L89.2 49.0Q89.6 50.2 89.8 50.8Q90.1 51.5 90.3 51.8L90.3 51.8Q90.5 52.2 90.7 52.4","m"]],"BER":[["M8.0 41.0L8.0 15.0L12.0 15.0Q13.3 15.0 14.7 15.2Q16.1 15.4 17.3 15.9Q18.6 16.5 19.3 17.7Q20.1 18.9 20.1 20.9L20.1 20.9L20.1 22.2Q20.1 24.2 19.1 25.5Q18.1 26.8 16.9 27.3L16.9 27.3L16.9 27.4Q18.7 28.1 19.6 29.4Q20.5 30.7 20.5 33.0L20.5 33.0L20.5 34.3Q20.5 36.5 19.8 37.8Q19.1 39.1 18.0 39.8Q16.8 40.5 15.3 40.7Q13.8 41.0 12.1 41.0L12.1 41.0L8.0 41.0M11.9 26.1L12.6 26.1Q14.2 26.1 15.1 25.3Q16.1 24.6 16.1 22.7L16.1 22.7L16.1 21.7Q16.1 19.9 15.3 18.9Q14.6 17.9 12.6 17.9L12.6 17.9L11.9 17.9L11.9 26.1M11.9 38.1L13.0 38.1Q14.6 38.1 15.5 37.3Q16.4 36.5 16.4 34.7L16.4 34.7L16.4 32.7Q16.4 30.9 15.7 29.9Q14.9 28.9 13.0 28.9L13.0 28.9L11.9 28.9L11.9 38.1M23.8 41.0L23.8 15.0L33.7 15.0L33.7 18.1L27.7 18.1L27.7 25.9L32.4 25.9L32.4 29.0L27.7 29.0L27.7 37.9L33.7 37.9L33.7 41.0L23.8 41.0M36.3 41.0L36.3 15.0L40.5 15.0Q41.4 15.0 42.5 15.1Q43.6 15.2 44.6 15.6Q45.7 16.0 46.6 16.8Q47.5 17.6 48.0 18.9Q48.5 20.3 48.5 22.4L48.5 22.4L48.5 23.1Q48.5 28.9 45.0 30.6L45.0 30.6L49.3 41.0L45.1 41.0L41.5 31.3L40.2 31.3L40.2 41.0L36.3 41.0M40.2 28.4L40.7 28.4Q42.9 28.4 43.7 27.4Q44.5 26.4 44.5 23.8L44.5 23.8L44.5 21.8Q44.5 19.7 43.7 18.8Q43.0 17.9 40.7 17.9L40.7 17.9L40.2 17.9L40.2 28.4M52.4 41.0L52.4 15.0L62.3 15.0L62.3 18.1L56.3 18.1L56.3 25.9L61.0 25.9L61.0 29.0L56.3 29.0L56.3 37.9L62.3 37.9L62.3 41.0L52.4 41.0M62.9 41.0L67.7 15.0L72.2 15.0L77.0 41.0L73.1 41.0L72.3 36.3L67.5 36.3L66.9 41.0L62.9 41.0M68.0 33.4L71.9 33.4L70.0 20.4L69.9 20.4L68.0 33.4M79.4 41.0L79.4 15.0L82.5 15.0L88.8 32.1L88.9 32.1Q88.9 31.3 88.8 30.3Q88.7 29.3 88.6 27.9Q88.5 26.5 88.5 24.5L88.5 24.5L88.5 15.0L92.0 15.0L92.0 41.0L88.9 41.0L82.5 24.4L82.4 24.4Q82.5 25.3 82.6 26.4Q82.7 27.4 82.8 29.1Q82.8 30.7 82.8 33.3L82.8 33.3L82.8 41.0L79.4 41.0","m"],["M11.4 82.6L11.4 63.9L8.0 63.9L8.0 61.3L18.1 61.3L18.1 63.9L14.7 63.9L14.7 82.6L11.4 82.6M20.1 82.6L20.1 61.3L23.6 61.3Q24.4 61.3 25.3 61.4Q26.1 61.5 27.0 61.8Q27.9 62.1 28.6 62.8Q29.3 63.4 29.8 64.6Q30.2 65.7 30.2 67.4L30.2 67.4L30.2 68.0Q30.2 72.8 27.3 74.1L27.3 74.1L30.8 82.6L27.4 82.6L24.5 74.7L23.4 74.7L23.4 82.6L20.1 82.6M23.4 72.3L23.8 72.3Q25.6 72.3 26.2 71.5Q26.9 70.7 26.9 68.6L26.9 68.6L26.9 66.9Q26.9 65.2 26.3 64.4Q25.6 63.7 23.8 63.7L23.8 63.7L23.4 63.7L23.4 72.3M38.3 82.8L38.3 82.8Q37.5 82.8 36.6 82.6Q35.7 82.4 34.9 81.7Q34.1 81.0 33.5 79.5Q33.0 78.1 33.0 75.7L33.0 75.7L33.0 68.2Q33.0 66.2 33.4 65.0Q33.7 63.7 34.3 62.9Q34.9 62.2 35.6 61.8Q36.3 61.4 37.0 61.3Q37.7 61.2 38.3 61.2L38.3 61.2Q38.9 61.2 39.6 61.3Q40.3 61.4 41.0 61.7Q41.7 62.1 42.3 62.9Q42.9 63.6 43.2 64.9Q43.6 66.2 43.6 68.2L43.6 68.2L43.6 75.7Q43.6 78.1 43.0 79.5Q42.5 80.9 41.6 81.6Q40.8 82.4 39.9 82.6Q39.0 82.8 38.3 82.8M38.3 80.3L38.3 80.3Q39.3 80.3 39.7 79.6Q40.2 78.9 40.2 76.9L40.2 76.9L40.2 67.3Q40.2 65.2 39.7 64.5Q39.3 63.7 38.3 63.7L38.3 63.7Q37.3 63.7 36.9 64.5Q36.4 65.2 36.4 67.3L36.4 67.3L36.4 76.9Q36.4 78.9 36.9 79.6Q37.3 80.3 38.3 80.3M45.1 78.1L45.1 78.1Q45.1 77.5 45.2 76.6Q45.3 75.8 45.5 74.9L45.5 74.9L48.1 74.9L48.1 77.4Q48.1 79.1 48.4 79.7Q48.7 80.3 49.4 80.3L49.4 80.3Q50.0 80.3 50.3 79.8Q50.6 79.3 50.6 77.8L50.6 77.8L50.6 61.3L53.8 61.3L53.8 77.5Q53.8 79.7 53.2 80.8Q52.6 82.0 51.5 82.4Q50.5 82.8 49.4 82.8L49.4 82.8Q47.8 82.8 46.8 82.2Q45.9 81.6 45.5 80.5Q45.1 79.4 45.1 78.1M55.4 82.6L59.4 61.3L63.0 61.3L67.0 82.6L63.7 82.6L63.2 78.8L59.2 78.8L58.7 82.6L55.4 82.6M59.6 76.4L62.8 76.4L61.3 65.7L61.1 65.7L59.6 76.4M68.9 82.6L68.9 61.3L71.5 61.3L76.7 75.3L76.7 75.3Q76.7 74.7 76.6 73.9Q76.5 73.1 76.5 71.9Q76.4 70.8 76.4 69.1L76.4 69.1L76.4 61.3L79.3 61.3L79.3 82.6L76.7 82.6L71.5 69.0L71.4 69.0Q71.5 69.8 71.6 70.6Q71.6 71.5 71.7 72.9Q71.8 74.2 71.8 76.4L71.8 76.4L71.8 82.6L68.9 82.6M81.8 78.3L81.8 78.3Q81.8 77.6 81.9 77.1Q82.0 76.5 82.2 75.8L82.2 75.8L84.7 75.8L84.7 76.8Q84.7 78.5 85.2 79.4Q85.7 80.3 86.8 80.3L86.8 80.3Q88.7 80.3 88.7 78.5L88.7 78.5Q88.7 77.8 88.4 77.0Q88.1 76.2 87.2 75.1L87.2 75.1L83.8 70.8Q82.9 69.7 82.4 68.5Q81.9 67.4 81.9 66.0L81.9 66.0Q81.9 63.9 83.3 62.5Q84.6 61.2 86.9 61.2L86.9 61.2Q88.8 61.2 89.9 61.8Q90.9 62.5 91.4 63.6Q91.8 64.6 91.8 65.7L91.8 65.7Q91.8 66.4 91.7 66.9Q91.6 67.5 91.5 68.2L91.5 68.2L89.0 68.2L89.0 67.2Q89.0 65.5 88.4 64.6Q87.9 63.7 86.9 63.7L86.9 63.7Q86.0 63.7 85.5 64.2Q85.1 64.7 85.1 65.5L85.1 65.5Q85.1 66.3 85.4 66.9Q85.7 67.5 86.1 68.1L86.1 68.1L89.9 72.8Q90.9 74.2 91.5 75.4Q92.0 76.6 92.0 78.1L92.0 78.1Q92.0 80.3 90.6 81.6Q89.2 82.8 86.8 82.8L86.8 82.8Q84.9 82.8 83.8 82.2Q82.7 81.5 82.3 80.5Q81.8 79.5 81.8 78.3","a"]],"UBC":[["M22.4 35.7L22.4 31.8L33.1 31.8L33.1 35.7L30.2 35.7L30.2 62.9L25.2 68.2L12.0 68.2L6.9 62.9L6.9 35.7L4.0 35.7L4.0 31.8L14.8 31.8L14.8 35.7L11.4 35.7L11.4 61.5L13.9 64.0L23.2 64.0L25.8 61.5L25.8 35.7L22.4 35.7M40.4 35.7L40.4 31.8L59.9 31.8L64.9 37.1L64.9 45.9L62.3 48.6L65.9 52.4L65.9 62.9L60.8 68.2L40.4 68.2L40.4 64.3L43.8 64.3L43.8 35.7L40.4 35.7M58.6 50.9L48.3 50.9L48.3 64.0L58.9 64.0L61.7 61.2L61.7 54.1L58.6 50.9M58.0 36.0L48.3 36.0L48.3 47.0L57.9 47.0L60.7 44.2L60.7 38.8L58.0 36.0M92.1 60.9L92.1 56.8L96.0 56.8L96.0 62.9L90.9 68.2L78.7 68.2L73.7 62.9L73.7 37.1L78.7 31.8L90.9 31.8L96.0 37.1L96.0 43.2L92.1 43.2L92.1 39.1L89.1 36.0L80.7 36.0L78.1 38.5L78.1 61.5L80.6 64.0L89.0 64.0L92.1 60.9","m"]],"FBO":[["M12.2 52.1L7.8 52.1L6.1 60.0L1.8 60.0L6.2 40.0L15.2 40.0L14.4 43.8L9.7 43.8L8.6 48.5L13.0 48.5L12.2 52.1M21.6 39.7L25.7 39.7Q29.5 39.7 28.6 43.8L28.6 43.8L25.0 60.0L20.7 60.0L22.2 53.3L19.1 53.3L17.6 60.0L13.3 60.0L16.9 43.8Q17.8 39.7 21.6 39.7L21.6 39.7M21.3 43.3L19.8 50.0L22.9 50.0L24.4 43.3Q24.4 43.0 24.3 42.8Q24.2 42.7 23.9 42.7L23.9 42.7L22.0 42.7Q21.8 42.7 21.6 42.8Q21.3 43.0 21.3 43.3L21.3 43.3M36.9 40.0L33.3 56.3L38.0 56.3L37.2 60.0L28.2 60.0L32.6 40.0L36.9 40.0M47.4 56.7L47.4 56.7L48.1 53.6L52.2 53.6L51.6 56.2Q50.7 60.3 46.9 60.3L46.9 60.3L43.0 60.3Q39.2 60.3 40.1 56.2L40.1 56.2L42.8 43.8Q43.7 39.7 47.5 39.7L47.5 39.7L51.4 39.7Q55.2 39.7 54.3 43.8L54.3 43.8L53.9 45.7L49.8 45.7L50.4 43.3Q50.4 43.0 50.3 42.8Q50.2 42.7 49.9 42.7L49.9 42.7L48.0 42.7Q47.7 42.7 47.5 42.8Q47.3 43.0 47.2 43.3L47.2 43.3L44.3 56.7Q44.2 56.9 44.4 57.1Q44.5 57.3 44.7 57.3L44.7 57.3L46.7 57.3Q46.9 57.3 47.1 57.1Q47.4 56.9 47.4 56.7M68.6 43.8L68.6 43.8L65.9 56.2Q65.0 60.3 61.2 60.3L61.2 60.3L57.1 60.3Q53.3 60.3 54.2 56.2L54.2 56.2L56.9 43.8Q57.8 39.7 61.6 39.7L61.6 39.7L65.7 39.7Q69.5 39.7 68.6 43.8M61.5 56.7L61.5 56.7L64.4 43.3Q64.5 43.0 64.4 42.8Q64.2 42.7 64.0 42.7L64.0 42.7L62.1 42.7Q61.8 42.7 61.6 42.8Q61.4 43.0 61.3 43.3L61.3 43.3L58.4 56.7Q58.3 56.9 58.5 57.1Q58.6 57.3 58.8 57.3L58.8 57.3L60.8 57.3Q61.0 57.3 61.2 57.1Q61.4 56.9 61.5 56.7M83.2 43.8L79.7 60.0L75.4 60.0L79.0 43.4Q79.0 43.2 78.9 43.0Q78.8 42.8 78.5 42.8L78.5 42.8L76.9 42.8Q76.6 42.8 76.4 43.0Q76.2 43.2 76.2 43.4L76.2 43.4L72.5 60.0L68.2 60.0L71.8 43.8Q72.7 39.7 76.5 39.7L76.5 39.7L80.3 39.7Q84.1 39.7 83.2 43.8L83.2 43.8M97.1 43.8L96.8 45.3L92.7 45.3L93.1 43.7Q93.1 43.5 93.0 43.3Q92.9 43.1 92.6 43.1L92.6 43.1L90.9 43.1Q90.7 43.1 90.5 43.3Q90.3 43.5 90.2 43.7L90.2 43.7L89.4 47.2Q89.4 47.5 89.5 47.7Q89.6 47.9 89.9 47.9L89.9 47.9L92.7 47.9Q96.5 47.9 95.6 51.9L95.6 51.9L94.6 56.2Q93.7 60.3 89.9 60.3L89.9 60.3L86.3 60.3Q82.5 60.3 83.4 56.2L83.4 56.2L83.8 54.1L87.9 54.1L87.4 56.4Q87.4 56.6 87.5 56.8Q87.6 57.0 87.9 57.0L87.9 57.0L89.8 57.0Q90.0 57.0 90.2 56.8Q90.5 56.6 90.5 56.4L90.5 56.4L91.4 52.4Q91.4 52.2 91.3 52.0Q91.2 51.8 90.9 51.8L90.9 51.8L88.2 51.8Q84.3 51.8 85.2 47.8L85.2 47.8L86.1 43.8Q87.0 39.7 90.8 39.7L90.8 39.7L94.2 39.7Q98.0 39.7 97.1 43.8L97.1 43.8","m"]],"HAL":[["M6.3 58.6L10.0 41.1Q8.3 41.8 7.3 43.2Q6.4 44.7 6.4 46.7L6.4 46.7Q6.4 47.7 6.6 48.0Q6.8 48.4 6.8 48.5L6.8 48.5Q5.4 48.5 4.7 47.9Q4.0 47.3 4.0 46.0L4.0 46.0Q4.0 44.3 5.4 42.8Q6.7 41.2 8.8 40.2Q10.9 39.3 13.0 39.3L13.0 39.3Q13.4 39.3 14.1 39.3L14.1 39.3L12.4 47.0L16.2 47.0L17.9 39.3L21.6 39.3L17.5 58.6L13.8 58.6L15.8 48.9L12.0 48.9L10.0 58.6L6.3 58.6M23.9 58.7Q22.4 58.7 21.5 57.7Q20.5 56.7 20.5 54.6L20.5 54.6Q20.5 52.7 21.2 50.6Q22.0 48.5 23.5 47.0Q25.0 45.6 27.1 45.6L27.1 45.6Q28.2 45.6 28.7 45.9Q29.2 46.3 29.2 46.9L29.2 46.9L29.2 47.1L29.5 45.7L33.2 45.7L31.3 54.5Q31.2 54.8 31.2 55.3L31.2 55.3Q31.2 56.4 32.3 56.4L32.3 56.4Q33.0 56.4 33.5 55.7Q34.1 55.1 34.4 54.0L34.4 54.0L35.4 54.0Q34.5 56.8 33.1 57.7Q31.7 58.7 30.3 58.7L30.3 58.7Q29.2 58.7 28.5 58.1Q27.9 57.5 27.7 56.4L27.7 56.4Q27.0 57.4 26.1 58.1Q25.2 58.7 23.9 58.7L23.9 58.7M25.6 56.2Q26.2 56.2 26.9 55.6Q27.5 55.0 27.7 54.0L27.7 54.0L29.0 48.2Q29.0 47.8 28.7 47.5Q28.4 47.2 27.9 47.2L27.9 47.2Q26.9 47.2 26.0 48.4Q25.2 49.6 24.8 51.3Q24.3 52.9 24.3 54.2L24.3 54.2Q24.3 55.5 24.7 55.9Q25.0 56.2 25.6 56.2L25.6 56.2M36.9 58.7Q35.7 58.7 34.9 58.0Q34.2 57.2 34.2 55.6L34.2 55.6Q34.2 55.0 34.4 54.0L34.4 54.0L37.1 41.1L40.9 40.6L38.0 54.5Q37.9 54.8 37.9 55.3L37.9 55.3Q37.9 55.8 38.1 56.0Q38.4 56.2 38.9 56.2L38.9 56.2Q39.7 56.2 40.3 55.6Q41.0 55.0 41.2 54.0L41.2 54.0L42.3 54.0Q41.4 56.8 39.9 57.7Q38.4 58.7 36.9 58.7L36.9 58.7M44.2 58.7Q42.9 58.7 42.1 58.3Q41.2 57.8 40.8 57.0Q40.4 56.3 40.4 55.4L40.4 55.4Q40.4 54.6 40.8 54.0Q41.2 53.3 41.8 53.0L41.8 53.0Q42.8 51.2 43.5 49.4Q44.3 47.6 45.0 45.4L45.0 45.4L48.8 44.9Q48.9 48.2 49.2 52.0L49.2 52.0Q49.3 53.6 49.3 54.3L49.3 54.3Q49.3 54.9 49.2 55.3L49.2 55.3Q50.4 54.6 51.1 54.0L51.1 54.0L52.2 54.0Q50.5 55.9 48.2 57.2L48.2 57.2Q47.5 58.0 46.4 58.4Q45.3 58.7 44.2 58.7L44.2 58.7M43.4 56.7Q44.3 56.7 45.0 56.1Q45.6 55.6 45.6 54.3L45.6 54.3Q45.6 53.5 45.4 52.1L45.4 52.1Q45.2 49.2 45.1 48.2L45.1 48.2Q44.5 50.2 43.0 53.1L43.0 53.1Q43.6 53.4 43.6 54.0L43.6 54.0Q43.6 54.5 43.3 54.8Q43.0 55.2 42.5 55.2L42.5 55.2Q41.9 55.2 41.8 54.9L41.8 54.9Q41.8 55.8 42.2 56.3Q42.5 56.7 43.4 56.7L43.4 56.7M53.6 58.7Q52.4 58.7 51.6 58.0Q50.9 57.2 50.9 55.6L50.9 55.6Q50.9 55.0 51.1 54.0L51.1 54.0L52.6 46.7L51.8 46.7L52.0 45.7L52.8 45.7L53.6 42.1L57.4 41.6L56.5 45.7L58.1 45.7L57.9 46.7L56.3 46.7L54.7 54.5Q54.6 54.8 54.6 55.3L54.6 55.3Q54.6 55.8 54.8 56.0Q55.1 56.2 55.6 56.2L55.6 56.2Q56.4 56.2 57.0 55.6Q57.7 55.0 58.0 54.0L58.0 54.0L59.0 54.0Q58.1 56.8 56.6 57.7Q55.1 58.7 53.6 58.7L53.6 58.7M61.6 58.7Q59.7 58.7 58.7 57.7Q57.6 56.8 57.6 54.6L57.6 54.6Q57.6 52.9 58.3 50.7Q59.0 48.6 60.6 47.0Q62.2 45.5 64.6 45.5L64.6 45.5Q67.4 45.5 67.4 47.9L67.4 47.9Q67.4 49.4 66.6 50.6Q65.8 51.8 64.4 52.5Q63.0 53.3 61.5 53.4L61.5 53.4Q61.4 54.2 61.4 54.4L61.4 54.4Q61.4 55.7 61.9 56.1Q62.3 56.6 63.3 56.6L63.3 56.6Q64.7 56.6 65.7 55.9Q66.7 55.3 67.8 54.0L67.8 54.0L68.7 54.0Q65.9 58.7 61.6 58.7L61.6 58.7M61.7 52.1Q62.6 52.1 63.5 51.5Q64.4 50.9 64.9 49.9Q65.4 48.9 65.4 47.9L65.4 47.9Q65.4 46.8 64.8 46.8L64.8 46.8Q63.9 46.8 63.0 48.5Q62.1 50.1 61.7 52.1L61.7 52.1M70.9 58.7Q69.5 58.7 68.5 57.7Q67.5 56.7 67.5 54.6L67.5 54.6Q67.5 52.7 68.3 50.6Q69.0 48.5 70.5 47.0Q72.0 45.6 74.1 45.6L74.1 45.6Q75.2 45.6 75.7 45.9Q76.2 46.3 76.2 46.9L76.2 46.9L76.2 47.1L76.5 45.7L80.2 45.7L78.4 54.5Q78.3 54.8 78.3 55.3L78.3 55.3Q78.3 56.4 79.3 56.4L79.3 56.4Q80.0 56.4 80.6 55.7Q81.1 55.1 81.4 54.0L81.4 54.0L82.5 54.0Q81.5 56.8 80.1 57.7Q78.7 58.7 77.3 58.7L77.3 58.7Q76.2 58.7 75.6 58.1Q74.9 57.5 74.8 56.4L74.8 56.4Q74.0 57.4 73.1 58.1Q72.2 58.7 70.9 58.7L70.9 58.7M72.6 56.2Q73.3 56.2 73.9 55.6Q74.5 55.0 74.8 54.0L74.8 54.0L76.0 48.2Q76.0 47.8 75.7 47.5Q75.5 47.2 74.9 47.2L74.9 47.2Q73.9 47.2 73.1 48.4Q72.3 49.6 71.8 51.3Q71.3 52.9 71.3 54.2L71.3 54.2Q71.3 55.5 71.7 55.9Q72.1 56.2 72.6 56.2L72.6 56.2M84.5 58.7Q83.0 58.7 82.0 57.7Q81.1 56.7 81.1 54.6L81.1 54.6Q81.1 52.7 81.8 50.6Q82.6 48.5 84.1 47.0Q85.6 45.6 87.7 45.6L87.7 45.6Q88.7 45.6 89.3 45.9Q89.8 46.3 89.8 46.9L89.8 46.9L89.8 47.0L91.0 41.1L94.8 40.6L91.9 54.5Q91.8 54.8 91.8 55.3L91.8 55.3Q91.8 55.8 92.0 56.0Q92.3 56.2 92.8 56.2L92.8 56.2Q93.6 56.2 94.1 55.6Q94.6 55.0 94.9 54.0L94.9 54.0L96.0 54.0Q94.4 58.6 90.8 58.6L90.8 58.6Q89.8 58.6 89.1 58.0Q88.5 57.4 88.3 56.4L88.3 56.4Q87.6 57.4 86.7 58.1Q85.7 58.7 84.5 58.7L84.5 58.7M86.2 56.2Q86.8 56.2 87.4 55.7Q88.0 55.1 88.3 54.1L88.3 54.1L88.3 54.0L89.5 48.1Q89.3 47.2 88.5 47.2L88.5 47.2Q87.4 47.2 86.6 48.4Q85.8 49.6 85.3 51.3Q84.9 52.9 84.9 54.2L84.9 54.2Q84.9 55.5 85.2 55.9Q85.6 56.2 86.2 56.2L86.2 56.2","m"],["M12 78 C38 72 64 72 90 66","u"]],"ESB":[["M6.0 42.1L6.0 19.9L15.5 19.9L15.5 23.0L9.5 23.0L9.5 28.9L14.3 28.9L14.3 32.1L9.5 32.1L9.5 39.0L15.5 39.0L15.5 42.1L6.0 42.1M16.6 42.1L20.2 19.9L25.0 19.9L28.6 42.1L25.1 42.1L24.5 37.7L24.5 37.8L20.5 37.8L19.9 42.1L16.6 42.1M20.9 34.8L24.1 34.8L22.5 23.7L22.4 23.7L20.9 34.8M34.8 42.4Q32.2 42.4 30.9 41.0Q29.6 39.6 29.6 36.9L29.6 36.9L29.6 35.6L32.9 35.6L32.9 37.1Q32.9 39.3 34.7 39.3L34.7 39.3Q35.6 39.3 36.1 38.7Q36.5 38.2 36.5 37.0L36.5 37.0Q36.5 35.6 35.9 34.6Q35.3 33.5 33.5 32.0L33.5 32.0Q31.4 30.1 30.5 28.6Q29.7 27.0 29.7 25.1L29.7 25.1Q29.7 22.4 31.0 21.0Q32.3 19.6 34.9 19.6L34.9 19.6Q37.4 19.6 38.7 21.0Q40.0 22.4 40.0 25.1L40.0 25.1L40.0 26.1L36.7 26.1L36.7 24.9Q36.7 23.8 36.2 23.3Q35.8 22.7 34.9 22.7L34.9 22.7Q33.2 22.7 33.2 24.9L33.2 24.9Q33.2 26.1 33.8 27.1Q34.5 28.2 36.2 29.7L36.2 29.7Q38.4 31.6 39.2 33.1Q40.0 34.7 40.0 36.8L40.0 36.8Q40.0 39.5 38.7 41.0Q37.3 42.4 34.8 42.4L34.8 42.4M44.8 42.1L44.8 23.0L41.1 23.0L41.1 19.9L51.9 19.9L51.9 23.0L48.3 23.0L48.3 42.1L44.8 42.1M58.2 42.4Q55.6 42.4 54.3 41.0Q53.0 39.6 53.0 36.9L53.0 36.9L53.0 35.6L56.3 35.6L56.3 37.1Q56.3 39.3 58.1 39.3L58.1 39.3Q59.0 39.3 59.5 38.7Q59.9 38.2 59.9 37.0L59.9 37.0Q59.9 35.6 59.3 34.6Q58.7 33.5 56.9 32.0L56.9 32.0Q54.8 30.1 53.9 28.6Q53.1 27.0 53.1 25.1L53.1 25.1Q53.1 22.4 54.4 21.0Q55.7 19.6 58.3 19.6L58.3 19.6Q60.8 19.6 62.1 21.0Q63.4 22.4 63.4 25.1L63.4 25.1L63.4 26.1L60.1 26.1L60.1 24.9Q60.1 23.8 59.6 23.3Q59.2 22.7 58.3 22.7L58.3 22.7Q56.6 22.7 56.6 24.9L56.6 24.9Q56.6 26.1 57.2 27.1Q57.9 28.2 59.6 29.7L59.6 29.7Q61.8 31.6 62.6 33.1Q63.4 34.7 63.4 36.8L63.4 36.8Q63.4 39.5 62.1 41.0Q60.7 42.4 58.2 42.4L58.2 42.4M65.4 42.1L65.4 19.9L68.9 19.9L68.9 42.1L65.4 42.1M71.5 42.1L71.5 19.9L76.9 19.9Q79.5 19.9 80.8 21.3Q82.1 22.7 82.1 25.4L82.1 25.4L82.1 36.6Q82.1 39.3 80.8 40.7Q79.5 42.1 76.9 42.1L76.9 42.1L71.5 42.1M75.0 39.0L76.8 39.0Q77.7 39.0 78.1 38.4Q78.6 37.9 78.6 36.8L78.6 36.8L78.6 25.2Q78.6 24.1 78.1 23.6Q77.7 23.0 76.8 23.0L76.8 23.0L75.0 23.0L75.0 39.0M84.5 42.1L84.5 19.9L94.0 19.9L94.0 23.0L88.0 23.0L88.0 28.9L92.8 28.9L92.8 32.1L88.0 32.1L88.0 39.0L94.0 39.0L94.0 42.1L84.5 42.1","m"],["M6.0 78.1L6.0 59.9L13.8 59.9L13.8 62.5L8.9 62.5L8.9 67.3L12.8 67.3L12.8 69.9L8.9 69.9L8.9 75.5L13.8 75.5L13.8 78.1L6.0 78.1M14.7 78.1L18.0 68.8L14.9 59.9L17.9 59.9L19.8 65.8L19.9 65.8L21.9 59.9L24.6 59.9L21.4 68.8L24.7 78.1L21.7 78.1L19.6 71.8L19.6 71.8L17.4 78.1L14.7 78.1M26.1 78.1L26.1 59.9L30.3 59.9Q32.5 59.9 33.5 61.0Q34.6 62.2 34.6 64.4L34.6 64.4L34.6 66.2Q34.6 68.4 33.5 69.5Q32.5 70.7 30.3 70.7L30.3 70.7L29.0 70.7L29.0 78.1L26.1 78.1M29.0 68.1L30.3 68.1Q31.0 68.1 31.4 67.7Q31.7 67.3 31.7 66.4L31.7 66.4L31.7 64.2Q31.7 63.3 31.4 62.9Q31.0 62.5 30.3 62.5L30.3 62.5L29.0 62.5L29.0 68.1M36.2 78.1L36.2 59.9L39.0 59.9L39.0 75.5L43.8 75.5L43.8 78.1L36.2 78.1M49.2 78.4Q47.1 78.4 45.9 77.2Q44.8 76.0 44.8 73.8L44.8 73.8L44.8 64.2Q44.8 62.0 45.9 60.8Q47.1 59.6 49.2 59.6L49.2 59.6Q51.3 59.6 52.4 60.8Q53.5 62.0 53.5 64.2L53.5 64.2L53.5 73.8Q53.5 76.0 52.4 77.2Q51.3 78.4 49.2 78.4L49.2 78.4M49.2 75.8Q50.7 75.8 50.7 74.0L50.7 74.0L50.7 64.0Q50.7 62.2 49.2 62.2L49.2 62.2Q47.7 62.2 47.7 64.0L47.7 64.0L47.7 74.0Q47.7 75.8 49.2 75.8L49.2 75.8M55.5 78.1L55.5 59.9L59.7 59.9Q61.9 59.9 62.9 60.9Q64.0 61.9 64.0 64.1L64.0 64.1L64.0 65.2Q64.0 68.0 62.1 68.8L62.1 68.8L62.1 68.8Q63.1 69.2 63.6 70.1Q64.0 71.1 64.0 72.7L64.0 72.7L64.0 75.9Q64.0 76.7 64.0 77.2Q64.1 77.7 64.3 78.1L64.3 78.1L61.4 78.1Q61.2 77.7 61.2 77.3Q61.1 76.9 61.1 75.9L61.1 75.9L61.1 72.5Q61.1 71.3 60.7 70.8Q60.3 70.3 59.3 70.3L59.3 70.3L58.3 70.3L58.3 78.1L55.5 78.1M58.3 67.7L59.4 67.7Q60.2 67.7 60.7 67.3Q61.1 66.8 61.1 65.8L61.1 65.8L61.1 64.4Q61.1 63.4 60.7 62.9Q60.4 62.5 59.6 62.5L59.6 62.5L58.3 62.5L58.3 67.7M66.0 78.1L66.0 59.9L73.8 59.9L73.8 62.5L68.8 62.5L68.8 67.3L72.8 67.3L72.8 69.9L68.8 69.9L68.8 75.5L73.8 75.5L73.8 78.1L66.0 78.1M75.4 78.1L75.4 59.9L79.7 59.9Q81.9 59.9 82.9 60.9Q83.9 61.9 83.9 64.1L83.9 64.1L83.9 65.2Q83.9 68.0 82.1 68.8L82.1 68.8L82.1 68.8Q83.1 69.2 83.5 70.1Q84.0 71.1 84.0 72.7L84.0 72.7L84.0 75.9Q84.0 76.7 84.0 77.2Q84.1 77.7 84.3 78.1L84.3 78.1L81.4 78.1Q81.2 77.7 81.1 77.3Q81.1 76.9 81.1 75.9L81.1 75.9L81.1 72.5Q81.1 71.3 80.7 70.8Q80.3 70.3 79.3 70.3L79.3 70.3L78.3 70.3L78.3 78.1L75.4 78.1M78.3 67.7L79.3 67.7Q80.2 67.7 80.6 67.3Q81.1 66.8 81.1 65.8L81.1 65.8L81.1 64.4Q81.1 63.4 80.7 62.9Q80.4 62.5 79.6 62.5L79.6 62.5L78.3 62.5L78.3 67.7M89.7 78.4Q87.6 78.4 86.5 77.2Q85.4 76.0 85.4 73.8L85.4 73.8L85.4 72.8L88.2 72.8L88.2 74.0Q88.2 75.8 89.6 75.8L89.6 75.8Q90.4 75.8 90.8 75.3Q91.1 74.9 91.1 74.0L91.1 74.0Q91.1 72.8 90.6 71.9Q90.1 71.1 88.7 69.8L88.7 69.8Q86.9 68.3 86.2 67.0Q85.5 65.7 85.5 64.2L85.5 64.2Q85.5 62.0 86.6 60.8Q87.7 59.6 89.8 59.6L89.8 59.6Q91.8 59.6 92.9 60.8Q93.9 62.0 93.9 64.2L93.9 64.2L93.9 65.0L91.2 65.0L91.2 64.0Q91.2 63.1 90.9 62.7Q90.5 62.2 89.8 62.2L89.8 62.2Q88.4 62.2 88.4 64.0L88.4 64.0Q88.4 65.0 88.9 65.8Q89.4 66.7 90.8 67.9L90.8 67.9Q92.6 69.5 93.3 70.7Q94.0 72.0 94.0 73.7L94.0 73.7Q94.0 76.0 92.9 77.2Q91.8 78.4 89.7 78.4L89.7 78.4","a"]],"SCB":[["M14.5 32.6L14.5 32.6L10.5 32.6Q10.0 32.6 10.0 32.2L10.0 32.2L10.0 30.7Q10.0 30.2 10.5 30.2L10.5 30.2L13.9 30.2Q14.1 30.2 14.2 30.1Q14.3 30.0 14.3 29.8L14.3 29.8Q14.3 29.6 14.2 29.5Q14.1 29.4 13.9 29.4L13.9 29.4L12.0 29.1Q11.1 29.0 10.5 28.5Q10.0 28.1 10.0 27.0L10.0 27.0L10.0 25.6Q10.0 24.5 10.7 23.9Q11.4 23.4 12.7 23.4L12.7 23.4L16.3 23.4Q16.8 23.4 16.8 23.8L16.8 23.8L16.8 25.4Q16.8 25.8 16.3 25.8L16.3 25.8L13.3 25.8Q12.9 25.8 12.9 26.2L12.9 26.2Q12.9 26.6 13.3 26.6L13.3 26.6L15.2 26.9Q15.8 27.0 16.3 27.2Q16.7 27.4 17.0 27.9Q17.2 28.3 17.2 29.0L17.2 29.0L17.2 30.4Q17.2 31.5 16.5 32.1Q15.8 32.6 14.5 32.6M24.4 32.6L18.9 32.6Q18.4 32.6 18.4 32.2L18.4 32.2L18.4 30.6Q18.4 30.2 18.9 30.2L18.9 30.2L20.2 30.2L20.2 25.8L18.9 25.8Q18.4 25.8 18.4 25.4L18.4 25.4L18.4 23.8Q18.4 23.4 18.9 23.4L18.9 23.4L24.4 23.4Q24.8 23.4 24.8 23.8L24.8 23.8L24.8 25.4Q24.8 25.8 24.4 25.8L24.4 25.8L23.1 25.8L23.1 30.2L24.4 30.2Q24.8 30.2 24.8 30.6L24.8 30.6L24.8 32.2Q24.8 32.6 24.4 32.6L24.4 32.6M34.3 25.8L34.3 30.2Q34.3 30.8 34.1 31.3Q34.0 31.8 33.5 32.1Q33.1 32.5 32.3 32.7Q31.5 32.8 30.3 32.8L30.3 32.8Q29.1 32.8 28.3 32.7Q27.5 32.5 27.1 32.1Q26.7 31.8 26.5 31.3Q26.3 30.8 26.3 30.2L26.3 30.2L26.3 25.8Q26.3 25.2 26.5 24.7Q26.7 24.2 27.1 23.9Q27.5 23.5 28.3 23.4Q29.1 23.2 30.3 23.2L30.3 23.2Q31.5 23.2 32.3 23.4Q33.1 23.5 33.5 23.9Q34.0 24.2 34.1 24.7Q34.3 25.2 34.3 25.8L34.3 25.8M29.2 26.3L29.2 29.7Q29.2 30.0 29.4 30.2Q29.6 30.3 30.3 30.3L30.3 30.3Q31.0 30.3 31.2 30.2Q31.4 30.0 31.4 29.7L31.4 29.7L31.4 26.3Q31.4 26.0 31.2 25.8Q31.0 25.7 30.3 25.7L30.3 25.7Q29.6 25.7 29.4 25.8Q29.2 26.0 29.2 26.3L29.2 26.3M43.9 23.8L43.9 30.2Q43.9 30.8 43.7 31.3Q43.5 31.8 43.1 32.1Q42.6 32.5 41.8 32.7Q41.1 32.8 39.9 32.8L39.9 32.8Q38.7 32.8 37.9 32.7Q37.1 32.5 36.7 32.1Q36.2 31.8 36.1 31.3Q35.9 30.8 35.9 30.2L35.9 30.2L35.9 23.8Q35.9 23.4 36.3 23.4L36.3 23.4L38.4 23.4Q38.8 23.4 38.8 23.8L38.8 23.8L38.8 29.7Q38.8 30.0 39.0 30.1Q39.2 30.3 39.9 30.3L39.9 30.3Q40.6 30.3 40.8 30.1Q41.0 30.0 41.0 29.7L41.0 29.7L41.0 23.8Q41.0 23.4 41.4 23.4L41.4 23.4L43.4 23.4Q43.9 23.4 43.9 23.8L43.9 23.8M48.3 30.9L48.3 32.2Q48.3 32.6 47.9 32.6L47.9 32.6L45.9 32.6Q45.5 32.6 45.5 32.2L45.5 32.2L45.5 30.8Q45.5 30.4 45.5 30.1Q45.5 29.9 45.7 29.7Q45.8 29.5 45.9 29.2L45.9 29.2L47.0 27.8L45.9 26.4Q45.8 26.1 45.6 25.9Q45.5 25.7 45.5 25.5Q45.5 25.2 45.5 24.8L45.5 24.8L45.5 23.8Q45.5 23.4 45.9 23.4L45.9 23.4L47.9 23.4Q48.4 23.4 48.4 23.8L48.4 23.8L48.4 24.7Q48.4 24.8 48.4 25.0Q48.4 25.1 48.5 25.3L48.5 25.3L49.1 26.1Q49.1 26.2 49.2 26.2Q49.3 26.3 49.4 26.3L49.4 26.3L49.5 26.3Q49.6 26.3 49.7 26.2Q49.8 26.2 49.8 26.1L49.8 26.1L50.4 25.3Q50.5 25.1 50.5 25.0Q50.5 24.8 50.5 24.7L50.5 24.7L50.5 23.8Q50.5 23.4 51.0 23.4L51.0 23.4L53.0 23.4Q53.4 23.4 53.4 23.8L53.4 23.8L53.4 24.8Q53.4 25.2 53.4 25.5Q53.3 25.7 53.2 25.9Q53.1 26.1 52.9 26.4L52.9 26.4L51.9 27.8L52.9 29.2Q53.1 29.5 53.2 29.7Q53.3 29.9 53.4 30.1Q53.4 30.4 53.4 30.8L53.4 30.8L53.4 32.2Q53.4 32.6 53.0 32.6L53.0 32.6L51.0 32.6Q50.5 32.6 50.5 32.2L50.5 32.2L50.5 30.9Q50.5 30.9 50.5 30.9L50.5 30.9Q50.5 30.7 50.5 30.6Q50.5 30.5 50.4 30.4L50.4 30.4L49.8 29.5Q49.8 29.4 49.7 29.4Q49.6 29.3 49.5 29.3L49.5 29.3L49.4 29.3Q49.3 29.3 49.2 29.4Q49.1 29.4 49.0 29.5L49.0 29.5L48.5 30.4Q48.4 30.5 48.4 30.6Q48.3 30.7 48.3 30.9L48.3 30.9Q48.3 30.9 48.3 30.9L48.3 30.9M64.2 32.6L64.2 32.6L61.0 32.6Q59.4 32.6 58.6 32.0Q57.8 31.4 57.8 30.0L57.8 30.0L57.8 26.0Q57.8 24.6 58.6 24.0Q59.4 23.4 61.0 23.4L61.0 23.4L64.2 23.4Q64.6 23.4 64.6 23.8L64.6 23.8L64.6 25.4Q64.6 25.8 64.2 25.8L64.2 25.8L61.6 25.8Q60.8 25.8 60.8 26.5L60.8 26.5L60.8 29.6Q60.8 30.2 61.6 30.2L61.6 30.2L64.2 30.2Q64.6 30.2 64.6 30.6L64.6 30.6L64.6 32.2Q64.6 32.6 64.2 32.6M71.9 32.6L66.4 32.6Q65.9 32.6 65.9 32.2L65.9 32.2L65.9 30.6Q65.9 30.2 66.4 30.2L66.4 30.2L67.6 30.2L67.6 25.8L66.4 25.8Q65.9 25.8 65.9 25.4L65.9 25.4L65.9 23.8Q65.9 23.4 66.4 23.4L66.4 23.4L71.9 23.4Q72.3 23.4 72.3 23.8L72.3 23.8L72.3 25.4Q72.3 25.8 71.9 25.8L71.9 25.8L70.6 25.8L70.6 30.2L71.9 30.2Q72.3 30.2 72.3 30.6L72.3 30.6L72.3 32.2Q72.3 32.6 71.9 32.6L71.9 32.6M78.3 32.6L78.3 32.6L76.2 32.6Q75.7 32.6 75.7 32.2L75.7 32.2L75.7 25.8L73.8 25.8Q73.4 25.8 73.4 25.4L73.4 25.4L73.4 23.8Q73.4 23.4 73.8 23.4L73.8 23.4L80.7 23.4Q81.1 23.4 81.1 23.8L81.1 23.8L81.1 25.4Q81.1 25.8 80.7 25.8L80.7 25.8L78.8 25.8L78.8 32.2Q78.8 32.6 78.3 32.6M87.1 32.6L87.1 32.6L85.0 32.6Q84.5 32.6 84.5 32.2L84.5 32.2L84.5 30.5L82.6 27.9Q82.4 27.6 82.2 27.4Q82.1 27.2 82.1 26.9Q82.1 26.7 82.1 26.3L82.1 26.3L82.1 23.8Q82.1 23.4 82.5 23.4L82.5 23.4L84.5 23.4Q85.0 23.4 85.0 23.8L85.0 23.8L85.0 25.9Q85.0 26.1 85.0 26.2Q85.0 26.3 85.1 26.5L85.1 26.5L85.7 27.4Q85.8 27.6 86.0 27.6L86.0 27.6L86.1 27.6Q86.3 27.6 86.4 27.4L86.4 27.4L87.0 26.5Q87.1 26.3 87.1 26.2Q87.1 26.1 87.1 25.9L87.1 25.9L87.1 23.8Q87.1 23.4 87.6 23.4L87.6 23.4L89.5 23.4Q90.0 23.4 90.0 23.8L90.0 23.8L90.0 26.3Q90.0 26.7 90.0 26.9Q89.9 27.2 89.8 27.4Q89.7 27.6 89.5 27.9L89.5 27.9L87.5 30.5L87.5 32.2Q87.5 32.6 87.1 32.6","a"],["M10.5 70.7L7.6 70.7L8.8 63.7L6.8 63.7L7.2 61.3L14.2 61.3L13.7 63.7L11.7 63.7L10.5 70.7M6.7 61.3L6.6 62.0L0.3 61.3L6.7 61.3M6.5 62.8L6.4 63.4L0.0 62.8L6.5 62.8M8.3 64.2L8.2 64.9L1.8 64.2L8.3 64.2M8.0 65.6L7.9 66.3L1.5 65.6L8.0 65.6M7.8 67.1L7.7 67.7L1.3 67.1L7.8 67.1M7.5 68.5L7.4 69.2L1.0 68.5L7.5 68.5M7.3 70.0L7.1 70.6L0.8 70.0L7.3 70.0M20.2 70.9L20.2 70.9Q18.3 70.9 17.5 70.1Q16.7 69.4 16.7 67.9L16.7 67.9Q16.7 67.5 16.8 67.0Q16.8 66.5 16.9 66.0L16.9 66.0Q17.2 64.4 17.8 63.3Q18.3 62.2 19.3 61.6Q20.3 61.1 22.0 61.1L22.0 61.1Q23.9 61.1 24.7 61.8Q25.5 62.6 25.5 64.1L25.5 64.1Q25.5 64.7 25.4 65.5Q25.3 66.3 25.1 67.1Q24.8 68.0 24.4 68.7Q24.1 69.4 23.5 70.0L23.5 70.0Q22.9 70.5 22.1 70.7Q21.3 70.9 20.2 70.9M18.3 61.8L18.3 61.8L13.7 61.3L18.9 61.3Q18.8 61.4 18.6 61.5Q18.4 61.7 18.3 61.8M17.2 63.4L17.2 63.4L11.6 62.8L17.5 62.8Q17.4 62.9 17.4 63.0Q17.3 63.2 17.2 63.4M20.2 64.4L19.6 68.3L20.7 68.3Q21.2 68.3 21.6 68.2Q21.9 68.1 22.0 67.6L22.0 67.6L22.7 63.7L21.5 63.7Q21.0 63.7 20.7 63.8Q20.4 63.9 20.2 64.4L20.2 64.4M16.9 64.2L16.7 64.8L10.9 64.2L16.9 64.2M16.4 66.3L16.4 66.3L10.5 65.6L16.5 65.6L16.5 65.9Q16.5 66.0 16.5 66.1Q16.4 66.2 16.4 66.3M16.3 67.7L16.3 67.7L10.4 67.1L16.3 67.1Q16.3 67.4 16.3 67.7M16.4 69.1L16.4 69.1L10.6 68.5L16.3 68.5Q16.3 68.7 16.4 68.8Q16.4 69.0 16.4 69.1M17.2 70.5L17.2 70.5L12.0 70.0L16.7 70.0Q16.9 70.3 17.2 70.5M31.8 70.7L28.9 70.7L30.6 61.3L35.1 61.3Q36.0 61.3 36.6 61.6Q37.2 61.9 37.4 62.4Q37.6 62.9 37.6 63.6L37.6 63.6Q37.6 64.0 37.5 64.6Q37.5 65.1 37.3 65.7Q37.0 66.3 36.7 66.8Q36.3 67.3 35.7 67.6L35.7 67.6L36.7 70.7L33.5 70.7L32.9 67.9L32.2 67.9L31.8 70.7M30.1 61.3L30.0 62.0L23.6 61.3L30.1 61.3M29.8 62.8L29.7 63.4L23.4 62.8L29.8 62.8M33.0 63.7L32.6 65.6L33.3 65.6Q33.7 65.6 34.0 65.5Q34.3 65.4 34.4 65.0L34.4 65.0Q34.5 64.6 34.5 64.4Q34.5 64.2 34.5 64.2L34.5 64.2Q34.5 63.8 34.3 63.8Q34.0 63.7 33.5 63.7L33.5 63.7L33.0 63.7M29.6 64.2L29.5 64.9L23.1 64.2L29.6 64.2M29.3 65.6L29.2 66.3L22.9 65.6L29.3 65.6M29.1 67.1L29.0 67.7L22.6 67.1L29.1 67.1M28.8 68.5L28.7 69.2L22.3 68.5L28.8 68.5M28.6 70.0L28.5 70.6L22.1 70.0L28.6 70.0M43.7 70.7L40.8 70.7L42.5 61.3L45.2 61.3L46.7 64.6Q46.8 64.7 46.8 64.9L46.8 64.9Q46.8 65.0 46.7 65.2Q46.7 65.3 46.7 65.4L46.7 65.4L46.8 65.4L47.6 61.3L50.4 61.3L48.8 70.7L46.1 70.7L44.5 67.4Q44.5 67.3 44.5 67.2Q44.5 67.1 44.5 67.0L44.5 67.0Q44.5 66.9 44.5 66.8Q44.5 66.7 44.5 66.6L44.5 66.6L44.4 66.6L43.7 70.7M42.0 61.3L41.9 62.0L35.6 61.3L42.0 61.3M41.8 62.8L41.7 63.4L35.3 62.8L41.8 62.8M41.5 64.2L41.4 64.9L35.0 64.2L41.5 64.2M41.3 65.6L41.2 66.3L34.8 65.6L41.3 65.6M41.0 67.1L40.9 67.7L34.5 67.1L41.0 67.1M40.8 68.5L40.6 69.2L34.3 68.5L40.8 68.5M40.5 70.0L40.4 70.6L34.0 70.0L40.5 70.0M56.4 70.7L53.4 70.7L57.4 61.3L61.8 61.3L62.4 70.7L59.4 70.7L59.4 69.2L57.0 69.2L56.4 70.7M56.9 61.3L56.6 62.0L50.5 61.3L56.9 61.3M56.3 62.8L56.0 63.4L49.9 62.8L56.3 62.8M55.7 64.2L55.4 64.9L49.3 64.2L55.7 64.2M59.0 64.2L57.9 66.8L59.1 66.8L59.1 64.2L59.0 64.2M55.1 65.6L54.8 66.3L48.6 65.6L55.1 65.6M54.4 67.1L54.2 67.7L48.0 67.1L54.4 67.1M53.8 68.5L53.6 69.2L47.4 68.5L53.8 68.5M53.2 70.0L52.9 70.6L46.8 70.0L53.2 70.0M70.4 70.7L66.4 70.7L68.0 61.3L72.0 61.3Q74.0 61.3 74.8 62.0Q75.6 62.7 75.6 64.2L75.6 64.2Q75.6 65.0 75.4 66.0L75.4 66.0Q75.1 67.6 74.6 68.7Q74.0 69.7 73.0 70.2Q72.0 70.7 70.4 70.7L70.4 70.7M67.6 61.3L67.4 62.0L61.1 61.3L67.6 61.3M67.3 62.8L67.2 63.4L60.8 62.8L67.3 62.8M70.4 63.7L69.7 68.3L70.8 68.3Q71.3 68.3 71.7 68.2Q72.0 68.0 72.1 67.5L72.1 67.5L72.6 64.5Q72.6 64.4 72.6 64.4Q72.6 64.3 72.6 64.3L72.6 64.3Q72.6 63.9 72.3 63.8Q72.1 63.7 71.6 63.7L71.6 63.7L70.4 63.7M67.1 64.2L67.0 64.9L60.6 64.2L67.1 64.2M66.8 65.6L66.7 66.3L60.3 65.6L66.8 65.6M66.6 67.1L66.4 67.7L60.1 67.1L66.6 67.1M66.3 68.5L66.2 69.2L59.8 68.5L66.3 68.5M66.1 70.0L65.9 70.6L59.6 70.0L66.1 70.0M82.6 70.9L82.6 70.9Q80.6 70.9 79.8 70.1Q79.0 69.4 79.0 67.9L79.0 67.9Q79.0 67.5 79.1 67.0Q79.2 66.5 79.2 66.0L79.2 66.0Q79.5 64.4 80.1 63.3Q80.6 62.2 81.6 61.6Q82.7 61.1 84.3 61.1L84.3 61.1Q86.3 61.1 87.0 61.8Q87.8 62.6 87.8 64.1L87.8 64.1Q87.8 64.7 87.7 65.5Q87.6 66.3 87.4 67.1Q87.2 68.0 86.8 68.7Q86.4 69.4 85.8 70.0L85.8 70.0Q85.2 70.5 84.4 70.7Q83.6 70.9 82.6 70.9M80.6 61.8L80.6 61.8L76.0 61.3L81.3 61.3Q81.1 61.4 80.9 61.5Q80.8 61.7 80.6 61.8M79.5 63.4L79.5 63.4L73.9 62.8L79.8 62.8Q79.8 62.9 79.7 63.0Q79.6 63.2 79.5 63.4M82.6 64.4L81.9 68.3L83.1 68.3Q83.6 68.3 83.9 68.2Q84.2 68.1 84.3 67.6L84.3 67.6L85.0 63.7L83.8 63.7Q83.3 63.7 83.0 63.8Q82.7 63.9 82.6 64.4L82.6 64.4M79.2 64.2L79.0 64.8L73.2 64.2L79.2 64.2M78.8 66.3L78.8 66.3L72.9 65.6L78.9 65.6L78.8 65.9Q78.8 66.0 78.8 66.1Q78.8 66.2 78.8 66.3M78.6 67.7L78.6 67.7L72.7 67.1L78.7 67.1Q78.6 67.4 78.6 67.7M78.7 69.1L78.7 69.1L72.9 68.5L78.6 68.5Q78.7 68.7 78.7 68.8Q78.7 69.0 78.7 69.1M79.5 70.5L79.5 70.5L74.3 70.0L79.1 70.0Q79.3 70.3 79.5 70.5M94.7 70.9L94.7 70.9Q93.9 70.9 93.0 70.8Q92.2 70.7 91.4 70.5L91.4 70.5L92.2 68.0Q92.8 68.2 93.4 68.3Q94.1 68.4 94.7 68.4L94.7 68.4Q95.2 68.4 95.5 68.4Q95.9 68.3 96.2 68.3L96.2 68.3L96.3 67.6L95.1 67.4Q93.6 67.3 93.1 66.8Q92.5 66.2 92.5 65.3L92.5 65.3Q92.5 64.9 92.6 64.4L92.6 64.4Q92.8 63.2 93.3 62.4Q93.7 61.7 94.6 61.4Q95.4 61.1 96.8 61.1L96.8 61.1Q97.7 61.1 98.5 61.2Q99.3 61.3 100.0 61.5L100.0 61.5L99.2 63.9Q98.6 63.8 98.1 63.7Q97.6 63.6 96.9 63.6L96.9 63.6Q96.6 63.6 96.4 63.7Q96.1 63.7 95.8 63.7L95.8 63.7L95.6 64.4L96.7 64.6Q97.7 64.7 98.3 65.0Q99.0 65.3 99.2 65.7Q99.5 66.2 99.5 66.8L99.5 66.8Q99.5 67.0 99.5 67.2Q99.4 67.3 99.4 67.6L99.4 67.6Q99.2 68.8 98.7 69.5Q98.3 70.1 97.6 70.5Q97.0 70.8 96.3 70.8Q95.5 70.9 94.7 70.9M93.0 61.9L93.0 61.9L87.2 61.3L93.7 61.3Q93.5 61.4 93.3 61.6Q93.2 61.7 93.0 61.9M92.6 62.8L92.3 63.4L86.1 62.8L92.6 62.8M92.0 64.9L92.0 64.9L85.7 64.2L92.2 64.2Q92.1 64.2 92.1 64.3Q92.1 64.3 92.1 64.4L92.1 64.4Q92.1 64.5 92.1 64.6Q92.1 64.7 92.0 64.9M92.2 66.3L92.2 66.3L85.8 65.6L92.0 65.6Q92.1 65.8 92.1 66.0Q92.1 66.1 92.2 66.3M94.1 67.7L94.1 67.7L86.2 67.1L92.7 67.1Q93.2 67.6 94.1 67.7M91.6 68.5L91.3 69.2L86.0 68.5L91.6 68.5M91.1 70.0L90.9 70.6L85.7 70.0L91.1 70.0","m"]],"AVY":[["M20.3 22.9L20.3 22.9Q20.7 21.9 20.9 21.9L20.9 21.9L21.0 21.9Q21.2 21.9 21.8 22.4Q22.4 22.8 22.4 23.2L22.4 23.2Q22.4 23.7 18.9 31.5Q15.4 39.2 14.9 40.1Q14.4 41.1 14.2 41.4Q14.0 41.7 13.7 42.1L13.7 42.1Q13.1 42.8 12.2 42.8L12.2 42.8Q11.9 42.8 11.6 42.9Q11.3 43.0 11.3 43.0L11.3 43.0Q10.8 43.0 10.8 42.8L10.8 42.8Q10.8 42.7 10.9 42.4Q11.1 42.1 14.1 35.8L14.1 35.8Q10.9 35.7 8.4 35.6L8.4 35.6Q6.1 38.6 4.2 41.8L4.2 41.8Q3.9 42.2 3.7 42.4Q3.5 42.6 3.2 42.6Q2.8 42.6 2.4 42.2Q2.0 41.9 2.0 41.4L2.0 41.4Q2.0 40.0 5.5 35.5L5.5 35.5Q3.9 35.5 3.4 35.6Q3.0 35.7 2.9 35.7L2.9 35.7Q2.5 35.7 2.5 35.1Q2.5 34.4 3.2 34.0Q4.0 33.5 5.2 33.5L5.2 33.5Q5.3 33.5 5.5 33.5L5.5 33.5Q6.4 33.4 7.3 33.4L7.3 33.4Q10.2 29.9 13.5 26.9Q16.8 23.9 19.1 22.7L19.1 22.7Q19.5 22.5 19.7 22.5Q20.0 22.5 20.3 22.9M19.3 24.8L19.3 24.8Q14.3 28.6 10.2 33.4L10.2 33.4Q12.6 33.5 15.1 33.6L15.1 33.6Q17.6 28.4 19.3 24.8M29.9 31.5L29.9 31.5Q29.9 32.5 28.8 34.3Q27.8 36.1 26.1 38.0Q24.5 39.8 22.6 41.2Q20.8 42.6 19.8 42.6L19.8 42.6Q19.2 42.6 18.7 42.1Q18.3 41.7 18.3 40.8Q18.3 39.9 19.1 38.0Q20.0 36.1 20.8 34.8L20.8 34.8Q20.1 35.3 19.9 35.3Q19.7 35.3 19.5 34.9Q19.3 34.6 19.3 34.4Q19.3 34.2 19.3 34.1L19.3 34.1Q22.0 31.1 23.1 31.1L23.1 31.1Q23.6 31.1 23.9 31.4Q24.2 31.6 24.2 32.0Q24.2 32.4 23.3 34.2Q22.4 36.0 21.4 37.9Q20.5 39.8 20.5 40.2L20.5 40.2Q20.5 40.3 20.6 40.3L20.6 40.3Q20.9 40.3 22.5 38.9Q24.1 37.5 25.0 36.3Q26.0 35.0 26.8 33.8Q27.5 32.6 27.5 32.2Q27.5 31.8 27.3 31.6Q27.2 31.3 27.2 31.0Q27.2 30.7 27.6 30.4Q28.0 30.0 28.6 30.0L28.6 30.0Q29.9 30.0 29.9 31.5M38.1 31.8L38.1 31.8Q38.1 32.8 37.4 33.4Q36.6 34.1 35.7 34.1L35.7 34.1Q35.4 34.1 35.3 34.0Q35.2 33.8 35.2 33.6Q35.2 33.4 35.3 33.1L35.3 33.1Q34.8 33.3 34.2 33.7Q33.6 34.0 32.7 34.7Q31.8 35.3 31.8 35.7L31.8 35.7Q31.8 35.8 32.1 35.8Q32.4 35.8 33.1 35.5Q33.8 35.3 34.1 35.3Q34.3 35.3 34.4 35.4L34.4 35.4Q34.6 35.4 34.8 35.8Q35.0 36.1 35.0 36.3Q35.0 36.5 34.6 36.8Q34.3 37.1 33.8 37.2Q33.4 37.4 33.2 37.5L33.2 37.5Q30.3 39.1 30.3 39.7L30.3 39.7Q30.3 40.7 32.2 40.7L32.2 40.7Q33.3 40.7 34.5 40.0L34.5 40.0Q35.5 39.4 36.3 38.7Q37.1 38.1 37.3 37.9Q37.5 37.8 37.6 37.8L37.6 37.8Q38.0 37.8 38.0 38.6Q38.0 39.4 37.9 39.6Q37.8 39.9 37.3 40.2L37.3 40.2Q34.4 42.6 31.8 42.6L31.8 42.6Q30.4 42.6 29.6 42.2L29.6 42.2Q28.0 41.5 28.0 40.1L28.0 40.1Q28.0 38.2 30.7 37.2L30.7 37.2Q30.1 37.0 30.0 36.6Q29.8 36.3 29.8 35.5Q29.8 34.7 30.6 33.8Q31.3 32.9 32.4 32.3L32.4 32.3Q34.8 31.0 36.7 31.0L36.7 31.0Q37.2 31.0 37.6 31.2Q38.1 31.5 38.1 31.8M42.6 33.8L42.0 34.6Q45.3 31.0 47.5 31.0L47.5 31.0Q48.1 31.0 48.5 31.3Q48.8 31.6 48.8 32.2Q48.8 32.7 48.1 33.9Q47.3 35.2 46.7 36.1L46.7 36.1Q46.3 36.5 45.9 36.5Q45.5 36.5 45.2 36.2Q45.0 35.9 45.0 35.4L45.0 35.4Q45.0 34.5 46.0 33.3L46.0 33.3L46.0 33.3Q45.5 33.3 43.7 35.1Q41.9 36.8 40.7 38.2Q39.4 39.5 38.0 41.5L38.0 41.5Q37.6 42.1 37.3 42.1Q37.0 42.1 36.5 41.9Q36.0 41.7 35.9 41.7Q35.8 41.6 35.8 41.4Q35.8 41.2 35.9 40.9Q36.0 40.7 36.3 40.2Q36.6 39.8 37.2 38.7Q37.8 37.7 39.0 35.6Q40.3 33.5 40.5 33.0L40.5 33.0Q41.1 32.1 41.4 31.7L41.4 31.7Q42.0 30.9 43.5 30.9L43.5 30.9Q43.8 30.9 43.8 31.3L43.8 31.3Q43.8 32.0 42.6 33.8L42.6 33.8M51.5 46.6L51.5 46.6Q51.4 46.7 51.1 47.3Q50.7 47.9 50.3 48.6Q49.9 49.2 49.4 49.8Q48.8 50.4 48.4 50.4Q48.0 50.5 47.9 50.5L47.9 50.5Q46.6 50.5 46.6 49.2L46.6 49.2Q46.6 47.7 48.2 45.7L48.2 45.7Q48.8 44.9 49.6 44.1Q50.5 43.2 50.6 43.1Q50.7 43.0 52.7 39.2L52.7 39.2Q51.4 40.7 50.2 41.6Q49.1 42.5 48.1 42.6L48.1 42.6L48.0 42.6Q47.4 42.6 46.9 42.2Q46.4 41.9 46.4 41.0L46.4 41.0Q46.4 39.7 47.1 38.5L47.1 38.5Q47.3 38.1 48.0 37.1Q48.6 36.0 49.1 35.1L49.1 35.1Q49.6 34.4 50.1 33.4Q50.6 32.4 50.9 31.9Q51.2 31.5 51.4 31.5Q51.7 31.5 52.0 31.8Q52.4 32.1 52.4 32.5Q52.4 33.0 50.6 36.2Q48.9 39.5 48.9 39.9L48.9 39.9Q48.9 40.0 49.0 40.0L49.0 40.0Q49.3 40.0 50.6 39.0Q51.9 37.9 53.4 36.3L53.4 36.3Q55.1 34.5 56.1 33.0L56.1 33.0Q56.2 32.8 56.3 32.7Q56.3 32.6 56.5 32.4Q56.6 32.2 56.7 32.1Q56.7 32.0 56.8 31.9Q56.9 31.8 57.0 31.7Q57.1 31.6 57.2 31.6L57.2 31.6Q57.3 31.4 57.5 31.4Q57.7 31.4 58.1 31.5Q58.5 31.6 58.5 31.7Q58.6 31.8 58.7 31.9L58.7 31.9Q58.8 32.0 58.8 32.2Q58.8 32.3 58.7 32.5Q58.6 32.7 57.5 34.7L57.5 34.7Q54.0 40.4 52.7 43.1L52.7 43.1Q54.8 41.3 58.6 37.9L58.6 37.9Q58.8 37.8 58.9 37.8L58.9 37.8Q59.3 37.8 59.3 39.1L59.3 39.1Q59.3 39.5 59.2 39.6L59.2 39.6Q55.1 42.7 51.5 46.6M69.7 31.5L69.7 31.5Q69.7 32.5 68.6 34.3Q67.6 36.1 65.9 38.0Q64.3 39.8 62.4 41.2Q60.6 42.6 59.5 42.6L59.5 42.6Q59.0 42.6 58.5 42.1Q58.1 41.7 58.1 40.8Q58.1 39.9 58.9 38.0Q59.8 36.1 60.6 34.8L60.6 34.8Q59.8 35.3 59.7 35.3Q59.5 35.3 59.3 34.9Q59.1 34.6 59.1 34.4Q59.1 34.2 59.1 34.1L59.1 34.1Q61.8 31.1 62.9 31.1L62.9 31.1Q63.4 31.1 63.7 31.4Q64.0 31.6 64.0 32.0Q64.0 32.4 63.1 34.2Q62.2 36.0 61.2 37.9Q60.3 39.8 60.3 40.2L60.3 40.2Q60.3 40.3 60.4 40.3L60.4 40.3Q60.7 40.3 62.3 38.9Q63.9 37.5 64.8 36.3Q65.8 35.0 66.5 33.8Q67.3 32.6 67.3 32.2Q67.3 31.8 67.1 31.6Q67.0 31.3 67.0 31.0Q67.0 30.7 67.4 30.4Q67.8 30.0 68.4 30.0L68.4 30.0Q69.7 30.0 69.7 31.5M77.4 27.1L77.4 27.1Q77.4 27.8 76.6 28.6Q75.9 29.4 75.1 29.4Q74.3 29.4 74.3 28.6Q74.3 27.8 75.0 27.0Q75.7 26.3 76.6 26.3L76.6 26.3Q76.9 26.3 77.2 26.5Q77.4 26.7 77.4 27.1M75.2 39.0L75.2 39.0Q75.2 39.4 75.1 39.6L75.1 39.6Q74.4 41.0 72.9 41.8Q71.5 42.6 70.4 42.6Q69.3 42.6 68.5 41.9Q67.8 41.2 67.8 40.4Q67.8 39.7 68.5 38.3Q69.3 36.8 70.0 35.6Q70.8 34.4 70.8 34.3Q70.8 34.2 70.5 33.9Q70.2 33.6 70.2 33.4Q70.2 33.3 70.8 32.7Q71.3 32.1 72.2 31.5Q73.0 30.9 73.4 30.9Q73.8 30.9 74.2 31.3Q74.5 31.6 74.5 32.0Q74.5 32.3 71.3 37.9L71.3 37.9Q71.2 38.0 71.0 38.2Q70.8 38.5 70.7 38.7Q70.6 38.9 70.5 39.2L70.5 39.2Q70.2 39.7 70.2 40.1L70.2 40.1Q70.2 40.5 70.9 40.5Q71.5 40.5 72.2 40.1Q72.8 39.7 73.3 39.2L73.3 39.2Q74.6 37.8 74.8 37.8L74.8 37.8Q75.2 37.8 75.2 39.0M85.5 21.5Q86.1 21.5 86.6 21.9Q87.1 22.3 87.1 23.1Q87.1 23.9 86.3 25.5Q85.4 27.1 84.3 28.8Q83.1 30.5 81.6 32.5L81.6 32.5Q79.2 35.5 77.0 37.9L77.0 37.9Q77.0 38.1 76.9 38.5Q76.8 39.0 76.8 39.4Q76.8 39.9 77.2 40.2Q77.6 40.6 78.2 40.6Q78.8 40.6 79.5 40.2Q80.2 39.7 80.8 39.2L80.8 39.2Q82.1 37.8 82.5 37.8Q82.8 37.8 82.8 38.8L82.8 38.8L82.8 39.0Q82.8 39.6 82.6 39.8L82.6 39.8Q81.4 41.2 80.0 41.9Q78.6 42.6 77.3 42.6Q76.0 42.6 75.3 41.8Q74.7 41.0 74.7 39.7L74.7 39.7Q74.7 37.0 76.1 33.4Q77.5 29.8 79.3 27.3L79.3 27.3Q83.3 21.5 85.5 21.5L85.5 21.5M84.9 23.8L84.9 23.8Q84.9 23.6 84.7 23.6L84.7 23.6Q84.3 23.6 82.2 26.3Q80.2 29.1 79.3 30.7Q78.4 32.3 77.5 34.8L77.5 34.8Q79.2 32.9 82.0 28.8Q84.9 24.8 84.9 23.8M92.7 21.5Q93.4 21.5 93.9 21.9Q94.4 22.3 94.4 23.1Q94.4 23.9 93.5 25.5Q92.7 27.1 91.5 28.8Q90.3 30.5 88.8 32.5L88.8 32.5Q86.4 35.5 84.2 37.9L84.2 37.9Q84.2 38.1 84.1 38.5Q84.0 39.0 84.0 39.4Q84.0 39.9 84.4 40.2Q84.8 40.6 85.4 40.6Q86.1 40.6 86.8 40.2Q87.5 39.7 88.0 39.2L88.0 39.2Q89.4 37.8 89.7 37.8Q90.0 37.8 90.0 38.8L90.0 38.8L90.0 39.0Q90.0 39.6 89.8 39.8L89.8 39.8Q88.7 41.2 87.2 41.9Q85.8 42.6 84.5 42.6Q83.2 42.6 82.6 41.8Q81.9 41.0 81.9 39.7L81.9 39.7Q81.9 37.0 83.3 33.4Q84.7 29.8 86.5 27.3L86.5 27.3Q90.6 21.5 92.7 21.5L92.7 21.5M92.1 23.8L92.1 23.8Q92.1 23.6 92.0 23.6L92.0 23.6Q91.5 23.6 89.4 26.3Q87.4 29.1 86.5 30.7Q85.6 32.3 84.8 34.8L84.8 34.8Q86.4 32.9 89.2 28.8Q92.1 24.8 92.1 23.8M98.0 31.8L98.0 31.8Q98.0 32.8 97.3 33.4Q96.5 34.1 95.6 34.1L95.6 34.1Q95.3 34.1 95.2 34.0Q95.1 33.8 95.1 33.6Q95.1 33.4 95.2 33.1L95.2 33.1Q94.7 33.3 94.1 33.7Q93.5 34.0 92.6 34.7Q91.7 35.3 91.7 35.7L91.7 35.7Q91.7 35.8 92.0 35.8Q92.4 35.8 93.0 35.5Q93.7 35.3 94.0 35.3Q94.2 35.3 94.3 35.4L94.3 35.4Q94.5 35.4 94.7 35.8Q94.9 36.1 94.9 36.3Q94.9 36.5 94.6 36.8Q94.2 37.1 93.7 37.2Q93.3 37.4 93.1 37.5L93.1 37.5Q90.3 39.1 90.3 39.7L90.3 39.7Q90.3 40.7 92.1 40.7L92.1 40.7Q93.2 40.7 94.4 40.0L94.4 40.0Q95.4 39.4 96.2 38.7Q97.0 38.1 97.2 37.9Q97.4 37.8 97.5 37.8L97.5 37.8Q97.9 37.8 97.9 38.6Q97.9 39.4 97.8 39.6Q97.7 39.9 97.3 40.2L97.3 40.2Q94.3 42.6 91.7 42.6L91.7 42.6Q90.3 42.6 89.5 42.2L89.5 42.2Q88.0 41.5 88.0 40.1L88.0 40.1Q88.0 38.2 90.6 37.2L90.6 37.2Q90.1 37.0 89.9 36.6Q89.8 36.3 89.8 35.5Q89.8 34.7 90.5 33.8Q91.2 32.9 92.3 32.3L92.3 32.3Q94.7 31.0 96.6 31.0L96.6 31.0Q97.1 31.0 97.5 31.2Q98.0 31.5 98.0 31.8","m"],["M14.0 69.0L14.0 67.4L23.6 67.4L23.6 71.4L22.0 71.4L22.0 69.0L17.3 69.0L17.3 74.2L22.0 74.2L22.0 75.8L17.3 75.8L17.3 81.0L22.0 81.0L22.0 78.6L23.6 78.6L23.6 82.6L14.0 82.6L14.0 81.0L15.4 81.0L15.4 69.0L14.0 69.0M29.2 69.0L29.2 67.4L34.6 67.4L34.6 69.0L33.7 69.0L37.3 81.0L38.3 81.0L38.3 82.6L34.0 82.6L34.0 81.0L35.4 81.0L34.5 77.9L29.4 77.9L28.4 81.0L29.9 81.0L29.9 82.6L25.6 82.6L25.6 81.0L26.6 81.0L30.1 69.0L29.2 69.0M34.0 76.2L31.9 69.3L29.9 76.2L34.0 76.2M48.1 79.5L48.1 76.4L45.3 76.4L45.3 74.8L49.7 74.8L49.7 80.4L47.6 82.6L42.3 82.6L40.2 80.4L40.2 69.6L42.3 67.4L47.6 67.4L49.7 69.6L49.7 72.2L48.1 72.2L48.1 70.5L46.8 69.1L43.1 69.1L42.1 70.2L42.1 79.8L43.1 80.9L46.8 80.9L48.1 79.5M52.7 69.0L52.7 67.4L57.6 67.4L57.6 69.0L56.0 69.0L56.0 81.0L60.4 81.0L60.4 78.6L62.0 78.6L62.0 82.6L52.7 82.6L52.7 81.0L54.2 81.0L54.2 69.0L52.7 69.0M64.0 69.0L64.0 67.4L73.6 67.4L73.6 71.4L72.0 71.4L72.0 69.0L67.3 69.0L67.3 74.2L72.0 74.2L72.0 75.8L67.3 75.8L67.3 81.0L72.0 81.0L72.0 78.6L73.6 78.6L73.6 82.6L64.0 82.6L64.0 81.0L65.4 81.0L65.4 69.0L64.0 69.0M85.8 69.6L85.8 72.2L84.1 72.2L84.1 70.4L82.9 69.1L79.8 69.1L78.7 70.2L78.7 73.0L79.7 74.0L84.0 74.0L86.0 76.2L86.0 80.4L83.9 82.6L78.8 82.6L76.7 80.4L76.7 77.8L78.4 77.8L78.4 79.6L79.6 80.9L83.1 80.9L84.1 79.8L84.1 76.8L83.2 75.8L79.0 75.8L76.9 73.6L76.9 69.6L79.0 67.4L83.7 67.4L85.8 69.6","a"]],"BAY":[["M16.4 38.9L16.4 38.9Q16.0 38.8 15.9 38.6Q15.7 38.4 15.7 38.2L15.7 38.2Q15.7 38.1 15.7 38.1Q15.8 38.1 15.8 38.0L15.8 38.0Q15.9 36.0 16.1 33.8Q16.3 31.6 16.5 29.3Q16.7 27.0 16.9 24.8Q17.1 22.5 17.3 20.4L17.3 20.4L17.3 20.4Q17.2 20.4 16.8 20.5Q16.5 20.6 16.1 20.7Q15.6 20.9 15.2 21.0Q14.7 21.1 14.4 21.1L14.4 21.1Q14.2 21.1 14.1 20.9Q14.0 20.7 14.0 20.5L14.0 20.5Q14.0 20.3 14.1 20.2L14.1 20.2Q14.6 18.7 15.1 17.5Q15.6 16.2 16.2 14.9L16.2 14.9Q17.6 14.1 19.1 13.5Q20.7 13.0 22.2 12.6Q23.8 12.2 25.3 12.0Q26.9 11.8 28.3 11.8L28.3 11.8Q30.3 11.8 32.1 12.2Q33.9 12.7 35.3 13.5Q36.6 14.4 37.4 15.7Q38.1 17.0 38.1 18.8L38.1 18.8Q38.1 19.6 37.8 20.3Q37.5 21.0 36.9 21.6Q36.4 22.3 35.8 22.8Q35.1 23.4 34.5 23.8L34.5 23.8Q35.4 24.5 36.1 25.0Q36.8 25.5 37.3 26.1Q37.8 26.7 38.1 27.4Q38.3 28.1 38.3 29.1L38.3 29.1Q38.3 30.7 37.8 32.1Q37.2 33.5 36.3 34.8Q35.3 36.0 34.0 37.0Q32.7 38.0 31.2 38.7Q29.6 39.4 27.9 39.7Q26.2 40.1 24.5 40.1L24.5 40.1Q23.8 40.1 22.8 40.0Q21.7 39.9 20.5 39.7Q19.4 39.5 18.3 39.3Q17.1 39.1 16.4 38.9M25.0 18.5L25.0 18.5Q24.6 20.7 24.4 22.9Q24.1 25.2 23.9 27.3Q23.8 29.5 23.6 31.4Q23.5 33.3 23.4 34.8L23.4 34.8Q24.1 34.8 25.0 34.7Q25.9 34.6 26.7 34.4Q27.6 34.2 28.4 33.9Q29.2 33.6 29.8 33.1Q30.4 32.6 30.8 32.0Q31.2 31.3 31.2 30.4L31.2 30.4Q31.2 29.9 30.8 29.5Q30.5 29.1 30.0 28.8Q29.5 28.5 28.9 28.3Q28.3 28.1 27.8 28.0Q27.2 27.9 26.7 27.8Q26.3 27.8 26.0 27.7L26.0 27.7Q25.8 27.7 25.7 27.5Q25.6 27.4 25.6 27.2L25.6 27.2Q25.6 26.9 25.9 26.4Q26.2 26.0 26.7 25.1L26.7 25.1L27.5 23.9Q28.0 23.7 28.6 23.4Q29.2 23.1 29.7 22.8Q30.2 22.4 30.5 21.9Q30.9 21.5 30.9 21.0L30.9 21.0Q30.9 19.4 30.2 18.6Q29.5 17.8 28.3 17.8L28.3 17.8Q26.9 17.8 25.0 18.5M39.6 37.8L39.6 37.8Q39.8 37.3 40.1 36.7Q40.3 36.1 40.6 35.4L40.6 35.4L41.1 34.2Q40.7 33.7 40.4 33.1Q40.0 32.5 39.8 31.9Q39.5 31.3 39.3 30.6Q39.1 30.0 39.1 29.4L39.1 29.4Q39.1 29.4 39.4 29.4Q39.7 29.4 40.1 29.3Q40.6 29.3 41.1 29.3Q41.6 29.3 42.0 29.3Q42.5 29.3 42.8 29.3Q43.0 29.3 43.0 29.3L43.0 29.3Q43.5 28.1 43.9 27.1Q44.3 26.1 44.7 25.1Q45.1 24.1 45.5 23.0Q45.9 21.9 46.3 20.7L46.3 20.7Q47.1 18.4 47.9 16.6Q48.6 14.9 49.3 13.4L49.3 13.4Q49.3 13.2 49.5 13.0Q49.7 12.9 49.9 12.8Q50.1 12.7 50.3 12.6Q50.5 12.5 50.6 12.5L50.6 12.5Q50.7 12.5 51.2 12.3Q51.7 12.2 52.3 12.0Q52.9 11.8 53.6 11.7Q54.2 11.6 54.6 11.6L54.6 11.6L54.9 11.6Q55.2 11.6 55.5 11.7Q55.7 11.8 55.8 12.2L55.8 12.2Q56.7 14.5 57.7 17.3Q58.8 20.0 59.7 23.2L59.7 23.2Q60.2 25.0 60.8 26.5Q61.3 28.1 61.8 29.6Q62.3 31.1 62.8 32.6Q63.3 34.1 63.8 35.7L63.8 35.7Q64.0 36.3 64.2 36.7Q64.3 37.1 64.5 37.3Q64.6 37.6 64.7 37.7Q64.8 37.8 64.8 37.9L64.8 37.9Q64.8 38.0 64.5 38.1L64.5 38.1L60.5 39.4Q60.0 39.6 59.6 39.7Q59.1 39.9 58.7 40.0Q58.3 40.2 58.0 40.2Q57.7 40.3 57.5 40.3L57.5 40.3L57.4 40.3Q57.2 40.3 57.0 40.2Q56.9 40.0 56.9 39.9L56.9 39.9Q56.7 39.2 56.5 38.8Q56.3 38.3 56.2 37.8Q56.0 37.3 55.8 36.7Q55.6 36.2 55.5 35.4L55.5 35.4Q55.4 35.3 55.3 35.2Q55.1 35.2 54.9 35.1Q54.6 35.1 54.4 35.1Q54.1 35.1 53.9 35.1L53.9 35.1Q53.2 35.1 52.7 35.1Q52.3 35.1 52.0 35.1Q51.6 35.1 51.3 35.1Q51.0 35.1 50.6 35.1L50.6 35.1Q50.0 35.1 49.5 35.1Q48.9 35.1 48.4 35.1L48.4 35.1L47.4 35.1Q46.9 36.4 46.4 37.6Q45.9 38.7 45.3 40.0L45.3 40.0Q45.3 40.1 45.2 40.2Q45.0 40.3 44.9 40.3L44.9 40.3Q44.8 40.3 44.7 40.3L44.7 40.3Q42.9 39.7 41.7 39.0Q40.5 38.4 39.6 37.8M52.1 21.0L52.1 21.0Q51.7 22.7 51.2 24.1Q50.8 25.4 50.4 26.4Q50.1 27.5 49.8 28.2Q49.6 28.9 49.4 29.3L49.4 29.3L49.4 29.5Q49.4 29.6 49.4 29.6L49.4 29.6L53.9 29.6Q53.7 28.7 53.5 27.8Q53.2 26.9 53.0 25.8Q52.8 24.8 52.6 23.6Q52.3 22.5 52.1 21.0M64.6 14.3L64.6 14.3Q64.7 14.3 65.0 14.1Q65.2 14.0 65.6 13.9Q66.0 13.7 66.4 13.5Q66.8 13.4 67.2 13.2L67.2 13.2L69.4 12.3Q69.6 12.2 69.8 12.2L69.8 12.2Q70.0 12.2 70.2 12.3Q70.3 12.4 70.6 12.6L70.6 12.6L74.9 21.0L75.0 20.7L76.8 17.3Q77.2 16.6 77.5 16.0Q77.9 15.4 78.1 14.9Q78.4 14.4 78.6 14.1Q78.8 13.9 78.8 13.9L78.8 13.9L85.2 12.2Q85.4 12.2 85.6 12.2L85.6 12.2Q86.0 12.2 86.0 12.6L86.0 12.6Q86.0 12.7 86.0 12.8Q85.9 13.0 85.9 13.2L85.9 13.2L80.4 23.3Q80.0 24.1 79.5 24.9Q79.1 25.6 78.7 26.3Q78.3 27.0 78.0 27.5Q77.7 28.1 77.5 28.5L77.5 28.5L77.4 29.1L76.4 36.1Q76.3 36.4 76.3 36.6Q76.2 36.8 76.2 36.9Q76.1 37.0 76.0 37.1Q75.9 37.2 75.7 37.3L75.7 37.3L70.4 40.1Q70.1 40.3 69.8 40.3Q69.5 40.4 69.2 40.4L69.2 40.4Q68.9 40.4 68.6 40.3Q68.4 40.2 68.4 39.8L68.4 39.8L68.4 39.8Q68.5 38.7 68.7 37.3Q68.9 35.9 69.1 34.6L69.1 34.6L70.1 27.6Q69.8 27.0 69.4 26.0Q68.9 24.9 68.3 23.7Q67.8 22.5 67.2 21.2Q66.5 19.9 66.0 18.8Q65.5 17.6 65.1 16.8Q64.6 15.9 64.4 15.5L64.4 15.5Q64.3 15.2 64.3 14.9L64.3 14.9Q64.3 14.7 64.4 14.6Q64.4 14.4 64.6 14.3","m"],["M18.4 62.3L18.4 62.3Q18.4 61.8 18.5 61.7Q18.6 61.5 18.8 61.4L18.8 61.4L23.1 60.4Q23.3 60.4 23.5 60.4L23.5 60.4Q23.7 60.4 23.7 60.5Q23.8 60.6 23.8 60.9L23.8 60.9L23.6 62.9Q23.6 63.7 23.5 64.6Q23.4 65.5 23.3 66.1L23.3 66.1L23.0 67.9Q22.9 68.7 22.9 69.6Q22.8 70.5 22.7 71.7L22.7 71.7L22.1 77.9Q22.1 78.0 22.0 78.1Q22.0 78.2 21.9 78.3L21.9 78.3Q21.8 78.3 21.4 78.4Q21.1 78.6 20.7 78.7Q20.2 78.9 19.7 79.1Q19.2 79.3 18.8 79.4Q18.3 79.6 18.0 79.7Q17.6 79.8 17.5 79.8L17.5 79.8Q17.3 79.8 17.2 79.7Q17.1 79.6 17.1 79.3L17.1 79.3Q17.1 77.8 17.2 76.2Q17.4 74.6 17.6 73.0L17.6 73.0Q17.6 72.8 17.6 72.7Q17.6 72.5 17.6 72.4L17.6 72.4L13.0 72.4L12.5 77.9Q12.4 78.0 12.4 78.1Q12.4 78.2 12.2 78.3L12.2 78.3Q12.2 78.3 11.8 78.5Q11.3 78.6 10.7 78.8Q10.1 79.0 9.6 79.2Q9.0 79.4 8.7 79.6L8.7 79.6Q8.5 79.6 8.3 79.7Q8.1 79.8 7.9 79.8L7.9 79.8Q7.7 79.8 7.6 79.7Q7.4 79.6 7.4 79.3L7.4 79.3Q7.4 78.7 7.5 77.9Q7.5 77.1 7.6 76.3Q7.7 75.4 7.7 74.5Q7.8 73.7 7.9 72.8L7.9 72.8L7.9 72.4Q6.9 72.4 6.5 72.4Q6.0 72.3 6.0 72.1L6.0 72.1Q6.0 71.9 6.2 71.6L6.2 71.6Q6.4 71.3 6.8 70.8Q7.1 70.3 7.4 69.8Q7.7 69.3 8.0 68.9Q8.2 68.6 8.3 68.4L8.3 68.4L8.6 65.4Q8.6 65.4 8.6 65.0Q8.6 64.7 8.7 64.2Q8.7 63.7 8.8 63.2Q8.8 62.7 8.8 62.3L8.8 62.3Q8.9 61.9 8.9 61.7Q8.9 61.5 9.2 61.4L9.2 61.4L13.5 60.4Q13.6 60.4 13.8 60.4L13.8 60.4Q14.0 60.4 14.1 60.5Q14.1 60.6 14.1 60.9L14.1 60.9Q14.0 61.8 14.0 62.5Q13.9 63.3 13.9 63.9Q13.8 64.6 13.8 65.2Q13.7 65.7 13.6 66.3L13.6 66.3L13.3 68.3L17.9 68.2Q18.0 66.6 18.2 65.4Q18.3 64.2 18.3 63.5L18.3 63.5Q18.4 62.9 18.4 62.6Q18.4 62.3 18.4 62.3M24.6 78.0L24.6 78.0Q24.8 77.6 24.9 77.2Q25.1 76.8 25.3 76.3L25.3 76.3L25.6 75.5Q25.4 75.2 25.1 74.8Q24.9 74.4 24.7 74.0Q24.5 73.6 24.4 73.1Q24.3 72.7 24.3 72.3L24.3 72.3Q24.3 72.3 24.5 72.3Q24.7 72.3 25.0 72.3Q25.3 72.2 25.6 72.2Q26.0 72.2 26.3 72.2Q26.6 72.2 26.8 72.2Q26.9 72.2 26.9 72.2L26.9 72.2Q27.2 71.4 27.5 70.8Q27.8 70.1 28.1 69.4Q28.3 68.7 28.6 68.0Q28.9 67.3 29.2 66.4L29.2 66.4Q29.7 64.9 30.2 63.7Q30.7 62.5 31.2 61.5L31.2 61.5Q31.2 61.3 31.3 61.2Q31.4 61.1 31.6 61.1Q31.7 61.0 31.9 60.9Q32.0 60.9 32.1 60.9L32.1 60.9Q32.1 60.8 32.4 60.7Q32.8 60.6 33.2 60.5Q33.6 60.4 34.1 60.3Q34.5 60.2 34.7 60.2L34.7 60.2L35.0 60.2Q35.2 60.2 35.3 60.3Q35.5 60.4 35.6 60.7L35.6 60.7Q36.2 62.3 36.9 64.1Q37.6 65.9 38.2 68.1L38.2 68.1Q38.6 69.3 38.9 70.4Q39.3 71.4 39.6 72.4Q39.9 73.4 40.3 74.4Q40.6 75.5 41.0 76.5L41.0 76.5Q41.1 77.0 41.2 77.2Q41.3 77.5 41.4 77.7Q41.5 77.8 41.6 77.9Q41.7 77.9 41.7 78.0L41.7 78.0Q41.7 78.1 41.4 78.2L41.4 78.2L38.7 79.1Q38.4 79.2 38.1 79.3Q37.8 79.4 37.5 79.5Q37.2 79.6 37.0 79.6Q36.8 79.7 36.7 79.7L36.7 79.7L36.7 79.7Q36.5 79.7 36.4 79.6Q36.3 79.5 36.3 79.4L36.3 79.4Q36.2 79.0 36.1 78.6Q35.9 78.3 35.8 78.0Q35.7 77.6 35.6 77.2Q35.5 76.9 35.3 76.3L35.3 76.3Q35.3 76.3 35.2 76.2Q35.1 76.2 34.9 76.2Q34.8 76.1 34.6 76.1Q34.4 76.1 34.3 76.1L34.3 76.1Q33.8 76.1 33.5 76.1Q33.2 76.1 33.0 76.2Q32.7 76.2 32.5 76.2Q32.3 76.2 32.0 76.2L32.0 76.2Q31.7 76.2 31.3 76.2Q30.9 76.2 30.6 76.1L30.6 76.1L29.9 76.1Q29.5 77.0 29.2 77.8Q28.9 78.6 28.5 79.5L28.5 79.5Q28.5 79.6 28.4 79.6Q28.3 79.7 28.2 79.7L28.2 79.7Q28.1 79.7 28.1 79.7L28.1 79.7Q26.9 79.2 26.0 78.8Q25.2 78.4 24.6 78.0M33.1 66.6L33.1 66.6Q32.8 67.8 32.5 68.7Q32.2 69.6 31.9 70.3Q31.7 71.0 31.5 71.5Q31.3 72.0 31.3 72.2L31.3 72.2L31.3 72.4Q31.3 72.4 31.3 72.5L31.3 72.5L34.3 72.5Q34.1 71.8 34.0 71.2Q33.8 70.6 33.7 69.9Q33.5 69.2 33.4 68.4Q33.2 67.6 33.1 66.6M56.9 69.9L59.4 61.8Q59.5 61.6 59.5 61.4Q59.6 61.3 59.9 61.2L59.9 61.2L63.6 60.4Q63.6 60.4 63.7 60.4Q63.7 60.3 63.7 60.3L63.7 60.3Q63.9 60.3 64.0 60.5Q64.0 60.6 64.0 60.8L64.0 60.8Q64.0 60.8 64.0 60.9Q64.0 61.0 64.0 61.0L64.0 61.0L58.8 76.8Q58.6 77.3 58.5 77.7Q58.3 78.0 58.2 78.2Q58.1 78.4 57.9 78.5Q57.7 78.7 57.4 78.8Q57.2 79.0 56.7 79.1Q56.3 79.3 55.6 79.6L55.6 79.6Q55.4 79.7 55.3 79.7L55.3 79.7Q55.1 79.7 55.0 79.6Q54.9 79.4 54.8 79.3L54.8 79.3L52.7 71.6L50.0 77.1Q49.9 77.3 49.7 77.5Q49.5 77.8 49.2 78.1Q48.9 78.3 48.6 78.6Q48.3 78.8 48.1 79.0L48.1 79.0Q48.0 79.1 47.8 79.2Q47.6 79.4 47.4 79.5Q47.2 79.6 47.1 79.7Q46.9 79.7 46.8 79.7L46.8 79.7Q46.4 79.7 46.3 79.4L46.3 79.4L41.4 62.2Q41.4 62.1 41.4 62.0Q41.3 61.8 41.3 61.8L41.3 61.8Q41.3 61.4 41.5 61.2Q41.6 61.0 42.0 60.9Q42.4 60.7 43.0 60.6Q43.7 60.5 44.6 60.5L44.6 60.5Q45.1 60.4 45.4 60.4Q45.7 60.4 45.9 60.4L45.9 60.4Q46.3 60.4 46.4 60.5Q46.5 60.6 46.6 60.8L46.6 60.8L49.2 70.8L51.3 67.1L50.5 63.3Q50.4 63.0 50.4 62.9L50.4 62.9Q50.4 62.6 50.6 62.4Q50.7 62.2 51.1 62.1Q51.4 62.0 52.0 61.9Q52.6 61.8 53.4 61.7L53.4 61.7Q53.8 61.7 54.0 61.6Q54.3 61.6 54.5 61.6L54.5 61.6Q54.9 61.6 55.0 61.7Q55.1 61.8 55.2 62.1L55.2 62.1L56.9 69.9M71.1 60.9L71.1 60.9Q71.1 61.1 71.0 61.5Q71.0 61.9 71.0 62.4Q70.9 62.9 70.9 63.5Q70.9 64.1 70.8 64.7Q70.8 65.3 70.7 65.7Q70.7 66.2 70.7 66.5L70.7 66.5L71.3 65.8L73.1 63.6Q73.4 63.2 73.7 62.8Q74.1 62.4 74.3 62.1Q74.6 61.7 74.8 61.5Q74.9 61.3 74.9 61.3L74.9 61.3L80.5 60.8Q80.6 60.8 80.6 60.8L80.6 60.8L80.7 60.8Q81.0 60.8 81.0 61.0L81.0 61.0Q81.0 61.0 81.0 61.2Q80.9 61.3 80.7 61.5L80.7 61.5Q80.5 61.7 80.1 62.2Q79.7 62.6 79.3 63.1Q78.8 63.7 78.3 64.2Q77.9 64.8 77.4 65.3Q77.0 65.8 76.7 66.1Q76.4 66.5 76.4 66.6L76.4 66.6L75.6 67.4Q74.8 68.1 73.5 69.3L73.5 69.3Q73.9 69.7 74.3 70.1Q74.8 70.6 75.2 71.1Q75.6 71.5 75.9 71.8Q76.3 72.2 76.4 72.4L76.4 72.4L80.3 76.9Q80.4 77.0 80.5 77.0Q80.6 77.1 80.7 77.1Q80.8 77.1 80.9 77.2Q80.9 77.2 80.9 77.3L80.9 77.3Q80.9 77.4 80.8 77.5L80.8 77.5Q80.7 77.6 80.4 77.8Q80.1 78.0 79.7 78.2Q79.4 78.5 78.9 78.7Q78.5 78.9 78.1 79.1Q77.7 79.3 77.4 79.5Q77.1 79.6 76.9 79.6L76.9 79.6Q76.6 79.6 76.3 79.4Q76.0 79.1 75.6 78.6Q75.2 78.2 74.7 77.4Q74.1 76.7 73.3 75.7L73.3 75.7Q72.9 75.2 72.5 74.6Q72.0 74.1 71.7 73.6Q71.3 73.1 71.0 72.7Q70.7 72.3 70.5 72.1L70.5 72.1Q70.4 72.2 70.2 72.3Q70.1 72.4 70.0 72.5L70.0 72.5L69.6 77.9Q69.6 78.0 69.5 78.1Q69.5 78.2 69.4 78.3L69.4 78.3L65.8 79.6Q65.7 79.6 65.4 79.7Q65.2 79.8 65.0 79.8L65.0 79.8Q64.8 79.8 64.7 79.7Q64.6 79.6 64.6 79.3L64.6 79.3Q64.6 78.6 64.7 77.4Q64.8 76.2 64.9 74.7Q65.0 73.1 65.1 71.4Q65.3 69.6 65.4 67.6L65.4 67.6L65.8 62.3Q65.8 62.1 65.8 61.9Q65.8 61.7 65.8 61.6Q65.8 61.5 65.9 61.5Q66.0 61.4 66.1 61.4L66.1 61.4L70.5 60.4Q70.6 60.3 70.8 60.3L70.8 60.3Q71.0 60.3 71.0 60.4Q71.1 60.5 71.1 60.9M82.6 78.7L82.4 74.2Q82.4 74.2 82.4 74.2Q82.4 74.2 82.4 74.2L82.4 74.2Q82.4 73.9 82.6 73.9L82.6 73.9Q82.7 73.9 82.9 74.1L82.9 74.1Q83.5 74.7 84.4 75.1Q85.2 75.5 86.2 75.5L86.2 75.5Q86.4 75.5 86.8 75.4Q87.1 75.3 87.4 75.2Q87.7 75.1 87.9 74.9Q88.1 74.6 88.1 74.3L88.1 74.3Q88.1 74.0 88.0 73.7Q87.8 73.4 87.5 73.2L87.5 73.2Q87.4 73.1 87.2 72.9Q86.9 72.7 86.6 72.5Q86.4 72.3 86.0 72.0Q85.7 71.8 85.4 71.5Q85.2 71.3 84.9 71.1Q84.7 70.9 84.6 70.8L84.6 70.8Q83.8 70.3 83.4 69.7Q83.0 69.1 82.8 68.5Q82.5 67.9 82.5 67.2Q82.4 66.6 82.4 65.8L82.4 65.8Q82.4 64.7 82.9 63.7Q83.5 62.7 84.4 62.0Q85.4 61.3 86.7 60.8Q88.1 60.4 89.7 60.4L89.7 60.4Q89.9 60.4 90.3 60.4Q90.7 60.5 91.2 60.6Q91.7 60.7 92.2 60.9Q92.7 61.0 93.1 61.3L93.1 61.3Q93.3 61.4 93.4 61.5Q93.4 61.6 93.5 61.8L93.5 61.8Q93.5 62.9 93.6 63.8Q93.6 64.8 93.7 65.9L93.7 65.9Q93.7 66.2 93.6 66.2Q93.5 66.3 93.3 66.3L93.3 66.3Q93.2 66.3 93.1 66.2L93.1 66.2Q92.8 65.9 92.4 65.5Q92.0 65.2 91.6 64.9Q91.1 64.6 90.6 64.4Q90.2 64.3 89.6 64.3L89.6 64.3Q89.3 64.3 88.9 64.3Q88.6 64.4 88.3 64.5Q88.0 64.7 87.8 65.0Q87.7 65.2 87.7 65.6L87.7 65.6Q87.7 66.1 87.8 66.4Q87.9 66.7 88.3 67.0L88.3 67.0L91.3 69.0Q92.2 69.6 92.7 70.2Q93.2 70.8 93.5 71.4Q93.8 71.9 93.9 72.5Q94.0 73.1 94.0 73.6L94.0 73.6Q94.0 74.5 93.7 75.3Q93.4 76.0 92.9 76.7Q92.4 77.4 91.7 77.9Q91.1 78.4 90.3 78.8Q89.5 79.2 88.7 79.4Q87.9 79.5 87.1 79.5L87.1 79.5Q86.5 79.5 85.9 79.5Q85.3 79.5 84.7 79.4Q84.1 79.3 83.6 79.2Q83.1 79.0 82.6 78.7L82.6 78.7","a"]],"CLE":[["M14.8 42.9L13.8 46.2Q12.4 45.1 11.0 44.6L11.0 44.6Q10.9 45.8 10.9 47.5Q10.9 49.2 11.3 51.4L11.3 51.4L7.5 53.1Q8.4 54.1 10.0 54.6L10.0 54.6Q10.9 54.9 11.9 54.9Q12.9 54.9 14.0 54.7L14.0 54.7L11.9 59.1Q8.4 58.0 6.4 56.9Q4.3 55.9 3.3 54.4Q2.3 52.9 2.1 50.9L2.1 50.9Q2.0 49.6 2.0 48.2Q2.0 46.9 2.0 45.7L2.0 45.7L11.9 40.9L14.8 42.9M7.6 44.7L7.6 44.7Q5.6 45.7 5.6 48.2L5.6 48.2Q5.6 50.5 6.8 52.3L6.8 52.3Q7.5 51.8 7.7 50.3L7.7 50.3Q7.8 49.7 7.8 48.4Q7.8 47.2 7.6 44.7M16.9 46.3L19.4 48.1L20.9 46.5Q23.4 48.2 24.2 49.9L24.2 49.9L22.3 52.5Q22.0 51.5 21.4 50.8Q20.9 50.1 19.6 49.3L19.6 49.3L19.2 49.9L18.9 54.0Q18.9 54.6 19.7 55.3Q20.5 55.9 21.0 56.1L21.0 56.1L19.0 59.0L15.3 56.1Q16.0 55.2 16.0 54.4L16.0 54.4L16.0 49.8Q15.9 49.2 15.1 48.6L15.1 48.6L16.9 46.3M30.6 48.6L30.6 48.6L32.5 46.3L35.2 47.6Q35.0 48.1 34.9 48.6Q34.7 49.0 34.7 49.5L34.7 49.5L34.5 54.4Q34.5 54.4 34.5 54.5L34.5 54.5Q34.5 55.1 34.9 55.4Q35.2 55.8 35.7 56.0L35.7 56.0L33.3 59.0L30.7 56.7L27.5 59.0L25.0 56.9Q25.7 56.1 25.7 55.2L25.7 55.2L25.8 49.8Q25.8 49.2 24.9 48.6L24.9 48.6L26.7 46.3L29.4 47.6Q29.3 48.1 29.1 48.6Q28.9 49.0 28.9 49.5L28.9 49.5L28.8 54.4Q28.7 55.0 29.2 55.6L29.2 55.6Q29.3 55.8 29.6 55.8L29.6 55.8Q30.2 55.8 31.5 54.7L31.5 54.7L31.5 49.8Q31.5 49.2 30.6 48.6M36.5 56.7L36.5 56.7L38.6 54.5Q37.5 53.0 37.0 51.1L37.0 51.1Q38.4 48.7 41.3 46.3L41.3 46.3Q43.5 46.9 46.4 47.5L46.4 47.5L46.6 47.4L44.4 49.7L46.4 54.7Q44.1 56.4 42.2 59.0L42.2 59.0Q39.9 57.6 36.5 56.7M42.9 55.9L42.9 55.9Q44.1 55.9 44.1 55.0L44.1 55.0Q44.1 54.3 42.3 51.8L42.3 51.8L39.4 54.8Q41.3 55.9 42.9 55.9M41.0 52.1L41.0 52.1L43.3 49.7Q41.2 49.1 40.5 49.1Q39.8 49.1 39.7 49.2Q39.6 49.4 39.6 49.5L39.6 49.5Q39.6 50.2 41.0 52.1M47.4 50.2L47.4 50.2L52.1 46.4L57.4 48.9Q56.5 49.7 56.5 50.7L56.5 50.7L56.4 54.7Q56.4 55.1 56.9 55.6Q57.3 56.1 57.7 56.5L57.7 56.5L55.2 59.0L53.4 57.0Q52.7 57.6 52.0 58.0Q51.3 58.5 50.8 59.0L50.8 59.0Q49.0 58.3 47.4 56.9L47.4 56.9Q47.9 56.3 47.9 55.2L47.9 55.2L47.9 51.6Q47.9 51.6 47.9 51.5L47.9 51.5Q47.9 50.8 47.4 50.2M53.4 50.3L51.5 49.3Q50.8 50.3 50.8 51.1L50.8 51.1L50.8 54.1Q50.8 55.0 51.2 55.4L51.2 55.4Q51.5 55.8 51.7 56.1Q51.9 56.4 52.4 56.5L52.4 56.5L53.4 55.8L53.4 50.3M62.4 47.0L62.4 47.0Q61.4 45.4 59.9 43.7L59.9 43.7L63.1 42.0Q67.4 47.3 67.9 54.5L67.9 54.5Q66.4 55.6 65.4 56.6Q64.3 57.5 63.7 59.0L63.7 59.0Q62.3 58.4 61.0 57.8Q59.7 57.2 58.6 56.1L58.6 56.1Q58.6 54.3 58.5 52.5Q58.5 50.7 58.5 48.8L58.5 48.8Q61.4 47.5 62.4 47.0M64.8 55.9L64.8 55.9Q64.8 55.8 64.8 55.6L64.8 55.6Q64.8 51.6 62.9 47.9L62.9 47.9Q61.6 48.6 61.4 50.2L61.4 50.2Q61.3 50.8 61.3 51.8Q61.3 52.8 61.5 54.4L61.5 54.4Q63.2 55.7 64.8 55.9M74.5 59.0L74.5 59.0L68.7 56.7Q69.0 54.9 69.0 52.9Q69.0 50.9 68.7 48.8L68.7 48.8L72.8 46.4L72.8 46.3L72.8 46.3L72.8 46.3L77.5 49.7L72.6 54.8Q73.1 55.4 73.7 55.5Q74.3 55.5 74.7 55.5Q75.1 55.5 75.7 55.5Q76.2 55.5 77.0 55.4L77.0 55.4Q76.3 56.3 75.7 57.2Q75.1 58.1 74.5 59.0M72.5 49.6L72.5 49.6Q71.8 49.6 71.8 51.5L71.8 51.5Q71.8 52.6 72.1 53.6L72.1 53.6Q72.1 53.8 72.2 53.8L72.2 53.8L74.1 51.8Q74.3 51.6 74.3 51.3Q74.3 51.1 74.1 50.8Q73.9 50.5 73.7 50.2L73.7 50.2Q72.9 49.6 72.5 49.6M80.0 46.3L82.5 48.1L84.1 46.5Q86.5 48.2 87.4 49.9L87.4 49.9L85.4 52.5Q85.1 51.5 84.5 50.8Q84.0 50.1 82.7 49.3L82.7 49.3L82.3 49.9L82.1 54.0Q82.0 54.6 82.9 55.3Q83.7 55.9 84.1 56.1L84.1 56.1L82.1 59.0L78.4 56.1Q79.1 55.2 79.1 54.4L79.1 54.4L79.1 49.8Q79.1 49.2 78.2 48.6L78.2 48.6L80.0 46.3M87.8 56.7L87.8 56.7L89.9 54.5Q88.8 53.0 88.3 51.1L88.3 51.1Q89.8 48.7 92.6 46.3L92.6 46.3Q94.8 46.9 97.7 47.5L97.7 47.5L98.0 47.4L95.7 49.7L97.7 54.7Q95.5 56.4 93.6 59.0L93.6 59.0Q91.2 57.6 87.8 56.7M94.2 55.9L94.2 55.9Q95.4 55.9 95.4 55.0L95.4 55.0Q95.4 54.3 93.7 51.8L93.7 51.8L90.8 54.8Q92.7 55.9 94.2 55.9M92.3 52.1L92.3 52.1L94.6 49.7Q92.5 49.1 91.8 49.1Q91.1 49.1 91.0 49.2Q91.0 49.4 91.0 49.5L91.0 49.5Q91.0 50.2 92.3 52.1","m"]],"CAL":[["M23.0 63.0Q18.4 63.0 15.0 61.4Q11.6 59.7 9.8 56.6Q8.0 53.5 8.0 49.4L8.0 49.4Q8.0 43.7 10.1 39.3Q12.3 34.9 15.9 32.5Q19.6 30.1 24.1 30.1L24.1 30.1Q28.3 30.1 30.4 32.3Q32.6 34.4 32.6 37.9L32.6 37.9Q32.6 40.3 31.7 41.7Q30.9 43.1 29.4 43.1L29.4 43.1Q28.3 43.1 27.7 42.6Q27.1 42.1 27.1 41.2L27.1 41.2Q27.1 40.8 27.2 39.9L27.2 39.9Q27.4 38.7 27.4 38.0L27.4 38.0Q27.4 34.5 23.7 34.5L23.7 34.5Q21.2 34.5 18.8 36.2Q16.5 37.8 15.1 41.1Q13.7 44.3 13.7 48.7L13.7 48.7Q13.7 53.3 16.3 55.9Q18.8 58.4 23.9 58.4L23.9 58.4Q26.4 58.4 29.0 57.8Q31.5 57.1 34.7 55.8L34.7 55.8Q35.2 55.6 35.6 55.6L35.6 55.6Q36.2 55.6 36.6 56.0Q36.9 56.5 36.9 57.2L36.9 57.2Q36.9 59.6 34.3 60.7L34.3 60.7Q31.6 61.9 28.6 62.5Q25.7 63.0 23.0 63.0L23.0 63.0M38.6 63.0Q36.2 63.0 34.8 61.3Q33.4 59.6 33.4 56.7L33.4 56.7Q33.4 53.7 34.8 50.9Q36.2 48.1 38.6 46.5Q41.0 44.8 43.6 44.8L43.6 44.8Q44.5 44.8 44.8 45.1Q45.0 45.4 45.2 46.3L45.2 46.3Q46.0 46.1 46.9 46.1L46.9 46.1Q48.8 46.1 48.8 47.5L48.8 47.5Q48.8 48.3 48.2 51.3L48.2 51.3Q47.4 55.8 47.4 57.5L47.4 57.5Q47.4 58.1 47.6 58.4Q47.9 58.8 48.4 58.8L48.4 58.8Q49.1 58.8 50.2 57.8Q51.2 56.9 53.0 54.8L53.0 54.8Q53.5 54.2 54.0 54.2L54.0 54.2Q54.5 54.2 54.8 54.7Q55.1 55.2 55.1 56.0L55.1 56.0Q55.1 57.5 54.4 58.4L54.4 58.4Q52.8 60.3 51.0 61.7Q49.2 63.0 47.6 63.0L47.6 63.0Q46.3 63.0 45.3 62.2Q44.2 61.3 43.7 59.8L43.7 59.8Q41.6 63.0 38.6 63.0L38.6 63.0M40.0 59.1Q40.8 59.1 41.6 58.1Q42.4 57.1 42.7 55.5L42.7 55.5L44.2 48.4Q42.5 48.4 41.2 49.6Q39.8 50.8 39.0 52.7Q38.2 54.6 38.2 56.8L38.2 56.8Q38.2 58.0 38.7 58.6Q39.1 59.1 40.0 59.1L40.0 59.1M71.5 51.1Q71.6 51.1 71.9 51.1L71.9 51.1Q72.4 51.1 72.7 51.5Q73.1 51.8 73.1 52.5L73.1 52.5Q73.1 53.7 72.6 54.4Q72.1 55.0 71.2 55.4L71.2 55.4Q69.4 55.9 67.4 55.9L67.4 55.9Q65.7 55.9 64.2 55.5L64.2 55.5Q63.1 57.3 61.7 59.2L61.7 59.2Q60.2 61.4 59.1 62.2Q58.0 63.0 56.5 63.0L56.5 63.0Q55.0 63.0 54.1 61.8Q53.1 60.6 52.9 57.9L52.9 57.9Q52.5 52.5 52.5 48.4L52.5 48.4L52.5 47.1Q52.5 45.8 53.1 45.3Q53.8 44.8 55.1 44.8L55.1 44.8Q56.1 44.8 56.6 45.3Q57.1 45.7 57.1 46.7L57.1 46.7Q57.1 51.2 57.6 58.3L57.6 58.3Q59.9 54.9 61.1 52.8L61.1 52.8Q60.5 51.7 60.5 50.1L60.5 50.1Q60.5 48.8 61.1 47.6Q61.7 46.4 62.7 45.6Q63.7 44.8 65.0 44.8L65.0 44.8Q66.1 44.8 66.8 45.6Q67.5 46.4 67.5 47.9L67.5 47.9Q67.5 49.6 66.5 51.9L66.5 51.9Q68.0 51.8 70.4 51.3L70.4 51.3L71.5 51.1M79.6 63.9Q77.6 63.9 76.5 63.0Q75.4 62.0 75.4 60.9L75.4 60.9Q75.4 59.9 76.2 59.1Q76.9 58.4 78.3 58.4L78.3 58.4Q78.8 58.4 79.5 58.5Q80.2 58.6 80.5 58.6L80.5 58.6Q80.5 57.6 80.1 56.7Q79.7 55.9 79.1 55.0Q78.5 54.2 77.9 53.6L77.9 53.6Q76.7 55.9 75.5 57.4Q74.4 58.9 73.0 60.2L73.0 60.2Q72.3 60.9 71.5 60.9L71.5 60.9Q70.9 60.9 70.5 60.5Q70.1 60.0 70.1 59.4L70.1 59.4Q70.1 58.6 70.7 57.9L70.7 57.9L71.2 57.3Q73.3 54.7 74.4 53.0L74.4 53.0Q75.0 51.9 75.9 50.0Q76.8 48.1 77.6 46.1L77.6 46.1Q78.4 44.4 80.7 44.4L80.7 44.4Q81.8 44.4 82.2 44.6Q82.6 44.8 82.6 45.2L82.6 45.2Q82.6 45.5 82.5 46.0Q82.3 46.5 82.0 47.0L82.0 47.0Q81.4 48.4 81.4 49.3L81.4 49.3Q81.4 49.9 81.8 50.6Q82.2 51.3 83.0 52.3L83.0 52.3Q84.2 54.0 84.9 55.1Q85.5 56.2 85.5 57.6L85.5 57.6Q85.5 58.0 85.4 58.7L85.4 58.7Q87.3 57.9 89.9 54.8L89.9 54.8Q90.3 54.2 90.9 54.2L90.9 54.2Q91.4 54.2 91.7 54.7Q92.0 55.2 92.0 56.0L92.0 56.0Q92.0 57.4 91.3 58.4L91.3 58.4Q89.3 60.8 87.6 61.6Q85.8 62.5 83.2 62.6L83.2 62.6Q81.7 63.9 79.6 63.9L79.6 63.9","m"]],"STT":[["M16.9 58.3L16.9 58.3L9.7 58.3Q6.8 58.3 5.4 57.1Q4.0 56.0 4.0 53.6L4.0 53.6L4.0 46.4Q4.0 44.0 5.4 42.9Q6.8 41.7 9.7 41.7L9.7 41.7L15.4 41.7Q16.2 41.7 16.2 42.6L16.2 42.6L16.2 45.3Q16.2 46.2 15.4 46.2L15.4 46.2L10.6 46.2Q9.2 46.2 9.2 47.3L9.2 47.3L9.2 52.8Q9.2 53.9 10.3 53.9L10.3 53.9L12.5 53.9L12.5 50.3Q12.5 49.5 13.3 49.5L13.3 49.5L16.9 49.5Q17.7 49.5 17.7 50.3L17.7 50.3L17.7 57.4Q17.7 58.3 16.9 58.3M30.8 58.3L21.0 58.3Q20.2 58.3 20.2 57.4L20.2 57.4L20.2 54.7Q20.2 53.9 21.0 53.9L21.0 53.9L23.3 53.9L23.3 46.2L21.0 46.2Q20.2 46.2 20.2 45.3L20.2 45.3L20.2 42.6Q20.2 41.7 21.0 41.7L21.0 41.7L30.8 41.7Q31.6 41.7 31.6 42.6L31.6 42.6L31.6 45.3Q31.6 46.2 30.8 46.2L30.8 46.2L28.5 46.2L28.5 53.9L30.8 53.9Q31.6 53.9 31.6 54.7L31.6 54.7L31.6 57.4Q31.6 58.3 30.8 58.3L30.8 58.3M39.1 54.2L39.1 57.4Q39.1 58.3 38.3 58.3L38.3 58.3L34.9 58.3Q34.1 58.3 34.1 57.4L34.1 57.4L34.1 51.4Q34.1 50.7 34.3 49.8Q34.5 48.9 35.0 47.7L35.0 47.7L37.0 42.5Q37.2 41.7 38.1 41.7L38.1 41.7L44.3 41.7Q45.2 41.7 45.5 42.5L45.5 42.5L47.5 47.7Q47.9 48.9 48.2 49.8Q48.4 50.7 48.4 51.4L48.4 51.4L48.4 57.4Q48.4 58.3 47.5 58.3L47.5 58.3L44.1 58.3Q43.2 58.3 43.2 57.4L43.2 57.4L43.2 54.2L39.1 54.2M40.4 46.6L40.4 46.6L39.3 50.0L42.9 50.0L41.9 46.6Q41.7 46.2 41.4 46.2L41.4 46.2L40.9 46.2Q40.6 46.2 40.4 46.6M55.5 58.3L55.5 58.3L52.0 58.3Q51.2 58.3 51.2 57.4L51.2 57.4L51.2 42.6Q51.2 41.7 52.0 41.7L52.0 41.7L54.4 41.7Q55.2 41.7 55.8 42.3L55.8 42.3L60.2 47.4L60.2 42.6Q60.2 41.7 61.1 41.7L61.1 41.7L64.5 41.7Q65.3 41.7 65.3 42.6L65.3 42.6L65.3 57.4Q65.3 58.3 64.5 58.3L64.5 58.3L61.1 58.3Q60.2 58.3 60.2 57.4L60.2 57.4L60.2 54.6L56.3 49.9L56.3 57.4Q56.3 58.3 55.5 58.3M76.3 58.3L76.3 58.3L72.6 58.3Q71.8 58.3 71.8 57.4L71.8 57.4L71.8 46.2L68.4 46.2Q67.6 46.2 67.6 45.3L67.6 45.3L67.6 42.6Q67.6 41.7 68.4 41.7L68.4 41.7L80.5 41.7Q81.3 41.7 81.3 42.6L81.3 42.6L81.3 45.3Q81.3 46.2 80.5 46.2L80.5 46.2L77.1 46.2L77.1 57.4Q77.1 58.3 76.3 58.3M91.2 58.3L91.2 58.3L84.0 58.3Q83.2 58.3 83.2 57.4L83.2 57.4L83.2 54.8Q83.2 53.9 84.0 53.9L84.0 53.9L90.2 53.9Q90.5 53.9 90.6 53.7Q90.8 53.5 90.8 53.3L90.8 53.3Q90.8 52.9 90.6 52.7Q90.5 52.5 90.2 52.5L90.2 52.5L86.7 52.0Q85.1 51.7 84.1 50.9Q83.2 50.1 83.2 48.2L83.2 48.2L83.2 45.8Q83.2 43.8 84.4 42.8Q85.7 41.7 87.9 41.7L87.9 41.7L94.3 41.7Q95.2 41.7 95.2 42.6L95.2 42.6L95.2 45.3Q95.2 46.1 94.3 46.1L94.3 46.1L89.0 46.1Q88.4 46.1 88.4 46.8L88.4 46.8Q88.4 47.5 89.0 47.5L89.0 47.5L92.4 48.0Q93.5 48.2 94.3 48.6Q95.1 49.0 95.6 49.7Q96.0 50.5 96.0 51.8L96.0 51.8L96.0 54.2Q96.0 56.2 94.7 57.2Q93.5 58.3 91.2 58.3","m"]],"LHI":[["M19.8 45.6L19.8 45.6Q19.4 47.1 18.2 48.5Q17.0 49.8 14.8 50.5L14.8 50.5L15.9 58.5L9.9 58.5L9.4 51.1L9.1 51.1L5.7 58.5L-0.1 58.5L7.7 41.5L14.8 41.5Q16.0 41.5 17.1 41.7Q18.1 41.8 18.8 42.3Q19.5 42.7 19.8 43.5Q20.1 44.3 19.8 45.6M9.9 49.4L11.1 49.4Q11.8 49.4 12.4 48.9Q13.0 48.5 13.5 47.8Q14.0 47.1 14.3 46.4Q14.6 45.6 14.8 45.0L14.8 45.0Q15.0 44.3 14.8 43.8Q14.7 43.3 13.9 43.3L13.9 43.3L12.7 43.3L9.9 49.4M34.1 41.5L31.7 58.5L25.4 58.5L26.1 54.3L21.1 54.3L18.2 58.5L15.6 58.5L27.7 41.5L34.1 41.5M27.6 45.0L22.5 52.3L26.4 52.3L27.6 45.0M50.1 52.0L47.8 57.1Q47.1 57.4 46.3 57.7Q45.5 58.0 44.6 58.3Q43.8 58.5 42.8 58.6Q41.8 58.7 40.7 58.7L40.7 58.7Q37.1 58.7 35.5 57.1Q34.0 55.5 34.9 51.8L34.9 51.8Q35.5 49.6 36.6 47.7Q37.8 45.8 39.4 44.3Q41.1 42.9 43.2 42.1Q45.4 41.3 47.9 41.3L47.9 41.3Q49.1 41.3 50.0 41.4Q50.9 41.6 51.7 41.8Q52.4 42.1 52.9 42.4Q53.5 42.7 53.9 42.9L53.9 42.9L51.7 47.9L46.9 47.9Q47.0 47.7 47.1 47.2Q47.3 46.8 47.4 46.4Q47.6 45.9 47.7 45.5Q47.8 45.1 47.9 44.8L47.9 44.8Q48.0 44.5 48.0 44.3Q48.0 44.0 48.0 43.7Q48.0 43.5 47.8 43.3Q47.6 43.1 47.2 43.1L47.2 43.1Q46.5 43.1 45.8 43.7Q45.1 44.3 44.4 45.2Q43.7 46.2 43.1 47.4Q42.4 48.6 41.9 49.8Q41.3 51.1 40.9 52.3Q40.5 53.5 40.3 54.4L40.3 54.4Q40.2 54.6 40.1 55.0Q40.0 55.5 40.1 55.8Q40.1 56.2 40.3 56.5Q40.5 56.7 41.0 56.7L41.0 56.7Q41.9 56.7 42.9 55.7Q43.9 54.7 45.2 52.0L45.2 52.0L50.1 52.0M49.4 58.5L57.3 41.5L68.6 41.5L67.7 43.6L62.2 43.6L59.8 48.7L64.4 48.7L63.4 50.7L58.8 50.7L56.2 56.5L61.6 56.5L60.7 58.5L49.4 58.5M82.8 45.6L82.8 45.6Q82.5 47.1 81.2 48.5Q80.0 49.8 77.8 50.5L77.8 50.5L78.9 58.5L72.9 58.5L72.4 51.1L72.1 51.1L68.7 58.5L62.9 58.5L70.8 41.5L77.8 41.5Q79.1 41.5 80.1 41.7Q81.2 41.8 81.9 42.3Q82.6 42.7 82.9 43.5Q83.2 44.3 82.8 45.6M72.9 49.4L74.2 49.4Q74.9 49.4 75.5 48.9Q76.1 48.5 76.6 47.8Q77.1 47.1 77.4 46.4Q77.7 45.6 77.8 45.0L77.8 45.0Q78.0 44.3 77.9 43.8Q77.8 43.3 77.0 43.3L77.0 43.3L75.8 43.3L72.9 49.4M97.9 46.5L93.4 46.5Q93.6 46.0 93.8 45.4L93.8 45.4Q93.9 45.0 93.9 44.6Q94.0 44.2 93.9 43.9Q93.9 43.6 93.7 43.4Q93.4 43.2 93.0 43.2L93.0 43.2Q92.5 43.2 92.1 43.4Q91.6 43.6 91.2 44.0Q90.8 44.3 90.5 44.8Q90.3 45.2 90.1 45.7L90.1 45.7Q90.0 46.4 90.2 46.7Q90.5 47.1 91.0 47.4Q91.6 47.6 92.3 47.8Q93.0 47.9 93.7 48.1L93.7 48.1Q94.3 48.3 94.9 48.6Q95.5 48.9 95.9 49.4Q96.3 49.9 96.5 50.7Q96.6 51.5 96.3 52.7L96.3 52.7Q95.9 54.4 94.9 55.5Q94.0 56.7 92.6 57.4Q91.2 58.1 89.5 58.4Q87.8 58.7 85.9 58.7L85.9 58.7Q84.0 58.7 82.8 58.5Q81.7 58.2 81.1 57.9L81.1 57.9Q80.3 57.6 80.0 57.1L80.0 57.1L81.9 53.5L86.6 53.5Q86.5 53.7 86.4 54.1Q86.2 54.5 86.2 54.8L86.2 54.8Q86.1 55.1 86.1 55.5Q86.1 55.8 86.2 56.1Q86.3 56.4 86.6 56.6Q86.8 56.8 87.3 56.8L87.3 56.8Q87.8 56.8 88.3 56.5Q88.8 56.3 89.2 55.9Q89.5 55.6 89.8 55.1Q90.1 54.7 90.2 54.2L90.2 54.2Q90.3 53.7 90.1 53.3Q89.9 52.9 89.5 52.6Q89.1 52.3 88.5 52.1Q88.0 51.9 87.3 51.7L87.3 51.7Q86.8 51.5 86.1 51.2Q85.5 51.0 85.0 50.5Q84.5 50.0 84.3 49.3Q84.1 48.5 84.4 47.4L84.4 47.4Q84.8 45.6 86.0 44.5Q87.2 43.3 88.7 42.6Q90.2 41.9 91.8 41.6Q93.5 41.3 94.9 41.3L94.9 41.3Q96.8 41.3 98.0 41.7Q99.3 42.1 99.8 42.7L99.8 42.7L97.9 46.5","m"],["M4 74 H70 M10 80 H58","u"]],"WGT":[["M24.1 43.3Q24.1 45.5 23.0 47.4Q21.8 49.2 19.7 50.4Q17.5 51.5 14.5 51.7L14.5 51.7L13.4 58.0Q12.7 61.6 9.9 61.6L9.9 61.6Q8.3 61.6 6.9 60.6Q5.6 59.7 4.8 57.8Q4.0 55.9 4.0 53.1L4.0 53.1Q4.0 47.8 5.7 44.2Q7.4 40.5 10.3 38.7Q13.1 36.9 16.6 36.9L16.6 36.9Q19.0 36.9 20.7 37.7Q22.4 38.6 23.2 40.0Q24.1 41.5 24.1 43.3L24.1 43.3M14.9 49.1Q20.3 48.4 20.3 43.6L20.3 43.6Q20.3 41.9 19.1 40.8Q18.0 39.7 15.6 39.7L15.6 39.7Q13.0 39.7 11.0 41.4Q9.0 43.1 7.9 46.1Q6.9 49.0 6.9 52.9L6.9 52.9Q6.9 54.5 7.2 55.7Q7.5 57.0 8.0 57.7Q8.5 58.3 9.0 58.3L9.0 58.3Q9.6 58.3 10.0 56.6L10.0 56.6L10.8 51.7Q9.8 51.5 10.0 51.5L10.0 51.5Q9.2 51.4 8.9 51.1Q8.7 50.7 8.7 50.2L8.7 50.2Q8.7 49.6 9.0 49.3Q9.4 48.9 9.9 48.9L9.9 48.9Q10.2 48.9 10.3 48.9L10.3 48.9Q10.9 49.0 11.3 49.1L11.3 49.1Q11.6 47.1 12.2 43.7L12.2 43.7Q12.4 42.8 12.9 42.4Q13.5 42.0 14.3 42.0L14.3 42.0Q15.1 42.0 15.5 42.4Q15.9 42.7 15.9 43.4L15.9 43.4Q15.9 43.8 15.8 44.1L15.8 44.1L14.9 49.1M35.1 53.0Q35.5 53.0 35.7 53.3Q35.9 53.6 35.9 54.1L35.9 54.1Q35.9 55.2 35.4 55.8L35.4 55.8Q34.4 56.9 32.7 57.9Q30.9 58.9 28.9 58.9L28.9 58.9Q26.2 58.9 24.7 57.4Q23.2 55.9 23.2 53.4L23.2 53.4Q23.2 51.6 24.0 50.0Q24.7 48.5 26.0 47.6Q27.4 46.7 29.1 46.7L29.1 46.7Q30.6 46.7 31.5 47.6Q32.4 48.5 32.4 50.0L32.4 50.0Q32.4 51.8 31.1 53.1Q29.8 54.4 26.8 55.1L26.8 55.1Q27.4 56.3 29.2 56.3L29.2 56.3Q30.4 56.3 31.9 55.5Q33.4 54.7 34.4 53.3L34.4 53.3Q34.8 53.0 35.1 53.0L35.1 53.0M28.6 49.2Q27.7 49.2 27.0 50.3Q26.3 51.5 26.3 53.0L26.3 53.0L26.3 53.1Q27.9 52.7 28.7 52.0Q29.6 51.3 29.6 50.3L29.6 50.3Q29.6 49.8 29.4 49.5Q29.1 49.2 28.6 49.2L28.6 49.2M43.6 53.0Q43.9 53.0 44.1 53.3Q44.3 53.6 44.3 54.1L44.3 54.1Q44.3 55.2 43.8 55.8L43.8 55.8Q42.7 57.1 41.4 58.0Q40.1 58.9 38.4 58.9L38.4 58.9Q36.2 58.9 35.1 56.8Q34.0 54.7 34.0 51.5L34.0 51.5Q34.0 48.3 34.8 44.3Q35.6 40.2 37.2 37.3Q38.8 34.4 41.0 34.4L41.0 34.4Q42.2 34.4 42.9 35.6Q43.6 36.7 43.6 38.9L43.6 38.9Q43.6 42.0 41.9 46.0Q40.2 50.1 37.3 54.1L37.3 54.1Q37.5 55.1 37.9 55.6Q38.3 56.0 39.0 56.0L39.0 56.0Q40.0 56.0 40.8 55.4Q41.6 54.8 42.9 53.3L42.9 53.3Q43.2 53.0 43.6 53.0L43.6 53.0M40.4 37.0Q39.8 37.0 39.1 39.1Q38.3 41.3 37.7 44.5Q37.2 47.7 37.1 50.6L37.1 50.6Q38.9 47.5 40.0 44.5Q41.1 41.5 41.1 39.0L41.1 39.0Q41.1 37.0 40.4 37.0L40.4 37.0M45.6 45.0Q44.5 45.0 44.0 44.5Q43.4 44.0 43.4 43.1L43.4 43.1Q43.4 42.2 44.1 41.6Q44.8 40.9 45.9 40.9L45.9 40.9Q46.9 40.9 47.5 41.4Q48.1 41.9 48.1 42.7L48.1 42.7Q48.1 43.8 47.4 44.4Q46.7 45.0 45.6 45.0L45.6 45.0M45.4 58.9Q43.7 58.9 42.9 57.7Q42.2 56.5 42.2 54.5L42.2 54.5Q42.2 53.4 42.5 51.5Q42.8 49.7 43.2 48.1L43.2 48.1Q43.5 47.3 43.9 47.0Q44.3 46.7 45.1 46.7L45.1 46.7Q46.4 46.7 46.4 47.6L46.4 47.6Q46.4 48.2 45.9 50.6L45.9 50.6Q45.3 53.4 45.3 54.4L45.3 54.4Q45.3 55.2 45.5 55.6Q45.7 56.0 46.2 56.0L46.2 56.0Q46.7 56.0 47.4 55.4Q48.1 54.7 49.2 53.3L49.2 53.3Q49.6 53.0 49.9 53.0L49.9 53.0Q50.3 53.0 50.5 53.3Q50.7 53.6 50.7 54.1L50.7 54.1Q50.7 55.2 50.2 55.8L50.2 55.8Q47.6 58.9 45.4 58.9L45.4 58.9M53.5 58.9Q51.0 58.9 49.6 57.4Q48.2 56.0 48.2 53.7L48.2 53.7Q48.2 51.6 49.0 50.0Q49.8 48.4 51.1 47.5Q52.5 46.7 53.9 46.7L53.9 46.7Q55.3 46.7 56.1 47.5Q56.9 48.4 56.9 49.7L56.9 49.7Q56.9 50.8 56.4 51.5Q56.0 52.3 55.2 52.3L55.2 52.3Q54.7 52.3 54.4 52.1Q54.1 51.8 54.1 51.4L54.1 51.4Q54.1 51.2 54.1 51.0Q54.2 50.8 54.2 50.7L54.2 50.7Q54.3 50.3 54.3 49.9L54.3 49.9Q54.3 49.6 54.2 49.4Q54.0 49.2 53.7 49.2L53.7 49.2Q53.1 49.2 52.6 49.8Q52.1 50.3 51.8 51.2Q51.4 52.1 51.4 53.2L51.4 53.2Q51.4 56.2 54.1 56.2L54.1 56.2Q55.1 56.2 56.4 55.5Q57.6 54.8 58.8 53.3L58.8 53.3Q59.1 53.0 59.5 53.0L59.5 53.0Q59.8 53.0 60.0 53.3Q60.2 53.6 60.2 54.1L60.2 54.1Q60.2 55.1 59.7 55.8L59.7 55.8Q58.5 57.3 56.8 58.1Q55.1 58.9 53.5 58.9L53.5 58.9M61.0 58.9Q59.4 58.9 58.5 57.7Q57.5 56.6 57.5 54.7L57.5 54.7Q57.5 52.6 58.5 50.7Q59.4 48.9 61.0 47.8Q62.6 46.6 64.4 46.6L64.4 46.6Q65.0 46.6 65.2 46.9Q65.4 47.1 65.5 47.7L65.5 47.7Q66.0 47.5 66.6 47.5L66.6 47.5Q67.9 47.5 67.9 48.5L67.9 48.5Q67.9 49.0 67.5 51.0L67.5 51.0Q66.9 54.0 66.9 55.2L66.9 55.2Q66.9 55.6 67.1 55.8Q67.3 56.0 67.6 56.0L67.6 56.0Q68.1 56.0 68.8 55.4Q69.5 54.8 70.7 53.3L70.7 53.3Q71.0 53.0 71.4 53.0L71.4 53.0Q71.7 53.0 71.9 53.3Q72.1 53.6 72.1 54.1L72.1 54.1Q72.1 55.2 71.6 55.8L71.6 55.8Q70.6 57.1 69.4 58.0Q68.2 58.9 67.1 58.9L67.1 58.9Q66.2 58.9 65.5 58.3Q64.8 57.7 64.4 56.7L64.4 56.7Q63.1 58.9 61.0 58.9L61.0 58.9M62.0 56.3Q62.5 56.3 63.0 55.6Q63.6 54.9 63.8 53.8L63.8 53.8L64.8 49.0Q63.7 49.1 62.7 49.9Q61.8 50.7 61.3 51.9Q60.7 53.2 60.7 54.7L60.7 54.7Q60.7 55.5 61.1 55.9Q61.4 56.3 62.0 56.3L62.0 56.3M71.8 58.9Q70.9 58.9 70.5 57.8Q70.1 56.8 70.1 54.5L70.1 54.5Q70.1 51.2 71.0 48.1L71.0 48.1Q71.3 47.4 71.8 47.0Q72.3 46.7 73.3 46.7L73.3 46.7Q73.8 46.7 74.0 46.8Q74.2 47.0 74.2 47.3L74.2 47.3Q74.2 47.7 73.8 49.2L73.8 49.2Q73.6 50.2 73.4 51.0Q73.2 51.8 73.1 52.9L73.1 52.9Q74.0 50.7 75.1 49.3Q76.1 47.9 77.1 47.3Q78.2 46.7 79.0 46.7L79.0 46.7Q80.7 46.7 80.7 48.4L80.7 48.4Q80.7 49.4 80.1 52.0L80.1 52.0Q79.6 54.3 79.6 55.0L79.6 55.0Q79.6 56.0 80.4 56.0L80.4 56.0Q80.9 56.0 81.6 55.4Q82.3 54.8 83.5 53.3L83.5 53.3Q83.8 53.0 84.2 53.0L84.2 53.0Q84.6 53.0 84.8 53.3Q84.9 53.6 84.9 54.1L84.9 54.1Q84.9 55.2 84.5 55.8L84.5 55.8Q83.3 57.1 82.1 58.0Q80.8 58.9 79.1 58.9L79.1 58.9Q77.8 58.9 77.2 58.1Q76.5 57.4 76.5 55.9L76.5 55.9Q76.5 55.2 76.8 53.3L76.8 53.3Q77.2 51.7 77.2 51.1L77.2 51.1Q77.2 50.7 76.9 50.7L76.9 50.7Q76.6 50.7 76.0 51.5Q75.3 52.4 74.7 53.8Q74.1 55.2 73.7 56.8L73.7 56.8Q73.4 58.0 73.0 58.5Q72.7 58.9 71.8 58.9L71.8 58.9M87.7 59.5Q86.3 59.5 85.6 58.8Q84.9 58.2 84.9 57.4L84.9 57.4Q84.9 56.8 85.4 56.3Q85.9 55.8 86.8 55.8L86.8 55.8Q87.2 55.8 87.6 55.8Q88.1 55.9 88.3 55.9L88.3 55.9Q88.3 55.3 88.0 54.7Q87.7 54.1 87.3 53.5Q86.9 53.0 86.6 52.5L86.6 52.5Q85.7 54.1 85.0 55.1Q84.2 56.1 83.2 57.0L83.2 57.0Q82.8 57.5 82.3 57.5L82.3 57.5Q81.8 57.5 81.6 57.2Q81.3 56.9 81.3 56.4L81.3 56.4Q81.3 55.9 81.7 55.5L81.7 55.5L82.0 55.1Q83.4 53.3 84.2 52.2L84.2 52.2Q84.6 51.4 85.2 50.1Q85.8 48.9 86.4 47.5L86.4 47.5Q86.9 46.4 88.4 46.4L88.4 46.4Q89.1 46.4 89.4 46.5Q89.7 46.7 89.7 47.0L89.7 47.0Q89.7 47.1 89.6 47.4Q89.5 47.8 89.3 48.1L89.3 48.1Q88.9 49.0 88.9 49.7L88.9 49.7Q88.9 50.1 89.1 50.5Q89.4 51.0 90.0 51.7L90.0 51.7Q90.8 52.8 91.2 53.6Q91.7 54.3 91.7 55.2L91.7 55.2Q91.7 55.5 91.6 56.0L91.6 56.0Q92.9 55.5 94.6 53.3L94.6 53.3Q94.9 53.0 95.3 53.0L95.3 53.0Q95.6 53.0 95.8 53.3Q96.0 53.6 96.0 54.1L96.0 54.1Q96.0 55.1 95.5 55.8L95.5 55.8Q94.2 57.4 93.0 57.9Q91.9 58.5 90.1 58.6L90.1 58.6Q89.1 59.5 87.7 59.5L87.7 59.5","m"]],"LIB":[["M9.9 41.6L9.9 41.6Q10.4 41.6 11.3 41.6Q12.1 41.7 13.1 41.8L13.1 41.8Q13.4 41.8 13.7 41.8L13.7 41.8L15.7 41.8L15.6 42.3L15.6 42.3L15.1 45.6L14.9 45.6Q14.9 44.4 13.9 43.6Q12.9 42.8 11.2 42.8L11.2 42.8Q9.8 42.8 8.9 43.3Q8.1 43.9 8.0 44.7L8.0 44.7Q7.9 45.6 8.6 46.0Q9.2 46.5 10.1 46.9L10.1 46.9L14.5 48.9Q15.8 49.5 16.5 50.7Q17.3 51.8 17.2 53.5L17.2 53.5Q17.0 56.0 15.1 57.3Q13.1 58.6 9.8 58.6L9.8 58.6Q8.4 58.6 7.3 58.4Q6.2 58.2 5.5 57.9Q4.7 57.5 4.3 57.1L4.3 57.1Q4.0 56.5 4.0 55.7Q4.1 54.8 4.4 54.0Q4.6 53.2 5.0 52.7L5.0 52.7L5.2 52.7Q5.1 53.9 5.7 55.0Q6.3 56.1 7.5 56.8Q8.7 57.5 10.3 57.5L10.3 57.5Q12.0 57.5 12.8 56.8Q13.6 56.1 13.6 55.2L13.6 55.2Q13.6 54.4 13.0 53.8Q12.5 53.2 11.1 52.6L11.1 52.6L7.3 50.8Q5.7 50.1 4.9 48.8Q4.2 47.4 4.4 45.8L4.4 45.8Q4.6 44.4 5.3 43.5Q6.0 42.6 7.1 42.1Q8.3 41.6 9.9 41.6M26.1 41.4L26.3 41.4L33.8 56.9Q34.1 57.5 34.6 57.7L34.6 57.7Q35.2 58.1 35.7 58.1L35.7 58.1L35.9 58.1L35.9 58.3L27.0 58.3L27.0 58.1L27.2 58.1Q27.7 58.1 28.1 57.7Q28.4 57.3 28.1 56.6L28.1 56.6L28.1 56.6L27.2 54.4L22.2 54.4L21.3 56.6L21.3 56.6Q21.1 57.1 21.2 57.4Q21.3 57.7 21.6 57.9Q21.9 58.1 22.2 58.1L22.2 58.1L22.4 58.1L22.4 58.3L17.2 58.3L17.2 58.1L17.4 58.1Q17.9 58.1 18.5 57.7L18.5 57.7Q18.9 57.5 19.3 56.9L19.3 56.9L24.8 44.8Q24.9 44.6 25.1 44.2Q25.3 43.7 25.5 43.2Q25.7 42.6 25.9 42.2Q26.1 41.7 26.1 41.4L26.1 41.4M26.7 53.3L24.8 48.5L22.7 53.3L26.7 53.3M37.5 56.6L37.5 56.6L37.5 43.6Q37.4 43.0 37.0 42.6Q36.6 42.2 36.0 42.2L36.0 42.2L35.7 42.2L35.7 41.9L44.1 41.9L44.1 42.2L43.8 42.2Q43.2 42.2 42.7 42.6Q42.3 43.0 42.3 43.6L42.3 43.6L42.3 56.6Q42.3 57.2 42.7 57.6Q43.2 58.1 43.8 58.1L43.8 58.1L44.1 58.1L44.1 58.3L35.7 58.3L35.7 58.1L36.0 58.1Q36.6 58.1 37.0 57.6Q37.4 57.2 37.5 56.6M46.8 41.6L47.0 41.6L58.2 51.5L58.2 43.6Q58.2 43.0 57.8 42.6Q57.4 42.2 56.8 42.2L56.8 42.2L56.3 42.2L56.3 41.9L64.9 41.9L64.9 42.2L64.5 42.2Q63.9 42.2 63.5 42.6Q63.1 43.0 63.0 43.6L63.0 43.6L63.0 55.6Q63.0 56.6 63.1 57.3Q63.2 58.0 63.3 58.3L63.3 58.3L63.3 58.6L63.1 58.6L51.9 48.7L51.9 56.7L51.9 56.7Q51.9 57.2 52.3 57.7Q52.8 58.1 53.3 58.1L53.3 58.1L53.8 58.1L53.8 58.3L45.2 58.3L45.2 58.1L45.7 58.1Q46.2 58.1 46.7 57.7Q47.1 57.2 47.1 56.7L47.1 56.7L47.1 44.5Q47.1 43.1 46.9 42.3L46.9 42.3L46.8 41.6M81.5 41.5L81.5 41.5L81.5 46.3L81.3 46.3L81.3 46.1Q81.3 44.7 80.5 43.9Q79.7 43.1 78.3 43.1L78.3 43.1L76.0 43.1L76.0 56.6Q76.0 57.2 76.4 57.6Q76.8 58.1 77.5 58.1L77.5 58.1L77.8 58.1L77.8 58.3L69.4 58.3L69.4 58.1L69.7 58.1Q70.3 58.1 70.7 57.6Q71.1 57.2 71.2 56.6L71.2 56.6L71.2 43.1L68.9 43.1Q67.4 43.1 66.6 43.9Q65.8 44.7 65.8 46.1L65.8 46.1L65.8 46.3L65.6 46.3L65.6 41.5Q65.8 41.6 66.3 41.7Q66.8 41.8 67.4 41.8Q68.0 41.9 68.5 41.9L68.5 41.9L78.6 41.9Q79.2 41.9 79.7 41.8Q80.3 41.8 80.8 41.7Q81.3 41.6 81.5 41.5M88.6 41.6L88.6 41.6Q89.1 41.6 90.0 41.6Q90.8 41.7 91.8 41.8L91.8 41.8Q92.1 41.8 92.4 41.8L92.4 41.8L94.4 41.8L94.3 42.3L94.3 42.3L93.9 45.6L93.6 45.6Q93.6 44.4 92.6 43.6Q91.6 42.8 89.9 42.8L89.9 42.8Q88.5 42.8 87.6 43.3Q86.8 43.9 86.7 44.7L86.7 44.7Q86.7 45.6 87.3 46.0Q87.9 46.5 88.8 46.9L88.8 46.9L93.2 48.9Q94.5 49.5 95.3 50.7Q96.0 51.8 95.9 53.5L95.9 53.5Q95.7 56.0 93.8 57.3Q91.9 58.6 88.5 58.6L88.5 58.6Q87.2 58.6 86.1 58.4Q85.0 58.2 84.2 57.9Q83.4 57.5 83.0 57.1L83.0 57.1Q82.7 56.5 82.8 55.7Q82.8 54.8 83.1 54.0Q83.4 53.2 83.7 52.7L83.7 52.7L83.9 52.7Q83.9 53.9 84.5 55.0Q85.0 56.1 86.2 56.8Q87.4 57.5 89.0 57.5L89.0 57.5Q90.7 57.5 91.5 56.8Q92.3 56.1 92.3 55.2L92.3 55.2Q92.3 54.4 91.8 53.8Q91.2 53.2 89.8 52.6L89.8 52.6L86.0 50.8Q84.4 50.1 83.7 48.8Q82.9 47.4 83.1 45.8L83.1 45.8Q83.3 44.4 84.0 43.5Q84.7 42.6 85.9 42.1Q87.0 41.6 88.6 41.6","m"]],"SYR":[["M17.4 55.5L17.4 55.5Q14.4 58.2 10.2 58.2L10.2 58.2Q7.7 58.2 6.6 57.1L6.6 57.1Q6.0 56.5 6.0 55.0L6.0 55.0Q6.0 52.8 9.4 52.1L9.4 52.1Q10.5 51.9 12.0 51.9Q13.6 51.9 16.2 52.5L16.2 52.5Q17.6 50.9 19.5 47.9Q21.5 44.8 22.6 43.2Q23.7 41.5 25.2 39.8Q26.6 38.1 28.2 36.7L28.2 36.7Q31.4 33.8 34.5 33.8L34.5 33.8Q35.9 33.8 36.5 34.6Q37.1 35.3 37.1 36.2Q37.1 37.2 36.2 38.5Q35.3 39.7 34.2 40.7Q33.0 41.7 31.9 42.4Q30.8 43.1 30.1 43.1Q29.5 43.1 29.0 42.5Q28.6 42.0 28.6 41.5Q28.6 41.0 28.7 40.8Q28.8 40.6 29.0 40.6Q29.1 40.6 29.2 40.7L29.2 40.7Q29.7 40.6 30.8 39.7Q31.9 38.9 32.9 38.0Q33.8 37.0 33.8 36.8Q33.8 36.6 33.5 36.6Q33.3 36.6 32.8 36.8Q32.3 36.9 31.5 37.6Q30.7 38.2 29.7 39.1L29.7 39.1Q27.5 41.4 24.7 45.5L24.7 45.5Q24.1 46.5 22.9 48.3L22.9 48.3Q20.5 51.9 19.4 53.2L19.4 53.2Q27.7 55.4 31.3 55.4L31.3 55.4Q32.9 55.4 33.6 55.0L33.6 55.0Q33.8 54.8 33.9 54.8Q34.0 54.8 34.0 55.0Q34.0 55.1 33.8 55.4Q33.7 55.6 33.1 56.5Q32.5 57.3 32.3 57.5L32.3 57.5Q31.5 57.9 29.6 57.9Q27.7 57.9 26.0 57.6Q24.2 57.4 23.2 57.1Q22.1 56.8 20.1 56.2Q18.0 55.6 17.4 55.5M11.5 54.5L11.5 54.5Q9.4 54.5 9.4 55.0L9.4 55.0Q9.4 55.2 9.7 55.3Q10.1 55.5 10.6 55.5L10.6 55.5Q12.2 55.5 13.6 54.6L13.6 54.6Q12.4 54.5 11.5 54.5M45.6 45.2L45.6 45.2Q46.8 45.2 46.8 46.1L46.8 46.1Q46.8 46.5 46.6 46.7Q46.4 46.9 45.7 48.1Q45.0 49.3 44.2 51.2Q43.3 53.0 43.1 54.3L43.1 54.3Q43.1 54.5 43.1 54.8L43.1 54.8Q43.1 55.6 43.5 55.6Q44.0 55.6 44.7 55.2Q45.3 54.7 45.9 54.2Q46.4 53.7 46.9 53.1Q47.4 52.6 47.5 52.5Q47.6 52.4 47.8 52.4L47.8 52.4Q48.1 52.4 48.1 52.9Q48.2 53.4 48.2 53.9Q48.2 54.4 48.1 54.5L48.1 54.5Q47.6 55.5 46.0 56.8Q44.4 58.1 43.1 58.1Q41.8 58.1 41.2 57.3Q40.6 56.5 40.6 55.5Q40.6 54.5 40.9 53.8L40.9 53.8Q39.6 55.6 37.9 56.8Q36.1 58.0 35.0 58.0Q33.9 58.0 33.2 57.3L33.2 57.3Q32.4 56.5 32.4 55.0Q32.4 53.6 33.0 52.1Q33.7 50.6 34.7 49.4Q35.8 48.2 37.1 47.2L37.1 47.2Q39.7 45.1 42.0 45.1L42.0 45.1Q42.9 45.1 43.4 45.4Q44.0 45.7 44.1 46.1L44.1 46.1Q44.5 45.5 44.8 45.4Q45.0 45.2 45.6 45.2M43.4 47.0L43.4 47.0Q40.7 47.0 37.7 50.1L37.7 50.1Q36.7 51.2 35.8 52.7Q34.9 54.2 34.9 54.8Q34.9 55.4 35.2 55.4L35.2 55.4Q35.7 55.4 37.7 53.6Q39.8 51.8 40.5 51.0L40.5 51.0Q41.2 50.0 43.4 47.0M47.0 57.9L47.0 57.9L45.9 57.6Q45.5 57.6 45.2 57.1L45.2 57.1Q45.1 56.9 45.1 56.9Q45.0 56.8 45.0 56.8Q45.0 56.7 45.1 56.7Q45.1 56.6 45.2 56.4Q45.2 56.3 45.3 56.1L45.3 56.1Q45.6 55.0 51.0 45.3Q56.3 35.7 56.5 35.4Q56.8 35.1 56.9 34.9Q57.0 34.8 57.2 34.7Q57.3 34.6 57.4 34.6Q57.5 34.5 57.7 34.5Q57.9 34.4 58.1 34.3Q58.4 34.2 58.6 34.1Q58.9 34.0 59.0 33.9Q59.1 33.8 59.2 33.8Q59.4 33.8 59.5 34.0Q59.7 34.1 59.7 34.4L59.7 34.4L59.7 34.5Q59.6 34.8 55.5 42.1Q51.3 49.5 51.0 50.2L51.0 50.2Q52.2 49.7 54.7 47.7Q57.1 45.7 57.2 45.1Q57.2 44.4 57.6 44.2Q58.0 43.9 58.5 43.9Q59.0 43.9 59.4 44.2Q59.7 44.5 59.7 45.3Q59.7 46.0 58.8 47.2Q58.0 48.3 56.9 49.3L56.9 49.3Q54.4 51.4 52.8 52.1L52.8 52.1Q54.1 55.6 55.8 55.6L55.8 55.6Q56.7 55.5 58.0 54.1L58.0 54.1Q58.5 53.6 59.0 53.1Q59.5 52.6 59.6 52.5Q59.7 52.4 59.9 52.4L59.9 52.4Q60.2 52.4 60.2 52.9Q60.3 53.4 60.3 53.9Q60.3 54.4 60.2 54.5L60.2 54.5Q59.7 55.5 58.2 56.8Q56.6 58.1 55.2 58.1L55.2 58.1Q54.1 58.1 53.5 57.7Q52.9 57.3 52.6 57.0Q52.3 56.8 51.9 56.3Q51.6 55.9 51.3 55.6Q51.1 55.3 50.8 54.8Q50.5 54.3 50.4 54.0Q50.2 53.8 50.0 53.3Q49.7 52.8 49.7 52.8L49.7 52.8Q49.4 53.4 49.0 54.1Q48.7 54.8 48.4 55.4Q48.1 56.0 47.9 56.5Q47.6 57.0 47.5 57.3Q47.3 57.6 47.3 57.6L47.3 57.6Q47.2 57.9 47.0 57.9M70.0 45.4L70.0 45.4Q70.0 46.5 69.1 47.3Q68.3 48.1 67.2 48.1L67.2 48.1Q66.8 48.1 66.7 47.9Q66.6 47.8 66.6 47.5Q66.6 47.2 66.6 46.9L66.6 46.9Q66.1 47.1 65.4 47.5Q64.6 47.9 63.6 48.7Q62.6 49.5 62.6 49.9L62.6 49.9Q62.6 50.0 63.0 50.0Q63.3 50.0 64.1 49.8Q64.9 49.5 65.2 49.5Q65.5 49.5 65.6 49.5L65.6 49.5Q65.9 49.7 66.1 50.0Q66.3 50.4 66.3 50.6Q66.3 50.9 65.9 51.2Q65.5 51.6 65.0 51.7Q64.4 51.9 64.3 52.0L64.3 52.0Q60.9 53.9 60.9 54.6L60.9 54.6Q60.9 55.9 63.0 55.9L63.0 55.9Q64.4 55.9 65.8 55.0L65.8 55.0Q66.9 54.3 67.9 53.5Q68.8 52.8 69.1 52.6Q69.3 52.4 69.5 52.4L69.5 52.4Q69.9 52.4 69.9 53.3Q69.9 54.3 69.8 54.6Q69.7 54.9 69.1 55.3L69.1 55.3Q65.7 58.1 62.6 58.1L62.6 58.1Q60.9 58.1 59.9 57.7L59.9 57.7Q58.1 56.8 58.1 55.1L58.1 55.1Q58.1 52.9 61.2 51.8L61.2 51.8Q60.6 51.5 60.4 51.1Q60.3 50.6 60.3 49.7Q60.3 48.8 61.1 47.7Q62.0 46.6 63.3 46.0L63.3 46.0Q66.1 44.4 68.4 44.4L68.4 44.4Q68.9 44.4 69.4 44.7Q70.0 44.9 70.0 45.4M75.3 47.7L74.7 48.7Q78.5 44.4 81.1 44.4L81.1 44.4Q81.8 44.4 82.2 44.8Q82.7 45.2 82.7 45.8Q82.7 46.4 81.8 47.9Q80.9 49.4 80.1 50.4L80.1 50.4Q79.7 50.9 79.2 50.9Q78.7 50.9 78.4 50.5Q78.1 50.2 78.1 49.7L78.1 49.7Q78.1 48.5 79.3 47.1L79.3 47.1L79.3 47.1Q78.8 47.2 76.7 49.2Q74.5 51.3 73.1 52.9Q71.6 54.5 69.9 56.8L69.9 56.8Q69.4 57.5 69.0 57.5Q68.7 57.5 68.1 57.3Q67.5 57.1 67.4 57.0Q67.3 56.9 67.3 56.7Q67.3 56.4 67.4 56.1Q67.5 55.8 67.9 55.3Q68.2 54.7 68.9 53.5Q69.6 52.3 71.1 49.8Q72.6 47.3 72.9 46.8L72.9 46.8Q73.5 45.7 73.9 45.2L73.9 45.2Q74.6 44.3 76.4 44.3L76.4 44.3Q76.7 44.3 76.7 44.8L76.7 44.8Q76.7 45.6 75.3 47.7L75.3 47.7M82.7 54.3L82.7 54.3L82.7 54.5Q82.7 54.9 83.0 55.2Q83.3 55.5 83.6 55.5L83.6 55.5Q85.5 55.5 87.0 54.9Q88.5 54.3 88.5 53.8L88.5 53.8Q88.5 53.5 87.9 53.3Q87.4 53.1 86.1 52.8Q84.8 52.5 84.2 52.3Q83.7 52.1 83.3 52.0Q83.0 51.9 82.6 51.6L82.6 51.6Q81.9 51.1 81.9 50.0Q81.9 48.9 82.7 47.9Q83.4 46.9 84.6 46.1Q85.8 45.4 87.2 44.8L87.2 44.8Q89.8 43.7 91.7 43.7L91.7 43.7Q93.5 43.7 93.9 44.5L93.9 44.5Q94.0 44.7 94.0 45.1L94.0 45.1L94.0 45.2Q94.0 46.1 93.6 46.5Q93.3 47.0 92.5 47.4Q91.7 47.8 91.2 47.8Q90.8 47.8 90.7 47.7Q90.5 47.7 90.5 47.6Q90.4 47.5 90.3 47.4Q90.1 47.4 90.1 47.2Q90.1 47.0 90.3 46.8Q90.5 46.6 90.5 46.3L90.5 46.3Q89.5 46.4 88.3 46.8Q87.1 47.3 86.3 47.8Q85.5 48.4 84.9 48.9Q84.4 49.4 84.4 49.6Q84.4 49.9 85.1 50.0L85.1 50.0Q88.5 50.7 89.5 51.1Q90.6 51.6 91.0 52.2Q91.4 52.9 91.4 53.4L91.4 53.4Q91.4 54.4 90.5 55.3Q89.7 56.2 88.5 56.8L88.5 56.8Q85.9 58.1 84.0 58.1Q82.1 58.1 81.3 57.5Q80.6 56.9 80.6 56.1Q80.6 55.3 81.0 54.6Q81.4 53.9 82.1 53.9Q82.7 53.9 82.7 54.3","m"],["M14 76 C38 70 64 70 88 64","u"]],"PVB":[["M10.8 19.7L10.8 12.0L49.2 12.0L59.2 22.6L59.2 44.6L49.2 55.2L26.4 55.2L26.4 76.3L34.0 76.3L34.0 84.0L10.8 84.0L10.8 76.3L17.5 76.3L17.5 19.7L10.8 19.7M45.5 20.3L26.4 20.3L26.4 46.9L45.4 46.9L50.9 41.3L50.9 25.9L45.5 20.3","m"],["M44.1 34.3L40.0 34.3L40.0 27.9L57.0 27.9L57.0 34.3L51.5 34.3L66.0 80.8L80.5 34.3L75.0 34.3L75.0 27.9L92.0 27.9L92.0 34.3L87.9 34.3L71.1 88.1L60.9 88.1L44.1 34.3","a"]]};
function altArt(t,LL){
  const c1=t.color||'#3a4459',c2=color2Of(t),ab=(t.abbr||'').toUpperCase(),L=LL||LOGO_ALT[ab];
  const st=lum(c1)>.62?'#0b1020':(lum(c2)>.55?c2:'#ffffff'),af=lum(c2)<.25?'#ffffff':c2;
  if(!L||(t.mascot||'').toLowerCase()!==(LOGO_MASCOT[ab]||'').toLowerCase())return '<text x="50" y="64" text-anchor="middle" font-family="Big Shoulders Display,Impact,sans-serif" font-weight="900" font-size="38" fill="'+c1+'" stroke="'+st+'" stroke-width="3" paint-order="stroke">'+esc(t.abbr||'')+'</text>';
  let sh='',u='',tx='';for(const [d,r] of L){if(r==='u'){u+='<path d="'+d+'" stroke="'+c1+'" stroke-width="4" fill="none" stroke-linecap="round"/>';continue}
    sh+='<path d="'+d+'"/>';const bs=lum(c2)<.2?'#ffffff':c2,bf=lum(c2)<.2?'#ffffff':c2;if(r==='b'){tx+='<path d="'+d+'" fill="'+c1+'" stroke="'+bs+'" stroke-width="5.5" paint-order="stroke" stroke-linejoin="round"/><path d="'+d+'" fill="none" stroke="'+shadeHex(c1,-.55)+'" stroke-width="1.1"/>';continue}if(r==='c'){tx+='<path d="'+d+'" fill="'+bf+'" stroke="'+c1+'" stroke-width="5.5" paint-order="stroke" stroke-linejoin="round"/>';continue}
    tx+=r==='a'?'<path d="'+d+'" fill="'+af+'" stroke="'+c1+'" stroke-width="3" paint-order="stroke" stroke-linejoin="round"/>':'<path d="'+d+'" fill="'+c1+'" stroke="'+st+'" stroke-width="3" paint-order="stroke" stroke-linejoin="round"/>'}
  if(ab==='BAB'){const F=(x)=>{const y=78-(x-12)*.105;return '<path d="M'+x+' '+(y-.6).toFixed(1)+' C'+(x-5)+' '+(y-6).toFixed(1)+' '+(x-12)+' '+(y-9).toFixed(1)+' '+(x-19)+' '+(y-9.6).toFixed(1)+' L'+(x-15)+' '+(y-5.6).toFixed(1)+' L'+(x-19)+' '+(y-3.8).toFixed(1)+' L'+(x-12)+' '+(y-.4).toFixed(1)+' Z M'+x+' '+(y+.6).toFixed(1)+' C'+(x-5)+' '+(y+6).toFixed(1)+' '+(x-12)+' '+(y+9).toFixed(1)+' '+(x-19)+' '+(y+9.6).toFixed(1)+' L'+(x-15)+' '+(y+5.6).toFixed(1)+' L'+(x-19)+' '+(y+3.8).toFixed(1)+' L'+(x-12)+' '+(y+.4).toFixed(1)+' Z"/>'};
    u+='<g fill="'+af+'" stroke="'+c1+'" stroke-width="1.6" stroke-linejoin="round">'+F(30)+F(23)+'</g>'}
  return '<g fill="'+shadeHex(c1,-.6)+'" transform="translate(1.4 2.2)">'+sh+'</g>'+u+tx;
}
const LOGO_PRIMARY_ALT={LHI:1,BAB:1,UNI:1,VIC:1,CVE:1,NMB:1};
const LOGO_EZ={"UNI":[["M6.0 22.9L13.9 22.9L13.9 23.1L13.6 23.1Q13.1 23.1 12.7 23.5Q12.3 23.8 12.3 24.3L12.3 24.3L12.3 33.1Q12.3 34.7 12.8 35.9Q13.4 37.0 14.3 37.6Q15.2 38.3 16.5 38.3L16.5 38.3Q17.9 38.3 18.8 37.7Q19.8 37.1 20.3 36.0Q20.8 34.9 20.8 33.4L20.8 33.4L20.8 24.3Q20.8 23.8 20.4 23.5Q20.1 23.1 19.6 23.1L19.6 23.1L19.2 23.1L19.2 22.9L24.4 22.9L24.4 23.1L24.0 23.1Q23.5 23.1 23.1 23.5Q22.8 23.8 22.8 24.3L22.8 24.3L22.8 33.2Q22.8 35.1 22.0 36.5Q21.2 37.9 19.6 38.7Q18.1 39.4 15.9 39.4L15.9 39.4Q13.0 39.4 11.2 38.7Q9.4 37.9 8.5 36.5Q7.6 35.1 7.6 33.2L7.6 33.2L7.6 24.3Q7.6 23.8 7.2 23.5Q6.9 23.1 6.4 23.1L6.4 23.1L6.0 23.1L6.0 22.9M26.5 22.6L26.7 22.6L37.8 32.4L37.8 24.6Q37.8 24.0 37.4 23.6Q37.0 23.1 36.4 23.1L36.4 23.1L36.0 23.1L36.0 22.9L44.4 22.9L44.4 23.1L44.0 23.1Q43.4 23.1 43.0 23.6Q42.6 24.0 42.6 24.6L42.6 24.6L42.6 36.5Q42.6 37.4 42.6 38.1Q42.7 38.8 42.8 39.1L42.8 39.1L42.9 39.4L42.7 39.4L31.6 29.6L31.6 37.5L31.6 37.5Q31.6 38.0 32.0 38.5Q32.4 38.9 33.0 38.9L33.0 38.9L33.4 38.9L33.4 39.1L25.0 39.1L25.0 38.9L25.4 38.9Q26.0 38.9 26.4 38.5Q26.8 38.0 26.8 37.5L26.8 37.5L26.8 25.5Q26.8 24.1 26.7 23.3L26.7 23.3L26.5 22.6M46.9 37.4L46.9 37.4L46.9 24.6Q46.9 24.0 46.4 23.6Q46.0 23.1 45.4 23.1L45.4 23.1L45.1 23.1L45.1 22.9L53.4 22.9L53.4 23.1L53.1 23.1Q52.5 23.1 52.1 23.6Q51.7 24.0 51.6 24.6L51.6 24.6L51.6 37.4Q51.7 38.0 52.1 38.4Q52.5 38.9 53.1 38.9L53.1 38.9L53.4 38.9L53.4 39.1L45.1 39.1L45.1 38.9L45.4 38.9Q46.0 38.9 46.4 38.4Q46.9 38.0 46.9 37.4M64.0 22.6L64.0 22.6Q67.0 22.6 69.2 23.6Q71.3 24.6 72.5 26.5Q73.6 28.4 73.6 31.0L73.6 31.0Q73.6 33.6 72.5 35.5Q71.3 37.4 69.2 38.4Q67.0 39.4 64.0 39.4L64.0 39.4Q61.0 39.4 58.9 38.4Q56.7 37.4 55.6 35.5Q54.4 33.7 54.4 31.0L54.4 31.0Q54.4 28.4 55.6 26.5Q56.7 24.6 58.9 23.6Q61.0 22.6 64.0 22.6M64.0 38.3L64.0 38.3Q65.5 38.3 66.5 37.4Q67.5 36.5 68.0 34.9Q68.5 33.3 68.5 31.0L68.5 31.0Q68.5 28.7 68.0 27.1Q67.5 25.5 66.5 24.6Q65.5 23.7 64.0 23.7L64.0 23.7Q62.6 23.7 61.6 24.6Q60.6 25.5 60.1 27.1Q59.5 28.7 59.5 31.0L59.5 31.0Q59.5 33.3 60.1 34.9Q60.6 36.5 61.6 37.4Q62.6 38.3 64.0 38.3M76.1 22.6L76.3 22.6L87.4 32.4L87.4 24.6Q87.4 24.0 87.0 23.6Q86.6 23.1 86.0 23.1L86.0 23.1L85.5 23.1L85.5 22.9L94.0 22.9L94.0 23.1L93.6 23.1Q93.0 23.1 92.6 23.6Q92.2 24.0 92.1 24.6L92.1 24.6L92.1 36.5Q92.1 37.4 92.2 38.1Q92.3 38.8 92.4 39.1L92.4 39.1L92.5 39.4L92.2 39.4L81.1 29.6L81.2 37.5L81.2 37.5Q81.2 38.0 81.6 38.5Q82.0 38.9 82.6 38.9L82.6 38.9L83.0 38.9L83.0 39.1L74.5 39.1L74.5 38.9L75.0 38.9Q75.6 38.9 76.0 38.5Q76.4 38.0 76.4 37.5L76.4 37.5L76.4 25.5Q76.4 24.1 76.3 23.3L76.3 23.3L76.1 22.6","m"],["M13.4 75.1L13.4 75.1L13.4 65.1Q13.4 64.6 13.0 64.3Q12.7 63.9 12.2 63.9L12.2 63.9L12.0 63.9L12.0 63.8L19.1 63.8Q19.9 63.8 20.7 63.9Q21.6 64.0 22.3 64.4Q23.0 64.8 23.4 65.5Q23.9 66.1 23.9 67.2L23.9 67.2Q23.9 67.9 23.6 68.6Q23.4 69.3 22.7 69.9Q22.1 70.4 21.0 70.6L21.0 70.6Q21.7 70.8 22.3 71.4Q22.9 71.9 23.2 72.4L23.2 72.4Q23.2 72.5 23.4 72.7Q23.5 73.0 23.7 73.4Q24.0 73.7 24.2 74.1Q24.5 74.5 24.7 74.9L24.7 74.9Q25.1 75.4 25.4 75.7Q25.7 76.0 26.1 76.1Q26.4 76.2 26.8 76.2L26.8 76.2L26.8 76.4L24.6 76.4Q23.5 76.4 22.5 76.3Q21.6 76.2 20.9 75.7Q20.2 75.3 19.6 74.4L19.6 74.4Q19.4 74.0 19.3 73.7Q19.1 73.4 19.1 73.1Q19.0 72.8 18.9 72.5Q18.8 72.2 18.8 71.9Q18.7 71.7 18.7 71.4L18.7 71.4Q18.5 70.8 18.2 70.6Q18.0 70.3 17.7 70.2L17.7 70.2L17.7 70.1L18.0 70.1Q18.5 70.1 18.9 69.8Q19.3 69.6 19.6 69.1Q19.8 68.6 19.9 67.8L19.9 67.8Q20.0 67.7 20.0 67.5Q20.0 67.3 20.0 67.1L20.0 67.1Q19.9 65.7 19.3 65.2Q18.7 64.7 17.9 64.7L17.9 64.7L17.1 64.7L17.1 75.1Q17.1 75.6 17.5 75.9Q17.8 76.2 18.3 76.2L18.3 76.2L18.5 76.2L18.5 76.4L12.0 76.4L12.0 76.2L12.2 76.2Q12.7 76.2 13.0 75.9Q13.4 75.6 13.4 75.1M33.5 63.5L33.5 63.5Q35.8 63.5 37.5 64.3Q39.2 65.1 40.1 66.5Q41.0 68.0 41.0 70.1L41.0 70.1Q41.0 72.2 40.1 73.6Q39.2 75.1 37.5 75.9Q35.8 76.7 33.5 76.7L33.5 76.7Q31.2 76.7 29.5 75.9Q27.8 75.1 26.9 73.6Q26.0 72.2 26.0 70.1L26.0 70.1Q26.0 68.0 26.9 66.6Q27.8 65.1 29.5 64.3Q31.2 63.5 33.5 63.5M33.5 75.8L33.5 75.8Q34.6 75.8 35.4 75.1Q36.2 74.4 36.6 73.1Q37.0 71.9 37.0 70.1L37.0 70.1Q37.0 68.3 36.6 67.0Q36.2 65.8 35.4 65.1Q34.6 64.4 33.5 64.4L33.5 64.4Q32.4 64.4 31.6 65.1Q30.8 65.8 30.4 67.0Q30.0 68.3 30.0 70.1L30.0 70.1Q30.0 71.9 30.4 73.1Q30.8 74.4 31.6 75.1Q32.4 75.8 33.5 75.8M49.3 70.6L49.3 70.6L49.3 75.1Q49.3 75.6 49.7 75.9Q50.0 76.2 50.5 76.2L50.5 76.2L50.7 76.2L50.7 76.4L44.2 76.4L44.2 76.2L44.5 76.2Q45.0 76.2 45.3 75.9Q45.6 75.6 45.6 75.1L45.6 75.1L45.6 70.6L42.2 65.0L42.2 65.0Q42.0 64.6 41.5 64.3Q41.0 63.9 40.4 63.9L40.4 63.9L40.1 63.9L40.1 63.8L47.1 63.8L47.1 63.9L46.9 63.9Q46.5 63.9 46.3 64.3Q46.1 64.7 46.3 65.1L46.3 65.1L46.3 65.1L48.8 69.5L51.3 65.1L51.3 65.1Q51.5 64.8 51.4 64.5Q51.3 64.3 51.1 64.1Q50.9 63.9 50.7 63.9L50.7 63.9L50.5 63.9L50.5 63.8L55.0 63.8L55.0 63.9L54.7 63.9Q54.2 63.9 53.7 64.3Q53.2 64.6 52.9 65.0L52.9 65.0L52.9 65.0L49.3 70.6M58.3 63.3L58.5 63.3L64.3 75.3Q64.5 75.8 64.9 76.0L64.9 76.0Q65.3 76.2 65.8 76.2L65.8 76.2L65.9 76.2L65.9 76.4L59.0 76.4L59.0 76.2L59.2 76.2Q59.6 76.2 59.8 75.9Q60.1 75.6 59.9 75.1L59.9 75.1L59.9 75.1L59.2 73.4L55.3 73.4L54.6 75.1L54.6 75.1Q54.4 75.5 54.5 75.7Q54.6 76.0 54.9 76.1Q55.1 76.2 55.3 76.2L55.3 76.2L55.5 76.2L55.5 76.4L51.4 76.4L51.4 76.2L51.6 76.2Q52.0 76.2 52.5 76.0L52.5 76.0Q52.8 75.8 53.1 75.4L53.1 75.4L57.3 66.0Q57.4 65.9 57.6 65.5Q57.7 65.2 57.9 64.7Q58.0 64.3 58.2 63.9Q58.3 63.6 58.3 63.3L58.3 63.3M58.8 72.5L57.3 68.9L55.7 72.5L58.8 72.5M76.8 72.2L77.0 72.2L76.3 76.4L65.7 76.4L65.7 76.2L66.0 76.2Q66.4 76.2 66.8 75.9Q67.1 75.6 67.1 75.1L67.1 75.1L67.1 65.1Q67.1 64.6 66.8 64.3Q66.4 63.9 66.0 63.9L66.0 63.9L65.7 63.9L65.7 63.8L72.2 63.8L72.2 63.9L72.0 63.9Q71.5 63.9 71.2 64.3Q70.8 64.6 70.8 65.1L70.8 65.1L70.8 75.5L73.0 75.5Q73.9 75.5 74.7 75.1Q75.4 74.7 76.0 74.0Q76.5 73.3 76.8 72.2L76.8 72.2M82.3 63.5L82.3 63.5Q82.7 63.5 83.4 63.5Q84.0 63.6 84.7 63.6L84.7 63.6Q85.0 63.7 85.2 63.7L85.2 63.7L86.8 63.7L86.7 64.1L86.7 64.1L86.4 66.6L86.2 66.6Q86.2 65.6 85.4 65.0Q84.6 64.4 83.3 64.4L83.3 64.4Q82.2 64.4 81.5 64.8Q80.9 65.3 80.8 65.9L80.8 65.9Q80.8 66.6 81.3 66.9Q81.8 67.3 82.4 67.6L82.4 67.6L85.8 69.2Q86.8 69.6 87.4 70.5Q88.0 71.4 87.9 72.7L87.9 72.7Q87.8 74.6 86.3 75.7Q84.8 76.7 82.2 76.7L82.2 76.7Q81.2 76.7 80.3 76.5Q79.5 76.3 78.9 76.1Q78.3 75.8 77.9 75.5L77.9 75.5Q77.7 75.0 77.8 74.4Q77.8 73.7 78.0 73.1Q78.2 72.5 78.5 72.1L78.5 72.1L78.7 72.1Q78.6 73.0 79.1 73.9Q79.5 74.7 80.4 75.2Q81.3 75.8 82.6 75.8L82.6 75.8Q83.9 75.8 84.5 75.2Q85.2 74.7 85.2 74.0L85.2 74.0Q85.2 73.4 84.7 72.9Q84.3 72.5 83.2 72.0L83.2 72.0L80.3 70.6Q79.0 70.1 78.5 69.0Q77.9 68.0 78.1 66.7L78.1 66.7Q78.2 65.7 78.7 65.0Q79.3 64.2 80.2 63.9Q81.1 63.5 82.3 63.5","a"]],"VIC":[["M9.8 54.7L15.6 39.7L19.9 39.7L11.1 60.3L6.0 60.3L6.3 39.7L10.6 39.7L9.8 54.7M22.1 39.7L26.5 39.7L22.0 60.3L17.5 60.3L22.1 39.7M33.7 56.9L33.7 56.9L34.4 53.7L38.6 53.7L38.0 56.4Q37.1 60.6 33.2 60.6L33.2 60.6L29.2 60.6Q25.2 60.6 26.1 56.4L26.1 56.4L29.0 43.6Q29.9 39.4 33.8 39.4L33.8 39.4L37.8 39.4Q41.7 39.4 40.8 43.6L40.8 43.6L40.4 45.5L36.2 45.5L36.7 43.1Q36.8 42.8 36.6 42.6Q36.5 42.4 36.3 42.4L36.3 42.4L34.3 42.4Q34.0 42.4 33.8 42.6Q33.6 42.8 33.5 43.1L33.5 43.1L30.5 56.9Q30.4 57.2 30.5 57.3Q30.7 57.5 30.9 57.5L30.9 57.5L32.9 57.5Q33.2 57.5 33.4 57.3Q33.6 57.2 33.7 56.9M45.7 43.5L42.3 43.5L43.2 39.7L54.3 39.7L53.4 43.5L50.1 43.5L46.4 60.3L42.0 60.3L45.7 43.5M67.5 43.6L67.5 43.6L64.7 56.4Q63.8 60.6 59.9 60.6L59.9 60.6L55.7 60.6Q51.7 60.6 52.6 56.4L52.6 56.4L55.5 43.6Q56.4 39.4 60.3 39.4L60.3 39.4L64.5 39.4Q68.5 39.4 67.5 43.6M60.2 56.9L60.2 56.9L63.2 43.1Q63.3 42.8 63.1 42.6Q63.0 42.4 62.8 42.4L62.8 42.4L60.8 42.4Q60.5 42.4 60.3 42.6Q60.1 42.8 60.0 43.1L60.0 43.1L57.0 56.9Q56.9 57.2 57.0 57.3Q57.2 57.5 57.4 57.5L57.4 57.5L59.4 57.5Q59.7 57.5 59.9 57.3Q60.1 57.2 60.2 56.9M75.6 51.9L73.4 51.9L71.6 60.3L67.1 60.3L71.7 39.7L79.6 39.7Q83.5 39.7 82.6 43.9L82.6 43.9L82.1 46.3Q81.5 48.8 79.5 49.5L79.5 49.5Q81.0 50.1 80.5 52.1L80.5 52.1L78.8 60.3L74.3 60.3L76.0 52.5Q76.2 51.9 75.6 51.9L75.6 51.9M77.8 42.7L75.4 42.7L74.1 48.7L76.5 48.7Q76.7 48.7 76.9 48.6Q77.2 48.4 77.2 48.1L77.2 48.1L78.3 43.4Q78.3 43.1 78.2 42.9Q78.0 42.7 77.8 42.7L77.8 42.7M94.1 39.7L98.3 39.7L91.0 52.8L89.3 60.3L84.9 60.3L86.5 52.8L85.0 39.7L89.2 39.7L89.7 48.3L94.1 39.7","m"]],"CVE":[["M49.4 69.5L49.4 61.3L57.1 61.3L57.1 73.4L47.1 84.0L22.9 84.0L12.9 73.4L12.9 22.6L22.9 12.0L47.1 12.0L57.1 22.6L57.1 34.7L49.4 34.7L49.4 26.5L43.4 20.3L26.7 20.3L21.8 25.3L21.8 70.7L26.6 75.7L43.3 75.7L49.4 69.5","m"],["M43.2 29.7L43.2 22.0L88.8 22.0L88.8 40.8L81.2 40.8L81.2 29.7L58.7 29.7L58.7 54.2L81.2 54.2L81.2 61.8L58.7 61.8L58.7 86.3L81.2 86.3L81.2 75.2L88.8 75.2L88.8 94.0L43.2 94.0L43.2 86.3L49.9 86.3L49.9 29.7L43.2 29.7","a"]]};
function customLogo(t,sm){if(typeof S==='undefined'||!S||!S.logos)return null;const L=S.logos[t.abbr];if(!L)return null;const u=sm==='alt'?(L.a||L.p):(L.p||L.a);return u?'<image href="'+u+'" x="-4" y="-4" width="108" height="108" preserveAspectRatio="xMidYMid meet"/>':null}
function logoUpload(inp){const f=inp.files&&inp.files[0],msg=document.getElementById('lgmsg');if(!f||!S)return;const say=x=>{if(msg)msg.textContent=x};
  if(f.size>15e6){say('That file is too big. Try one under 15 MB.');return}say('Processing...');
  const rd=new FileReader();rd.onerror=()=>say('Could not read that file.');rd.onload=()=>{const im=new Image();im.onerror=()=>say('That file did not load as an image.');im.onload=()=>{try{
    const w0=im.naturalWidth||512,h0=im.naturalHeight||512,k=Math.min(1,768/Math.max(w0,h0)),w=Math.max(1,Math.round(w0*k)),h=Math.max(1,Math.round(h0*k));
    const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(im,0,0,w,h);
    let x0=w,y0=h,x1=-1,y1=-1;const d=x.getImageData(0,0,w,h).data;for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++)if(d[(yy*w+xx)*4+3]>16){if(xx<x0)x0=xx;if(xx>x1)x1=xx;if(yy<y0)y0=yy;if(yy>y1)y1=yy}
    if(x1<x0){x0=0;y0=0;x1=w-1;y1=h-1}const bw=x1-x0+1,bh=y1-y0+1,S2=256,sc=S2/Math.max(bw,bh);
    const o=document.createElement('canvas');o.width=S2;o.height=S2;const ox=o.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(c,x0,y0,bw,bh,(S2-bw*sc)/2,(S2-bh*sc)/2,bw*sc,bh*sc);
    let url=o.toDataURL('image/webp',.9);if(url.indexOf('image/webp')<0)url=o.toDataURL('image/png');
    S.logos=S.logos||{};const L=S.logos[inp.dataset.ab]||{};L[inp.dataset.logo]=url;L.v=(L.v||0)+1;S.logos[inp.dataset.ab]=L;save();render();
  }catch(err){say('Could not process that image.')}};im.src=rd.result};rd.readAsDataURL(f)}
function customV(t){return typeof S!=='undefined'&&S&&S.logos&&S.logos[t.abbr]?'|cl'+S.logos[t.abbr].v:''}
function logoArt(t,sm){
  {const cl=customLogo(t,sm);if(cl)return cl}
  {const bi=LOGO_BUILTIN[(t.abbr||'').toUpperCase()];if(bi&&sm!=='alt'&&(t.mascot||'').toLowerCase()===bi.m.toLowerCase())return '<image href="'+bi.u+'" x="-4" y="-4" width="108" height="108" preserveAspectRatio="xMidYMid meet"/>'}
  if(sm==='alt'){const ab=(t.abbr||'').toUpperCase();if(LOGO_EZ[ab]&&(t.mascot||'').toLowerCase()===(LOGO_MASCOT[ab]||'').toLowerCase())return altArt(t,LOGO_EZ[ab]);if(LOGO_PRIMARY_ALT[ab]&&LOGO_ART[ab]&&(t.mascot||'').toLowerCase()===(LOGO_MASCOT[ab]||'').toLowerCase())return LOGO_ART[ab](t.color||'#3a4459',color2Of(t),LOGO_X);return altArt(t)}
  {const ab=(t.abbr||'').toUpperCase();if(LOGO_PRIMARY_ALT[ab]&&(t.mascot||'').toLowerCase()===(LOGO_MASCOT[ab]||'').toLowerCase())return altArt(t)}
  const c1=t.color||'#3a4459',c2=color2Of(t),ab=(t.abbr||'').toUpperCase();
  if(LOGO_ART[ab]&&(t.mascot||'').toLowerCase()===(LOGO_MASCOT[ab]||'').toLowerCase())return (sm&&LOGO_ART_SM[ab]?LOGO_ART_SM[ab]:LOGO_ART[ab])(c1,c2,LOGO_X);
  return '<g transform="translate(6 6) scale(1.375)">'+LOGO_X.icon(iconFor(t.mascot),c1,c1)+'</g>';
}
/* ---------- expansion team logos ---------- */
const NEW_LOGO={
ELL:(c1,c2,X)=>{const dk=X.sh(c1,-.45),hi=X.sh(c1,.22),cr=c2;
  const ant=s=>'<g transform="'+(s<0?'translate(100 0) scale(-1 1)':'')+'" stroke="'+cr+'" stroke-width="5.6" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M41 33 C33 24 24 14 12 4"/><path d="M33 25 C31 18 31 12 34 5"/><path d="M26 18 C21 15 14 15 8 17"/><path d="M38 30 C30 31 22 34 16 38"/><path d="M19 11 C19 7 21 3 24 1"/></g>';
  return ant(1)+ant(-1)+
  '<path d="M36 38 C29 33 19 33 12 39 C19 45 28 46 37 44 Z" fill="'+c1+'"/><path d="M64 38 C71 33 81 33 88 39 C81 45 72 46 63 44 Z" fill="'+c1+'"/>'+
  '<path d="M33 39 C24 37 19 38 16 39 C22 42 28 43 34 42 Z" fill="'+dk+'"/><path d="M67 39 C76 37 81 38 84 39 C78 42 72 43 66 42 Z" fill="'+dk+'"/>'+
  '<path d="M26 74 L32 92 L40 84 L46 96 L50 88 L54 96 L60 84 L68 92 L74 74 Z" fill="'+dk+'"/>'+
  '<path d="M35 34 C38 28 62 28 65 34 L67 48 C67 60 61 70 60 82 C59 91 41 91 40 82 C39 70 33 60 33 48 Z" fill="'+c1+'"/>'+
  '<path d="M50 32 L50 76" stroke="'+hi+'" stroke-width="7" stroke-linecap="round"/>'+
  '<ellipse cx="50" cy="83" rx="9" ry="6.5" fill="'+dk+'"/><ellipse cx="46.5" cy="83" rx="1.8" ry="2.4" fill="#0b1020"/><ellipse cx="53.5" cy="83" rx="1.8" ry="2.4" fill="#0b1020"/>'+
  '<path d="M37 47 L46 51 L38 53 Z" fill="#fff"/><path d="M63 47 L54 51 L62 53 Z" fill="#fff"/><circle cx="41.5" cy="50.6" r="2" fill="#0b1020"/><circle cx="58.5" cy="50.6" r="2" fill="#0b1020"/>'+
  '<path d="M35 44 L47 49" stroke="#0b1020" stroke-width="2.6" stroke-linecap="round"/><path d="M65 44 L53 49" stroke="#0b1020" stroke-width="2.6" stroke-linecap="round"/>'},
FBE:(c1,c2,X)=>{const pk=a=>'<g transform="rotate('+a+' 50 64)"><rect x="46.8" y="12" width="6.4" height="86" rx="3" fill="'+X.sh(c1,.1)+'"/><rect x="46.8" y="86" width="6.4" height="12" rx="2" fill="'+c2+'"/>'+
    '<path d="M28 14 C38 4 62 4 72 14 L70 19 C60 11 40 11 30 19 Z" fill="'+c2+'"/><path d="M28 14 L22 21 L30 19 Z M72 14 L78 21 L70 19 Z" fill="'+X.sh(c2,-.28)+'"/><rect x="43.5" y="6" width="13" height="11" rx="2" fill="'+X.sh(c1,-.25)+'"/></g>';
  return pk(-33)+pk(33)+
  '<path d="M30 66 C30 42 70 42 70 66 Z" fill="'+c1+'"/><path d="M37 50 C42 45 58 45 63 50" stroke="'+X.sh(c1,.3)+'" stroke-width="2.2" fill="none"/><path d="M50 44 L50 65" stroke="'+X.sh(c1,.2)+'" stroke-width="3.6"/>'+
  '<ellipse cx="50" cy="67" rx="28" ry="5.6" fill="'+X.sh(c1,-.25)+'"/><rect x="41.5" y="37" width="17" height="14" rx="4.5" fill="'+c2+'"/><circle cx="50" cy="44" r="4.8" fill="#fffbe0"/><circle cx="48.8" cy="42.8" r="1.6" fill="#fff"/>'+
  '<path d="M44 37 L50 26 L56 37 Z" fill="#fff6c8" opacity=".9"/>'},
GIB:(c1,c2,X)=>{let fr='';for(const [a,l] of [[-160,30],[-120,26],[-60,26],[-15,30],[25,24]]){fr+='<g transform="translate(60 30) rotate('+a+')"><path d="M0 0 C'+l*.3+' -9 '+l*.75+' -9 '+l+' 3 C'+l*.7+' -1 '+l*.35+' 1 0 4 Z" fill="'+c2+'"/><path d="M2 2 C'+l*.4+' -3 '+l*.7+' -3 '+(l-3)+' 2" stroke="'+X.sh(c2,-.3)+'" stroke-width="1.2" fill="none"/></g>'}
  return '<circle cx="28" cy="34" r="12" fill="#f2b632"/>'+
  '<path d="M16 82 C26 70 74 70 86 82 Z" fill="'+c1+'"/>'+
  '<path d="M52 80 C50 62 52 46 60 30" stroke="'+X.sh(c1,.12)+'" stroke-width="7.5" fill="none" stroke-linecap="round"/><g stroke="'+X.sh(c1,-.3)+'" stroke-width="1.6"><path d="M49 72 L56 71"/><path d="M49 62 L56 62"/><path d="M51 52 L58 53"/><path d="M54 42 L60 44"/></g>'+fr+
  '<circle cx="62" cy="34" r="3" fill="'+X.sh(c1,.2)+'"/><circle cx="57" cy="35" r="3" fill="'+X.sh(c1,.2)+'"/>'+
  '<path d="M4 90 C12 82 20 82 26 90 C32 82 40 82 46 90 C52 82 60 82 66 90 C72 82 80 82 86 90 C90 85 94 84 98 86 L98 98 L4 98 Z" fill="'+c2+'"/><path d="M4 90 C12 82 20 82 26 90 C32 82 40 82 46 90 C52 82 60 82 66 90 C72 82 80 82 86 90" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/>'},
GRC:(c1,c2,X)=>{const sv=c2,dk=X.sh(c2,-.45);
  return '<path d="M8 96 L90 10" stroke="'+X.sh(sv,-.15)+'" stroke-width="5" stroke-linecap="round"/><path d="M84 14 L97 2 L93 18 Z" fill="'+sv+'"/><path d="M14 78 L30 94 L8 98 Z" fill="'+c1+'"/>'+
  '<path d="M42 16 C30 2 12 4 4 18 C14 13 22 16 26 22 C15 22 9 30 8 40 C17 32 27 31 34 32 Z" fill="'+c1+'"/><path d="M38 18 C28 9 18 9 11 15" stroke="'+X.sh(c1,.35)+'" stroke-width="2" fill="none"/>'+
  '<path d="M32 32 C32 18 46 12 60 14 C76 16 84 28 84 42 L84 60 C84 70 76 78 64 80 L40 80 C33 74 30 64 32 52 Z" fill="'+sv+'"/>'+
  '<path d="M56 44 L86 44 L86 50 L56 50 Z M60 56 L86 56 L86 60 L60 60 Z" fill="#0b1020"/><path d="M50 26 C60 22 72 24 78 32" stroke="#fff" stroke-width="2.4" fill="none" opacity=".7"/>'+
  '<path d="M48 18 L48 78" stroke="'+dk+'" stroke-width="2"/><g fill="'+dk+'"><circle cx="40" cy="38" r="1.8"/><circle cx="40" cy="50" r="1.8"/><circle cx="40" cy="62" r="1.8"/></g>'+
  '<path d="M34 78 L70 78 L74 92 L30 92 Z" fill="'+c1+'"/><path d="M36 84 L72 84" stroke="'+X.sh(c1,.3)+'" stroke-width="2"/>'},
CVE:(c1,c2,X)=>{const sk='#e2a878',sd='#b97a4c',ml='#8d96a3',k='#0b1020';let ch='';for(let y=50;y<90;y+=5)for(let x=24;x<78;x+=5)ch+='<circle cx="'+(x+(y%10?2.5:0))+'" cy="'+y+'" r=".9"/>';
  return '<path d="M84 98 L84 8" stroke="#c9ced6" stroke-width="3.6"/><path d="M84 0 L89 12 L79 12 Z" fill="#c9ced6"/><path d="M85 14 L99 19 L85 25 Z" fill="'+c2+'"/>'+
  '<path d="M10 100 C12 86 28 80 50 80 C72 80 88 86 90 100 Z" fill="'+c1+'"/><path d="M38 82 L50 96 L62 82" stroke="'+c2+'" stroke-width="4" fill="none"/>'+
  '<path d="M22 42 C22 28 78 28 78 42 L80 70 C80 84 68 92 50 94 C32 92 20 84 20 70 Z" fill="'+ml+'"/><g fill="#6b7480">'+ch+'</g>'+
  '<path d="M32 46 C32 40 68 40 68 46 L68 64 C68 76 60 84 50 86 C40 84 32 76 32 64 Z" fill="'+sk+'"/><path d="M60 46 L68 46 L68 64 C68 72 64 78 58 82 C62 74 62 60 60 46 Z" fill="'+sd+'"/>'+
  '<path d="M23 46 C23 24 36 8 50 2 C64 8 77 24 77 46 Z" fill="'+c1+'"/><path d="M36 14 C42 8 46 6 50 4 L50 44 L40 44 C38 34 36 24 36 14 Z" fill="'+X.sh(c1,.18)+'"/>'+
  '<rect x="21" y="40" width="58" height="8" rx="2" fill="'+c2+'"/><g fill="'+X.sh(c2,-.35)+'"><circle cx="28" cy="44" r="1.4"/><circle cx="39" cy="44" r="1.4"/><circle cx="61" cy="44" r="1.4"/><circle cx="72" cy="44" r="1.4"/></g>'+
  '<path d="M46.5 46 L53.5 46 L53 68 L50 70 L47 68 Z" fill="'+c1+'" stroke="'+c2+'" stroke-width="1.4"/>'+
  '<path d="M35 55 L45 58 L37 60.5 Z" fill="#fff"/><path d="M65 55 L55 58 L63 60.5 Z" fill="#fff"/><circle cx="40.5" cy="58.2" r="1.8" fill="'+k+'"/><circle cx="59.5" cy="58.2" r="1.8" fill="'+k+'"/>'+
  '<path d="M34 52 L46 55.5 M66 52 L54 55.5" stroke="'+k+'" stroke-width="2.6" stroke-linecap="round"/>'+
  '<path d="M43 76 C47 74 53 74 57 76" stroke="#6e3b1f" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M42 70 C45 72 48 72 50 71" stroke="'+sd+'" stroke-width="1.4" fill="none"/>'},
HOU:(c1,c2,X)=>{const st=(cx,cy,R,r)=>{let d='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r:R;d+=(i?'L':'M')+(cx+q*Math.cos(a)).toFixed(1)+' '+(cy+q*Math.sin(a)).toFixed(1)}return d+'Z'};
  return '<path d="M70 18 C46 26 22 52 4 92 C24 66 46 50 80 40 Z" fill="'+c1+'"/>'+
  '<path d="M66 28 C48 38 32 56 18 82 C34 64 50 54 76 46 Z" fill="'+c2+'"/>'+
  '<path d="M64 36 C54 44 44 54 34 70 C46 58 56 52 72 48 Z" fill="#ffd36b"/>'+
  '<path d="M60 12 L4 60" stroke="'+X.sh(c1,.3)+'" stroke-width="3" stroke-linecap="round" opacity=".8"/><path d="M90 52 L40 90" stroke="'+X.sh(c1,.3)+'" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>'+
  '<path d="'+st(72,32,26,11)+'" fill="#fff"/><path d="'+st(72,32,18,7.6)+'" fill="'+c2+'"/><circle cx="72" cy="32" r="4" fill="#fff"/>'},
CHK:(c1,c2,X)=>{const dk=X.sh(c1,-.5),mz=X.sh(c1,.5);
  return '<circle cx="24" cy="24" r="13" fill="'+c1+'"/><circle cx="76" cy="24" r="13" fill="'+c1+'"/><circle cx="24" cy="24" r="6.5" fill="'+dk+'"/><circle cx="76" cy="24" r="6.5" fill="'+dk+'"/>'+
  '<path d="M12 48 C12 22 88 22 88 48 C90 70 76 86 50 94 C24 86 10 70 12 48 Z" fill="'+c1+'"/>'+
  '<path d="M16 60 L8 66 L18 68 Z M84 60 L92 66 L82 68 Z" fill="'+c1+'"/>'+
  '<ellipse cx="50" cy="70" rx="21" ry="17" fill="'+mz+'"/>'+
  '<path d="M27 42 L45 50 L31 54 Z" fill="#fff"/><path d="M73 42 L55 50 L69 54 Z" fill="#fff"/><circle cx="35" cy="49.6" r="2.6" fill="#0b1020"/><circle cx="65" cy="49.6" r="2.6" fill="#0b1020"/>'+
  '<path d="M24 38 L46 47" stroke="'+dk+'" stroke-width="4" stroke-linecap="round"/><path d="M76 38 L54 47" stroke="'+dk+'" stroke-width="4" stroke-linecap="round"/>'+
  '<path d="M42 58 C42 54 58 54 58 58 C58 63 53 66 50 66 C47 66 42 63 42 58 Z" fill="#0b1020"/>'+
  '<path d="M34 74 C40 72 46 76 50 76 C54 76 60 72 66 74 C62 86 38 86 34 74 Z" fill="#3a0d0d"/><path d="M37 75 L40 81 L42 75.6 Z M63 75 L60 81 L58 75.6 Z" fill="#fff"/><path d="M50 66 L50 76" stroke="#0b1020" stroke-width="2"/>'},
SCA:(c1,c2,X)=>{const tan=c2,dt=X.sh(c2,-.32),pine=(x,h)=>'<path d="M'+x+' '+(66-h)+' L'+(x+12)+' '+(66-h*.55)+' L'+(x+6)+' '+(66-h*.55)+' L'+(x+15)+' '+(66-h*.15)+' L'+(x-15)+' '+(66-h*.15)+' L'+(x-6)+' '+(66-h*.55)+' L'+(x-12)+' '+(66-h*.55)+' Z" fill="'+c1+'"/>';
  return pine(16,56)+pine(84,56)+
  '<path d="M26 64 L33 30 L44 20 L50 30 L56 20 L67 30 L74 64 Z" fill="'+tan+'"/><path d="M44 20 L50 30 L56 20" stroke="'+dt+'" stroke-width="2.4" fill="none"/><path d="M38 32 L42 58 M62 32 L58 58" stroke="'+dt+'" stroke-width="2"/><path d="M50 30 L50 56" stroke="'+X.sh(tan,.25)+'" stroke-width="2"/>'+
  '<rect x="27" y="54" width="46" height="10" fill="'+c1+'"/>'+
  '<ellipse cx="50" cy="68" rx="47" ry="10" fill="'+tan+'"/><ellipse cx="50" cy="66.5" rx="47" ry="8" fill="none" stroke="'+dt+'" stroke-width="1.6"/><path d="M8 70 C30 78 70 78 92 70" stroke="'+X.sh(tan,.3)+'" stroke-width="1.6" fill="none"/>'+
  '<path d="M50 50 L53 56 L60 56.5 L55 61 L56.6 68 L50 64.4 L43.4 68 L45 61 L40 56.5 L47 56 Z" fill="#f2b632" stroke="#7a4a10" stroke-width=".8"/>'},
COL:(c1,c2,X)=>{const g=c2,k='#0b0b0d';
  return '<path d="M16 30 L12 8 L32 18 Z M84 30 L88 8 L68 18 Z" fill="'+g+'"/><path d="M18 24 L16 13 L26 18 Z M82 24 L84 13 L74 18 Z" fill="'+k+'"/>'+
  '<path d="M12 42 C14 20 32 12 50 12 C68 12 86 20 88 42 L96 56 L85 58 L92 70 L79 71 C73 86 62 94 50 94 C38 94 27 86 21 71 L8 70 L15 58 L4 56 Z" fill="'+g+'"/>'+
  '<g fill="'+k+'"><path d="M50 14 L45 24 L50 32 L55 24 Z"/><path d="M38 16 L36 26 L42 22 Z"/><path d="M62 16 L64 26 L58 22 Z"/><path d="M8 50 L28 52 L12 56 Z"/><path d="M92 50 L72 52 L88 56 Z"/><path d="M14 62 L28 62 L18 67 Z"/><path d="M86 62 L72 62 L82 67 Z"/></g>'+
  '<ellipse cx="41" cy="72" rx="11" ry="9" fill="#fff"/><ellipse cx="59" cy="72" rx="11" ry="9" fill="#fff"/>'+
  '<path d="M26 40 L44 47 L30 51 Z" fill="#cfe86a"/><path d="M74 40 L56 47 L70 51 Z" fill="#cfe86a"/><path d="M34 44 L36 50" stroke="'+k+'" stroke-width="3" stroke-linecap="round"/><path d="M66 44 L64 50" stroke="'+k+'" stroke-width="3" stroke-linecap="round"/>'+
  '<path d="M24 37 L46 45" stroke="'+k+'" stroke-width="3.4" stroke-linecap="round"/><path d="M76 37 L54 45" stroke="'+k+'" stroke-width="3.4" stroke-linecap="round"/>'+
  '<path d="M43 58 L57 58 L50 66 Z" fill="'+k+'"/><path d="M50 66 L50 70" stroke="'+k+'" stroke-width="2"/>'+
  '<path d="M37 76 C40 92 60 92 63 76 C57 81 43 81 37 76 Z" fill="#5a0f12"/><path d="M39 77 L42 85 L44 78 Z M61 77 L58 85 L56 78 Z" fill="#fff"/>'},
AKR:(c1,c2,X)=>{const cv='#f1ead8',k='#141416';const wh=(cx)=>{let s='';for(let i=0;i<8;i++){const a=i*Math.PI/4;s+='<path d="M'+cx+' 78 L'+(cx+12*Math.cos(a)).toFixed(1)+' '+(78+12*Math.sin(a)).toFixed(1)+'"/>'}return '<g stroke="'+k+'" stroke-width="2.4">'+s+'</g><circle cx="'+cx+'" cy="78" r="13" fill="none" stroke="'+k+'" stroke-width="4.4"/><circle cx="'+cx+'" cy="78" r="3.6" fill="'+c1+'"/>'};
  return '<path d="M18 58 C16 30 26 18 36 16 C40 24 60 24 64 16 C74 18 84 30 82 58 Z" fill="'+cv+'"/>'+
  '<g stroke="'+c1+'" stroke-width="3" fill="none"><path d="M36 16 C30 30 30 46 32 58"/><path d="M50 21 L50 58"/><path d="M64 16 C70 30 70 46 68 58"/></g>'+
  '<path d="M36 16 C40 24 60 24 64 16" stroke="'+X.sh(cv,-.25)+'" stroke-width="2" fill="none"/>'+
  '<path d="M10 56 L90 56 L86 72 L14 72 Z" fill="'+c1+'"/><path d="M14 62 L88 62 M15 67 L87 67" stroke="'+k+'" stroke-width="1.6"/>'+
  '<path d="M88 64 L99 70" stroke="'+k+'" stroke-width="3.4" stroke-linecap="round"/>'+wh(28)+wh(72)},
BRK:(c1,c2,X)=>{const dk=X.sh(c1,-.45),lt=X.sh(c1,.4);
  return '<g transform="translate(-3 4)"><path d="M42 38 C32 22 18 10 2 4 C8 16 20 30 34 44 Z" fill="'+c1+'"/><path d="M38 38 C28 26 18 16 8 9 C14 18 22 28 32 40 Z" fill="'+c2+'"/>'+
  '<path d="M52 32 C48 18 38 6 24 0 C28 12 36 26 44 38 Z" fill="'+X.sh(c1,.1)+'"/><path d="M48 32 C44 22 38 12 30 6 C33 15 38 24 43 34 Z" fill="'+c2+'"/>'+
  '<path d="M36 42 C42 32 60 28 74 34 C86 40 95 52 95 60 C95 67 89 71 82 71 L72 75 C62 86 46 88 34 80 C26 72 26 54 36 42 Z" fill="'+c1+'"/>'+
  '<path d="M36 74 C44 82 56 84 66 80 C58 78 50 76 44 70 Z" fill="'+lt+'"/>'+
  '<path d="M60 46 C64 42 72 42 76 46 C72 51 64 51 60 46 Z" fill="#fff"/><circle cx="69" cy="46.4" r="3" fill="#0b1020"/><path d="M57 42 L76 41" stroke="'+dk+'" stroke-width="3.2" stroke-linecap="round"/>'+
  '<path d="M90 56 C93 56 96 58 96 60 C93 62 90 61 89 59 Z" fill="#0b1020"/>'+
  '<g stroke="'+X.sh(c1,.55)+'" stroke-width="1.2" fill="none"><path d="M86 64 L100 62"/><path d="M86 66 L99 70"/></g><path d="M80 70 C84 72 88 70 90 66" stroke="#0b1020" stroke-width="1.8" fill="none"/></g>'},
NMB:(c1,c2,X)=>{const k=c2==='#111418'?'#14171c':c2;
  return '<path d="M72 30 L100 46 L74 52 Z" fill="#3a3f47"/><path d="M74 41 L100 46 L74 52 Z" fill="#23272e"/>'+
  '<path d="M18 62 C16 36 36 18 58 18 C68 18 74 22 78 30 L76 52 C72 62 64 68 56 70 L64 94 L50 82 L44 96 L38 80 L24 92 L30 74 C22 70 18 66 18 62 Z" fill="'+k+'"/>'+
  '<g stroke="'+c1+'" stroke-width="2.6" fill="none" stroke-linecap="round"><path d="M28 50 C36 44 46 44 54 48"/><path d="M26 62 C36 56 48 58 56 62"/><path d="M34 74 C40 70 48 70 54 74"/></g>'+
  '<path d="M52 30 C58 26 68 26 72 32 C66 38 58 38 52 30 Z" fill="'+c1+'"/><circle cx="63" cy="31.6" r="3.2" fill="#05070c"/><circle cx="64.4" cy="30.4" r="1.1" fill="#fff"/>'+
  '<path d="M46 24 L76 30" stroke="#05070c" stroke-width="3.6" stroke-linecap="round"/>'},
VIC:(c1,c2,X)=>{const sk='#d89a6a',sd='#a8693e',dk=X.sh(c1,-.45),k='#0b1020';const ar=(x1,y1,x2,y2)=>{const a=Math.atan2(y2-y1,x2-x1)*180/Math.PI;return '<path d="M'+x1+' '+y1+' L'+x2+' '+y2+'" stroke="'+c2+'" stroke-width="2.8"/><g transform="translate('+x2+' '+y2+') rotate('+a+')"><path d="M0 0 L-12 -5 L-9 0 L-12 5 Z" fill="'+c1+'"/><path d="M-4 0 L-14 -4 M-4 0 L-14 4" stroke="#fff" stroke-width=".8"/></g>'};
  return ar(60,70,86,6)+ar(64,72,95,14)+ar(56,70,76,2)+
  '<path d="M60 52 L92 40 L94 50 L64 64 Z" fill="'+X.sh(c1,-.3)+'"/>'+
  '<path d="M50 6 C66 6 80 18 82 40 L90 100 L10 100 L18 40 C20 18 34 6 50 6 Z" fill="'+c1+'"/>'+
  '<path d="M50 6 C42 2 34 2 26 8 C34 8 40 10 44 14 Z" fill="'+c1+'"/>'+
  '<g stroke="'+dk+'" stroke-width="2" fill="none" stroke-linecap="round"><path d="M24 50 C26 70 22 86 18 98"/><path d="M76 50 C74 70 78 86 82 98"/><path d="M40 14 C36 20 32 30 30 40"/></g>'+
  '<path d="M29 48 C29 30 71 30 71 48 L71 62 C71 78 61 88 50 88 C39 88 29 78 29 62 Z" fill="#2a0c10"/>'+
  '<path d="M34 54 C34 46 66 46 66 54 L66 64 C66 76 58 84 50 85 C42 84 34 76 34 64 Z" fill="'+sk+'"/><path d="M34 50 C40 46 60 46 66 50 L66 57 C58 55 42 55 34 57 Z" fill="#2a0c10" opacity=".55"/>'+
  '<path d="M37 59 L46 60.5 L39 62.5 Z" fill="#fff"/><path d="M63 59 L54 60.5 L61 62.5 Z" fill="#fff"/><circle cx="41.6" cy="60.8" r="1.7" fill="'+k+'"/><circle cx="58.4" cy="60.8" r="1.7" fill="'+k+'"/>'+
  '<path d="M36 56.5 L46 58.5 M64 56.5 L54 58.5" stroke="'+k+'" stroke-width="2.4" stroke-linecap="round"/>'+
  '<path d="M48 63 L46 71 L50 72" stroke="'+sd+'" stroke-width="1.6" fill="none"/><path d="M43 76 C47 78 53 78 58 75" stroke="#5a2a14" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M45 80 C48 84 52 84 55 80 C52 81 48 81 45 80 Z" fill="#4a2410"/>'+
  '<circle cx="50" cy="92" r="4.4" fill="'+c2+'"/><circle cx="50" cy="92" r="1.8" fill="'+X.sh(c2,-.4)+'"/>'},
RSB:(c1,c2,X)=>{const nv=c2;
  return '<g fill="#e8e6e0"><circle cx="30" cy="10" r="6"/><circle cx="21" cy="7" r="4.4"/><circle cx="38" cy="5" r="4"/></g>'+
  '<path d="M40 6 L60 6 L56 22 L44 22 Z" fill="'+nv+'"/><rect x="38" y="4" width="24" height="5" rx="2" fill="'+c1+'"/>'+
  '<circle cx="50" cy="46" r="26" fill="'+nv+'"/><circle cx="50" cy="46" r="26" fill="none" stroke="'+c1+'" stroke-width="5"/>'+
  '<circle cx="50" cy="44" r="11" fill="#fff4c2"/><circle cx="50" cy="44" r="11" fill="none" stroke="'+c1+'" stroke-width="3"/><circle cx="47" cy="41" r="3.4" fill="#fff"/>'+
  '<path d="M10 66 L90 66 L90 76 L10 76 Z" fill="'+c1+'"/><circle cx="18" cy="71" r="2.4" fill="'+nv+'"/><circle cx="82" cy="71" r="2.4" fill="'+nv+'"/>'+
  '<path d="M16 76 L84 76 L66 97 L34 97 Z" fill="'+nv+'"/><g stroke="'+c1+'" stroke-width="3"><path d="M30 78 L40 96"/><path d="M42 78 L46 96"/><path d="M50 78 L50 96"/><path d="M58 78 L54 96"/><path d="M70 78 L60 96"/></g>'}
};
const NEW_MASCOT={ELL:'Elk',FBE:'Miners',GIB:'Islanders',GRC:'Lancers',CVE:'Sentinels',HOU:'Comets',CHK:'Bears',SCA:'Rangers',COL:'Tigers',AKR:'Pioneers',BRK:'Jackrabbits',NMB:'Ravens',VIC:'Archers',RSB:'Express'};
Object.assign(LOGO_ART,NEW_LOGO);Object.assign(LOGO_MASCOT,NEW_MASCOT,{SHW:'Bison',UNI:'Royals'});Object.assign(LOGO_ALT,{"ELL":[["M23.3 17.0L23.3 8.0L76.7 8.0L76.7 30.0L67.7 30.0L67.7 17.0L41.5 17.0L41.5 45.5L67.7 45.5L67.7 54.5L41.5 54.5L41.5 83.0L67.7 83.0L67.7 70.0L76.7 70.0L76.7 92.0L23.3 92.0L23.3 83.0L31.2 83.0L31.2 17.0L23.3 17.0","b"]],"GRC":[["M67.4 75.1L67.4 57.8L51.9 57.8L51.9 48.9L76.3 48.9L76.3 79.7L64.7 92.0L35.3 92.0L23.7 79.7L23.7 20.3L35.3 8.0L64.7 8.0L76.3 20.3L76.3 34.4L67.4 34.4L67.4 24.9L60.3 17.6L39.8 17.6L34.0 23.6L34.0 76.4L39.7 82.4L60.2 82.4L67.4 75.1","b"]],"HOU":[["M14.6 17.0L14.6 8.0L40.6 8.0L40.6 17.0L32.8 17.0L32.8 45.5L67.2 45.5L67.2 17.0L59.4 17.0L59.4 8.0L85.4 8.0L85.4 17.0L77.6 17.0L77.6 83.0L85.4 83.0L85.4 92.0L59.4 92.0L59.4 83.0L67.2 83.0L67.2 54.5L32.8 54.5L32.8 83.0L40.6 83.0L40.6 92.0L14.6 92.0L14.6 83.0L22.4 83.0L22.4 17.0L14.6 17.0","b"]],"CHK":[["M66.8 75.1L66.8 65.6L75.8 65.6L75.8 79.7L64.1 92.0L35.9 92.0L24.2 79.7L24.2 20.3L35.9 8.0L64.1 8.0L75.8 20.3L75.8 34.4L66.8 34.4L66.8 24.9L59.7 17.6L40.4 17.6L34.5 23.6L34.5 76.4L40.3 82.4L59.6 82.4L66.8 75.1","b"]],"AKR":[["M35.0 17.0L35.0 8.0L65.0 8.0L65.0 17.0L59.8 17.0L79.5 83.0L85.1 83.0L85.1 92.0L61.4 92.0L61.4 83.0L69.2 83.0L64.1 65.8L35.9 65.8L30.8 83.0L38.6 83.0L38.6 92.0L14.9 92.0L14.9 83.0L20.5 83.0L40.2 17.0L35.0 17.0M61.4 56.8L49.9 18.6L38.6 56.8L61.4 56.8","b"]],"BRK":[["M20.7 17.0L20.7 8.0L65.5 8.0L77.1 20.3L77.1 40.5L71.1 46.9L79.3 55.5L79.3 79.7L67.7 92.0L20.7 92.0L20.7 83.0L28.5 83.0L28.5 17.0L20.7 17.0M62.7 52.1L38.8 52.1L38.8 82.4L63.2 82.4L69.7 75.8L69.7 59.4L62.7 52.1M61.1 17.6L38.8 17.6L38.8 43.2L61.0 43.2L67.5 36.6L67.5 24.2L61.1 17.6","b"]],"UNI":[["M58.7 17.0L58.7 8.0L83.6 8.0L83.6 17.0L76.9 17.0L76.9 79.7L65.2 92.0L34.8 92.0L23.1 79.7L23.1 17.0L16.4 17.0L16.4 8.0L41.3 8.0L41.3 17.0L33.4 17.0L33.4 76.4L39.1 82.4L60.8 82.4L66.6 76.4L66.6 17.0L58.7 17.0","b"]],"VIC":[["M19.5 17.0L13.8 17.0L13.8 8.0L37.5 8.0L37.5 17.0L29.8 17.0L49.9 81.8L70.2 17.0L62.5 17.0L62.5 8.0L86.2 8.0L86.2 17.0L80.5 17.0L57.1 92.0L42.9 92.0L19.5 17.0","b"]],"FBE":[["M50.0 70.5L4.0 70.5L4.0 59.3L7.4 59.3L7.4 28.7L4.0 28.7L4.0 17.5L50.0 17.5L50.0 38.1L34.7 38.1L34.7 28.7L26.5 28.7L26.5 39.4L32.5 39.4L32.5 47.2L26.5 47.2L26.5 59.3L34.7 59.3L34.7 48.6L50.0 48.6L50.0 70.5","b"],["M96.0 37.5L96.0 46.2L93.4 46.2L93.4 69.8L96.0 69.8L96.0 78.5L76.1 78.5L76.1 69.8L78.6 69.8L78.6 51.4L69.7 78.5L61.9 78.5L52.7 51.7L52.7 69.8L55.2 69.8L55.2 78.5L38.0 78.5L38.0 69.8L40.6 69.8L40.6 46.2L38.0 46.2L38.0 37.5L62.1 37.5L67.6 54.0L72.8 37.5L96.0 37.5","c"]],"GIB":[["M48.7 70.7L48.7 55.1L34.7 55.1L34.7 47.0L56.8 47.0L56.8 74.9L46.3 86.0L19.7 86.0L9.2 74.9L9.2 21.1L19.7 10.0L46.3 10.0L56.8 21.1L56.8 33.9L48.7 33.9L48.7 25.3L42.3 18.7L23.8 18.7L18.5 24.1L18.5 71.9L23.7 77.3L42.2 77.3L48.7 70.7","b"],["M60.9 92.0L60.9 84.3L68.6 84.3L68.6 27.7L60.9 27.7L60.9 20.0L85.1 20.0L85.1 27.7L77.4 27.7L77.4 84.3L85.1 84.3L85.1 92.0L60.9 92.0","c"]],"SHW":[["M28.5 74.2Q21.8 74.2 15.8 73.0Q9.8 71.9 6.6 70.4L6.6 70.4L6.6 56.6L22.0 56.6Q22.0 58.7 23.0 59.7Q24.0 60.7 26.6 60.7L26.6 60.7Q28.7 60.7 29.7 60.0Q30.6 59.4 30.6 58.0L30.6 58.0Q30.6 56.9 29.7 56.1Q28.8 55.3 26.6 54.5L26.6 54.5L20.5 52.4Q12.8 49.4 9.4 45.4Q6.0 41.5 6.0 34.7L6.0 34.7Q6.0 26.4 11.4 22.1Q16.8 17.8 29.5 17.8L29.5 17.8Q35.6 17.8 40.9 19.1Q46.3 20.3 49.6 22.3L49.6 22.3L49.6 34.8L35.6 34.8Q35.6 31.3 31.2 31.3L31.2 31.3Q29.1 31.3 28.3 31.8Q27.4 32.4 27.4 33.7L27.4 33.7Q27.4 34.9 28.4 35.6Q29.4 36.3 31.7 37.1L31.7 37.1L37.8 39.1Q45.2 41.7 48.6 45.7Q52.0 49.7 52.0 56.2L52.0 56.2Q52.0 65.1 46.0 69.6Q40.0 74.2 28.5 74.2L28.5 74.2","b"],["M38.0 82.1L38.0 71.9L41.1 71.9L41.1 44.1L38.0 44.1L38.0 33.9L66.4 33.9Q74.2 33.9 78.5 37.1Q82.8 40.2 82.8 46.1L82.8 46.1Q82.8 49.8 81.1 52.3Q79.4 54.8 77.0 56.0Q74.7 57.3 72.5 57.8L72.5 57.8L72.5 58.4Q76.9 58.8 80.5 61.2Q84.0 63.5 84.0 69.6L84.0 69.6Q84.0 76.1 79.1 79.1Q74.2 82.1 66.4 82.1L66.4 82.1L38.0 82.1M58.4 54.2L61.8 54.2Q63.6 54.2 64.5 53.3Q65.4 52.3 65.4 50.3L65.4 50.3L65.4 48.0Q65.4 46.0 64.5 45.0Q63.6 44.1 61.8 44.1L61.8 44.1L58.4 44.1L58.4 54.2M58.4 71.9L62.2 71.9Q64.0 71.9 64.9 71.0Q65.8 70.0 65.8 68.0L65.8 68.0L65.8 65.2Q65.8 63.2 64.9 62.2Q64.0 61.3 62.2 61.3L62.2 61.3L58.4 61.3L58.4 71.9","c"]],"CVE":[["M49.4 69.5L49.4 61.3L57.1 61.3L57.1 73.4L47.1 84.0L22.9 84.0L12.9 73.4L12.9 22.6L22.9 12.0L47.1 12.0L57.1 22.6L57.1 34.7L49.4 34.7L49.4 26.5L43.4 20.3L26.7 20.3L21.8 25.3L21.8 70.7L26.6 75.7L43.3 75.7L49.4 69.5","b"],["M43.2 29.7L43.2 22.0L88.8 22.0L88.8 40.8L81.2 40.8L81.2 29.7L58.7 29.7L58.7 54.2L81.2 54.2L81.2 61.8L58.7 61.8L58.7 86.3L81.2 86.3L81.2 75.2L88.8 75.2L88.8 94.0L43.2 94.0L43.2 86.3L49.9 86.3L49.9 29.7L43.2 29.7","c"]],"SCA":[["M55.7 20.9L55.7 33.3L47.5 33.3L47.5 24.6L41.6 18.5L26.5 18.5L21.4 23.7L21.4 37.3L26.2 42.3L46.7 42.3L56.7 52.7L56.7 73.1L46.4 84.0L21.6 84.0L11.3 73.1L11.3 60.7L19.5 60.7L19.5 69.4L25.5 75.5L42.6 75.5L47.6 70.3L47.6 55.6L42.9 50.7L22.4 50.7L12.3 40.2L12.3 20.9L22.6 10.0L45.4 10.0L55.7 20.9","b"],["M80.4 79.5L80.4 71.3L88.1 71.3L88.1 83.4L78.1 94.0L53.9 94.0L43.9 83.4L43.9 32.6L53.9 22.0L78.1 22.0L88.1 32.6L88.1 44.7L80.4 44.7L80.4 36.5L74.4 30.3L57.7 30.3L52.8 35.3L52.8 80.7L57.6 85.7L74.3 85.7L80.4 79.5","c"]],"COL":[["M38.0 80.7Q22.6 80.7 14.3 72.9Q6.0 65.1 6.0 48.0L6.0 48.0Q6.0 15.3 37.8 15.3L37.8 15.3Q45.5 15.3 52.1 17.2Q58.8 19.0 62.0 21.3L62.0 21.3L62.0 41.6L42.5 41.6L42.5 35.7Q42.5 32.7 41.1 31.2Q39.8 29.7 37.0 29.7L37.0 29.7Q34.2 29.7 32.9 31.2Q31.5 32.7 31.5 35.7L31.5 35.7L31.5 60.3Q31.5 63.3 32.9 64.8Q34.2 66.3 37.0 66.3L37.0 66.3Q39.8 66.3 41.1 64.8Q42.5 63.3 42.5 60.3L42.5 60.3L42.5 53.7L62.0 53.7L62.0 74.7Q58.7 77.0 52.1 78.8Q45.6 80.7 38.0 80.7L38.0 80.7","b"],["M40.0 85.2L40.0 73.7L43.5 73.7L43.5 42.3L40.0 42.3L40.0 30.8L72.1 30.8Q80.9 30.8 85.8 34.3Q90.7 37.9 90.7 44.6L90.7 44.6Q90.7 48.7 88.7 51.5Q86.8 54.4 84.1 55.8Q81.5 57.2 79.1 57.7L79.1 57.7L79.1 58.4Q84.0 58.9 88.0 61.6Q92.0 64.2 92.0 71.1L92.0 71.1Q92.0 78.4 86.5 81.8Q80.9 85.2 72.1 85.2L72.1 85.2L40.0 85.2M63.1 53.7L66.9 53.7Q68.9 53.7 69.9 52.6Q70.9 51.6 70.9 49.3L70.9 49.3L70.9 46.7Q70.9 44.4 69.9 43.3Q68.9 42.3 66.9 42.3L66.9 42.3L63.1 42.3L63.1 53.7M63.1 73.7L67.4 73.7Q69.4 73.7 70.4 72.7Q71.4 71.6 71.4 69.3L71.4 69.3L71.4 66.2Q71.4 63.9 70.4 62.8Q69.4 61.7 67.4 61.7L67.4 61.7L63.1 61.7L63.1 73.7","c"]],"NMB":[["M15.7 24.1L15.7 64.4L20.8 64.4L20.8 70.2L4.0 70.2L4.0 64.4L9.1 64.4L9.1 21.6L4.0 21.6L4.0 15.8L19.1 15.8L40.3 62.0L40.3 21.6L35.2 21.6L35.2 15.8L52.0 15.8L52.0 21.6L46.9 21.6L46.9 70.2L36.9 70.2L15.7 24.1","b"],["M40.0 38.0L40.0 32.3L54.5 32.3L68.0 71.9L81.5 32.3L96.0 32.3L96.0 38.0L91.0 38.0L91.0 80.0L96.0 80.0L96.0 85.7L79.5 85.7L79.5 80.0L84.5 80.0L84.5 41.8L71.1 80.0L64.9 80.0L51.5 41.8L51.5 80.0L56.5 80.0L56.5 85.7L40.0 85.7L40.0 80.0L45.0 80.0L45.0 38.0L40.0 38.0","c"]],"RSB":[["M6.0 71.5L6.0 60.7L9.3 60.7L9.3 31.3L6.0 31.3L6.0 20.5L36.0 20.5Q44.5 20.5 48.9 24.0Q53.4 27.5 53.4 35.3L53.4 35.3Q53.4 39.7 51.6 42.9Q49.8 46.1 46.6 47.3L46.6 47.3L46.6 48.0Q52.9 48.9 52.9 55.7L52.9 55.7L52.9 60.7L56.0 60.7L56.0 71.5L35.3 71.5L35.3 56.1Q35.3 53.5 34.5 52.2Q33.7 50.9 32.1 50.5Q30.5 50.0 27.6 50.0L27.6 50.0L27.6 60.7L31.9 60.7L31.9 71.5L6.0 71.5M27.6 42.0L31.1 42.0Q33.0 42.0 34.0 41.0Q34.9 40.0 34.9 37.8L34.9 37.8L34.9 35.5Q34.9 33.3 34.0 32.3Q33.0 31.3 31.1 31.3L31.1 31.3L27.6 31.3L27.6 42.0","b"],["M86.0 83.4L42.0 83.4L42.0 72.7L45.3 72.7L45.3 43.3L42.0 43.3L42.0 32.6L86.0 32.6L86.0 52.3L71.4 52.3L71.4 43.3L63.5 43.3L63.5 53.6L69.2 53.6L69.2 61.1L63.5 61.1L63.5 72.7L71.4 72.7L71.4 62.4L86.0 62.4L86.0 83.4","c"]]});
LOGO_ALT.NMB=[["M59.1 33.6L59.1 21.6L83.0 21.6L83.0 33.6L79.3 33.6L79.3 78.4L58.8 78.4L37.4 45.5L37.4 66.4L40.9 66.4L40.9 78.4L17.0 78.4L17.0 66.4L20.7 66.4L20.7 33.6L17.0 33.6L17.0 21.6L43.4 21.6L62.6 50.9L62.6 33.6L59.1 33.6","b"]];
/* team logo artwork (generated in Figma) */
Object.assign(LOGO_EZ,{"CHK": [["M4.0 41.3L4.0 39.0L15.8 39.0L18.8 42.2L18.8 47.5L17.2 49.2L19.4 51.4L19.4 57.8L16.4 61.0L4.0 61.0L4.0 58.7L6.1 58.7L6.1 41.3L4.0 41.3M15.0 50.6L8.8 50.6L8.8 58.5L15.2 58.5L16.9 56.8L16.9 52.5L15.0 50.6M14.6 41.5L8.8 41.5L8.8 48.2L14.6 48.2L16.3 46.5L16.3 43.2L14.6 41.5M24.1 41.3L24.1 39.0L38.1 39.0L38.1 44.7L35.8 44.7L35.8 41.3L28.9 41.3L28.9 48.8L35.8 48.8L35.8 51.2L28.9 51.2L28.9 58.7L35.8 58.7L35.8 55.3L38.1 55.3L38.1 61.0L24.1 61.0L24.1 58.7L26.2 58.7L26.2 41.3L24.1 41.3M46.2 41.3L46.2 39.0L54.1 39.0L54.1 41.3L52.7 41.3L57.9 58.7L59.4 58.7L59.4 61.0L53.1 61.0L53.1 58.7L55.2 58.7L53.9 54.1L46.5 54.1L45.1 58.7L47.2 58.7L47.2 61.0L40.9 61.0L40.9 58.7L42.4 58.7L47.6 41.3L46.2 41.3M53.1 51.8L50.1 41.8L47.2 51.8L53.1 51.8M62.2 41.3L62.2 39.0L74.0 39.0L77.0 42.2L77.0 48.7L74.0 51.9L77.1 58.7L78.6 58.7L78.6 61.0L73.1 61.0L73.1 58.7L74.3 58.7L71.1 51.9L67.0 51.9L67.0 58.7L68.7 58.7L68.7 61.0L62.2 61.0L62.2 58.7L64.2 58.7L64.2 41.3L62.2 41.3M72.8 41.5L67.0 41.5L67.0 49.4L72.8 49.4L74.5 47.6L74.5 43.2L72.8 41.5M95.7 42.2L95.7 45.9L93.3 45.9L93.3 43.3L91.5 41.5L87.0 41.5L85.5 43.1L85.5 47.1L86.9 48.6L93.0 48.6L96.0 51.7L96.0 57.8L92.9 61.0L85.5 61.0L82.5 57.8L82.5 54.1L84.9 54.1L84.9 56.7L86.7 58.5L91.8 58.5L93.3 56.9L93.3 52.6L91.9 51.1L85.8 51.1L82.8 48.0L82.8 42.2L85.8 39.0L92.6 39.0L95.7 42.2", "b"]], "BRK": [["M8.2 53.3L8.2 45.9L7.3 45.9L7.3 44.8L10.3 44.8L10.3 45.9L9.5 45.9L9.5 53.7L8.1 55.2L5.4 55.2L4.0 53.7L4.0 51.2L5.1 51.2L5.1 53.1L6.0 54.0L7.5 54.0L8.2 53.3M13.9 45.9L13.9 44.8L17.5 44.8L17.5 45.9L16.9 45.9L19.3 54.1L20.0 54.1L20.0 55.2L17.1 55.2L17.1 54.1L18.1 54.1L17.4 51.9L14.0 51.9L13.3 54.1L14.3 54.1L14.3 55.2L11.4 55.2L11.4 54.1L12.1 54.1L14.5 45.9L13.9 45.9M17.1 50.8L15.7 46.1L14.3 50.8L17.1 50.8M26.6 53.1L26.6 51.9L27.7 51.9L27.7 53.7L26.2 55.2L22.8 55.2L21.3 53.7L21.3 46.3L22.8 44.8L26.2 44.8L27.7 46.3L27.7 48.1L26.6 48.1L26.6 46.9L25.7 46.0L23.3 46.0L22.6 46.7L22.6 53.3L23.3 54.0L25.7 54.0L26.6 53.1M37.5 54.1L37.5 55.2L34.5 55.2L34.5 54.1L35.3 54.1L33.1 50.6L31.8 50.6L31.8 54.1L32.8 54.1L32.8 55.2L29.6 55.2L29.6 54.1L30.6 54.1L30.6 45.9L29.6 45.9L29.6 44.8L32.8 44.8L32.8 45.9L31.8 45.9L31.8 49.4L33.0 49.4L35.2 45.9L34.4 45.9L34.4 44.8L37.3 44.8L37.3 45.9L36.6 45.9L34.1 49.9L36.7 54.1L37.5 54.1M38.8 45.9L38.8 44.8L44.3 44.8L45.8 46.3L45.8 49.4L44.3 50.9L45.8 54.1L46.5 54.1L46.5 55.2L43.9 55.2L43.9 54.1L44.5 54.1L43.0 50.9L41.1 50.9L41.1 54.1L41.9 54.1L41.9 55.2L38.8 55.2L38.8 54.1L39.8 54.1L39.8 45.9L38.8 45.9M43.8 46.0L41.1 46.0L41.1 49.7L43.8 49.7L44.6 48.9L44.6 46.8L43.8 46.0M50.1 45.9L50.1 44.8L53.7 44.8L53.7 45.9L53.1 45.9L55.5 54.1L56.2 54.1L56.2 55.2L53.3 55.2L53.3 54.1L54.3 54.1L53.6 51.9L50.2 51.9L49.5 54.1L50.5 54.1L50.5 55.2L47.6 55.2L47.6 54.1L48.3 54.1L50.7 45.9L50.1 45.9M53.3 50.8L51.9 46.1L50.5 50.8L53.3 50.8M57.5 45.9L57.5 44.8L63.0 44.8L64.5 46.3L64.5 48.8L63.7 49.6L64.8 50.7L64.8 53.7L63.3 55.2L57.5 55.2L57.5 54.1L58.5 54.1L58.5 45.9L57.5 45.9M62.7 50.3L59.8 50.3L59.8 54.0L62.8 54.0L63.6 53.2L63.6 51.2L62.7 50.3M62.5 46.0L59.8 46.0L59.8 49.2L62.5 49.2L63.3 48.3L63.3 46.8L62.5 46.0M67.0 45.9L67.0 44.8L72.5 44.8L73.9 46.3L73.9 48.8L73.2 49.6L74.2 50.7L74.2 53.7L72.8 55.2L67.0 55.2L67.0 54.1L67.9 54.1L67.9 45.9L67.0 45.9M72.1 50.3L69.2 50.3L69.2 54.0L72.2 54.0L73.0 53.2L73.0 51.2L72.1 50.3M71.9 46.0L69.2 46.0L69.2 49.2L71.9 49.2L72.7 48.3L72.7 46.8L71.9 46.0M76.3 55.2L76.3 54.1L77.4 54.1L77.4 45.9L76.3 45.9L76.3 44.8L79.7 44.8L79.7 45.9L78.6 45.9L78.6 54.1L79.7 54.1L79.7 55.2L76.3 55.2M86.7 54.1L86.7 55.2L82.7 55.2L82.7 54.1L84.1 54.1L84.1 45.9L82.0 45.9L82.0 47.5L81.0 47.5L81.0 44.8L88.4 44.8L88.4 47.5L87.4 47.5L87.4 45.9L85.3 45.9L85.3 54.1L86.7 54.1M95.9 46.3L95.9 48.1L94.7 48.1L94.7 46.9L93.9 46.0L91.8 46.0L91.1 46.7L91.1 48.6L91.7 49.3L94.6 49.3L96.0 50.8L96.0 53.7L94.6 55.2L91.1 55.2L89.7 53.7L89.7 51.9L90.8 51.9L90.8 53.1L91.6 54.0L94.0 54.0L94.7 53.3L94.7 51.2L94.1 50.5L91.2 50.5L89.8 49.0L89.8 46.3L91.2 44.8L94.4 44.8L95.9 46.3", "b"]], "SCA": [["M4.0 44.1L4.0 42.5L12.0 42.5L14.1 44.7L14.1 49.1L12.0 51.3L14.2 55.9L15.2 55.9L15.2 57.5L11.5 57.5L11.5 55.9L12.2 55.9L10.1 51.3L7.3 51.3L7.3 55.9L8.5 55.9L8.5 57.5L4.0 57.5L4.0 55.9L5.4 55.9L5.4 44.1L4.0 44.1M11.3 44.2L7.3 44.2L7.3 49.6L11.2 49.6L12.4 48.4L12.4 45.4L11.3 44.2M20.4 44.1L20.4 42.5L25.7 42.5L25.7 44.1L24.8 44.1L28.4 55.9L29.4 55.9L29.4 57.5L25.1 57.5L25.1 55.9L26.5 55.9L25.6 52.8L20.5 52.8L19.6 55.9L21.0 55.9L21.0 57.5L16.8 57.5L16.8 55.9L17.8 55.9L21.3 44.1L20.4 44.1M25.1 51.2L23.1 44.4L21.0 51.2L25.1 51.2M34.5 44.7L34.5 55.9L35.9 55.9L35.9 57.5L31.3 57.5L31.3 55.9L32.7 55.9L32.7 44.1L31.3 44.1L31.3 42.5L35.5 42.5L41.3 55.3L41.3 44.1L39.9 44.1L39.9 42.5L44.6 42.5L44.6 44.1L43.2 44.1L43.2 57.5L40.4 57.5L34.5 44.7M55.5 54.5L55.5 51.4L52.7 51.4L52.7 49.8L57.1 49.8L57.1 55.3L55.0 57.5L49.7 57.5L47.6 55.3L47.6 44.7L49.7 42.5L55.0 42.5L57.1 44.7L57.1 47.2L55.5 47.2L55.5 45.5L54.2 44.2L50.5 44.2L49.5 45.3L49.5 54.7L50.5 55.8L54.2 55.8L55.5 54.5M60.1 44.1L60.1 42.5L69.7 42.5L69.7 46.4L68.1 46.4L68.1 44.1L63.3 44.1L63.3 49.2L68.1 49.2L68.1 50.8L63.3 50.8L63.3 55.9L68.1 55.9L68.1 53.6L69.7 53.6L69.7 57.5L60.1 57.5L60.1 55.9L61.5 55.9L61.5 44.1L60.1 44.1M72.9 44.1L72.9 42.5L80.9 42.5L83.0 44.7L83.0 49.1L80.9 51.3L83.1 55.9L84.1 55.9L84.1 57.5L80.3 57.5L80.3 55.9L81.1 55.9L79.0 51.3L76.1 51.3L76.1 55.9L77.4 55.9L77.4 57.5L72.9 57.5L72.9 55.9L74.3 55.9L74.3 44.1L72.9 44.1M80.1 44.2L76.1 44.2L76.1 49.6L80.1 49.6L81.3 48.4L81.3 45.4L80.1 44.2M95.8 44.7L95.8 47.2L94.1 47.2L94.1 45.4L92.9 44.2L89.8 44.2L88.8 45.3L88.8 48.0L89.8 49.0L94.0 49.0L96.0 51.2L96.0 55.3L93.9 57.5L88.8 57.5L86.7 55.3L86.7 52.8L88.4 52.8L88.4 54.6L89.6 55.8L93.1 55.8L94.1 54.7L94.1 51.8L93.2 50.8L89.0 50.8L86.9 48.6L86.9 44.7L89.0 42.5L93.7 42.5L95.8 44.7", "b"]], "AKR": [["M4.0 44.5L4.0 43.0L11.5 43.0L13.5 45.0L13.5 49.3L11.5 51.4L7.0 51.4L7.0 55.5L8.5 55.5L8.5 57.0L4.0 57.0L4.0 55.5L5.3 55.5L5.3 44.5L4.0 44.5M10.8 44.6L7.0 44.6L7.0 49.8L10.8 49.8L11.8 48.7L11.8 45.7L10.8 44.6M15.5 57.0L15.5 55.5L17.0 55.5L17.0 44.5L15.5 44.5L15.5 43.0L20.3 43.0L20.3 44.5L18.8 44.5L18.8 55.5L20.3 55.5L20.3 57.0L15.5 57.0M30.3 57.0L25.0 57.0L23.1 55.0L23.1 45.0L25.0 43.0L30.3 43.0L32.3 45.0L32.3 55.0L30.3 57.0M24.8 54.4L25.8 55.4L29.6 55.4L30.6 54.4L30.6 45.6L29.6 44.6L25.8 44.6L24.8 45.6L24.8 54.4M38.3 45.1L38.3 55.5L39.6 55.5L39.6 57.0L35.3 57.0L35.3 55.5L36.6 55.5L36.6 44.5L35.3 44.5L35.3 43.0L39.2 43.0L44.7 54.9L44.7 44.5L43.4 44.5L43.4 43.0L47.7 43.0L47.7 44.5L46.4 44.5L46.4 57.0L43.8 57.0L38.3 45.1M50.5 44.5L50.5 43.0L59.5 43.0L59.5 46.6L58.0 46.6L58.0 44.5L53.6 44.5L53.6 49.2L58.0 49.2L58.0 50.8L53.6 50.8L53.6 55.5L58.0 55.5L58.0 53.4L59.5 53.4L59.5 57.0L50.5 57.0L50.5 55.5L51.8 55.5L51.8 44.5L50.5 44.5M62.5 44.5L62.5 43.0L71.4 43.0L71.4 46.6L69.9 46.6L69.9 44.5L65.5 44.5L65.5 49.2L69.9 49.2L69.9 50.8L65.5 50.8L65.5 55.5L69.9 55.5L69.9 53.4L71.4 53.4L71.4 57.0L62.5 57.0L62.5 55.5L63.8 55.5L63.8 44.5L62.5 44.5M74.4 44.5L74.4 43.0L81.9 43.0L83.9 45.0L83.9 49.2L81.9 51.2L83.9 55.5L84.9 55.5L84.9 57.0L81.4 57.0L81.4 55.5L82.1 55.5L80.1 51.2L77.5 51.2L77.5 55.5L78.6 55.5L78.6 57.0L74.4 57.0L74.4 55.5L75.7 55.5L75.7 44.5L74.4 44.5M81.2 44.6L77.5 44.6L77.5 49.6L81.2 49.6L82.3 48.5L82.3 45.7L81.2 44.6M95.8 45.0L95.8 47.4L94.3 47.4L94.3 45.7L93.1 44.6L90.3 44.6L89.3 45.6L89.3 48.2L90.2 49.1L94.1 49.1L96.0 51.1L96.0 55.0L94.0 57.0L89.3 57.0L87.4 55.0L87.4 52.6L88.9 52.6L88.9 54.3L90.1 55.4L93.3 55.4L94.3 54.4L94.3 51.6L93.4 50.7L89.5 50.7L87.5 48.7L87.5 45.0L89.5 43.0L93.9 43.0L95.8 45.0", "b"]], "ELP": [["M7.5 44.3L7.5 56.5L9.1 56.5L9.1 58.2L4.0 58.2L4.0 56.5L5.5 56.5L5.5 43.5L4.0 43.5L4.0 41.8L8.6 41.8L14.9 55.7L14.9 43.5L13.4 43.5L13.4 41.8L18.5 41.8L18.5 43.5L17.0 43.5L17.0 58.2L13.9 58.2L7.5 44.3M30.2 58.2L24.0 58.2L21.8 55.8L21.8 44.2L24.0 41.8L30.2 41.8L32.5 44.2L32.5 55.8L30.2 58.2M23.8 55.2L24.9 56.3L29.3 56.3L30.5 55.2L30.5 44.8L29.4 43.7L24.9 43.7L23.8 44.8L23.8 55.2M36.0 43.5L36.0 41.8L40.4 41.8L44.6 54.0L48.7 41.8L53.2 41.8L53.2 43.5L51.7 43.5L51.7 56.5L53.2 56.5L53.2 58.2L48.1 58.2L48.1 56.5L49.6 56.5L49.6 44.7L45.5 56.5L43.6 56.5L39.5 44.7L39.5 56.5L41.1 56.5L41.1 58.2L36.0 58.2L36.0 56.5L37.5 56.5L37.5 43.5L36.0 43.5M59.2 43.5L59.2 41.8L65.0 41.8L65.0 43.5L64.0 43.5L67.9 56.5L69.0 56.5L69.0 58.2L64.3 58.2L64.3 56.5L65.9 56.5L64.9 53.1L59.4 53.1L58.4 56.5L59.9 56.5L59.9 58.2L55.3 58.2L55.3 56.5L56.4 56.5L60.2 43.5L59.2 43.5M64.3 51.3L62.1 43.9L59.9 51.3L64.3 51.3M71.1 43.5L71.1 41.8L80.4 41.8L82.7 44.2L82.7 55.8L80.4 58.2L71.1 58.2L71.1 56.5L72.6 56.5L72.6 43.5L71.1 43.5M74.6 43.7L74.6 56.3L79.5 56.3L80.6 55.2L80.6 44.8L79.5 43.7L74.6 43.7M95.8 44.2L95.8 47.0L94.0 47.0L94.0 45.0L92.7 43.7L89.3 43.7L88.2 44.8L88.2 47.9L89.2 48.9L93.8 48.9L96.0 51.3L96.0 55.8L93.7 58.2L88.2 58.2L85.9 55.8L85.9 53.0L87.8 53.0L87.8 55.0L89.1 56.3L92.9 56.3L94.0 55.2L94.0 51.9L92.9 50.8L88.4 50.8L86.2 48.5L86.2 44.2L88.4 41.8L93.5 41.8L95.8 44.2", "b"]], "RSB": [["M4.0 43.7L4.0 42.0L14.2 42.0L14.2 46.2L12.5 46.2L12.5 43.7L7.5 43.7L7.5 49.1L12.5 49.1L12.5 50.9L7.5 50.9L7.5 56.3L12.5 56.3L12.5 53.8L14.2 53.8L14.2 58.0L4.0 58.0L4.0 56.3L5.5 56.3L5.5 43.7L4.0 43.7M21.1 56.3L21.1 58.0L16.6 58.0L16.6 56.3L17.6 56.3L21.7 49.8L17.9 43.7L16.8 43.7L16.8 42.0L21.3 42.0L21.3 43.7L20.1 43.7L22.9 48.1L25.7 43.7L24.4 43.7L24.4 42.0L29.0 42.0L29.0 43.7L27.9 43.7L24.0 49.9L28.1 56.3L29.2 56.3L29.2 58.0L24.6 58.0L24.6 56.3L25.9 56.3L22.8 51.5L19.8 56.3L21.1 56.3M31.5 43.7L31.5 42.0L40.1 42.0L42.3 44.3L42.3 49.3L40.1 51.6L35.0 51.6L35.0 56.3L36.7 56.3L36.7 58.0L31.5 58.0L31.5 56.3L33.0 56.3L33.0 43.7L31.5 43.7M39.3 43.8L35.0 43.8L35.0 49.8L39.2 49.8L40.5 48.5L40.5 45.1L39.3 43.8M44.9 43.7L44.9 42.0L53.5 42.0L55.7 44.3L55.7 49.0L53.5 51.4L55.8 56.3L56.9 56.3L56.9 58.0L52.8 58.0L52.8 56.3L53.7 56.3L51.4 51.4L48.4 51.4L48.4 56.3L49.7 56.3L49.7 58.0L44.9 58.0L44.9 56.3L46.4 56.3L46.4 43.7L44.9 43.7M52.6 43.8L48.4 43.8L48.4 49.6L52.6 49.6L53.9 48.3L53.9 45.1L52.6 43.8M59.9 43.7L59.9 42.0L70.1 42.0L70.1 46.2L68.4 46.2L68.4 43.7L63.3 43.7L63.3 49.1L68.4 49.1L68.4 50.9L63.3 50.9L63.3 56.3L68.4 56.3L68.4 53.8L70.1 53.8L70.1 58.0L59.9 58.0L59.9 56.3L61.4 56.3L61.4 43.7L59.9 43.7M82.9 44.3L82.9 47.0L81.2 47.0L81.2 45.1L79.9 43.8L76.6 43.8L75.5 44.9L75.5 47.9L76.5 49.0L81.0 49.0L83.1 51.2L83.1 55.7L80.9 58.0L75.5 58.0L73.3 55.7L73.3 53.0L75.1 53.0L75.1 54.9L76.4 56.2L80.1 56.2L81.2 55.1L81.2 51.9L80.1 50.8L75.7 50.8L73.5 48.5L73.5 44.3L75.7 42.0L80.7 42.0L82.9 44.3M95.8 44.3L95.8 47.0L94.0 47.0L94.0 45.1L92.7 43.8L89.4 43.8L88.3 44.9L88.3 47.9L89.4 49.0L93.8 49.0L96.0 51.2L96.0 55.7L93.8 58.0L88.4 58.0L86.1 55.7L86.1 53.0L87.9 53.0L87.9 54.9L89.2 56.2L92.9 56.2L94.0 55.1L94.0 51.9L93.0 50.8L88.5 50.8L86.4 48.5L86.4 44.3L88.6 42.0L93.6 42.0L95.8 44.3", "b"]], "GIB": [["M4.0 56.3L4.0 54.9L5.3 54.9L5.3 45.1L4.0 45.1L4.0 43.7L8.2 43.7L8.2 45.1L6.9 45.1L6.9 54.9L8.2 54.9L8.2 56.3L4.0 56.3M18.1 45.6L18.1 47.7L16.7 47.7L16.7 46.2L15.7 45.2L13.1 45.2L12.3 46.1L12.3 48.4L13.1 49.2L16.6 49.2L18.2 51.0L18.2 54.4L16.5 56.3L12.3 56.3L10.6 54.4L10.6 52.3L11.9 52.3L11.9 53.8L13.0 54.8L15.9 54.8L16.7 53.9L16.7 51.5L15.9 50.6L12.4 50.6L10.7 48.8L10.7 45.6L12.5 43.7L16.3 43.7L18.1 45.6M20.8 45.1L20.8 43.7L24.8 43.7L24.8 45.1L23.5 45.1L23.5 54.9L27.1 54.9L27.1 53.0L28.4 53.0L28.4 56.3L20.8 56.3L20.8 54.9L21.9 54.9L21.9 45.1L20.8 45.1M32.0 45.1L32.0 43.7L36.4 43.7L36.4 45.1L35.7 45.1L38.6 54.9L39.4 54.9L39.4 56.3L35.9 56.3L35.9 54.9L37.1 54.9L36.3 52.4L32.1 52.4L31.3 54.9L32.5 54.9L32.5 56.3L29.0 56.3L29.0 54.9L29.8 54.9L32.7 45.1L32.0 45.1M35.9 51.0L34.2 45.3L32.5 51.0L35.9 51.0M43.7 45.6L43.7 54.9L44.9 54.9L44.9 56.3L41.0 56.3L41.0 54.9L42.2 54.9L42.2 45.1L41.0 45.1L41.0 43.7L44.5 43.7L49.4 54.4L49.4 45.1L48.2 45.1L48.2 43.7L52.1 43.7L52.1 45.1L50.9 45.1L50.9 56.3L48.6 56.3L43.7 45.6M54.6 45.1L54.6 43.7L61.7 43.7L63.5 45.6L63.5 54.4L61.7 56.3L54.6 56.3L54.6 54.9L55.8 54.9L55.8 45.1L54.6 45.1M57.3 45.2L57.3 54.8L61.1 54.8L61.9 53.9L61.9 46.1L61.1 45.2L57.3 45.2M66.2 45.1L66.2 43.7L74.1 43.7L74.1 47.0L72.8 47.0L72.8 45.1L68.9 45.1L68.9 49.3L72.8 49.3L72.8 50.7L68.9 50.7L68.9 54.9L72.8 54.9L72.8 53.0L74.1 53.0L74.1 56.3L66.2 56.3L66.2 54.9L67.3 54.9L67.3 45.1L66.2 45.1M76.8 45.1L76.8 43.7L83.5 43.7L85.2 45.6L85.2 49.2L83.5 51.1L85.3 54.9L86.1 54.9L86.1 56.3L83.0 56.3L83.0 54.9L83.6 54.9L81.9 51.1L79.5 51.1L79.5 54.9L80.5 54.9L80.5 56.3L76.8 56.3L76.8 54.9L78.0 54.9L78.0 45.1L76.8 45.1M82.8 45.2L79.5 45.2L79.5 49.6L82.8 49.6L83.8 48.7L83.8 46.2L82.8 45.2M95.8 45.6L95.8 47.7L94.4 47.7L94.4 46.2L93.4 45.2L90.9 45.2L90.0 46.1L90.0 48.4L90.8 49.2L94.3 49.2L96.0 51.0L96.0 54.4L94.3 56.3L90.0 56.3L88.3 54.4L88.3 52.3L89.7 52.3L89.7 53.8L90.7 54.8L93.6 54.8L94.5 53.9L94.5 51.5L93.7 50.6L90.2 50.6L88.5 48.8L88.5 45.6L90.2 43.7L94.1 43.7L95.8 45.6", "b"]], "STW": [["M11.5 54.4L11.5 52.7L13.1 52.7L13.1 55.2L11.0 57.4L6.1 57.4L4.0 55.2L4.0 44.8L6.1 42.6L11.0 42.6L13.1 44.8L13.1 47.3L11.5 47.3L11.5 45.6L10.2 44.3L6.8 44.3L5.8 45.3L5.8 54.7L6.8 55.7L10.2 55.7L11.5 54.4M23.4 57.4L17.9 57.4L15.8 55.2L15.8 44.8L17.9 42.6L23.4 42.6L25.5 44.8L25.5 55.2L23.4 57.4M17.6 54.7L18.6 55.7L22.6 55.7L23.7 54.7L23.7 45.3L22.7 44.3L18.7 44.3L17.6 45.3L17.6 54.7M28.4 44.2L27.5 44.2L27.5 42.6L31.6 42.6L31.6 44.2L30.2 44.2L33.0 55.2L35.9 44.2L35.0 44.2L35.0 42.6L39.3 42.6L39.3 44.2L38.4 44.2L41.3 55.2L44.2 44.2L42.7 44.2L42.7 42.6L46.9 42.6L46.9 44.2L46.0 44.2L42.6 57.4L40.1 57.4L37.2 46.0L34.2 57.4L31.8 57.4L28.4 44.2M48.9 44.2L48.9 42.6L56.8 42.6L58.8 44.8L58.8 48.3L57.7 49.4L59.2 51.0L59.2 55.2L57.1 57.4L48.9 57.4L48.9 55.8L50.2 55.8L50.2 44.2L48.9 44.2M56.3 50.4L52.1 50.4L52.1 55.7L56.4 55.7L57.5 54.5L57.5 51.7L56.3 50.4M56.0 44.3L52.1 44.3L52.1 48.8L56.0 48.8L57.1 47.6L57.1 45.5L56.0 44.3M70.0 57.4L64.4 57.4L62.4 55.2L62.4 44.8L64.4 42.6L70.0 42.6L72.0 44.8L72.0 55.2L70.0 57.4M64.2 54.7L65.2 55.7L69.2 55.7L70.2 54.7L70.2 45.3L69.2 44.3L65.2 44.3L64.2 45.3L64.2 54.7M82.3 55.8L82.3 57.4L76.9 57.4L76.9 55.8L78.7 55.8L78.7 52.8L75.0 44.2L74.0 44.2L74.0 42.6L78.2 42.6L78.2 44.2L76.7 44.2L79.6 50.8L82.4 44.2L81.0 44.2L81.0 42.6L85.2 42.6L85.2 44.2L84.2 44.2L80.5 52.7L80.5 55.8L82.3 55.8M95.8 44.8L95.8 47.3L94.2 47.3L94.2 45.5L93.0 44.3L90.0 44.3L88.9 45.3L88.9 48.1L89.9 49.1L94.0 49.1L96.0 51.1L96.0 55.2L93.9 57.4L89.0 57.4L86.9 55.2L86.9 52.7L88.6 52.7L88.6 54.5L89.8 55.7L93.2 55.7L94.2 54.7L94.2 51.7L93.2 50.7L89.1 50.7L87.1 48.6L87.1 44.8L89.2 42.6L93.8 42.6L95.8 44.8", "b"]]});
Object.assign(LOGO_EZ,{"BER": [["M12.6 56.1L12.6 57.8L6.6 57.8L6.6 56.1L8.6 56.1L8.6 43.9L5.6 43.9L5.6 46.3L4.0 46.3L4.0 42.2L15.2 42.2L15.2 46.3L13.6 46.3L13.6 43.9L10.5 43.9L10.5 56.1L12.6 56.1M17.2 43.9L17.2 42.2L25.5 42.2L27.7 44.5L27.7 49.1L25.5 51.3L27.7 56.1L28.8 56.1L28.8 57.8L24.9 57.8L24.9 56.1L25.7 56.1L23.5 51.3L20.6 51.3L20.6 56.1L21.8 56.1L21.8 57.8L17.2 57.8L17.2 56.1L18.7 56.1L18.7 43.9L17.2 43.9M24.7 44.0L20.6 44.0L20.6 49.6L24.7 49.6L25.9 48.3L25.9 45.2L24.7 44.0M39.7 57.8L33.8 57.8L31.7 55.5L31.7 44.5L33.8 42.2L39.7 42.2L41.8 44.5L41.8 55.5L39.7 57.8M33.6 54.9L34.7 56.0L38.9 56.0L39.9 54.9L39.9 45.1L38.9 44.0L34.7 44.0L33.6 45.1L33.6 54.9M50.3 54.9L50.3 43.9L48.8 43.9L48.8 42.2L53.4 42.2L53.4 43.9L52.2 43.9L52.2 55.5L50.0 57.8L46.0 57.8L43.9 55.5L43.9 51.8L45.6 51.8L45.6 54.6L46.9 56.0L49.2 56.0L50.3 54.9M58.7 43.9L58.7 42.2L64.2 42.2L64.2 43.9L63.3 43.9L66.9 56.1L67.9 56.1L67.9 57.8L63.5 57.8L63.5 56.1L65.0 56.1L64.0 52.9L58.9 52.9L57.9 56.1L59.3 56.1L59.3 57.8L55.0 57.8L55.0 56.1L56.0 56.1L59.6 43.9L58.7 43.9M63.5 51.3L61.4 44.2L59.3 51.3L63.5 51.3M73.2 44.6L73.2 56.1L74.7 56.1L74.7 57.8L69.9 57.8L69.9 56.1L71.3 56.1L71.3 43.9L69.9 43.9L69.9 42.2L74.2 42.2L80.2 55.4L80.2 43.9L78.8 43.9L78.8 42.2L83.6 42.2L83.6 43.9L82.1 43.9L82.1 57.8L79.3 57.8L73.2 44.6M95.8 44.5L95.8 47.1L94.1 47.1L94.1 45.3L92.8 44.0L89.7 44.0L88.6 45.1L88.6 48.0L89.6 49.0L93.9 49.0L96.0 51.2L96.0 55.5L93.8 57.8L88.6 57.8L86.5 55.5L86.5 52.9L88.2 52.9L88.2 54.7L89.5 56.0L93.0 56.0L94.1 54.9L94.1 51.8L93.1 50.8L88.8 50.8L86.7 48.6L86.7 44.5L88.8 42.2L93.6 42.2L95.8 44.5", "b"]], "GRC": [["M4.0 43.8L4.0 42.2L9.0 42.2L9.0 43.8L7.4 43.8L7.4 56.2L11.9 56.2L11.9 53.7L13.5 53.7L13.5 57.8L4.0 57.8L4.0 56.2L5.5 56.2L5.5 43.8L4.0 43.8M18.0 43.8L18.0 42.2L23.6 42.2L23.6 43.8L22.6 43.8L26.3 56.2L27.3 56.2L27.3 57.8L22.9 57.8L22.9 56.2L24.4 56.2L23.4 52.9L18.2 52.9L17.2 56.2L18.7 56.2L18.7 57.8L14.2 57.8L14.2 56.2L15.3 56.2L19.0 43.8L18.0 43.8M22.9 51.3L20.8 44.2L18.7 51.3L22.9 51.3M32.7 44.6L32.7 56.2L34.1 56.2L34.1 57.8L29.3 57.8L29.3 56.2L30.8 56.2L30.8 43.8L29.3 43.8L29.3 42.2L33.6 42.2L39.7 55.5L39.7 43.8L38.3 43.8L38.3 42.2L43.1 42.2L43.1 43.8L41.7 43.8L41.7 57.8L38.8 57.8L32.7 44.6M54.2 54.7L54.2 52.9L55.8 52.9L55.8 55.5L53.7 57.8L48.4 57.8L46.2 55.5L46.2 44.5L48.4 42.2L53.7 42.2L55.8 44.5L55.8 47.1L54.2 47.1L54.2 45.3L52.9 44.0L49.2 44.0L48.2 45.1L48.2 54.9L49.2 56.0L52.8 56.0L54.2 54.7M58.8 43.8L58.8 42.2L68.7 42.2L68.7 46.3L67.0 46.3L67.0 43.8L62.1 43.8L62.1 49.2L67.0 49.2L67.0 50.8L62.1 50.8L62.1 56.2L67.0 56.2L67.0 53.7L68.7 53.7L68.7 57.8L58.8 57.8L58.8 56.2L60.2 56.2L60.2 43.8L58.8 43.8M72.0 43.8L72.0 42.2L80.4 42.2L82.5 44.5L82.5 49.1L80.4 51.4L82.6 56.2L83.7 56.2L83.7 57.8L79.8 57.8L79.8 56.2L80.6 56.2L78.4 51.4L75.4 51.4L75.4 56.2L76.7 56.2L76.7 57.8L72.0 57.8L72.0 56.2L73.5 56.2L73.5 43.8L72.0 43.8M79.6 44.0L75.4 44.0L75.4 49.6L79.5 49.6L80.8 48.3L80.8 45.2L79.6 44.0M95.8 44.5L95.8 47.1L94.1 47.1L94.1 45.3L92.8 44.0L89.6 44.0L88.5 45.1L88.5 48.0L89.6 49.0L93.9 49.0L96.0 51.2L96.0 55.5L93.8 57.8L88.6 57.8L86.4 55.5L86.4 52.9L88.1 52.9L88.1 54.7L89.4 56.0L93.0 56.0L94.1 54.9L94.1 51.8L93.1 50.8L88.7 50.8L86.6 48.6L86.6 44.5L88.8 42.2L93.6 42.2L95.8 44.5", "b"]], "SKY": [["M4.0 43.7L4.0 41.9L12.6 41.9L14.8 44.3L14.8 48.2L13.7 49.4L15.3 51.1L15.3 55.7L13.0 58.1L4.0 58.1L4.0 56.3L5.5 56.3L5.5 43.7L4.0 43.7M12.1 50.4L7.5 50.4L7.5 56.2L12.2 56.2L13.4 54.9L13.4 51.8L12.1 50.4M11.8 43.8L7.5 43.8L7.5 48.7L11.7 48.7L13.0 47.4L13.0 45.1L11.8 43.8M18.7 43.7L18.7 41.9L23.9 41.9L23.9 43.7L22.2 43.7L22.2 56.3L26.9 56.3L26.9 53.8L28.5 53.8L28.5 58.1L18.7 58.1L18.7 56.3L20.2 56.3L20.2 43.7L18.7 43.7M33.1 43.7L33.1 41.9L38.9 41.9L38.9 43.7L37.9 43.7L41.7 56.3L42.8 56.3L42.8 58.1L38.2 58.1L38.2 56.3L39.7 56.3L38.7 53.0L33.3 53.0L32.3 56.3L33.8 56.3L33.8 58.1L29.3 58.1L29.3 56.3L30.3 56.3L34.1 43.7L33.1 43.7M38.2 51.3L36.0 44.0L33.8 51.3L38.2 51.3M52.5 43.7L46.4 43.7L46.4 46.2L44.7 46.2L44.7 41.9L54.7 41.9L54.7 43.7L46.5 56.3L53.0 56.3L53.0 53.8L54.7 53.8L54.7 58.1L44.3 58.1L44.3 56.3L52.5 43.7M57.6 43.7L57.6 41.9L67.8 41.9L67.8 46.2L66.1 46.2L66.1 43.7L61.1 43.7L61.1 49.1L66.1 49.1L66.1 50.9L61.1 50.9L61.1 56.3L66.1 56.3L66.1 53.8L67.8 53.8L67.8 58.1L57.6 58.1L57.6 56.3L59.1 56.3L59.1 43.7L57.6 43.7M71.3 43.7L71.3 41.9L79.9 41.9L82.1 44.3L82.1 49.0L79.9 51.4L82.2 56.3L83.3 56.3L83.3 58.1L79.3 58.1L79.3 56.3L80.1 56.3L77.8 51.4L74.8 51.4L74.8 56.3L76.1 56.3L76.1 58.1L71.3 58.1L71.3 56.3L72.8 56.3L72.8 43.7L71.3 43.7M79.1 43.8L74.8 43.8L74.8 49.5L79.0 49.5L80.3 48.3L80.3 45.1L79.1 43.8M95.8 44.3L95.8 47.0L94.0 47.0L94.0 45.1L92.7 43.8L89.4 43.8L88.3 44.9L88.3 47.9L89.4 49.0L93.8 49.0L96.0 51.2L96.0 55.7L93.8 58.1L88.3 58.1L86.1 55.7L86.1 53.0L87.9 53.0L87.9 54.9L89.2 56.2L92.9 56.2L94.0 55.1L94.0 51.9L93.0 50.8L88.5 50.8L86.3 48.5L86.3 44.3L88.6 41.9L93.5 41.9L95.8 44.3", "b"]], "LCS": [["M11.9 54.7L11.9 52.9L13.6 52.9L13.6 55.5L11.4 57.8L6.2 57.8L4.0 55.5L4.0 44.5L6.2 42.2L11.4 42.2L13.6 44.5L13.6 47.1L11.9 47.1L11.9 45.3L10.6 44.0L7.0 44.0L5.9 45.1L5.9 54.9L7.0 56.0L10.6 56.0L11.9 54.7M24.5 57.8L18.7 57.8L16.5 55.5L16.5 44.5L18.7 42.2L24.5 42.2L26.7 44.5L26.7 55.5L24.5 57.8M18.4 54.9L19.5 56.0L23.7 56.0L24.8 54.9L24.8 45.1L23.7 44.0L19.5 44.0L18.4 45.1L18.4 54.9M37.7 43.9L37.7 42.2L42.3 42.2L42.3 43.9L41.1 43.9L41.1 55.5L38.9 57.8L33.3 57.8L31.1 55.5L31.1 43.9L29.8 43.9L29.8 42.2L34.5 42.2L34.5 43.9L33.0 43.9L33.0 54.9L34.1 56.0L38.1 56.0L39.2 54.9L39.2 43.9L37.7 43.9M53.6 54.7L53.6 51.5L50.7 51.5L50.7 49.8L55.3 49.8L55.3 55.5L53.1 57.8L47.6 57.8L45.5 55.5L45.5 44.5L47.6 42.2L53.1 42.2L55.3 44.5L55.3 47.1L53.6 47.1L53.6 45.3L52.3 44.0L48.5 44.0L47.4 45.1L47.4 54.9L48.4 56.0L52.3 56.0L53.6 54.7M60.8 43.9L60.8 42.2L66.3 42.2L66.3 43.9L65.4 43.9L69.0 56.1L70.1 56.1L70.1 57.8L65.7 57.8L65.7 56.1L67.1 56.1L66.2 52.9L60.9 52.9L60.0 56.1L61.4 56.1L61.4 57.8L57.0 57.8L57.0 56.1L58.1 56.1L61.7 43.9L60.8 43.9M65.7 51.3L63.5 44.2L61.4 51.3L65.7 51.3M72.1 43.9L72.1 42.2L80.4 42.2L82.6 44.5L82.6 49.1L80.4 51.4L82.6 56.1L83.7 56.1L83.7 57.8L79.8 57.8L79.8 56.1L80.6 56.1L78.4 51.4L75.4 51.4L75.4 56.1L76.7 56.1L76.7 57.8L72.1 57.8L72.1 56.1L73.5 56.1L73.5 43.9L72.1 43.9M79.6 44.0L75.4 44.0L75.4 49.6L79.6 49.6L80.8 48.3L80.8 45.2L79.6 44.0M95.8 44.5L95.8 47.1L94.1 47.1L94.1 45.3L92.8 44.0L89.6 44.0L88.5 45.1L88.5 48.0L89.6 49.0L93.9 49.0L96.0 51.2L96.0 55.5L93.8 57.8L88.6 57.8L86.4 55.5L86.4 52.9L88.1 52.9L88.1 54.7L89.4 56.0L93.0 56.0L94.1 54.9L94.1 51.8L93.1 50.8L88.7 50.8L86.6 48.6L86.6 44.5L88.8 42.2L93.6 42.2L95.8 44.5", "b"]]});
/* Calvary Edmond Sentinels: user-supplied artwork */
delete LOGO_PRIMARY_ALT.CVE;
LOGO_ART.CVE=()=>'<image href="'+CVE_IMG+'" x="-4" y="-4" width="108" height="108" preserveAspectRatio="xMidYMid meet"/>';
LOGO_ART_SM.CVE=()=>'<image href="'+CVE_IMG_SM+'" x="-4" y="-4" width="108" height="108" preserveAspectRatio="xMidYMid meet"/>';
for(const k in LOGO_CACHE)delete LOGO_CACHE[k];

function logoSVG(t,sm){
  const c1=t.color||'#3a4459',c2=color2Of(t),key=(sm?sm+'|':'')+(t.abbr||'')+'|'+t.name+'|'+t.mascot+'|'+c1+'|'+c2+customV(t);if(LOGO_CACHE[key])return LOGO_CACHE[key];
  const K=lum(c1)<.2?'#f4f1e8':'#0b1020',fid='lo'+hashS(key);
  const art=logoArt(t,sm),img=art.startsWith('<image');
  const svg='<svg viewBox="-4 -4 108 108" role="img" aria-label="'+esc(t.name+' '+t.mascot)+' logo">'+(img?art:'<defs><filter id="'+fid+'" x="-10%" y="-10%" width="120%" height="120%"><feMorphology in="SourceAlpha" operator="dilate" radius="2.2" result="d"/><feFlood flood-color="'+K+'"/><feComposite in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#'+fid+')">'+art+'</g>')+'</svg>';
  LOGO_CACHE[key]=svg;return svg;
}
function mlogo(t,cls){return '<span class="mlogo'+(cls?' '+cls:'')+'">'+logoSVG(t,true)+'</span>'}
/* logo as an image for the field */
const LOGO_IMG={};
function logoImg(t,mode){const k=(mode||'')+'|'+t.name+'|'+t.color+'|'+color2Of(t)+'|'+t.mascot+customV(t);if(LOGO_IMG[k])return LOGO_IMG[k];if(typeof Image==='undefined')return null;const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(logoSVG(t,mode).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" '));LOGO_IMG[k]=im;return im}

/* ---------- awards ---------- */
function awards(){
  const hz=heisman(),pre=S.preRank||poll(),out={};
  let coy=null;
  for(const t of S.teams){const r=rec(t.id),pr=(pre.indexOf(t.id)+1)||16,exp=clamp(11-(pr-1)*.28,3,11),sc=r.w-exp+(t.cc?1:0)+(S.champs.natl===t.id?2:0);if(!coy||sc>coy.sc)coy={t,sc}}
  out.coy={coach:coy.t.id===S.userId?S.coach:coy.t.coach.name,team:coy.t.name,mine:coy.t.id===S.userId,rec:recStr(coy.t.id)};
  const bestD=[...S.teams].sort((a,b)=>(b.def+rec(b.id).w*2)-(a.def+rec(a.id).w*2));
  out.dpoy={name:fullName(),pos:pick(['DE','LB','CB','S']),team:bestD[0].name};
  const ft=pick(poll().slice(0,15));out.foy={name:fullName(),pos:pick(['QB','RB','WR','LB']),team:team(ft).name};
  const qb=hz.find(c=>c.pos==='QB'),rbs=hz.filter(c=>c.pos==='RB'),wrs=hz.filter(c=>c.pos==='WR');
  out.aa=[qb,rbs[0],wrs[0],wrs[1]].filter(Boolean).map(c=>({pos:c.pos,name:c.name,team:c.t.name,mine:c.mine}));
  for(const pos of ['DE','DT','LB','LB','CB','CB','S'])out.aa.push({pos,name:fullName(),team:pick(bestD.slice(0,8)).name,mine:false});
  return out;
}

/* ---------- job offers ---------- */
function jobOffers(r,title,car){
  const u=S.userId,myP=U().prestige,offers=[];
  if(r.w>=9||title||U().cc){
    const pool=S.teams.filter(t=>t.id!==u&&t.prestige>=myP+4);
    offers.push(...shuffle(pool.filter(t=>car.some(c=>c.t===t.id))).slice(0,2).map(t=>t.id));
    if((r.w>=11||title)&&offers.length<3){const ex=shuffle(pool.filter(t=>!offers.includes(t.id)&&t.prestige>=myP+8))[0];if(ex)offers.push(ex.id)}
  }
  return offers;
}
function switchJob(id){
  const old=S.userId;
  team(old).coach={name:fullName(),heat:20,yrs:0};newIdent(team(old));
  S.jobNews={from:old,to:id};
  post(old,pick(['Thanks for everything, Coach. Mostly.','Cannot believe he left for '+team(id).name+'.','Next coach better beat '+team(id).name+' twice a year.']));
  post(id,'Welcome to '+team(id).name+', '+S.coach+'! Let us go win some games.');
  S.userId=id;S.stars=genStars(team(id).prestige);S.ad={conf:62};S.move=null;S.offers=[];
}

/* ---------- league life: coaches, injuries, stars, storylines ---------- */
function newStar(){const pos=pick(['QB','QB','RB','WR']);return {name:fullName(),pos,num:pos==='RB'?ri(20,39):ri(1,19),yr:ri(2,4),yds:0,td:0}}
function patchLeague(){
  if(!S||!S.teams)return;
  for(const t of S.teams){
    if(!t.coach)t.coach={name:fullName(),heat:clamp(Math.round(30+rnd(-15,20)+(t.prestige>80?5:0)),5,70),yrs:ri(1,9)};
    if(t.coach.rt==null)seedCoachRt(t);
    if(!t.star)t.star=newStar();
  }
  S.inj=S.inj||[];S.news=S.news||{};
}
function injMod(id){const m={off:0,def:0};for(const j of (S.inj||[]))if(j.team===id&&j.wk>0)m[j.side]+=j.imp;return m}
function prTxt(id){const p=prOf(id),f=x=>(x>0?'+':'')+x.toFixed(1);return Math.abs(p.o)<.3&&Math.abs(p.d)<.3?'Steady':'O '+f(p.o)+' · D '+f(p.d)}
function prOf(id){const t=team(id);return t.pr||{o:0,d:0}}
function pOff(id){return rOff(id)+prOf(id).o}
function pDef(id){return rDef(id)+prOf(id).d}
/* Oddsmakers adjust slowly: each game nudges a team's offense and defense power rating toward how they actually played. */
function updatePower(w){
  for(const g of S.games.filter(x=>x.wk===w&&x.done))for(const id of [g.h,g.a]){
    const o=id===g.h?g.a:g.h,adv=g.neutral?0:(id===g.h?1.6:-1.6),t=team(id),pr=t.pr||(t.pr={o:0,d:0});
    const pf=id===g.h?g.hs:g.as,pa=id===g.h?g.as:g.hs;
    const ef=24+(pOff(id)-pDef(o))*0.55+adv,ea=24+(pOff(o)-pDef(id))*0.55-adv;
    pr.o=clamp(pr.o*0.93+clamp(pf-ef,-21,21)*0.05,-5,5);pr.d=clamp(pr.d*0.93+clamp(ea-pa,-21,21)*0.05,-5,5);
    pr.o=Math.round(pr.o*100)/100;pr.d=Math.round(pr.d*100)/100;
  }
}
function rOff(id){return team(id).off+bonus(id).off+injMod(id).off+idMod(id).off+staffMod(id).off+coachMod(id)}
function rDef(id){return team(id).def+bonus(id).def+injMod(id).def+idMod(id).def+staffMod(id).def+coachMod(id)}
function starOut(id){return (S.inj||[]).some(j=>j.team===id&&j.starOut&&j.wk>0)}
function userInj(pos){return (S.inj||[]).find(j=>j.team===S.userId&&j.star===pos&&j.wk>0)}
/* ---------- game-day conditions: night, weather, crowd themes ---------- */
const SNOWST=new Set(['OH','IL','IN','MI','NY','PA','CO','ID','WA','MT','WY','ND','SD','MN','WI','IA','NE','KS','MO','UT','KY','WV','MA','VT','NH','ME','CT','NJ','OR']);
const DRYST=new Set(['AZ','NM','NV','CA','TX','OK']);
const THEME={white:{n:'WHITEOUT',w:'whiteout'},black:{n:'BLACKOUT',w:'blackout'},stripe:{n:'STRIPE THE STADIUM',w:'stripe-out'}};
const WXN={clear:'Clear',rain:'Rain',snow:'Snow',wind:'Windy'};
function stOf(id){const m=/,\s*([A-Z]{2})\b/.exec(team(id).city||'');return m?m[1]:''}
function lcsWO(){
  if(S.lcsWO&&S.lcsWO.season===S.season)return S.lcsWO.gi;
  const L=S.teams.find(t=>t.abbr==='LCS'&&(t.mascot||'').toLowerCase()==='cougars');let gi=-1;
  if(L){const pr=S.preRank||poll();let best=99;S.games.forEach((g,i)=>{if(g.h===L.id&&!g.neutral&&g.wk<12){const r=(pr.indexOf(g.a)+1)||40,v=r-(g.riv!=null?6:0)-(g.conf?2:0);if(v<best){best=v;gi=i}}})}
  S.lcsWO={season:S.season,gi};return gi;
}
function gameEnv(g){
  if(!g)return {night:false,weather:'clear',theme:null};
  if(g.env)return g.env;
  const gi=S.games.indexOf(g),rr=srng(hashS(S.season+':env:'+g.wk+':'+g.h+':'+g.a)),st=stOf(g.h),p=poll();
  const hr=g.hr||rankOf(g.h,p),ar=g.ar||rankOf(g.a,p),big=(hr<=15&&ar<=15)||g.riv!=null||!!g.po||g.ccg!=null||(hr<=6||ar<=6);
  let night=rr()<(big?.62:.3),weather='clear';const r=rr(),dome=g.neutral&&(g.po||g.bowl||g.ccg!=null)&&rr()<.6;
  if(!dome){if(!g.neutral&&SNOWST.has(st)&&g.wk>=9&&r<.2)weather='snow';else if(r<(DRYST.has(st)?.25:.36)&&r>=(DRYST.has(st)?.19:.2))weather='rain';else if(r>=.36&&r<.47)weather='wind'}
  let theme=null;
  if(gi>=0&&gi===lcsWO()){theme='white';night=true}
  else if(!g.neutral&&((hr<=12&&ar<=12)||(g.riv!=null&&(S.rivals[g.riv]||{}).type!=='occ')||ar<=4||g.po)&&rr()<.3){const L=lum(team(g.h).color||'#888');theme=L<.22?(rr()<.6?'black':'white'):rr()<.55?'white':rr()<.5?'stripe':'black'}
  g.env={night,weather,theme,dome};return g.env;
}
function envG(){return G&&S.games[G.gid]?gameEnv(S.games[G.gid]):{night:false,weather:'clear',theme:null}}
function envChips(g){const e=gameEnv(g),out=[];if(e.theme)out.push('<span class="chip themechip th-'+e.theme+'">'+THEME[e.theme].n+'</span>');if(e.night)out.push('<span class="chip">Night game</span>');if(e.dome)out.push('<span class="chip">Indoors</span>');else if(e.weather!=='clear')out.push('<span class="chip">'+WXN[e.weather]+'</span>');return out.join('')}
const THEMEFEED={
 white:['WHITEOUT. Wear white or do not bother showing up.','{oppabbr} has never heard noise like this. Good luck with the snap count.','Every single seat in white. Chills already.','Whiteout under the lights. This is the game I wait all year for.','Opposing QBs hate this game. Love that for us.'],
 black:['BLACKOUT. Everybody in black, no exceptions.','It is going to look like a storm cloud in there.','Blackout under the lights. {oppabbr} is going to feel it.','Black from the student section to the press box.'],
 stripe:['Stripe the stadium! Check your section color.','Alternating sections, full send. It is going to look unreal on TV.','If you wear the wrong color for your section I am telling on you.']
};
function drawEnv(c,W,H){
  const e=envG();
  if(e.weather==='rain'||e.weather==='snow'){const n=e.weather==='rain'?140:110;SC.wx=SC.wx||[];while(SC.wx.length<n)SC.wx.push({x:Math.random()*W,y:Math.random()*H,v:.6+Math.random()*.6});if(SC.wx.length>n)SC.wx.length=n;
    c.save();if(e.weather==='rain'){c.fillStyle='rgba(120,140,170,.07)';c.fillRect(0,0,W,H);c.strokeStyle='rgba(200,215,235,.45)';c.lineWidth=1;c.beginPath();for(const d of SC.wx){d.y+=11*d.v;d.x-=2*d.v;if(d.y>H){d.y=-10;d.x=Math.random()*W*1.1}c.moveTo(d.x,d.y);c.lineTo(d.x-2.4,d.y+10*d.v)}c.stroke()}
    else{c.fillStyle='rgba(230,236,245,.06)';c.fillRect(0,0,W,H);c.fillStyle='rgba(255,255,255,.85)';for(const d of SC.wx){d.y+=1.3*d.v;d.x+=Math.sin(SC.t*1.4+d.v*9)*.5;if(d.y>H){d.y=-4;d.x=Math.random()*W}c.beginPath();c.arc(d.x,d.y,1.1+d.v*1.1,0,6.283);c.fill()}}
    c.restore()}
  else if(e.weather==='wind'){SC.wx=SC.wx||[];while(SC.wx.length<26)SC.wx.push({x:Math.random()*W,y:Math.random()*H,v:.6+Math.random()*.6});c.save();c.strokeStyle='rgba(230,235,240,.16)';c.lineWidth=1.2;c.beginPath();for(const d of SC.wx.slice(0,26)){d.x+=9*d.v;if(d.x>W+30){d.x=-40;d.y=Math.random()*H}c.moveTo(d.x,d.y);c.quadraticCurveTo(d.x+14,d.y-3,d.x+30,d.y)}c.stroke();c.restore()}
}
function stampGame(g){if(g.pl==null){const p=poll();g.pl=Math.round(spreadMargin(g)*2)/2;g.hr=rankOf(g.h,p);g.ar=rankOf(g.a,p)}}
let NOSTAR=false;
function starStats(g){if(NOSTAR)return;
  for(const id of [g.h,g.a]){
    if(id===S.userId||starOut(id))continue;
    const st=team(id).star,pts=id===g.h?g.hs:g.as;
    if(st.pos==='QB'){st.yds+=Math.round(clamp(140+pts*5.5+gauss()*45,40,520));st.td+=Math.max(0,Math.round(pts/7*.65+gauss()*.6))}
    else{st.yds+=Math.round(clamp((st.pos==='RB'?45:40)+pts*2.5+gauss()*32,0,290));st.td+=Math.max(0,Math.round(pts/7*(st.pos==='RB'?.45:.35)+gauss()*.5))}
  }
}
function streak(id){
  const gs=S.games.filter(g=>g.done&&(g.h===id||g.a===id)).sort((a,b)=>a.wk-b.wk);
  if(!gs.length)return {w:true,n:0};
  const won=g=>winnerOf(g)===id,last=won(gs[gs.length-1]);let n=0;
  for(let i=gs.length-1;i>=0;i--){if(won(gs[i])===last)n++;else break}
  return {w:last,n};
}
const fmtLine=x=>String(Math.round(x*2)/2);
function heisman(){
  const p=poll(),list=[];
  const cand=(t,name,pos,yds,td,mine,out)=>{const r=rec(t.id),k=rankOf(t.id,p);const base=pos==='QB'?yds/22+td*4:yds/11+td*5;return {t,name,pos,yds,td,mine,out,sc:base+r.w*4-r.l*6+(k<=5?10:k<=12?6:k<=PN?2:0)-(out?12:0)}};
  for(const t of S.teams){
    if(t.id===S.userId){for(const s of S.stars){const x=s.s||{};list.push(cand(t,s.name,s.pos,x.yds||0,x.td||0,true,!!userInj(s.pos)))}}
    else list.push(cand(t,t.star.name,t.star.pos,t.star.yds,t.star.td,false,starOut(t.id)));
  }
  return list.sort((a,b)=>b.sc-a.sc);
}
function weekly(w,prev){
  const games=S.games.filter(g=>g.wk===w&&g.done),heat0={};
  S.teams.forEach(t=>heat0[t.id]=t.coach.heat);
  for(const g of games)for(const [id,won] of [[g.h,g.hs>g.as],[g.a,g.as>g.hs]]){
    if(id===S.userId)continue;const t=team(id),favBy=id===g.h?(g.pl||0):-(g.pl||0);
    let d=won?(favBy<-3?-7:-3):(favBy>3?8+Math.min(6,favBy/3):3);
    if(!won&&Math.abs(g.hs-g.as)>=28)d+=3;if(!won&&t.prestige>=80)d+=3;
    t.coach.heat=clamp(Math.round(t.coach.heat+d),0,100);
  }
  const fired=[];
  if(w>=5&&w<12)for(const t of S.teams){if(t.id!==S.userId&&t.coach.heat>=96&&!t.coach.interim&&R()<.5){const r=rec(t.id);fired.push({t:t.id,old:t.coach.name,nw:fullName(),r:r.w+'-'+r.l});t.coach={name:fired[fired.length-1].nw,heat:30,yrs:0,interim:true,rt:hireRt(t,true),d:0}}}
  S.inj.forEach(j=>j.wk--);S.inj=S.inj.filter(j=>j.wk>0);
  const fresh=[];
  if(w<16)for(const t of S.teams){
    if(t.id===S.userId){
      if(R()<.045){const st=pick(S.stars);if(!userInj(st.pos)){const j={team:t.id,pos:st.pos,name:st.name,wk:ri(1,3),side:'off',imp:st.pos==='QB'?-5:-2,star:st.pos,backup:short(fullName()),bnum:st.pos==='RB'?ri(20,39):ri(1,19)};S.inj.push(j);fresh.push(j)}}
      continue;
    }
    if(R()<.06){
      const pos=pick(['QB','RB','WR','LB','CB','DE']),isStar=t.star.pos===pos&&R()<.5,off=['QB','RB','WR'].includes(pos);
      const j={team:t.id,pos,name:isStar?t.star.name:fullName(),wk:R()<.18?99:ri(1,4),side:off?'off':'def',imp:pos==='QB'?-5:-2,starOut:isStar};
      S.inj.push(j);fresh.push(j);
    }
  }
  try{suspensions(w,fresh)}catch(e){}
  const rivN=[];for(const g of games)if(g.riv!=null){const ch=rivalryResult(g),rv=S.rivals[g.riv],W=winnerOf(g),Lo=W===g.h?g.a:g.h,mine=W===S.userId||Lo===S.userId;rivN.push({tag:'Rivalry',score:(mine?42:24)+(ch?6:0),team:W,title:ch?team(W).name+' takes back '+rv.trophy:team(W).name+' keeps '+rv.trophy,body:team(W).name+' beat '+team(Lo).name+' '+rv.last.s+'. '+team(W).name+' now '+seriesTxt(rv,W).toLowerCase()+' in the all-time series.'})}
  S.news[w]=genNews(w,prev,fresh,fired,heat0).concat(rivN).sort((a,b)=>b.score-a.score).slice(0,10);
}
function genNews(w,prev,fresh,fired,heat0){
  const p=poll(),items=[],games=S.games.filter(g=>g.wk===w&&g.done),u=S.userId,covered=new Set();
  const N=id=>team(id).name;
  const add=(tag,score,tm,title,body)=>items.push({tag,score,team:tm,title,body});
  for(const g of games){
    const W=winnerOf(g),Lo=W===g.h?g.a:g.h,ws=Math.max(g.hs,g.as),ls=Math.min(g.hs,g.as),mar=ws-ls;
    const dogBy=W===g.h?-(g.pl||0):(g.pl||0),wr=W===g.h?g.hr:g.ar,lr=W===g.h?g.ar:g.hr;
    const lrs=lr<=PN?'No. '+lr+' ':'',wrs=wr<=PN?'No. '+wr+' ':'',sc=ws+'-'+ls+(g.ot?' in OT':'');
    const home=!g.neutral&&W===g.h,mine=W===u||Lo===u;
    if(dogBy>=6&&lr<=PN){
      const t=pick([N(W)+' stuns '+lrs+N(Lo)+', '+sc,'Upset! '+N(W)+' knocks off '+lrs+N(Lo),lrs+N(Lo)+' goes down '+(home?'at '+N(W):'to '+N(W))]);
      let b=N(W)+' came in as a '+fmtLine(dogBy)+'-point underdog and won '+sc+(g.neutral?'':home?' at home':' on the road')+'.';
      if(home&&dogBy>=9)b+=' Fans stormed the field before the clock hit zero.';
      b+=lr<=4?' Playoff hopes for '+N(Lo)+' just took a real hit.':' Expect a tumble in the poll.';
      add('Upset',40+dogBy*2+((PN+1)-lr)+(mine?15:0),W,t,b);covered.add(g);
    }else if(lr<=10&&wr<=PN){
      add('Top 10',30+((PN+1)-lr)+(mine?15:0),W,wrs+N(W)+' takes down '+lrs+N(Lo),N(W)+' beat '+N(Lo)+' '+sc+'. Both teams were ranked, and this one will shape the playoff race.');covered.add(g);
    }else if((g.ot||mar<=3)&&(wr<=PN||lr<=PN||mine)){
      add('Thriller',22+(mine?15:0),W,N(W)+' survives '+N(Lo)+(g.ot?' in overtime':'')+', '+ws+'-'+ls,pick(['Nobody in the building sat down for the final drive.','It came down to the last possession.','Somebody check on the fan bases. That was a lot.']));covered.add(g);
    }else if(mar>=35){
      add('Blowout',15+(wr<=PN?8:0)+(mine?15:0),W,wrs+N(W)+' hangs '+ws+' on '+N(Lo),'This one was over by halftime. '+N(W)+' won by '+mar+'.');covered.add(g);
    }
    if(mine&&!covered.has(g)){
      add('Your team',26,u,W===u?N(u)+' handles '+N(Lo)+', '+ws+'-'+ls:N(W)+' beats '+N(u)+', '+ws+'-'+ls,W===u?S.coach+' moves to '+recStr(u)+' on the year.':'A rough one for '+S.coach+'. '+N(u)+' falls to '+recStr(u)+'.');
    }
  }
  if(prev&&prev[0]!==p[0])add('Poll',45,p[0],N(p[0])+' takes over at No. 1',N(prev[0])+' slipped, and voters moved '+N(p[0])+' ('+recStr(p[0])+') to the top spot.');
  if(prev){let best=null;for(const id of p.slice(0,PN)){const d=(prev.indexOf(id)+1)-(p.indexOf(id)+1);if(d>=4&&(!best||d>best.d))best={id,d}}if(best)add('Poll',18,best.id,N(best.id)+' jumps '+best.d+' spots to No. '+(p.indexOf(best.id)+1),'Voters noticed. '+N(best.id)+' is '+recStr(best.id)+'.')}
  if(w>=4&&w<12){const un=S.teams.filter(t=>rec(t.id).l===0&&rec(t.id).w>0).sort((a,b)=>p.indexOf(a.id)-p.indexOf(b.id));if(un.length&&un.length<=6)add('Unbeaten watch',20+(7-un.length)*3,un[0].id,un.length===1?'One perfect team left: '+un[0].name:un.length+' unbeatens remain',un.map(t=>t.name+' ('+recStr(t.id)+')').join(', ')+'.')}
  for(const t of S.teams){
    if(t.id===u)continue;const s=streak(t.id);
    if(!s.w&&s.n>=4&&t.prestige>=68)add('Hot seat',24,t.id,'Free fall at '+t.name+': '+s.n+' straight losses','Coach '+t.coach.name+' is '+(t.coach.heat>=80?'squarely on the hot seat.':'starting to feel the heat.'));
    else if(s.w&&s.n>=5&&w<12&&p.indexOf(t.id)>=6&&p.indexOf(t.id)<PN)add('Streak',14,t.id,t.name+' has won '+s.n+' straight','Quietly one of the hottest teams in the country.');
    if(heat0[t.id]<85&&t.coach.heat>=85)add('Hot seat',21,t.id,'Seat heats up for '+t.coach.name,'After a '+recStr(t.id)+' start, boosters at '+t.name+' are getting loud.');
  }
  for(const f of fired)add('Coaching',38,f.t,N(f.t)+' fires '+f.old,f.old+' is out after a '+f.r+' start. '+f.nw+' takes over as interim coach.');
  for(const j of fresh){
    if(j.susp){const nx=S.games.find(g=>g.wk===w+1&&(g.h===j.team||g.a===j.team));add('Suspension',20+(p.indexOf(j.team)<PN?8:0),j.team,N(j.team)+' suspends '+j.pos+' '+short(j.name),'Violation of team rules. He sits '+(nx?'against '+N(nx.h===j.team?nx.a:nx.h):'this week')+'.');continue}
    const rk=p.indexOf(j.team)+1,out=j.wk>=99?'out for the season':'out '+j.wk+' week'+(j.wk>1?'s':'');
    if(j.team===u)add('Injury',50,u,'Injury blow: your '+j.pos+' '+j.name+' is '+out,'Backup '+j.backup+' (#'+j.bnum+') steps in. Expect your offense to take a hit.');
    else if(rk<=10||j.starOut)add('Injury',18+(rk<=10?10:0)+(j.starOut?12:0)+(j.pos==='QB'?6:0),j.team,N(j.team)+(j.starOut?' loses star ':' loses ')+j.pos+' '+short(j.name),(j.starOut?'A Heisman hopeful goes down. ':'')+short(j.name)+' is '+out+'.');
  }
  try{dramaNews(w,add)}catch(e){}
  if(S.ad.conf<35)add('Hot seat',26,u,'Pressure mounts on '+S.coach,'Athletic director confidence is down to '+S.ad.conf+'. Boosters want results now.');
  return items.sort((a,b)=>b.score-a.score).slice(0,9);
}
function preNews(){
  const p=poll(),items=[],N=id=>team(id).name;
  items.push({tag:'Poll',team:p[0],title:N(p[0])+' opens the season at No. 1',body:'The preseason top four: '+p.slice(0,4).map(id=>N(id)).join(', ')+'.'});
  for(const x of (S.offNews||[]))items.push(x);S.offNews=null;
  if(S.jobNews){const j=S.jobNews;items.push({tag:'Coaching',team:j.to,title:N(j.to)+' hires '+S.coach,body:S.coach+' leaves '+N(j.from)+' for a bigger stage. Expectations just went up.'})}
  for(const f of (S.carousel||[]))items.push({tag:'Coaching',team:f.t,title:N(f.t)+' moves on from '+f.old,body:f.old+' went '+f.r+' last season. '+f.nw+(f.rt?' ('+(f.rt>=85?'a proven winner, ':f.rt>=75?'a strong hire, ':f.rt<55?'a long shot, ':'')+'coach rating '+f.rt+')':'')+' takes over'+(f.ident?' and brings a new identity: '+f.ident+'.':'.')});
  {const M=S.coachMoves;if(M&&M.season===S.season-1){for(const x of M.up)items.push({tag:'Coaching',team:x.id,title:'Stock up: '+x.name,body:'Beat expectations at '+N(x.id)+' last season. Coach rating up '+x.d+' to '+x.rt+'.'});for(const x of M.dn.slice(0,2))items.push({tag:'Coaching',team:x.id,title:'Stock down: '+x.name,body:'A rough year at '+N(x.id)+'. Coach rating down '+Math.abs(x.d)+' to '+x.rt+'.'})}}
  const fg=S.teams.filter(t=>t.hist&&t.hist.tier==='fallen'&&t.id!==S.userId);if(fg.length){const t=pick(fg);items.push({tag:'Heisman',team:t.id,title:'Can '+t.name+' wake the echoes?',body:histLine(t)+' The fan base remembers, even if the recruits do not.'})}
  const dy=S.teams.find(t=>t.hist&&t.hist.tier==='dynasty');if(dy)items.push({tag:'Poll',team:dy.id,title:'The team to beat: '+dy.name,body:histLine(dy)});
  const hs=S.teams.filter(t=>t.id!==S.userId).sort((a,b)=>b.coach.heat-a.coach.heat)[0];
  if(hs&&hs.coach.heat>=55)items.push({tag:'Hot seat',team:hs.id,title:hs.coach.name+' enters a make-or-break year',body:'Patience is thin at '+hs.name+'. A slow start could end it early.'});
  const hz=heismanPre();items.push({tag:'Heisman',team:hz.t.id,title:'Preseason Heisman favorite: '+hz.name,body:hz.t.name+' '+hz.pos+'. Voters will be watching from Week 1.'});
  items.push({tag:'Your team',team:S.userId,title:'Expectations at '+U().name,body:'The athletic director wants '+S.ad.goal+' wins. Preseason ranking: '+(rankOf(S.userId,p)<=PN?'No. '+rankOf(S.userId,p):'unranked')+'.'});
  return items;
}
function heismanPre(){const p=poll();const t=team(p.find(id=>id!==S.userId&&team(id).star.pos==='QB')||p[0]);return {t,name:t.star.name,pos:t.star.pos}}
function nextGameOf(id){return S.games.filter(g=>!g.done&&g.wk>S.week&&(g.h===id||g.a===id)).sort((a,b)=>a.wk-b.wk)[0]}
function lastDone(id){return S.games.filter(g=>g.done&&(g.h===id||g.a===id)).sort((a,b)=>b.wk-a.wk)[0]}
function upsetAlerts(){
  const p=poll(),out=[];
  for(const g of S.games){
    if(g.wk!==S.week||g.done)continue;
    const m=spreadMargin(g),fav=m>=0?g.h:g.a,dog=fav===g.h?g.a:g.h,fr=rankOf(fav,p);if(fr>PN||Math.abs(m)<3)continue;
    let pr=1/(1+Math.exp(Math.abs(m)/6.5));const why=[];
    if(!g.neutral&&fav===g.a){pr+=.03;why.push('Road trip into a hostile crowd')}
    const lg=lastDone(fav);if(lg&&winnerOf(lg)===fav){const o=lg.h===fav?lg.a:lg.h,or=lg.h===fav?lg.ar:lg.hr;if(or<=8){pr+=.03;why.push('Letdown spot after beating No. '+or+' '+team(o).abbr)}}
    const ng=nextGameOf(fav);if(ng){const o=ng.h===fav?ng.a:ng.h,or=rankOf(o,p);if(or<=6){pr+=.02;why.push('Lookahead: No. '+or+' '+team(o).abbr+' is next')}}
    const ij=S.inj.find(j=>j.team===fav&&j.wk>0&&j.side==='off');if(ij)why.push('Playing without '+ij.pos+' '+short(ij.name));
    const ds=streak(dog);if(ds.w&&ds.n>=3)why.push(team(dog).name+' has won '+ds.n+' straight');
    const fs=streak(fav);if(!fs.w&&fs.n>=1&&fs.n<5&&lg)why.push(team(fav).name+' is coming off a loss');
    if(!why.length)why.push(Math.abs(m)<7?'Closer on paper than the ranking says':'Weird things happen on Saturdays');
    if(pr>=.18)out.push({g,fav,dog,fr,pr:Math.min(.49,pr),why,m});
  }
  return out.sort((a,b)=>b.pr*(30-b.fr)-a.pr*(30-a.fr)).slice(0,5);
}
function gameOfWeek(){
  const p=poll();let best=null;
  for(const g of S.games){
    if(g.wk!==S.week||g.done)continue;
    const hr=rankOf(g.h,p),ar=rankOf(g.a,p);
    let s=(hr<=PN?(PN+1)-hr:0)+(ar<=PN?(PN+1)-ar:0)+(g.conf?3:0)+(rec(g.h).l===0&&rec(g.a).l===0&&S.week>2?8:0)+(g.tag?12:0);
    if(hr>PN||ar>PN)s*=.6;
    if(!best||s>best.s)best={g,s,hr,ar};
  }
  return best;
}

function spreadText(g){
  let m=Math.round(spreadMargin(g)*2)/2;
  if(Math.abs(m)<0.5)return 'Pick em';
  return (m>0?team(g.h).abbr:team(g.a).abbr)+' -'+Math.abs(m).toFixed(1);
}

/* ---------- season flow ---------- */
function userGame(w){return S.games.find(g=>g.wk===w&&!g.done&&(g.h===S.userId||g.a===S.userId))}
function weekLabel(w){return w<12?'Week '+(w+1):['Championship Week','CFP First Round','CFP Quarterfinals','CFP Semifinals','National Championship'][w-12]||'Postseason'}
function startSeason(){
  try{applyExpansion()}catch(e){console.error(e)}
  S.meritPoll=true;
  S.teams.forEach(t=>{t.cc=false;t.pr={o:0,d:0}});S.prV1=true;applyPendingTpl();if(S.confs){CONFS=S.confs;DIVS=S.divs||null}patchLeague();patchRivals();syncRivals();try{freshRivals()}catch(e){}
  S.games=buildSchedule();tagRivals(); S.week=0; S.focus='bal'; S.post={}; S.champs={conf:[],natl:null};
  S.stars.forEach(s=>s.s=blankStat(s.pos));
  S.lastRecap=null; S.game=null; G=null; S.tab='week'; S.view='hub';
  patchLeague();S.inj=[];S.teams.forEach(t=>{t.star.yds=0;t.star.td=0});
  const r=rankOf(S.userId);
  S.ad.goal=r<=4?11:r<=8?10:r<=12?9:r<=18?8:r<=24?7:5;
  S.preRank=poll();S.news={pre:preNews()};try{expansionNews()}catch(e){}S.lgWeek=null;S.carousel=[];S.jobNews=null;S.offers=[];S.move=null;S.pb=null;S.podSel=null;S.bb=null;
  try{S.pod=null;podWeek()}catch(e){}
}
function advance(){advanceCore();try{podWeek()}catch(e){}}
function advanceCore(){
  const prev=poll();tagRivals();
  for(const g of S.games)if(g.wk===S.week)stampGame(g);
  for(const g of S.games)if(g.wk===S.week&&!g.done)simGame(g);
  updatePower(S.week);weekly(S.week,prev);try{pollStamp(S.week)}catch(e){}try{newProgWeek(S.week)}catch(e){}try{clsSeed()}catch(e){}try{if(S.week<12)recWeek(S.week)}catch(e){}S.lgWeek=null;
  if(S.week<11){S.week++;return}
  if(S.week===11){makeCCG();S.week=12;return}
  if(S.week===12){crown();makePlayoff();S.week=13;S.selPending=true;return}
  if(S.week===13){makeQF();S.week=14;return}
  if(S.week===14){makeSF();S.week=15;return}
  if(S.week===15){makeFinal();S.week=16;return}
  endSeason();
}
function makeCCG(){
  const p=poll();
  for(let c=0;c<4;c++){
    const srt=arr=>confOrder(arr,p);
    let ids=srt(S.teams.filter(t=>t.conf===c).map(t=>t.id));
    if(S.teams.every(t=>t.div!=null)){const d0=srt(ids.filter(id=>team(id).div===0)),d1=srt(ids.filter(id=>team(id).div===1));if(d0.length&&d1.length)ids=srt([d0[0],d1[0]])}
    S.games.push({wk:12,h:ids[0],a:ids[1],conf:false,neutral:true,done:false,tag:CONFS[c]+' Championship',ccg:c});
  }
}
function crown(){
  for(const g of S.games)if(g.wk===12&&g.done){const w=g.hs>g.as?g.h:g.a;team(w).cc=true;S.champs.conf[g.ccg]=w;if(team(w).hist)team(w).hist.ct++}
}
function winnerOf(g){return g.hs>g.as?g.h:g.a}
function endSeason(){
  const u=S.userId,r=rec(u),parts=[];
  const fin=S.games.find(g=>g.final);
  S.champs.natl=fin?winnerOf(fin):null;
  if(fin&&team(S.champs.natl).hist){team(S.champs.natl).hist.natl++;team(S.champs.natl).hist.last=yearOf(S.season)}
  for(const t of S.teams)if(t.hist){const rr=rec(t.id);t.hist.w+=rr.w;t.hist.l+=rr.l}
  let d=(r.w-S.ad.goal)*4, title=false;
  if(U().cc){parts.push('Won the '+CONFS[U().conf]);d+=8}
  else{const c=S.games.find(g=>g.wk===12&&(g.h===u||g.a===u));if(c)parts.push('Lost the '+CONFS[U().conf]+' title game')}
  const inF=S.post&&S.post.seeds&&S.post.seeds.includes(u),pos=S.games.filter(g=>g.po&&(g.h===u||g.a===u)).sort((a,b)=>a.wk-b.wk);
  if(inF){const sdn=S.post.seeds.indexOf(u)+1,last=pos[pos.length-1];d+=8;
    if(S.champs.natl===u){parts.push('Won the National Championship as the No. '+sdn+' seed');d+=15;title=true}
    else if(last){parts.push(last.final?'Lost the National Championship':'Made the playoff as the No. '+sdn+' seed, lost in the '+({13:'first round',14:'quarterfinals',15:'semifinals'}[last.wk]||'playoff'));d+=Math.max(0,last.wk-13)*3}
  }
  const semi=inF;
  const bowl=S.games.find(g=>g.bowl&&(g.h===u||g.a===u));
  if(bowl)parts.push((winnerOf(bowl)===u?'Won the ':'Lost the ')+bowl.tag);
  if(!semi&&!bowl)parts.push('Missed the postseason');
  S.ad.conf=clamp(S.ad.conf+d,0,100);
  const aw=awards();if(aw.coy.mine)S.ad.conf=clamp(S.ad.conf+5,0,100);
  const fired=!title&&S.ad.conf<15;
  const finalRank=rankOf(u),hzl=heisman().filter(c=>!c.out).sort((a,b)=>b.sc-a.sc),hz=hzl[0]||heisman()[0];
  const hfin=hzl.slice(0,4).map(c=>({name:c.name,pos:c.pos,team:c.t.name,tid:c.t.id,yds:c.yds,td:c.td,mine:c.mine,rec:recStr(c.t.id)}));
  try{coachSeasonEnd()}catch(e){}
  const car=[];for(const t of S.teams){if(t.id===u)continue;if(t.coach.heat>=(coachRt(t)>=86?92:78)||(t.coach.interim&&R()<.6)){const nw=fullName(),nr=hireRt(t);car.push({t:t.id,old:t.coach.name,nw,r:recStr(t.id),ort:coachRt(t),rt:nr});t.coach={name:nw,heat:22,yrs:0,rt:nr,d:0};{const ni=newIdent(t);car[car.length-1].ident=IDENT[ni.k].n}}}
  S.carousel=car;
  try{staffSeasonEnd(r)}catch(e){}
  S.offers=fired?[]:jobOffers(r,title,car);S.move=null;
  if(S.offers.length){post(u,'Hearing '+team(S.offers[0]).name+' wants to talk to '+S.coach+'. Developing.','media');post(u,'Please do not leave us, Coach.')}
  try{signingDay()}catch(e){}
  recordSeason();if(hz){S.heisHist=S.heisHist||[];S.heisHist.unshift({s:S.season,name:hz.name,pos:hz.pos,team:hz.t.name})}
  S.summary={season:S.season,w:r.w,l:r.l,cw:r.cw,cl:r.cl,rank:finalRank,parts,fired,title,d,goal:S.ad.goal,natl:S.champs.natl,aw,heis:hz?{name:hz.name,team:hz.t.name,pos:hz.pos,yds:hz.yds,td:hz.td,mine:hz.mine}:null,hfin,car:car.length};
  if(aw.coy.mine)parts.push('Coach of the Year');
  try{bookSeason()}catch(e){}
  S.history.unshift({season:S.season,abbr:U().abbr,w:r.w,l:r.l,rank:finalRank,line:parts.join('. ')});
  S.recruit=S.recruit||'bal';
  S.view='summary';
}
function offseason(){
  recruitAll();
  for(const t of S.teams){if(!t.coach)continue;t.coach.heat=clamp(Math.round(t.coach.heat*.5+8+(t.prestige>=80?4:0)),0,90);if(t.coach.ring!=null&&S.season-t.coach.ring<=1)t.coach.heat=Math.min(t.coach.heat,10);t.coach.yrs++;t.coach.interim=false;if(t.star){t.star.yr++;if(t.star.yr>4||R()<.25)t.star=newStar()}}
  for(const t of S.teams)if(t._sd){t.off=clamp(Math.round(t.off+t._sd.o),40,99);t.def=clamp(Math.round(t.def+t._sd.d),40,99);t._sd=null}
  const u=U(),mySig=(S.signed&&S.signed.season===S.season?S.signed.mine:[]);
  if(S.recruit==='off')u.off=clamp(u.off+2,50,99);
  else if(S.recruit==='def')u.def=clamp(u.def+2,50,99);
  else{u.off=clamp(u.off+1,50,99);u.def=clamp(u.def+1,50,99)}
  S.stars=S.stars.map(s=>{
    if(s.yr>=4){const sg=mySig.find(x=>x.pos===s.pos);if(sg){mySig.splice(mySig.indexOf(sg),1);return {pos:s.pos,name:sg.name,yr:1,num:s.num,ovr:clamp(sg.ovr,60,95),s:blankStat(s.pos),recruit:sg.stars}}return {pos:s.pos,name:fullName(),yr:2,num:s.num,ovr:clamp(Math.round(u.prestige-6+rnd(-4,6)),60,95),s:blankStat(s.pos)}}
    return {...s,yr:s.yr+1,ovr:clamp(s.ovr+ri(2,6),60,99)};
  });
  try{portalApply()}catch(e){}
  try{const st=staff();for(const k of ['oc','dc']){if(!st[k]){const cs=(S.staffCands&&S.staffCands[k])||[mkCoord(k,70)];st[k]={...cs.sort((a,b)=>b.r-a.r)[0],yrs:0}}st[k].yrs++;st[k].r=clamp(st[k].r+(st[k].yrs<=4?ri(0,2):ri(-1,1)),55,92)}S.staffCands=null}catch(e){}
  S.morale=0;
  S.season++;
}

/* ---------- locker room: personalities and storylines ---------- */
const TRAITS={leader:{n:'Leader',d:'Holds the room together when things go sideways.'},clutch:{n:'Clutch',d:'Wants the ball with the game on the line.'},diva:{n:'Diva',d:'Elite talent. Wants the ball. Lets you know about it.'},grinder:{n:'Grinder',d:'First one in, last one out. Never says much.'},showman:{n:'Showman',d:'Lives for the big moment and the bigger celebration.'}};
function traitOf(s){if(!s.trait){const h=hashS(s.name+s.pos)>>>0,ks=s.pos==='WR'?['diva','showman','clutch','grinder','diva']:s.pos==='QB'?['leader','clutch','leader','showman','grinder']:['grinder','showman','leader','clutch','grinder'];s.trait=ks[h%ks.length]}return s.trait}
const lastN=n=>String(n).split(' ').slice(-1)[0],firstN=n=>String(n).split(' ')[0];
const NICKS={QB:['The Gunslinger','Captain Comeback','{L} the Surgeon','Air {L}','The Professor'],RB:['The {T} Express','Bulldozer','{F} Freight','The Workhorse','Mr. Fourth Quarter'],WR:['Hands {L}','Burn Notice','{F} Flight','The Separator','Toast Maker']};
function lrPush(title,body,dm){
  const u=S.userId,k=String(S.week);S.news=S.news||{};S.news[k]=S.news[k]||[];S.news[k].push({tag:'Locker room',score:31,team:u,title,body});
  S.lr=S.lr&&S.lr.season===S.season?S.lr:{season:S.season,log:[],done:{}};S.lr.log.unshift({wk:S.week,title});if(S.lr.log.length>14)S.lr.log.length=14;
  if(dm)S.morale=clamp((S.morale||0)+dm,-2,2);
}
function storyAfter(g){
  const u=S.userId;if(!S.stars||!S.stars.length)return;
  S.lr=S.lr&&S.lr.season===S.season?S.lr:{season:S.season,log:[],done:{}};const L=S.lr,D=L.done;
  const my=g.h===u?g.hs:g.as,th=g.h===u?g.as:g.hs,win=my>th,opp=team(g.h===u?g.a:g.h),cn=S.coach?'Coach '+lastN(S.coach):'Coach',ab=U().abbr;
  S.snap=S.snap&&S.snap.season===S.season?S.snap:{season:S.season,v:{}};
  const dl={};for(const s of S.stars){const p=S.snap.v[s.name]||{},x={};for(const k in s.s)x[k]=(s.s[k]||0)-(p[k]||0);dl[s.name]=x;S.snap.v[s.name]={...s.s};traitOf(s)}
  const by=t=>S.stars.find(s=>s.trait===t),leader=by('leader')||S.stars[0];let told=0;
  // big game nickname
  for(const s of S.stars){if(told||s.nick)continue;const x=dl[s.name];
    const big=s.pos==='QB'?(x.yds>=330||x.td>=4):s.pos==='RB'?(x.yds>=165||x.td>=3):(x.yds>=145||x.td>=2);
    if(big&&win){const nk=pick(NICKS[s.pos]).replace('{L}',lastN(s.name)).replace('{F}',firstN(s.name)).replace('{T}',U().name.split(' ')[0]);s.nick=nk;
      lrPush('They are calling '+s.name+' "'+nk+'" now','After '+(x.yds||0)+' yards and '+(x.td||0)+' scores against '+opp.name+', the student section had a new name for the '+s.pos+' before the band finished the fight song. It stuck.',1);
      post(u,s.name.split(' ')[0]+' is HIM. "'+nk+'" is the only acceptable name from now on','fan');told=1}}
  // showman celebration penalty
  const sh=by('showman');if(!told&&sh&&win&&(dl[sh.name].td||0)>0&&!D.celeb&&R()<.45){D.celeb=1;told=1;
    lrPush(sh.name+' draws a flag for the celebration','Fifteen yards on the kickoff after '+lastN(sh.name)+' broke out a full routine in the end zone. '+cn+' had words on the sideline. Then he laughed about it in the locker room.',0);
    post(u,'15 yards well spent. '+lastN(sh.name)+' ate that celebration up','fan')}
  // losing streak: players only meeting
  const st=streak(u);
  if(!told&&!win&&!st.w&&st.n>=2&&!D.meet){D.meet=1;told=1;
    lrPush('Players-only meeting after '+st.n+' straight losses',leader.name+' called it. No coaches, no phones, about an hour. "We are not who we have been the last '+st.n+' weeks," '+lastN(leader.name)+' said. "That ends now."',1);
    post(u,'Hearing '+lastN(leader.name)+' called a players-only meeting. Good. Somebody had to','media')}
  // diva cryptic post after quiet game in a loss
  const dv=by('diva');if(!told&&dv&&!win&&(dl[dv.name].rec||dl[dv.name].car||0)<=4&&(D.diva||0)<2&&R()<.6){D.diva=(D.diva||0)+1;told=1;
    lrPush(dv.name+' posts something cryptic',lastN(dv.name)+' had '+(dl[dv.name].rec||dl[dv.name].car||0)+' touches against '+opp.name+'. An hour later: a black screen and "they know what I can do." '+(leader!==dv?lastN(leader.name)+' says it is handled in house.':'The staff says it is handled in house.'),leader!==dv?0:-1);
    if(leader===dv)S.morale=clamp((S.morale||0)-1,-2,2);
    post(u,'Uh oh '+lastN(dv.name)+' is posting again. Feed the man the ball','fan')}
  // grinder after a loss
  const gr=by('grinder');if(!told&&gr&&!win&&!D.grind&&R()<.5){D.grind=1;told=1;
    lrPush(gr.name+' was back in the building at 6 a.m.','Sunday after the '+opp.name+' loss, the lights in the film room were already on. '+lastN(gr.name)+' does not post about it. Teammates do.',0)}
  // clutch: close win
  const cl=by('clutch');if(!told&&cl&&win&&my-th<=7&&!D.clutch){D.clutch=1;told=1;
    lrPush(cl.name+' wanted the ball and got it','One score game, fourth quarter, and '+lastN(cl.name)+' was the guy waving for it. '+ab+' hangs on against '+opp.name+'.',0)}
  // walk on scholarship around week 6
  if(!D.walk&&S.week>=5&&S.week<=7&&R()<.6){D.walk=1;const w=fullName(),pos=pick(['LB','S','TE','OL','DL','K']);
    lrPush(cn+' puts walk-on '+w+' on scholarship','Team meeting, '+cn+' reads off the special teams grades, gets to '+w+', and tells him tuition is covered. The '+pos+' did not make it to the end of the sentence before the pile started.',1);
    post(u,'The walk-on getting put on scholarship video has me crying in the Chick-fil-A drive thru','fan')}
  if(!told&&R()<.4)S.morale=clamp((S.morale||0)+(win?1:-1),-2,2);
  if(!win&&th-my>=21)S.morale=clamp((S.morale||0)-1,-2,2);
}
function moraleTxt(){const m=S.morale||0;return ['Fractured','Tense','Steady','Locked in','Rolling'][m+2]}
function lockerCard(){
  const L=S.lr&&S.lr.season===S.season?S.lr.log:[],m=S.morale||0;
  return '<section class="card"><span class="eyebrow">Locker room</span><div class="spread"><h3>Morale: '+moraleTxt()+'</h3><span class="chip">'+(m>0?'+':'')+m+'</span></div><div class="mbar"><i style="left:'+((m+2)/4*100)+'%"></i></div>'+
    S.stars.map(s=>{const t=TRAITS[traitOf(s)];return '<div class="star"><div style="min-width:0"><b>'+esc(s.name)+'</b>'+(s.nick?' <span class="amber">"'+esc(s.nick)+'"</span>':'')+'<br><span class="muted" style="font-size:12.5px">'+s.pos+' · '+t.n+'. '+t.d+'</span></div></div>'}).join('')+
    (L.length?'<p class="eyebrow" style="margin-top:10px">This season</p>'+L.slice(0,6).map(x=>'<p style="font-size:13px;margin:3px 0"><span class="muted">'+weekLabel(x.wk)+'</span> · '+esc(x.title)+'</p>').join(''):'<p class="muted" style="font-size:13px">Quiet so far. Stories show up here as the season goes.</p>')+'</section>';
}
/* ---------- user result bookkeeping ---------- */
function afterUserGame(g){
  const u=S.userId,my=g.h===u?g.hs:g.as,th=g.h===u?g.as:g.hs,opp=g.h===u?g.a:g.h,win=my>th;
  const p=poll(),ur=rankOf(u,p),or=rankOf(opp,p);
  let d=win?3+(or<ur?4:0)+(g.wk>=12?3:0):-4-(or>ur+6?5:0)+(g.po?3:0);
  S.ad.conf=clamp(S.ad.conf+d,0,100);
  if(S.pb&&S.pb.wk===g.wk&&S.pb.bold){const x=win?3:-3;d+=x;S.ad.conf=clamp(S.ad.conf+x,0,100)}
  S.lastRecap={win,my,th,opp,wk:g.wk,tag:g.tag||'',ot:!!g.ot,home:g.h===u,d};
  try{feedResult(g)}catch(e){}
  try{storyAfter(g)}catch(e){}
}
function simStars(my){
  const st={qb:blankStat('QB'),rb:blankStat('RB'),wr:blankStat('WR')},tds=Math.floor(my/7);
  st.qb.att=ri(24,40);st.qb.cmp=Math.round(st.qb.att*rnd(.55,.72));st.qb.yds=Math.round(st.qb.cmp*rnd(10,14));
  st.qb.td=clamp(Math.round(tds*rnd(.4,.7)),0,6);st.qb.int=R()<.35?1:R()<.1?2:0;
  st.rb.car=ri(14,24);st.rb.yds=Math.round(st.rb.car*rnd(3.4,6.2));st.rb.td=clamp(tds-st.qb.td,0,4);
  st.wr.rec=ri(3,9);st.wr.yds=Math.round(st.wr.rec*rnd(10,17));st.wr.td=Math.min(st.qb.td,R()<.5?1:R()<.2?2:0);
  return st;
}
function addStars(st){
  for(const s of S.stars){if(userInj(s.pos))continue;const src=st[s.pos.toLowerCase()];for(const k in src)s.s[k]=(s.s[k]||0)+src[k]}
}

/* =================== GAME ENGINE =================== */
function genRoster(isUser,tid){
  const r={},used=new Set();
  if(isUser){
    const m={QB:'QB',RB:'RB',WR:'X'};
    for(const s of S.stars){const j=userInj(s.pos);r[m[s.pos]]=j?{num:j.bnum,name:j.backup}:{num:s.num,name:short(s.name)};used.add(r[m[s.pos]].num)}
  }
  const T=!isUser&&tid!=null?team(tid):null;
  if(T&&tid!==S.userId){
    /* AI teams: the saved star and any permanent named players (team.named) keep their names every game */
    if(T.star){const sl={QB:'QB',RB:'RB',WR:'X'}[T.star.pos];if(sl){r[sl]={num:T.star.num||ri(NUMR[sl][0],NUMR[sl][1]),name:short(T.star.name)};used.add(r[sl].num)}}
    for(const n of T.named||[]){const sl=namedSlot(n.pos,r);if(!sl)continue;if(!n.num){let k,i=0;const [a,b]=NUMR[sl];do{k=ri(a,b)}while(used.has(k)&&i++<40);n.num=k}r[sl]={num:n.num,name:short(n.name)};used.add(n.num)}
  }
  for(const s in NUMR){if(r[s])continue;let n,i=0;const [a,b]=NUMR[s];do{n=ri(a,b)}while(used.has(n)&&i++<40);used.add(n);r[s]={num:n,name:short(fullName())}}
  return r;
}
const NAMED_SLOTS={QB:['QB'],RB:['RB','FB'],WR:['X','Z','S','S2'],TE:['TE'],OL:['LT','LG','C','RG','RT'],K:['K'],DE:['DE1','DE2'],DT:['DT1','DT2'],DL:['DE1','DT1','DT2','DE2'],LB:['LB2','LB1','LB3'],CB:['CB1','CB2'],S:['FS','SS'],DB:['CB1','CB2','FS','SS']};
function namedSlot(pos,taken){return (NAMED_SLOTS[pos]||[]).find(sl=>!taken[sl])||null}
function homeSide(){if(!G)return 'u';const g=S.games[G.gid];return g&&g.h===GU()?'u':'c'}
function startGame(g){
  const uHome=g.h===S.userId,opp=uHome?g.a:g.h,qlen=S.qlen||300,p=poll();
  S.stars.forEach(s=>{if(!s.num)s.num=s.pos==='RB'?ri(20,39):ri(1,19)});
  const m=spreadMargin(g);
  S.game={gid:S.games.indexOf(g),opp,uHome,neutral:!!g.neutral,su:0,sc:0,q:1,qlen,clock:qlen,poss:'u',ball:25,bx:MID,down:1,togo:10,
    phase:'coin',coinWon:R()<.5,log:[],calls:[],tempo:'normal',kickFirst:'c',ot:0,otStep:0,otFirst:'u',possN:0,last:null,
    box:{u:{yds:0,pass:0,rush:0,fd:0,to:0},c:{yds:0,pass:0,rush:0,fd:0,to:0}},
    st:{qb:blankStat('QB'),rb:blankStat('RB'),wr:blankStat('WR')},
    ros:{u:genRoster(true),c:genRoster(false,opp)},line:uHome?m:-m,rk:{u:rankOf(S.userId,p),c:rankOf(opp,p)}};
  try{preSimWeek(S.games.indexOf(g))}catch(e){}
  G=S.game;patchG();G.intro={t:0,o:(!g.neutral&&bannerList(g.h).length)?3.2:0};S.view='game';SC.reset=true;
  log('Captains meet at midfield for the toss.','k');
}
function patchG(){
  if(!G)return;
  const d={to:{u:3,c:3},mom:0,adj:null,lastRun:0,flash:null,drive:{n:0,y:0,t0:G.qlen||900,q0:1},qlen:900,bx:MID,sel:null,dsel:null,pend:null,dpend:null,dlook:null,sug:null,meter:null,recap:null,line:0,rk:{u:30,c:30}};
  for(const k in d)if(G[k]===undefined)G[k]=d[k];
  if(!G.ros)G.ros={u:genRoster(true),c:genRoster(false)};
  if(G.ros&&!G.ros.u.K){G.ros.u.K={num:ri(30,49),name:short(fullName())};G.ros.c.K={num:ri(30,49),name:short(fullName())}}
  for(const k of ['sel','pend'])if(G[k]&&!PB[G[k]])G[k]=null;
  if(G.dsel&&!DC[G.dsel])G.dsel=null;
  if((G.phase==='off'||G.phase==='def')&&!G.dpend&&!G.pend&&!G.sel){prep()}
}
const other=s=>s==='u'?'c':'u';
const abbrOf=s=>s==='u'?team(GU()).abbr:team(G.opp).abbr;
const teamOf=s=>s==='u'?team(GU()):team(G.opp);
const nmS=(side,slot)=>(G.ros[side][slot]||{name:slot}).name;
function tag(){if(G.ot)return 'OT'+(G.ot>1?G.ot:'');return 'Q'+G.q+' '+fmtClock(G.clock)}
function fmtClock(s){s=Math.max(0,Math.round(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function log(t,k=''){G.log.unshift({t,k,g:tag()});if(G.log.length>80)G.log.length=80}
function tick(t){if(!G.ot)G.clock=Math.max(0,G.clock-t);G.lastRun=t>9?t-6:0}
function newDrive(){G.drive={n:0,y:0,t0:G.clock,q0:G.q}}
function mo(side,amt){G.mom=clamp((G.mom||0)+(side==='u'?amt:-amt),-100,100)}
function flash(txt,side){G.flash={txt,side}}
function clockBase(){return 15+(G.qlen||300)/50}
function rat(side){
  const id=side==='u'?GU():G.opp;
  const home=!G.neutral&&((side==='u')===G.uHome)?1:0;
  const m=(G.mom||0)/100*2*(side==='u'?1:-1);
  const lock=side==='u'&&G.adj==='lock'?3:0;
  const rb=rivBoost(S.games[G.gid],id),EV=envG(),road=!G.neutral&&side!==homeSide(),intim=road&&EV.theme?(EV.night?2.5:1.8):0;
  return {off:rOff(id)+home+m+rb-intim,def:rDef(id)+home+m+lock+rb-intim*.3};
}
function effE(side,isRun){
  const adj=side==='u'&&((G.adj==='air'&&!isRun)||(G.adj==='ground'&&isRun))?3:0;
  return (rat(side).off+adj-rat(other(side)).def)/10;
}
function runShare(side){
  const c=G.calls.filter(x=>x.side===side).slice(-10);
  if(c.length<3)return .5;
  return c.filter(x=>x.call==='run').length/c.length;
}
function autoSide(side){return side==='c'||!!G.watch}
function aggrOf(side){const n=side==='c'?((team(G.opp).coach||{}).name||'x'):(G.watch&&!G.mine?((team(GU()).coach||{}).name||'y'):S.coach||'z');return .25+(hashS(n+':aggr')%1000)/1000*.55}
/* seconds left in the game, and how urgent things are for this side */
function sitOf(side){
  const me=side==='u'?G.su:G.sc,th=side==='u'?G.sc:G.su,diff=me-th;
  const secs=G.ot?9999:G.q===4?G.clock:G.q===3?G.clock+G.qlen:9999;
  const need=diff>=0?0:diff>=-8?1:diff>=-16?2:3;
  const per=clockBase()*6+20;
  const urgent=!G.ot&&need>0&&secs<need*per*1.25+40;
  return {me,th,diff,secs,need,urgent,to:G.to[side],toGoal:100-G.ball,dist:100-G.ball+17};
}
function twoMin(side){
  if(!G||G.ot||G.poss!==side)return false;const me=side==='u'?G.su:G.sc,th=side==='u'?G.sc:G.su,diff=me-th,T2=Math.min(120,(G.qlen||300)*.45),toGoal=100-G.ball;
  if(G.q===2)return G.clock<=T2&&(toGoal<=70||G.to[side]>=2||G.clock>=75);
  if(G.q===4)return diff<=0&&G.clock<=T2+(diff<=-9?60:0);
  return false;
}
function tempoOf(side){
  if(side==='u'&&!G.watch)return G.tempo;
  const X=sitOf(side);
  if(X.urgent||twoMin(side))return 'hurry';
  if(!G.ot&&G.q===2&&G.clock<G.qlen*.3&&G.poss===side)return 'hurry';
  if(!G.ot&&G.q>=4&&X.diff>0&&G.clock<G.qlen*.7)return 'milk';
  const ik=identOf(side==='u'?GU():G.opp).k;
  if(ik==='clock'&&X.diff>-9)return 'milk';
  if((ik==='air'||ik==='shootout')&&!(G.q>=4&&X.diff>0)&&G.possN%2===0)return 'hurry';
  return 'normal';
}
/* kick now: in range with the clock about out, and points help */
function kickNow(side){
  if(G.ot)return false;const X=sitOf(side);if(X.dist>52)return false;
  const window=Math.max(6,clockBase()*1.15+4);
  if(G.q===2&&G.clock<=window&&G.poss===side)return true;
  if(G.q===4&&X.diff<=0&&X.diff>=-3&&G.clock<=window)return true;
  return false;
}
function playClock(side,r){
  if(r.kind==='inc'||r.kind==='spike')return 5;
  const late=(G.q===2||G.q===4)&&G.clock<=120;
  if(r.oob&&late)return 7;
  const b=clockBase(),tp=tempoOf(side);
  return Math.round(tp==='hurry'?b*.55:tp==='milk'?b*1.5:b);
}

/* ---- geometry ---- */
function spots(fk,bx){
  const f=FORMS[fk],o={};
  OLN.forEach((n,i)=>o[n]=[bx+OLX[i],i===2?-.75:-.95]);
  o.QB=[bx,f.qb];
  for(const k in f.sl){const v=f.sl[k];o[k]=v==='L'?[Math.max(3.5,bx-17),-.95]:v==='R'?[Math.min(49.8,bx+17),-.95]:[clamp(bx+v[0],2.5,50.8),v[1]]}
  return o;
}
function spotsFor(pk,bx){const o=spots(PB[pk].f,bx);if(pk==='jet'&&o.S)o.S=[bx-5.5,-1.1];return o}
function samp(p,t){
  if(!p||!p.length)return [0,0];
  if(t<=p[0][0])return [p[0][1],p[0][2]];
  for(let i=1;i<p.length;i++)if(t<=p[i][0]){const a=p[i-1],b=p[i],k=(t-a[0])/((b[0]-a[0])||1);return [a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k]}
  const l=p[p.length-1];return [l[1],l[2]];
}
function routePath(st,rk,ins,spd){
  const R0=RT[rk],d0=R0.delay||0;let t=d0+.12,px=st[0],py=st[1],tb=null;
  const pts=[[0,px,py]];if(d0)pts.push([d0,px,py]);
  const way=R0.w.map(([dx,dy])=>[clamp(st[0]+dx*ins,.7,52.6),Math.min(109.4,st[1]+dy)]);
  if(!R0.stop){const n=way.length,a=n>1?way[n-2]:st,b=way[n-1],Ln=Math.hypot(b[0]-a[0],b[1]-a[1])||1;way.push([clamp(b[0]+(b[0]-a[0])/Ln*10,.7,52.6),Math.min(109.4,b[1]+(b[1]-a[1])/Ln*10)])}
  for(const [nx,ny] of way){t+=Math.hypot(nx-px,ny-py)/spd;pts.push([t,nx,ny]);if(tb==null)tb=t;px=nx;py=ny}
  pts.push([t+6,px,py]);
  return {pts,tb};
}
function dspots(dc,bx,osp){
  const xs=['X','Z','S','S2','TE','RB','FB'].filter(k=>osp[k]&&osp[k][1]>-2).map(k=>osp[k][0]).sort((a,b)=>a-b);
  const Lx=xs.length?xs[0]:bx-15,Rx=xs.length?xs[xs.length-1]:bx+15;
  const slotL=xs.find(x=>x<bx-7&&x>Lx),slotR=[...xs].reverse().find(x=>x>bx+7&&x<Rx);
  const o={DE1:[bx-5.6,1.1],DT1:[bx-1.4,1.1],DT2:[bx+1.4,1.1],DE2:[bx+5.6,1.1],LB1:[slotL!=null?slotL:bx-4.5,slotL!=null?5:4.6],LB2:[bx,4.9],LB3:[slotR!=null?slotR:bx+4.5,slotR!=null?5:4.6],CB1:[Lx,7],CB2:[Rx,7],FS:[bx-9,13],SS:[bx+9,13]};
  const set=(k,x,y)=>o[k]=[x==null?o[k][0]:x,y];
  switch(dc){
   case 'c2':set('CB1',Lx+.8,3.5);set('CB2',Rx-.8,3.5);set('FS',bx-11,14);set('SS',bx+11,14);break;
   case 'c3':set('CB1',null,8);set('CB2',null,8);set('FS',bx,15);set('SS',bx+6,7.5);break;
   case 'c4':set('CB1',null,8.5);set('CB2',null,8.5);set('FS',bx-7,11);set('SS',bx+7,11);break;
   case 'c1':set('CB1',null,1.8);set('CB2',null,1.8);set('FS',bx,15);set('SS',bx+5,6.5);set('LB2',bx,3.5);break;
   case 'c0':set('CB1',null,1.6);set('CB2',null,1.6);set('FS',bx-3,5.5);set('SS',bx+3,5.5);set('LB1',bx-2.6,2.2);set('LB2',bx+.5,2.2);break;
   case 'fire':set('LB1',bx-3,2.6);set('LB2',bx,3.2);set('SS',bx+6,7);set('FS',bx,14);break;
   case 'goal':set('LB1',bx-3.5,3);set('LB2',bx,3);set('LB3',bx+3.5,3);set('SS',bx-6,4.2);set('FS',bx+6,4.2);set('CB1',null,4);set('CB2',null,4);break;
   case 'c2m':set('CB1',null,1.8);set('CB2',null,1.8);set('FS',bx-10,14.5);set('SS',bx+10,14.5);set('LB2',bx,4.2);break;
   case 'tampa':set('CB1',Lx+.8,4);set('CB2',Rx-.8,4);set('FS',bx-11,14);set('SS',bx+11,14);set('LB2',bx,7.5);break;
   case 'prev':set('LB1',bx-8,10);set('LB2',bx,9);set('LB3',bx+8,10);set('CB1',null,14);set('CB2',null,14);set('FS',bx-8,21);set('SS',bx+8,21);set('DE2',bx+3,6);break;
  }
  for(const k in o){o[k][0]=clamp(o[k][0],1,52.3)}
  return o;
}
function rushersOf(dc){
  const n=DC[dc].rush,b=['DE1','DT1','DT2','DE2'];
  if(n===3)return ['DE1','DT1','DT2'];
  if(n===5)return dc==='fire'?[...b,'LB1']:[...b,'LB2'];
  if(n===6)return [...b,'LB1','LB2'];
  return b;
}

/* ---- play building ---- */
function buildPlay(side,pk,dc){
  const pl=PB[pk],los=G.ball,bx=G.bx,sp=spotsFor(pk,bx);
  const P={side,pk,dc,los,bx,form:pl.f,isRun:pl.cat==='run',paths:{},recv:[],spots:sp};
  const ps=R()<.5?-1:1;P.ps=ps;
  for(const n of OLN){const [x,dy]=sp[n];P.paths[n]=P.isRun?[[0,x,los+dy],[.5,x+ps*.4,los+dy+1],[3,x+ps*.8,los+dy+1.6]]:[[0,x,los+dy],[.45,x,los+dy-1.1],[4,x,los+dy-1.5]]}
  if(P.isRun)buildRun(P);else buildPass(P);
  assignD(P);
  return P;
}
function runRoll(side,pk,dc){
  const pl=PB[pk],p=pl.run,e=effE(side,true);
  let c=p.c,mean=p.m+e*.7+DC[dc].run+(pl.vs[dc]||0),sd=p.sd,big=p.big,loss=p.loss;
  if(pk==='option'&&R()<.45){c='QB';mean+=.5;sd+=1}
  if(p.sy&&G.togo<=2)mean+=1.2;
  if(dc==='goal')big*=.5;if(dc==='c0')big+=.05;if(dc==='prev')big+=.03;
  if(R()<.011+(dc==='goal'||dc==='c0'?.006:0))return {kind:'fum',yds:ri(-2,3),c,scoop:R()<.09};
  let y;
  if(pk==='sneak')y=G.togo<=2?(R()<(dc==='goal'?.66:.82)?Math.max(G.togo,ri(1,2)):ri(-1,0)):clamp(Math.round(mean+gauss()*sd),-1,4);
  else{y=Math.round(mean+gauss()*sd);if(R()<Math.max(.01,big))y+=ri(8,38);if(R()<loss)y=-ri(1,4)}
  y=Math.max(y,-7);
  return {kind:'run',yds:y,c,oob:!!p.edge&&y>3&&R()<((G&&!G.ot&&(G.q===2||G.q===4)&&G.clock<=150)?.45:.12)};
}
function buildRun(P){
  const pl=PB[P.pk],p=pl.run,los=P.los,bx=P.bx,sp=P.spots,f=FORMS[P.form];
  const r=runRoll(P.side,P.pk,P.dc);P.run=r;
  let ps=P.ps;if(P.pk==='jet')ps=P.ps=sp.S[0]<bx?1:-1;
  const uc=f.qb>-2,A=k=>[sp[k][0],los+sp[k][1]];
  for(const k of ['X','Z','S','S2','TE'])if(sp[k]&&k!==r.c){const [x,y]=A(k);P.paths[k]=k==='TE'?[[0,x,y],[.6,x,y+1.2],[4,x,y+1.6]]:[[0,x,y],[1,x,y+4],[4,x+(bx-x)*.1,y+5.5]]}
  const yEnd=Math.min(104,los+r.yds);P.td=los+r.yds>=100;
  let hole=[clamp(bx+ps*p.hole,2,51.3),los+.6],pre,th;
  if(P.pk==='sneak'){
    th=0;const st=A('QB');pre=[[0,st[0],st[1]],[.35,bx,los-.3]];hole=[bx,los+.4];
  }else if(P.pk==='jet'){
    const st=A('S'),q=A('QB');th=.5;
    P.paths.QB=[[0,q[0],q[1]],[.45,bx,los-2.6],[1.2,bx-ps*.6,los-3.2],[6,bx-ps*.6,los-3.2]];
    pre=[[0,st[0],st[1]],[th,bx-ps*.3,los-2.3]];
    if(sp.RB){const rb=A('RB');P.paths.RB=[[0,rb[0],rb[1]],[1,rb[0]-ps*3,los-2],[6,rb[0]-ps*4,los-1]]}
  }else{
    const q=A('QB'),rb=A('RB'),dl=p.delay?.95:0;
    th=(uc?.55:.45)+dl;
    const mesh=uc?[bx+ps*1.1,los-3.3]:[bx+ps*.5,los-4.2];
    P.paths.QB=uc?[[0,q[0],q[1]],[.4,bx+ps*.9,los-3.1],[1.2,bx-ps*.5,los-4],[6,bx-ps*.5,los-4]]:dl?[[0,q[0],q[1]],[.6,bx,los-6.4],[1.1,bx,los-5.6],[6,bx,los-5.6]]:[[0,q[0],q[1]],[.5,bx,los-4.8],[6,bx,los-5]];
    if(sp.FB){const fb=A('FB');P.paths.FB=[[0,fb[0],fb[1]],[th+.15,hole[0]-ps*.6,los-.6],[th+.8,hole[0]+ps*.4,los+2.2],[6,hole[0]+ps*.6,los+2.6]]}
    if(r.c==='QB'&&P.pk==='qbdraw'){
      th=1.15;pre=[[0,q[0],q[1]],[.6,bx,los-7.2],[1.15,bx+ps*.3,los-6.4]];hole=[clamp(bx+ps*1.2,2,51.3),los+.6];
      P.paths.RB=[[0,rb[0],rb[1]],[.5,bx+ps*1.8,los-4.4],[6,bx+ps*2,los-4.2]];
    }else if(r.c==='QB'){
      th=.5;pre=[[0,q[0],q[1]],[.5,bx,los-4.7]];hole=[clamp(bx-ps*5,2,51.3),los+.4];
      P.paths.RB=[[0,rb[0],rb[1]],[.5,bx+ps*.5,los-4.2],[1.2,bx+ps*2,los+.4],[6,bx+ps*2.2,los+.8]];
    }else{
      pre=[[0,rb[0],rb[1]]];if(p.fake)pre.push([.22,rb[0]-ps*1.3,rb[1]+.2]);if(dl)pre.push([dl,rb[0],rb[1]]);pre.push([th,mesh[0],mesh[1]]);
    }
  }
  const m=pre[pre.length-1],path=[...pre];let t=m[0];
  if(r.yds>0||P.pk==='sneak'){
    t+=Math.hypot(hole[0]-m[1],hole[1]-m[2])/7.2;if(P.pk!=='sneak'||r.yds>1)path.push([t,hole[0],hole[1]]);
    let ex=clamp(hole[0]+gauss()*2.2+(r.yds>8?ps*Math.min(6,r.yds*.12):0),1.5,51.8);
    if(r.oob)ex=hole[0]>MID?53.7:-.4;
    if(P.pk==='sneak')ex=bx+gauss()*.4;
    if(r.oob&&yEnd-hole[1]>3){const mx=hole[0]+(ex-hole[0])*.3,my=hole[1]+(yEnd-hole[1])*.72;t+=Math.max(.2,Math.hypot(mx-hole[0],my-hole[1])/8.3);path.push([t,mx,my]);t+=Math.max(.15,Math.hypot(ex-mx,yEnd-my)/8.3)}else t+=Math.max(.25,Math.hypot(ex-hole[0],yEnd-hole[1])/(P.pk==='sneak'?4:8.3));path.push([t,ex,yEnd]);
  }else{
    const ex=m[1]+(hole[0]-m[1])*.45;t+=Math.max(.35,Math.hypot(ex-m[1],yEnd-m[2])/6.5);path.push([t,ex,yEnd]);
  }
  P.cPath=path;P.carrier=r.c;P.th=th;P.endT=t;
}
function buildPass(P){
  const pl=PB[P.pk],los=P.los,bx=P.bx,sp=P.spots,dc=P.dc,e=effE(P.side,false),f=FORMS[P.form];
  const q=[sp.QB[0],los+sp.QB[1]],uc=f.qb>-2,drop=pl.drop;
  const qbp={
   quick:uc?[[0,q[0],q[1]],[.5,bx,los-4.2]]:[[0,q[0],q[1]],[.32,bx,los-5.8]],
   normal:uc?[[0,q[0],q[1]],[.9,bx,los-7]]:[[0,q[0],q[1]],[.55,bx,los-7.2]],
   deep:uc?[[0,q[0],q[1]],[1,bx,los-8.2]]:[[0,q[0],q[1]],[.75,bx,los-8.4]],
   pa:[[0,q[0],q[1]],[.45,bx+1.1,los-3.3],[1.2,bx+.2,los-7.6]],
   boot:[[0,q[0],q[1]],[.45,bx-1.1,los-3.3],[1.35,bx+6,los-6.6],[2.4,bx+9.5,los-5.2]],
   screen:uc?[[0,q[0],q[1]],[1.2,bx,los-8]]:[[0,q[0],q[1]],[.6,bx,los-7.5],[1.3,bx,los-9.5]]
  }[drop];
  const ql=qbp[qbp.length-1];qbp.push([9,ql[1],ql[2]]);P.paths.QB=qbp;
  for(const k of ['X','Z','S','S2','TE','RB','FB']){
    if(!sp[k])continue;const st=[sp[k][0],los+sp[k][1]],rk=pl.routes[k];
    if(!rk||!RT[rk]){
      if(k==='RB'||k==='FB'){const sd=st[0]<=bx?-1:1;P.paths[k]=(drop==='pa'||drop==='boot')?[[0,st[0],st[1]],[.45,bx-sd*1.2,los-3.4],[1.1,bx+sd*1.5,los-1.8],[9,bx+sd*1.5,los-1.6]]:[[0,st[0],st[1]],[.55,bx+sd*1.7,los-4.4],[9,bx+sd*1.9,los-4.6]]}
      else P.paths[k]=k==='TE'?[[0,st[0],st[1]],[.5,st[0],st[1]-.7],[9,st[0],st[1]-1]]:[[0,st[0],st[1]],[1,st[0],st[1]+3],[9,st[0],st[1]+3]];
      continue;
    }
    const back=k==='RB'||k==='FB',ins=back?(st[0]<=bx?1:-1):(st[0]<bx?1:-1);
    const rp=routePath(st,rk,ins,k==='TE'?6.7:back?7.2:7.9);P.paths[k]=rp.pts;
    const c=RT[rk].c;let o0=.44+COV[dc][c]+(RT[rk].od||0)+e*.028+gauss()*.09+(R()<.07?.3:0);
    if(drop==='pa'||drop==='boot'){if(runShare(P.side)>.5)o0+=.07;if(dc==='goal')o0+=.05}
    if(100-los<15&&(c==='deepI'||c==='deepO'))o0-=.08;
    P.recv.push({slot:k,rk,c,path:rp.pts,tb:rp.tb,o0});
  }
  P.tp=clamp(DC[dc].tp+e*.12+gauss()*.3+((drop==='pa'||drop==='boot')?.3:0)+(drop==='screen'?.5:0),1.25,5);
  P.ts=P.tp+.8;
}
function assignD(P){
  const dsp=dspots(P.dc,P.bx,P.spots);P.dsp=dsp;
  const rush=rushersOf(P.dc),roles={};rush.forEach(k=>roles[k]={m:'rush'});
  if(!P.isRun){
    const recs=[...P.recv].sort((a,b)=>P.spots[a.slot][0]-P.spots[b.slot][0]);
    if(recs.length){roles.CB1={m:'cover',r:recs[0].slot};if(recs.length>1)roles.CB2={m:'cover',r:recs[recs.length-1].slot}}
    for(const rc of recs.slice(1,-1)){let best=null;for(const k of ['LB1','LB3','SS','LB2','FS','DE2']){if(roles[k])continue;const d=Math.abs(dsp[k][0]-P.spots[rc.slot][0]);if(!best||d<best.d)best={k,d}}if(best)roles[best.k]={m:'cover',r:rc.slot}}
  }
  for(const k of DSLOTS)if(!roles[k])roles[k]={m:'zone'};
  P.roles=roles;P.sacker=rush.includes('DE1')&&R()<.4?'DE1':pick(rush);
  P.cover={};for(const k in roles)if(roles[k].m==='cover')P.cover[roles[k].r]=k;
}
function openAt(r,t){
  let o=r.o0;
  if(t<r.tb)o-=.24*(1-t/r.tb);
  else if(r.c==='deepI'||r.c==='deepO'||r.c==='cross')o+=Math.min(.02,(t-r.tb)*.02);
  else o-=Math.max(0,t-r.tb-.9)*.15;
  return o;
}
/* zone defenders (not the man assigned) close enough to contest a catch point */
function crowdAt(P,r,cp){
  let n=0;const los=P.los;
  for(const s of DSLOTS){const role=P.roles[s];if(!role||role.m==='rush')continue;if(role.m==='cover'&&role.r===r.slot)continue;
    const z=P.dsp[s];if(!z)continue;const deep=s==='FS'||s==='SS'?Math.max(z[1],12):s[0]==='C'?Math.max(z[1],9):Math.max(z[1],6.5);
    const zx=role.m==='cover'?z[0]:z[0],zy=Math.min(109,los+deep);const d=Math.hypot(zx-cp[0],zy-cp[1]);
    if(d<4.5)n+=1;else if(d<7.5)n+=.5}
  return Math.min(3,n);
}
function catchSkill(P,slot){
  const side=P.side,tid=side==='u'?GU():G.opp;let b=0;
  if(tid===S.userId&&!(G&&G.watch&&!G.mine)){const wr=S.stars.find(x=>x.pos==='WR'),qb=S.stars.find(x=>x.pos==='QB');if(slot==='X'&&wr)b+=((wr.ovr||70)-70)*.003;if(qb)b+=((qb.ovr||70)-70)*.002}
  else{const t=team(tid);if(t.star&&t.star.pos==='WR'&&slot==='X')b+=.05;if(t.star&&t.star.pos==='QB')b+=.03}
  return b;
}
function throwRes(P,i,t){
  const r=P.recv[i],qp=samp(P.paths.QB,t),pres=t>P.tp;
  let tc=t+.4,cp;
  for(let k=0;k<3;k++){cp=samp(r.path,tc);tc=t+.25+Math.hypot(cp[0]-qp[0],cp[1]-qp[1])/26}
  cp=samp(r.path,tc);
  const air=Math.round(cp[1]-P.los),o=(openAt(r,t)+openAt(r,tc))/2-(pres?.12:0);
  let pc,pi;const crowd=r.c==='hail'?0:crowdAt(P,r,cp),sk=catchSkill(P,r.slot);
  if(r.c==='hail'){pc=P.dc==='prev'?.08:.14;pi=.16}
  else{const WX=G?envG().weather:'clear';pc=clamp(.31+.9*o-Math.max(0,air-8)*.025-crowd*.19+sk+(r.c==='screen'?.15:0)-(WX==='rain'?.05:WX==='snow'?.08:0)-(WX==='wind'&&air>=15?.11:0),.03,.93);pi=(o<.4?(.4-o)*.3+.014:.012)+crowd*.03}
  const base={target:r.slot,i,t,tc,cx:cp[0],cy:cp[1],air,crowd};
  const roll=R();
  if(roll<pi){const big=R()<.14;let picker=P.cover[r.slot]||'FS';if(crowd>=1&&R()<.5){let bd=1e9;for(const s of DSLOTS){const ro=P.roles[s];if(!ro||ro.m==='rush')continue;const z=P.dsp[s];if(!z)continue;const d=Math.hypot(z[0]-cp[0],P.los+z[1]-cp[1]);if(d<bd){bd=d;picker=s}}}
    return {...base,kind:'int',ret:R()<.25?0:big?ri(25,65):ri(2,24),six:R()<.1,by:picker}}
  if(roll<pi+pc){
    const b={quick:2.6,flat:3.4,mid:2,cross:3.6,deepI:3,deepO:2.4,screen:5.5,hail:0}[r.c];
    let yac=Math.max(0,Math.round(b*(.3+o)+gauss()*2));if(R()<o*.08)yac+=ri(8,35);
    if(r.c==='screen'){const blitz=DC[P.dc]&&DC[P.dc].tp<2.4;yac=Math.max(0,-air)+Math.max(-2,Math.round(4.2*(.45+o)+(blitz?3:0)+gauss()*3));if(R()<.1+(blitz?.08:0))yac+=ri(10,40);if(R()<(blitz?.06:.13))yac=Math.max(0,-air)-ri(1,4)}
    if(P.los+air>=100)yac=0;
    const tot=Math.min(100-P.los,air+yac),ey=Math.min(104,P.los+tot+(P.los+tot>=100?3:0));
    {const late=G&&!G.ot&&(G.q===2||G.q===4)&&G.clock<=150,edge=cp[0]<12||cp[0]>41.3,po=edge?(late?.62:.04):(late?.06:0);
     if(P.los+tot<100&&R()<po){const t2=Math.min(100-P.los,air+Math.round(yac*.4)),ey2=Math.min(104,P.los+t2);return {...base,kind:'comp',yds:t2,ex:cp[0]<MID?-.4:53.7,ey:ey2,tough:crowd>=1.5,oob:true}}}
    return {...base,kind:'comp',yds:tot,ex:clamp(cp[0]+gauss()*2.5,1,52.3),ey,tough:crowd>=1.5};
  }
  return {...base,kind:'inc'};
}
function sackRes(P){const lost=R()<.05;return {kind:'sack',yds:-ri(4,9),lost,scoop:lost&&R()<.12,by:P.sacker}}
function scrRes(P,t){
  const e=effE(P.side,true);let m=3.4+e*.5+((P.dc==='c1'||P.dc==='c0')?2.5:0)+(P.dc==='prev'?2:0)-(t>P.tp?1.2:0);
  let y=Math.round(m+gauss()*3.6);if(R()<.06)y+=ri(10,35);y=Math.max(y,-3);
  return {kind:'scr',yds:y,oob:y>4&&R()<((G&&!G.ot&&(G.q===2||G.q===4)&&G.clock<=150)?.45:.15)};
}
/* each play's designed first read gets a bump, so the QB throws what the play is built for */
const PRI={screen:{s:'RB',b:11},bubble:{s:'S',b:8},tunnel:{s:'X',b:10},stick:{s:'TE',b:3},slants:{s:'X',b:2},mesh:{s:'S',b:3},curlflat:{s:'S',b:2.5},smash:{s:'S',b:2},sail:{s:'S',b:3},boot:{s:'TE',b:2},verts:{s:'S',b:2},pashot:{s:'X',b:2},dagger:{s:'X',b:3},wheel:{s:'RB',b:4},levels:{s:'X',b:2},ycross:{s:'TE',b:4},fade:{s:'X',b:1},shallow:{s:'S',b:3},sluggo:{s:'X',b:3},hitchseam:{s:'S',b:3}};
function autoThrow(P,noise){
  if(R()<clamp(.09-(P.tp-1.9)*.035,.012,.13))return {sack:1,t:P.ts};
  let best=null;
  for(let t=.45;t<P.ts-.05;t+=.15){
    const pres=t>P.tp;
    for(let i=0;i<P.recv.length;i++){
      const r=P.recv[i];if(t<(RT[r.rk].delay||0)+.3)continue;
      const cp=samp(r.path,t+.45),air=cp[1]-P.los,o=openAt(r,t+.2)-(pres?.12:0);
      const cw=r.c==='hail'?0:crowdAt(P,r,cp);let pc=clamp(.31+.9*o-Math.max(0,air-8)*.025-cw*.19,.03,.93),pi=(o<.4?(.4-o)*.3+.014:.012)+cw*.03;
      const yd=Math.max(air,0),pr=PRI[P.pk];let v=pc*(Math.min(yd,20)+4.5+(air+3>=G.togo?5:0))-pi*36-t*1.25+gauss()*noise;
      if(air>15)v-=(1-o)*8;
      if(pr&&pr.s===r.slot)v+=pr.b*(t<1.6?1:.5);
      if(r.rk==='go'&&!(pr&&pr.s===r.slot)&&air>18)v-=2.5;
      if((r.c==='deepO'||r.c==='deepI')&&air<14)v-=4.5;
      v+=pc*({quick:2.6,flat:3.4,mid:2,cross:3.6,deepI:3,deepO:2.4,screen:5.5}[r.c]||0)*(.3+o)*.8;
      if(air>=14&&!(pr&&pr.s===r.slot)&&v>0)v*=.8;
      {const hi={quick:1.05,normal:1.8,deep:2.4,screen:1.5,boot:2.1,pa:2.3}[PB[P.pk].drop]||1.8;if(t>hi)v-=(t-hi)*3.2}
      if(r.c==='hail')v=G.clock<=10&&(G.q===2||G.q===4)?30+gauss():-9;
      if(!best||v>best.v)best={i,t,v};
    }
  }
  if(!best)return {sack:1,t:P.ts};
  if(best.v<1.2)return R()<.5?{scr:1,t:Math.min(P.tp+.15,P.ts-.1)}:{away:1,t:Math.min(P.tp,P.ts-.15)};
  return best;
}
function resolveQuick(P,noise){
  if(P.isRun)return P.run;
  const a=autoThrow(P,noise);
  if(a.sack)return sackRes(P);
  if(a.scr)return scrRes(P,a.t);
  if(a.away)return {kind:'inc',away:1};
  return throwRes(P,a.i,a.t);
}
function gradeCall(pk,dc){
  const p=PB[pk];if(!p||!DC[dc])return 0;
  if(p.cat==='run')return DC[dc].run+(p.vs[dc]||0);
  const v=Object.values(p.routes).filter(r=>RT[r]).map(r=>COV[dc][RT[r].c]).sort((a,b)=>b-a);
  let g=(v[0]+(v[1]!=null?v[1]:v[0]))/2*10;
  if(DC[dc].tp<2.4)g+=(p.drop==='quick'||p.drop==='screen')?1:-1;
  return g;
}

/* ---- applying results ---- */
function applyResult(side,pk,dc,r){
  const opp=other(side),D=G.box[side],qb=nmS(side,'QB'),isU=side==='u';
  G.mom=(G.mom||0)*.93;G.recap=null;
  const cat=PB[pk]?PB[pk].cat:null;
  if(cat)G.calls.push({side,call:cat});
  G.drive.n++;
  const grade=cat&&dc?gradeCall(pk,dc):null;
  const setL=(t,cls='')=>{G.last={side,pk,dc,txt:t,cls,grade}};
  if(r.ex!=null)G.bx=clamp(r.ex,HASHL,HASHR);else if(r.kind!=='inc'&&r.kind!=='spike'&&r.kind!=='kneel')G.bx=clamp(MID+gauss()*6,HASHL,HASHR);
  let y=r.yds||0,txt='';
  if(r.kind==='int'){
    tick(6);D.to++;mo(opp,30);flash('PICKED OFF',opp);
    if(isU){G.st.qb.att++;G.st.qb.int++}
    const by=nmS(opp,r.by||'FS');
    if(r.six){txt=qb+' is picked off by '+by+', and he takes it the distance!';setL(txt,'to');log(txt,'to');touchdown(opp);return}
    const cy=G.ball+r.air;let nb=cy>=100&&r.ret<cy-99?20:clamp(100-cy+r.ret,1,99);
    txt=qb+' is INTERCEPTED by '+by+(r.ret>5?', returned '+r.ret+' yards':'')+'.';setL(txt,'to');log(txt,'to');changePoss(opp,nb);return;
  }
  if(r.kind==='fum'||(r.kind==='sack'&&r.lost)){
    tick(6);D.to++;mo(opp,28);flash('FUMBLE',opp);
    const spot=clamp(G.ball+y,1,99);
    txt=r.kind==='sack'?qb+' is strip-sacked by '+nmS(opp,r.by)+'. '+abbrOf(opp)+' recovers.':nmS(side,r.c||'RB')+' FUMBLES. '+abbrOf(opp)+' recovers.';
    if(r.scoop){txt=(r.kind==='sack'?qb+' is strip-sacked':nmS(side,r.c||'RB')+' FUMBLES')+', and '+abbrOf(opp)+' scoops it up and SCORES!';setL(txt,'td');log(txt,'td');touchdown(opp);return}
    setL(txt,'to');log(txt,'to');changePoss(opp,100-spot);return;
  }
  let ticked=false;
  if(r.kind==='kneel'){tick(Math.max(38,clockBase()*1.5));ticked=true;y=G.ball>1?-1:0;txt=qb+' takes a knee.'}
  else if(r.kind==='spike'){if(!G.ot&&G.lastRun>0)G.clock=Math.min(G.qlen,G.clock+G.lastRun-2);tick(1);ticked=true;y=0;txt=qb+' spikes it to stop the clock.'}
  if(y>=100-G.ball)y=100-G.ball;
  const td=G.ball+y>=100;
  if(r.kind==='run'||r.kind==='scr'){
    const who=r.kind==='scr'?qb:nmS(side,r.c);D.rush+=y;
    if(isU&&r.kind==='run'&&r.c==='RB'){G.st.rb.car++;G.st.rb.yds+=y;if(td)G.st.rb.td++}
    if(r.kind==='scr')txt=qb+' scrambles '+(y>0?'for '+y:y===0?'for no gain':'and loses '+(-y))+(r.oob?', out of bounds.':'.');
    else txt=y>=15?who+' breaks free for '+y+' yards!':y>0?who+' '+(PB[pk].run.edge?'around the edge':'up the middle')+' for '+y+(r.oob?', out of bounds.':'.'):y===0?who+' stuffed at the line.':who+' dropped for a loss of '+(-y)+'.';
  }else if(r.kind==='comp'||r.kind==='inc'){
    const rc=r.target?nmS(side,r.target):'';
    if(isU){G.st.qb.att++;if(r.kind==='comp'){G.st.qb.cmp++;G.st.qb.yds+=y;if(td)G.st.qb.td++;if(r.target==='X'){G.st.wr.rec++;G.st.wr.yds+=y;if(td)G.st.wr.td++}}}
    if(r.kind==='comp'){D.pass+=y;txt=y>=20?qb+' hits '+rc+' for '+y+' yards!':qb+' finds '+rc+' for '+y+'.'}
    else txt=r.away?qb+' throws it away.':qb+' incomplete, intended for '+rc+'.';
  }else if(r.kind==='sack'){txt=qb+' sacked by '+nmS(opp,r.by)+' for a loss of '+(-y)+'.';mo(opp,8);if(side===homeSide())SC.hype=.1;else SC.hype=1}
  D.yds+=y;
  if(!ticked)tick(td||G.ball+y<=0?6:playClock(side,r));
  G.ball+=y;G.drive.y+=y;
  if(y>=20)mo(side,12);
  if(G.ball>=100){setL(txt,'td');log(txt);touchdown(side);return}
  if(G.ball<=0){setL(txt+' Safety.','to');log(txt);safety(side);return}
  if(y>=30)flash('BIG PLAY',side);
  G.togo-=y;
  if(G.togo<=0){G.down=1;G.togo=Math.min(10,100-G.ball);D.fd++;txt+=' First down.'}
  else{G.down++;if(G.down>4){txt+=' Turnover on downs.';mo(opp,20);flash('STOPPED',opp);setL(txt,'to');log(txt,'to');changePoss(opp,100-G.ball);return}}
  setL(txt);log(txt);
}
function addPts(side,n){side==='u'?G.su+=n:G.sc+=n;if(!G.qp)G.qp={u:[0,0,0,0,0],c:[0,0,0,0,0],ok:G.su+G.sc===n};G.qp[side][G.ot?4:Math.min(G.q,4)-1]+=n;G.big=G.big||{u:0,c:0};G.big.u=Math.max(G.big.u,G.sc-G.su);G.big.c=Math.max(G.big.c,G.su-G.sc)}
const leads=side=>side==='u'?G.su>G.sc:G.sc>G.su;
function touchdown(side){
  addPts(side,6);log('TOUCHDOWN '+abbrOf(side)+'.','td');mo(side,22);flash('TOUCHDOWN',side);
  if(G.ot&&G.otStep===1&&leads(side))return endGame();
  if(side==='u')G.phase='pat';else doPAT('c',patAI('c'));
}
function doPAT(side,a){
  const tw=a==='two'||G.ot>=3;
  if(tw){G.pat2={side};G.ball=97;G.down=1;G.togo=3;G.bx=MID;G.poss=side;G.phase=side==='u'?'off':'def';log(abbrOf(side)+' lines up to go for two.','k');prep();return}
  G.ball=97;G.bx=MID;G.poss=side;G.phase='patk';G.patk={side,k:{type:'fg',dist:20,good:R()<.95,pat:true}};if(!G.patk.k.good)G.patk.k.miss=R()<.5?'wide left':'wide right';return;
  G.phase='live';
  const e=(rat(side).off-rat(other(side)).def)/10;
  if(tw){const ok=R()<.44+e*.03;if(ok)addPts(side,2);log(abbrOf(side)+' two-point try '+(ok?'is GOOD.':'fails.'),ok?'k':'')}
  else{const ok=R()<.95;if(ok)addPts(side,1);log(ok?'Extra point is good.':'Extra point is NO GOOD.',ok?'':'to')}
  if(G.ot&&G.otStep===1&&leads(side))return endGame();
  afterScore(side);
}
function safety(side){
  const opp=other(side);addPts(opp,2);log('SAFETY. 2 points for '+abbrOf(opp)+'.','td');mo(opp,18);flash('SAFETY',opp);
  if(G.ot)return otNext();
  kickoff(opp);
}
function afterScore(scorer){if(G.ot)return otNext();if(scorer==='u'&&onsideOffer()){G.phase='kochoice';return}kickoff(other(scorer),autoSide(scorer)?onsideAI(scorer):false)}
/* onside kicks: obvious late in a game, sometimes a surprise */
function onsideAI(ks){
  if(!G||G.ot)return false;const X=sitOf(ks);
  if(G.q===4&&X.diff<0&&X.diff>=-16){const T=Math.max(75,(G.qlen||300)*.35);if(G.clock<=T||(G.clock<=T*1.6&&G.to[ks]<=1)||(X.diff<=-9&&G.clock<=T*2))return 'obvious'}
  if(G.q>=3&&X.diff<0&&X.diff>=-14&&R()<.02)return 'surprise';
  return false;
}
function onsideOffer(){return !G.ot&&!G.watch&&G.q>=3&&(G.su-G.sc)<=0}
function kickoff(recv,onside){
  G.poss=recv;G.possN++;G.down=1;G.togo=10;G.bx=MID;newDrive();
  const ks=other(recv);
  if(onside){const p=onside==='surprise'?.48:.2,got=R()<p,spot=ri(45,48),lx=R()<.5?ri(10,16):ri(37,43);
    if(got){G.poss=ks;G.ball=spot;G.togo=10;G.koAnim={side:ks,type:'ko',onside:true,rec:ks,land:spot,lx};log(abbrOf(ks)+(onside==='surprise'?' catches everyone napping with a surprise onside kick and RECOVERS!':' tries the onside kick... and RECOVERS!'),'td');flash('ONSIDE RECOVERED',ks);mo(ks,26)}
    else{G.ball=100-spot;G.koAnim={side:ks,type:'ko',onside:true,rec:recv,land:spot,lx};log(abbrOf(ks)+' tries the onside kick. '+abbrOf(recv)+' falls on it at the '+abbrOf(ks)+' '+spot+'.','k')}
    return}
  if(!G.ot&&R()<.007){G.ball=25;G.koAnim={side:ks,type:'ko',land:ri(97,104),rtd:true,ret:100};log(abbrOf(recv)+' returns the kickoff ALL THE WAY!','td');G.poss=recv;return touchdown(recv)}
  if(R()<.65){G.ball=25;G.koAnim={side:ks,type:'ko',land:ri(101,108),tb:true};log(abbrOf(other(recv))+' kicks off. Touchback.')}
  else{G.ball=ri(14,44);G.koAnim={side:ks,type:'ko',land:ri(93,100),nb:G.ball,ret:G.ball};log(abbrOf(recv)+' returns the kick to the '+(G.ball<=50?'own '+G.ball:100-G.ball)+'.')}
}
function changePoss(next,ball){
  if(G.ot)return otNext();
  G.poss=next;G.ball=clamp(ball,1,99);G.down=1;G.togo=Math.min(10,100-G.ball);G.possN++;G.bx=FW-G.bx;newDrive();
}
function fgProb(dist){return clamp(1.05-(dist-18)*.0155,.03,.99)}
function kickRoll(side,type,q=.6){
  const toGoal=100-G.ball;
  if(type==='fg'){
    const WX=envG().weather,dist=toGoal+17,good=R()<clamp(fgProb(dist)+(q-.6)*.55-(WX==='snow'?.08:WX==='wind'?(dist>=40?.13:.05):WX==='rain'?.04:0),.02,.995);
    return {type,dist,good,miss:good?null:dist>48&&R()<.4?'short':R()<.5?'wide left':'wide right'};
  }
  const land=G.ball+ri(34,50);
  if(land>=100)return {type,land,nb:20,tb:1,ret:0};
  const rr2=R();let ret=rr2<.3?0:rr2<.72?ri(1,9):rr2<.95?ri(8,20):ri(20,45);
  if(R()<.012)return {type,land,nb:99,ret:100-(100-land),rtd:1};
  return {type,land,nb:clamp(100-land+ret,1,99),ret};
}
function applyKick(side,k){
  const opp=other(side);let t;
  G.recap=null;
  if(k.pat){G.phase='live';G.patk=null;
    if(k.good){addPts(side,1);t='Extra point is good.';log(t)}else{t='Extra point is NO GOOD, '+(k.miss||'wide')+'.';log(t,'to');flash('NO GOOD',opp)}
    G.last={side,pk:'xp',txt:t,cls:k.good?'':'to'};
    if(G.ot&&G.otStep===1&&leads(side))return endGame();return afterScore(side)}
  if(k.type==='fg'){
    tick(5);
    if(k.good){addPts(side,3);mo(side,6);flash('IT IS GOOD',side);t=abbrOf(side)+' '+k.dist+'-yard field goal is GOOD.';log(t,'k');G.last={side,pk:'fg',txt:t,cls:'td'};
      if(G.ot&&G.otStep===1&&leads(side))return endGame();afterScore(side)}
    else{mo(opp,10);flash('NO GOOD',opp);t=abbrOf(side)+' '+k.dist+'-yard field goal is NO GOOD, '+k.miss+'.';log(t,'to');G.last={side,pk:'fg',txt:t,cls:'to'};changePoss(opp,Math.max(20,100-(G.ball-7)))}
  }else{
    tick(10);
    if(k.rtd){t=abbrOf(opp)+' takes the punt back ALL THE WAY!';log(t,'td');G.last={side:opp,pk:'punt',txt:t,cls:'td'};G.poss=opp;touchdown(opp);return}
    t=k.tb?abbrOf(side)+' punts into the end zone. Touchback.':k.ret>=20?abbrOf(side)+' punts, and '+abbrOf(opp)+' breaks a big return to the '+(k.nb<=50?'own '+k.nb:100-k.nb)+'.':abbrOf(side)+' punts. '+abbrOf(opp)+' takes over at the '+(k.nb<=50?'own '+k.nb:100-k.nb)+'.';
    log(t);G.last={side,pk:'punt',txt:t};changePoss(opp,k.nb);
  }
}
function startOT(){G.ot=1;G.otStep=0;G.otFirst=R()<.5?'u':'c';log('Tied after regulation. Heading to overtime.','k');startOTPoss()}
function startOTPoss(){
  const side=G.otStep===0?G.otFirst:other(G.otFirst);
  G.poss=side;G.ball=75;G.down=1;G.togo=10;G.possN++;G.bx=MID;newDrive();
  log((G.ot>1?'OT'+G.ot+': ':'Overtime: ')+abbrOf(side)+' ball at the 25.','k');
}
function otNext(){
  G.otStep++;
  if(G.otStep>=2){if(G.su!==G.sc)return endGame();G.ot++;G.otStep=0}
  startOTPoss();
}
function endGame(){
  G.phase='over';log('FINAL: '+abbrOf('u')+' '+G.su+', '+abbrOf('c')+' '+G.sc+'.','k');
  const w=G.su>G.sc?'u':'c',lw=w==='u'?G.line:-G.line,rW=G.rk[w],rL=G.rk[other(w)];
  G.upset=lw<=-7||(rW>PN&&rL<=8)||(rL<=6&&rW-rL>=8);
  G.storm=G.upset&&!G.neutral&&homeSide()===w?w:null;
  const gg=S.games[G.gid];if(!G.storm&&gg&&bigRiv(gg)&&!G.neutral&&homeSide()===w)G.storm=w;if(!G.storm&&gg&&gg.riv!=null&&!G.neutral&&homeSide()===w){const wid=w==='u'?GU():G.opp;if(S.rivals[gg.riv].holder!==wid&&R()<.6)G.storm=w}
  const g=S.games[G.gid];G.title=!!(g&&(g.final||g.ccg!=null))&&(w==='u'||!!G.watch);
  G.trophy=null;if(gg&&gg.riv!=null&&S.rivals[gg.riv]&&S.rivals[gg.riv].trophy){const rv=S.rivals[gg.riv],wid=w==='u'?GU():G.opp;G.trophy={w,name:troN(rv),stays:rv.holder===wid,first:rv.holder==null,abbr:teamOf(w).abbr}}
}
function checkClock(){
  while(!G.ot&&G.clock<=0&&G.phase!=='over'){
    if(G.q===1||G.q===3){log('End of the '+ord(G.q)+' quarter.');G.q++;G.clock=G.qlen}
    else if(G.q===2){log('Halftime.','k');G.q=3;G.clock=G.qlen;G.to={u:3,c:3};G.lastRun=0;kickoff(G.kickFirst);G.phase='half';return}
    else{if(G.su===G.sc)startOT();else endGame()}
  }
}
function setPhase(){
  if(['over','pat','coin','half','patk','kochoice'].includes(G.phase))return;
  if(G.pat2){G.phase=G.pat2.side==='u'?'off':'def';prep();return}
  checkClock();
  if(G.phase==='over'||G.phase==='half')return;
  for(const sd of ['c','u']){
    if(!autoSide(sd)||G.ot||G.to[sd]<=0||G.lastRun<=0||G.clock<=0)continue;
    const X=sitOf(sd),onD=G.poss!==sd;
    let call=false;
    if(G.q===4&&X.diff<0&&onD&&X.secs<Math.max(150,X.need*110))call=true;           // stop their clock to get the ball back
    if(G.q===4&&X.diff<0&&!onD&&X.urgent&&G.clock<75)call=true;                     // drive needs the time
    if(G.q===4&&X.diff<=0&&X.diff>=-3&&!onD&&X.dist<=52&&G.clock<=clockBase()*1.15+10&&G.clock>4)call=true; // save time for the kick
    if(G.q===2&&!onD&&G.clock<G.qlen*.2&&X.toGoal<=60)call=true;
    if(!onD&&twoMin(sd)&&(G.down>=3||G.clock<=20||(G.clock<=50&&G.to[sd]>=2)))call=true;
    if(call){G.clock=Math.min(G.qlen,G.clock+G.lastRun);G.to[sd]--;G.lastRun=0;log(abbrOf(sd)+' calls timeout. Clock stops at '+fmtClock(G.clock)+'.','k');break}
  }
  if(G.poss==='c'&&!G.pat2&&(G.down===4||kickNow('c'))){const f=kickNow('c')?'fg':fourthAI('c');if(f!=='go'){G.phase='ckick';G.ckick=f;return}}
  G.phase=G.poss==='u'?'off':'def';
  prep();
}
function prep(){
  G.sel=null;G.dsel=null;G.pend=null;G.dpend=null;G.dlook=null;G.meter=null;SC.P=null;
  if(G.phase==='off'){G.dpend=defAI('c');G.dlook=R()<.3?({c0:'c1',fire:'c3',c1:'c3',c4:'c2',c2:'c4',c3:'c1'}[G.dpend]||G.dpend):G.dpend;G.sug=offAI('u')}
  else if(G.phase==='def')G.pend=offAI('c',false);
}
function fourthAI(side){
  const X=sitOf(side),diff=X.diff,toGoal=X.toGoal,inRange=X.dist<=52,easy=X.dist<=42,ag=aggrOf(side),t=G.togo;
  if(G.pat2)return 'go';
  if(G.ot){
    if(G.otStep===1){if(diff<-3)return 'go';if(diff<0)return inRange?((diff===-3&&toGoal<=5&&t<=2&&R()<ag*.5)?'go':'fg'):'go'}
    if(t<=1&&R()<.3)return 'go';return inRange?'fg':'go';
  }
  if(G.q===4){
    const secs=X.secs;
    if(diff<0){
      if(diff>=-3){                                  // a field goal ties or wins
        if(inRange){if(diff===-3&&toGoal<=8&&t<=3&&secs<45&&R()<ag*.45)return 'go';return 'fg'}
        if(secs<300||t<=2)return 'go';return G.ball<40&&t>4?'punt':'go';
      }
      if(diff>=-8){                                  // need a touchdown
        if(secs<240+X.to*30)return 'go';
        if(inRange&&secs>420&&diff>=-6)return 'fg';
        return G.ball<35&&t>3?'punt':'go';
      }
      if(inRange&&secs>90)return 'fg';               // two scores: take the points
      if(secs<480)return 'go';
      return G.ball<35&&t>4?'punt':'go';
    }
    if(diff===0){if(inRange)return 'fg';if(secs<40&&G.ball>=50&&t<=3)return 'go';return 'punt'}
    // protecting a lead
    if(inRange&&!(t<=1&&G.ball>=60&&secs<90&&R()<ag))return 'fg';
    if(t<=1&&G.ball>=45&&secs<120&&R()<ag*.6)return 'go';
    return 'punt';
  }
  if(G.q===2&&G.clock<=Math.max(6,clockBase()*1.15+4))return inRange?'fg':'punt';
  if(t<=1&&G.ball>=40&&R()<ag*.9)return 'go';
  if(t<=2&&G.ball>=55&&!easy&&R()<ag*.6)return 'go';
  if(inRange)return 'fg';
  if(t<=3&&G.ball>=60&&R()<.5+ag*.4)return 'go';
  if(t<=1&&G.ball>=30&&R()<ag*.35)return 'go';
  return 'punt';
}
const IDPLAYS={air:['mesh','verts','levels','stick','sail','tunnel','shallow','hitchseam','slants','bubble'],ground:['power','iz','counter','iso','trap','toss','stretch','sneak'],balanced:['pashot','boot','curlflat','iz','counter','smash','levels'],clock:['iz','power','stick','curlflat','screen','iso','slants','shallow'],shootout:['verts','dagger','sluggo','jet','bubble','pashot','wheel','tunnel'],defense:['iz','power','screen','stick','trap','curlflat','iso']};
function offAI(side,allowKick=true){
  if(G.pat2)return wpick({power:8,iz:5,qbdraw:4,option:4,slants:7,stick:6,fade:6,mesh:4,bubble:3,boot:3});
  const me=side==='u'?G.su:G.sc,th=side==='u'?G.sc:G.su,diff=me-th,toGoal=100-G.ball,kn=Math.max(38,clockBase()*1.5);
  if(!G.ot&&G.q===4&&diff>0&&G.clock<=(5-G.down-(G.to[other(side)]||0))*kn+(G.to[other(side)]||0)*4)return 'kneel';
  if(!G.ot&&G.q===2&&G.clock<=20&&G.ball<55&&G.down<4)return 'kneel';
  if(allowKick&&kickNow(side))return 'fg';
  if(allowKick&&G.down===4){const f=fourthAI(side);if(f!=='go')return f}
  if(!G.ot&&G.q===2&&G.clock<=45&&G.ball<30&&G.to[side]<=1&&G.down<4)return 'kneel';
  const SX=sitOf(side),tm=twoMin(side),last=!G.ot&&(G.q===2||G.q===4)&&G.clock<=8&&(G.q===2||diff<=0);
  if(last&&G.down<=4){if(toGoal<=30)return wpick({fade:6,verts:4,smash:3,corner:0,sail:2,dagger:2});if(toGoal<=68)return 'hail'}
  if(tm&&G.lastRun>0&&G.down<=2&&((G.to[side]===0&&G.clock<=70)||(G.clock<=30&&G.to[side]<=1)))return 'spike';
  if(!G.ot&&(G.q===2||G.q===4)&&G.lastRun>0&&G.down<=3&&G.to[side]===0&&SX.dist<=50&&G.clock<=16&&G.clock>4&&(G.q===2||(diff<=0&&diff>=-3)))return 'spike';
  const st=side==='c'?team(G.opp).style:'bal',t=G.togo,d=G.down;
  const w={iz:9,power:6,counter:5,stretch:5,option:5,draw:4,jet:4,sneak:0,toss:5,trap:5,qbdraw:3,slants:7,stick:6,screen:4,mesh:6,curlflat:6,smash:5,sail:5,boot:5,verts:4,pashot:4,dagger:5,bubble:5,wheel:3,levels:5,ycross:4,fade:2,hail:0,tunnel:3,shallow:5,sluggo:2,hitchseam:4,iso:4};
  if(d>=3&&t>=7){for(const k of RUNS)w[k]*=.25;w.draw+=3;w.screen+=3;w.mesh+=6;w.sail+=5;w.smash+=4;w.verts+=6;w.curlflat+=3;w.slants*=.6;w.stick*=.4;w.qbdraw+=2;w.dagger+=5;w.levels+=4;w.ycross+=6;w.bubble*=.5;w.fade*=.5}
  else if(t<=2){w.iz+=8;w.power+=12;w.sneak+=t<=1?14:4;w.stick+=6;w.slants+=4;w.verts*=.3;w.pashot*=.4;w.screen*=.5;w.draw*=.5;w.trap+=5;w.toss*=.6;w.wheel*=.3;w.ycross*=.3;w.fade*=.4}
  else if(d===1){w.pashot+=2;w.boot+=2}
  if(toGoal<=12){w.verts*=.3;w.pashot*=.2;w.sail*=.6;w.power+=4;w.slants+=3;w.smash+=3;w.fade+=7;w.ycross*=.4;w.dagger*=.5;w.wheel*=.5;w.qbdraw+=2}
  if(autoSide(side)){const ik=identOf(side==='u'?GU():G.opp).k;for(const k of (IDPLAYS[ik]||[]))if(w[k]!=null)w[k]*=1.8;const M=IDm(side==='u'?GU():G.opp);for(const k of RUNS)w[k]*=M.run;for(const k of PASSES)w[k]*=M.pass;for(const k of ['verts','pashot','dagger','sail','fade','wheel'])w[k]*=M.deep;if(M===IDENT.clock){w.slants*=1.2;w.stick*=1.25;w.curlflat*=1.2;w.screen*=1.3}}
  else{if(st==='run')for(const k of RUNS)w[k]*=1.5;if(st==='pass')for(const k of PASSES)w[k]*=1.35}
  if(!G.ot&&(SX.urgent||(G.q===2&&G.clock<G.qlen*.3&&G.poss===side))){
    const big=SX.need>=2||(SX.secs<90&&SX.need>=1);
    for(const k of RUNS)w[k]*=big?.12:.35;w.draw+=2;w.sail*=1.8;w.smash*=1.4;w.mesh*=1.3;w.dagger*=1.5;w.levels*=1.3;w.verts*=big?2.4:1.6;w.ycross*=1.5;w.screen*=.6;w.bubble*=.6;
  }else if(!G.ot&&G.q===4&&G.clock<G.qlen*.4&&diff>0){for(const k of RUNS)w[k]*=2.5;for(const k of PASSES)w[k]*=.4}
  // in range, game tied or within a field goal, little time: bleed it safely, then kick
  if(!G.ot&&G.q===4&&diff<=0&&diff>=-3&&SX.dist<=44&&G.clock<70){for(const k of PASSES)w[k]*=.15;w.iz*=2.5;w.power*=2;w.sneak+=4;w.stretch*=.3;w.toss*=.3;w.jet*=.3}
  if(tm){for(const k of RUNS)w[k]*=.06;if(G.clock>70&&G.to[side]>=2)w.draw=3;w.curlflat*=2.2;w.smash*=1.9;w.sail*=2.2;w.stick*=1.2;w.dagger*=1.5;w.levels*=1.2;w.verts*=1.5;w.wheel*=1.8;w.fade*=1.3;w.mesh*=.7;w.ycross*=.7;w.slants*=.7;w.screen*=.35;w.bubble*=.8;
    if(toGoal>40&&G.clock<=25){w.verts*=2.2;w.dagger*=1.6;w.sail*=1.5;w.curlflat*=.5;w.stick*=.4}}
  w.hail=0;
  return wpick(w);
}
function defAI(defSide){
  const off=other(defSide),rs=runShare(off),d=G.down,t=G.togo,toGoal=100-G.ball;
  const w={c2:12,c3:16,c4:11,c1:11,c0:5,fire:9,goal:2,prev:0,c2m:8,tampa:8};
  if(rs>.6){w.goal+=10;w.c3+=8;w.c1+=6;w.c0+=4}else if(rs<.35){w.c4+=10;w.c2+=8;w.fire+=6}
  if(d>=3&&t>=8){w.c4+=10;w.fire+=8;w.c0+=5;w.c2+=6;w.c2m+=6;w.tampa+=5;w.goal=0;if(t>=14)w.prev+=8}
  if(t<=2){w.goal+=26;w.c0+=8;w.c1+=6;w.prev=0;w.c4*=.4}
  if(toGoal<=10){w.goal+=8;w.c1+=10;w.c0+=4;w.c4*=.5;w.prev=0}
  const om=off==='u'?G.su:G.sc,ot=off==='u'?G.sc:G.su;
  if(!G.ot&&G.q===4&&G.clock<G.qlen*.4){if(om<ot&&ot-om<=8){w.prev+=G.clock<60?40:12;w.c4+=10;w.goal=0}else if(om>ot){w.goal+=10;w.c3+=6}}
  if(!G.ot&&G.q===2&&G.clock<30&&toGoal>40)w.prev+=25;
  return wpick(w);
}
function patAI(side){
  if(G.ot>=3)return 'two';
  const d=side==='u'?G.su-G.sc:G.sc-G.su;
  if(!G.ot&&G.q===4&&[-2,1,5,-5,-10].includes(d))return 'two';
  return 'xp';
}
function userTimeout(){
  if(G.ot||G.to.u<=0||G.lastRun<=0)return;
  G.clock=Math.min(G.qlen,G.clock+G.lastRun);G.to.u--;G.lastRun=0;
  log(abbrOf('u')+' calls timeout. Clock stops at '+fmtClock(G.clock)+'.','k');
}
function quickPlay(side,pk,dc){
  if(pk==='kneel')return {kind:'kneel'};
  if(pk==='spike')return {kind:'spike'};
  return resolveQuick(buildPlay(side,pk,dc),side==='u'?.8:1.6);
}
function commitPlay(side,pk,dc,r){
  if(G.pat2){const ok=['run','comp','scr'].includes(r.kind)&&(r.yds||0)>=3,sd=G.pat2.side;G.pat2=null;G.phase='live';
    const t=abbrOf(sd)+' two-point try '+(ok?'is GOOD.':'fails.');
    if(ok){addPts(sd,2);flash('TWO POINTS',sd);mo(sd,10)}else{flash('NO GOOD',other(sd));mo(other(sd),8)}
    log(t,ok?'td':'to');G.last={side:sd,pk,dc,txt:t,cls:ok?'td':'to'};
    if(G.ot&&G.otStep===1&&leads(sd)){endGame();return}
    afterScore(sd);setPhase();return}
  applyResult(side,pk,dc,r);setPhase()}
function doInput(a){
  if(G.phase==='coin'){
    if(a==='defer'){G.kickFirst='u';G.phase='live';kickoff('c')}
    else{G.kickFirst='c';G.phase='live';kickoff('u')}
  }else if(G.phase==='half'){G.adj=a;G.phase='live';log('Halftime adjustment: '+HALF[a][0]+'.','k')}
  else if(G.phase==='pat')doPAT('u',a);
  else if(G.phase==='kochoice'){G.phase='live';kickoff('c',a==='onside'?((G.q===4&&G.su<G.sc)?'obvious':'surprise'):false)}
  setPhase();
}
function autoStep(){
  G.meter=null;
  if(G.phase==='half')return doInput(pick(['air','ground','lock']));
  if(G.phase==='coin')return doInput('receive');
  if(G.phase==='kochoice')return doInput(onsideAI('u')?'onside':'deep');
  if(G.phase==='pat')return doInput(patAI('u'));
  if(G.phase==='ckick'){applyKick('c',kickRoll('c',G.ckick,rnd(.45,.95)));return setPhase()}
  if(G.phase==='patk'){const pk=G.patk;if(pk)applyKick(pk.side,pk.k);else G.phase='live';return setPhase()}
  if(G.phase==='off'){
    const pk=offAI('u');
    if(pk==='punt'||pk==='fg'){applyKick('u',kickRoll('u',pk,rnd(.5,.9)));return setPhase()}
    const dc=G.dpend||defAI('c');return commitPlay('u',pk,dc,quickPlay('u',pk,dc));
  }
  if(G.phase==='def'){const pk=G.pend||offAI('c',false),dc=defAI('u');return commitPlay('c',pk,dc,quickPlay('c',pk,dc))}
  if(G.phase==='live')setPhase();
}
function simDrive(){const n=G.possN;let i=0;while(G.phase!=='over'&&i++<200){autoStep();if(G.possN!==n&&G.phase!=='pat')break}G.koAnim=null}
function simToEnd(){let i=0;while(G.phase!=='over'&&i++<3000)autoStep();G.koAnim=null}
function coordDrive(){
  const s0=G.sc,y0=G.box.c.yds,l0=G.log.length;let i=0,plays=0;
  while(G.phase!=='over'&&i++<300){
    if(G.phase==='half'||G.phase==='off'||(G.phase==='pat'&&G.poss==='u')||G.phase==='ckick'||G.phase==='patk'||G.pat2)break;
    if(G.phase==='def')plays++;
    autoStep();
  }
  const lastT=(G.log.find(l=>l.k==='td'||l.k==='to'||/field goal|punts|FINAL|Halftime/.test(l.t))||G.log[0]||{t:''}).t;
  G.recap={abbr:team(G.opp).abbr,plays,yds:G.box.c.yds-y0,pts:G.sc-s0,res:lastT,n:G.log.length-l0};
}
function finishUserGame(){
  const g=S.games[G.gid];
  if(!G.watch){const uc=S.uCalls=S.uCalls&&S.uCalls.season===S.season?S.uCalls:{season:S.season,run:0,pass:0,g:0,slow:0};for(const c of G.calls||[])if(c.side==='u'){if(c.call==='run')uc.run++;else if(c.call==='pass')uc.pass++}uc.g++;if(G.tempo==='milk'||G.tempo==='slow')uc.slow++}
  if(G.uHome){g.hs=G.su;g.as=G.sc}else{g.hs=G.sc;g.as=G.su}
  g.done=true;g.ot=G.ot>0;
  g.ust={qb:{...G.st.qb},rb:{...G.st.rb},to:G.box.u.to};
  if(G.qp)g.uq={u:G.qp.u,c:G.qp.c};if(G.big)g.big=G.big;
  addStars(G.st);starStats(g);afterUserGame(g);
  S.game=null;G=null;S.view='hub';S.tab='week';advance();toPresser(g);
}
function toPresser(g){S.afterPress=S.view;S.presser=buildPresser(g);S.view='presser'}

/* =================== LIVE FIELD (canvas) =================== */
const SC={cv:null,ctx:null,W:360,H:340,dpr:1,cam:{x:MID,y:40,D:46,pitch:.86,span:49},pl:{},crowd:null,crowdKey:'',fans:[],conf:[],A:null,P:null,raf:0,last:0,hype:.25,fk:'',t:0,ui:0,stormDone:false,reset:true};
let CP={};
function jersey(team){
  const t=teamOf(team);
  return team===homeSide()?{fill:t.color,text:'#ffffff',edge:shade(t.color,-.45)}:{fill:'#f1efe8',text:shade(t.color,-.15),edge:t.color};
}
function setupCam(){
  const c=SC.cam,cp=Math.cos(c.pitch),sp=Math.sin(c.pitch),yw=c.yaw||0,sy=Math.sin(yw),cy=Math.cos(yw);
  CP={cx:c.x-c.D*cp*sy,cy:c.y-c.D*cp*cy,cz:(c.z||0)+c.D*sp,cp,sp,sy,cyw:cy,F:SC.W*c.D/(c.span||49),W:SC.W,H:SC.H,hy:SC.H*.5};
}
function pj(x,y,z=0){
  let dx=x-CP.cx,dy=y-CP.cy;const dz=z-CP.cz;
  if(CP.sy){const lx=dx*CP.cyw-dy*CP.sy;dy=dx*CP.sy+dy*CP.cyw;dx=lx}
  const zc=dy*CP.cp-dz*CP.sp;
  if(zc<1)return null;
  const yc=dy*CP.sp+dz*CP.cp;
  return {x:CP.W/2+CP.F*dx/zc,y:CP.hy-CP.F*yc/zc,s:CP.F/zc};
}
function initCanvas(){
  SC.cv=document.getElementById('fieldc');if(!SC.cv||!SC.cv.getContext)return;
  SC.ctx=SC.cv.getContext('2d');sizeCanvas();
  SC.cv.addEventListener('pointerdown',onFieldTap);
}
function sizeCanvas(){
  if(!SC.cv)return;
  const w=Math.max(280,Math.round(SC.cv.parentElement.clientWidth||360)),h=Math.round(Math.min(w*1.02,560));
  SC.dpr=Math.min(2,window.devicePixelRatio||1);SC.W=w;SC.H=h;
  SC.cv.width=Math.round(w*SC.dpr);SC.cv.height=Math.round(h*SC.dpr);SC.cv.style.height=h+'px';
}
if(typeof window!=='undefined'&&window.addEventListener)window.addEventListener('resize',()=>{sizeCanvas()});
function startLoop(){if(!SC.raf&&typeof requestAnimationFrame==='function'){SC.last=0;SC.raf=requestAnimationFrame(frame)}}
function stopLoop(){if(SC.raf&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(SC.raf);SC.raf=0;SC.A=null;SC.fans=[];SC.conf=[];SC.tro=null;SC.shS=0;SC.shB=0;if(SC.cv&&SC.cv.parentElement)SC.cv.parentElement.style.transform="";SC.shOn=false}
function frame(ts){
  SC.raf=requestAnimationFrame(frame);
  const dt=SC.last?Math.min(.05,(ts-SC.last)/1000):.016;SC.last=ts;
  if(!SC.cv||!SC.cv.isConnected)return;
  try{update(dt);draw();if(G)drawEnv(SC.ctx,SC.W,SC.H)}catch(e){console.error(e)}
}
function getP(team,slot){
  const k=team+'.'+slot;let p=SC.pl[k];
  if(!p){const r=G.ros[team][slot]||{num:0};p=SC.pl[k]={k,team,slot,num:r.num,x:MID,y:50,tx:MID,ty:50,vis:false,vx:0,vy:0,dx:0,dy:1}}
  return p;
}
function huddle(team,slots,cx,cy,o){slots.forEach((s,i)=>{const a=i/slots.length*Math.PI*2;o[team+'.'+s]=[cx+Math.cos(a)*2.4,cy+Math.sin(a)*2.4]})}
const HUD_O=['QB','RB','X','Z','S','TE','LT','LG','C','RG','RT'];
function layout(){
  const o={},los=G.ball,bx=G.bx,ot=G.poss,dt=other(ot),ph=G.phase;
  const putO=(sp)=>{for(const s in sp)o[ot+'.'+s]=[sp[s][0],los+sp[s][1]]};
  const putD=(sp)=>{for(const s in sp)o[dt+'.'+s]=[sp[s][0],Math.min(109,los+sp[s][1])]};
  if(ph==='off'||ph==='def'){
    const opk=ph==='off'?G.sel:G.pend;
    if(opk&&PB[opk]){
      const sp=spotsFor(opk,bx);putO(sp);
      const dcl=ph==='off'?G.dlook:G.dsel;
      if(dcl)putD(dspots(dcl,bx,sp));else huddle(dt,DSLOTS,bx,Math.min(108,los+9),o);
    }else if(G.meter){kickLayout(o,'fg')}
    else{huddle(ot,HUD_O,bx,Math.max(-8,los-9),o);huddle(dt,DSLOTS,bx,Math.min(108,los+9),o)}
  }else if(ph==='ckick')kickLayout(o,G.ckick);
  else if(ph==='pat')kickLayout(o,'fg');
  else if(ph==='coin'){o['u.QB']=[MID-1.6,50];o['c.QB']=[MID+1.6,50]}
  else if(ph==='over')return null;
  return o;
}
function kickLayout(o,type,ks,los0,bx0){
  const los=los0!=null?los0:G.ball,bx=bx0!=null?bx0:G.bx,ot=ks||G.poss,dt=other(ot);
  if(type==='ko'){const sl=['LT','LG','C','RG','RT','TE','S','X','Z','QB'];sl.forEach((n,i)=>{const x=4+i*(45/9)+(i>=5?2.6:0);o[ot+'.'+n]=[Math.min(49,x),los-1]});o[ot+'.K']=[bx-1.5,los-7];
    ['DE1','DT1','DT2','DE2','LB2'].forEach((s,i)=>o[dt+'.'+s]=[9+i*9,los+12]);['LB1','LB3','CB1','CB2'].forEach((s,i)=>o[dt+'.'+s]=[12+i*10,los+30]);o[dt+'.SS']=[bx+5,los+52];o[dt+'.FS']=[bx-3,los+62];return}
  OLN.forEach((n,i)=>o[ot+'.'+n]=[bx+OLX[i],los-.9]);
  o[ot+'.TE']=[bx+6.6,los-.9];o[ot+'.S']=[bx-6.6,los-.9];
  if(type==='punt'){
    o[ot+'.X']=[Math.max(3,bx-19),los-.9];o[ot+'.Z']=[Math.min(50,bx+19),los-.9];o[ot+'.QB']=[bx,los-6];o[ot+'.K']=[bx,los-13.5];
    ['DE1','DT1','DT2','DE2'].forEach((s,i)=>o[dt+'.'+s]=[bx-4.5+i*3,los+1.1]);
    o[dt+'.LB1']=[bx-7,los+1.4];o[dt+'.LB3']=[bx+7,los+1.4];o[dt+'.LB2']=[bx,los+5];
    o[dt+'.CB1']=[Math.max(3,bx-18),los+1.4];o[dt+'.CB2']=[Math.min(50,bx+18),los+1.4];
    o[dt+'.SS']=[bx-4,Math.min(108,los+30)];o[dt+'.FS']=[bx,Math.min(108,los+42)];
  }else{
    o[ot+'.X']=[bx-8.2,los-1.6];o[ot+'.Z']=[bx+8.2,los-1.6];o[ot+'.QB']=[bx-.4,los-7];o[ot+'.K']=[bx-1.6,los-9.6];
    ['DE1','DT1','DT2','DE2','LB1','LB2','LB3'].forEach((s,i)=>o[dt+'.'+s]=[bx-7.5+i*2.5,los+1.1]);
    o[dt+'.CB1']=[bx-10,los+1.6];o[dt+'.CB2']=[bx+10,los+1.6];o[dt+'.FS']=[bx-3,Math.min(108,los+8)];o[dt+'.SS']=[bx+3,Math.min(108,los+8)];
  }
}
function sceneSync(){
  if(!G||SC.A)return;
  const fk=G.poss+'|'+G.possN+'|'+G.phase.replace(/off|def/,'p');
  const L2=layout();
  const jump=SC.reset||fk!==SC.fk;SC.fk=fk;SC.reset=false;
  if(L2){
    for(const k in SC.pl)SC.pl[k].vis=false;
    for(const k in L2){const [team,slot]=k.split('.');const p=getP(team,slot),was=p.wasVis;p.vis=true;p.tx=L2[k][0];p.ty=L2[k][1];if(jump||!was){p.x=p.tx;p.y=p.ty}}
    for(const k in SC.pl)SC.pl[k].wasVis=SC.pl[k].vis;
  }
  if(!SC.crowd||SC.crowdKey!==G.gid+'|'+G.opp)genCrowd();
  if(G.phase==='ckick'&&!SC.A){const k=kickRoll('c',G.ckick,rnd(.45,.95));startKick('c',k)}
  if(G.phase==='patk'&&!SC.A&&G.patk){startKick(G.patk.side,G.patk.k)}
  if(G.koAnim&&!SC.A&&!['over','coin','half','patk','ckick','pat'].includes(G.phase)){const k=G.koAnim;G.koAnim=null;startKick(k.side,k)}
  if(G.phase==='over'&&!SC.stormDone){SC.stormDone=true;if(G.storm)startStorm(G.storm);if(G.title)startConfetti();if(G.trophy)startTrophy()}
}
function genCrowd(){
  SC.crowdKey=G.gid+'|'+G.opp;SC.wx=null;
  const hs=homeSide(),hc=shade(teamOf(hs).color,.12),ac=shade(teamOf(other(hs)).color,G.neutral?.12:.05);
  const B={},add=(c,o)=>{(B[c]=B[c]||[]).push(o)};
  const EV=envG(),th=EV.theme,c2=color2Of(teamOf(hs));
  const col=(away,row)=>{const r=R();if(!away&&th==='white')return r<.04?hc:r<.5?'#ffffff':'#e9eaee';if(!away&&th==='black')return r<.1?hc:'#33363f';if(!away&&th==='stripe')return row%2?hc:shade(c2,.05);return r<.1?'#e8e4d8':r<.17?'#2a3140':away?ac:hc};
  for(const side of [-1,1])for(let row=0;row<11;row++)for(let y=-26;y<=126;y+=1.25){
    const x=side<0?-4.4-row*1.5:FW+4.4+row*1.5,z=.9+row*1.05;
    add(col((G.neutral?side>0:side>0&&y>56&&y<90),row),{x:x+gauss()*.15,y:y+gauss()*.25,z,ph:R()*6.28,a:.6+R()*.8});
  }
  for(let row=0;row<9;row++)for(let x=-14;x<=FW+14;x+=1.3)add(col(false,row),{x:x+gauss()*.15,y:113.6+row*1.5,z:.9+row*1.05,ph:R()*6.28,a:.6+R()*.8});
  for(let row=0;row<9;row++)for(let x=-6;x<=FW+6;x+=1.25)add(col(false),{x:x+gauss()*.2,y:113.5+row*1.5,z:.9+row*1.05,ph:R()*6.28,a:.6+R()*.8});
  SC.crowd=Object.entries(B);
}

/* ---- live play animation ---- */
function setPos(p,v,dt){const vx=(v[0]-p.x)/Math.max(dt,1e-3),vy=(v[1]-p.y)/Math.max(dt,1e-3);p.vx=vx;p.vy=vy;const s=Math.hypot(vx,vy);if(s>.6){p.dx=vx/s;p.dy=vy/s}p.x=v[0];p.y=v[1]}
function moveTo(p,tx,ty,sp,dt){
  const dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy);
  if(d<1e-3){p.vx=p.vy=0;return}
  const m=Math.min(d,sp*dt);p.x+=dx/d*m;p.y+=dy/d*m;p.vx=dx/d*m/Math.max(dt,1e-3);p.vy=dy/d*m/Math.max(dt,1e-3);if(m/dt>.6){p.dx=dx/d;p.dy=dy/d}
}
/* ---------- stadium audio: crowd, band, whistle (all synthesized) ---------- */
const AUD={ctx:null,on:false,master:null,crowd:null,cg:null,noise:null,busyTill:0,lastCad:0,songTill:0,halfDone:null,endDone:null};
const FIGHT=[
 [[7,.5],[7,.5],[9,1],[7,1],[4,1],[5,.5],[5,.5],[7,1],[5,1],[2,1],[0,.5],[2,.5],[4,1],[7,1],[12,1],[11,1],[9,1],[7,2],[9,.5],[9,.5],[11,1],[12,1],[9,1],[7,.5],[7,.5],[9,1],[7,1],[4,1],[5,1],[4,1],[2,1],[7,1],[12,3],[null,1]],
 [[12,1.5],[11,.5],[9,1],[7,1],[9,1],[7,1],[4,2],[5,1.5],[4,.5],[2,1],[0,1],[2,1],[4,1],[7,2],[12,1.5],[14,.5],[12,1],[11,1],[9,1],[7,1],[9,1],[11,1],[12,1],[7,1],[4,1],[2,1],[0,3],[null,1]],
 [[0,.5],[0,.5],[4,.5],[7,.5],[12,1],[7,1],[9,.5],[9,.5],[7,.5],[5,.5],[4,2],[2,.5],[2,.5],[5,.5],[9,.5],[11,1],[9,1],[7,.5],[9,.5],[7,.5],[5,.5],[4,2],[0,.5],[0,.5],[4,.5],[7,.5],[12,1],[14,1],[16,1],[14,.5],[12,.5],[11,1],[9,1],[7,1],[11,1],[14,1],[12,.5],[11,.5],[12,3],[null,1]],
 [[7,1],[12,1],[12,1],[11,.5],[12,.5],[14,1],[12,1],[9,2],[5,1],[9,1],[9,1],[7,.5],[9,.5],[11,1],[9,1],[7,2],[7,1],[12,1],[12,1],[14,1],[16,1.5],[14,.5],[12,1],[9,1],[11,1],[12,1],[14,1],[11,1],[12,3],[null,1]]
];
/* ---------- marching band: real instrument samples ---------- */
const BAND={ready:false,loading:null,buf:{},drum:{},ir:null,base:'band/',dmix:.26,bmix:1.7};
const BAND_SET={trumpet:[52,86],trombone:[40,74],tuba:[28,60],french_horn:[41,77],alto_sax:[49,83],piccolo:[74,102],glockenspiel:[77,108],clarinet:[50,86]};
const BAND_DRUMS=['kick','snare','tom1','tom2','hihat','crash_cymbal1','crash_cymbal2','crash_1','cymbal1','drum_low_1'];
const NOTE_N=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'],noteName=m=>NOTE_N[m%12]+(Math.floor(m/12)-1);
function bandLoad(ctx){
  if(BAND.loading)return BAND.loading;
  const get=u=>fetch(BAND.base+u).then(r=>{if(!r.ok)throw new Error(u);return r.arrayBuffer()}).then(a=>new Promise((res,rej)=>ctx.decodeAudioData(a,res,rej)));
  const jobs=[];
  for(const ins in BAND_SET){BAND.buf[ins]=[];const [a,b]=BAND_SET[ins];for(let m=a;m<=b;m+=3)jobs.push(get(ins+'/'+noteName(m)+'.mp3').then(x=>BAND.buf[ins].push({m,x})).catch(()=>{}))}
  for(const d of BAND_DRUMS)jobs.push(get('drums/'+d+'.mp3').then(x=>{BAND.drum[d]=x}).catch(()=>{}));
  BAND.loading=Promise.all(jobs).then(()=>{for(const k in BAND.buf)BAND.buf[k].sort((p,q)=>p.m-q.m);BAND.ready=!!(BAND.buf.trumpet&&BAND.buf.trumpet.length&&BAND.drum.snare);return BAND.ready});
  return BAND.loading;
}
function bandIR(ctx,sec=2.3){const sr=ctx.sampleRate,n=Math.floor(sr*sec),b=ctx.createBuffer(2,n,sr);for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(let i=0;i<n;i++){const t=i/n;d[i]=(Math.random()*2-1)*Math.pow(1-t,2.6)*(i<sr*.012?i/(sr*.012):1)}}return b}
function bandBus(ctx,out,vol){
  const g=ctx.createGain();g.gain.value=vol;const dry=ctx.createGain();dry.gain.value=.82;const cv=ctx.createConvolver();cv.buffer=bandIR(ctx);const wet=ctx.createGain();wet.gain.value=.32;
  const comp=ctx.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;comp.attack.value=.01;comp.release.value=.2;
  g.connect(dry);g.connect(cv);cv.connect(wet);dry.connect(comp);wet.connect(comp);comp.connect(out);return g}
function bNote(ctx,bus,ins,m,t,dur,vel=1,{att=.012,rel=.12,detune=0,pan=0}={}){
  const L=BAND.buf[ins];if(!L||!L.length)return;vel*=BAND.bmix;let best=L[0];for(const s of L)if(Math.abs(s.m-m)<Math.abs(best.m-m))best=s;
  const src=ctx.createBufferSource();src.buffer=best.x;src.playbackRate.value=Math.pow(2,(m-best.m)/12);src.detune.value=detune;
  const g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vel,t+att);g.gain.setValueAtTime(vel,t+Math.max(att,dur-.02));g.gain.linearRampToValueAtTime(0,t+dur+rel);
  let node=g;if(ctx.createStereoPanner&&pan){const p=ctx.createStereoPanner();p.pan.value=pan;g.connect(p);node=p}
  src.connect(g);node.connect(bus);src.start(t);src.stop(t+dur+rel+.05)}
function bDrum(ctx,bus,name,t,vel=1,{rate=1,cut=null}={}){const b=BAND.drum[name];if(!b)return;vel*=BAND.dmix;const s=ctx.createBufferSource();s.buffer=b;s.playbackRate.value=rate;const g=ctx.createGain();g.gain.setValueAtTime(vel,t);if(cut){g.gain.setValueAtTime(vel,t+cut);g.gain.linearRampToValueAtTime(0,t+cut+.06)}s.connect(g);g.connect(bus);s.start(t);s.stop(t+(cut?cut+.1:b.duration/rate+.05))}
/* Averyville's own fight song (original): [semitone from tonic, beats], chords per bar as root offsets */
const AVY_SONG={pick:[[-5,.5],[-3,.25],[-1,.25]],
 mel:[[0,1],[4,1],[7,1.5],[4,.5], [9,1],[7,1],[4,2], [5,.75],[5,.25],[7,.75],[5,.25],[4,1],[2,1], [7,2],[null,.5],[-5,.5],[-3,.5],[-1,.5],
      [0,1],[4,1],[7,1.5],[12,.5], [12,1],[11,.5],[9,.5],[7,2], [9,.75],[9,.25],[7,.75],[5,.25],[4,1],[2,1], [0,3],[null,1],
      [9,.5],[9,.5],[9,1],[12,1],[9,1], [7,.5],[7,.5],[7,1],[4,2], [5,.5],[5,.5],[5,1],[9,1],[5,1], [4,1],[2,1],[7,2],
      [0,1],[4,1],[7,1.5],[12,.5], [14,1],[12,.5],[11,.5],[9,1],[7,1], [9,.75],[11,.25],[12,1],[14,1],[11,1], [12,3],[null,1]],
 ch:[0,0,7,7, 0,0,7,0, 5,0,5,7, 0,7,7,0]};
function bandChords(mel){const bars=[];let beat=0;for(const [n,b] of mel){const bi=Math.floor(beat/4+1e-6);(bars[bi]=bars[bi]||[]).push({n,w:b*(beat%4===0?2:1)});beat+=b}
  return bars.map(ns=>{const sc={0:0,5:0,7:0};for(const x of ns||[]){if(x.n==null)continue;const p=((x.n%12)+12)%12;if([0,4,7].includes(p))sc[0]+=x.w;if([5,9,0].includes(p))sc[5]+=x.w*.9;if([7,11,2,5].includes(p))sc[7]+=x.w*.95}return +Object.keys(sc).sort((a,b)=>sc[b]-sc[a])[0]})}
function bandSongFor(id){
  const t=team(id),h=hashS((t.name||'')+'band')>>>0;
  if((t.abbr||'')==='AVY')return {mel:AVY_SONG.mel,pick:AVY_SONG.pick,ch:AVY_SONG.ch,key:58,bpm:138};
  const mel=FIGHT[h%FIGHT.length];return {mel,pick:[[-5,.5],[-1,.5]],ch:bandChords(mel),key:[58,60,62,63,65,56][(h>>>3)%6],bpm:128+((h>>>6)%4)*5};
}
/* schedule a performance. bars=0 means full song with intro and ending. returns seconds */
function bandPlay(ctx,out,id,{bars=0,vol=1,t0=null,crowd=false}={}){
  const S0=bandSongFor(id),sp=60/S0.bpm,K=S0.key,bus=bandBus(ctx,out,vol),T0=(t0==null?ctx.currentTime+.1:t0),hum=()=>(Math.random()-.5)*.012;
  let t=T0;const full=!bars;
  // drum roll-off intro
  if(full){for(let i=0;i<16;i++){const tt=t+i*sp/4;bDrum(ctx,bus,'snare',tt,.25+.55*(i/16)*(i%4===0?1.2:.8));if(i%4===0)bDrum(ctx,bus,'kick',tt,.9,{rate:.62})}
    bDrum(ctx,bus,'tom1',t+sp*3,.7);bDrum(ctx,bus,'tom2',t+sp*3.5,.8);t+=sp*4}
  // pickup
  for(const [n,b] of S0.pick){bNote(ctx,bus,'trumpet',K+12+n,t+hum(),b*sp*.85,.75);bNote(ctx,bus,'alto_sax',K+12+n,t+hum(),b*sp*.85,.35);t+=b*sp}
  const start=t,mel=S0.mel,nb=S0.ch.length,maxBeats=bars?bars*4:1e9;let beat=0;
  for(const [n,b] of mel){if(beat>=maxBeats)break;const bi=Math.floor(beat/4+1e-6),root=S0.ch[bi%nb]||0,late=bi>=8;
    if(n!=null){const m=K+12+n,dur=b*sp*(b>=1?.92:.8),v=.85+(beat%2===0?.1:0);
      bNote(ctx,bus,'trumpet',m,t+hum(),dur,v,{pan:-.15});bNote(ctx,bus,'trumpet',m,t+hum()+.008,dur,v*.6,{detune:6,pan:.2});
      bNote(ctx,bus,'alto_sax',m<=83?m:m-12,t+hum(),dur,.42,{pan:.3});
      if(late||full&&bi>=12)bNote(ctx,bus,'piccolo',m+12,t+hum(),dur,.32,{pan:.1});
      if(bi<8&&beat%1===0)bNote(ctx,bus,'glockenspiel',m+12,t,.4,.28,{rel:.6});
      if(late)bNote(ctx,bus,'clarinet',m,t+hum(),dur,.25,{pan:-.3});
      const tones=[root,root+4,root+7].map(x=>((x%12)+12)%12),mm=m-12;let hm=mm-1;while(hm>mm-10&&!tones.includes(((hm-K)%12+12)%12))hm--;
      bNote(ctx,bus,'trombone',hm,t+hum(),dur,.55,{pan:.25})}
    // per-beat accompaniment
    for(let k=0;k<b;k+=.5){const bb=beat+k;if(bb>=maxBeats)break;const tt=t+k*sp,whole=Math.abs(bb-Math.round(bb))<1e-6,bInBar=Math.round(bb)%4,cr=S0.ch[Math.floor(bb/4+1e-6)%nb]||0;
      if(whole){
        if(bInBar%2===0)bNote(ctx,bus,'tuba',K-24+cr+(bInBar===2?7:0),tt,sp*.7,.9);
        if(bInBar===0||bInBar===2){bNote(ctx,bus,'french_horn',K+cr+4,tt,sp*1.8,.32,{pan:-.35});bNote(ctx,bus,'french_horn',K+cr+7,tt,sp*1.8,.28,{pan:-.4})}
        bDrum(ctx,bus,'kick',tt,bInBar%2===0?.95:.45,{rate:.6});
        if(bInBar%2===1)bDrum(ctx,bus,'crash_1',tt,.18,{cut:.22});
        bDrum(ctx,bus,'snare',tt,bInBar%2===1?.75:.5)}
      else{bDrum(ctx,bus,'snare',tt,.32+Math.random()*.08);if(Math.random()<.35)bDrum(ctx,bus,'snare',tt+sp/4,.22)}}
    if(beat%16===0)bDrum(ctx,bus,'crash_cymbal1',t,.45);
    t+=b*sp;beat+=b}
  // ending: held chord, roll, big hit
  if(full){const h0=t;for(let i=0;i<24;i++)bDrum(ctx,bus,'snare',h0+i*sp/8,.18+.5*i/24);
    const c=[K+12,K+16,K+19,K+24];bNote(ctx,bus,'trumpet',K+24,h0+sp*3,sp*3,1);bNote(ctx,bus,'trumpet',K+19,h0+sp*3,sp*3,.7);bNote(ctx,bus,'alto_sax',K+16,h0+sp*3,sp*3,.5);bNote(ctx,bus,'trombone',K+7,h0+sp*3,sp*3,.6);bNote(ctx,bus,'trombone',K+4,h0+sp*3,sp*3,.5);bNote(ctx,bus,'french_horn',K,h0+sp*3,sp*3,.4);bNote(ctx,bus,'tuba',K-24,h0+sp*3,sp*3,1);bNote(ctx,bus,'piccolo',K+36,h0+sp*3,sp*3,.3);
    bDrum(ctx,bus,'crash_cymbal2',h0+sp*3,.8);bDrum(ctx,bus,'kick',h0+sp*3,1,{rate:.55});t=h0+sp*6.5}
  return t-T0;
}
function audPref(){try{return localStorage.getItem('ss_sound')==='1'}catch(e){return false}}
function audInit(){
  if(AUD.ctx)return true;
  const AC=typeof window!=='undefined'&&(window.AudioContext||window.webkitAudioContext);if(!AC)return false;
  try{
    const c=new AC();AUD.ctx=c;AUD.master=c.createGain();AUD.master.gain.value=.8;{const cp=c.createDynamicsCompressor();cp.threshold.value=-12;cp.ratio.value=6;AUD.master.connect(cp);cp.connect(c.destination)}
    const len=c.sampleRate*2,b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;AUD.noise=b;
    const src=c.createBufferSource();src.buffer=b;src.loop=true;
    const f1=c.createBiquadFilter();f1.type='bandpass';f1.frequency.value=900;f1.Q.value=.45;
    const f2=c.createBiquadFilter();f2.type='lowpass';f2.frequency.value=2600;
    const g=c.createGain();g.gain.value=0;src.connect(f1);f1.connect(f2);f2.connect(g);g.connect(AUD.master);src.start();
    AUD.crowd=src;AUD.cg=g;try{bandLoad(c)}catch(e){}try{crowdBuild()}catch(e){}try{clipLoad()}catch(e){}return true;
  }catch(e){AUD.ctx=null;return false}
}
/* ---------- crowd voices v2: breathy multi-voice crowd, stadium reverb, chants ---------- */
const CRV={a:[760,1180,2500],o:[520,880,2400],e:[500,1700,2450],u:[360,800,2300],i:[320,2100,2800],ah:[680,1220,2500],eh:[560,1650,2450]};
function crIR(o,sec){const sr=o.sampleRate,n=Math.floor(sr*sec),b=o.createBuffer(2,n,sr);for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(let i=0;i<n;i++){const t=i/n;d[i]=(Math.random()*2-1)*Math.pow(1-t,3.2)*(i<sr*.02?i/(sr*.02):1)*(1+(i%(sr*.09|0)<sr*.004?1.5:0))}}return b}
async function crowdBuf(mode,secs){
  const OAC=window.OfflineAudioContext||window.webkitOfflineAudioContext,sr=22050,loop=['murmur','roar','clap'].includes(mode),xf=loop?.8:0,T=secs+xf+(loop?0:1.2);
  const o=new OAC(2,Math.ceil(sr*T),sr),rnd=Math.random;
  const nb=o.createBuffer(1,sr*2,sr),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=rnd()*2-1;
  const bus=o.createGain(),dry=o.createGain(),wet=o.createGain(),cv=o.createConvolver();cv.buffer=crIR(o,2.4);
  dry.gain.value=.75;wet.gain.value=mode==='murmur'?.35:.5;bus.connect(dry);bus.connect(cv);cv.connect(wet);dry.connect(o.destination);wet.connect(o.destination);
  const VK=Object.keys(CRV),setV=(fl,vw,fs,t,tc)=>fl.forEach((f,i)=>f.frequency.setTargetAtTime(vw[i]*fs,t,tc));
  // one voice: buzz + breath through 3 soft formants
  const voice=(f0,fem,pan,gv,gn)=>{const osc=o.createOscillator();osc.type='sawtooth';osc.frequency.value=f0;const lp=o.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;
    const sv=o.createGain();sv.gain.value=gv;osc.connect(lp);lp.connect(sv);
    const br=o.createBufferSource();br.buffer=nb;br.loop=true;const bn=o.createGain();bn.gain.value=gn;br.connect(bn);
    const fs=fem?1.15:1,fl=[0,1,2].map(i=>{const b=o.createBiquadFilter();b.type='bandpass';b.frequency.value=700;b.Q.value=[3.2,4.2,5][i];return b});
    const mix=o.createGain();mix.gain.value=0;fl.forEach((b,i)=>{sv.connect(b);bn.connect(b);const g=o.createGain();g.gain.value=[1.5,1,.4][i];b.connect(g);g.connect(mix)});
    const pn=o.createStereoPanner();pn.pan.value=pan;mix.connect(pn);pn.connect(bus);osc.start(0);br.start(0,rnd()*1.5);return {osc,fl,fs,G:mix.gain,f0}};
  const clap=(t,v)=>{for(let k=0;k<26;k++){const s=o.createBufferSource();s.buffer=nb;const f=o.createBiquadFilter();f.type='bandpass';f.frequency.value=1000+rnd()*1600;f.Q.value=1.2;const g=o.createGain(),tt=t+(rnd()-.5)*.045;g.gain.setValueAtTime(0,tt);g.gain.linearRampToValueAtTime(v*(.4+rnd()*.6)*.5,tt+.002);g.gain.setTargetAtTime(0,tt+.004,.012);const p=o.createStereoPanner();p.pan.value=rnd()*1.8-.9;s.connect(f);f.connect(g);g.connect(p);p.connect(bus);s.start(tt,rnd()*1.5);s.stop(tt+.15)}};
  const stomp=(t,v)=>{for(let k=0;k<10;k++){const os=o.createOscillator(),g=o.createGain(),tt=t+(rnd()-.5)*.05;os.frequency.setValueAtTime(90,tt);os.frequency.exponentialRampToValueAtTime(40,tt+.15);g.gain.setValueAtTime(v*.16,tt);g.gain.exponentialRampToValueAtTime(.001,tt+.25);os.connect(g);g.connect(bus);os.start(tt);os.stop(tt+.3)}};
  if(mode==='clap'){for(let k=0;k<secs*220;k++){const t=rnd()*(T-.05);const s=o.createBufferSource();s.buffer=nb;const f=o.createBiquadFilter();f.type='bandpass';f.frequency.value=900+rnd()*1900;f.Q.value=1.1;const g=o.createGain(),v=.2+rnd()*.8;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.002);g.gain.setTargetAtTime(0,t+.003,.008+rnd()*.012);const p=o.createStereoPanner();p.pan.value=rnd()*1.8-.9;s.connect(f);f.connect(g);g.connect(p);p.connect(bus);s.start(t,rnd()*1.5);s.stop(t+.12)}}
  else if(mode==='murmur'||mode==='roar'||mode==='groan'){
    const NV=mode==='murmur'?48:mode==='roar'?72:44;
    for(let v=0;v<NV;v++){const fem=rnd()<.42,f0=(fem?200:112)*(.82+rnd()*.36)*(mode==='roar'?1.35:mode==='groan'?1.1:1),dist=.3+rnd()*.7;
      const V=voice(f0,fem,rnd()*1.7-.85,mode==='murmur'?.45:.55,mode==='murmur'?.35:.5);
      if(mode==='murmur'){let t=rnd()*.5;V.G.setValueAtTime(0,0);while(t<T){const talk=rnd()<.55;if(talk){const n=2+Math.floor(rnd()*6);for(let s=0;s<n&&t<T;s++){const vw=CRV[VK[Math.floor(rnd()*VK.length)]],d=.09+rnd()*.16;setV(V.fl,vw,V.fs,t,.02);V.osc.frequency.setTargetAtTime(V.f0*(.88+rnd()*.24)*(1-s*.015),t,.03);V.G.setTargetAtTime((.5+rnd()*.5)*dist,t,.02);t+=d}V.G.setTargetAtTime(0,t,.04);t+=.3+rnd()*1.4}else t+=.4+rnd()*1.2}}
      else if(mode==='roar'){const vw0=[CRV.a,CRV.ah,CRV.o,CRV.eh][Math.floor(rnd()*4)];setV(V.fl,vw0,V.fs,0,.01);V.G.setValueAtTime(.6*dist,0);for(let t=0;t<T;t+=.35+rnd()*.7){V.G.linearRampToValueAtTime((.45+rnd()*.55)*dist,t);V.osc.frequency.linearRampToValueAtTime(V.f0*(.95+rnd()*.12),t);if(rnd()<.25)setV(V.fl,[CRV.a,CRV.ah,CRV.o,CRV.eh][Math.floor(rnd()*4)],V.fs,t,.12)}}
      else{const st=rnd()*.25;setV(V.fl,rnd()<.6?CRV.o:CRV.u,V.fs,0,.01);V.G.setValueAtTime(0,st);V.G.linearRampToValueAtTime(dist,st+.2);V.G.linearRampToValueAtTime(dist*.7,secs*.6);V.G.linearRampToValueAtTime(0,secs);V.osc.frequency.setValueAtTime(V.f0,st);V.osc.frequency.linearRampToValueAtTime(V.f0*.62,secs)}
    }
  }else{
    // chants: unison crowd, slight pitch and timing spread
    const NV=56,bpm=mode==='defense'?96:mode==='letsgo'?120:80,b=60/bpm;let plan=[],claps=[],stomps=[];
    if(mode==='defense'){for(let r=0;r<4;r++){const t0=.2+r*b*4;plan.push([t0,b*.8,CRV.i,1.19]);plan.push([t0+b,b*1.3,CRV.eh,1]);stomps.push(t0+b*2.5);claps.push(t0+b*3)}}
    else if(mode==='letsgo'){for(let r=0;r<3;r++){const t0=.2+r*b*8;plan.push([t0,b*.7,CRV.eh,1.12]);plan.push([t0+b,b*1.2,CRV.o,1]);[2,3,4,4.5,5].forEach(k=>claps.push(t0+b*k))}}
    else{plan.push([.2,secs-.6,CRV.o,1,'rise'])}
    for(let v=0;v<NV;v++){const fem=rnd()<.42,f0=(fem?210:118)*(.97+rnd()*.06),dist=.35+rnd()*.65,V=voice(f0,fem,rnd()*1.7-.85,.65,.38);V.G.setValueAtTime(0,0);
      for(const [t,d,vw,pm,rise] of plan){const tj=t+(rnd()-.5)*.06;setV(V.fl,vw,V.fs,tj-.02,.015);
        if(rise){V.osc.frequency.setValueAtTime(V.f0*.85,tj);V.osc.frequency.linearRampToValueAtTime(V.f0*1.35,tj+d);V.G.setValueAtTime(0,tj);V.G.linearRampToValueAtTime(dist*.4,tj+.4);V.G.linearRampToValueAtTime(dist,tj+d);V.G.setTargetAtTime(0,tj+d,.15);setV(V.fl,CRV.eh,V.fs,tj+d-.15,.05)}
        else{V.osc.frequency.setValueAtTime(V.f0*pm,tj);V.G.setTargetAtTime(dist,tj,.02);V.G.setTargetAtTime(dist*.75,tj+d*.5,.08);V.G.setTargetAtTime(0,tj+d,.05)}}}
    claps.forEach(t=>clap(t,1));stomps.forEach(t=>stomp(t,1));
  }
  const r=await o.startRendering();const n=Math.floor(sr*(loop?secs:T)),X=Math.floor(sr*xf),b=AUD.ctx.createBuffer(2,n,sr);
  let pk=1e-6;for(let ch=0;ch<2;ch++){const d=r.getChannelData(ch);for(let i=0;i<n;i++)pk=Math.max(pk,Math.abs(d[i]))}
  for(let ch=0;ch<2;ch++){const d=r.getChannelData(ch),w=b.getChannelData(ch);for(let i=0;i<n;i++){let s=d[i];if(i<X){const a=i/X;s=s*a+d[n+i]*(1-a)}w[i]=s/pk*.92}}
  return b;
}
function crowdBuild(){
  const c=AUD.ctx;if(!c||AUD.cb||!(window.OfflineAudioContext||window.webkitOfflineAudioContext))return;AUD.cb={};
  (async()=>{for(const [m,s] of [['murmur',8],['roar',6],['clap',4],['groan',2.4],['defense',10.5],['letsgo',12.6],['ohhh',3.6]]){try{AUD.cb[m]=await crowdBuf(m,s)}catch(e){}if(m==='clap')crowdWire()}})();
}
function crowdWire(){
  const c=AUD.ctx,B=AUD.cb;if(!B.murmur||!B.roar||AUD.voices)return;
  const mk=buf=>{const s=c.createBufferSource();s.buffer=buf;s.loop=true;const g=c.createGain();g.gain.value=0;s.connect(g);g.connect(AUD.master);s.start(c.currentTime,Math.random()*buf.duration);return g};
  if(!AUD.bed){AUD.mg=mk(B.murmur);AUD.rg=mk(B.roar)}if(B.clap)AUD.ag=mk(B.clap);
  if(AUD.cg)AUD.cg.gain.setTargetAtTime(0,c.currentTime,.3);AUD.voices=true;
}
function crowdBurst(g,peak,hold,rel){if(!g)return;const t=AUD.ctx.currentTime,cur=g.gain.value,pk=Math.max(cur,peak);g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(cur,t);g.gain.linearRampToValueAtTime(pk,t+.15);g.gain.setValueAtTime(pk,t+hold);g.gain.setTargetAtTime(0,t+hold,rel/3);AUD.burstTill=performance.now()+(hold+rel*.6)*1000}
function crowdOne(name,v){const c=AUD.ctx,B=AUD.cb;if(!B||!B[name])return false;const s=c.createBufferSource();s.buffer=B[name];s.playbackRate.value=.97+Math.random()*.06;const g=c.createGain();g.gain.value=v;s.connect(g);g.connect(AUD.master);s.start();return B[name].duration*1000}
function crowdGroan(v){return !!crowdOne('groan',.75*v)}
function crowdChant(name,v){if(!audOK()||!AUD.voices)return false;const now=performance.now();if(now<(AUD.songTill||0)||now<(AUD.chantTill||0))return false;const d=crowdOne(name,v);if(d)AUD.chantTill=now+d+4000;return !!d}
/* ---------- uploaded clips ---------- */
const CLIPS={kick:{url:'audio/kickoff_cheer.mp3'},bed:{url:'audio/crowd_bed.mp3'}};
function clipLoad(){const c=AUD.ctx;if(!c)return;for(const k in CLIPS){const C=CLIPS[k];if(C.buf||C.loading)continue;C.loading=fetch(C.url).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()}).then(a=>new Promise((res,rej)=>c.decodeAudioData(a,res,rej))).then(b=>{C.buf=b;if(k==='bed')bedWire()}).catch(()=>{C.loading=null})}}
function loopBuf(b,xf=1.2){const c=AUD.ctx,sr=b.sampleRate,X=Math.floor(sr*xf),n=b.length-X,o=c.createBuffer(b.numberOfChannels,n,sr);for(let ch=0;ch<b.numberOfChannels;ch++){const d=b.getChannelData(ch),w=o.getChannelData(ch);for(let i=0;i<n;i++){let s=d[i];if(i<X){const a=i/X;s=s*Math.sqrt(a)+d[n+i]*Math.sqrt(1-a)}w[i]=s}}return o}
function bedWire(){const c=AUD.ctx,C=CLIPS.bed;if(!c||!C.buf||AUD.bed)return;const L=loopBuf(C.buf);const mk=(off,hp)=>{const s=c.createBufferSource();s.buffer=L;s.loop=true;const g=c.createGain();g.gain.value=0;let n=s;if(hp){const f=c.createBiquadFilter();f.type='peaking';f.frequency.value=1800;f.Q.value=.8;f.gain.value=4;s.connect(f);n=f}n.connect(g);g.connect(AUD.master);s.start(c.currentTime,off%L.duration);return g};
  AUD.bed=true;const ct=c.currentTime;if(AUD.mg)AUD.mg.gain.setTargetAtTime(0,ct,.4);if(AUD.rg)AUD.rg.gain.setTargetAtTime(0,ct,.4);AUD.mg=mk(Math.random()*L.duration,false);AUD.rg=mk(Math.random()*L.duration,true);if(AUD.cg)AUD.cg.gain.setTargetAtTime(0,ct,.3);AUD.voices=AUD.voices||!!(AUD.cb&&AUD.cb.groan)}
function clipPlay(k,v=1,{off=0,dur=null,fade=.6}={}){const C=CLIPS[k];if(!audOK()||!C||!C.buf)return 0;const c=AUD.ctx,s=c.createBufferSource();s.buffer=C.buf;const g=c.createGain(),t=c.currentTime,L=dur||C.buf.duration-off;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+(off?fade:.05));if(dur){g.gain.setValueAtTime(v,t+L-fade);g.gain.linearRampToValueAtTime(0,t+L)}s.connect(g);g.connect(AUD.master);s.start(t,off,L);AUD.clipTill=performance.now()+L*1000;return L*1000}
function openCheer(cb){if(!G||G.phase!=='coin'||G.cheerDone||!audOK()||!CLIPS.kick.buf)return false;G.cheerDone=true;const d=clipPlay('kick',1);if(!d)return false;G.cheer=performance.now()+d;try{render()}catch(e){}
  setTimeout(()=>{if(!G)return;G.cheer=0;if(S.view==='game'&&G.phase==='coin')cb();else try{render()}catch(e){}},d+150);return true}
function hypeClip(rock){const C=CLIPS.kick;if(!C.buf)return false;const now=performance.now();if(now<(AUD.songTill||0)||now<(AUD.chantTill||0)||now<(AUD.clipTill||0)+2000)return false;const L=9,off=Math.random()*Math.max(0,C.buf.duration-L);const d=clipPlay('kick',Math.min(1,.65+rock*.3),{off,dur:L,fade:.8});if(d)AUD.chantTill=now+d+6000;return !!d}
function audSet(on){AUD.on=on;try{localStorage.setItem('ss_sound',on?'1':'0')}catch(e){}
  if(on){if(audInit()&&AUD.ctx.state==='suspended')AUD.ctx.resume()}else if(AUD.ctx&&AUD.cg){for(const g of [AUD.cg,AUD.mg,AUD.rg,AUD.ag])if(g){g.gain.cancelScheduledValues(AUD.ctx.currentTime);g.gain.setTargetAtTime(0,AUD.ctx.currentTime,.2)}}}
function audOK(){return AUD.on&&AUD.ctx&&AUD.ctx.state!=='closed'}
function aNoise(t,dur,{type='bandpass',f=1000,q=.5,f2=null,vol=.4,att=.05,rel=null}={}){
  const c=AUD.ctx,s=c.createBufferSource();s.buffer=AUD.noise;s.loop=true;const fl=c.createBiquadFilter();fl.type=type;fl.frequency.setValueAtTime(f,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+dur);fl.Q.value=q;
  const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+att);g.gain.setTargetAtTime(0,t+att,(rel||dur)/3);
  s.connect(fl);fl.connect(g);g.connect(AUD.master);s.start(t,Math.random()*1.5);s.stop(t+dur+1.5)}
function aTone(t,freq,dur,{type='sawtooth',vol=.12,cut=2200,det=0}={}){
  const c=AUD.ctx,o=c.createOscillator(),o2=c.createOscillator(),fl=c.createBiquadFilter(),g=c.createGain();
  o.type=type;o2.type=type;o.frequency.value=freq;o2.frequency.value=freq*1.006;o.detune.value=det;
  fl.type='lowpass';fl.frequency.setValueAtTime(cut*.45,t);fl.frequency.linearRampToValueAtTime(cut,t+.05);fl.frequency.setTargetAtTime(cut*.6,t+.08,.2);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.025);g.gain.setValueAtTime(vol*.85,t+Math.max(.04,dur-.06));g.gain.linearRampToValueAtTime(0,t+dur);
  o.connect(fl);o2.connect(fl);fl.connect(g);g.connect(AUD.master);o.start(t);o2.start(t);o.stop(t+dur+.05);o2.stop(t+dur+.05)}
function aKick(t,vol=.5){const c=AUD.ctx,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(42,t+.18);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+.3);o.connect(g);g.connect(AUD.master);o.start(t);o.stop(t+.32)}
function aSnare(t,vol=.18){aNoise(t,.12,{type:'highpass',f:1800,q:.7,vol,att:.003,rel:.12})}
function aCym(t,vol=.12){aNoise(t,1.4,{type:'highpass',f:6000,q:.3,vol,att:.005,rel:1.4})}
const mtof=m=>440*Math.pow(2,(m-69)/12);
function audSong(id,bars,vol){
  if(!audOK())return;
  if(BAND.ready){try{const d=bandPlay(AUD.ctx,AUD.master,id,{bars,vol:vol*1.1});AUD.songTill=performance.now()+d*1000+400;return}catch(e){}}const t0=AUD.ctx.currentTime+.08,tm=team(id),h=hashS((tm.name||'')+'band')>>>0;
  const mel=FIGHT[h%FIGHT.length],key=[58,60,62,63,65][(h>>>3)%5],bpm=124+((h>>>6)%4)*6,sp=60/bpm;
  let t=t0,beat=0;const maxB=bars?bars*4:1e9;
  for(const [n,b] of mel){if(beat>=maxB)break;
    if(n!=null){const m=key+n,nc=((n%12)+12)%12;aTone(t,mtof(m),b*sp*.92,{vol:.09*vol,cut:2600,type:'sawtooth'});aTone(t,mtof(m+12),b*sp*.9,{vol:.035*vol,cut:3600,type:'square'});
      const hm=[4,9,11].includes(nc)?m-4:m-3;aTone(t,mtof(hm),b*sp*.9,{vol:.05*vol,cut:1800,type:'sawtooth'})}
    for(let k=0;k<b*2;k++){const bt=t+k*sp/2,whole=(beat*2+k)%2===0,bi=Math.floor(beat+k/2);
      if(whole){const nc=n==null?0:((n%12)+12)%12,root=[5,9].includes(nc)?key-19:[2,11].includes(nc)?key-17:key-24;aTone(bt,mtof(bi%2?root+7:root),sp*.45,{vol:.09*vol,cut:500,type:'triangle'});
        if(bi%2===0)aKick(bt,.4*vol);else aSnare(bt,.16*vol)}else if(Math.random()<.5)aSnare(bt,.07*vol)}
    if(beat===0)aCym(t,.1*vol);t+=b*sp;beat+=b}
  aCym(t-sp,.12*vol);AUD.songTill=performance.now()+(t-t0)*1000+400;
}
function audCadence(){if(!audOK())return;const c=AUD.ctx,t0=c.currentTime+.05,sp=.21;const pat='x.x.xxx.x.x.xx.x';for(let r=0;r<2;r++)for(let i=0;i<16;i++){const t=t0+(r*16+i)*sp/2;if(pat[i]==='x')aSnare(t,.06+(i%4===0?.04:0));if(i%8===0)aKick(t,.18)}AUD.lastCad=performance.now()}
function audRoar(v=1){if(!audOK())return;if(AUD.voices||AUD.bed){crowdBurst(AUD.rg,Math.min(1.25,(AUD.bed?1.05:.95)*v),1.5,2.8);if(AUD.ag)crowdBurst(AUD.ag,.5*v,1.2,2.4);return}const t=AUD.ctx.currentTime;aNoise(t,3.2,{f:1100,q:.35,vol:.42*v,att:.25,rel:3});aNoise(t,2.6,{f:2400,q:.5,vol:.18*v,att:.12,rel:2.4})}
function audGroan(v=1){if(!audOK())return;if(AUD.voices&&crowdGroan(v))return;const t=AUD.ctx.currentTime;aNoise(t,1.8,{f:650,f2:260,q:.8,vol:.4*v,att:.1,rel:1.6})}
function audWhistle(){if(!audOK())return;const c=AUD.ctx,t=c.currentTime+.02,o=c.createOscillator(),l=c.createOscillator(),lg=c.createGain(),g=c.createGain(),f=c.createBiquadFilter();
  o.type='square';o.frequency.value=2900;l.frequency.value=28;lg.gain.value=140;l.connect(lg);lg.connect(o.frequency);f.type='bandpass';f.frequency.value=3000;f.Q.value=2;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05,t+.02);g.gain.setValueAtTime(.05,t+.32);g.gain.linearRampToValueAtTime(0,t+.4);o.connect(f);f.connect(g);g.connect(AUD.master);o.start(t);l.start(t);o.stop(t+.45);l.stop(t+.45)}
function audThump(){if(!audOK())return;aKick(AUD.ctx.currentTime+.01,.35)}
function audCharge(){if(!audOK())return;const t0=AUD.ctx.currentTime+.05,k=67,sp=.16;[[0,1],[5,1],[9,1],[12,2],[9,1],[12,5]].reduce((t,[n,b])=>{aTone(t,mtof(k+n),b*sp*.9,{vol:.08,cut:3000,type:'square'});return t+b*sp},t0);setTimeout(()=>audRoar(.45),sp*11*1000)}
function audFlash(txt,side){
  if(!audOK()||!G)return;const home=side===homeSide(),T=txt||'';
  if(/TOUCHDOWN/.test(T)){home?audRoar(1):audGroan(1);if(!home)audRoar(.25);setTimeout(()=>audSong(teamOf(side).id,4,home?1:.55),1300)}
  else if(/PICKED|FUMBLE|STOPPED|SAFETY/.test(T)){home?audRoar(.85):audGroan(.9)}
  else if(/BIG PLAY/.test(T)){home?audRoar(.7):audGroan(.6)}
  else if(/GOOD/.test(T)){home?audRoar(.6):audGroan(.4)}
}
function audSnap(P){if(!audOK()||!G)return;if(P&&P.side!==homeSide()&&G.down===3&&R()<.6)audCharge()}
function audTick(dt){
  if(!audOK()||!AUD.cg)return;
  const inGame=S&&S.view==='game'&&G,h=inGame?(SC.hype||.2):0,target=inGame?.025+.2*Math.min(1,h):0;
  const ct=AUD.ctx.currentTime;
  if(AUD.voices||AUD.bed){AUD.cg.gain.setTargetAtTime(0,ct,.35);let rock=0;try{rock=inGame?crowdRock():0}catch(e){}
    AUD.mg.gain.setTargetAtTime(inGame?(AUD.bed?.32+.3*Math.min(1,h):.09+.14*Math.min(1,h)):0,ct,.4);
    if(!(performance.now()<(AUD.burstTill||0))){AUD.rg.gain.setTargetAtTime(inGame?Math.max(0,Math.min(1,h)-.3)*.38+rock*.34:0,ct,.5);if(AUD.ag)AUD.ag.gain.setTargetAtTime(inGame?rock*.08:0,ct,.4)}
    if(inGame&&!SC.A&&['off','def'].includes(G.phase)){const hs=homeSide(),hd=G.poss!==hs;if(hd&&rock>.5&&Math.random()<dt*.6){if(!(Math.random()<.6&&hypeClip(rock)))crowdChant('defense',Math.min(1,.55+rock*.35))}else if(!hd&&!G.neutral&&Math.random()<dt*.03)crowdChant('letsgo',.55)}}
  else AUD.cg.gain.setTargetAtTime(target,ct,.35);
  if(!inGame)return;
  const now=performance.now();
  if(G.phase==='half'&&AUD.halfDone!==G.gid+':'+S.season){AUD.halfDone=G.gid+':'+S.season;audSong(teamOf(homeSide()).id,0,1);return}
  if(G.phase==='over'&&AUD.endDone!==G.gid+':'+S.season){AUD.endDone=G.gid+':'+S.season;const w=G.su>G.sc?'u':'c';audRoar(w===homeSide()?1.2:.5);setTimeout(()=>audSong(teamOf(w).id,0,w===homeSide()?1:.6),1500);return}
  if(!SC.A&&now>AUD.songTill&&now-AUD.lastCad>14000&&['off','def'].includes(G.phase)&&Math.random()<dt*.08)audCadence();
}
if(typeof document!=='undefined'&&document.addEventListener){const un=()=>{if(audPref()){AUD.on=true;if(audInit()&&AUD.ctx.state==='suspended')AUD.ctx.resume()}};document.addEventListener('pointerdown',un,{once:true});document.addEventListener('keydown',un,{once:true})}
function startPlay(P,user){
  const ot=P.side,dtm=other(ot);
  for(const k in SC.pl)SC.pl[k].vis=false;
  const pre=[];let mx=0;
  for(const s in P.spots){const p=getP(ot,s),tx=P.spots[s][0],ty=P.los+P.spots[s][1];if(!p.wasVis||Math.hypot(p.x-tx,p.y-ty)>18){p.x=tx;p.y=ty}p.vis=true;const d=Math.hypot(p.x-tx,p.y-ty);mx=Math.max(mx,d);pre.push([p,tx,ty])}
  for(const s in P.dsp){const p=getP(dtm,s);const tx=P.dsp[s][0],ty=Math.min(109,P.los+P.dsp[s][1]);if(!p.wasVis||Math.hypot(p.x-tx,p.y-ty)>18){p.x=tx;p.y=ty}p.vis=true;const d=Math.hypot(p.x-tx,p.y-ty);mx=Math.max(mx,d);pre.push([p,tx,ty])}
  for(const k in SC.pl)SC.pl[k].wasVis=SC.pl[k].vis;
  const uc=FORMS[P.form].qb>-2;
  const A={kind:'play',P,t:0,spd:S.fast?1.7:1,user,await:false,thrown:false,scr:false,sacked:false,air:null,carrier:null,cPath:null,res:null,endT:1e9,hold:.8,holder:uc?ot+'.QB':null,ball:{x:P.bx,y:P.los,z:.3},tackled:false,live:false,handed:false};
  if(!uc)A.air={x0:P.bx,y0:P.los,z0:.4,x1:P.spots.QB[0],y1:P.los+P.spots.QB[1],z1:1.3,t0:0,t1:.22,h:.4,snap:1};
  if(P.isRun){A.carrier=ot+'.'+P.carrier;A.cPath=P.cPath;A.res=P.run;A.endT=P.endT;if(P.th===0){A.holder=A.carrier;A.handed=true;A.live=true}if(P.td||P.run.yds>=15)A.hold=1.2}
  else if(user!==true)A.auto=autoThrow(P,1.6);
  if(mx>.6){A.pre=pre;A.t=-(Math.min(1.5,mx/6.5)+.45)}
  SC.A=A;SC.hype=Math.max(SC.hype,.35);try{if(G&&bigRiv(S.games[G.gid])&&G.down===3&&R()<.55)log(pick(BIGR.log),'k');else{const EV=envG();if(EV.theme&&P.side!==homeSide()&&G.down>=3&&R()<.4)log(pick(['The '+THEME[EV.theme].w+' is deafening. '+abbrOf(P.side)+' going to the silent count.','Every fan on their feet in the '+THEME[EV.theme].w+'. You cannot hear a thing.','The '+THEME[EV.theme].w+' is rattling '+abbrOf(P.side)+'. They barely got the snap off.']),'k')}}catch(e){}try{audSnap(P)}catch(e){}
}
function startKick(side,k){
  try{if(k.type==='ko'&&G&&side===homeSide()&&!G.neutral)crowdChant('ohhh',.8)}catch(e){}
  const ko=k.type==='ko',los=ko?35:G.ball,bx=ko?MID:G.bx,o={};
  kickLayout(o,k.type,side,los,bx);
  for(const kk in SC.pl)SC.pl[kk].vis=false;
  for(const kk in o){const [tm,sl]=kk.split('.');const p=getP(tm,sl);p.vis=true;p.x=o[kk][0];p.y=o[kk][1]}
  const A={kind:'kick',k,side,t:0,spd:S.fast?1.7:1,ball:{x:bx,y:los,z:.3},endT:0,hold:.9,holder:null};
  if(k.type==='fg'){
    const mx=k.good?gauss()*.5:k.miss==='short'?gauss()*1.5:k.miss==='wide left'?-4.8:4.8;
    A.snap={x0:bx,y0:los,x1:bx-.4,y1:los-7,t1:.35};
    A.air={x0:bx-.4,y0:los-7,z0:.3,x1:MID+mx,y1:k.miss==='short'?106:114,z1:k.miss==='short'?0:3.5,t0:.55,t1:.55+1.35+(100-los)*.006,h:k.miss==='short'?4:8+(100-los)*.08};
    A.endT=A.air.t1;
  }else if(ko&&k.onside){
    for(const kk in SC.pl){const p=SC.pl[kk];if(p.vis&&p.team===other(side))p.y=clamp(k.land+3+R()*9,40,70)}
    A.snap={x0:bx,y0:los,x1:bx,y1:los,t1:.05};
    A.air={x0:bx,y0:los,z0:.3,x1:k.lx,y1:k.land,z1:0,t0:.75,t1:.75+1.25,h:1.6};A.retEnd=null;A.onside=true;A.endT=A.air.t1+1.4;A.hold=1.1;
  }else if(ko){
    const land=Math.min(108,k.land),lx=clamp(bx+gauss()*7,8,45);
    A.snap={x0:bx,y0:los,x1:bx,y1:los,t1:.05};
    A.air={x0:bx,y0:los,z0:.3,x1:lx,y1:land,z1:land>=100?0:1.4,t0:.75,t1:.75+3.1,h:15};
    const ret=SC.pl[other(side)+'.FS'];ret.x=lx;ret.y=Math.min(land,108);
    A.retEnd=k.tb?null:k.rtd?[clamp(lx+gauss()*8,4,49),-4]:[clamp(lx+gauss()*5,3,50),100-k.nb];
    A.endT=A.air.t1+(k.tb?.6:Math.max(.6,Math.abs(land-A.retEnd[1])/8.8));if(k.rtd)A.hold=1.4;
  }else{
    const land=Math.min(107,k.land),lx=clamp(bx+gauss()*6,5,48);
    A.snap={x0:bx,y0:los,x1:bx,y1:los-13.5,t1:.5};
    A.air={x0:bx,y0:los-13.5,z0:1.4,x1:lx,y1:land,z1:land>=100?0:1.4,t0:.95,t1:4.3,h:17};
    const ret=SC.pl[other(side)+'.FS'];ret.x=lx;ret.y=Math.min(land,108);
    A.retEnd=k.tb?null:k.rtd?[clamp(lx+gauss()*8,4,49),-4]:[clamp(lx+gauss()*5,3,50),100-k.nb];
    A.endT=A.air.t1+(k.tb?.4:Math.max(.5,Math.abs(land-A.retEnd[1])/8.4));if(k.rtd||k.ret>=20)A.hold=1.3;
  }
  SC.A=A;SC.hype=Math.max(SC.hype,.4);try{audThump()}catch(e){}
}
function stepAnim(A,dt){if(A.kind==='play')stepPlay(A,dt);else stepKick(A,dt)}
function stepPlay(A,dt){
  const P=A.P,ot=P.side,dtm=other(ot);
  if(A.t<0&&A.pre){A.t+=dt;const rem=Math.max(.05,-A.t-.4);for(const [p,tx,ty] of A.pre){const d=Math.hypot(tx-p.x,ty-p.y);if(d>.02)moveTo(p,tx,ty,Math.max(3,d/rem),dt)}A.ball.x=P.bx;A.ball.y=P.los;A.ball.z=.3;if(A.t<0)return;for(const [p,tx,ty] of A.pre){p.x=tx;p.y=ty;p.vx=0;p.vy=0}A.t=0;return}
  A.t+=dt;const t=A.t;
  if(A.scoopBy&&!A.scooped&&t>=A.scoopAt){const dp=SC.pl[A.scoopBy];if(dp){A.scooped=true;A.carrier=A.scoopBy;A.holder=A.scoopBy;A.live=true;A.loose=null;A.intT=t;A.tackled=false;A.brk=true;const ex=clamp(dp.x+gauss()*5,3,50),dur=Math.max(.6,Math.hypot(ex-dp.x,-4-dp.y)/8.6);A.cPath=[[t,dp.x,dp.y],[t+dur,ex,-4]];A.endT=t+dur;A.hold=1.3}}
  const chaseO=A.intT!=null&&t>=A.intT;
  if(A.res&&A.brk==null){const r=A.res;A.brk=!!((r.kind==='run'||r.kind==='comp'||r.kind==='scr')&&(P.los+(r.yds||0)>=100))||!!(r.kind==='int'&&r.six)}
  const carP=A.carrier&&A.live?SC.pl[A.carrier]:null;if(carP)rankChasers(A,carP);
  for(const s in P.paths){const p=SC.pl[ot+'.'+s];if(!p||!p.vis||!P.paths[s])continue;if(p.k===A.carrier&&A.cPath)continue;if(chaseO)continue;
    const pa=P.paths[s],pend=pa.length>1?pa[pa.length-2][0]:0;
    if(carP&&carP.team===ot&&(t>pend||(A.cAt!=null&&t>A.cAt+.35))){const off=clamp(p.x-carP.x,-7,7)*.55,ty=carP.y-1.2-Math.abs(off)*.15,tx=carP.x+off,d=Math.hypot(tx-p.x,ty-p.y);if(Math.hypot(p.x-carP.x,p.y-carP.y)>2)moveTo(p,tx,ty,A.tackled?2.5:6.6,dt);continue}
    setPos(p,samp(pa,t),dt)}
  if(A.cPath&&A.carrier){const p=SC.pl[A.carrier];if(p)setPos(p,samp(A.cPath,t),dt)}
  if(P.isRun&&!A.handed&&t>=P.th){A.handed=true;A.holder=A.carrier;A.live=true}
  if(!P.isRun&&!A.thrown&&!A.scr&&!A.sacked){
    if(A.user===true){const w=t>=.3;if(w!==A.await){A.await=w;refreshCtrl()}}
    else if(A.auto&&t>=A.auto.t){if(A.auto.scr)doScramble(A);else if(A.auto.away)throwAway(A);else if(!A.auto.sack)throwTo(A,A.auto.i)}
    if(!A.thrown&&!A.scr&&t>=P.ts){A.sacked=true;A.await=false;A.res=sackRes(P);A.endT=t+.12;refreshCtrl()}
  }
  if(A.air&&t>=A.air.t1){const a=A.air;A.air=null;if(a.snap)A.holder=ot+'.QB';else arrive(A,a)}
  for(const s of DSLOTS){const p=SC.pl[dtm+'.'+s];if(!p||!p.vis)continue;if(p.k===A.carrier&&A.cPath)continue;defMove(A,p,s,dt)}
  if(chaseO&&A.carrier){const c=SC.pl[A.carrier];for(const s in P.spots){const p=SC.pl[ot+'.'+s];if(p&&p.vis)chase(A,p,c,6.8,dt)}}
  const b=A.ball;
  if(A.air){const a=A.air,k=clamp((t-a.t0)/(a.t1-a.t0),0,1);b.x=a.x0+(a.x1-a.x0)*k;b.y=a.y0+(a.y1-a.y0)*k;b.z=a.z0+(a.z1-a.z0)*k+4*a.h*k*(1-k)}
  else if(A.holder&&SC.pl[A.holder]){const h=SC.pl[A.holder];b.x=h.x+.35;b.y=h.y+.2;b.z=1.1}
  else if(A.loose){b.x+=(A.loose.x-b.x)*Math.min(1,dt*6);b.y+=(A.loose.y-b.y)*Math.min(1,dt*6);b.z=Math.max(.15,b.z-dt*6)}
  if(!A.tackled&&!A.brk&&A.carrier&&A.live&&t>A.endT-.3&&t<A.endT){const c=SC.pl[A.carrier];if(c){let bd=null,bv=1e9;for(const s of DSLOTS){const p=SC.pl[dtm+'.'+s];if(!p||!p.vis)continue;const d=Math.hypot(p.x-c.x,p.y-c.y);if(d<bv){bv=d;bd=p}}if(bd&&bv>1.6){const k=Math.min(1,dt*9);bd.x+=(c.x+(bd.x-c.x)/bv*1.3-bd.x)*k;bd.y+=(c.y+(bd.y-c.y)/bv*1.3-bd.y)*k}}}
  if(t>=A.endT&&!A.tackled){A.tackled=true;tackle(A)}
  if(t>=A.endT+A.hold)finishPlay(A);
}
function scoreDir(A,c){return c.team===(A.P?A.P.side:A.side)?1:-1}
function inEZ(A,c){const d=scoreDir(A,c);return d>0?c.y>=100:c.y<=0}
function chase(A,p,c,sp,dt){
  if(!c)return;
  const d=Math.hypot(p.x-c.x,p.y-c.y),cs=Math.hypot(c.vx||0,c.vy||0),rank=p.chRank==null?0:p.chRank;
  if(inEZ(A,c)||A.brk&&cs<1&&A.t>A.endT){if(d>4)moveTo(p,c.x+(p.x-c.x)/d*4,c.y+(p.y-c.y)/d*4,2.6,dt);return}
  if(A.tackled){const keep=rank<2?1.1:2.4+rank*.55;if(d>keep)moveTo(p,c.x+(p.x-c.x)/d*keep,c.y+(p.y-c.y)/d*keep,rank<2?6:3.2,dt);return}
  if(A.brk&&cs>3)sp=Math.min(sp,cs*.9);
  if(!A.brk&&rank<2&&A.cPath&&A.endT>A.t&&p.team!==c.team){const e=A.cPath[A.cPath.length-1],tl=Math.max(.12,A.endT-A.t),ox=p.x-e[1],oy=p.y-e[2],dE=Math.hypot(ox,oy)||1,gx=e[1]+ox/dE*(rank?1.6:.9),gy=e[2]+oy/dE*(rank?1.6:.9),need=Math.hypot(gx-p.x,gy-p.y)/tl;if(need>sp*.8&&d>2.2){moveTo(p,gx,gy,Math.min(17,Math.max(sp,need)),dt);if(d<1.35&&d>0){p.x=c.x+(p.x-c.x)/d*1.35;p.y=c.y+(p.y-c.y)/d*1.35}return}}
  const lead=Math.min(.6,d/14);moveTo(p,c.x+(c.vx||0)*lead,c.y+(c.vy||0)*lead,sp,dt);
  if(d<1.35&&d>0){p.x=c.x+(p.x-c.x)/d*1.35;p.y=c.y+(p.y-c.y)/d*1.35}
}
function rankChasers(A,c,team){
  const list=[];for(const k in SC.pl){const p=SC.pl[k];if(!p.vis||p.team===c.team)continue;list.push([Math.hypot(p.x-c.x,p.y-c.y),p])}
  list.sort((a,b)=>a[0]-b[0]).forEach(([d,p],i)=>p.chRank=i);
}
function defMove(A,p,s,dt){
  const P=A.P,t=A.t,role=P.roles[s],los=P.los,ot=P.side,qb=SC.pl[ot+'.QB'];
  const car=A.carrier&&A.live?SC.pl[A.carrier]:null;
  if(car&&car.team!==p.team){
    const sp=role.m==='rush'?(P.isRun&&t<P.th+.45?2.5:6.2):7.4+(s.charCodeAt(s.length-1)%3)*.3;
    return chase(A,p,car,sp,dt);
  }
  let tx=p.x,ty=p.y,sp=6.5;
  if(A.air&&!A.air.snap&&role.m!=='rush'){
    const ax=A.air.x1,ay=A.air.y1,d=Math.hypot(ax-p.x,ay-p.y),picker=A.res&&A.res.kind==='int'&&A.res.by===s,cov=role.m==='cover'&&role.r===(A.res&&A.res.target);
    if(picker){tx=ax;ty=ay;sp=13}
    else if(cov||d<11){const stop=A.res&&A.res.kind==='comp'?(cov?1.3:2.4):A.res&&A.res.kind==='inc'&&cov?.6:1.6;tx=ax+(p.x-ax)/(d||1)*stop;ty=ay+(p.y-ay)/(d||1)*stop;sp=cov?8.6:6.6}
    else{const z=P.dsp[s];tx=z[0]+(ax-z[0])*.25;ty=Math.min(109,los+Math.max(z[1],6.5)+(ay-los-Math.max(z[1],6.5))*.25);sp=5}
  }
  else if(A.air&&!A.air.snap){tx=p.x;ty=p.y;sp=2.5}
  else if(P.isRun){
    if(role.m==='rush'){tx=p.x;ty=los+.35;sp=3}else{tx=p.x;ty=Math.max(los+1.5,p.y-.6);sp=2.5}
  }else if(role.m==='rush'){
    const gap=(P.dsp[s][0]-P.bx)*.35;
    if(s===P.sacker&&t>=P.tp){tx=qb.x;ty=qb.y;const d=Math.hypot(tx-p.x,ty-p.y);sp=Math.max(5,d/Math.max(.05,P.ts-t))}
    else if(t>=P.tp+.5){tx=qb.x+gap;ty=qb.y+1.6;sp=2.4}
    else{tx=qb.x+gap*2.2;ty=los+.35;sp=5}
  }else if(role.m==='cover'){
    const rp=SC.pl[ot+'.'+role.r],rc=P.recv.find(r=>r.slot===role.r);
    if(rp&&rc){const o=clamp(openAt(rc,t),0,1),sep=-.9+o*5.4;tx=rp.x-rp.dx*sep;ty=rp.y-rp.dy*sep;sp=9.5}
  }else{
    const z=P.dsp[s],deep=s==='FS'||s==='SS'?Math.max(z[1],12):s[0]==='C'?Math.max(z[1],9):Math.max(z[1],6.5);
    tx=z[0];ty=Math.min(109,los+deep);sp=5.5;
  }
  moveTo(p,tx,ty,sp,dt);
  if(role.m==='rush'&&!A.air&&!car&&!(s===P.sacker&&t>=P.tp))p.y=Math.max(p.y,los+.3);
}
function tackle(A){
  const r=A.res;if(!r||!A.carrier)return;
  if(!['run','comp','scr','int','fum'].includes(r.kind))return;
  const c=SC.pl[A.carrier];if(!c)return;
  if((c.team===A.P.side&&c.y>=100)||(r.kind==='int'&&r.six)||A.scooped)return;
  let best=null;for(const k in SC.pl){const p=SC.pl[k];if(!p.vis||p.team===c.team)continue;const d=Math.hypot(p.x-c.x,p.y-c.y);if(!best||d<best.d)best={p,d}}
  A.tkT=A.t;if(best)A.tkr=best.p.k;
  if(best&&best.d<3.5){const p=best.p,d=best.d||1;p.x=c.x+(p.x-c.x)/d*.85;p.y=c.y+(p.y-c.y)/d*.85;fxPush('pop',(p.x+c.x)/2,(p.y+c.y)/2)}
  else if(best)fxPush('pop',c.x,c.y);
  if(r.kind==='fum'||(r.kind==='sack'&&r.lost)){A.holder=null;A.loose={x:c.x+gauss()*1.2,y:c.y+1+R()};
    if(r.scoop&&best){A.scoopBy=best.p.k;A.scoopAt=A.t+.45;A.endT=A.t+3;A.hold=.2}}
}
function arrive(A,a){
  const r=A.res,P=A.P,ot=P.side,dtm=other(ot);
  if(r.kind==='comp'){
    A.carrier=ot+'.'+r.target;A.holder=A.carrier;A.live=true;A.cAt=A.t;{const cp=SC.pl[A.carrier];if(cp)fxPush('catch',cp.x,cp.y)}
    const mx=a.x1+(r.ex-a.x1)*.3,my=a.y1+(r.ey-a.y1)*.72,d1=Math.max(.2,Math.hypot(mx-a.x1,my-a.y1)/8.6),d2=Math.max(.15,Math.hypot(r.ex-mx,r.ey-my)/8.6),dur=d1+d2;A.cPath=[[A.t,a.x1,a.y1],[A.t+d1,mx,my],[A.t+dur,r.ex,r.ey]];A.endT=A.t+dur;
    if(P.los+r.yds>=100||r.yds>=20)A.hold=1.2;
  }else if(r.kind==='int'){
    const k=dtm+'.'+(r.by||'FS'),dp=SC.pl[k];A.carrier=k;A.holder=k;A.live=true;A.intT=A.t;
    if(dp){dp.x=a.x1;dp.y=a.y1}
    const ey=r.six?-4:Math.max(.8,a.y1-r.ret),ex=clamp(a.x1+gauss()*4,1,52),dur=Math.max(.35,Math.hypot(ex-a.x1,ey-a.y1)/8.4);
    A.cPath=[[A.t,a.x1,a.y1],[A.t+dur,ex,ey]];A.endT=A.t+dur;A.hold=1.2;
  }else{A.loose={x:a.x1,y:a.y1};A.holder=null;A.endT=A.t+.15}
  refreshCtrl();
}
function throwTo(A,i){
  if(A.thrown||A.scr||A.sacked)return;
  const P=A.P,r=throwRes(P,i,A.t),qp=SC.pl[P.side+'.QB'];
  A.thrown=true;A.await=false;A.res=r;A.holder=null;
  let x1=r.cx,y1=r.cy,z1=1.2;
  if(r.kind==='inc'){x1+=gauss()*1.6;y1+=ri(1,3);z1=.1}
  const dist=Math.hypot(x1-qp.x,y1-qp.y);
  A.air={x0:qp.x,y0:qp.y,z0:2,x1,y1,z1,t0:A.t,t1:r.tc,h:Math.min(11,.8+dist*.17)};
  if(dist>22)SC.hype=Math.max(SC.hype,.75);
  refreshCtrl();
}
function throwAway(A){
  if(A.thrown||A.scr||A.sacked)return;
  const P=A.P,qp=SC.pl[P.side+'.QB'];A.thrown=true;A.await=false;A.res={kind:'inc',away:1};A.holder=null;
  A.air={x0:qp.x,y0:qp.y,z0:2,x1:qp.x<MID?-3:FW+3,y1:P.los+5,z1:.2,t0:A.t,t1:A.t+.8,h:3};
  A.endT=A.air.t1+.1;refreshCtrl();
}
function doScramble(A){
  if(A.thrown||A.scr||A.sacked)return;
  const P=A.P,q=SC.pl[P.side+'.QB'],r=scrRes(P,A.t);
  A.scr=true;A.await=false;A.res=r;A.carrier=q.k;A.holder=q.k;A.live=true;
  const ex=r.oob?(q.x<MID?-.4:53.7):clamp(q.x+gauss()*4,2,51),ey=Math.min(104,P.los+r.yds),mx=q.x+(ex-q.x)*.3,my=q.y+(ey-q.y)*.72,d1=Math.max(.25,Math.hypot(mx-q.x,my-q.y)/7.6),dur=d1+Math.max(.15,Math.hypot(ex-mx,ey-my)/7.6);
  A.cPath=[[A.t,q.x,q.y],[A.t+d1,mx,my],[A.t+dur,ex,ey]];A.endT=A.t+dur;refreshCtrl();
}
function stepKick(A,dt){
  A.t+=dt;const t=A.t,k=A.k,ot=A.side,dtm=other(ot),b=A.ball;
  const K=SC.pl[ot+'.K'];
  if(t<A.snap.t1){const s=t/A.snap.t1;b.x=A.snap.x0+(A.snap.x1-A.snap.x0)*s;b.y=A.snap.y0+(A.snap.y1-A.snap.y0)*s;b.z=.6+s*.6}
  else if(t<A.air.t0){b.x=A.snap.x1;b.y=A.snap.y1;b.z=k.type==='fg'||k.type==='ko'?.3:1.3;if(k.type==='fg'&&K)moveTo(K,A.snap.x1-.5,A.snap.y1-.6,5,dt);if(k.type==='ko'&&K)moveTo(K,A.snap.x1-.4,A.snap.y1-.5,7.5,dt)}
  else if(t<=A.air.t1){const a=A.air,s=clamp((t-a.t0)/(a.t1-a.t0),0,1);b.x=a.x0+(a.x1-a.x0)*s;b.y=a.y0+(a.y1-a.y0)*s;b.z=a.z0+(a.z1-a.z0)*s+4*a.h*s*(1-s)}
  if(k.onside){const bx2=A.air.x1,by2=A.air.y1;
    if(t>.6)Object.values(SC.pl).forEach((p,i)=>{if(!p.vis||p.slot==='K')return;const a=i*2.4,r=t>A.air.t1?.8+(i%4)*.5:2+(i%5);moveTo(p,bx2+Math.cos(a)*r,by2+Math.sin(a)*r*.6,8,dt)});
    if(t>A.air.t1){b.x=bx2+Math.sin(t*18)*.15;b.y=by2;b.z=.15;if(!A.lab&&t>A.air.t1+.5){A.lab=1;fxPush('label',bx2,by2,(k.rec===ot?abbrOf(ot)+' RECOVERS!':abbrOf(dtm)+' BALL'))}}
  }else if(k.type==='punt'||k.type==='ko'){
    const land=A.air.y1,lx=A.air.x1,ret=SC.pl[dtm+'.FS'];
    const cov=Object.values(SC.pl).filter(p=>p.vis&&p.team===ot&&p.slot!=='K').sort((a,b)=>a.x-b.x);
    const blk=Object.values(SC.pl).filter(p=>p.vis&&p.team===dtm&&p.slot!=='FS');
    const live=t>A.air.t1&&A.retEnd&&ret,done=t>=A.endT;
    if(live&&!A.retSet){A.retSet=1;A.brk=!!k.rtd;
      if(!k.rtd&&(k.ret||0)<=1&&k.type==='punt'){A.fair=true;A.retEnd=[ret.x,ret.y];A.endT=t+1.1;fxPush('label',ret.x,ret.y,'FAIR CATCH')}
      else if(!A.brk){let dm=99;for(const p of cov)dm=Math.min(dm,Math.hypot(p.x-A.retEnd[0],p.y-A.retEnd[1]));const need=Math.max(0,dm-1.2)/10.5;if(A.endT-t<need)A.endT=t+need}}
    cov.forEach((p,i)=>{if(t<.55)return;const lane=6+i*(41/Math.max(1,cov.length-1));
      if(live){if(done||ret.y<=0){const d=Math.hypot(p.x-ret.x,p.y-ret.y),keep=p.chRank<2?1.2:3+p.chRank*.4;if(d>keep)moveTo(p,ret.x+(p.x-ret.x)/d*keep,ret.y+(p.y-ret.y)/d*keep,p.chRank<2?5:2.6,dt)}else{const cs=Math.hypot(ret.vx||0,ret.vy||0);let sp=7.6;if(A.brk)sp=Math.min(sp,Math.max(4,cs*.85));const rk=p.chRank==null?9:p.chRank;if(!A.brk&&rk<3&&A.retEnd){const e=A.retEnd,tl=Math.max(.15,A.endT-t),ox=p.x-e[0],oy=p.y-e[1],dE=Math.hypot(ox,oy)||1,off=rk===0?.9:1.8+rk*.6,gx=e[0]+ox/dE*off,gy=e[1]+oy/dE*off;moveTo(p,gx,gy,Math.min(17,Math.max(sp,Math.hypot(gx-p.x,gy-p.y)/tl)),dt)}else moveTo(p,ret.x,ret.y,sp,dt)}}
      else{const tx=lane+(lx-lane)*Math.min(1,t/3.2),ty=Math.min(land-3-(i%3)*2.5,p.y+12),need=Math.hypot(tx-p.x,(Math.min(land-3,ty))-p.y)/Math.max(.35,A.air.t1+.3-t);moveTo(p,tx,ty,Math.min(11.5,Math.max(6.8,need)),dt)}});
    blk.forEach((p,i)=>{if(t<.6)return;
      if(live){const tgt=cov[i%Math.max(1,cov.length)];if(tgt){const d=Math.hypot(tgt.x-p.x,tgt.y-p.y);if(d>1.3)moveTo(p,tgt.x,tgt.y+.8,6.2,dt)}}
      else moveTo(p,p.x+(lx-p.x)*.35,Math.min(land-6,p.y+16),5.2,dt)});
    if(live){if(!done&&!A.fair)moveTo(ret,A.retEnd[0],A.retEnd[1],A.brk?Math.max(8.4,Math.hypot(A.retEnd[0]-ret.x,A.retEnd[1]-ret.y)/Math.max(.2,A.endT-t)):Math.max(4.5,Math.min(9.5,Math.hypot(A.retEnd[0]-ret.x,A.retEnd[1]-ret.y)/Math.max(.15,A.endT-t))),dt);rankChasers(A,ret);b.x=ret.x+.3;b.y=ret.y;b.z=1.1}
    else if(t>A.air.t1&&!A.retEnd){b.z=Math.max(.15,b.z-dt*3);b.y=Math.min(b.y+dt*3,108)}
  }
  if(t>=A.endT+A.hold){SC.A=null;if(k.type==='ko'){render();if(G&&G.watch)watchSchedule();return}applyKick(A.side,k);setPhase();afterCommit()}
}
function finishPlay(A){
  if(A.fin)return;A.fin=true;SC.A=null;try{audWhistle()}catch(e){}
  const P=A.P,r=A.res||{kind:'inc'};
  if(A.carrier&&SC.pl[A.carrier]&&['run','comp','scr'].includes(r.kind))r.ex=SC.pl[A.carrier].x;
  for(const k in SC.pl)SC.pl[k].wasVis=SC.pl[k].vis;
  commitPlay(P.side,P.pk,P.dc,r);afterCommit();
}
function skipAnimForce(A){let i=0;while(SC.A===A&&i++<900)stepAnim(A,.05);if(SC.A===A)SC.A=null}
function skipAnim(){
  const A=SC.A;if(!A||A.await)return;
  let i=0;while(SC.A===A&&i++<600)stepAnim(A,.05);
}
function onFieldTap(e){
  const A=SC.A;if(!A)return;
  const r=SC.cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
  if(A.await){
    setupCam();let best=null;
    A.P.recv.forEach((rc,i)=>{const p=SC.pl[A.P.side+'.'+rc.slot];if(!p)return;const q=pj(p.x,p.y,.9);if(!q)return;const d=Math.hypot(q.x-px,q.y-py);if(d<Math.max(30,q.s*2.6)&&(!best||d<best.d))best={i,d}});
    if(best)throwTo(A,best.i);
    return;
  }
  if(A.kind==='play'&&(A.user!==true||A.thrown||A.scr||A.sacked||A.P.isRun))skipAnim();
  else if(A.kind==='kick')skipAnim();
}
function startStorm(w){
  const c=shade(teamOf(w).color,.1),cy=SC.cam.y;SC.fans=[];
  for(let i=0;i<700;i++){const side=R()<.5?-1:1;SC.fans.push({x:side<0?-4-R()*12:FW+4+R()*12,y:cy-18+R()*42,z:1.5+R()*8,tx:6+R()*(FW-12),ty:cy-10+R()*24,d:R()*1.8,sp:6+R()*4,c:R()<.78?c:'#efece4',ph:R()*6})}
  SC.hype=1;SC.stormY=cy;
}
/* ---------- rivalry trophy celebration ---------- */
function startTrophy(){
  const T=G.trophy;if(!T)return;const w=T.w;
  Object.keys((G.ros&&G.ros[w])||{}).slice(0,14).forEach((sl,i)=>{const p=getP(w,sl);if(!p.vis){p.x=clamp(MID+gauss()*9,3,FW-3);p.y=50+gauss()*8;p.vis=true}});
  const list=Object.values(SC.pl).filter(p=>p.team===w);
  const tx=-1.2,ty=clamp(50+(T.side||0),20,80);
  list.forEach(p=>{p.vis=true});
  SC.tro={t:0,w,list,tx,ty,lead:list.find(p=>p.slot==='QB')||list[0],z:0,conf:false};
}
function stepTrophy(dt){
  const R0=SC.tro;if(!R0)return;R0.t+=dt;const t=R0.t,L=R0.lead;if(!L)return;
  const gx=t<3.2?MID:R0.tx+ (t<9?(MID-R0.tx)*Math.max(0,1-(t-3.2)/5.5):0),gy=t<3.2?50:R0.ty+(50-R0.ty)*Math.max(0,1-(t-3.2)/5.5);
  R0.list.forEach((p,i)=>{if(p===L){moveTo(p,gx,gy,t<3.2?7:5.2,dt);return}const a=i*2.399,r=1.4+(i%4)*.7+Math.sin(t*3+i)*.25;moveTo(p,gx+Math.cos(a)*r,gy+Math.sin(a)*r*.8,t<3.2?7.5:5.6,dt)});
  R0.z=t<1.6?0:Math.min(3.1,(t-1.6)*2.4);
  if(t>2.2&&!R0.conf){R0.conf=true;startConfetti()}
}
function drawTrophy(c){
  const R0=SC.tro;if(!R0||!R0.lead||R0.z<=0)return;const L=R0.lead,bob=Math.sin(R0.t*5)*.25*(R0.t>3.2?1:0),p=pj(L.x,L.y,2.2+R0.z+bob);if(!p)return;
  const s=Math.max(.6,p.s*.11);c.save();c.translate(p.x,p.y);c.scale(s,s);
  c.shadowColor='rgba(255,215,120,.85)';c.shadowBlur=18;
  const gr=c.createLinearGradient(-10,0,10,0);gr.addColorStop(0,'#b07d1e');gr.addColorStop(.45,'#ffe39a');gr.addColorStop(1,'#c9921f');c.fillStyle=gr;
  c.beginPath();c.moveTo(-9,-22);c.lineTo(9,-22);c.quadraticCurveTo(9,-6,2.2,-3);c.lineTo(2.2,4);c.lineTo(6,7);c.lineTo(6,10);c.lineTo(-6,10);c.lineTo(-6,7);c.lineTo(-2.2,4);c.lineTo(-2.2,-3);c.quadraticCurveTo(-9,-6,-9,-22);c.fill();
  c.lineWidth=2.2;c.strokeStyle='#e6b54a';c.beginPath();c.arc(-10,-15,4.2,Math.PI*.5,Math.PI*1.5);c.stroke();c.beginPath();c.arc(10,-15,4.2,-Math.PI*.5,Math.PI*.5);c.stroke();
  c.shadowBlur=0;c.fillStyle='rgba(255,255,255,.55)';c.fillRect(-5,-20,2,11);
  c.restore();
  // sparkles
  for(let i=0;i<6;i++){const a=R0.t*2+i*1.05,q={x:p.x+Math.cos(a)*s*16,y:p.y-s*8+Math.sin(a*1.3)*s*14};c.globalAlpha=.5+.5*Math.sin(R0.t*7+i);c.fillStyle='#fff6d0';c.fillRect(q.x-1,q.y-1,2.4,2.4)}c.globalAlpha=1;
}
/* ---------- rocking crowd: screen shake ---------- */
function crowdTier(){
  if(!G||G.neutral)return {L:0,full:false};const g=S.games[G.gid];if(!g)return {L:0,full:false};
  const EV=envG(),rk=G.rk||{},hs=homeSide(),hr=rk[hs]||99,ar=rk[other(hs)]||99;
  if(S.games.indexOf(g)===lcsWO())return {L:1.45,full:true};
  const rv=g.riv!=null?S.rivals[g.riv]:null,bigR=rv&&rv.type!=='occ';
  let L=0;
  if(hr<=PN&&ar<=PN)L=Math.max(L,ar<=8&&hr<=8?1:.85);   // ranked clash
  if(hr>PN&&ar<=PN)L=Math.max(L,ar<=5?1:.85);           // unranked home team hosting a ranked team
  if(g.po||bigRiv(g))L=Math.max(L,1);
  if(bigR)L=Math.max(L,.8);
  if(EV.theme)L=Math.max(L,.8);
  if(L&&EV.night)L=Math.min(1.15,L+.12);
  if(L)return {L,full:true};
  return {L:EV.night||rv?.5:.35,full:false};             // ordinary game: a little noise early only
}
function crowdLoud(){return crowdTier().L}
function crowdRock(){
  if(!G||['over','coin','half','pat','patk'].includes(G.phase)||G.intro)return 0;const T=crowdTier(),L=T.L;if(!L)return 0;
  const hs=homeSide(),as=other(hs),hsc=hs==='u'?G.su:G.sc,asc=hs==='u'?G.sc:G.su,diff=hsc-asc;
  if(diff<=-14)return 0;                      // away team built a big lead: crowd silenced
  if(G.poss!==as)return 0;                    // only when the home defense is on the field
  if(!T.full)return (G.adr||0)<=1?L:0;         // ordinary games: first series only
  const close=Math.abs(diff)<=8;let k=0;
  if((G.adr||0)<=1)k=.85;
  if((G.down>=3)&&close)k=Math.max(k,1);
  if(G.q>=4&&close)k=Math.max(k,G.down>=3?1.15:.9);
  if(G.ot)k=Math.max(k,1.1);
  return k*L*(diff<=-8?.6:1);
}
function stepShake(dt){
  if(!G||!SC.cv)return;const hs=homeSide(),as=other(hs);
  if(G.poss!==SC.lpss){SC.lpss=G.poss;if(G.poss===as&&!['coin'].includes(G.phase))G.adr=(G.adr||0)+1}
  const hsc=hs==='u'?G.su:G.sc,asc=hs==='u'?G.sc:G.su;
  if(SC.lhsc==null||SC.lgid!==G.gid){SC.lhsc=hsc;SC.lgid=G.gid}
  if(hsc-SC.lhsc>=6){const T=crowdTier(),L=T.full?T.L:0;if(L&&hsc-asc>-21)SC.shB=Math.max(SC.shB||0,1.4*L+.3)}SC.lhsc=hsc;
  const tgt=crowdRock(),A=SC.A,live=A&&A.kind==='play';SC.shS=(SC.shS||0)+((tgt*(live||!A?1:.5))-(SC.shS||0))*Math.min(1,dt*3);
  SC.shB=Math.max(0,(SC.shB||0)-dt*.45);
  let amp=SC.shS*3.1+SC.shB*4.4;if(SHAKE_RM)amp*=.25;
  if(amp>.05)SC.hype=Math.max(SC.hype,Math.min(1,.5+amp*.15));
  const el=SC.cv.parentElement;if(!el||!el.style)return;
  if(amp<.08){if(SC.shOn){el.style.transform='';SC.shOn=false}return}
  SC.shOn=true;const t=SC.t*38;el.style.transform='translate('+(Math.sin(t)*amp*.8+(Math.random()-.5)*amp).toFixed(2)+'px,'+(Math.cos(t*1.31)*amp*.6+(Math.random()-.5)*amp*.8).toFixed(2)+'px) rotate('+(Math.sin(t*.7)*amp*.05).toFixed(3)+'deg)';
}
const SHAKE_RM=(()=>{try{return typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}})();
function startConfetti(){
  const cw=teamOf(G&&G.sc>G.su?'c':'u').color,cols=[cw,'#f2b84b','#ffffff',shade(cw,.4)];SC.conf=[];
  for(let i=0;i<220;i++)SC.conf.push({x:R()*SC.W,y:-R()*SC.H,vx:rnd(-20,20),vy:rnd(40,110),r:R()*6,vr:rnd(-6,6),c:pick(cols),w:rnd(4,8)});
}
function camTarget(){
  const A=SC.A;
  if(A){const b=A.ball;return {x:MID+(b.x-MID)*.45,y:clamp(b.y+(A.kind==='kick'?6:10),-2,106),D:A.kind==='kick'?54:46}}
  if(!G)return {x:MID,y:50,D:46};
  if(G.phase==='over'&&SC.tro&&SC.tro.lead&&SC.tro.t<11)return {x:MID+(SC.tro.lead.x-MID)*.55,y:SC.tro.lead.y+7,D:SC.tro.t<3?40:46};
  if(G.phase==='over'&&SC.fans.length)return {x:MID,y:SC.stormY+4,D:62};
  if(G.phase==='coin'){const tc=SC.t,yw=.7*Math.sin(tc*.17);return {x:MID+Math.sin(yw)*64,y:50+Math.cos(yw)*64,D:40,pitch:.34,yaw:yw,z:8}}
  if(G.phase==='half')return {x:MID,y:60,D:58};
  return {x:MID+(G.bx-MID)*.4,y:clamp(G.ball+12,8,104),D:46};
}
function meterPos(){if(!G||!G.meter)return .5;if(SC.mt0==null)SC.mt0=performance.now();const t=(performance.now()-SC.mt0)/(G.meter.dur*1000),ph=t%2;return ph<1?ph:2-ph}
function update(dt){
  if(G&&G.meter&&typeof document.querySelector==='function'){const nd=document.querySelector('.needle');if(nd&&nd.style)nd.style.left=(2+96*meterPos())+'%'}
  try{audTick(dt)}catch(e){}
  try{scoreRoll()}catch(e){}
  try{tickStep(dt)}catch(e){}
  SC.t+=dt;SC.hype=Math.max(G&&S.games[G.gid]&&bigRiv(S.games[G.gid])?.62:G&&S.games[G.gid]&&S.games[G.gid].riv!=null?.4:.18,SC.hype-dt*.1);
  const A=SC.A;
  if(A)stepAnim(A,dt*A.spd);
  else for(const k in SC.pl){const p=SC.pl[k];if(p.vis)moveTo(p,p.tx,p.ty,10,dt)}
  if(G&&G.intro&&(A||G.phase!=='coin'))endIntro();
  if(G&&G.intro&&!A){G.intro.t+=dt;const EX=G.intro.x!=null?G.intro.x:(G.intro.x=EXT_LEN),t=G.intro.t-EX,O=G.intro.o||0,sm=k=>{k=clamp(k,0,1);return k*k*(3-2*k)};
    if(t<0)exCamShot(G.intro.t);else{if(SC.cam.span!==49){SC.cam.span=49;SC.cam.yaw=0;SC.cam.z=0}
    if(t<3.4){const e=sm(t/3.4);SC.cam.pitch=.5;SC.cam.x=-9;SC.cam.y=8+e*84;SC.cam.D=24}
    else if(O&&t<3.4+O){const k=(t-3.4)/O,e=sm(k/.25),d=sm((k-.25)/.75);SC.cam.pitch=.5-e*.34;SC.cam.x=-9+e*(MID-5+9)+d*10;SC.cam.y=92+e*26;SC.cam.D=24-e*4}
    else{const e=sm((t-3.4-O)/1.4),x0=O?MID+5:-9,y0=O?118:92,p0=O?.16:.5,D0=O?20:24;SC.cam.pitch=p0+e*(.86-p0);SC.cam.x=x0+e*(MID-x0);SC.cam.y=y0+e*(50-y0);SC.cam.D=D0+e*(68-D0)}
    if(t>10.5+O)endIntro()}}
  else{const ct=camTarget(),f=1-Math.exp(-dt*(A?3.6:2.2)),fa=1-Math.exp(-dt*1.6);
  SC.cam.x+=(ct.x-SC.cam.x)*f;SC.cam.y+=(ct.y-SC.cam.y)*f;SC.cam.D+=(ct.D-SC.cam.D)*f;SC.cam.pitch+=((ct.pitch!=null?ct.pitch:.86)-SC.cam.pitch)*fa;SC.cam.yaw=(SC.cam.yaw||0)+((ct.yaw||0)-(SC.cam.yaw||0))*fa;SC.cam.z=(SC.cam.z||0)+((ct.z||0)-(SC.cam.z||0))*fa;}
  for(const fn of SC.fans){if(SC.t<fn.d)continue;fn.d=0;moveTo(fn,fn.tx,fn.ty,fn.sp,dt);fn.z=Math.max(0,fn.z-dt*7);if(Math.hypot(fn.tx-fn.x,fn.ty-fn.y)<.5){fn.tx=clamp(fn.x+gauss()*3,1,52);fn.ty=fn.y+gauss()*3}}
  try{if(SC.tro)stepTrophy(dt)}catch(e){}
  try{stepShake(dt)}catch(e){}
  for(const c of SC.conf){c.x+=c.vx*dt;c.y+=c.vy*dt;c.r+=c.vr*dt;if(c.y>SC.H+10&&SC.t<12){c.y=-10;c.x=R()*SC.W}}
  SC.ui+=dt;
  if(SC.ui>.12){SC.ui=0;if(A&&A.await)liveRcv(A)}
}
function liveRcv(A){
  if(typeof document.querySelectorAll!=='function')return;
  document.querySelectorAll('[data-rcv]').forEach(el=>{const rc=A.P.recv[+el.dataset.rcv];if(!rc)return;const o=openAt(rc,A.t)-(A.t>A.P.tp?.12:0);el.className='rb '+(o>=.55?'open':o>=.36?'ok':'cov')});
  const pr=document.getElementById('prs');if(pr)pr.textContent=A.t>A.P.tp?'Pressure! Get rid of it.':'Pocket is clean';
}

/* ---------- stadium exterior opening ---------- */
const EXT_LEN=8.6;
function exRing(a,b,th,n){const c=Math.cos(th),s=Math.sin(th);return [MID+a*Math.sign(c)*Math.pow(Math.abs(c),2/n),50+b*Math.sign(s)*Math.pow(Math.abs(s),2/n)]}
function exBuild(){
  const g=S.games[G.gid],Ht=team(g.h),A=team(g.a),key=Ht.id+'|'+Ht.name+'|'+Ht.color+'|'+A.id;if(SC.ext&&SC.ext.key===key)return SC.ext;
  const rr=srng(hashS('stad:'+Ht.id+':'+Ht.name)),pr=clamp(((Ht.prestige||60)-36)/60,0,1);
  const X={key,N:72,n:3.6+rr()*1.4,a0:37,b0:71,Hs:15+pr*11+rr()*4,shoe:!g.neutral&&rr()<.34,brick:rr()<.55,deck2:pr>.45||rr()<.3,col:Ht.color,col2:color2Of(Ht),away:A.color};
  X.a1=X.a0+X.Hs*1.75;X.b1=X.b0+X.Hs*1.55;X.fac=X.brick?['#7b3b2a','#8a4532','#6c3324'][Math.floor(rr()*3)]:['#b9b2a4','#a8a39a','#c4bdb0'][Math.floor(rr()*3)];
  const inShoe=th=>X.shoe&&Math.sin(th)<-.72;X.inShoe=inShoe;
  X.fans=[];const cols=[X.col,X.col,X.col,shade(X.col,.35),shade(X.col,-.3),'#f1efe8',X.col2,'#d9d4c9'];
  for(let i=0;i<2200;i++){const th=rr()*Math.PI*2;if(inShoe(th))continue;const v=.04+rr()*.92;const vis=Math.cos(th)>.55&&Math.sin(th)<-.2&&Math.sin(th)>-.7;X.fans.push({th,v,c:vis&&rr()<.8?X.away:cols[Math.floor(rr()*cols.length)]})}
  X.fb={};const dT0=Math.PI*2/X.N;for(const f of X.fans){const k=Math.floor(f.th/dT0)*2+(f.v<.5?0:1);(X.fb[k]=X.fb[k]||[]).push(f)}
  X.trees=[];for(let i=0;i<190;i++){const th=rr()*Math.PI*2,rad=1.25+rr()*1.9,p=exRing(X.a1*rad,X.b1*rad*.95,th,2.6);if(Math.abs(p[0]-MID)<X.a1+14&&Math.abs(p[1]-50)<X.b1+12)continue;if(p[0]<MID-X.a1-18&&p[0]>MID-X.a1-92&&Math.abs(p[1]-50)<95)continue;if(p[0]>MID+X.a1+18&&p[0]<MID+X.a1+80&&p[1]>-10&&p[1]<110)continue;X.trees.push({x:p[0],y:p[1],r:3+rr()*3.5,c:['#24442a','#2c5231','#1f3b25','#35603a'][Math.floor(rr()*4)]})}
  X.cars=[];const lots=[[MID-X.a1-90,MID-X.a1-20,-40,140],[MID+X.a1+20,MID+X.a1+78,-8,108]];X.lots=lots;
  for(const L of lots)for(let x=L[0]+3;x<L[1]-3;x+=7)for(let y=L[2]+3;y<L[3]-3;y+=3.2)if(rr()<.72)X.cars.push({x,y,c:['#c9ccd2','#20242c','#7a2a2a','#3a4d6b','#e8e8e8','#5e6670'][Math.floor(rr()*6)]});
  return (SC.ext=X);
}
function exCamShot(t){
  const sm=k=>{k=clamp(k,0,1);return k*k*(3-2*k)},cam=SC.cam,X=SC.ext;
  if(t<2.9){const k=t/2.9;cam.x=MID;cam.y=50;cam.z=0;cam.D=260-k*30;cam.pitch=.66;cam.yaw=-1.05+k*.55;cam.span=255}
  else if(t<5.8){const k=(t-2.9)/2.9;cam.x=MID+k*6;cam.y=50;cam.z=X.Hs*.55;cam.D=175-k*18;cam.pitch=.2+k*.03;cam.yaw=2.45-k*.42;cam.span=215}
  else{const k=sm((t-5.8)/(EXT_LEN-5.8));cam.x=MID;cam.y=50+k*8;cam.z=0;cam.D=250-k*120;cam.pitch=.78+k*.14;cam.yaw=0;cam.span=230-k*95}
}
function drawExterior(c,W,H,t){
  const X=exBuild(),EV=envG(),night=EV.night,dome=EV.dome,wet=EV.weather==='rain'||EV.weather==='snow',snow=EV.weather==='snow';
  // sky + ground
  const hz=CP.hy-CP.F*CP.sp/Math.max(.05,CP.cp);
  const sk=c.createLinearGradient(0,Math.min(hz,0)-60,0,Math.max(hz,0)+2);if(night){sk.addColorStop(0,'#03050a');sk.addColorStop(1,'#1a2233')}else{sk.addColorStop(0,wet?'#59636e':'#5d8fc6');sk.addColorStop(1,wet?'#9aa2aa':'#cfe0ee')}
  c.fillStyle=sk;c.fillRect(0,0,W,Math.max(0,hz));
  c.fillStyle=snow?'#d9dde2':night?'#0f1a12':'#3d6a3a';c.fillRect(0,Math.max(0,hz),W,H);
  // roads ring + lots
  const ringPoly=(a,b,z,n,col,N)=>{N=N||72;const q=[];for(let i=0;i<N;i++){const p=exRing(a,b,i/N*Math.PI*2,n),s=pj(p[0],p[1],z);if(!s)return;q.push(s)}c.beginPath();q.forEach((s,i)=>i?c.lineTo(s.x,s.y):c.moveTo(s.x,s.y));c.closePath();c.fillStyle=col;c.fill()};
  ringPoly(X.a1+16,X.b1+16,0,3,night?'#1b1e24':'#5d6168');ringPoly(X.a1+9,X.b1+9,0,3.2,snow?'#cfd3d8':night?'#151a14':'#4b7a45');
  for(const L of X.lots){poly(c,[[L[0],L[2]],[L[1],L[2]],[L[1],L[3]],[L[0],L[3]]],night?'#17191e':'#62666d');}
  for(const v of X.cars){const p=pj(v.x,v.y,.3);if(!p||p.x<-5||p.x>W+5||p.y<-5||p.y>H+5)continue;const s=Math.max(1,p.s*1.6);c.fillStyle=night?shade(v.c,-.55):v.c;c.fillRect(p.x-s,p.y-s*.45,s*2,s*.9)}
  // apron + field inside bowl
  ringPoly(X.a0,X.b0,0,X.n,night?'#173d22':'#1f5a2c');
  const hcol=X.col;
  for(let y=-10;y<110;y+=5){const ez=y<0||y>=100;poly(c,[[0,y],[FW,y],[FW,y+5],[0,y+5]],ez?shade(hcol,-.15):(Math.round(y/5)%2?'#2f7c3d':'#2a7238'))}
  {c.strokeStyle='rgba(255,255,255,.85)';const lp=pj(MID,50);c.lineWidth=Math.max(.6,(lp?lp.s:1)*.25);c.beginPath();for(let y=0;y<=100;y+=10)seg(c,0,y,FW,y);seg(c,0,-10,0,110);seg(c,FW,-10,FW,110);seg(c,0,-10,FW,-10);seg(c,0,110,FW,110);c.stroke()}
  try{fieldLogos(c,teamOf(homeSide()),true,true,true)}catch(e){}
  if(night){const g2=pj(MID,50);if(g2){const r=Math.max(40,g2.s*80);const gr=c.createRadialGradient(g2.x,g2.y,0,g2.x,g2.y,r);gr.addColorStop(0,'rgba(255,250,225,.22)');gr.addColorStop(1,'rgba(255,250,225,0)');c.fillStyle=gr;c.fillRect(g2.x-r,g2.y-r,r*2,r*2)}}
  // build depth-sorted items
  const cam=[CP.cx,CP.cy,CP.cz],items=[];
  const addQ=(pts,col,ref,extra)=>{let cx=0,cy=0,cz=0;for(const p of pts){cx+=p[0];cy+=p[1];cz+=p[2]}cx/=pts.length;cy/=pts.length;cz/=pts.length;
    const e1=[pts[1][0]-pts[0][0],pts[1][1]-pts[0][1],pts[1][2]-pts[0][2]],e2=[pts[pts.length-1][0]-pts[0][0],pts[pts.length-1][1]-pts[0][1],pts[pts.length-1][2]-pts[0][2]];
    let nx=e1[1]*e2[2]-e1[2]*e2[1],ny=e1[2]*e2[0]-e1[0]*e2[2],nz=e1[0]*e2[1]-e1[1]*e2[0];if(ref&&nx*ref[0]+ny*ref[1]+nz*ref[2]<0){nx=-nx;ny=-ny;nz=-nz}
    if(ref&&nx*(cam[0]-cx)+ny*(cam[1]-cy)+nz*(cam[2]-cz)<=0)return;items.push({d:Math.hypot(cam[0]-cx,cam[1]-cy,cam[2]-cz),pts,col,extra})};
  const N=X.N,dT=Math.PI*2/N,Hs=X.Hs,zm=Hs*.52,mA=X.a0+(X.a1-X.a0)*.52,mB=X.b0+(X.b1-X.b0)*.52;
  const lit=(col,k)=>night?shade(col,-.35+k*.2):shade(col,k);
  for(let i=0;i<N;i++){const t0=i*dT,t1=t0+dT,tm=t0+dT/2;if(X.inShoe(tm))continue;
    const b0a=exRing(X.a0,X.b0,t0,X.n),b0b=exRing(X.a0,X.b0,t1,X.n),mAa=exRing(mA,mB,t0,X.n),mAb=exRing(mA,mB,t1,X.n),t0a=exRing(X.a1,X.b1,t0,X.n),t0b=exRing(X.a1,X.b1,t1,X.n),f0a=exRing(X.a1+1.5,X.b1+1.5,t0,X.n),f0b=exRing(X.a1+1.5,X.b1+1.5,t1,X.n);
    const out=[Math.cos(tm),Math.sin(tm),0],inw=[-Math.cos(tm),-Math.sin(tm),1.4],shadeK=.08*Math.cos(tm-.8);
    addQ([[b0a[0],b0a[1],1.4],[b0b[0],b0b[1],1.4],[mAb[0],mAb[1],zm-1],[mAa[0],mAa[1],zm-1]],lit('#3a3f49',shadeK),inw,{seat:[0,.5],i});
    addQ([[mAa[0],mAa[1],zm-1],[mAb[0],mAb[1],zm-1],[mAb[0],mAb[1],zm+1.2],[mAa[0],mAa[1],zm+1.2]],night?'#2a2410':'#14171d',[-Math.cos(tm),-Math.sin(tm),.2],{suite:1});
    addQ([[mAa[0],mAa[1],zm+1.2],[mAb[0],mAb[1],zm+1.2],[t0b[0],t0b[1],Hs],[t0a[0],t0a[1],Hs]],lit('#454b56',shadeK),inw,{seat:[.5,1],i});
    addQ([[t0a[0],t0a[1],Hs],[t0b[0],t0b[1],Hs],[f0b[0],f0b[1],Hs+2.2],[f0a[0],f0a[1],Hs+2.2]],lit(X.brick?'#c9c1b3':'#d8d2c6',shadeK),[0,0,1]);
    addQ([[f0a[0],f0a[1],0],[f0b[0],f0b[1],0],[f0b[0],f0b[1],Hs+2.2],[f0a[0],f0a[1],Hs+2.2]],lit(X.fac,shadeK),out,{fac:[f0a,f0b]});
  }
  if(X.shoe){// open end: grass berm + video board
    const sb=[MID-14,-X.b0+40];addQ([[MID-15,X.b0*-1+42,9],[MID+15,X.b0*-1+42,9],[MID+15,X.b0*-1+42,21],[MID-15,X.b0*-1+42,21]],'#0b0d12',[0,1,0],{board:1});
    addQ([[MID-15,X.b0*-1+42.4,9],[MID+15,X.b0*-1+42.4,9],[MID+15,X.b0*-1+42.4,21],[MID-15,X.b0*-1+42.4,21]],'#2a2e36',[0,-1,0]);
  }else{const yb=50+X.b1+3;addQ([[MID-13,yb,Hs+2],[MID+13,yb,Hs+2],[MID+13,yb,Hs+13],[MID-13,yb,Hs+13]],'#0b0d12',[0,-1,0],{board:1});addQ([[MID-13,yb+.5,Hs+2],[MID+13,yb+.5,Hs+2],[MID+13,yb+.5,Hs+13],[MID-13,yb+.5,Hs+13]],'#2a2e36',[0,1,0])}
  // press box on the west sideline
  {const x0=MID-X.a1+1,x1=x0+8,ya=28,yb=72,z0=Hs+2.2,z1=Hs+(X.deck2?11:8);const bx=(a,b)=>addQ(a,b[0],b[1],b[2]);
    bx([[x0,ya,z1],[x1,ya,z1],[x1,yb,z1],[x0,yb,z1]],['#cfd3d8',[0,0,1]]);
    bx([[x1,ya,z0],[x1,yb,z0],[x1,yb,z1],[x1,ya,z1]],[night?'#e9cf7a':'#5f7d99',[1,0,0],{glass:1}]);
    bx([[x0,ya,z0],[x0,yb,z0],[x0,yb,z1],[x0,ya,z1]],[shade(X.fac,-.1),[-1,0,0]]);
    bx([[x0,ya,z0],[x1,ya,z0],[x1,ya,z1],[x0,ya,z1]],[shade(X.fac,-.2),[0,-1,0]]);
    bx([[x0,yb,z0],[x1,yb,z0],[x1,yb,z1],[x0,yb,z1]],[shade(X.fac,-.2),[0,1,0]])}
  for(const tr of X.trees){const d=Math.hypot(cam[0]-tr.x,cam[1]-tr.y,cam[2]);items.push({d,tree:tr})}
  const towers=[.8,2.35,3.93,5.5].map(th=>{const p=exRing(X.a1+5,X.b1+5,th,X.n);return {x:p[0],y:p[1],h:Hs+24}});
  for(const tw of towers)items.push({d:Math.hypot(cam[0]-tw.x,cam[1]-tw.y,cam[2]-tw.h*.5),tw});
  items.sort((a,b)=>b.d-a.d);
  for(const it of items){
    if(it.tree){const p=pj(it.tree.x,it.tree.y,it.tree.r*1.1);if(!p)continue;const r=Math.max(1.2,p.s*it.tree.r);c.fillStyle=night?shade(it.tree.c,-.5):snow?'#9fb3a3':it.tree.c;c.beginPath();c.arc(p.x,p.y,r,0,6.283);c.fill();c.fillStyle='rgba(255,255,255,'+(night?.03:.08)+')';c.beginPath();c.arc(p.x-r*.3,p.y-r*.3,r*.5,0,6.283);c.fill();continue}
    if(it.tw){const b=pj(it.tw.x,it.tw.y,0),tp=pj(it.tw.x,it.tw.y,it.tw.h);if(!b||!tp)continue;c.strokeStyle=night?'#2a2e36':'#8f949b';c.lineWidth=Math.max(1,tp.s*.9);c.beginPath();c.moveTo(b.x,b.y);c.lineTo(tp.x,tp.y);c.stroke();const w=Math.max(4,tp.s*7),h2=Math.max(2,tp.s*3.2);c.fillStyle=night||dome?'#fff6d8':'#d9dde2';c.fillRect(tp.x-w/2,tp.y-h2,w,h2);
      if(night){const r=w*3.2,gr=c.createRadialGradient(tp.x,tp.y-h2/2,0,tp.x,tp.y-h2/2,r);gr.addColorStop(0,'rgba(255,245,210,.55)');gr.addColorStop(1,'rgba(255,245,210,0)');c.fillStyle=gr;c.fillRect(tp.x-r,tp.y-r,r*2,r*2)}continue}
    const q=it.pts.map(p=>pj(p[0],p[1],p[2]));if(q.some(v=>!v))continue;
    c.beginPath();q.forEach((s,i)=>i?c.lineTo(s.x,s.y):c.moveTo(s.x,s.y));c.closePath();c.fillStyle=it.col;c.fill();
    const ex=it.extra;if(!ex)continue;
    if(ex.fac){// arches and a color band on the facade
      const [a,b]=ex.fac,L=(u,z)=>pj(a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,z);c.fillStyle=night?'rgba(255,214,140,.55)':'rgba(20,14,12,.55)';
      for(const u0 of [.14,.58]){const pts=[[u0,1],[u0+.28,1],[u0+.28,Hs*.42]];for(let k=0;k<=6;k++){const an=k/6*Math.PI;pts.push([u0+.14+Math.cos(an)*.14,Hs*.42+Math.sin(an)*Hs*.11])}pts.push([u0,Hs*.42]);const sp=pts.map(p=>L(p[0],p[1]));if(sp.some(v=>!v))continue;c.beginPath();sp.forEach((s,i)=>i?c.lineTo(s.x,s.y):c.moveTo(s.x,s.y));c.closePath();c.fill()}
      const b1=L(0,Hs-.6),b2=L(1,Hs-.6),b3=L(1,Hs+1.4),b4=L(0,Hs+1.4);if(b1&&b2&&b3&&b4){c.fillStyle=night?shade(X.col,-.2):X.col;c.beginPath();c.moveTo(b1.x,b1.y);c.lineTo(b2.x,b2.y);c.lineTo(b3.x,b3.y);c.lineTo(b4.x,b4.y);c.closePath();c.fill()}
      const w1=L(0,Hs*.7),w2=L(1,Hs*.7);if(w1&&w2){c.strokeStyle=night?'rgba(255,220,150,.7)':'rgba(0,0,0,.25)';c.lineWidth=Math.max(.5,w1.s*.6);c.beginPath();c.moveTo(w1.x,w1.y);c.lineTo(w2.x,w2.y);c.stroke()}}
    if(ex.board){c.fillStyle=X.col;const m=q;const ctr=[(m[0].x+m[2].x)/2,(m[0].y+m[2].y)/2],s=Math.abs(m[1].x-m[0].x);c.fillRect(ctr[0]-s*.42,ctr[1]-Math.abs(m[2].y-m[1].y)*.32,s*.84,Math.abs(m[2].y-m[1].y)*.22);c.fillStyle='#f2b84b';c.fillRect(ctr[0]-s*.3,ctr[1]+Math.abs(m[2].y-m[1].y)*.05,s*.6,Math.max(1,Math.abs(m[2].y-m[1].y)*.12))}
    if(ex.glass){c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1;c.beginPath();for(let k=1;k<8;k++){const u=k/8,p1=q[0],p2=q[1],p3=q[3];const ax=p1.x+(p2.x-p1.x)*u,ay=p1.y+(p2.y-p1.y)*u;c.moveTo(ax,ay);c.lineTo(ax+(p3.x-p1.x),ay+(p3.y-p1.y))}c.stroke()}
    if(ex.seat){const bk=X.fb[ex.i*2+(ex.seat[0]?1:0)];if(bk){const tt=SC.t*6;for(const f of bk){const v=f.v,p0=exRing(X.a0,X.b0,f.th,X.n),p1=exRing(X.a1,X.b1,f.th,X.n),zb=v<.5?1.4+(zm-2.4)*(v/.5):zm+1.2+(Hs-zm-1.2)*((v-.5)/.5);
      const x=p0[0]+(p1[0]-p0[0])*v,y=p0[1]+(p1[1]-p0[1])*v,p=pj(x,y,zb+.35+Math.abs(Math.sin(tt+f.th*40))*.25);if(!p||p.x<-3||p.x>W+3||p.y<-3||p.y>H+3)continue;const s=Math.max(.9,p.s*.9);c.fillStyle=night?shade(f.c,-.25):f.c;c.fillRect(p.x-s/2,p.y-s/2,s,s)}}}
  }
  if(dome){ringPoly(X.a1+1.5,X.b1+1.5,Hs+2.4,X.n,'rgba(230,234,240,.32)');}
  // cut fades
  let fa=0;for(const ct of [0,2.9,5.8,EXT_LEN]){const d=Math.abs(t-ct);if(d<.28)fa=Math.max(fa,1-d/.28)}if(fa>0){c.fillStyle='rgba(0,0,0,'+fa.toFixed(3)+')';c.fillRect(0,0,W,H)}
}

/* ---- drawing ---- */
function bannerList(id){if(!S.banC||S.banC.id!==id||S.banC.season!==S.season||S.banC.n!==(S.history||[]).length)S.banC={id,season:S.season,n:(S.history||[]).length,list:teamSeasons(id).filter(s=>s.natl||s.cc).map(s=>({y:s.y,natl:!!s.natl})).sort((a,b)=>(b.natl-a.natl)||(b.y-a.y))};return S.banC.list}
function drawBanners(c){
  if(!G||G.neutral)return;const g=S.games[G.gid];if(!g)return;const H=team(g.h),L=bannerList(g.h).slice(0,12);
  poly(c,[[-22,128.6,12.4],[FW+22,128.6,12.4],[FW+22,128.6,17.6],[-22,128.6,17.6]],'#0c1018');
  poly(c,[[-22,128.5,17.2],[FW+22,128.5,17.2],[FW+22,128.5,17.6],[-22,128.5,17.6]],shade(H.color,-.1));
  const n=L.length;if(!n){const q=pj(MID,128.4,15);if(q){c.fillStyle='rgba(255,255,255,.75)';c.font='800 '+Math.max(8,q.s*2.2)+'px Barlow,system-ui';c.textAlign='center';c.fillText(H.name.toUpperCase(),q.x,q.y)}return}
  const w=3.8,gap=1.1,tot=n*w+(n-1)*gap,x0=MID-tot/2;
  L.forEach((b,i)=>{const x=x0+i*(w+gap),bg=b.natl?'#d9a72a':H.color,fg=b.natl?'#15120a':(lum(H.color)>.55?'#111':'#fff');
    poly(c,[[x,128.4,12.9],[x+w,128.4,12.9],[x+w,128.4,16.9],[x+w/2,128.4,16.9],[x,128.4,16.9]],bg);
    poly(c,[[x,128.35,12.9],[x+w/2,128.35,12.2],[x+w,128.35,12.9]],bg);
    const q=pj(x+w/2,128.3,15.5),q2=pj(x+w/2,128.3,13.9);if(!q||!q2)return;const fs=Math.max(6,q.s*1.5);
    c.fillStyle=fg;c.textAlign='center';c.textBaseline='middle';c.font='900 '+fs+'px Barlow,system-ui';c.fillText(String(b.y),q.x,q.y);
    c.font='800 '+Math.max(4,fs*.42)+'px system-ui';c.fillText(b.natl?'NATIONAL':'CONFERENCE',q2.x,q2.y);c.fillText('CHAMPIONS',q2.x,q2.y+Math.max(4,fs*.5))});
}
function logoBB(im){if(im._bb)return im._bb;const w=im.naturalWidth||256,h=im.naturalHeight||256;let bb={x:0,y:0,w,h};
  try{const cv=document.createElement('canvas');cv.width=128;cv.height=128;const x=cv.getContext('2d');x.drawImage(im,0,0,128,128);const d=x.getImageData(0,0,128,128).data;let x0=128,y0=128,x1=-1,y1=-1;for(let yy=0;yy<128;yy++)for(let xx=0;xx<128;xx++)if(d[(yy*128+xx)*4+3]>24){if(xx<x0)x0=xx;if(xx>x1)x1=xx;if(yy<y0)y0=yy;if(yy>y1)y1=yy}
    if(x1>x0&&y1>y0){const k=w/128;bb={x:Math.max(0,(x0-1)*k),y:Math.max(0,(y0-1)*k),w:Math.min(w,(x1-x0+3)*k),h:Math.min(h,(y1-y0+3)*k)}}}catch(e){}
  return (im._bb=bb)}
function planeImg(c,im,x,y,flip,maxW,maxH,alpha){const bb=logoBB(im),ar=bb.w/bb.h;let w=maxW,h=w/ar;if(h>maxH){h=maxH;w=h*ar}
  const k=.5,p0=pj(x,y),a=pj(x+k,y),b2=pj(x,y-k*flip);if(!p0||!a||!b2)return;const d=SC.dpr,f=flip;
  c.setTransform(d*(a.x-p0.x)/k*f,d*(a.y-p0.y)/k*f,d*(b2.x-p0.x)/k,d*(b2.y-p0.y)/k,d*p0.x,d*p0.y);c.globalAlpha=alpha;c.drawImage(im,bb.x,bb.y,bb.w,bb.h,-w/2,-h/2,w,h);c.globalAlpha=1;c.setTransform(d,0,0,d,0,0)}
function fieldLogos(c,T,ezN,ezF,mid){const ez=logoImg(T,'alt'),pr=logoImg(T),ok=i=>i&&i.complete&&i.naturalWidth;let any=false;
  if(ok(ez)){if(ezN)planeImg(c,ez,MID,105,1,40,7.4,.95);if(ezF)planeImg(c,ez,MID,-5,-1,40,7.4,.95);any=true}
  if(mid&&ok(pr))planeImg(c,pr,MID,50,1,11,9.5,.92);else if(mid){const mp=pj(MID,50),q1=pj(MID+4,50),q2=pj(MID,54);if(mp&&q1&&q2){c.beginPath();c.ellipse(mp.x,mp.y,Math.abs(q1.x-mp.x),Math.abs(mp.y-q2.y),0,0,6.283);c.fillStyle=shade(T.color,-.1);c.fill();c.lineWidth=2;c.strokeStyle='rgba(255,255,255,.7)';c.stroke()}text3D(c,T.abbr,MID,50,3.4,1,0,'#fff',7)}
  return any}
function poly(c,pts,fill){const q=pts.map(p=>pj(p[0],p[1],p[2]||0));if(q.some(v=>!v))return;c.beginPath();c.moveTo(q[0].x,q[0].y);for(let i=1;i<q.length;i++)c.lineTo(q[i].x,q[i].y);c.closePath();c.fillStyle=fill;c.fill()}
function seg(c,x1,y1,x2,y2,z=0){const a=pj(x1,y1,z),b=pj(x2,y2,z);if(!a||!b)return;c.moveTo(a.x,a.y);c.lineTo(b.x,b.y)}
function text3D(c,txt,x,y,size,ux,uy,color,maxW){
  const k=.5,p=pj(x,y),a=pj(x+ux*k,y+uy*k),b=pj(x+uy*k,y-ux*k);if(!p||!a||!b)return;
  const f=40;c.font='900 '+f+'px "Big Shoulders Display",Impact,sans-serif';
  let sc=size/f;if(maxW){const w=c.measureText(txt).width*sc;if(w>maxW)sc*=maxW/w}
  const ax=(a.x-p.x)/k,ay=(a.y-p.y)/k,bx=(b.x-p.x)/k,by=(b.y-p.y)/k,d=SC.dpr;
  c.setTransform(d*ax*sc,d*ay*sc,d*bx*sc,d*by*sc,d*p.x,d*p.y);
  c.fillStyle=color;c.textAlign='center';c.textBaseline='middle';c.fillText(txt,0,0);
  c.setTransform(d,0,0,d,0,0);
}
function draw(){
  const c=SC.ctx;if(!c)return;const W=SC.W,H=SC.H;
  c.setTransform(SC.dpr,0,0,SC.dpr,0,0);setupCam();
  if(G&&G.intro&&G.intro.t<(G.intro.x||0)){drawExterior(c,W,H,G.intro.t);return}
  const EV=envG(),day=G&&!EV.night&&!EV.dome,wet=EV.weather==='rain'||EV.weather==='snow';
  const bg=c.createLinearGradient(0,0,0,H);if(day){bg.addColorStop(0,wet?'#5d6772':'#6f9ccc');bg.addColorStop(.45,wet?'#7c858e':'#a9c6de');bg.addColorStop(1,'#2a3446')}else{bg.addColorStop(0,'#04060b');bg.addColorStop(.5,'#0b111b');bg.addColorStop(1,'#101826')}c.fillStyle=bg;c.fillRect(0,0,W,H);
  if(!day)for(const lx of [.08,.92]){const g=c.createRadialGradient(W*lx,0,0,W*lx,0,W*(EV.night?.55:.45));g.addColorStop(0,'rgba(255,240,200,'+(EV.night?.32:.22)+')');g.addColorStop(1,'rgba(255,240,200,0)');c.fillStyle=g;c.fillRect(0,0,W,H*.6)}
  if(!G)return;
  const y0=Math.max(-30,CP.cy+2),y1=Math.min(135,SC.cam.y+80);
  const stc=G.neutral?'#131926':EV.theme==='white'?(day?'#c9ccd2':'#a3a8b2'):EV.theme==='black'?'#07090d':'#131926';
  poly(c,[[-24,y0,13],[-24,y1,13],[-3.6,y1],[-3.6,y0]],stc);
  poly(c,[[FW+3.6,y0],[FW+3.6,y1],[FW+24,y1,13],[FW+24,y0,13]],stc);
  try{drawBanners(c)}catch(e){}
  if(y1>112)poly(c,[[-24,112.6],[FW+24,112.6],[FW+24,128,12.5],[-24,128,12.5]],stc);
  const BIGG=G&&S.games[G.gid]&&bigRiv(S.games[G.gid]),hype=SC.hype,amp=(.08+hype*.75)*(BIGG?1.8:1),tt=SC.t*(BIGG?9:7.5);
  if(SC.crowd)for(const [col,arr] of SC.crowd){c.fillStyle=col;for(const d of arr){if(d.y<y0+1||d.y>y1)continue;const p=pj(d.x,d.y,d.z+Math.abs(Math.sin(tt+d.ph))*amp*d.a);if(!p||p.x<-4||p.x>W+4||p.y<-4||p.y>H+4)continue;const s=Math.max(1.2,p.s*.5);c.fillRect(p.x-s/2,p.y-s,s,s*1.3)}}
  {const EV=envG();if(SC.crowd&&EV.night&&(EV.theme||BIGG)){c.fillStyle='rgba(255,255,240,.95)';const all=SC.crowd,n=Math.round(30+60*hype);for(let i=0;i<n;i++){const arr=all[Math.floor(Math.random()*all.length)][1],d=arr[Math.floor(Math.random()*arr.length)];if(!d||d.y<y0+1||d.y>y1)continue;const p=pj(d.x,d.y,d.z+.5);if(!p)continue;const s=Math.max(1.4,p.s*.42);c.fillRect(p.x-s/2,p.y-s/2,s,s)}}}
  poly(c,[[-3.6,y0],[FW+3.6,y0],[FW+3.6,Math.min(y1,112.6)],[-3.6,Math.min(y1,112.6)]],'#1b4426');
  const hs=homeSide(),hcol=teamOf(hs).color;
  for(let y=-10;y<110;y+=5){if(y+5<y0||y>y1)continue;const ez=y<0||y>=100;poly(c,[[0,y],[FW,y],[FW,y+5],[0,y+5]],ez?shade(hcol,-.2):(Math.round(y/5)%2?'#2f7c3d':'#2a7238'))}
  poly(c,[[-2,-10],[0,-10],[0,110],[-2,110]],'#e9ece6');poly(c,[[FW,-10],[FW+2,-10],[FW+2,110],[FW,110]],'#e9ece6');
  const nm=teamOf(hs).name.toUpperCase();
  if(!fieldLogos(c,teamOf(hs),y1>100,y0<0,!!pj(MID,50))){if(y1>100)text3D(c,nm,MID,105,6.5,1,0,'rgba(255,255,255,.88)',46);if(y0<0)text3D(c,nm,MID,-5,6.5,-1,0,'rgba(255,255,255,.88)',46)}
  const ls=pj(MID,SC.cam.y),lw=Math.max(1,(ls?ls.s:8)*.14);
  c.strokeStyle='rgba(255,255,255,.88)';c.lineWidth=lw;c.beginPath();
  for(let y=0;y<=100;y+=5){if(y<y0||y>y1)continue;seg(c,0,y,FW,y)}
  seg(c,0,-10,0,110);seg(c,FW,-10,FW,110);seg(c,0,110,FW,110);c.stroke();
  c.lineWidth=Math.max(1,lw*.8);c.beginPath();
  for(let y=1;y<100;y++){if(y%5===0||y<y0||y>y1)continue;seg(c,.4,y,1.1,y);seg(c,FW-1.1,y,FW-.4,y);seg(c,HASHL-.35,y,HASHL+.35,y);seg(c,HASHR-.35,y,HASHR+.35,y)}
  c.stroke();
  for(let y=10;y<=90;y+=10){if(y<y0||y>y1)continue;const n=String(y<=50?y:100-y);text3D(c,n,8.5,y,2.2,0,1,'rgba(255,255,255,.85)');text3D(c,n,FW-8.5,y,2.2,0,-1,'rgba(255,255,255,.85)')}
  const live=((G.phase==='off'||G.phase==='def')&&!(SC.A&&SC.A.kind!=='play'))||(SC.A&&SC.A.kind==='play');
  if(live){
    const los=SC.A&&SC.A.P?SC.A.P.los:G.ball,fd=SC.A&&SC.A.P?SC.A.P.los+G.togo:G.ball+G.togo;
    c.lineWidth=Math.max(2,lw*2.2);c.strokeStyle='rgba(110,170,255,.9)';c.beginPath();seg(c,0,los,FW,los);c.stroke();
    if(fd<100){c.strokeStyle='rgba(255,214,60,.92)';c.beginPath();seg(c,0,fd,FW,fd);c.stroke()}
  }
  if(y1>108){c.strokeStyle='#f2d14b';c.lineCap='round';const gp=pj(MID,110);c.lineWidth=Math.max(2,(gp?gp.s:6)*.22);c.beginPath();seg(c,MID,111.5,MID,111.5);const a=pj(MID,111.5,0),b=pj(MID,111.5,3.33),d=pj(MID,110,3.33);if(a&&b&&d){c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.lineTo(d.x,d.y)}const L1=pj(MID-3.08,110,3.33),R1=pj(MID+3.08,110,3.33),L2=pj(MID-3.08,110,11),R2=pj(MID+3.08,110,11);if(L1&&R1&&L2&&R2){c.moveTo(L2.x,L2.y);c.lineTo(L1.x,L1.y);c.lineTo(R1.x,R1.y);c.lineTo(R2.x,R2.y)}c.stroke();c.lineCap='butt'}
  if(!SC.A&&G.phase==='off'&&G.sel&&PB[G.sel])drawRouteArt(c);
  drawPlayers(c);
  drawBall(c);
  try{drawTrophy(c)}catch(e){}
  if(SC.fans.length){for(const f of SC.fans){if(f.d>0&&SC.t<f.d)continue;const p=pj(f.x,f.y,f.z+.5+Math.abs(Math.sin(SC.t*9+f.ph))*.5);if(!p)continue;c.fillStyle=f.c;c.beginPath();c.arc(p.x,p.y,Math.max(1.5,p.s*.42),0,6.283);c.fill()}}
  for(const k of SC.conf){c.save();c.translate(k.x,k.y);c.rotate(k.r);c.fillStyle=k.c;c.fillRect(-k.w/2,-2,k.w,4);c.restore()}
}
function getPreview(){
  if(!G.sel||!PB[G.sel])return null;
  if(!SC.P||SC.P.pk!==G.sel||SC.P.los!==G.ball||SC.P.side!==G.poss)SC.P=buildPlay('u',G.sel,G.dpend||'c3');
  return SC.P;
}
function drawRouteArt(c){
  const P=getPreview();if(!P)return;
  c.lineJoin='round';c.lineCap='round';
  const line=(pts,col,w)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();let st=false,last=null,prev=null;for(const [x,y] of pts){const p=pj(x,y,.05);if(!p)continue;if(!st){c.moveTo(p.x,p.y);st=true}else c.lineTo(p.x,p.y);prev=last;last=p}c.stroke();
    if(prev&&last){const a=Math.atan2(last.y-prev.y,last.x-prev.x),h=Math.max(6,w*3.2);c.fillStyle=col;c.beginPath();c.moveTo(last.x,last.y);c.lineTo(last.x-h*Math.cos(a-.45),last.y-h*Math.sin(a-.45));c.lineTo(last.x-h*Math.cos(a+.45),last.y-h*Math.sin(a+.45));c.closePath();c.fill()}};
  if(P.isRun){
    const cp=P.cPath,out=[];for(let i=0;i<cp.length;i++){out.push([cp[i][1],cp[i][2]]);if(cp[i][2]>=P.los)break}
    const l=out[out.length-1];out.push([l[0]+(l[0]-P.bx)*.08,l[1]+4]);
    line(out,'rgba(120,200,255,.95)',2.6);
  }else{
    for(const r of P.recv){const pts=[];for(const k of r.path){pts.push([k[1],k[2]])}const tr=pts.filter((p,i)=>i===0||Math.hypot(p[0]-pts[i-1][0],p[1]-pts[i-1][1])>.05);line(tr.slice(0,-1).length>1?tr.slice(0,-1):tr,'rgba(255,214,90,.95)',2.4)}
  }
  c.lineCap='butt';
}
const BIG=new Set(['LT','LG','C','RG','RT','DE1','DT1','DT2','DE2']);
function fxPush(kind,x,y,col){SC.fx=SC.fx||[];SC.fx.push({kind,x,y,col,t0:SC.t});if(SC.fx.length>12)SC.fx.shift()}
function drawFx(c){
  if(!SC.fx)return;SC.fx=SC.fx.filter(f=>SC.t-f.t0<(f.kind==='label'?1.8:.6));
  for(const f of SC.fx){const q=pj(f.x,f.y,.6);if(!q)continue;
    if(f.kind==='label'){const k2=(SC.t-f.t0)/1.8;c.globalAlpha=k2<.8?1:(1-k2)*5;const fs=Math.max(11,Math.min(18,q.s*1.6));c.font='800 '+fs+'px system-ui,sans-serif';c.textAlign='center';c.lineWidth=3;c.strokeStyle='rgba(0,0,0,.75)';c.strokeText(f.col,q.x,q.y-q.s*3.2);c.fillStyle='#ffd34d';c.fillText(f.col,q.x,q.y-q.s*3.2);c.globalAlpha=1;continue}const k=(SC.t-f.t0)/.6,r=Math.max(6,q.s*1.1)*(.6+k*1.8);
    c.globalAlpha=1-k;c.strokeStyle=f.kind==='catch'?'#ffd34d':'#ffffff';c.lineWidth=Math.max(1.5,q.s*.18*(1-k));
    c.beginPath();c.arc(q.x,q.y,r,0,6.283);c.stroke();
    if(f.kind==='pop'){for(let i=0;i<7;i++){const a=i*0.898+f.t0,r1=r*.8,r2=r*1.35;c.beginPath();c.moveTo(q.x+Math.cos(a)*r1,q.y+Math.sin(a)*r1*.6);c.lineTo(q.x+Math.cos(a)*r2,q.y+Math.sin(a)*r2*.6);c.stroke()}}
    c.globalAlpha=1}
}
function drawPlayers(c){
  if(S.retro!==false&&!S.chalk){retroPlayers(c);return}
  const A=SC.A,list=Object.values(SC.pl).filter(p=>p.vis).sort((a,b)=>b.y-a.y);
  const chalk=!!S.chalk,offT=A&&A.kind==='play'?A.P.side:G.poss;
  // motion trails for anyone moving fast
  for(const p of list){
    const v=p.lx!=null?Math.hypot(p.x-p.lx,p.y-p.ly):0;p.lx=p.x;p.ly=p.y;
    p.tr=p.tr||[];if(A&&v>.06){p.tr.push([p.x,p.y]);if(p.tr.length>7)p.tr.shift()}else if(p.tr.length)p.tr.shift();
    p.vx=v>.02?(p.x-(p.tr.length>1?p.tr[p.tr.length-2][0]:p.x)):0;p.vy=v>.02?(p.y-(p.tr.length>1?p.tr[p.tr.length-2][1]:p.y)):0;
  }
  if(!chalk)for(const p of list){if(p.tr.length<3)continue;const j=jersey(p.team);
    p.tr.forEach((pt,i)=>{const q=pj(pt[0],pt[1],.9);if(!q)return;c.globalAlpha=(i+1)/p.tr.length*.28;c.fillStyle=j.fill;c.beginPath();c.arc(q.x,q.y,Math.max(2,q.s*.75*(i+1)/p.tr.length),0,6.283);c.fill()});c.globalAlpha=1}
  for(const p of list){
    const g=pj(p.x,p.y,0),q=pj(p.x,p.y,.9);if(!g||!q)continue;
    if(q.x<-30||q.x>SC.W+30||q.y<-30||q.y>SC.H+30)continue;
    const big=BIG.has(p.slot),r=Math.max(4,q.s*(big?1.02:.88)),j=jersey(p.team),carrier=A&&A.kind==='play'&&A.live&&A.carrier===p.k;
    c.fillStyle='rgba(0,0,0,.38)';c.beginPath();c.ellipse(g.x+r*.15,g.y,r*1.0,r*.42,0,0,6.283);c.fill();
    if(chalk){
      c.strokeStyle=p.team===offT?'#fdfdf7':'#ffd86a';c.lineWidth=Math.max(1.6,r*.22);c.beginPath();
      if(p.team===offT){c.arc(q.x,q.y,r*.85,0,6.283)}else{const s2=r*.75;c.moveTo(q.x-s2,q.y-s2);c.lineTo(q.x+s2,q.y+s2);c.moveTo(q.x+s2,q.y-s2);c.lineTo(q.x-s2,q.y+s2)}
      c.stroke();
    }else{
      // facing wedge: where the player is headed, or toward the other goal when set
      let fx=p.vx,fy=p.vy;if(Math.hypot(fx,fy)<.02){fx=0;fy=p.team===offT?1:-1}
      const fl=Math.hypot(fx,fy)||1,tip=pj(p.x+fx/fl*1.25,p.y+fy/fl*1.25,.9);
      if(tip){const ax=tip.x-q.x,ay=tip.y-q.y,al=Math.hypot(ax,ay)||1,ux=ax/al,uy=ay/al;c.fillStyle=j.edge;c.beginPath();c.moveTo(q.x+ux*r*1.42,q.y+uy*r*1.42);c.lineTo(q.x+ux*r*.7-uy*r*.55,q.y+uy*r*.7+ux*r*.55);c.lineTo(q.x+ux*r*.7+uy*r*.55,q.y+uy*r*.7-ux*r*.55);c.closePath();c.fill()}
      const gr=c.createRadialGradient(q.x-r*.35,q.y-r*.4,r*.1,q.x,q.y,r);gr.addColorStop(0,shade(j.fill,.28));gr.addColorStop(1,j.fill);
      c.fillStyle=gr;c.beginPath();c.arc(q.x,q.y,r,0,6.283);c.fill();
      c.lineWidth=Math.max(1.2,r*.2);c.strokeStyle=j.edge;c.stroke();
      c.lineWidth=Math.max(.8,r*.08);c.strokeStyle='rgba(255,255,255,.55)';c.beginPath();c.arc(q.x,q.y,r*.78,Math.PI*1.1,Math.PI*1.9);c.stroke();
      const fs=Math.max(7,Math.round(r*(String(p.num).length>1?.95:1.08)));
      c.font='800 '+fs+'px "Chivo Mono",monospace';c.textAlign='center';c.textBaseline='middle';
      c.lineWidth=Math.max(1.5,fs*.2);c.strokeStyle=j.fill==='#f1efe8'?'rgba(255,255,255,.9)':'rgba(0,0,0,.45)';c.strokeText(p.num,q.x,q.y+r*.06);
      c.fillStyle=j.text;c.fillText(p.num,q.x,q.y+r*.06);
    }
    if(carrier){const pul=1.4+Math.sin(SC.t*12)*.12;c.strokeStyle='#ffd34d';c.lineWidth=2.5;c.beginPath();c.arc(q.x,q.y,r*pul,0,6.283);c.stroke()}
    if(A&&A.await&&p.team===A.P.side){const i=A.P.recv.findIndex(rc=>rc.slot===p.slot);if(i>=0){const o=openAt(A.P.recv[i],A.t)-(A.t>A.P.tp?.12:0);c.strokeStyle=o>=.55?'#62c48d':o>=.36?'#f2b84b':'#e8675c';c.lineWidth=3;c.beginPath();c.arc(q.x,q.y,r*1.55,0,6.283);c.stroke()}}
  }
  drawFx(c);
}
/* ---------- retro pixel players ---------- */
const PXF={0:'111101101101111',1:'010110010010111',2:'111001111100111',3:'111001111001111',4:'101101111001001',5:'111100111001111',6:'111100111101111',7:'111001010010010',8:'111101111101111',9:'111101111001111'};
function retroKit(team){const t=teamOf(team),home=team===homeSide(),c2=color2Of(t),dark=lum(t.color)<.5;
  return home?{helm:t.color,stripe:c2,jer:t.color,num:dark?'#ffffff':'#15171c',trim:c2,pants:lum(c2)>.6?c2:'#e6e2d6',sock:t.color}
             :{helm:t.color,stripe:c2,jer:'#f4f2ec',num:t.color,trim:t.color,pants:t.color,sock:'#f4f2ec'}}
function drawRetro(c,p,g,o){
  const u=Math.max(1.2,g.s*.17),K=retroKit(p.team),big=BIG.has(p.slot),W=big?8:6,lw=big?3:2,OL='#111318',SK=p.skin||(p.skin=['#f1c7a1','#d9a47c','#a86f4c','#7a4b30','#5c3824'][(hashS(p.k+(p.num||0))>>3)%5]);
  const R=[],put=(x,y,w,h,col,noOl)=>R.push([x,y,w,h,col,noOl]);
  const dir=o.dir,fl=o.flip?-1:1,ph=o.ph,cr=o.pose==='stance'?2:0,up=o.pose==='catch'||o.pose==='cele',thr=o.pose==='throw';
  // legs
  const ly=(i)=>o.moving&&dir!=='side'?((ph===0&&i===0)||(ph===2&&i===1)?1:0):0;
  if(dir==='side'){const s=o.moving?[1.8,.4,-1.8,-.4][ph]:.6;for(const [i,dx] of [[1,-s],[0,s]]){const x=-lw/2+dx,dk=i?-.28:0,lift=o.moving&&((ph===0&&i===1)||(ph===2&&i===0))?.8:0;put(x,lift,lw,1.2,'#1b1c20');put(x,1.2+lift,lw,1.6,shade(K.sock,dk));put(x,2.8,lw,2.6-cr*.5,shade(K.pants,dk))}}
  else{const xs=big?[-3.5,.5]:[-2.5,.5];xs.forEach((x,i)=>{const y0=ly(i);put(x,y0,lw,1.2,'#1b1c20');put(x,1.2+y0,lw,1.6,K.sock);put(x,2.8+y0,lw,2.6-cr*.5,K.pants)})}
  const by=5.2-cr*1.2,TW=dir==='side'?W-2:W;
  // torso and pads
  put(-TW/2,by,TW,5,K.jer);put(-TW/2-1,by+3.6,TW+2,1.8,K.jer);
  if(dir!=='side')put(-TW/2,by+.2,TW,.7,K.trim,true);
  // arms
  const sw=o.moving?(ph===0?1:ph===2?-1:0):0;
  const am=dir==='side'?'arm':undefined,arm=(x,yo,lift)=>{if(lift){put(x,by+4,1.6,3.6,K.jer,am);put(x,by+7.4,1.6,1.2,SK,am===undefined?undefined:true)}else{put(x,by+1.6+yo,1.6,2.6,K.jer,am);put(x,by+.4+yo,1.6,1.3,SK,am===undefined?undefined:true)}};
  if(dir==='side'){if(thr){put(-3.4,by+3.6,1.6,4.6,K.jer);put(-3.4,by+8,1.6,1.2,SK);put(-3.9,by+9,2.4,1.5,'#7a3f1d')}else arm(-.8+sw*1.5,0,up)}
  else{arm(-TW/2-1.9,sw,up);arm(TW/2+.3,-sw,up||thr)}
  // helmet
  const hy=by+5.2;put(-2.6,hy,5.2,3.8,K.helm);put(-1.8,hy+3.6,3.6,1,K.helm);
  if(dir==='back')put(-.5,hy+.2,1,4.3,K.stripe,true);
  else if(dir==='front'){put(-1.7,hy+.3,3.4,2,SK,true);put(-1.9,hy+1.3,3.8,.5,'#b9bec7',true);put(-1.9,hy+.4,3.8,.4,'#b9bec7',true);put(-.5,hy+2.4,1,2.1,K.stripe,true)}
  else{put(.8,hy+.3,1.4,2,SK,true);put(2.1,hy+.2,1.2,2.2,'#b9bec7');put(2.1,hy+1.1,1.2,.4,'#7d838c',true);put(-1.4,hy+1.3,.8,.8,'#3b3f47',true);put(-2.6,hy+3,5.2,.7,K.stripe,true)}
  // ball in hand
  if(o.ball){const bx=dir==='side'?.6:TW/2-.6;put(bx,by+2,2.2,1.4,'#7a3f1d')}
  // draw: outline pass then color pass, feet anchored at g
  const mir=dir==='side'&&fl<0,Y=(y,h)=>g.y-(y+h)*u;
  c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse(g.x,g.y,u*(W*.7),u*1.3,0,0,6.283);c.fill();
  const ol=(x0,y,w,h)=>{const x=mir?-(x0+w):x0;c.fillStyle=OL;c.fillRect(Math.round(g.x+x*u-u*.7),Math.round(Y(y,h)-u*.7),Math.round(w*u+u*1.4),Math.round(h*u+u*1.4))};
  for(const [x,y,w,h,,n] of R)if(n!==true)ol(x,y,w,h);
  for(const [x0,y,w,h,col,n] of R){if(n==='arm')ol(x0,y,w,h);const x=mir?-(x0+w):x0;c.fillStyle=col;c.fillRect(Math.round(g.x+x*u),Math.round(Y(y,h)),Math.max(1,Math.round(w*u)),Math.max(1,Math.round(h*u)))}
  // jersey number on chest or back
  if(dir!=='side'&&u>=1.6&&p.num!=null){const s=String(p.num),pu=u*.5,gw=s.length*3+(s.length-1),x0=-gw*.5,yT=by+3.9;c.fillStyle=K.num;
    [...s].forEach((d,k)=>{const f=PXF[d];if(!f)return;for(let i=0;i<15;i++)if(f[i]==='1'){const cx=i%3,cy=Math.floor(i/3);c.fillRect(Math.round(g.x+(x0+(k*4+cx)*1)*pu),Math.round(g.y-(yT-cy*1*.5)*u),Math.ceil(pu),Math.ceil(pu))}})}
}
function retroPose(A,p,offT){
  if(!A){return (G.phase==='off'||G.phase==='def')&&!['QB','X','Z','S','S2','FS','SS','CB1','CB2','RB'].includes(p.slot)?'stance':''}
  if(A.kind==='play'){
    if(A.t<0&&!['QB','X','Z','S','S2','FS','SS','CB1','CB2','RB'].includes(p.slot)&&A.t>-.5)return 'stance';
    if(A.t<.25&&A.t>=0&&BIG.has(p.slot))return 'stance';
    const ai=A.air;
    if(A.thrown&&ai&&p.slot==='QB'&&p.team===A.P.side&&A.t-ai.t0<.32)return 'throw';
    if(A.thrown&&ai&&A.t>ai.t1-.5&&A.t<ai.t1+.2&&Math.hypot(ai.x1-p.x,ai.y1-p.y)<2.6)return 'catch';
    if(A.tkT!=null&&A.t>=A.tkT){if(p.k===A.carrier&&A.t-A.tkT>.08)return 'down';if(p.k===A.tkr)return 'dive'}
    if(A.carrier===p.k&&p.y>=100&&p.team===A.P.side&&A.t>=A.endT-.05)return 'cele';
  }
  return '';
}
function retroPlayers(c){
  const A=SC.A,offT=A&&A.kind==='play'?A.P.side:G.poss,list=Object.values(SC.pl).filter(p=>p.vis).sort((a,b)=>b.y-a.y);
  for(const p of list){const v=p.lx!=null?Math.hypot(p.x-p.lx,p.y-p.ly):0;p.lx=p.x;p.ly=p.y;
    p.tr=p.tr||[];if(A&&v>.04){p.tr.push([p.x,p.y]);if(p.tr.length>7)p.tr.shift()}else if(p.tr.length)p.tr.shift();
    const n=p.tr.length;p.vx=n>2?(p.tr[n-1][0]-p.tr[0][0])/n:0;p.vy=n>2?(p.tr[n-1][1]-p.tr[0][1])/n:0}
  for(const p of list){const g0=pj(p.x,p.y,0);if(!g0||g0.x<-30||g0.x>SC.W+30||g0.y<-30||g0.y>SC.H+50)continue;
    let fx=p.vx,fy=p.vy;const moving=Math.hypot(fx,fy)>.035;
    if(!moving){if(p.face)[fx,fy]=p.face;else{fx=0;fy=p.team===offT?1:-1}}else p.face=[fx,fy];
    if(!A||(A.kind==='play'&&A.t<0)){fx=0;fy=p.team===offT?1:-1;p.face=null}
    const tip=pj(p.x+fx*30,p.y+fy*30,0)||g0,sx=tip.x-g0.x,sy=tip.y-g0.y,dir=Math.abs(sx)>Math.abs(sy)*1.15?'side':sy<0?'back':'front';
    const carrier=A&&A.kind==='play'&&A.live&&A.carrier===p.k,pose=retroPose(A,p,offT);
    if(p._h==null)p._h=hashS(p.k)%4;
    const o={dir,flip:sx<0,moving:moving&&pose!=='down'&&pose!=='dive',ph:moving?Math.floor((SC.t*11+p._h)%4):1,pose,ball:carrier&&pose!=='cele'};
    if(pose==='down'||pose==='dive'){
      const cr=SC.pl[A.carrier],side=pose==='down'?(p._h%2?1:-1):(cr&&pj(cr.x,cr.y,0)&&pj(cr.x,cr.y,0).x<g0.x?-1:1),u=g0.s*.17;
      c.save();c.translate(g0.x,g0.y-(pose==='dive'?u*3:u*1.5));c.rotate(side*(pose==='down'?1.5:1.25));drawRetro(c,p,{x:0,y:u*7,s:g0.s},Object.assign(o,{dir:pose==='down'?'back':'side',flip:side<0}));c.restore();
    }else{const g=pose==='cele'?{x:g0.x,y:g0.y-Math.abs(Math.sin(SC.t*9+p._h))*g0.s*.45,s:g0.s}:g0;drawRetro(c,p,g,o)}
    if(carrier&&pose!=='down'){const q=pj(p.x,p.y,3.3);if(q){const s=Math.max(3,q.s*.22),bob=Math.sin(SC.t*8)*s*.3;c.fillStyle='#ffd34d';c.strokeStyle='#111318';c.lineWidth=1.5;c.beginPath();c.moveTo(q.x,q.y+s+bob);c.lineTo(q.x-s,q.y-s*.4+bob);c.lineTo(q.x+s,q.y-s*.4+bob);c.closePath();c.fill();c.stroke()}}
    if(A&&A.await&&p.team===A.P.side){const i=A.P.recv.findIndex(rc=>rc.slot===p.slot);if(i>=0){const op=openAt(A.P.recv[i],A.t)-(A.t>A.P.tp?.12:0),u=g0.s*.17;c.strokeStyle=op>=.55?'#62c48d':op>=.36?'#f2b84b':'#e8675c';c.lineWidth=3;c.beginPath();c.ellipse(g0.x,g0.y-u*.2,u*6.2,u*2.4,0,0,6.283);c.stroke()}}
  }
  drawFx(c);
}

function drawBall(c){
  let b;
  if(SC.A)b=SC.A.ball;
  else if(G&&(G.phase==='off'||G.phase==='def'||G.phase==='ckick'||G.phase==='pat'))b={x:G.bx,y:G.ball+.25,z:.25};
  else if(G&&G.phase==='coin')b={x:MID,y:50,z:.2};
  else return;
  const g=pj(b.x,b.y,0),q=pj(b.x,b.y,b.z);if(!g||!q)return;
  const s=Math.max(2.2,q.s*.32),fly=b.z>1.1,sp=fly?.75+.25*Math.sin(SC.t*38):1,ang=fly&&SC.A&&SC.A.air?Math.atan2(-(pj(SC.A.air.x1,SC.A.air.y1,0)||g).y+g.y,(pj(SC.A.air.x1,SC.A.air.y1,0)||g).x-g.x)*-1:0;
  c.fillStyle='rgba(0,0,0,'+(fly?.25:.4)+')';c.beginPath();c.ellipse(g.x,g.y,s*(fly?Math.max(.6,1.2-b.z*.04):1.2),s*.5,0,0,6.283);c.fill();
  c.fillStyle='#8a4b24';c.strokeStyle='#3b1e0a';c.lineWidth=1;c.beginPath();c.ellipse(q.x,q.y,s*1.5,s*sp,ang,0,6.283);c.fill();c.stroke();
  c.strokeStyle='#f5efe0';c.beginPath();c.moveTo(q.x-s*.6,q.y);c.lineTo(q.x+s*.6,q.y);c.stroke();
}

/* =================== CHURCH LEAGUE + LEAGUE BUILDER =================== */
const TIERS={
 dynasty:{n:'Dynasty',p:92,r:1,pct:.74,d:'Has owned this league for years. Everybody measures themselves against them.'},
 power:{n:'Perennial power',p:86,r:0,pct:.67,d:'Always in the hunt. A down year is nine wins.'},
 contender:{n:'Contender',p:79,r:0,pct:.6,d:'Good every year, great some years.'},
 rising:{n:'Rising program',p:68,r:5,pct:.5,d:'No real history, but the arrow is pointing straight up.'},
 middle:{n:'Middle of the pack',p:68,r:0,pct:.52,d:'Bowl eligible most years. Rarely scary.'},
 fallen:{n:'Fallen giant',p:65,r:-4,pct:.6,d:'Glory days are long gone. The trophy case is full of old banners.'},
 rebuild:{n:'Rebuilding',p:59,r:0,pct:.47,d:'Rough stretch right now. New pieces, low expectations.'},
 basement:{n:'Basement dweller',p:52,r:-1,pct:.36,d:'Has always been the team everybody circles as a win.'}
};
TIERS.startup={n:'Startup program',p:44,r:-6,pct:.3,d:'Brand new. No history, no banners, nothing but a field and a dream.'};
const TIER_KEYS=Object.keys(TIERS);
const CHURCH=[
 // [name, abbr, mascot, color, city, conf, div]
 ['Skyline Baptist','SKY','Skyhawks','#2f8f6d','Seattle, WA',0,0],['Yakima Baptist','YAK','Rattlers','#8a2f2f','Yakima, WA',0,0],['Jerome Bible Baptist','JBB','Pioneers','#b54a1e','Jerome, ID',0,0],['West Valley Baptist','WVB','Wolves','#4b5d82','Boise, ID',0,0],
 ['San Diego Baptist','SDB','Mariners','#1f7fa6','San Diego, CA',0,1],['Temecula Baptist','TEM','Titans','#7d2a5c','Temecula, CA',0,1],['Northway Baptist','NWY','Scorpions','#c4572a','Scottsdale, AZ',0,1],['Lighthouse Colorado','LCS','Peaks','#5468bb','Colorado Springs, CO',0,1],
 ['Southwest Baptist','SWB','Mustangs','#b5382f','Oklahoma City, OK',1,0],['Eastland Baptist','EBC','Eagles','#1d6b4a','Tulsa, OK',1,0],['Stillwater Baptist','STW','Stallions','#e07a1f','Stillwater, OK',1,0],['Broken Arrow Baptist','BAB','Arrows','#c03a3a','Broken Arrow, OK',1,0],
 ['Boulevard Baptist','BLV','Bulldogs','#8c1d2e','Burleson, TX',1,1],['Arden Road Baptist','ARB','Rams','#c2902b','Amarillo, TX',1,1],['El Paso Baptist','ELP','Desert Hawks','#8e5a2b','El Paso, TX',1,1],['Westbrook Baptist','WBK','Roadrunners','#2c7f8f','Clovis, NM',1,1],
 ['Berean Baptist','BER','Bereans','#1f4e9c','Springfield, MO',2,0],['United Baptist','UBC','Patriots','#23407a','Republic, MO',2,0],['Faith Baptist','FBO','Falcons','#5a3d99','Olathe, KS',2,0],['Halstead Baptist','HAL','Harvesters','#b88a1c','Halstead, KS',2,0],
 ['Eastside Baptist','ESB','Explorers','#2a6fb0','Sioux Falls, SD',2,1],['Sioux City Baptist','SCB','Storm','#6d6f78','Sioux City, IA',2,1],['Averyville Baptist','AVY','Aviators','#0b5aa6','Peoria, IL',2,1],['Bayview Baptist','BAY','Bayhawks','#2d8a8a','Washington, IL',2,1],
 ['Cleveland Baptist','CLE','Crusaders','#6b2235','Cleveland, OH',3,0],['Calvary Baptist','CAL','Cavaliers','#3a5f2b','Kalamazoo, MI',3,0],['Sauk Trail Temple','STT','Trailblazers','#9b2335','Chicago, IL',3,0],['Lighthouse Indy','LHI','Racers','#d4a017','Indianapolis, IN',3,0],
 ['Westgate Baptist','WGT','Pelicans','#e0682b','Tampa, FL',3,1],['Liberty Baptist','LIB','Minutemen','#1b3a6b','Philadelphia, PA',3,1],['Syracuse Baptist','SYR','Lakers','#3d6fa8','Syracuse, NY',3,1],['Pleasant View Baptist','PVB','Thoroughbreds','#2e6b9e','Hardinsburg, KY',3,1]
];
const CH_CONFS=['Pacific Mountain','Red River','Heartland','Eastern'];
const CH_DIVS=[['Northwest','Desert'],['Oklahoma','Texas'],['South','North'],['Lakes','Atlantic']];
const CH_RIVALS=[[0,1,'The Cascade Cup'],[2,3,'The Snake River Oar'],[4,5,'The Coastline Cup'],[6,7,'The Canyon Lantern'],[8,10,'The Red Dirt Bell'],[9,11,'The Arrowhead'],[12,14,'The Lone Star Saddle'],[13,15,'The Llano Spur'],[16,17,'The Ozark Cup'],[18,19,'The Wheat Sheaf'],[20,21,'The Missouri River Rail'],[22,23,'The Illinois River Bell'],[24,30,'The Lake Erie Kettle'],[25,26,'The Lakeshore Anvil'],[27,31,'The Ohio River Paddle'],[28,29,'The Liberty Lantern']];
function genHist(tier){
  const T=TIERS[tier],gp=ri(420,720),w=Math.round(gp*clamp(T.pct+rnd(-.03,.03),.25,.85));
  const natl={dynasty:ri(4,7),power:ri(1,3),contender:ri(0,1),fallen:ri(2,4),rising:0,middle:0,rebuild:R()<.2?1:0,basement:0}[tier];
  const ct={dynasty:ri(14,24),power:ri(8,14),contender:ri(4,8),fallen:ri(9,15),rising:ri(0,2),middle:ri(1,4),rebuild:ri(1,5),basement:R()<.4?1:0}[tier];
  const last=natl?({dynasty:ri(2019,2025),power:ri(2008,2023),fallen:ri(1962,1994)}[tier]||ri(1975,2015)):null;
  return {natl,ct,w,l:gp-w,last};
}
function defaultTpl(){
  const teams=CHURCH.map(c=>({name:c[0],abbr:c[1],mascot:c[2],color:c[3],city:c[4],conf:c[5],div:c[6],tier:'middle'}));
  for(let c=0;c<4;c++){const ids=shuffle(teams.map((t,i)=>i).filter(i=>teams[i].conf===c));const tl=shuffle(['power','contender','contender','rising','middle','fallen','rebuild','basement']);ids.forEach((i,k)=>teams[i].tier=tl[k])}
  const pw=teams.map((t,i)=>i).filter(i=>teams[i].tier==='power');teams[pick(pw)].tier='dynasty';
  teams.forEach(t=>Object.assign(t,genHist(t.tier)));
  return {confs:[...CH_CONFS],divs:CH_DIVS.map(d=>[...d]),teams,rivals:CH_RIVALS.map(r=>({a:r[0],b:r[1],trophy:r[2]}))};
}
let LS=null;
function loadLS(){try{const x=localStorage.getItem('saturday_sideline_league_v1');if(x){LS=JSON.parse(x);if(LS&&LS._edited===undefined)LS._edited=true}}catch(e){}if(!LS||!LS.tpl||!LS.tpl.teams||LS.tpl.teams.length!==32)LS={use:'church',tpl:defaultTpl(),_edited:false}}
function saveLSQuiet(){try{localStorage.setItem('saturday_sideline_league_v1',JSON.stringify(LS))}catch(e){}}
function saveLS(){LS._ts=Date.now();LS._uedit=LS._ts;LS._edited=true;try{localStorage.setItem('saturday_sideline_league_v1',JSON.stringify(LS))}catch(e){}cloudQueue()}
function tplValid(){
  const T=LS.tpl,bad=[];
  const per=T.teams.length>=48?6:4;for(let c=0;c<4;c++)for(let d=0;d<2;d++){const n=T.teams.filter(t=>t.conf===c&&t.div===d).length;if(n!==per)bad.push(T.confs[c]+' '+T.divs[c][d]+' has '+n)}
  return bad;
}
const isMain=r=>(r.type||'main')==='main';
function moveTeam(i,c,d){
  const T=LS.tpl,t=T.teams[i];if(t.conf!==c)T.rivals=T.rivals.filter(r=>!isMain(r)||(r.a!==i&&r.b!==i));
  t.conf=c;t.div=d;saveLS();
}
function swapTeams(i,j){const T=LS.tpl,a=T.teams[i],b=T.teams[j];if(a.conf!==b.conf)T.rivals=T.rivals.filter(r=>!isMain(r)||(r.a!==i&&r.b!==i&&r.a!==j&&r.b!==j));[a.conf,b.conf]=[b.conf,a.conf];[a.div,b.div]=[b.div,a.div];saveLS()}
function rivalOfT(i){const r=LS.tpl.rivals.find(r=>isMain(r)&&(r.a===i||r.b===i));return r?(r.a===i?r.b:r.a):null}
function extrasOfT(i){return LS.tpl.rivals.map((r,k)=>({...r,k})).filter(r=>!isMain(r)&&(r.a===i||r.b===i))}
function cupName(i,j){const T=LS.tpl;return 'The '+T.teams[i].city.split(',')[0]+'-'+T.teams[j].city.split(',')[0]+' Cup'}
function addExtra(i,j,type){
  const T=LS.tpl;if(i==null||j==null||i===j)return;
  if(T.rivals.some(r=>(r.a===i&&r.b===j)||(r.a===j&&r.b===i)))return;
  T.rivals.push({a:i,b:j,type,trophy:cupName(i,j)});saveLS();
}
function annualCross(i){const T=LS.tpl;return T.rivals.filter(r=>r.type==='annual'&&(r.a===i||r.b===i)&&T.teams[r.a].conf!==T.teams[r.b].conf).length}
function setRival(i,j){
  const T=LS.tpl,old=T.rivals.find(r=>(r.a===i&&r.b===j)||(r.a===j&&r.b===i));
  T.rivals=T.rivals.filter(r=>!(isMain(r)&&(r.a===i||r.b===i||r.a===j||r.b===j))&&!((r.a===i&&r.b===j)||(r.a===j&&r.b===i)));
  if(j!=null&&j!==i)T.rivals.push({a:i,b:j,type:'main',trophy:old?old.trophy:'The '+T.teams[i].city.split(',')[0]+'-'+T.teams[j].city.split(',')[0]+' Cup'});
  saveLS();
}
function setTier(i,k){const t=LS.tpl.teams[i];t.tier=k;Object.assign(t,genHist(k));saveLS()}
function resetGeo(){const T=LS.tpl;CHURCH.forEach((c,i)=>{T.teams[i].conf=c[5];T.teams[i].div=c[6]});T.confs=[...CH_CONFS];T.divs=CH_DIVS.map(d=>[...d]);T.rivals=CH_RIVALS.map(r=>({a:r[0],b:r[1],trophy:r[2],type:'main'})).concat(T.rivals.filter(r=>!isMain(r)));saveLS()}
function churchLeague(){
  const T=LS.tpl;
  return T.teams.map((t,i)=>{const X=TIERS[t.tier]||TIERS.middle,pr=clamp(X.p+ri(-2,2),t.tier==='startup'?38:50,96);
    return {id:i,name:t.name,abbr:t.abbr,mascot:t.mascot,color:t.color,conf:t.conf,div:t.div,city:t.city,prestige:pr,
      off:clamp(Math.round(pr+X.r+rnd(-5,5)),50,99),def:clamp(Math.round(pr+X.r+rnd(-5,5)),50,99),style:pick(['run','pass','bal','bal']),cc:false,
      hist:{tier:t.tier,natl:t.natl,ct:t.ct,w:t.w,l:t.l,last:t.last}}});
}
function leagueMeta(){
  if(LS.use==='church')return {confs:[...LS.tpl.confs],divs:LS.tpl.divs.map(d=>[...d]),rivalDefs:LS.tpl.rivals.map(r=>({...r})),lname:'Church League'};
  return {confs:['Heartland','Seaboard','Frontier','Delta'],divs:null,rivalDefs:null,lname:'Classic League'};
}
function histLine(t){
  const h=t.hist;if(!h)return '';
  return (TIERS[h.tier]?TIERS[h.tier].n+'. ':'')+(h.natl?h.natl+' national title'+(h.natl>1?'s':'')+(h.last?' (last '+h.last+')':'')+'. ':'No national titles. ')+h.ct+' conference title'+(h.ct===1?'':'s')+'. All-time '+h.w+'-'+h.l+'.';
}

/* ---- builder UI ---- */
const BV={open:false,modal:null,from:null};
let DRAG=null;
function chipHTML(i){
  const t=LS.tpl.teams[i];
  return '<div class="tchip" data-team="'+i+'" style="--tc:'+t.color+'"><span class="hdl" data-drag="'+i+'" title="Drag to move" aria-label="Drag '+esc(t.name)+'"><i></i><i></i><i></i></span><button class="tb" data-act="lb-team" data-i="'+i+'"><b>'+esc(t.abbr)+'</b><span>'+esc(t.name)+'</span><small>'+esc(t.city)+' · '+(TIERS[t.tier]?TIERS[t.tier].n:'')+(rivalOfT(i)==null?' · no rival':'')+'</small></button></div>';
}
function builderView(){
  const T=LS.tpl,bad=tplValid();
  let h='<div class="hero"><span class="eyebrow">League builder</span><h1>Church <span>League</span></h1><p class="muted">Drag a team by its grip to move it. Drop it on another team to swap them. Tap a team to edit its name, colors, rival and program history.</p></div>';
  h+='<div class="row"><button class="btn small" data-act="lb-modal" data-m="rivals">Rivalries</button><button class="btn small" data-act="lb-modal" data-m="history">Program histories</button><button class="btn ghost small" data-act="lb-geo">Reset to geography</button></div>';
  h+='<div class="lbgrid">';
  for(let c=0;c<4;c++){
    h+='<section class="card lbconf"><input class="lbname" data-lb="conf" data-c="'+c+'" value="'+esc(T.confs[c])+'" aria-label="Conference name" maxlength="24">';
    for(let d=0;d<2;d++){
      const ids=T.teams.map((t,i)=>i).filter(i=>T.teams[i].conf===c&&T.teams[i].div===d);
      h+='<div class="divbox'+(ids.length!==4?' warn':'')+'" data-drop="'+c+','+d+'"><div class="spread"><input class="lbdiv" data-lb="div" data-c="'+c+'" data-d="'+d+'" value="'+esc(T.divs[c][d])+'" aria-label="Division name" maxlength="20"><span class="muted num" style="font-size:12px">'+ids.length+'/4</span></div>'+ids.map(chipHTML).join('')+'</div>';
    }
    h+='</section>';
  }
  h+='</div>';
  h+='<section class="card"><p class="'+(bad.length?'bad':'muted')+'" style="font-size:13.5px">'+(bad.length?'Each division needs exactly 4 teams. Fix: '+esc(bad.join('; '))+'.':'All set. 4 conferences, 8 divisions, 4 teams each. Changes save automatically and apply when you start a new career.')+'</p><button class="btn" data-act="lb-done"'+(bad.length?' disabled':'')+'>Done</button>'+syncLine()+(S&&S.lname==='Church League'?'<p class="muted" style="font-size:12.5px">Your Church League career picks up names, colors, histories and rivals when you tap Done. Conference moves apply right away if this season has not started, otherwise next season.</p>':'')+'</section>';
  if(BV.modal)h+=modalHTML();
  return h;
}
function tierCards(i){
  const t=LS.tpl.teams[i];
  return '<div class="tiers">'+TIER_KEYS.map(k=>'<button class="tierc'+(t.tier===k?' on':'')+'" data-act="lb-tier" data-i="'+i+'" data-k="'+k+'"><b>'+TIERS[k].n+'</b><span>'+TIERS[k].d+'</span></button>').join('')+'</div>';
}
const SWATCH=['#b5382f','#8c1d2e','#e07a1f','#c2902b','#d4a017','#3a5f2b','#1d6b4a','#2f8f6d','#2d8a8a','#1f7fa6','#2a6fb0','#1f4e9c','#1b3a6b','#5468bb','#5a3d99','#7d2a5c','#6d6f78','#8e5a2b'];
function teamOpts(excl,sel){const T=LS.tpl;return [0,1,2,3].map(c=>'<optgroup label="'+esc(T.confs[c])+'">'+T.teams.map((t,k)=>k).filter(k=>T.teams[k].conf===c&&!excl.includes(k)).map(k=>'<option value="'+k+'"'+(sel===k?' selected':'')+'>'+esc(T.teams[k].name)+'</option>').join('')+'</optgroup>').join('')}
function extraRow(r,from){const T=LS.tpl,o=from==null?null:(r.a===from?r.b:r.a);
  return '<div class="xr"><div class="xrt"><b>'+(o==null?esc(T.teams[r.a].name)+' vs '+esc(T.teams[r.b].name):'vs '+esc(T.teams[o].name))+'</b><span class="muted">'+(T.teams[r.a].conf===T.teams[r.b].conf?'Same conference, so they meet every year anyway':'Cross-conference')+'</span></div>'+
  '<select data-lb="rtype" data-k="'+r.k+'" aria-label="Rivalry type"><option value="annual"'+(r.type==='annual'?' selected':'')+'>Annual: play every year</option><option value="occ"'+(r.type==='occ'?' selected':'')+'>Occasional: only when they meet</option></select>'+
  '<input data-lb="rtrophy" data-k="'+r.k+'" value="'+esc(r.trophy)+'" maxlength="30" aria-label="Trophy name"><button class="btn ghost small" data-act="lb-delriv" data-k="'+r.k+'">Remove</button></div>'}
function addForm(from){
  const T=LS.tpl,ex=from==null?[]:[from,rivalOfT(from),...extrasOfT(from).map(r=>r.a===from?r.b:r.a)].filter(x=>x!=null);
  return '<div class="xadd">'+(from==null?'<label class="lbl">Team<select id="xa">'+teamOpts([],null)+'</select></label>':'')+
    '<label class="lbl">Rival<select id="xb">'+teamOpts(ex,null)+'</select></label><label class="lbl">How often<select id="xt"><option value="annual">Annual: play every year</option><option value="occ">Occasional: only when they meet</option></select></label>'+
    '<button class="btn small" data-act="lb-addriv"'+(from!=null?' data-i="'+from+'"':'')+'>Add rival</button></div>';
}
function modalHTML(){
  const T=LS.tpl,m=BV.modal;let body='',title='';
  if(m.type==='team'){
    const i=m.i,t=T.teams[i],rv=rivalOfT(i),mates=T.teams.map((x,k)=>k).filter(k=>k!==i&&T.teams[k].conf===t.conf);
    title=t.name;
    body='<div class="mgrid"><label>Name<input data-lb="name" data-i="'+i+'" value="'+esc(t.name)+'" maxlength="26"></label><label>Abbreviation<input data-lb="abbr" data-i="'+i+'" value="'+esc(t.abbr)+'" maxlength="4"></label><label>Mascot<input data-lb="mascot" data-i="'+i+'" value="'+esc(t.mascot)+'" maxlength="20"></label><label>City<input data-lb="city" data-i="'+i+'" value="'+esc(t.city)+'" maxlength="28"></label></div>'+
      '<p class="eyebrow">Second color <span class="muted" style="text-transform:none;letter-spacing:0">(used in the logo)</span></p><div class="sw">'+['#ffffff','#f2c14e','#eaaa00','#14213d','#000000','#c0c0c0','#b5382f','#1b3a6b'].map(c=>'<button class="swb'+(color2Of(t)===c?' on':'')+'" style="background:'+c+'" data-act="lb-color2" data-i="'+i+'" data-c="'+c+'" aria-label="Second color '+c+'"></button>').join('')+'<span class="lgo" style="margin-left:8px">'+logoSVG(t)+'</span><span class="lgo">'+logoSVG(t,'alt')+'</span></div>'+
      '<p class="eyebrow">Team color</p><div class="sw">'+SWATCH.map(c=>'<button class="swb'+(t.color===c?' on':'')+'" style="background:'+c+'" data-act="lb-color" data-i="'+i+'" data-c="'+c+'" aria-label="Color '+c+'"></button>').join('')+'<label class="swc">Custom <input type="color" data-lb="color" data-i="'+i+'" value="'+t.color+'"></label></div>'+
      '<label class="lbl">Conference and division<select data-lb="place" data-i="'+i+'">'+[0,1,2,3].map(c=>[0,1].map(d=>'<option value="'+c+','+d+'"'+(t.conf===c&&t.div===d?' selected':'')+'>'+esc(T.confs[c]+' · '+T.divs[c][d])+'</option>').join('')).join('')+'</select></label>'+
      '<label class="lbl">Rivalry Week rival (same conference)<select data-lb="rival" data-i="'+i+'"><option value="">No rival</option>'+mates.map(k=>'<option value="'+k+'"'+(rv===k?' selected':'')+'>'+esc(T.teams[k].name)+(rivalOfT(k)!=null&&rivalOfT(k)!==i?' (takes from '+esc(T.teams[rivalOfT(k)].abbr)+')':'')+'</option>').join('')+'</select></label>'+
      (rv!=null?'<label class="lbl">Trophy name<input data-lb="trophy" data-i="'+i+'" value="'+esc((T.rivals.find(r=>isMain(r)&&(r.a===i||r.b===i))||{}).trophy||'')+'" maxlength="30"></label>':'')+
      '<p class="eyebrow">More rivals</p><p class="muted" style="font-size:12.5px">Any conference. Annual rivals get scheduled every year in the non-conference weeks (up to 5). Occasional rivals only count when they happen to meet.</p>'+
      extrasOfT(i).map(r=>extraRow(r,i)).join('')+(annualCross(i)>5?'<p class="bad" style="font-size:12.5px">More than 5 cross-conference annual rivals. Only 5 fit on the schedule each year.</p>':'')+addForm(i)+
      '<p class="eyebrow">Program history</p>'+tierCards(i)+
      '<div class="mgrid"><label>National titles<input type="number" min="0" max="30" data-lb="natl" data-i="'+i+'" value="'+t.natl+'"></label><label>Conference titles<input type="number" min="0" max="60" data-lb="ct" data-i="'+i+'" value="'+t.ct+'"></label><label>Last national title<input type="number" min="1900" max="2026" data-lb="last" data-i="'+i+'" value="'+(t.last||'')+'" placeholder="Never"></label></div>'+
      '<p class="muted" style="font-size:12.5px">All-time record '+t.w+'-'+t.l+'. Picking a history sets starting prestige and ratings, plus the numbers above (you can edit them).</p>';
  }else if(m.type==='rivals'){
    title='Rivalries';
    body='<p class="muted" style="font-size:13px">Pick each team\'s rival. Rivals play in Rivalry Week (Week 12), so they need to be in the same conference. Anyone left unpaired gets matched automatically when the season starts.</p>';
    for(let c=0;c<4;c++){
      const ids=T.teams.map((t,i)=>i).filter(i=>T.teams[i].conf===c);
      body+='<h3 style="margin-top:6px">'+esc(T.confs[c])+' · Rivalry Week</h3><div class="rvl">'+ids.map(i=>{const rv=rivalOfT(i);return '<div class="rvr"><span class="dot" style="background:'+T.teams[i].color+'"></span><b>'+esc(T.teams[i].name)+'</b><select data-lb="rival" data-i="'+i+'"><option value="">No rival</option>'+ids.filter(k=>k!==i).map(k=>'<option value="'+k+'"'+(rv===k?' selected':'')+'>'+esc(T.teams[k].name)+'</option>').join('')+'</select></div>'}).join('')+'</div>';
      const prs=T.rivals.filter(r=>isMain(r)&&T.teams[r.a].conf===c&&T.teams[r.b].conf===c);
      body+=prs.map(r=>'<label class="lbl tro">'+esc(T.teams[r.a].abbr)+' vs '+esc(T.teams[r.b].abbr)+' trophy<input data-lb="trophy" data-i="'+r.a+'" value="'+esc(r.trophy)+'" maxlength="30"></label>').join('');
    }
    const xs=T.rivals.map((r,k)=>({...r,k})).filter(r=>!isMain(r));
    body+='<h3 style="margin-top:10px">More rivalries</h3><p class="muted" style="font-size:13px">Add as many as you want, from any conference. Annual rivals play every year. Occasional rivals get the rivalry treatment (trophy, series record, louder crowd) whenever they happen to meet.</p>'+(xs.length?xs.map(r=>extraRow(r,null)).join(''):'<p class="muted" style="font-size:13px">None yet.</p>')+'<p class="eyebrow">Add a rivalry</p>'+addForm(null);
  }else if(m.type==='start'){
    title='Your league is saved';
    body='<p>You opened the builder from a career that uses the original made-up teams. That career can\'t switch leagues partway through.</p>'+
      '<p class="muted" style="font-size:13.5px">Start a new career to play in the Church League. You\'ll pick your team next. Your current career and its records will be replaced.</p>'+
      (m.confirm?'<button class="btn" data-act="lb-startch" data-sure="1">Yes, replace my career and start the Church League</button>':'<button class="btn" data-act="lb-startch">Start a Church League career</button>')+
      '<button class="btn ghost small" data-act="lb-done" data-keep="1">Keep my current career for now</button>';
  }else if(m.type==='history'){
    title='Program histories';
    body='<p class="muted" style="font-size:13px">How has each program done over the years? Pick a history, then type in how many national and conference titles each team has won. Picking a history fills in a starting guess for the titles. Type over it with the real numbers.</p>'+
      '<div class="tlegend">'+TIER_KEYS.map(k=>'<span><b>'+TIERS[k].n+':</b> '+TIERS[k].d+'</span>').join('')+'</div>';
    for(let c=0;c<4;c++){
      const ids=T.teams.map((t,i)=>i).filter(i=>T.teams[i].conf===c);
      body+='<h3 style="margin-top:6px">'+esc(T.confs[c])+'</h3><div class="rvl">'+ids.map(i=>{const t=T.teams[i];return '<div class="hrow"><div class="rvr">'+mlogo(t)+'<button class="lnk" data-act="lb-team" data-i="'+i+'">'+esc(t.name)+'</button><select data-lb="tier" data-i="'+i+'">'+TIER_KEYS.map(k=>'<option value="'+k+'"'+(t.tier===k?' selected':'')+'>'+TIERS[k].n+'</option>').join('')+'</select></div>'+
        '<div class="hnums"><label>Natl titles<input type="number" inputmode="numeric" min="0" max="99" data-lb="natl" data-i="'+i+'" value="'+t.natl+'"></label><label>Conf titles<input type="number" inputmode="numeric" min="0" max="99" data-lb="ct" data-i="'+i+'" value="'+t.ct+'"></label><label>Last natl title<input type="number" inputmode="numeric" min="1900" max="2026" data-lb="last" data-i="'+i+'" value="'+(t.last||'')+'" placeholder="Never"></label></div></div>'}).join('')+'</div>';
    }
  }
  return '<div class="modal" role="dialog" aria-modal="true" aria-label="'+esc(title)+'"><div class="mpanel"><div class="spread mhead"><h2>'+esc(title)+'</h2><button class="btn ghost small" data-act="lb-close">Done</button></div><div class="mbody">'+body+'</div></div></div>';
}
function lbInput(e){
  const el=e.target;if(!el.dataset||!el.dataset.lb||!LS)return;
  const T=LS.tpl,k=el.dataset.lb,i=+el.dataset.i,v=el.value;let rer=false;
  if(k==='conf')T.confs[+el.dataset.c]=v||T.confs[+el.dataset.c];
  else if(k==='div')T.divs[+el.dataset.c][+el.dataset.d]=v||T.divs[+el.dataset.c][+el.dataset.d];
  else if(k==='name'||k==='mascot'||k==='city'){if(v.trim())T.teams[i][k]=v.trim()}
  else if(k==='abbr'){if(v.trim())T.teams[i].abbr=v.trim().toUpperCase().slice(0,4)}
  else if(k==='natl'||k==='ct'){const nv=clamp(parseInt(v)||0,0,99),dl=nv-(T.teams[i][k]||0);T.teams[i][k]=nv;if(dl&&S&&S.lname==='Church League'&&S.teams[i]&&S.teams[i].hist){S.teams[i].hist[k]=Math.max(0,S.teams[i].hist[k]+dl);save()}}
  else if(k==='last'){T.teams[i].last=parseInt(v)||null;if(S&&S.lname==='Church League'&&S.teams[i]&&S.teams[i].hist&&!/Season/.test(String(S.teams[i].hist.last||''))){S.teams[i].hist.last=T.teams[i].last;save()}}
  else if(k==='rtrophy'){const r=T.rivals[+el.dataset.k];if(r&&v.trim())r.trophy=v.trim()}
  else if(k==='rtype'&&e.type==='change'){const r=T.rivals[+el.dataset.k];if(r){r.type=v;rer=true}}
  else if(k==='color'){T.teams[i].color=v;if(e.type==='change')rer=true}
  else if(k==='trophy'){const r=T.rivals.find(r=>isMain(r)&&(r.a===i||r.b===i));if(r&&v.trim())r.trophy=v.trim()}
  else if(e.type==='change'){
    if(k==='rival'){setRival(i,v===''?null:+v);rer=true}
    else if(k==='tier'){setTier(i,v);rer=true}
    else if(k==='place'){const [c,d]=v.split(',').map(Number);moveTeam(i,c,d);rer=true}
  }
  saveLS();if(rer)render();
}
if(typeof document!=='undefined'&&document.addEventListener){
  document.addEventListener('change',e=>{if(e.target&&e.target.dataset&&e.target.dataset.sched&&S){S.schedTeam=+e.target.value;save();render()}});
  document.addEventListener('input',lbInput);document.addEventListener('change',lbInput);
  document.addEventListener('change',e=>{const t=e.target;if(t&&t.dataset&&t.dataset.logo)logoUpload(t)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&BV.modal){BV.modal=null;render()}else if(e.key==='Escape'&&S&&(S.gview!=null||S.phist!=null||S.rview!=null)){S.gview=null;S.phist=null;S.rview=null;render()}});
  document.addEventListener('pointerdown',e=>{
    const h=e.target.closest&&e.target.closest('[data-drag]');if(!h)return;
    e.preventDefault();
    const chip=h.closest('.tchip'),r=chip.getBoundingClientRect(),g=chip.cloneNode(true);
    g.classList.add('ghost');g.style.width=r.width+'px';g.style.left=r.left+'px';g.style.top=r.top+'px';document.body.appendChild(g);
    chip.classList.add('dragging');DRAG={i:+h.dataset.drag,g,chip,dx:e.clientX-r.left,dy:e.clientY-r.top,y:e.clientY};
    try{h.setPointerCapture(e.pointerId)}catch(_){}
  });
  document.addEventListener('pointermove',e=>{
    if(!DRAG)return;e.preventDefault();
    DRAG.g.style.left=(e.clientX-DRAG.dx)+'px';DRAG.g.style.top=(e.clientY-DRAG.dy)+'px';DRAG.y=e.clientY;
    document.querySelectorAll('.divbox.over,.tchip.over').forEach(x=>x.classList.remove('over'));
    const el=document.elementFromPoint(e.clientX,e.clientY),t=el&&(el.closest('.tchip:not(.dragging)')||el.closest('[data-drop]'));if(t)t.classList.add('over');
    if(!DRAG.sc){DRAG.sc=setInterval(()=>{if(!DRAG)return;const H=window.innerHeight;if(DRAG.y<70)window.scrollBy(0,-14);else if(DRAG.y>H-70)window.scrollBy(0,14)},30)}
  },{passive:false});
  const endDrag=e=>{
    if(!DRAG)return;const D=DRAG;DRAG=null;clearInterval(D.sc);D.g.remove();D.chip.classList.remove('dragging');
    if(e.type==='pointerup'){
      const el=document.elementFromPoint(e.clientX,e.clientY),tc=el&&el.closest('.tchip'),dz=el&&el.closest('[data-drop]');
      if(tc&&+tc.dataset.team!==D.i)swapTeams(D.i,+tc.dataset.team);
      else if(dz){const [c,d]=dz.dataset.drop.split(',').map(Number);moveTeam(D.i,c,d)}
    }
    render();
  };
  document.addEventListener('pointerup',endDrag);document.addEventListener('pointercancel',endDrag);
}

/* ---------- account sync (db capability), browser storage as cache ---------- */
const CLOUD={db:null,uid:null,ready:false,timer:null,lts:null,cts:null,state:'local',hadCareer:false};
function cloudStatus(){
  return {local:'Saving on this device only. Open the game while signed in to Claude to sync it to your account.',loading:'Connecting to your account...',synced:'Saved to your Claude account. It follows you to any device.',saving:'Saving to your account...',error:'Could not reach your account just now. Saved on this device, and it will retry.'}[CLOUD.state];
}
function applyCareerGlobals(){
  try{applyLoreTpl();if(S&&S.teams){patchRivals();applyLoreCareer()}}catch(e){}
  if(S&&S.confs){CONFS=S.confs;DIVS=S.divs||null}else if(!S){L=newLeague()}
  if(S&&S.teams){patchLeague();patchRivals();try{freshRivals();expandQueue();setPN();pollFix()}catch(e){}if(S.games){tagRivals();try{fixCCG()}catch(e){}try{fixField()}catch(e){}try{clsSeed()}catch(e){}}
    if(!S.heatFixV1){S.teams.forEach(t=>{const x=(t.past||[])[(t.past||[]).length-1];if(x&&x.s===S.season-1&&t.coach&&t.id!==S.userId){seasonRelief(t,x);if(x.natl)t.coach.heat=Math.min(t.coach.heat,10)}});S.heatFixV1=true}
    if(!S.rivReqV2&&S.lname==='Church League'&&S.rivalDefs&&S.teams.length===32){
      for(const [a,b,tr,na,nb] of [[11,16,'The Broken Arrow-Springfield Cup',/Broken Arrow/,/Berean/],[6,4,'The Scottsdale-San Diego Cup',/Northway/,/San Diego/]]){
        if(!na.test(team(a).name)||!nb.test(team(b).name))continue;
        const has=x=>x.some(r=>(r.a===a&&r.b===b)||(r.a===b&&r.b===a)),R0={a,b,type:'annual',trophy:tr};
        if(LS&&LS.tpl&&LS.tpl.rivals&&!has(LS.tpl.rivals)){LS.tpl.rivals.push({...R0});saveLSQuiet()}
        if(!has(S.rivalDefs)){S.rivalDefs.push({...R0});syncRivals();S.histFixV2=false}
      }
      S.rivReqV2=true}
    if(!S.histFixV2&&S.rivals&&S.games){for(const g of S.games)delete g.riv;tagRivals();S.serV2=false;S.serV3=false;S.rivals.forEach(r=>{r.hist=(r.hist||[]).filter(m=>m.y<yearOf(S.season));delete r.arch});S.arch=null;S.histFixV2=true}
    fixSeries();if(!S.arch&&S.lore&&S.lore.length){try{genArchive()}catch(e){}}if(S.games&&S.news&&(!S.pod||S.pod.season!==S.season||!S.pod.eps.length)){try{podWeek()}catch(e){}}if(!S.prV1&&S.games){S.teams.forEach(t=>t.pr={o:0,d:0});for(let w=0;w<Math.min(S.week,12);w++)updatePower(w);S.prV1=true}}
  patchG();
}
function careerProg(c){if(!c||!c.teams)return -1;const done=(c.games||[]).filter(g=>g.done).length;return (c.season||0)*100000+(c.week||0)*1000+done*4+(c.view==='presser'?1:0)+(c.game?2:0)}
function sameCareer(a,b){if(!a||!b)return false;if(a._cid&&b._cid)return a._cid===b._cid;return (a.lname||'')===(b.lname||'')&&(a.coach||'')===(b.coach||'')}
function progLabel(c){try{return 'Season '+c.season+', '+weekLabelOf(c)}catch(e){return 'Season '+(c&&c.season)}}
function weekLabelOf(c){const w=c.week||0;return w<=11?'Week '+(w+1):w===12?'Conference title week':w===16?'National title week':'Playoffs'}
/* saves are gzipped before they go to the account, so a long career stays well under the size limit */
/* past 75% of one save document, trim only throwaway items (fan feed, GameDay log, old podcast episodes).
   Program history, rivalry games, the league archive, classics, titles and records are never trimmed. If the save still
   outgrows one document, it is split across several documents instead. */
const SAVE_SOFT=196608,CHUNK=240000;
function trimSave(lv){const tail=(a,n)=>Array.isArray(a)&&a.length>n?a.slice(-n):a,head=(a,n)=>Array.isArray(a)&&a.length>n?a.slice(0,n):a;
  S.feed=head(S.feed,lv>=2?12:30);S.gdHist=tail(S.gdHist,lv>=2?20:40);if(S.pod&&Array.isArray(S.pod.eps))S.pod.eps=tail(S.pod.eps,lv>=2?1:2);S.trimmed={season:S.season,lv}}
async function writeSplit(id,js,extra){const b='data/users/'+CLOUD.uid+'/';
  if(js.length<=CHUNK){await CLOUD.db.doc(b+id).set(Object.assign({json:js},extra));return}
  let gen='a';try{const c=await CLOUD.db.doc(b+id).get();if(c.exists&&(c.data()||{}).gen==='a')gen='b'}catch(e){}
  const n=Math.ceil(js.length/CHUNK);for(let i=0;i<n;i++)await CLOUD.db.doc(b+id+'_'+gen+i).set({json:js.slice(i*CHUNK,(i+1)*CHUNK)});
  await CLOUD.db.doc(b+id).set(Object.assign({parts:n,gen},extra))}
async function docJson(id,d){if(!d||!d.parts)return d&&d.json;const b='data/users/'+CLOUD.uid+'/';let s='';for(let i=0;i<d.parts;i++){const r=await CLOUD.db.doc(b+id+'_'+d.gen+i).get();if(!r.exists)throw new Error('missing save part');s+=(r.data()||{}).json||''}return s}
async function packSave(){let js=JSON.stringify(S),pk=await zpack(js),lv=0;while(pk.length>SAVE_SOFT&&lv<2){trimSave(++lv);js=JSON.stringify(S);pk=await zpack(js)}if(lv)try{localStorage.setItem('saturday_sideline_v1',js)}catch(e){}return pk}
async function zpack(s){try{if(typeof CompressionStream==='undefined')return s;const cs=new Blob([s]).stream().pipeThrough(new CompressionStream('gzip'));const buf=new Uint8Array(await new Response(cs).arrayBuffer());let bin='';for(let i=0;i<buf.length;i+=0x8000)bin+=String.fromCharCode.apply(null,buf.subarray(i,i+0x8000));return 'gz:'+btoa(bin)}catch(e){return s}}
async function zunpack(v){if(typeof v!=='string'||v.slice(0,3)!=='gz:')return v;const bin=atob(v.slice(3)),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);const ds=new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'));return await new Response(ds).text()}
async function cloudSnap(id,docData,src){try{if(!CLOUD.db||!docData)return;const js=await docJson(src||'career',docData);if(js)await writeSplit(id,js,{ts:docData.ts||Date.now(),saved:Date.now()})}catch(e){}}
async function cloudInit(){
  if(typeof window==='undefined'||!window.claude||typeof window.claude.use!=='function')return;
  CLOUD.state='loading';
  try{
    const [db,user]=await Promise.all([window.claude.use('db'),window.claude.use('user')]);
    if(!db||!user){CLOUD.state='local';refreshStatus();return}
    const uid=await user.id();if(!uid){CLOUD.state='local';refreshStatus();return}
    CLOUD.db=db;CLOUD.uid=uid;
    const base='data/users/'+uid+'/';
    const [ls,cs]=await Promise.all([db.doc(base+'league').get(),db.doc(base+'career').get()]);
    let changed=false;SYNCQ=null;
    const bk=k=>{try{const v=localStorage.getItem(k);if(!v)return;if(k==='saturday_sideline_v1'){const o=localStorage.getItem(k+'_backup');if(o){try{const a=JSON.parse(o),b=JSON.parse(v);if(sameCareer(a,b)&&careerProg(a)>careerProg(b))return}catch(e){}}}localStorage.setItem(k+'_backup',v)}catch(e){}};
    if(ls.exists){const d=ls.data()||{};try{const cl=JSON.parse(await zunpack(d.json));if(cl&&cl.tpl&&cl.tpl.teams&&(cl.tpl.teams.length===32||cl.tpl.teams.length===48)){
      CLOUD.lts=cl._ts||0;
      if(!LS||!LS._edited){LS=cl;LS._edited=true;try{localStorage.setItem('saturday_sideline_league_v1',JSON.stringify(LS))}catch(e){}changed=true}
      else if(JSON.stringify(cl.tpl)===JSON.stringify(LS.tpl)){CLOUD.lts=LS._ts||0}
      else if(LS._ts&&cl._ts&&cl._ts>LS._ts){bk('saturday_sideline_league_v1');LS=cl;LS._edited=true;try{localStorage.setItem('saturday_sideline_league_v1',JSON.stringify(LS))}catch(e){}changed=true}
      else if(!LS._ts){SYNCQ=SYNCQ||{};SYNCQ.league=cl}
    }}catch(e){}}
    if(cs.exists){
      const d=cs.data()||{};CLOUD.hadCareer=!d.none;CLOUD.cts=d.ts||0;
      if(!d.none&&!SC.A){try{const cv=JSON.parse(await zunpack(await docJson('career',d)));if(cv&&cv.teams){
        if(!S){S=cv;G=S.game||null;try{localStorage.setItem('saturday_sideline_v1',JSON.stringify(S))}catch(e){}changed=true}
        else if(!sameCareer(cv,S)){if(JSON.stringify(cv.teams)!==JSON.stringify(S.teams)){SYNCQ=SYNCQ||{};SYNCQ.career=cv}}
        else{const pc=careerProg(cv),pl=careerProg(S);
          if(pc>pl||(pc===pl&&(d.ts||0)>(S._ts||0))){bk('saturday_sideline_v1');S=cv;G=S.game||null;try{localStorage.setItem('saturday_sideline_v1',JSON.stringify(S))}catch(e){}changed=true;CLOUD.cts=d.ts||0}
          else if(pl>pc){await cloudSnap('career_prev',d)}}
      }}catch(e){}}
    }
    if(S&&!SYNCQ)CLOUD.sprog=careerProg(S);
    if(S&&!S._cid){S._cid='L'+hashS((S.lname||'')+'|'+(S.coach||'')+'|'+(S.baseYear||''))}
    if(SYNCQ){CLOUD.hold=true;CLOUD.ready=true;CLOUD.state='local';applyCareerGlobals();render();return}
    CLOUD.ready=true;CLOUD.state='synced';
    if(changed){BV.open=BV.open&&!!LS;applyCareerGlobals();render()}else refreshStatus();
    cloudPush();
  }catch(e){CLOUD.state='error';refreshStatus()}
}
function cloudQueue(){if(!CLOUD.ready)return;clearTimeout(CLOUD.timer);CLOUD.timer=setTimeout(cloudPush,1200)}
let pushing=false;
async function cloudPush(retry){
  if(!CLOUD.db||pushing||CLOUD.hold)return;pushing=true;
  const base='data/users/'+CLOUD.uid+'/';
  try{
    if(LS&&LS._edited&&(LS._ts||0)!==CLOUD.lts){
      const cur=await CLOUD.db.doc(base+'league').get();let adopted=false;
      if(cur.exists){const cd=cur.data()||{};if((cd.ts||0)!==CLOUD.lts&&(LS._uedit||0)<(cd.ts||0)){try{const cl=JSON.parse(await zunpack(cd.json));if(cl&&cl.tpl&&cl.tpl.teams&&(cl.tpl.teams.length===32||cl.tpl.teams.length===48)){LS=cl;LS._edited=true;saveLSQuiet();CLOUD.lts=cd.ts||0;adopted=true}}catch(e){}}}
      if(!adopted){CLOUD.state='saving';refreshStatus();const ts=LS._ts||Date.now();await CLOUD.db.doc(base+'league').set({json:JSON.stringify(LS),ts});CLOUD.lts=ts}}
    if(S&&(S._ts||0)!==CLOUD.cts){CLOUD.state='saving';refreshStatus();if(!S._ts)S._ts=Date.now();
      const cur=await CLOUD.db.doc(base+'career').get();
      if(cur.exists){const cd=cur.data()||{};
        if(!cd.none&&(cd.json||cd.parts)&&(cd.ts||0)!==CLOUD.cts&&!CLOUD.force){
          let cv=null;try{cv=JSON.parse(await zunpack(await docJson('career',cd)))}catch(e){}
          if(cv&&cv.teams){
            const newer=sameCareer(cv,S)&&(careerProg(cv)>careerProg(S)||(CLOUD.sprog!=null&&careerProg(S)===CLOUD.sprog&&careerProg(cv)>=careerProg(S)));
            if(newer&&G&&S.view==='game'){pushing=false;CLOUD.state='error';refreshStatus();return}
            if(newer){try{const o=localStorage.getItem('saturday_sideline_v1_backup');let keep=false;if(o){const a=JSON.parse(o);keep=sameCareer(a,S)&&careerProg(a)>careerProg(S)}if(!keep)localStorage.setItem('saturday_sideline_v1_backup',JSON.stringify(S))}catch(e){}S=cv;G=S.game||null;try{localStorage.setItem('saturday_sideline_v1',JSON.stringify(S))}catch(e){}CLOUD.cts=cd.ts||0;CLOUD.sprog=careerProg(S);pushing=false;CLOUD.state='synced';applyCareerGlobals();if(!SC.A&&!(typeof G!=='undefined'&&G&&S.view==='game'))render();refreshStatus();return}
            if(!sameCareer(cv,S)){CLOUD.hold=true;SYNCQ={career:cv};pushing=false;CLOUD.state='local';render();return}
          }}
        if(!cd.none&&(cd.json||cd.parts)){let cv=null;try{cv=JSON.parse(await zunpack(await docJson('career',cd)))}catch(e){}if(cv&&(!sameCareer(cv,S)||careerProg(cv)>careerProg(S)))await cloudSnap('career_prev',cd)}
      }
      CLOUD.force=false;
      const pk=await packSave();await writeSplit('career',pk,{ts:S._ts});CLOUD.errAt=0;CLOUD.cts=S._ts;CLOUD.sprog=careerProg(S);CLOUD.hadCareer=true;
      const wk=(S.season||0)*20+(S.week||0);if(CLOUD.snapWk!==wk){CLOUD.snapWk=wk;await cloudSnap('snap'+(wk%10),{json:pk,ts:S._ts})}}
    else if(!S&&CLOUD.hadCareer){try{const cur=await CLOUD.db.doc(base+'career').get();if(cur.exists&&!(cur.data()||{}).none)await cloudSnap('career_prev',cur.data())}catch(e){}const ts=Date.now();await CLOUD.db.doc(base+'career').set({none:true,ts});CLOUD.cts=ts;CLOUD.hadCareer=false}
    CLOUD.state='synced';
  }catch(e){CLOUD.state='error';CLOUD.errAt=CLOUD.errAt||Date.now();setTimeout(()=>{pushing=false;cloudPush(true)},(retry?20000:4000)+Math.random()*2000);try{render()}catch(x){}}
  pushing=false;refreshStatus();
}
let SYNCQ=null;
async function loadSnaps(){
  CLOUD.snaps=null;render();
  if(!CLOUD.db){CLOUD.snaps=[];render();return}
  const ids=['career_prev'].concat([0,1,2,3,4,5,6,7,8,9].map(i=>'snap'+i)),out=[];
  await Promise.all(ids.map(async id=>{try{const r=await CLOUD.db.doc('data/users/'+CLOUD.uid+'/'+id).get();if(r.exists){const d=r.data()||{};const c=JSON.parse(await zunpack(await docJson(id,d)));if(c&&c.teams&&sameCareer(c,S))out.push({id,c,ts:d.saved||d.ts||0,prog:careerProg(c)})}}catch(e){}}));
  out.sort((a,b)=>b.prog-a.prog||b.ts-a.ts);
  CLOUD.snaps=out.filter((x,i,a)=>a.findIndex(y=>y.prog===x.prog)===i);render();
}
function snapModal(){
  if(!S||!CLOUD.snapOpen)return '';
  const L2=CLOUD.snaps;let b='<p class="muted" style="font-size:13px">Your account keeps a copy of your career each week, plus a copy of anything that gets replaced. Pick one to load it. What you have now is kept as this device\'s previous save.</p><p style="font-size:13px"><b>Now:</b> '+esc(progLabel(S))+'</p>';
  if(L2==null)b+='<p class="muted">Loading...</p>';
  else if(!L2.length)b+='<p class="muted">No account backups yet. They start saving as you play.</p>';
  else b+='<div class="sched">'+L2.map((x,i)=>{const r=x.c.teams&&x.c.games?(x.c.games.filter(g=>g.done&&(g.h===x.c.userId||g.a===x.c.userId)).reduce((a,g)=>{const w=(g.h===x.c.userId?g.hs>g.as:g.as>g.hs);a[w?0:1]++;return a},[0,0])):[0,0];return '<div class="g"><span class="wk">'+(x.id==='career_prev'?'Replaced':'Weekly')+'</span><span style="min-width:0"><b>'+esc(progLabel(x.c))+'</b><br><small class="muted">'+esc(x.c.teams[x.c.userId].name)+' '+r[0]+'-'+r[1]+(x.ts?' · saved '+new Date(x.ts).toLocaleString([], {month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}):'')+'</small></span><button class="btn ghost small" data-act="snapuse" data-i="'+i+'">Load</button></div>'}).join('')+'</div>';
  return '<div class="modal" role="dialog" aria-modal="true" aria-label="Account backups"><div class="mpanel"><div class="spread mhead"><h2>Account backups</h2><button class="btn ghost small" data-act="snapclose">Close</button></div><div class="mbody">'+b+'</div></div></div>';
}
function lgSummary(x){const T=x.tpl;return 'Conferences: '+T.confs.join(', ')+'. Teams include '+T.teams.slice(0,6).map(t=>t.name).join(', ')+'.'}
function crSummary(c){try{const t=c.teams[c.userId];return t.name+', season '+c.season+(c.lname?' ('+c.lname+')':'')}catch(e){return 'A saved career'}}
function syncModal(){
  const q=SYNCQ;if(!q)return '';
  let b='<p>This device has a save from before account syncing, and your Claude account has a different one. Pick which to keep. The other is saved as a backup on this device.</p>';
  b+='<div class="cmpx"><div class="cmp"><span class="eyebrow">On this device</span>'+(q.league?'<p><b>League:</b> '+esc(lgSummary(LS))+'</p>':'')+(q.career&&S?'<p><b>Career:</b> '+esc(crSummary(S))+'</p>':'')+'<button class="btn" data-act="sync-local">Keep this device\'s</button></div>';
  b+='<div class="cmp"><span class="eyebrow">In your Claude account</span>'+(q.league?'<p><b>League:</b> '+esc(lgSummary(q.league))+'</p>':'')+(q.career?'<p><b>Career:</b> '+esc(crSummary(q.career))+'</p>':'')+'<button class="btn ghost" data-act="sync-cloud">Use my account\'s</button></div></div>';
  return '<div class="modal" role="dialog" aria-modal="true" aria-label="Choose a save"><div class="mpanel"><div class="mhead"><h2>Two saves found</h2></div><div class="mbody">'+b+'</div></div></div>';
}
function syncChoose(which){
  const q=SYNCQ;if(!q)return;const now=Date.now();
  const stash=(k,v)=>{try{localStorage.setItem(k+'_backup',JSON.stringify(v))}catch(e){}};
  if(which==='local'){if(q.league)stash('saturday_sideline_league_v1',q.league);if(q.career)stash('saturday_sideline_v1',q.career);if(LS){LS._ts=now;LS._edited=true;try{localStorage.setItem('saturday_sideline_league_v1',JSON.stringify(LS))}catch(e){}}if(S){S._ts=now;try{localStorage.setItem('saturday_sideline_v1',JSON.stringify(S))}catch(e){}}}
  else{if(q.league){stash('saturday_sideline_league_v1',LS);LS=q.league;LS._edited=true;LS._ts=now;try{localStorage.setItem('saturday_sideline_league_v1',JSON.stringify(LS))}catch(e){}}if(q.career){if(S)stash('saturday_sideline_v1',S);S=q.career;G=S.game||null;S._ts=now;try{localStorage.setItem('saturday_sideline_v1',JSON.stringify(S))}catch(e){}}}
  SYNCQ=null;CLOUD.hold=false;CLOUD.state='synced';applyCareerGlobals();cloudPush();
}
function restorePrev(){
  let ok=false;
  try{const a=localStorage.getItem('saturday_sideline_league_v1_backup');if(a){const o=JSON.parse(a);if(o&&o.tpl){LS=o;saveLS();ok=true}}}catch(e){}
  try{const b=localStorage.getItem('saturday_sideline_v1_backup');if(b){const o=JSON.parse(b);if(o&&o.teams){S=o;G=S.game||null;save();ok=true}}}catch(e){}
  if(ok)applyCareerGlobals();return ok;
}
function devPrevBtn(){try{const b=localStorage.getItem('saturday_sideline_v1_backup');if(!b)return '';const o=JSON.parse(b);if(!o||!o.teams)return '';return '<div class="row"><button class="btn ghost small" data-act="bk-prev">Load this device\'s backup ('+esc(progLabel(o))+')</button></div>'}catch(e){return ''}}
function hasPrev(){try{return !!(localStorage.getItem('saturday_sideline_league_v1_backup')||localStorage.getItem('saturday_sideline_v1_backup'))}catch(e){return false}}
function refreshStatus(){if(typeof document==='undefined'||typeof document.querySelectorAll!=='function')return;document.querySelectorAll('[data-sync]').forEach(el=>{el.textContent=cloudStatus();el.className='sync '+CLOUD.state})}
function syncLine(){return '<p class="sync '+CLOUD.state+'" data-sync="1">'+esc(cloudStatus())+'</p>'}
if(typeof document!=='undefined'&&document.addEventListener)document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&CLOUD.ready){clearTimeout(CLOUD.timer);cloudPush()}});

/* ---------- backup code ---------- */
function backupCode(){return 'SSB1:'+btoa(unescape(encodeURIComponent(JSON.stringify({LS,S}))))}
function restoreCode(txt){
  const t=(txt||'').trim().replace(/^SSB1:/,'');
  const o=JSON.parse(decodeURIComponent(escape(atob(t))));
  if(o.LS&&o.LS.tpl&&o.LS.tpl.teams&&(o.LS.tpl.teams.length===32||o.LS.tpl.teams.length===48)){LS=o.LS;saveLS()}
  if(o.S&&o.S.teams){S=o.S;G=S.game||null;save()}
  applyCareerGlobals();
}

/* ---------- builder edits flow into a Church League career ---------- */
function syncCareerFromTpl(){
  if(!S||S.lname!=='Church League'||!LS||!LS.tpl||LS.tpl.teams.length!==S.teams.length)return;
  const T=LS.tpl,fresh=S.week===0&&!S.games.some(g=>g.done)&&S.view!=='game';
  T.teams.forEach((x,i)=>{const t=S.teams[i];t.name=x.name;t.abbr=x.abbr;t.mascot=x.mascot;t.color=x.color;if(x.color2)t.color2=x.color2;t.city=x.city;if(t.hist)t.hist.tier=x.tier});
  if(fresh){
    T.teams.forEach((x,i)=>{const t=S.teams[i],X=TIERS[x.tier]||TIERS.middle,pr=clamp(X.p+ri(-2,2),x.tier==='startup'?38:50,96);t.conf=x.conf;t.div=x.div;t.prestige=pr;t.off=clamp(Math.round(pr+X.r+rnd(-5,5)),50,99);t.def=clamp(Math.round(pr+X.r+rnd(-5,5)),50,99);if(t.hist){t.hist.natl=x.natl;t.hist.ct=x.ct;t.hist.last=x.last;t.hist.w=x.w;t.hist.l=x.l}});
    S.confs=[...T.confs];S.divs=T.divs.map(d=>[...d]);CONFS=S.confs;DIVS=S.divs;S.rivals=null;S.rivalDefs=T.rivals.map(r=>({...r}));
    startSeason();S.tab='week';
  }else{
    S.pendingTpl=true;S.confs=S.confs||[...T.confs];
    if(S.arch&&S.arch.cc){const off=T.teams.some((x,i)=>x.ct!=null&&S.arch.cc.reduce((a,row)=>a+row.filter(v=>v===i).length,0)!==+x.ct);if(off)S.arch=null}
    T.confs.forEach((n,c)=>{S.confs[c]=n});if(S.divs)T.divs.forEach((d,c)=>{S.divs[c]=[...d]});CONFS=S.confs;DIVS=S.divs||null;
    syncRivals();
    if(S.rivals&&S.rivals.some(r=>!r.arch))S.arch=null;
    if(!S.arch&&S.lore&&S.lore.length){try{genArchive()}catch(e){}}
  }
}
function applyPendingTpl(){
  if(!S||!S.pendingTpl||S.lname!=='Church League'||!LS)return;
  LS.tpl.teams.forEach((x,i)=>{const t=S.teams[i];t.conf=x.conf;t.div=x.div});S.pendingTpl=false;
}

/* =================== VIEWS =================== */
function badge(t,size=''){return '<div class="badge lg" style="--tc:'+t.color+';'+size+'">'+logoSVG(t)+'</div>'}
function tier(p){return p>=86?'Blue blood':p>=77?'Contender':p>=67?'Rising':'Rebuild'}
function setupView(){
  const teams=(S&&S.teams)||L;
  const fired=S&&S.summary&&S.summary.fired;
  let h='<div class="hero"><span class="eyebrow">'+(fired?'Back on the market':'College football coaching sim')+'</span><h1>Saturday <span>Sideline</span></h1><p class="muted">'+(fired?'Pick your next program. Your career record follows you.':'Pick a program, call every play on a live field, and chase a title. Your career saves on this device.')+'</p></div>';
  if(!S){
    h+='<section class="card"><p class="eyebrow">League</p><div class="seg two"><button data-act="lg-use" data-u="church" aria-pressed="'+(LS.use==='church')+'">Church League<small>32 churches, 2 divisions each</small></button><button data-act="lg-use" data-u="classic" aria-pressed="'+(LS.use==='classic')+'">Classic League<small>Made-up schools</small></button></div>'+
      syncLine()+(hasPrev()?'<button class="btn ghost small" data-act="bk-prev">Restore this device\'s previous save</button>':'')+(LS.use==='church'?'<button class="btn ghost small" data-act="lb-open">Open league builder</button><p class="muted" style="font-size:12.5px">Move teams between conferences, set rivals, and pick each program\'s history.</p>':'')+'</section>';
    h+='<div class="field-input"><label for="coachName" class="eyebrow">Coach name</label><input id="coachName" maxlength="24" placeholder="Coach Dakotah" value="Coach Dakotah"></div>';
  }
  for(let c=0;c<4;c++){
    const confTeams=teams.filter(t=>t.conf===c),divd=DIVS&&confTeams.every(t=>t.div!=null);
    h+='<section class="card"><h2>'+esc(CONFS[c])+' Conference</h2>';
    for(const d of divd?[0,1]:[null]){
      if(d!=null)h+='<p class="eyebrow">'+esc(DIVS[c][d])+' Division</p>';
      h+='<div class="picks">';
      confTeams.filter(t=>d==null||t.div===d).sort((a,b)=>b.prestige-a.prestige).forEach(t=>{
        h+='<button class="pick" data-act="pick" data-id="'+t.id+'">'+badge(t)+'<div style="min-width:0"><b>'+esc(t.name)+'</b><small>'+esc(t.mascot)+(t.city?' · '+esc(t.city):'')+' · OFF '+t.off+' · DEF '+t.def+'</small>'+(t.hist?'<small class="hl">'+esc(TIERS[t.hist.tier]?TIERS[t.hist.tier].n:'')+(t.hist.natl?' · '+t.hist.natl+' natl title'+(t.hist.natl>1?'s':''):'')+'</small>':'')+'</div><span class="tier">'+tier(t.prestige)+'</span></button>';
      });
      h+='</div>';
    }
    h+='</section>';
  }
  return h;
}
function header(){
  const u=U(),r=rec(S.userId);
  return '<header class="top">'+badge(u)+'<div style="min-width:0"><h1>'+esc(u.name)+'</h1><p>'+esc(S.coach)+' · '+yearOf(S.season)+' season · <span class="num">'+r.w+'-'+r.l+' ('+r.cw+'-'+r.cl+' '+CONFS[u.conf]+')</span>'+(rankOf(S.userId)<=PN?' · #'+rankOf(S.userId):'')+'</p></div></header>';
}
function tabs(){
  const T=[['week','This Week'],['league','League'],['sched','Teams'],['stand','Standings'],['poll','Top '+PN],['bracket','Playoff'],['prog','Program']];
  return '<nav class="tabs" role="tablist">'+T.map(([k,n])=>'<button role="tab" aria-selected="'+(S.tab===k)+'" data-act="tab" data-t="'+k+'">'+n+'</button>').join('')+'</nav>';
}
function hubView(){
  let body='';
  if(S.tab==='league')body=leagueTab();else if(S.tab==='sched')body=schedTab();else if(S.tab==='stand')body=standTab();else if(S.tab==='poll')body=pollTab();else if(S.tab==='bracket')body=bracketView();else if(S.tab==='prog')body=progTab();else body=weekTab();
  const warn=CLOUD.state==='error'&&CLOUD.errAt&&Date.now()-CLOUD.errAt>15000?'<section class="card savewarn"><b>Your account save is not going through.</b><p style="font-size:13px;margin:4px 0 0">Progress is only on this device right now and it keeps retrying. Keep this tab open until this message goes away, and don\'t play on another device in the meantime.</p></section>':'';
  return header()+warn+tabs()+body;
}
function recapCard(){
  const r=S.lastRecap;if(!r)return '';
  const o=team(r.opp);
  const g=S.games.find(x=>x.done&&x.wk===r.wk&&(x.h===r.opp||x.a===r.opp)&&(x.h===S.userId||x.a===S.userId)),gi=g?S.games.indexOf(g):-1;
  return '<section class="card'+(g&&g.riv!=null?' rivcard':'')+'"><div class="recap"><span class="wl '+(r.win?'w':'l')+'">'+(r.win?'W':'L')+'</span><div style="min-width:0"><span class="eyebrow">'+esc(r.tag||weekLabel(r.wk))+' result'+(g&&g.riv!=null?' · '+esc(S.rivals[g.riv].trophy):'')+'</span><h3 class="num">'+U().abbr+' '+r.my+', '+o.abbr+' '+r.th+(r.ot?' (OT)':'')+'</h3><p class="muted" style="font-size:13px">'+(r.home?'vs ':'at ')+esc(o.name)+' · AD confidence '+(r.d>=0?'+':'')+r.d+'</p></div></div>'+(g?'<div class="row"><button class="btn ghost small" data-act="gview" data-g="'+gi+'">Full box score</button></div>'+feedBlock('r'+gi,gameFeedBig(g),S.userId,r.opp,g.riv!=null?'Rivalry reaction':'Fan reaction'):'')+'</section>';
}
function weekTab(){
  const g=userGame(S.week),p=poll();
  let h='';try{h+=cdCard()}catch(e){}h+=recapCard();try{h+=bigRivSpot()}catch(e){}try{h+=gdCard()}catch(e){}
  if(g){
    const u=U(),opp=team(g.h===S.userId?g.a:g.h),home=g.h===S.userId,ol=lastGameOf(opp.id),ql=S.qlen||300,dm=S.defMode||'me';
    const rv=g.riv!=null?S.rivals[g.riv]:null,mp=S.week>=3&&S.week<12?myProj():null;
    h+='<section class="card'+(rv?' rivcard':'')+'"><span class="eyebrow">'+weekLabel(S.week)+(rv?' · '+RTYPE[rv.type||'main']:'')+' · '+esc(g.tag||(g.conf?CONFS[u.conf]+' game':'Non-conference'))+'</span>'+
      (rv?'<button class="rivbtn" data-act="rview" data-r="'+g.riv+'"><div class="trophy"><span class="tro"><svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path fill="#f2b84b" d="M6 3h12v3h3v2a5 5 0 0 1-5 5h-.4A6 6 0 0 1 13 15.9V18h3v3H8v-3h3v-2.1A6 6 0 0 1 8.4 13H8a5 5 0 0 1-5-5V6h3V3zM5 8a3 3 0 0 0 1 2.2V8H5zm13 0v2.2A3 3 0 0 0 19 8h-1z"/></svg></span><div><b>'+esc(rv.trophy)+'</b><span class="muted">'+(rv.holder==null?'First meeting, up for grabs':rv.holder===u.id?'You hold it':esc(opp.name)+' holds it')+' · '+seriesTxt(rv,u.id)+' all-time · <span class="amber">History ›</span></span></div></div></button>':'')+
      '<div class="vs"><div class="t">'+badge(u)+'<b>'+(seedTag(g,u.id)?'('+seedTag(g,u.id)+') ':rk(u.id,p))+u.abbr+'</b><small class="num">'+recStr(u.id)+'</small></div><span class="at">'+(g.neutral||home?'VS':'AT')+'</span><div class="t">'+badge(opp)+'<b>'+(seedTag(g,opp.id)?'('+seedTag(g,opp.id)+') ':rk(opp.id,p))+opp.abbr+'</b><small class="num">'+recStr(opp.id)+'</small></div></div>'+
      '<p style="text-align:center;font-weight:600">'+esc(opp.name)+' '+esc(opp.mascot)+(g.neutral?' · Neutral site':home?' · Home':' · Road game')+'</p>'+
      ratingBars(u,opp)+
      '<div class="chips"><span class="chip amber">Line: '+spreadText(g)+'</span>'+(isSeniorDay(g)&&g.h===S.userId?'<span class="chip good">Senior Day</span>':'')+envChips(g)+'<span class="chip">'+esc(opp.abbr)+': '+esc(IDm(opp.id).n)+'</span>'+(upsetAlerts().some(a=>a.g===g)?'<span class="chip bad">'+(upsetAlerts().find(a=>a.g===g).fav===S.userId?'You are on upset alert':'Upset alert: you could pull it off')+'</span>':'')+(S.inj||[]).filter(j=>j.wk>0&&(j.team===u.id||j.team===opp.id)).map(j=>'<span class="chip bad">'+(j.team===u.id?'Your ':team(j.team).abbr+' ')+j.pos+' out'+(j.wk>=60?' for season':' '+j.wk+' wk')+'</span>').join('')+(mp?'<span class="chip">Projected: '+esc(mp)+'</span>':'')+'<span class="chip">Their coach: '+esc(opp.coach?opp.coach.name:'')+'</span><span class="chip">Their offense: '+STYLE[opp.style]+'</span>'+(ol?'<span class="chip">Last out: '+ol+'</span>':'')+'</div>'+
      '<div><p class="eyebrow" style="margin-bottom:8px">Practice focus</p><div class="seg">'+
      [['off','Offense','+3 OFF'],['def','Defense','+3 DEF'],['bal','Film study','+1 both']].map(([k,n,s])=>'<button data-act="focus" data-f="'+k+'" aria-pressed="'+(S.focus===k)+'">'+n+'<small>'+s+'</small></button>').join('')+'</div></div>'+
      '<div><p class="eyebrow" style="margin-bottom:8px">Quarter length</p><div class="seg">'+[[180,'3 min','Quick'],[300,'5 min','Standard'],[480,'8 min','Long']].map(([k,n,s])=>'<button data-act="qlen" data-q="'+k+'" aria-pressed="'+(ql===k)+'">'+n+'<small>'+s+'</small></button>').join('')+'</div></div>'+
      '<div><p class="eyebrow" style="margin-bottom:8px">On defense</p><div class="seg two">'+[['me','I call it','Every snap'],['coord','Coordinator','Their drives sim fast']].map(([k,n,s])=>'<button data-act="dmode" data-m="'+k+'" aria-pressed="'+(dm===k)+'">'+n+'<small>'+s+'</small></button>').join('')+'</div></div>'+
      '<div class="row"><button class="btn" data-act="play">Coach the game</button><button class="btn ghost" data-act="uwatch">Watch it</button><button class="btn ghost" data-act="sim">Sim it</button></div><p class="muted" style="font-size:12.5px">Watch it: your staff calls every play and you can take over whenever you want.</p></section>'+
      ('<section class="card'+(rv?' rivcard':'')+'">'+feedBlock('w'+S.games.indexOf(g),matchupFeed(g,16),S.userId,opp.id,rv?'Rivalry week buzz':'Pregame buzz')+'</section>');
  }else{
    let msg='',hd='No game for you';const inF=S.post&&S.post.seeds&&S.post.seeds.includes(S.userId),sdn=inF?S.post.seeds.indexOf(S.userId)+1:0;
    if(S.week===12)msg='You did not win your division, so no '+CONFS[U().conf]+' title game this year. Watch the other conferences settle it.';
    else if(S.week===13&&inF&&sdn<=4){hd='First-round bye';msg='You are the No. '+sdn+' seed. Rest up while seeds 5 to 12 play. Your quarterfinal is next week in the '+CFP_QF[[0,2,3,1][sdn-1]]+'.'}
    else if(S.week===13)msg=rec(S.userId).w>=6?'You missed the 12-team field. Bowl assignments are out.':'Five wins or fewer means no bowl this year. Sim the playoff.';
    else if(S.week>=13)msg='Your season is over, but the title still gets decided.';
    else msg='Bye week.';
    const games=S.games.filter(g=>g.wk===S.week&&!g.done&&g.tag);
    h+='<section class="card"><span class="eyebrow">'+weekLabel(S.week)+'</span><h2>'+hd+'</h2><p class="muted">'+msg+'</p>'+
      (games.length?'<div class="sched">'+games.map(g=>'<div class="g"><span class="wk">'+esc(g.tag.replace(' Championship','').replace('Playoff ',''))+'</span><span>'+rk(g.h,p)+team(g.h).abbr+' vs '+rk(g.a,p)+team(g.a).abbr+'</span><span class="muted num">'+spreadText(g)+'</span></div>').join('')+'</div>':'')+
      '<div class="row">'+(S.week>=12&&S.games.some(g=>g.wk===S.week&&!g.done)?'<button class="btn ghost" data-act="tab" data-t="bracket">'+(S.week===12?'Watch a title game':'Watch a playoff game')+'</button>':'')+'<button class="btn" data-act="advance">'+(S.week===16?'Sim title game':'Sim the week')+'</button></div></section>';
  }
  if(S.week>=12&&S.post)h+=bracketCard();
  h+=feedCard(5)+leagueTeaser()+adCard();
  return h;
}
function lastGameOf(id){
  const gs=S.games.filter(g=>g.done&&(g.h===id||g.a===id));if(!gs.length)return '';
  const g=gs[gs.length-1],my=g.h===id?g.hs:g.as,th=g.h===id?g.as:g.hs,o=team(g.h===id?g.a:g.h);
  return (my>th?'W ':'L ')+my+'-'+th+' vs '+o.abbr;
}
function ratingBars(u,o){
  const b=(v,c)=>'<div class="bar"><i style="width:'+clamp((v-45)/55*100,2,100).toFixed(0)+'%;background:'+c+'"></i></div>';
  const uo=rOff(u.id),ud=rDef(u.id),oo=rOff(o.id),od=rDef(o.id);
  const sr=sosRanks();
  return '<div class="chips"><span class="chip">'+u.abbr+' SOS: '+ordN(sr[u.id])+' of '+S.teams.length+'</span><span class="chip">'+o.abbr+' SOS: '+ordN(sr[o.id])+' of '+S.teams.length+'</span></div><div class="bars num"><span class="muted">'+u.abbr+' OFF</span>'+b(uo,u.color)+'<b>'+uo+'</b><span class="muted">'+o.abbr+' DEF</span>'+b(od,o.color)+'<b>'+od+'</b><span class="muted">'+u.abbr+' DEF</span>'+b(ud,u.color)+'<b>'+ud+'</b><span class="muted">'+o.abbr+' OFF</span>'+b(oo,o.color)+'<b>'+oo+'</b></div>';
}
function adCard(){
  const c=S.ad.conf,r=rec(S.userId),mood=c>=75?'The AD is thrilled.':c>=50?'The AD is comfortable.':c>=30?'Boosters are getting restless.':'You are on the hot seat.';
  return '<section class="card"><div class="spread"><h3>Athletic Director</h3><span class="num" style="font-weight:700">'+c+'/100</span></div><div class="meter"><i style="width:'+c+'%;background:'+(c<30?'var(--bad)':'var(--amber)')+'"></i></div><p class="muted" style="font-size:13px">'+mood+' Season goal: '+S.ad.goal+' wins (you have '+r.w+'). Drop below 15 at season end and you are out.</p></section>';
}
function leagueTeaser(){
  const k=latestNewsKey(),items=(S.news&&S.news[k])||[],al=upsetAlerts();
  if(!items.length&&!al.length)return '';
  return '<section class="card"><div class="spread"><h3>Around the league</h3><span class="muted" style="font-size:12px">'+(k==='pre'?'Preseason':weekLabel(+k)+' recap')+'</span></div>'+
    items.slice(0,2).map(n=>'<div class="nsm"><span class="tagc t-'+tagKey(n.tag)+'">'+esc(n.tag)+'</span><b>'+esc(n.title)+'</b></div>').join('')+
    (al.length?'<p class="muted" style="font-size:13px">'+al.length+' ranked team'+(al.length>1?'s':'')+' on upset alert this week.</p>':'')+
    '<button class="btn ghost small" data-act="tab" data-t="league">Open Around the League</button></section>';
}
function latestNewsKey(){
  if(S.lgWeek!=null&&S.news&&S.news[S.lgWeek])return S.lgWeek;
  const ks=Object.keys(S.news||{}).filter(k=>k!=='pre').map(Number).sort((a,b)=>b-a);
  return ks.length?String(ks[0]):'pre';
}
const tagKey=t=>({'Upset':'up','Top 10':'top','Thriller':'thr','Blowout':'blo','Poll':'poll','Unbeaten watch':'unb','Hot seat':'hot','Coaching':'hot','Injury':'inj','Streak':'str','Your team':'you','History':'up','Heisman':'poll','Rivalry':'thr','Press':'poll','Recruiting':'str','Playoff':'top'}[t]||'top');
function gameCard(g,p,upcoming){
  const hr=seedTag(g,g.h)||(upcoming?rankOf(g.h,p):g.hr),ar=seedTag(g,g.a)||(upcoming?rankOf(g.a,p):g.ar);
  const line=(id,r,pts,win)=>'<span class="gl'+(win?' win':'')+(id===S.userId?' me':'')+'" title="'+esc(team(id).name)+'">'+mlogo(team(id))+'<span class="gn">'+(r<=PN?'<small>'+r+'</small>':'')+esc(team(id).abbr)+'<span class="gfull"> '+esc(team(id).name)+'</span></span><span class="num">'+(pts==null?recStr(id):pts)+'</span></span>';
  let tagH='';
  if(!upcoming){const W=winnerOf(g),dogBy=W===g.h?-(g.pl||0):(g.pl||0),lr=W===g.h?g.ar:g.hr;if(dogBy>=6&&lr<=PN)tagH+='<span class="tagc t-up">Upset</span>';if(g.ot)tagH+='<span class="tagc t-thr">OT</span>';if(g.riv!=null)tagH+='<span class="tagc t-thr">Rivalry</span>'}
  else tagH='<span class="muted" style="font-size:11.5px">'+spreadText(g)+'</span>';
  return '<button class="gc" data-act="gview" data-g="'+S.games.indexOf(g)+'" aria-label="'+(upcoming?'Preview':'Box score')+': '+esc(team(g.a).name)+' at '+esc(team(g.h).name)+'">'+line(g.a,ar,upcoming?null:g.as,!upcoming&&g.as>g.hs)+line(g.h,hr,upcoming?null:g.hs,!upcoming&&g.hs>g.as)+(tagH?'<span class="gtags">'+tagH+'</span>':'')+'<span class="gt"><span class="muted">'+(g.tag?esc(g.tag.replace('CFP ','')):g.neutral?'Neutral':'at '+esc(team(g.h).abbr))+'</span><span class="gcta">'+(upcoming?(g.h!==S.userId&&g.a!==S.userId&&g.wk===S.week?'Preview · Watch':'Preview'):'Box score')+' ›</span></span></button>';
}
function expandCard(){
  if(!S.expandQ)return '';const by={};for(const x of EXP_TEAMS){(by[x[6]]=by[x[6]]||[]).push(x)}
  const tm=x=>({name:x[0],abbr:x[1],mascot:x[2],color:x[3],color2:x[4]});
  return '<section class="card expc"><span class="eyebrow">Coming in '+yearOf(S.expandQ.season)+'</span><h3>Expansion: 16 new programs</h3><p class="muted" style="font-size:13px">Every conference grows to 12 teams in two divisions of six. Halstead and Broken Arrow also trade places.</p>'+
    Object.keys(by).map(c=>'<p class="eyebrow" style="margin-top:8px">'+esc(CONFS[c])+'</p><div class="expg">'+by[c].map(x=>'<div class="expt">'+mlogo(tm(x))+'<span><b>'+esc(x[0])+'</b><small class="muted">'+esc(x[2])+' · '+esc(x[5])+(S.divs?' · '+esc(S.divs[c][x[7]]):'')+'</small></span></div>').join('')+'</div>').join('')+'</section>';
}
function leagueTab(){
  const p=poll();let h='';try{h+=expandCard()}catch(e){}try{h+=classicsCard()}catch(e){}
  const upcoming=S.games.filter(g=>g.wk===S.week&&!g.done);
  if(upcoming.length&&S.view==='hub'){
    const gw=gameOfWeek(),al=upsetAlerts();
    h+='<section class="card"><span class="eyebrow">'+weekLabel(S.week)+' preview</span><h2>The slate</h2>';
    if(gw){
      const g=gw.g,H=team(g.h),A=team(g.a),mine=g.h===S.userId||g.a===S.userId,bits=[];
      if(rec(g.h).l===0&&rec(g.a).l===0&&S.week>2)bits.push('Both teams are unbeaten.');
      if(g.conf&&S.week>=5)bits.push('Winner grabs control of the '+CONFS[H.conf]+' race.');
      const hz=heisman().slice(0,5).find(c=>c.t.id===g.h||c.t.id===g.a);if(hz)bits.push('Heisman hopeful '+hz.name+' ('+hz.t.abbr+') gets a national stage.');
      if(!g.neutral)bits.push('The pregame show is broadcasting live from campus at '+H.name+'.');
      h+='<div class="gotw"><span class="tagc t-top">'+(mine?'Your game is the game of the week':'Game of the week')+'</span><p class="gotw-t">'+(gw.ar<=PN?'No. '+gw.ar+' ':'')+esc(A.name)+' '+(g.neutral?'vs':'at')+' '+(gw.hr<=PN?'No. '+gw.hr+' ':'')+esc(H.name)+'</p><p class="muted" style="font-size:13.5px">'+recStr(g.a)+' vs '+recStr(g.h)+' · Line '+spreadText(g)+'. '+bits.join(' ')+'</p></div>';
    }
    if(al.length){
      h+='<h3 style="margin-top:4px">Upset alert</h3><div class="alerts">'+al.map(a=>{const F=team(a.fav),D=team(a.dog),mine=a.fav===S.userId||a.dog===S.userId,pct=Math.round(a.pr*100);
        return '<div class="alert'+(mine?' mine':'')+'"><div class="spread"><b>No. '+a.fr+' '+esc(F.name)+' <span class="muted" style="font-weight:500">'+(a.g.h===a.fav||a.g.neutral?'vs':'at')+'</span> '+esc(D.name)+'</b><span class="num al-p">'+pct+'%</span></div><div class="meter"><i style="width:'+(pct*2)+'%;background:'+(pct>=35?'var(--bad)':'var(--amber)')+'"></i></div><p class="muted" style="font-size:12.5px">'+(mine?(a.fav===S.userId?'That is you. ':'That could be you. '):'')+a.why.slice(0,2).join('. ')+'.</p></div>'}).join('')+'</div>';
    }else h+='<p class="muted">No ranked team looks vulnerable this week. Which usually means somebody is about to lose.</p>';
    h+='</section>';
  }
  h+=podHTML();
  const keys=Object.keys(S.news||{}).sort((a,b)=>a==='pre'?-1:b==='pre'?1:+a-+b),cur=latestNewsKey(),items=(S.news&&S.news[cur])||[];
  if(keys.length){
    h+='<div class="chips wk">'+keys.map(k=>'<button class="chip'+(k===cur?' amber':'')+'" data-act="lgw" data-w="'+k+'">'+(k==='pre'?'Preseason':+k<12?'Wk '+(+k+1):['Champ','Rd 1','QF','SF','Title'][+k-12]||'Post')+'</button>').join('')+'</div>';
    h+='<section class="card"><span class="eyebrow">'+(cur==='pre'?'Preseason storylines':weekLabel(+cur)+' storylines')+'</span>'+
      (items.length?items.map((n,i)=>'<article class="news'+(i===0?' lead':'')+'" style="--tc:'+team(n.team).color+'"><span class="tagc t-'+tagKey(n.tag)+'">'+esc(n.tag)+'</span><h3>'+esc(n.title)+'</h3><p>'+esc(n.body)+'</p></article>').join(''):'<p class="muted">A quiet week. Nobody did anything strange.</p>')+'</section>';
    if(cur!=='pre'){
      const gs=S.games.filter(g=>g.wk===+cur&&g.done).sort((a,b)=>Math.min(a.hr,a.ar)-Math.min(b.hr,b.ar));
      h+='<section class="card"><div class="spread"><h3>Scoreboard</h3><span class="muted" style="font-size:12px">'+gs.length+' games · ranks at kickoff</span></div><div class="gcs">'+gs.slice(0,S.lgAll?99:8).map(g=>gameCard(g,p,false)).join('')+'</div>'+(gs.length>8?'<button class="btn ghost small" data-act="lgall">'+(S.lgAll?'Show fewer':'Show all '+gs.length+' games')+'</button>':'')+'</section>';
    }
  }
  {const fin=S.games.filter(g=>g.wk===S.week&&g.done&&g.h!==S.userId&&g.a!==S.userId);if(fin.length&&S.view==='hub')h+='<section class="card"><div class="spread"><h3>Already final this week</h3><span class="muted" style="font-size:12px">'+fin.length+' game'+(fin.length===1?'':'s')+'</span></div><div class="gcs">'+fin.map(g=>gameCard(g,p,false)).join('')+'</div></section>'}
  if(upcoming.length&&S.view==='hub')h+='<section class="card"><div class="spread"><h3>This week\'s games</h3><span class="muted" style="font-size:12px">'+upcoming.length+' games</span></div><div class="gcs">'+upcoming.sort((a,b)=>Math.min(rankOf(a.h,p),rankOf(a.a,p))-Math.min(rankOf(b.h,p),rankOf(b.a,p))).slice(0,S.lgAll?99:8).map(g=>gameCard(g,p,true)).join('')+'</div>'+(upcoming.length>8?'<button class="btn ghost small" data-act="lgall">'+(S.lgAll?'Show fewer':'Show all '+upcoming.length+' games')+'</button>':'')+'</section>';
  const hz=heisman().slice(0,6);
  h+='<section class="card"><h3>Heisman watch</h3><ol class="rank">'+hz.map((c,i)=>'<li class="'+(c.mine?'me':'')+'"><span class="rn">'+(i+1)+'</span><span style="min-width:0"><b>'+esc(c.name)+'</b> <span class="muted">'+c.pos+', '+esc(c.t.name)+(c.out?' · injured':'')+'</span><br><span class="muted num" style="font-size:12.5px">'+c.yds.toLocaleString()+' yds · '+c.td+' TD · team '+recStr(c.t.id)+'</span></span></li>').join('')+'</ol></section>';
  const seat=S.teams.filter(t=>t.id!==S.userId&&t.coach.heat>=55).sort((a,b)=>b.coach.heat-a.coach.heat).slice(0,5);
  const heatLbl=x=>x>=85?'Scorching':x>=65?'Hot':x>=45?'Warm':'Cool';
  h+='<section class="card"><h3>Coaches on the hot seat</h3>'+(S.ad.conf<35?'<div class="seat me"><div class="spread"><b>'+esc(S.coach)+' <span class="muted" style="font-weight:500">'+esc(U().name)+'</span></b><span class="tagc t-hot">You</span></div><div class="meter"><i style="width:'+(100-S.ad.conf)+'%;background:var(--bad)"></i></div></div>':'')+
    seat.map(t=>'<div class="seat"><div class="spread"><b>'+esc(t.coach.name)+' <span class="muted" style="font-weight:500"><button class="lnk" data-act="vsched" data-id="'+t.id+'">'+esc(t.name)+'</button>'+' · '+recStr(t.id)+(t.coach.interim?' · interim':'')+' · '+rtTag(t)+'</span></b><span class="muted" style="font-size:12px">'+heatLbl(t.coach.heat)+'</span></div><div class="meter"><i style="width:'+t.coach.heat+'%;background:'+(t.coach.heat>=65?'var(--bad)':'var(--amber)')+'"></i></div></div>').join('')+(seat.length?'':'<p class="muted">No coach is in real trouble right now. Give it a few losses.</p>')+'</section>';
  {const top=S.teams.filter(t=>t.id!==S.userId&&t.coach).sort((a,b)=>coachRt(b)-coachRt(a)).slice(0,6);
    h+='<section class="card"><h3>Best coaches in the league</h3><div class="sched">'+top.map(t=>'<div class="g"><span class="wk">'+mlogo(t)+'</span><span style="min-width:0"><b>'+esc(t.coach.name)+'</b> <span class="muted">· <button class="lnk" data-act="vsched" data-id="'+t.id+'">'+esc(t.name)+'</button> · yr '+((t.coach.yrs||0)+1)+(t.coach.ring!=null?' · title winner':'')+'</span></span>'+rtTag(t)+'</div>').join('')+'</div><p class="muted" style="font-size:12px;margin-top:6px">Coach rating moves each year with results against preseason expectations. Higher rated coaches win more, recruit better and develop players faster.</p></section>'}
  const inj=(S.inj||[]).filter(j=>j.wk>0&&(j.team===S.userId||rankOf(j.team,p)<=PN||j.starOut)).sort((a,b)=>rankOf(a.team,p)-rankOf(b.team,p)).slice(0,8);
  h+='<section class="card"><h3>Injury report</h3>'+(inj.length?'<div class="sched">'+inj.map(j=>'<div class="g"><span class="wk">'+j.pos+'</span><span style="min-width:0">'+esc(j.team===S.userId?j.name:short(j.name))+' <span class="muted">· '+esc(team(j.team).name)+'</span></span><span class="muted num" style="font-size:12.5px">'+(j.wk>=60?'Season':j.wk+' wk')+'</span></div>').join('')+'</div>':'<p class="muted">Everyone who matters is healthy. For now.</p>')+'</section>';
  h+=champListHTML();
  if(S.week>=3){
    h+=bracketCard();
    if(S.week<13){const b=bowlProj(),u=S.userId,row=id=>'<span class="'+(id===u?'me':'')+'">'+mlogo(team(id))+''+esc(team(id).abbr)+' <span class="muted num">'+recStr(id)+'</span></span>';
      h+='<section class="card"><div class="spread"><h3>Bowl projections</h3><span class="muted" style="font-size:12px">Non-playoff bowls</span></div><div class="proj">'+b.bowls.map(x=>'<div class="pj'+(x.a===u||x.b===u?' mine':'')+'"><span class="eyebrow">'+esc(x.name)+'</span><div class="pm">'+row(x.a)+'<span class="muted">vs</span>'+row(x.b)+'</div></div>').join('')+'</div><p class="muted" style="font-size:13px">Your projection: '+esc(myProj()||'No bowl yet. Six wins gets you in.')+'</p></section>'}
  }
  return h;
}
function aroundLeague(p){
  const w=S.week-1;if(w<0)return '';
  const gs=S.games.filter(g=>g.wk===w&&g.done&&g.h!==S.userId&&g.a!==S.userId).sort((a,b)=>Math.min(rankOf(a.h,p),rankOf(a.a,p))-Math.min(rankOf(b.h,p),rankOf(b.a,p))).slice(0,6);
  if(!gs.length)return '';
  return '<section class="card"><h3>Around the league · '+weekLabel(w)+'</h3><div class="sched">'+gs.map(g=>{
    const hw=g.hs>g.as;
    return '<div class="g"><span class="wk">'+(g.tag?esc(g.tag.split(' ')[0]):'Final')+'</span><span style="min-width:0">'+(hw?'<b>':'')+rk(g.h,p)+team(g.h).abbr+' '+g.hs+(hw?'</b>':'')+', '+(!hw?'<b>':'')+rk(g.a,p)+team(g.a).abbr+' '+g.as+(!hw?'</b>':'')+(g.ot?' OT':'')+'</span><span></span></div>';
  }).join('')+'</div></section>';
}
function schedTab(){
  const p=poll(),u=S.schedTeam!=null&&team(S.schedTeam)?S.schedTeam:S.userId,T=team(u),r=rec(u),mine=u===S.userId;
  const gs=S.games.filter(g=>g.h===u||g.a===u).sort((a,b)=>a.wk-b.wk);
  const opts=[0,1,2,3].map(c=>'<optgroup label="'+esc(CONFS[c])+'">'+S.teams.filter(t=>t.conf===c).map(t=>'<option value="'+t.id+'"'+(t.id===u?' selected':'')+'>'+esc(t.name)+(t.id===S.userId?' (you)':'')+'</option>').join('')+'</optgroup>').join('');
  let h='<section class="card"><label class="lbl">Pick any team<select id="schedSel" data-sched="1">'+opts+'</select></label>'+(mine?'':'<button class="btn ghost small" data-act="vsched" data-id="'+S.userId+'">Back to my schedule</button>')+'</section>';
  const rvs=rivalsOf(u).map(x=>team(x.a===u?x.b:x.a).abbr);
  h+='<section class="card"><div class="top">'+badge(T)+'<span class="lgo altlg">'+logoSVG(T,'alt')+'</span>'+'<div style="min-width:0"><h2>'+esc(T.name)+'</h2><p class="muted" style="font-size:13px">'+esc(T.mascot)+' · '+r.w+'-'+r.l+' ('+r.cw+'-'+r.cl+' '+esc(CONFS[T.conf])+(DIVS&&T.div!=null?' '+esc(DIVS[T.conf][T.div]):'')+')'+(rankOf(u,p)<=PN?' · No. '+rankOf(u,p):'')+' · OFF '+T.off+' · DEF '+T.def+' · SOS '+ordN(sosRanks()[u])+' of '+S.teams.length+(mine?'':' · Coach '+esc(T.coach?T.coach.name:'')+' '+rtTag(T))+(rvs.length?' · Rivals: '+rvs.join(', '):'')+'</p></div></div>'+identBlock(u);
  h+='</section><section class="card"><div class="spread"><h3>'+(mine?'Your fans':esc(T.name)+' fans')+'</h3><button class="lnk" data-act="refeed">Refresh</button></div>'+moodHTML(u)+postsHTML(mine?[...(S.feed||[]).filter(p=>p.team===u&&(p.season===S.season||p.season==null)).slice(0,3),...teamFeed(u,6)].slice(0,8):teamFeed(u,7))+'</section>';
  h+=pastHTML(T);
  {const L=(S.logos||{})[T.abbr]||{},box=(m,lab,on)=>'<div class="lgup"><span class="lgo">'+logoSVG(T,m)+'</span><small class="muted">'+lab+(on?' · custom':'')+'</small><label class="btn ghost small">Upload<input type="file" accept="image/png,image/webp,image/jpeg,image/svg+xml" data-logo="'+(m==='alt'?'a':'p')+'" data-ab="'+esc(T.abbr)+'" hidden></label></div>';
    h+='<section class="card"><div class="spread"><h3>Team logo</h3>'+(L.p||L.a?'<button class="lnk" data-act="logoreset" data-ab="'+esc(T.abbr)+'">Reset to original</button>':'')+'</div><p class="muted" style="font-size:12.5px">Upload your own image for '+esc(T.name)+'. Transparent PNGs look best. Extra empty space gets trimmed automatically.</p><div class="lgups">'+box(undefined,'Primary',!!L.p)+box('alt','End zone',!!L.a)+'</div><p id="lgmsg" class="muted" style="font-size:12px"></p></section>'}
  h+='<section class="card"><h3>'+S.season+' schedule</h3><div class="sched">'+gs.map(g=>{
    const home=g.h===u,o=team(home?g.a:g.h);
    let res='<span class="muted num">'+(g.wk===S.week&&!g.done?'Next':'')+'</span>';
    if(g.done){const my=home?g.hs:g.as,th=home?g.as:g.hs;res='<button class="lnk res '+(my>th?'w':'l')+' num" data-act="gview" data-g="'+S.games.indexOf(g)+'">'+(my>th?'W':'L')+' '+my+'-'+th+(g.ot?' OT':'')+'</button>'}
    else if(!mine)res='<span class="muted num" style="font-size:12px">'+(g.wk>=S.week?spreadText(g):'')+'</span>';
    return '<div class="g'+(g.wk===S.week&&!g.done?' cur':'')+'"><span class="wk">'+(g.wk<12?'Wk '+(g.wk+1):'Post')+'</span><span style="min-width:0">'+mlogo(o)+''+(g.neutral?'vs ':home?'vs ':'at ')+(()=>{if(g.done){const r0=home?g.ar:g.hr;return r0!=null&&r0<=PN?'#'+r0+' ':''}return rk(o.id,p)})()+'<button class="lnk" data-act="vsched" data-id="'+o.id+'">'+esc(o.name)+'</button>'+(g.riv!=null?' <span class="tagc t-thr">Rivalry</span>':'')+(g.tag?'<br><small class="muted">'+esc(g.tag)+'</small>':g.conf?'':' <small class="muted">(non-conf)</small>')+'</span>'+res+'</div>';
  }).join('')+'</div></section>';
  return h;
}
function standTab(){
  const c=S.standConf??U().conf,p=poll();
  const srt=ids=>confOrder(ids,p);
  const all=S.teams.filter(t=>t.conf===c).map(t=>t.id);
  const groups=DIVS&&all.every(id=>team(id).div!=null)?[0,1].map(d=>({n:DIVS[c][d]+' Division',ids:srt(all.filter(id=>team(id).div===d))})):[{n:'',ids:srt(all)}];
  const row=id=>{const t=team(id),r=rec(id);return '<tr class="'+(id===S.userId?'me':'')+'"><td>'+mlogo(t)+''+rk(id,p)+'<button class="lnk" data-act="vsched" data-id="'+id+'">'+esc(t.name)+'</button>'+(t.cc?' ★':'')+'</td><td class="r">'+r.cw+'-'+r.cl+'</td><td class="r">'+r.w+'-'+r.l+'</td><td class="r">'+sosRanks()[id]+'</td><td class="r">'+r.pf+'</td><td class="r">'+r.pa+'</td></tr>'};
  return '<div class="chips">'+CONFS.map((n,i)=>'<button class="chip'+(i===c?' amber':'')+'" data-act="conf" data-c="'+i+'">'+esc(n)+'</button>').join('')+'</div>'+
    '<section class="card"><h3>'+esc(CONFS[c])+' standings</h3>'+(groups.length>1?(()=>{const cg=S.games.find(g=>g.ccg===c);if(cg)return '<div class="ccg"><span class="eyebrow">'+esc(CONFS[c])+' Championship · '+(cg.done?'Final':'Championship Week')+'</span><b>'+esc(team(cg.a).name)+(cg.done?' '+cg.as:'')+' vs '+esc(team(cg.h).name)+(cg.done?' '+cg.hs:'')+'</b></div>';const L2=divLeaders(c,p);return '<div class="ccg"><span class="eyebrow">Title game outlook · Championship Week</span><b>'+esc(team(L2[0]).name)+' vs '+esc(team(L2[1]).name)+'</b><span class="muted" style="font-size:12.5px">Current '+esc(DIVS[c][0])+' and '+esc(DIVS[c][1])+' division leaders. Division winners meet for the '+esc(CONFS[c])+' title.</span></div>'})():'')+'<div style="overflow-x:auto"><table class="tbl"><thead><tr><th>Team</th><th class="r">Conf</th><th class="r">All</th><th class="r">SOS</th><th class="r">PF</th><th class="r">PA</th></tr></thead>'+
    groups.map(g=>(g.n?'<tbody><tr class="dh"><td colspan="6">'+esc(g.n)+'</td></tr></tbody>':'')+'<tbody>'+g.ids.map(row).join('')+'</tbody>').join('')+'</table></div></section>';
}
function pollTab(){
  const p=poll().slice(0,PN);
  return '<section class="card"><h3>Top '+PN+' · '+(S.week===0&&!S.games.some(g=>g.done)?'Preseason':'After '+weekLabel(Math.max(0,S.week-1)))+'</h3><div style="overflow-x:auto"><table class="tbl"><thead><tr><th>#</th><th>Team</th><th class="r">Record</th><th class="r">Conf</th></tr></thead><tbody>'+
    p.map((id,i)=>{const t=team(id);return '<tr class="'+(id===S.userId?'me':'')+'"><td>'+(i+1)+'</td><td><span class="tcell">'+mlogo(t,'big')+'<button class="lnk" data-act="vsched" data-id="'+id+'">'+esc(t.name)+'</button></span></td><td class="r">'+recStr(id)+'</td><td class="r muted">'+CONFS[t.conf]+'</td></tr>'}).join('')+
    '</tbody></table></div></section>';
}
function starLine(s){
  const x=s.s;
  if(s.pos==='QB')return x.cmp+'/'+x.att+' · '+x.yds.toLocaleString()+' yds · '+x.td+' TD · '+x.int+' INT';
  if(s.pos==='RB')return x.car+' car · '+x.yds.toLocaleString()+' yds · '+x.td+' TD';
  return x.rec+' rec · '+x.yds.toLocaleString()+' yds · '+x.td+' TD';
}
/* ---------- recruiting trail and Signing Day ---------- */
const RPOS=['QB','QB','RB','WR','WR','OL','DL','DL','LB','CB','S','TE','EDGE','CB'];
const OFFP=new Set(['QB','RB','WR','OL','TE']);
function recBoard(){
  if(S.rec&&S.rec.season===S.season)return S.rec;
  const rr=srng(hashS(S.season+':recruits:'+S.teams.length)),pk=a=>a[Math.floor(rr()*a.length)],sts=[...new Set(S.teams.map(t=>stOf(t.id)).filter(Boolean))];
  const list=[];
  for(let i=0;i<16;i++){const stars=i<4?5:4,st=pk(sts),pos=pk(RPOS),home=S.teams.filter(t=>stOf(t.id)===st).map(t=>t.id);
    const it={};for(const t of S.teams)it[t.id]=Math.max(0,(t.prestige-60)*.9+(home.includes(t.id)?14:0)+rr()*18-(stars===5?6:0));
    const top=Object.keys(it).map(Number).sort((a,b)=>it[b]-it[a]).slice(0,4),I={};top.forEach(id=>I[id]=Math.round(it[id]));
    list.push({id:i,name:(FIRST[Math.floor(rr()*FIRST.length)])+' '+(LAST[Math.floor(rr()*LAST.length)]),pos,stars,st,ovr:stars===5?ri(84,90):ri(76,84),I,c:null,cw:null,flips:0,home})}
  S.rec={season:S.season,list,targets:[],log:[]};return S.rec;
}
function recLeader(r){return Object.keys(r.I).map(Number).sort((a,b)=>r.I[b]-r.I[a])[0]}
function recWeek(w){
  const B=recBoard(),u=S.userId,p=poll(),N=id=>team(id).name,rr=srng(hashS(S.season+':recw:'+w));
  const games=S.games.filter(g=>g.wk===w&&g.done);
  for(const r of B.list){
    for(const k of Object.keys(r.I)){const id=+k,g=games.find(x=>x.h===id||x.a===id);if(g){const won=winnerOf(g)===id,o=g.h===id?g.a:g.h;r.I[id]+=won?2.5:-2;if(won&&r.I[o]!=null)r.I[id]+=4;if(!won&&r.I[o]!=null)r.I[o]+=3}if(rankOf(id,p)<=10)r.I[id]+=1;r.I[id]=Math.max(0,r.I[id])}
    if(B.targets.includes(r.id)&&!(r.c!=null&&r.c===u)){r.I[u]=(r.I[u]||Math.max(5,(U().prestige-60)*.8))+5+(rankOf(u,p)<=PN?2:0)}
    const lead=recLeader(r),vals=Object.values(r.I).sort((a,b)=>b-a),margin=vals[0]-(vals[1]||0);
    if(r.c==null){if(w>=3&&margin>=8&&rr()<.22+(w>=9?.15:0)){r.c=lead;r.cw=w;B.log.unshift({w,t:'commit',r:r.id,to:lead});if(S.news){const k=String(w);S.news[k]=S.news[k]||[];S.news[k].push({tag:'Recruiting',score:r.stars===5?33:24,team:lead,title:'Commit: '+r.stars+'-star '+r.pos+' '+r.name+' picks '+N(lead),body:r.name+' ('+r.st+') chose '+N(lead)+' over '+Object.keys(r.I).filter(x=>+x!==lead).slice(0,2).map(x=>N(+x)).join(' and ')+'.'})}try{post(lead,pick(['BREAKING: '+r.stars+'-star '+r.pos+' '+r.name+' is a '+team(lead).mascot+'!','Welcome to the family, '+r.name.split(' ')[0]+'!','The staff is cooking on the trail. '+r.name+' is ours.']))}catch(e){}}}
    else if(lead!==r.c&&r.I[lead]-r.I[r.c]>=10&&rr()<.18){const from=r.c;r.c=lead;r.cw=w;r.flips++;B.log.unshift({w,t:'flip',r:r.id,to:lead,from});if(S.news){const k=String(w);S.news[k]=S.news[k]||[];S.news[k].push({tag:'Recruiting',score:36,team:lead,title:'FLIP: '+r.name+' flips from '+N(from)+' to '+N(lead),body:'The '+r.stars+'-star '+r.pos+' had been committed to '+N(from)+' since week '+((r.cw||w))+'. Not anymore.'})}try{post(lead,'FLIPPED. '+r.name+' is coming home with us.');post(from,pick(['We lost '+r.name.split(' ')[0]+'?? Who is running this staff?','He was never that good anyway. (He was.)','Losing a commit to '+team(lead).abbr+' is a new low.']))}catch(e){}}
  }
}
function signingDay(){
  const B=recBoard(),u=S.userId,out=[];
  for(const r of B.list){if(r.c==null)r.c=recLeader(r);out.push({id:r.id,name:r.name,pos:r.pos,stars:r.stars,ovr:r.ovr,to:r.c})}
  const pts={};for(const x of out)pts[x.to]=(pts[x.to]||0)+(x.stars===5?3:1.6);
  for(const id in pts){const t=team(+id),o=out.filter(x=>x.to===+id);const oB=Math.min(2,o.filter(x=>OFFP.has(x.pos)).reduce((s,x)=>s+(x.stars===5?.8:.4),0)),dB=Math.min(2,o.filter(x=>!OFFP.has(x.pos)).reduce((s,x)=>s+(x.stars===5?.8:.4),0));t._sd={o:oB,d:dB}}
  S.signed={season:S.season,list:out,mine:out.filter(x=>x.to===u)};return S.signed;
}
function recCard(){
  const B=recBoard(),u=S.userId,nT=B.targets.length;
  const row=r=>{const lead=recLeader(r),mine=B.targets.includes(r.id),top=Object.keys(r.I).map(Number).sort((a,b)=>r.I[b]-r.I[a]).slice(0,3),mx=Math.max(1,...Object.values(r.I));
    return '<div class="recr'+(r.c===u?' got':'')+'"><div class="spread"><div style="min-width:0"><b>'+'★'.repeat(r.stars)+' '+esc(r.pos)+' '+esc(r.name)+'</b><br><small class="muted">'+esc(r.st)+(r.c!=null?' · Committed to '+esc(team(r.c).abbr)+(r.flips?' (flipped)':''):' · Uncommitted')+'</small></div>'+(r.c===u?'<span class="chip good">Yours</span>':'<button class="btn ghost small" data-act="rtarget" data-r="'+r.id+'"'+(!mine&&nT>=3?' disabled':'')+'>'+(mine?'Pursuing':'Pursue')+'</button>')+'</div>'+
      '<div class="recbars">'+top.map(id=>'<div class="recb">'+mlogo(team(id))+'<i style="width:'+Math.round(100*r.I[id]/mx)+'%;background:'+team(id).color+'"></i></div>').join('')+(r.I[u]!=null&&!top.includes(u)?'<div class="recb">'+mlogo(team(u))+'<i style="width:'+Math.round(100*r.I[u]/mx)+'%;background:'+team(u).color+'"></i></div>':'')+'</div></div>'};
  return '<section class="card"><div class="spread"><h3>Recruiting trail</h3><span class="muted" style="font-size:12px">'+nT+'/3 targets</span></div><p class="muted" style="font-size:12.5px">Top prospects in this class. Winning, rankings and beating the other schools on a kid\'s list all move the needle. Pursue up to three and your staff works them every week. Everyone signs on Signing Day.</p>'+B.list.map(row).join('')+'</section>';
}
function signingCard(s){
  const SD=S.signed&&S.signed.season===s.season?S.signed:null;if(!SD)return '';
  const pts={};for(const x of SD.list)pts[x.to]=(pts[x.to]||0)+(x.stars===5?3:1.6);const order=Object.keys(pts).map(Number).sort((a,b)=>pts[b]-pts[a]),myR=order.indexOf(S.userId)+1;
  return '<section class="card"><span class="eyebrow">National Signing Day</span><h2>'+(SD.mine.length?'You signed '+SD.mine.length+' top prospect'+(SD.mine.length>1?'s':''):'No top-16 prospects this year')+'</h2>'+(myR?'<p class="muted">Class rank among top prospects: No. '+myR+'</p>':'')+
    '<div class="sched">'+SD.list.sort((a,b)=>b.stars-a.stars||b.ovr-a.ovr).map(x=>'<div class="g'+(x.to===S.userId?' cur':'')+'"><span class="wk">'+'★'.repeat(x.stars)+'</span><span style="min-width:0">'+esc(x.pos)+' '+esc(x.name)+'</span><span>'+mlogo(team(x.to))+esc(team(x.to).abbr)+'</span></div>').join('')+'</div></section>';
}
/* ---------- Senior Day, graduation and the transfer portal ---------- */
function isSeniorDay(g){if(!g||g.neutral||g.wk>=12)return false;const last=S.games.filter(x=>x.h===g.h&&!x.neutral&&x.wk<12).sort((a,b)=>b.wk-a.wk)[0];return last===g}
function seniorNames(id){if(id===S.userId)return (S.stars||[]).filter(s=>s.yr>=4).map(s=>s.pos+' '+s.name);const t=team(id);return t.star&&t.star.yr>=4?[t.star.pos+' '+t.star.name]:[]}
function portalOpen(){
  if(S.portal&&S.portal.season===S.season)return S.portal;
  const u=U(),rr=srng(hashS(S.season+':portal')),r=rec(S.userId);
  const cands=(S.stars||[]).filter(s=>s.yr<4);let out=null;
  const risk=.12+(r.l>=6?.18:0)+(S.ad.conf<35?.1:0)+(S.move!=null?.25:0);
  if(cands.length&&rr()<risk){const s=cands[Math.floor(rr()*cands.length)];out={name:s.name,pos:s.pos,ovr:s.ovr,state:'out'}}
  const pool=[];const pos=['QB','RB','WR'];for(let i=0;i<4;i++){const from=S.teams[Math.floor(rr()*S.teams.length)];if(from.id===S.userId)continue;const p=pos[Math.floor(rr()*3)];pool.push({id:i,name:fullName(),pos:p,ovr:clamp(Math.round(70+rr()*20+(u.prestige-70)*.2),68,94),from:from.id,yr:1+Math.floor(rr()*3)})}
  const news=[];for(let i=0;i<3;i++){const a=S.teams[Math.floor(rr()*S.teams.length)],b=S.teams[Math.floor(rr()*S.teams.length)];if(a===b||a.id===S.userId||b.id===S.userId)continue;news.push({name:fullName(),pos:pick(['QB','RB','WR','CB','DL','LB']),from:a.id,to:b.id})}
  S.portal={season:S.season,out,pool,pick:null,news,pitched:false};return S.portal;
}
function seniorCard(s){
  const sr=(S.stars||[]).filter(x=>x.yr>=4);
  return '<section class="card"><span class="eyebrow">Senior class</span><h3>'+(sr.length?'Saying goodbye':'No senior stars this year')+'</h3>'+(sr.length?sr.map(x=>'<div class="star"><div style="min-width:0"><b>'+x.pos+' #'+(x.num||'')+' '+esc(x.name)+'</b><br><span class="muted num" style="font-size:13px">'+starLine(x)+'</span></div></div>').join('')+'<p class="muted" style="font-size:12.5px">They graduate this offseason. New starters step in, and your signees get first crack at their spots.</p>':'<p class="muted" style="font-size:13px">Everyone in your star group comes back next year.</p>')+'</section>';
}
function portalCard(){
  const P=portalOpen();
  let h='<section class="card"><span class="eyebrow">Transfer portal</span><h3>The portal is open</h3>';
  if(P.out){h+='<div class="g" style="display:block;padding:8px 0"><b>'+esc(P.out.pos)+' '+esc(P.out.name)+' ('+P.out.ovr+' OVR) entered the portal.</b><br>'+(P.out.state==='out'?(P.pitched?'<span class="muted">He thanked you for the call, but his mind is made up.</span>':'<button class="btn ghost small" data-act="pstay">Make your pitch to stay</button>'):'<span class="chip good">He is staying.</span>')+'</div>'}
  h+='<p class="muted" style="font-size:12.5px">Available portal players. You can bring in one, and he takes over that spot next season.</p>'+P.pool.map(x=>'<div class="g" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 0"><span style="min-width:0"><b>'+x.pos+' '+esc(x.name)+'</b> <span class="muted">'+x.ovr+' OVR · from '+esc(team(x.from).abbr)+'</span></span><button class="btn '+(P.pick===x.id?'':'ghost ')+'small" data-act="pport" data-i="'+x.id+'">'+(P.pick===x.id?'Signed':'Bring him in')+'</button></div>').join('');
  if(P.news.length)h+='<h3 style="margin-top:10px">Around the league</h3>'+P.news.map(n=>'<p style="font-size:13px;margin:4px 0">'+esc(n.pos)+' '+esc(n.name)+' transfers from '+mlogo(team(n.from))+esc(team(n.from).abbr)+' to '+mlogo(team(n.to))+esc(team(n.to).abbr)+'</p>').join('');
  return h+'</section>';
}
function portalApply(){
  const P=S.portal;if(!P||P.season!==S.season)return;
  if(P.out&&P.out.state==='out'){const s=S.stars.find(x=>x.name===P.out.name);if(s){s.name=fullName();s.ovr=clamp(s.ovr-ri(4,9),60,95);s.yr=Math.max(1,s.yr-1);s.s=blankStat(s.pos)}}
  if(P.pick!=null){const x=P.pool.find(y=>y.id===P.pick);const s=x&&S.stars.find(y=>y.pos===x.pos);if(s){s.name=x.name;s.ovr=x.ovr;s.yr=x.yr;s.s=blankStat(s.pos);s.portal=true}}
}
/* ---------- program record book and Ring of Honor ---------- */
function bookSeason(){
  S.book=S.book||{seasons:[],hof:[]};const u=S.userId,tn=U().name;
  if(!S.book.seasons.some(x=>x.season===S.season&&x.team===tn))S.book.seasons.push({season:S.season,team:tn,stars:(S.stars||[]).map(s=>({name:s.name,pos:s.pos,num:s.num,s:{...(s.s||{})}}))});
  const add=(name,pos,num,why,retire)=>{if(!S.book.hof.some(x=>x.name===name&&x.team===tn))S.book.hof.push({name,pos,num,why,retire,team:tn,season:S.season})};
  const sm=S.summary||{};
  if(sm.heis&&sm.heis.mine){const s=S.stars.find(x=>x.name===sm.heis.name);add(sm.heis.name,sm.heis.pos,s?s.num:'',yearOf(S.season)+' Heisman Trophy',true)}
  for(const x of (sm.aw&&sm.aw.aa)||[])if(x.mine){const s=S.stars.find(y=>y.name===x.name);add(x.name,x.pos,s?s.num:'',yearOf(S.season)+' All-American',false)}
}
function recordBook(){
  const tn=U().name,B=(S.book&&S.book.seasons||[]).filter(x=>x.team===tn),hist=(S.history||[]).filter(x=>x.abbr===U().abbr);
  const best=(pos,key)=>{let b=null;for(const ss of B)for(const p of ss.stars)if(p.pos===pos&&(p.s[key]||0)>(b?b.v:0))b={v:p.s[key]||0,name:p.name,y:yearOf(ss.season)};return b};
  const car={};for(const ss of B)for(const p of ss.stars){const k=p.pos+'|'+p.name;car[k]=car[k]||{name:p.name,pos:p.pos,yds:0,td:0};car[k].yds+=p.s.yds||0;car[k].td+=p.s.td||0}
  const careers=Object.values(car).sort((a,b)=>b.yds-a.yds).slice(0,5);
  const bw=[...hist].sort((a,b)=>b.w-a.w||a.l-b.l)[0],cw=hist.reduce((s,x)=>s+x.w,0),cl=hist.reduce((s,x)=>s+x.l,0);
  const rows=[['Best season',bw?bw.w+'-'+bw.l+' ('+yearOf(bw.season)+')':'-'],['Coach '+S.coach+' here',cw+'-'+cl],...[['QB','yds','Passing yards, season'],['QB','td','Passing TD, season'],['RB','yds','Rushing yards, season'],['WR','yds','Receiving yards, season']].map(([p,k,l])=>{const b=best(p,k);return [l,b?b.v.toLocaleString()+' · '+b.name+' ('+b.y+')':'-']})];
  return {rows,careers};
}
function ringOfHonor(){
  const id=S.userId,tn=U().name,out=[];
  for(const x of teamHeis(id))out.push({name:x.name,pos:x.pos,why:x.y+' Heisman Trophy',retire:true,num:(S.book&&S.book.hof||[]).find(h=>h.name===x.name)?.num||''});
  for(const x of (S.loreHeis||[]))if(x.t===id&&!out.some(o=>o.name===x.name))out.push({name:x.name,pos:x.pos,why:x.y+' Heisman Trophy',retire:true,num:''});
  for(const x of (S.book&&S.book.hof||[]))if(x.team===tn&&!out.some(o=>o.name===x.name))out.push(x);
  return out;
}
function hofCard(){
  const RB=recordBook(),ring=ringOfHonor();
  return '<section class="card"><span class="eyebrow">Record book</span><h3>'+esc(U().name)+' program records</h3><div class="box2">'+RB.rows.map(r=>'<div class="rbk"><span>'+esc(r[0])+'</span><b>'+esc(r[1])+'</b></div>').join('')+'</div>'+
    (RB.careers.length?'<h3 style="margin-top:10px">Career leaders (your era)</h3><div class="sched">'+RB.careers.map((c,i)=>'<div class="g"><span class="wk">'+(i+1)+'</span><span style="min-width:0">'+esc(c.pos)+' '+esc(c.name)+'</span><span class="num">'+c.yds.toLocaleString()+' yds · '+c.td+' TD</span></div>').join('')+'</div>':'<p class="muted" style="font-size:12.5px">Records start counting from this season on.</p>')+'</section>'+
    '<section class="card"><span class="eyebrow">Ring of Honor</span><h3>Hall of Fame</h3>'+(ring.length?'<div class="ring">'+ring.map(x=>'<div class="ringc'+(x.retire?' ret':'')+'"><span class="rnum">'+(x.retire&&x.num?'#'+x.num:x.retire?'★':'AA')+'</span><b>'+esc(x.name)+'</b><small>'+esc((x.pos?x.pos+' · ':'')+x.why)+(x.retire?' · Jersey retired':'')+'</small></div>').join('')+'</div>':'<p class="muted" style="font-size:13px">Nobody in the Ring of Honor yet. Heisman winners get their jersey retired, and All-Americans are inducted.</p>')+'</section>';
}
/* ---------- coaching staff: coordinators ---------- */
const OCS={spread:{n:'Spread',d:'Space and tempo. Gets the ball to playmakers in space.',id:'air'},power:{n:'Power Run',d:'Downhill run game behind a physical line.',id:'ground'},pro:{n:'Pro-Style',d:'Balanced, under center, play-action shots.',id:'balanced'},west:{n:'West Coast',d:'Quick rhythm throws that move the chains.',id:'clock'},option:{n:'Option',d:'Reads, misdirection and a running quarterback.',id:'ground'}};
const DCS={attack:{n:'4-3 Attack',d:'Penetrating front, lives in the backfield.'},stack:{n:'3-3-5 Stack',d:'Speed everywhere, disguises and stunts.'},bend:{n:"Bend Don't Break",d:'Keeps everything in front, tough in the red zone.'},blitz:{n:'Blitz Happy',d:'Sends pressure from everywhere. Boom or bust.'},shell:{n:'Two-High Shell',d:'Takes away the deep ball, makes you earn it.'}};
function mkCoord(kind,base){const sty=Object.keys(kind==='oc'?OCS:DCS);return {name:fullName(),style:pick(sty),r:clamp(Math.round((base||70)+gauss()*5),58,90),yrs:0}}
function staff(){if(!S.staff){const p=U().prestige||72;S.staff={oc:{...mkCoord('oc',62+p*.12),yrs:ri(1,5)},dc:{...mkCoord('dc',62+p*.12),yrs:ri(1,5)}}}return S.staff}
function staffMod(id){if(!S||id!==S.userId||!S.staff)return {off:0,def:0};const st=S.staff,m=S.morale||0;return {off:(st.oc?(st.oc.r-70)/8:-1.5)+m*.6,def:(st.dc?(st.dc.r-70)/8:-1.5)+m*.3}}
function staffSeasonEnd(r){
  const st=staff(),out=[],strong=r.w>=9||U().cc||(S.champs&&S.champs.natl===S.userId);
  for(const k of ['oc','dc']){const c=st[k];if(!c)continue;
    const p=(strong?.38:.08)+(c.r>=80?.15:0)-(c.yrs<2?.1:0);
    if(R()<p){const open=(S.carousel||[]).find(x=>!x.fromStaff),t=open?team(open.t):null;
      if(t){t.coach.name=c.name;t.coach.rt=Math.round(clamp((c.r||70)+rnd(-3,5),50,92));t.coach.d=0;open.nw=c.name;open.fromStaff=true;const ik=k==='oc'?OCS[c.style].id:(c.style==='bend'||c.style==='shell'?'defense':'defense');t.ident={k:ik,since:yearOf(S.season+1),coach:c.name,fresh:S.season+1};open.ident=IDENT[ik].n}
      out.push({k,name:c.name,to:t?t.id:null});st[k]=null}}
  S.staffCands={season:S.season,oc:st.oc?null:[0,1,2].map(()=>mkCoord('oc',66+R()*14)),dc:st.dc?null:[0,1,2].map(()=>mkCoord('dc',66+R()*14))};
  S.staffNews={season:S.season,out};
}
function staffCard(inSummary){
  const st=staff(),C=S.staffCands&&S.staffCands.season===S.season?S.staffCands:null,N=S.staffNews&&S.staffNews.season===S.season?S.staffNews.out:[];
  const one=(k)=>{const c=st[k],L=k==='oc'?OCS:DCS,lab=k==='oc'?'Offensive coordinator':'Defensive coordinator';
    if(c)return '<div class="stf"><span class="eyebrow">'+lab+'</span><b>'+esc(c.name)+'</b><span class="muted" style="font-size:12.5px">'+esc(L[c.style].n)+' · '+c.r+' rating · '+c.yrs+' yr'+(c.yrs===1?'':'s')+' on staff</span><span class="muted" style="font-size:12px">'+esc(L[c.style].d)+' '+(k==='oc'?'Offense':'Defense')+' '+((c.r-70)/8>=0?'+':'')+((c.r-70)/8).toFixed(1)+'</span>'+(inSummary?'<button class="btn ghost small" data-act="sfire" data-k="'+k+'">Let him go</button>':'')+'</div>';
    const cs=C&&C[k]||[];return '<div class="stf open"><span class="eyebrow">'+lab+' · Opening</span>'+(cs.length?cs.map((x,i)=>'<div class="spread" style="gap:8px;padding:5px 0"><span style="min-width:0"><b>'+esc(x.name)+'</b><br><small class="muted">'+esc(L[x.style].n)+' · '+x.r+' rating</small></span><button class="btn ghost small" data-act="shire" data-k="'+k+'" data-i="'+i+'">Hire</button></div>').join(''):'<span class="muted">Hiring opens at season\'s end.</span>')+'</div>'};
  return '<section class="card"><span class="eyebrow">Coaching staff</span><h3>Your coordinators</h3>'+N.map(x=>'<p style="font-size:13px;margin:4px 0"><b>'+esc(x.name)+'</b> '+(x.to!=null?'was hired as head coach at '+esc(team(x.to).name)+'.':'left for a job elsewhere.')+'</p>').join('')+one('oc')+one('dc')+'</section>';
}
function progTab(){
  const u=U();
  let h='<section class="card"><h3>'+esc(u.name)+' '+esc(u.mascot)+'</h3><div class="chips"><span class="chip">OFF '+u.off+'</span><span class="chip">DEF '+u.def+'</span><span class="chip">Prestige '+u.prestige+' · '+tier(u.prestige)+'</span><span class="chip">SOS '+ordN(sosRanks()[u.id])+' of '+S.teams.length+'</span>'+(u.clsRank?'<span class="chip">Recruiting class No. '+u.clsRank+'</span>':'')+'<span class="chip">'+CONFS[u.conf]+'</span></div>';
  h+=S.stars.map(s=>'<div class="star"><div style="min-width:0"><b>'+s.pos+' #'+(s.num||'')+' '+esc(s.name)+'</b> <span class="muted">'+YR[s.yr]+' · '+s.ovr+' OVR</span><br><span class="muted num" style="font-size:13px">'+starLine(s)+'</span></div></div>').join('')+'</section>';
  if(u.hist)h+='<section class="card"><span class="eyebrow">Program history</span><p>'+esc(histLine(u))+'</p><div class="row"><button class="btn ghost small" data-act="phist" data-id="'+u.id+'">Full program history</button></div></section>';
  const rv=rivOf(S.userId);
  const all=rivalsOf(S.userId);
  if(all.length){h+='<section class="card rivcard"><span class="eyebrow">Rivalries</span>'+all.map(r=>{const o=r.a===S.userId?r.b:r.a;return '<button class="rivbtn" data-act="rview" data-r="'+S.rivals.indexOf(r)+'" aria-label="'+esc(r.trophy)+' history"><div class="trophy"><span class="tro"><svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path fill="#f2b84b" d="M6 3h12v3h3v2a5 5 0 0 1-5 5h-.4A6 6 0 0 1 13 15.9V18h3v3H8v-3h3v-2.1A6 6 0 0 1 8.4 13H8a5 5 0 0 1-5-5V6h3V3zM5 8a3 3 0 0 0 1 2.2V8H5zm13 0v2.2A3 3 0 0 0 19 8h-1z"/></svg></span><div><b>'+esc(r.trophy)+'</b><span class="muted">'+RTYPE[r.type||'main']+' vs '+esc(team(o).name)+' · '+seriesTxt(r,S.userId)+' · '+(r.holder==null?'Never played for it yet':r.holder===S.userId?'In your trophy case':'In their trophy case')+(r.last&&r.last.s?' · Last: '+esc(team(r.last.w).abbr)+' '+r.last.s:'')+' · <span class="amber">History ›</span></span></div></div></button>'}).join('')+'</section>'}

  try{if(S.week<12)h+=recCard()}catch(e){}
  try{h+=lockerCard()+staffCard(false)}catch(e){}
  try{h+=hofCard()}catch(e){}
  h+=adCard();
  h+='<section class="card"><h3>Career · '+esc(S.coach)+'</h3>'+(S.history.length?'<div class="sched">'+S.history.map(x=>'<div class="g"><span class="wk">'+yearOf(x.season)+'</span><span style="min-width:0">'+x.abbr+' · <b class="num">'+x.w+'-'+x.l+'</b>'+(x.rank<=PN?' · #'+x.rank:'')+'<br><small class="muted">'+esc(x.line)+'</small></span><span></span></div>').join('')+'</div>':'<p class="muted">Season one is underway. Results land here.</p>')+
    syncLine()+(CLOUD.db?'<div class="row"><button class="btn ghost small" data-act="snaps">Restore from account backups</button></div>':'')+devPrevBtn()+'<details class="bk"><summary>Backup code</summary><p class="muted" style="font-size:12.5px">Copy this code somewhere safe. Paste it back here on any device to restore your league and career.</p><textarea id="bkOut" readonly rows="3"></textarea><div class="row"><button class="btn ghost small" data-act="bk-copy">Copy backup code</button></div><textarea id="bkIn" rows="3" placeholder="Paste a backup code to restore"></textarea><div class="row"><button class="btn ghost small" data-act="bk-restore">Restore from code</button></div><p class="muted" id="bkMsg" style="font-size:12.5px"></p>'+(hasPrev()?'<button class="btn ghost small" data-act="bk-prev">Restore this device\'s previous save</button>':'')+'</details>'+(S.lname!=='Church League'?'<button class="btn small" data-act="lb-open">Build and play the Church League</button>':'<button class="btn ghost small" data-act="lb-open">League builder</button>')+'<button class="btn ghost small" data-act="reset">'+(confirmReset?'Tap again to erase this career':'Start a new career')+'</button></section>';
  return h;
}
/* ---------- weekly Top 15 countdown show ---------- */
function pollStamp(w){S.pollHist=S.pollHist&&S.pollHist.season===S.season?S.pollHist:{season:S.season,w:{}};S.pollHist.w[w]=poll().slice(0,PN)}
function cdData(){
  if(!(S.pollHist&&S.pollHist.season===S.season)&&S.week>0&&S.week<17){try{pollStamp(S.week-1)}catch(e){}}
  const H=S.pollHist&&S.pollHist.season===S.season?S.pollHist.w:null;if(!H)return null;
  const ks=Object.keys(H).map(Number).sort((a,b)=>a-b);if(!ks.length)return null;const wk=ks[ks.length-1],cur=H[wk];
  const prev=H[wk-1]||(wk===0?(S.preRank||[]).slice(0,PN):null);
  if(!prev)return {wk,rows:cur.map((id,i)=>({id,r:i+1,mv:0})),up:null,dn:null,out:[],newb:[]};
  const rows=cur.map((id,i)=>{const pi=prev.indexOf(id);return {id,r:i+1,mv:pi<0?null:pi-i}});
  const both=rows.filter(x=>x.mv!=null),up=both.slice().sort((a,b)=>b.mv-a.mv)[0],dn=both.slice().sort((a,b)=>a.mv-b.mv)[0];
  const out=prev.filter(id=>!cur.includes(id)).map(id=>({id,was:prev.indexOf(id)+1}));
  const newb=rows.filter(x=>x.mv==null);
  return {wk,rows,up:up&&up.mv>0?up:null,dn:dn&&dn.mv<0?dn:null,out,newb};
}
function cdCard(){
  const D=cdData();if(!D)return '';const key=S.season+'-'+D.wk,seen=S.cdSeen===key,n=D.rows.length,u=S.userId;
  if(S.cdOpen!==key){const ur=D.rows.find(x=>x.id===u),t1=team(D.rows[0].id);return '<section class="card cdt"><span class="eyebrow">The Countdown · after '+weekLabel(D.wk)+'</span><div class="spread" style="gap:10px"><div style="min-width:0"><h3>The new Top '+PN+' is out</h3><p class="muted" style="font-size:13px">'+(ur?'You come in at No. '+ur.r+'.':'You are not in it this week.')+' '+esc(t1.abbr)+' sits at No. 1.</p></div><button class="btn small" data-act="cdopen">'+(seen?'Show':'Watch')+' it</button></div></section>'}
  if(!seen)setTimeout(()=>{S.cdSeen=key},n*450+3500);
  const mv=x=>x.mv==null?'<span class="cdm new">NEW</span>':x.mv>0?'<span class="cdm up">▲'+x.mv+'</span>':x.mv<0?'<span class="cdm dn">▼'+(-x.mv)+'</span>':'<span class="cdm">–</span>';
  const rows=D.rows.map(x=>{const t=team(x.id),d=(n-x.r)*.42+(x.r===1?1.1:x.r<=4?.4:0);return '<div class="cdr'+(x.r===1?' one':'')+(x.id===u?' mine':'')+'" style="--d:'+d.toFixed(2)+'s"><b class="num">'+x.r+'</b>'+mlogo(t)+'<span class="cdn"><b>'+esc(t.name)+'</b><small class="num muted">'+recStr(x.id)+'</small></span>'+mv(x)+'</div>'}).join('');
  const tail=(n)*.42+1.6,call=[];
  if(D.up)call.push('<div><span class="eyebrow">Biggest riser</span><b>'+esc(team(D.up.id).name)+'</b> <span class="cdm up">▲'+D.up.mv+'</span></div>');
  if(D.dn)call.push('<div><span class="eyebrow">Biggest faller</span><b>'+esc(team(D.dn.id).name)+'</b> <span class="cdm dn">▼'+(-D.dn.mv)+'</span></div>');
  if(D.newb.length)call.push('<div><span class="eyebrow">New this week</span><b>'+D.newb.map(x=>esc(team(x.id).abbr)).join(', ')+'</b></div>');
  if(D.out.length)call.push('<div><span class="eyebrow">Dropped out</span><b>'+D.out.map(x=>esc(team(x.id).abbr)+' <small class="muted">(was '+x.was+')</small>').join(', ')+'</b></div>');
  return '<section class="card cd'+(seen?' seen':'')+'"><span class="eyebrow">The Countdown · after '+weekLabel(D.wk)+'</span><h3>This week\'s Top '+PN+'</h3><div class="cdl">'+rows+'</div><div class="cdc" style="--d:'+tail.toFixed(2)+'s">'+call.join('')+'</div><div class="row"><button class="btn ghost small" data-act="cdreplay">Replay</button><button class="btn ghost small" data-act="cdclose">Hide</button></div></section>';
}
function heisCeremony(s){
  const F=(s.hfin||[]).slice(0,4);if(!F.length||!s.heis)return '';
  const order=[...F].sort((a,b)=>(a.name===s.heis.name)-(b.name===s.heis.name)||a.name.localeCompare(b.name));
  return '<section class="card heis'+(S.heisSeen===s.season?' seen':'')+'"><span class="eyebrow">Live from New York</span><h2>The '+yearOf(s.season)+' Heisman Trophy presentation</h2><p class="muted" style="font-size:13px">Four finalists. One trophy.</p><div class="hfin">'+
    order.map((c,i)=>'<div class="hcard'+(c.name===s.heis.name?' win':'')+(c.mine?' mine':'')+'" style="--d:'+(0.4+i*.55)+'s"><div class="hlogo">'+logoSVG(team(c.tid))+'</div><b>'+esc(c.name)+'</b><span>'+esc(c.pos)+' · '+esc(c.team)+'</span><span class="num">'+c.yds.toLocaleString()+' yds · '+c.td+' TD · '+esc(c.rec)+'</span></div>').join('')+
    '</div><p class="hdrum">And the '+yearOf(s.season)+' Heisman Trophy goes to...</p><div class="hwin"><span class="eyebrow">Heisman Trophy winner</span><b>'+esc(s.heis.name)+'</b><span>'+esc(s.heis.pos)+', '+esc(s.heis.team)+'</span>'+(s.heis.mine?'<span class="tagc t-you">Your player</span>':'')+'</div>'+
    '<button class="btn ghost small" data-act="heisreplay">Replay the ceremony</button></section>';
}
function summaryView(){
  const s=S.summary,u=U(),nat=s.natl!=null?team(s.natl):null;
  let h='<div class="hero"><span class="eyebrow">'+yearOf(s.season)+' season final</span><h1>'+(s.title?'National <span>Champions</span>':s.fired?'You have been <span>let go</span>':esc(u.name)+' <span>'+s.w+'-'+s.l+'</span>')+'</h1></div>';
  h+=heisCeremony(s);try{h+=signingCard(s)}catch(e){}
  if(!s.fired){try{h+=staffCard(true)+seniorCard(s)+portalCard()}catch(e){}}S.heisSeen=S.heisSeen===s.season?s.season:(setTimeout(()=>{S.heisSeen=s.season},9000),S.heisSeen);
  h+='<section class="card"><div style="display:flex;gap:16px;align-items:center"><span class="big num">'+s.w+'-'+s.l+'</span><div class="muted" style="font-size:14px">'+s.cw+'-'+s.cl+' in the '+CONFS[u.conf]+'<br>Final ranking: '+(s.rank<=PN?'#'+s.rank:'Unranked')+'<br>Goal was '+s.goal+' wins</div></div><p>'+esc(s.parts.join('. '))+'.</p>'+(nat?'<p class="muted">National champion: '+esc(nat.name)+' '+esc(nat.mascot)+'.</p>':'')+(s.heis?'<p class="muted">Heisman Trophy: '+esc(s.heis.name)+', '+s.heis.pos+', '+esc(s.heis.team)+(s.heis.mine?'. That is your guy.':'.')+'</p>':'')+(s.car?'<p class="muted">Coaching carousel: '+s.car+' program'+(s.car>1?'s':'')+' made a change.</p>':'')+'</section>';
  h+='<section class="card"><h3>Athletic Director</h3><div class="meter"><i style="width:'+S.ad.conf+'%;background:'+(S.ad.conf<30?'var(--bad)':'var(--amber)')+'"></i></div><p class="muted">Confidence '+S.ad.conf+'/100 ('+(s.d>=0?'+':'')+s.d+' from your season-end review). '+(s.fired?'The board voted to make a change.':S.ad.conf>=70?'Extension talks are on the table.':'You are coming back next year.')+'</p></section>';
  h+='<section class="card"><h3>Star players</h3>'+S.stars.map(x=>'<div class="star"><div style="min-width:0"><b>'+x.pos+' '+esc(x.name)+'</b> <span class="muted">'+YR[x.yr]+'</span><br><span class="muted num" style="font-size:13px">'+starLine(x)+'</span></div></div>').join('')+'</section>';
  if(s.aw){const a=s.aw;
    h+='<section class="card"><span class="eyebrow">Awards night</span><h2>'+yearOf(s.season)+' honors</h2><div class="awards">'+
      (s.heis?'<div class="aw'+(s.heis.mine?' mine':'')+'"><span class="eyebrow">Heisman Trophy</span><b>'+esc(s.heis.name)+'</b><span class="muted">'+s.heis.pos+', '+esc(s.heis.team)+'</span></div>':'')+
      '<div class="aw'+(a.coy.mine?' mine':'')+'"><span class="eyebrow">Coach of the Year</span><b>'+esc(a.coy.coach)+'</b><span class="muted">'+esc(a.coy.team)+' · '+a.coy.rec+(a.coy.mine?' · AD +5':'')+'</span></div>'+
      '<div class="aw"><span class="eyebrow">Defensive Player</span><b>'+esc(a.dpoy.name)+'</b><span class="muted">'+a.dpoy.pos+', '+esc(a.dpoy.team)+'</span></div>'+
      '<div class="aw"><span class="eyebrow">Freshman of the Year</span><b>'+esc(a.foy.name)+'</b><span class="muted">'+a.foy.pos+', '+esc(a.foy.team)+'</span></div></div>'+
      '<h3>All-America first team</h3><div class="sched">'+a.aa.map(x=>'<div class="g'+(x.mine?' cur':'')+'"><span class="wk">'+x.pos+'</span><span style="min-width:0">'+esc(x.name)+(x.mine?' <span class="tagc t-you">Yours</span>':'')+'</span><span class="muted" style="font-size:12.5px">'+esc(x.team)+'</span></div>').join('')+'</div></section>';}
  if(!s.fired&&S.offers&&S.offers.length){
    h+='<section class="card"><span class="eyebrow">Your phone is ringing</span><h2>Job offers</h2><p class="muted" style="font-size:13.5px">Bigger programs noticed. Take a job and you start next season there with a fresh roster and a new athletic director. Or stay and build.</p>'+
      S.offers.map(id=>{const t=team(id),sel=S.move===id,vac=(S.carousel||[]).some(c=>c.t===id);return '<div class="offer'+(sel?' sel':'')+'">'+badge(t,'width:44px;height:44px;font-size:15px')+'<div style="min-width:0"><b>'+esc(t.name)+'</b><span class="muted">'+tier(t.prestige)+' · '+CONFS[t.conf]+' · OFF '+t.off+' · DEF '+t.def+'</span><span class="muted">'+(vac?'Opening after a coaching change':'Would replace '+esc(t.coach.name))+'</span></div><button class="btn '+(sel?'':'ghost ')+'small" data-act="take" data-id="'+id+'">'+(sel?'Accepted':'Take job')+'</button></div>'}).join('')+
      '<p class="muted" style="font-size:13px">'+(S.move!=null?'You are leaving '+esc(u.name)+' for '+esc(team(S.move).name)+'. Tap again to change your mind.':'Staying at '+esc(u.name)+' for now.')+'</p></section>';
  }
  if(s.fired)h+='<button class="btn" data-act="newjob">Find a new job</button>';
  else h+='<section class="card"><h3>Recruiting focus</h3><p class="muted" style="font-size:13px">Where should the staff spend the offseason? Seniors graduate and new starters step in.</p><div class="seg">'+[['off','Offense','+2 OFF'],['def','Defense','+2 DEF'],['bal','Balanced','+1 both']].map(([k,n,t])=>'<button data-act="recruit" data-r="'+k+'" aria-pressed="'+(S.recruit===k)+'">'+n+'<small>'+t+'</small></button>').join('')+'</div><button class="btn" data-act="next">Start the '+yearOf(S.season+1)+' season'+(S.move!=null?' at '+esc(team(S.move).abbr):'')+'</button></section>';
  return h;
}

/* ---- game day view ---- */
function momHTML(){
  const m=G.mom||0,u=teamOf('u'),o=team(G.opp),w=(Math.abs(m)/2).toFixed(1);
  const fill=m>=0?'left:50%;width:'+w+'%;background:'+u.color:'right:50%;width:'+w+'%;background:'+o.color;
  const lead=Math.abs(m)<20?'Momentum: even':(m>0?u.abbr:o.abbr)+' has the momentum';
  const crowd=G.neutral?'':(G.uHome&&m>40)?'The home crowd is rocking':(!G.uHome&&m<-40)?'The '+o.abbr+' crowd is deafening':(!G.uHome&&m>40)?'You have silenced the '+o.abbr+' crowd':'';
  return '<div class="mom"><div class="momtrack"><i style="'+fill+'"></i></div><small><span>'+lead+'</span><span>'+crowd+'</span></small></div>';
}
function scoreDisp(side,pts){const D=SC.disp;if(!D||D.gid!==(G&&G.gid)||D.season!==S.season){SC.disp={gid:G&&G.gid,season:S.season,u:G?G.su:0,c:G?G.sc:0,an:{}};return String(pts)}
  if(pts<D[side])D[side]=pts;const a=D.an&&D.an[side],el=a?(Date.now()-a.t0)/1000:9;
  if(a&&el<REEL_T){let h='';for(let v=a.from;v<=a.to;v++)h+='<i>'+v+'</i>';return '<span class="reel" style="--k:'+(a.to-a.from)+';animation-delay:-'+el.toFixed(2)+'s">'+h+'</span>'}
  return String(D[side])}
const REEL_T=1.5;
function scoreRoll(){const D=SC.disp;if(!G||!D||D.gid!==G.gid)return;D.an=D.an||{};
  for(const s of ['u','c']){const tg=s==='u'?G.su:G.sc;if(D[s]>=tg)continue;const d=tg-D[s];
    if(d>=2)D.an[s]={from:D[s],to:tg,t0:Date.now()};D[s]=tg;
    if(typeof document!=='undefined'&&document.querySelectorAll)document.querySelectorAll('[data-sk="'+s+'"]').forEach(el=>{el.innerHTML=scoreDisp(s,tg);if(d>=2){const b=el.closest&&el.closest('.sbt');if(b){b.classList.remove('sfl');void b.offsetWidth;b.classList.add('sfl')}}})}}
function topHTML(){
  const u=teamOf('u'),o=team(G.opp),p=poll(),g=S.games[G.gid];
  const live=!['over','coin','half'].includes(G.phase);
  const sbt=(t,pts,has,to,side,r)=>'<div class="sbt'+(r?' r':'')+(has?' has':'')+'" style="--tc:'+t.color+'"><span class="lg">'+logoSVG(t)+'</span><span class="nm"><span class="ab">'+(seedTag(g,t.id)?'<small>('+seedTag(g,t.id)+')</small>':rk(t.id,p)?'<small>'+String(rk(t.id,p)).trim()+'</small>':'')+t.abbr+'<span class="pos" title="Possession"></span></span><span class="rec">'+recStr(t.id)+'</span><span class="tos" aria-label="'+to+' timeouts left">'+[0,1,2].map(i=>'<i class="'+(i<to?'':'used')+'"></i>').join('')+'</span></span><span class="ptw"><span class="pts num" data-sk="'+side+'">'+scoreDisp(side,pts)+'</span></span></div>';
  const qtxt=G.phase==='over'?'FINAL'+(G.ot?' OT':''):G.ot?'OT'+(G.ot>1?G.ot:''):'Q'+G.q;
  return '<div class="spread"><span class="eyebrow">'+esc(g.tag||weekLabel(g.wk))+(g.riv!=null?' · '+esc(S.rivals[g.riv].trophy):'')+(bigRiv(g)?' <span class="hotpill">PLAYOFF RIVALRY</span>':'')+(gameEnv(g).theme?' <span class="hotpill th-'+gameEnv(g).theme+'">'+THEME[gameEnv(g).theme].n+'</span>':'')+(S.gd&&S.gd.season===S.season&&S.gd.gi===G.gid?' <span class="hotpill gdpill">GAMEDAY</span>':'')+'</span><span class="muted" style="font-size:12px">'+(G.watch?(G.neutral?'Neutral site · ':'At '+esc(team(g.h).name)+' · '):G.neutral?'Neutral site · ':G.uHome?'Home · ':'Road · at '+esc(o.name)+(o.city?', '+esc(o.city):'')+' · ')+'Line '+spreadText(g)+'</span></div>'+
    (()=>{const uL=!(G.uHome||G.neutral),U2=sbt(u,G.su,G.poss==='u'&&live,G.to.u,'u',!uL),O2=sbt(o,G.sc,G.poss==='c'&&live,G.to.c,'c',uL),dn=live&&['off','def','live'].includes(G.phase)?(G.pat2?'2-PT TRY':G.phase==='patk'?'PAT':ord(G.down)+' &amp; '+(G.togo>=100-G.ball?'Goal':G.togo)):'',mid='<div class="sbm"><span class="q">'+qtxt+'</span><span class="clk num">'+(G.ot||G.phase==='over'?'--':fmtClock(G.clock))+'</span>'+(dn?'<span class="dn">'+dn+'</span>':'')+'</div>';return '<div class="board">'+(uL?U2+mid+O2:O2+mid+U2)+'</div>'})()+momHTML();
}
function spotText(){const b=G.ball,pa=abbrOf(G.poss),da=abbrOf(other(G.poss));return b===50?'Midfield':b<50?pa+' '+b:da+' '+(100-b)}
function ovlHTML(){
  if(['over','coin','half'].includes(G.phase))return '';
  const toGoal=100-G.ball;
  if(G.pat2)return '<span class="dd">2-PT TRY<small>at the 3</small></span><span class="dd" style="font-size:15px">'+abbrOf(G.pat2.side)+' ball</span>';
  if(G.phase==='patk')return '<span class="dd">EXTRA POINT</span>';
  return '<span class="dd">'+ord(G.down)+' &amp; '+(G.togo>=toGoal?'Goal':G.togo)+'<small>'+spotText()+'</small></span><span class="dd" style="font-size:15px">'+(G.poss==='u'?(G.watch?abbrOf('u')+' ball':'Your ball'):abbrOf('c')+' ball')+'</span>';
}
function ovbHTML(){
  const A=SC.A;
  if(G.watch&&!A)return G.auto||G.phase==='over'?'':'<span class="hint">Paused</span>';
  if(A&&A.await)return '<span class="hint">Tap a receiver to throw. <b>Green</b> means open.</span>';
  if(A)return '<span class="hint">Tap the field to skip ahead</span>';
  if(G.phase==='off'&&G.sel)return '<span class="hint">Their look: <b>'+LOOK[G.dlook]+'</b></span>';
  if(G.meter)return '<span class="hint">Field goal unit is on. Time your kick.</span>';
  if(G.phase==='off')return '<span class="hint">Huddle up. Call a play.</span>';
  if(G.phase==='def'&&!G.dsel&&G.pend&&!PB[G.pend])return '<span class="hint">They line up in <b>victory formation</b></span>';
  if(G.phase==='def'&&!G.dsel&&G.pend){const f=FORMS[PB[G.pend].f],n=Object.keys(f.sl).filter(k=>['X','Z','S','S2'].includes(k)).length;return '<span class="hint">They come out in <b>'+f.n+'</b>, '+n+' receivers split out</span>'}
  if(G.phase==='over'&&G.storm)return '';
  return '';
}
function controls(){
  const o=team(G.opp),A=SC.A;
  if(A&&A.kind==='play'&&A.await){
    const P=A.P;
    return '<section class="card"><div class="spread"><h3>Pick your target</h3><span class="muted" id="prs" style="font-size:12px">Pocket is clean</span></div><div class="rcv">'+
      P.recv.map((rc,i)=>'<button class="rb cov" data-act="throw" data-i="'+i+'" data-rcv="'+i+'"><b>#'+G.ros.u[rc.slot].num+' '+({X:'WR',Z:'WR',S:'Slot',S2:'Slot',TE:'TE',RB:'RB',FB:'FB'}[rc.slot])+'</b><span>'+esc(nmS('u',rc.slot))+' · '+rc.rk+'</span></button>').join('')+
      '</div><div class="row"><button class="btn ghost small" data-act="scramble">Scramble</button><button class="btn ghost small" data-act="away">Throw it away</button></div></section>';
  }
  if(G.watch&&!(A&&A.await))return watchControls();
  if(A)return '<section class="card"><div class="spread"><h3>'+(A.kind==='kick'?(A.k.type==='fg'?'Field goal try':'Punt'):'Ball is live')+'</h3><button class="btn ghost small" data-act="skip">Skip</button></div></section>';
  if(G.meter){
    const m=G.meter;
    return '<section class="card"><div class="spread"><h3>'+m.dist+'-yard field goal</h3><span class="muted" style="font-size:12px">Tap when the needle is in the green</span></div>'+
      '<button class="mtrack" data-act="tap" aria-label="Kick"><span class="zone" style="left:'+(m.c-m.w/2)+'%;width:'+m.w+'%"></span><span class="sweet" style="left:'+m.c+'%"></span><span class="needle" style="left:'+(2+96*meterPos())+'%"></span></button>'+
      '<div class="row"><button class="btn" data-act="tap">Kick</button><button class="btn ghost small" data-act="cancelMeter">Back</button></div></section>';
  }
  if(G.phase==='kochoice'){const X=sitOf('u'),rec=onsideAI('u')==='obvious';return '<section class="card"><span class="eyebrow">Kickoff · Q'+G.q+' '+fmtClock(G.clock)+'</span><h2>'+(X.diff<0?'Down '+(-X.diff):'Tied')+'. How do you kick it?</h2><p class="muted">An onside kick works about 1 in 5 times when they see it coming, closer to half the time as a surprise. If it fails, they start near midfield.'+(rec?' <b class="amber">Your staff says go onside.</b>':'')+'</p><div class="row"><button class="btn'+(rec?' ghost':'')+'" data-act="in" data-a="deep">Kick it deep</button><button class="btn'+(rec?'':' ghost')+'" data-act="in" data-a="onside">Onside kick</button></div></section>'}
  if(G.phase==='coin'&&G.cheer>performance.now())return '<section class="card cheerc"><span class="eyebrow">Opening kickoff</span><h2>The crowd is on its feet</h2><p class="muted">Kickoff as soon as the cheer is done.</p></section>';
  if(G.phase==='coin'){
    if(G.coinWon)return '<section class="card"><h2>You won the toss</h2><p class="muted">Take the ball now, or defer and get it to open the second half.</p><div class="row"><button class="btn" data-act="in" data-a="receive">Receive</button><button class="btn ghost" data-act="in" data-a="defer">Defer</button></div></section>';
    return '<section class="card"><h2>'+o.abbr+' won the toss</h2><p class="muted">They defer. Your offense gets the opening kick.</p><button class="btn" data-act="in" data-a="receive">Take the field</button></section>';
  }
  if(G.phase==='over'){
    const win=G.su>G.sc,B=G.box,st=G.st,row=(n,a,b)=>'<span>'+n+'</span><b>'+a+'</b><b>'+b+'</b>';
    return '<section class="card"><span class="eyebrow">'+(win?(G.upset?'Upset victory':'Victory'):(G.upset?'Upset loss':'Defeat'))+'</span><h2>'+(G.storm==='u'?'The fans storm the field!':G.storm==='c'?'Their fans storm the field':G.title?'Champions!':win?'That one goes in the books':'Back to the film room')+'</h2>'+
      '<div class="box"><span class="h">Team stats</span><span class="h">'+U().abbr+'</span><span class="h">'+o.abbr+'</span>'+row('Total yards',B.u.yds,B.c.yds)+row('Passing',B.u.pass,B.c.pass)+row('Rushing',B.u.rush,B.c.rush)+row('First downs',B.u.fd,B.c.fd)+row('Turnovers',B.u.to,B.c.to)+'</div>'+
      '<div class="muted num" style="font-size:13px;display:flex;flex-direction:column;gap:3px"><span>'+nmS('u','QB')+': '+st.qb.cmp+'/'+st.qb.att+', '+st.qb.yds+' yds, '+st.qb.td+' TD, '+st.qb.int+' INT</span><span>'+nmS('u','RB')+': '+st.rb.car+' car, '+st.rb.yds+' yds, '+st.rb.td+' TD</span><span>'+nmS('u','X')+': '+st.wr.rec+' rec, '+st.wr.yds+' yds, '+st.wr.td+' TD</span></div>'+
      '<button class="btn" data-act="finish">Postgame</button></section>';
  }
  if(G.phase==='half'){
    const B=G.box,cs=G.calls.filter(c=>c.side==='c'),runs=cs.filter(c=>c.call==='run').length,pct=cs.length?Math.round(runs/cs.length*100):50;
    return '<section class="card"><span class="eyebrow">Halftime · locker room</span><h2>'+(G.su>G.sc?'Protect the lead':G.su<G.sc?'Time to answer':'Dead even')+'</h2>'+
      '<p class="muted" style="font-size:14px">You have '+B.u.yds+' yards ('+B.u.pass+' pass, '+B.u.rush+' rush) and '+B.u.to+' turnover'+(B.u.to===1?'':'s')+'. '+o.abbr+' has run on '+pct+'% of their plays.</p>'+
      '<p class="eyebrow">Pick one adjustment for the second half</p><div class="calls">'+Object.keys(HALF).map(k=>'<button class="call" data-act="in" data-a="'+k+'"><b>'+HALF[k][0]+'</b><span>'+HALF[k][1]+'</span></button>').join('')+'</div></section>';
  }
  if(G.phase==='pat'){
    const e=(rat('u').off-rat('c').def)/10,two=Math.round((.44+e*.03)*100);
    return '<section class="card"><h2>Try for one or two?</h2><div class="calls">'+(G.ot>=3?'':'<button class="call" data-act="in" data-a="xp"><b>Kick PAT</b><span>95% for one point</span></button>')+'<button class="call kick" data-act="in" data-a="two"><b>Go for two</b><span>'+two+'% conversion</span></button></div></section>';
  }
  if(G.phase==='ckick')return '<section class="card"><h3>'+o.abbr+' sends out the '+(G.ckick==='fg'?'field goal unit':'punt team')+'</h3></section>';
  const simRow='<div class="row"><button class="btn ghost small" data-act="drive">Sim drive</button><button class="btn ghost small" data-act="end">Sim to final</button></div>';
  const toggles='<div class="toggles"><button class="toggle" data-act="fast">Play speed: '+(S.fast?'Fast':'Normal')+'</button><button class="toggle" data-act="chalk">View: '+(S.chalk?"X's and O's":S.retro===false?'Classic players':'Retro players')+'</button></div>';
  if(G.phase==='off'){
    if(G.sel){
      const pl=PB[G.sel];
      return '<section class="card"><div class="spread"><div><span class="eyebrow">'+FORMS[pl.f].n+'</span><h2>'+pl.n+'</h2></div><button class="btn ghost small" data-act="audible">Audible</button></div><p class="muted" style="font-size:13px">'+esc(pl.d)+'</p><button class="btn huge" data-act="snap">Snap</button></section>';
    }
    const tab=S.pbTab||'pass',rows=G.recap?recapHTML():'';
    const list=tab==='run'?RUNS:tab==='pass'?PASSES.filter(k=>k!=='hail'||G.clock<60||100-G.ball>40):[];
    let cards=list.map(k=>{const p=PB[k];return '<button class="call'+(G.sug===k?' sug':'')+'" data-act="call" data-k="'+k+'"><span class="f">'+FORMS[p.f].n+(G.sug===k?' · OC pick':'')+'</span><b>'+p.n+'</b><span>'+esc(p.d)+'</span></button>'}).join('');
    if(tab==='spec'){
      const toGoal=100-G.ball,dist=toGoal+17,q4=(G.q===4||G.q===2)&&!G.ot;
      cards='<button class="call kick'+(G.sug==='punt'?' sug':'')+'" data-act="call" data-k="punt"><span class="f">Special teams'+(G.sug==='punt'?' · OC pick':'')+'</span><b>Punt</b><span>Flip the field, about 42 net yards.</span></button>'+
        (dist<=62?'<button class="call kick'+(G.sug==='fg'?' sug':'')+'" data-act="call" data-k="fg"><span class="f">Special teams'+(G.sug==='fg'?' · OC pick':'')+'</span><b>Field goal</b><span>'+dist+' yards · '+Math.round(fgProb(dist)*100)+'% make</span></button>':'')+
        (q4&&G.lastRun>0?'<button class="call" data-act="call" data-k="spike"><span class="f">Clock</span><b>Spike</b><span>Stop the clock. Costs a down.</span></button>':'')+
        '<button class="call" data-act="call" data-k="kneel"><span class="f">Clock</span><b>Victory formation</b><span>Take a knee and bleed the clock.</span></button>';
    }
    const canTO=!G.ot&&G.to.u>0&&G.lastRun>0&&G.clock>0;
    return rows+'<section class="card"><div class="spread"><h3>'+(G.pat2?'Two-point try: call the play':'Call the play')+'</h3>'+(G.sug?'<span class="muted" style="font-size:12px">OC likes: '+(PB[G.sug]?PB[G.sug].n:G.sug==='fg'?'Field goal':G.sug==='punt'?'Punt':G.sug)+'</span>':'')+'</div>'+
      '<div class="pbtabs">'+[['run','Run'],['pass','Pass'],['spec','Special']].map(([k,n])=>'<button data-act="pb" data-t="'+k+'" aria-pressed="'+(tab===k)+'">'+n+'</button>').join('')+'</div>'+
      '<div class="calls">'+cards+'</div>'+
      '<div><p class="eyebrow" style="margin-bottom:6px">Tempo</p><div class="seg">'+[['hurry','Hurry-up','Fast snap'],['normal','Normal','Standard'],['milk','Bleed clock','Run it down']].map(([k,n,s])=>'<button data-act="tempo" data-t="'+k+'" aria-pressed="'+(G.tempo===k)+'">'+n+'<small>'+s+'</small></button>').join('')+'</div></div>'+
      (canTO?'<button class="btn ghost small" data-act="timeout">Timeout · save '+fmtClock(G.lastRun)+'</button>':'')+simRow+toggles+'</section>';
  }
  if(G.phase==='def'){
    if(G.dsel)return '<section class="card"><span class="eyebrow">Defense set</span><h2>'+DC[G.dsel].n+'</h2><p class="muted">Ball is about to be snapped.</p></section>';
    const cs=G.calls.filter(c=>c.side==='c'),runs=cs.filter(c=>c.call==='run').length;
    return '<section class="card"><div class="spread"><h3>'+(G.pat2?'Stop the two-point try':'Call the defense')+'</h3><span class="muted" style="font-size:12px">'+o.abbr+' today: '+runs+' run, '+(cs.length-runs)+' pass</span></div>'+
      (G.down===4?'<p class="chip amber" style="align-self:flex-start">'+o.abbr+' is going for it on 4th</p>':'')+
      '<div class="calls">'+Object.keys(DC).map(k=>'<button class="call" data-act="dcall" data-k="'+k+'"><b>'+DC[k].n+'</b><span>'+DC[k].d+'</span></button>').join('')+'</div>'+simRow+toggles+'</section>';
  }
  return '';
}
function recapHTML(){
  const r=G.recap;if(!r)return '';
  return '<section class="card"><span class="eyebrow">Their drive · coordinator called it</span><p style="font-weight:600">'+r.abbr+': '+r.plays+' play'+(r.plays===1?'':'s')+', '+r.yds+' yards'+(r.pts?', '+r.pts+' points':'')+'.</p><p class="muted" style="font-size:13px">'+esc(r.res)+'</p></section>';
}
function lastHTML(){
  if(!G.last||G.phase==='coin')return '';
  const L2=G.last,chips=[];
  if(L2.dc&&DC[L2.dc]&&PB[L2.pk]){
    if(G.watch){const off=abbrOf(L2.side),def=abbrOf(other(L2.side)),g=L2.grade||0;chips.push('<span class="chip">'+esc(off)+': '+PB[L2.pk].n+' vs '+esc(def)+': '+DC[L2.dc].n+'</span>');chips.push('<span class="chip '+(g>=1?'good':g<=-1?'bad':'')+'">'+(g>=1?'Offense wins the matchup':g<=-1?'Defense wins the matchup':'Even matchup')+'</span>');return '<div class="last '+L2.cls+'"><p>'+esc(L2.txt)+'</p><div class="chips">'+chips.join('')+'</div></div>'}
    const g=L2.grade||0,mine=L2.side==='u';
    const good=mine?g>=1:g<=-1,bad=mine?g<=-1:g>=1;
    chips.push('<span class="chip">'+(mine?'You: '+PB[L2.pk].n+' vs '+DC[L2.dc].n:'You: '+DC[L2.dc].n+' vs '+PB[L2.pk].n)+'</span>');
    chips.push('<span class="chip '+(good?'good':bad?'bad':'')+'">'+(good?'Great call':bad?'Bad matchup':'Even matchup')+'</span>');
  }
  return '<div class="last '+L2.cls+'"><p>'+esc(L2.txt)+'</p>'+(chips.length?'<div class="chips">'+chips.join('')+'</div>':'')+'</div>';
}
function logHTML(){return '<section class="card"><h3>Play by play</h3><ul class="log">'+G.log.slice(0,10).map(l=>'<li class="'+l.k+'"><span class="tg">'+l.g+'</span><span>'+esc(l.t)+'</span></li>').join('')+'</ul></section>'}
function refreshCtrl(){
  if(typeof document.getElementById!=='function')return;
  const c=document.getElementById('g-ctrl'),b=document.getElementById('g-ovb');
  if(c)c.innerHTML=controls();if(b)b.innerHTML=ovbHTML();
}
function renderGame(){
  const app=$('#app');
  if(typeof document.getElementById!=='function')return;
  if(!document.getElementById('fieldc')){
    app.innerHTML='<div id="g-top" style="display:flex;flex-direction:column;gap:8px"></div><div id="g-tick"></div><div class="fieldwrap"><canvas id="fieldc" aria-label="Live field. Tap a receiver to throw."></canvas><div class="ovl" id="g-ovl"></div><div class="ovb" id="g-ovb"></div><div id="g-flash"></div><div id="g-intro"></div><button id="g-snd" class="sndb" data-act="sound" aria-label="Stadium sound">'+(audPref()?'&#128266; Sound on':'&#128264; Sound off')+'</button></div><div id="g-ctrl"></div><div id="g-last"></div><div id="g-log"></div>';
    initCanvas();SC.reset=true;
  }
  {const el=document.getElementById('g-intro');if(el){if(G.intro&&!el.firstChild)el.innerHTML=introHTML();else if(!G.intro&&el.firstChild)el.innerHTML=''}}
  document.getElementById('g-top').innerHTML=topHTML();try{tickRefresh()}catch(e){}
  document.getElementById('g-ovl').innerHTML=ovlHTML();
  document.getElementById('g-ovb').innerHTML=ovbHTML();
  document.getElementById('g-ctrl').innerHTML=controls();
  document.getElementById('g-last').innerHTML=lastHTML();
  document.getElementById('g-log').innerHTML=logHTML();
  if(G.phase==='over'&&(G.storm||G.title||G.trophy)&&!SC.stormFlash)G.flash=null;
  if(G&&!G.srShown&&S.games[G.gid]&&isSeniorDay(S.games[G.gid])){G.srShown=true;const g0=S.games[G.gid],nm=seniorNames(g0.h);log('Senior Day at '+team(g0.h).name+'. '+(nm.length?'Honoring '+nm.join(', ')+' and the rest of the senior class before kickoff.':'The senior class is honored before kickoff.')+' Not a dry eye in the place.','k');SC.hype=Math.max(SC.hype,.6)}
  if(G&&!G.envShown&&S.games[G.gid]){G.envShown=true;const EV=envG();if(EV.theme){if(!G.flash)G.flash={txt:THEME[EV.theme].n,side:homeSide()};log((EV.night?'Under the lights and a ':'A ')+THEME[EV.theme].w+' at '+team(S.games[G.gid].h).name+'. The place is shaking.','k')}if(EV.weather!=='clear'&&!EV.dome)log({rain:'Rain coming down. Ball security matters today.',snow:'Snow falling at kickoff. Footing will be a problem.',wind:'Wind swirling hard. Deep balls and long kicks are an adventure.'}[EV.weather],'k')}
  if(G&&!G.bigShown&&S.games[G.gid]&&bigRiv(S.games[G.gid])){G.bigShown=true;if(!G.flash)G.flash={txt:'BAD BLOOD IN THE BRACKET',side:homeSide()};log('The '+troN(S.rivals[S.games[G.gid].riv])+' rivalry in '+bigStage(S.games[G.gid])+'. This place is ROCKING.','k')}
  if(G.flash){
    const f=G.flash,col=teamOf(f.side).color;G.flash=null;try{audFlash(f.txt,f.side)}catch(e){}
    SC.hype=f.side===homeSide()?1:.12;
    document.getElementById('g-flash').innerHTML='<div class="flash" style="--fc:'+col+'"><b>'+esc(f.txt)+'</b></div>';
  }else if(G.phase==='over'&&G.trophy&&!SC.stormFlash){
    SC.stormFlash=true;const T=G.trophy;document.getElementById('g-flash').innerHTML='<div class="flash long tro" style="--fc:'+teamOf(T.w).color+'"><b>'+esc(('The '+T.name).toUpperCase())+'<br>'+(T.first?'HAS ITS FIRST HOME':T.stays?'STAYS HOME':'IS COMING HOME')+'</b></div>';
  }else if(G.phase==='over'&&G.storm&&!SC.stormFlash){
    SC.stormFlash=true;document.getElementById('g-flash').innerHTML='<div class="flash long" style="--fc:'+teamOf(G.storm).color+'"><b>FANS STORM<br>THE FIELD</b></div>';
  }else if(G.phase==='over'&&G.title&&!SC.stormFlash){
    SC.stormFlash=true;document.getElementById('g-flash').innerHTML='<div class="flash long" style="--fc:'+teamOf(G.sc>G.su?'c':'u').color+'"><b>CHAMPIONS</b></div>';
  }
  sceneSync();startLoop();
  if(G&&G.watch)watchSchedule();
}
function render(){
  const app=$('#app');
  if(S&&S.view==='game'&&G){renderGame();return}
  stopLoop();SC.cv=null;
  if(BV.open){app.innerHTML=builderView()+syncModal();return}
  if(!S||S.view==='setup')app.innerHTML=setupView();
  else if(S.view==='summary')app.innerHTML=summaryView();
  else if(S.view==='presser'&&S.presser)app.innerHTML=presserView();
  else if((S.view==='selection'||S.selPending)&&S.post&&S.post.seeds&&S.post.seeds.length===12){if(S.selPending){S.selPending=false;S.sel={i:0};S.view='selection';save()}app.innerHTML=selectionView()}
  else{S.view='hub';app.innerHTML=hubView()+(S.gview!=null?gameModal():'')+(S.clview!=null?classicModal():'')+histModal()+rivModal()+snapModal()}
  if(SYNCQ)app.insertAdjacentHTML('beforeend',syncModal());
}
function afterCommit(){
  if(G&&!G.watch&&G.phase==='def'&&(S.defMode||'me')==='coord')coordDrive();
  save();render();
}
function openFG(){
  const toGoal=100-G.ball,dist=toGoal+17;
  G.meter={dist,w:clamp(30-(dist-25)*.35,12,30),dur:clamp(1.6-(dist-20)*.01,1.05,1.6),c:rnd(30,70)};SC.mt0=performance.now();
}
let dTimer=null;
function act(a,d){
  if(a!=='reset')confirmReset=false;
  if(a.startsWith('lb-')||a==='lg-use'){if(!LS)loadLS()}
  const inGame=S&&S.view==='game'&&G;
  if(a==='introskip'){endIntro();return}
  if(a==='logoreset'){const ab=d&&d.ab;if(ab&&S.logos&&S.logos[ab])delete S.logos[ab];save();render();return}
  if(a==='tkmore'){S.tkAll=!S.tkAll;const el=document.getElementById('g-tick');if(el)el._h=null;tickRefresh();return}
  if(a==='cdreplay'){S.cdSeen=null;render();return}
  if(a==='cdopen'){const D=cdData();if(D)S.cdOpen=S.season+'-'+D.wk;render();return}
  if(a==='cdclose'){S.cdOpen=null;render();return}
  if(a==='shire'){const st=staff(),C=S.staffCands;if(C&&C[d.k]&&C[d.k][+d.i]){st[d.k]={...C[d.k][+d.i],yrs:0};C[d.k]=null}save();render();return}
  if(a==='sfire'){const st=staff();if(st[d.k]){st[d.k]=null;S.staffCands=S.staffCands&&S.staffCands.season===S.season?S.staffCands:{season:S.season};S.staffCands[d.k]=[0,1,2].map(()=>mkCoord(d.k,66+R()*14))}save();render();return}
  if(a==='pstay'){const P=portalOpen();if(P.out&&!P.pitched){P.pitched=true;if(R()<.55)P.out.state='stay'}save();render();return}
  if(a==='pport'){const P=portalOpen(),i=+d.i;P.pick=P.pick===i?null:i;save();render();return}
  if(a==='rtarget'){const B=recBoard(),id=+d.r,i=B.targets.indexOf(id);if(i>=0)B.targets.splice(i,1);else if(B.targets.length<3)B.targets.push(id);save();render();return}
  if(a==='heisreplay'){S.heisSeen=null;const el=document.querySelector('.heis');if(el){const n=el.cloneNode(true);n.classList.remove('seen');el.replaceWith(n)}return}
  if(a==='sound'){audSet(!AUD.on);const b=document.getElementById('g-snd');if(b)b.innerHTML=AUD.on?'&#128266; Sound on':'&#128264; Sound off';if(AUD.on)setTimeout(()=>{try{if(S&&S.view==='game'&&G)audSong(teamOf(homeSide()).id,2,.9)}catch(e){}},150);return}
  if(inGame&&SC.A&&G.watch&&['wdrive','wq','wend','takeover','wfinish','wexit'].includes(a)){let i=0;while(SC.A&&i++<8){const A0=SC.A;skipAnimForce(A0)}}
  if(inGame&&SC.A&&!['throw','scramble','away','skip','fast','chalk','wauto','sound'].includes(a))return;
  switch(a){
    case 'pick':{
      const id=+d.id;
      if(!S){const nmv=(($('#coachName')||{}).value||'').trim()||'Coach';const mt=leagueMeta();S={baseYear:2025,coach:nmv,teams:L,season:1,history:[],ad:{conf:60},recruit:'bal',qlen:300,defMode:'me',confs:mt.confs,divs:mt.divs,rivalDefs:mt.rivalDefs,lname:mt.lname,_cid:'c'+Date.now().toString(36)+Math.floor(Math.random()*1e6).toString(36)};CONFS=mt.confs;DIVS=mt.divs}
      else S.ad={conf:55};
      S.userId=id;S.stars=genStars(team(id).prestige);if(S.lname==='Church League'&&LS.loreV1&&!S.loreV1){S.lore=LORE.map(([y,i,note])=>({y,t:i,note}));S.loreHeis=LORE_HEIS.map(([y,name,pos,i])=>({y,name,pos,t:i}));S.loreV1=true;const sw=team(8);if(sw&&sw.coach&&id!==8)sw.coach.name='Andrew Albert'}startSeason();window.scrollTo(0,0);break}
    case 'tab':S.tab=d.t;window.scrollTo(0,0);break;
    case 'lgw':S.lgWeek=d.w;break;
    case 'lgall':S.lgAll=!S.lgAll;break;
    case 'podsel':S.podSel=+d.i;break;
    case 'sync-local':syncChoose('local');break;
    case 'snaps':{CLOUD.snapOpen=true;loadSnaps();break}
    case 'selnext':S.sel.i++;window.scrollTo(0,0);break;
    case 'selprev':S.sel.i=Math.max(0,S.sel.i-1);window.scrollTo(0,0);break;
    case 'selend':S.sel.i=selSteps().length-1;window.scrollTo(0,0);break;
    case 'selclose':S.view='hub';S.tab='league';window.scrollTo(0,0);break;
    case 'selwatch':S.sel={i:0};S.view='selection';window.scrollTo(0,0);break;
    case 'snapclose':CLOUD.snapOpen=false;break;
    case 'snapuse':{const x=(CLOUD.snaps||[])[+d.i];if(x&&x.c){const keep=S;try{localStorage.setItem('saturday_sideline_v1_backup',JSON.stringify(keep))}catch(e){}S=x.c;G=S.game||null;CLOUD.snapOpen=false;CLOUD.force=true;applyCareerGlobals();save();window.scrollTo(0,0)}break}
    case 'sync-cloud':syncChoose('cloud');break;
    case 'bk-prev':{CLOUD.force=true;if(restorePrev()){BV.open=false;window.scrollTo(0,0)}break}
    case 'bk-copy':{const code=backupCode(),ta=document.getElementById('bkOut'),msg=document.getElementById('bkMsg');if(ta)ta.value=code;const done=()=>{if(msg)msg.textContent='Copied. Keep it somewhere safe.'};try{navigator.clipboard.writeText(code).then(done,()=>{if(ta){ta.focus();ta.select()}if(msg)msg.textContent='Selected. Copy it with your device\'s copy command.'})}catch(e){if(ta){ta.focus();ta.select()}}return}
    case 'bk-restore':{const ta=document.getElementById('bkIn'),msg=document.getElementById('bkMsg');try{restoreCode(ta&&ta.value);CLOUD.force=true;BV.open=false;save();render();window.scrollTo(0,0)}catch(e){if(msg)msg.textContent='That code did not work. Make sure you pasted the whole thing.'}return}
    case 'gview':S.gview=+d.g;break;
    case 'clview':S.clview=+d.i;S.gview=null;break;
    case 'clclose':S.clview=null;break;
    case 'clsall':S.clsAll=!S.clsAll;break;
    case 'clsadd':{const el=document.getElementById('clsT');inductGame(+d.g,el?el.value:'');break}
    case 'clsdel':S.classics=(S.classics||[]).filter(c=>c.id!==d.id);S.clview=null;break;
    case 'phist':S.phist=+d.id;S.phTab='over';S.gview=null;break;
    case 'phtab':S.phTab=d.t;render();{const m=document.querySelector('.mbody');if(m)m.scrollTop=0}return;
    case 'phclose':S.phist=null;break;
    case 'rview':S.rview=+d.r;S.rvTab='meet';S.gview=null;S.phist=null;break;
    case 'rvtab':S.rvTab=d.t;break;
    case 'rvclose':S.rview=null;break;
    case 'ff':{const st=FEEDUI[d.k]||(FEEDUI[d.k]={f:'all',n:8});st.f=d.f;st.n=8;render();return}
    case 'fmore':{const st=FEEDUI[d.k]||(FEEDUI[d.k]={f:'all',n:8});st.n+=8;render();return}
    case 'flike':{const t=d.t;LIKED.has(t)?LIKED.delete(t):LIKED.add(t);render();return}
    case 'gclose':S.gview=null;break;
    case 'histall':S.histAll=!S.histAll;break;
    case 'refeed':S.feedSeed=(S.feedSeed||0)+1;break;
    case 'vsched':S.gview=null;S.schedTeam=+d.id;S.tab='sched';window.scrollTo(0,0);break;
    case 'lg-use':LS.use=d.u;saveLS();L=newLeague();break;
    case 'lb-open':BV.open=true;BV.modal=null;window.scrollTo(0,0);break;
    case 'lb-done':
      if(tplValid().length)return;
      if(S&&S.lname!=='Church League'&&!d.keep){BV.modal={type:'start'};break}
      BV.open=false;BV.modal=null;if(!S){LS.use='church';saveLS();L=newLeague()}else{CONFS=S.confs||CONFS;DIVS=S.divs||null;syncCareerFromTpl();syncRivals()}window.scrollTo(0,0);break;
    case 'lb-startch':{
      if(!d.sure){BV.modal={type:'start',confirm:true};break}
      const keepName=S&&S.coach;try{localStorage.removeItem('saturday_sideline_v1')}catch(e){}
      S=null;G=null;LS.use='church';saveLS();L=newLeague();BV.open=false;BV.modal=null;SC.reset=true;
      window.scrollTo(0,0);render();const ci=document.getElementById('coachName');if(ci&&keepName)ci.value=keepName;return}
    case 'lb-close':BV.modal=null;break;
    case 'lb-modal':BV.modal={type:d.m};break;
    case 'lb-team':BV.modal={type:'team',i:+d.i};break;
    case 'lb-tier':setTier(+d.i,d.k);break;
    case 'lb-color':LS.tpl.teams[+d.i].color=d.c;saveLS();break;
    case 'lb-color2':LS.tpl.teams[+d.i].color2=d.c;saveLS();break;
    case 'lb-geo':resetGeo();break;
    case 'lb-addriv':{const a=d.i!=null?+d.i:+(document.getElementById('xa')||{}).value,b=+(document.getElementById('xb')||{}).value,t=(document.getElementById('xt')||{}).value||'annual';if(!isNaN(a)&&!isNaN(b))addExtra(a,b,t);break}
    case 'lb-delriv':LS.tpl.rivals.splice(+d.k,1);saveLS();break;
    case 'press':answerPresser(+d.i);window.scrollTo(0,0);break;
    case 'take':S.move=S.move===+d.id?null:+d.id;break;
    case 'conf':S.standConf=+d.c;break;
    case 'focus':S.focus=d.f;break;
    case 'qlen':S.qlen=+d.q;break;
    case 'dmode':S.defMode=d.m;break;
    case 'play':tagRivals();stampGame(userGame(S.week));SC.stormDone=false;SC.stormFlash=false;SC.fans=[];SC.conf=[];startGame(userGame(S.week));window.scrollTo(0,0);break;
    case 'sim':{const g=userGame(S.week);stampGame(g);simGame(g);const my=g.h===S.userId?g.hs:g.as;const sst=simStars(my);g.ust={qb:sst.qb,rb:sst.rb,to:sst.qb.int+(R()<.3?1:0)};addStars(sst);afterUserGame(g);advance();toPresser(g);window.scrollTo(0,0);break}
    case 'advance':advance();break;
    case 'in':if(G.phase==='coin'){if(G.cheer>performance.now())return;if(openCheer(()=>{doInput(d.a);afterCommit()}))return}doInput(d.a);afterCommit();return;
    case 'pb':S.pbTab=d.t;break;
    case 'call':{
      const k=d.k;
      if(G.pat2&&(k==='punt'||k==='fg'||k==='kneel'||k==='spike'))return;
      if(k==='punt'){startKick('u',kickRoll('u','punt'));save();render();return}
      if(k==='fg'){openFG();break}
      if(k==='kneel'||k==='spike'){commitPlay('u',k,null,{kind:k});afterCommit();return}
      G.sel=k;SC.P=null;break}
    case 'audible':G.sel=null;SC.P=null;break;
    case 'snap':{const P=getPreview();if(!P)break;startPlay(P,true);refreshCtrl();return}
    case 'dcall':{
      if(G.dsel)return;
      if(!PB[G.pend]){commitPlay('c',G.pend,null,{kind:G.pend});afterCommit();return}
      G.dsel=d.k;render();
      clearTimeout(dTimer);dTimer=setTimeout(()=>{if(!G||G.phase!=='def'||SC.A)return;const P=buildPlay('c',G.pend,G.dsel);startPlay(P,false);refreshCtrl()},650);return}
    case 'throw':if(SC.A&&SC.A.await)throwTo(SC.A,+d.i);return;
    case 'scramble':if(SC.A&&SC.A.await)doScramble(SC.A);return;
    case 'away':if(SC.A&&SC.A.await)throwAway(SC.A);return;
    case 'skip':skipAnim();return;
    case 'tap':{
      if(!G.meter)return;
      const pos=.02+.96*meterPos();
      const m=G.meter,hw=m.w/200,dd=Math.abs(pos-m.c/100),q=dd<=hw?1-.2*(dd/hw):Math.max(0,.8*(1-(dd-hw)/.4));
      G.meter=null;startKick('u',kickRoll('u','fg',q));save();render();return}
    case 'cancelMeter':G.meter=null;break;
    case 'timeout':userTimeout();break;
    case 'fast':S.fast=!S.fast;if(SC.A)SC.A.spd=S.fast?1.7:1;break;
    case 'chalk':{const m=S.chalk?2:S.retro===false?1:0;const nx=(m+1)%3;S.retro=nx!==1;S.chalk=nx===2;break}
    case 'tempo':G.tempo=d.t;break;
    case 'drive':simDrive();afterCommit();return;
    case 'end':simToEnd();afterCommit();return;
    case 'finish':finishUserGame();window.scrollTo(0,0);break;
    case 'watch':{const g=S.games[+d.g];if(!g||g.done||g.h===S.userId||g.a===S.userId)break;S.gview=null;startWatch(g);window.scrollTo(0,0);break}
    case 'uwatch':{const g=userGame(S.week);if(!g)break;tagRivals();stampGame(g);SC.stormDone=false;SC.stormFlash=false;SC.fans=[];SC.conf=[];startGame(g);G.watch=true;G.mine=true;G.uid=S.userId;G.auto=true;window.scrollTo(0,0);break}
    case 'takeover':clearTimeout(WT);G.watch=false;G.auto=false;G.mine=false;if(G.phase==='off'||G.phase==='def')prep();log('You take over the play calling.','k');break;
    case 'wauto':G.auto=!G.auto;clearTimeout(WT);break;
    case 'wstep':watchStep();return;
    case 'wdrive':simDrive();afterCommit();return;
    case 'wq':{const q=G.q,ot=G.ot;let i=0;while(G.phase!=='over'&&G.q===q&&G.ot===ot&&i++<600)autoStep();G.koAnim=null;afterCommit();return}
    case 'wend':simToEnd();afterCommit();return;
    case 'wfinish':finishWatch();window.scrollTo(0,0);break;
    case 'recruit':S.recruit=d.r;break;
    case 'next':offseason();if(S.move!=null)switchJob(S.move);startSeason();window.scrollTo(0,0);break;
    case 'newjob':offseason();S.view='setup';window.scrollTo(0,0);break;
    case 'reset':if(!confirmReset){confirmReset=true}else{confirmReset=false;try{localStorage.removeItem('saturday_sideline_v1')}catch(e){}S=null;G=null;L=newLeague()}break;
  }
  save();render();
}
let tapAt=0;
document.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('[data-act="tap"]');if(b&&G&&G.meter){e.preventDefault();tapAt=Date.now();act('tap',{})}});
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;if(b.dataset.act==='tap'&&Date.now()-tapAt<800)return;act(b.dataset.act,b.dataset)});
document.addEventListener('keydown',e=>{if(e.code==='Space'&&G&&G.meter&&S.view==='game'){e.preventDefault();act('tap',{})}});
loadLS();load();if(S&&S.confs){CONFS=S.confs;DIVS=S.divs||null}patchLeague();if(S&&S.teams){patchRivals()}applyLoreTpl();applyLoreCareer();if(S&&S.teams){patchRivals();try{freshRivals();expandQueue();setPN();pollFix()}catch(e){}if(S.games){tagRivals();try{fixCCG()}catch(e){}try{fixField()}catch(e){}try{clsSeed()}catch(e){}}}patchG();
if(!S)L=newLeague();
setTimeout(cloudInit,0);
window.addEventListener&&window.addEventListener('beforeunload',()=>{});
render();
