const noop=()=>{};
const el=()=>({innerHTML:'',classList:{add:noop,remove:noop},addEventListener:noop,getContext:()=>new Proxy({},{get:(t,k)=>k==='measureText'?()=>({width:100}):k==='createLinearGradient'||k==='createRadialGradient'?()=>({addColorStop:noop}):noop,set:()=>true}),parentElement:{clientWidth:390},style:{},isConnected:true,dataset:{}});
const els={};
global.document={querySelector:(s)=>els[s]||(els[s]=el()),querySelectorAll:()=>[],getElementById:(id)=>els['#'+id]||(els['#'+id]=el()),addEventListener:noop};
global.localStorage={getItem(){return null},setItem(){},removeItem(){}};
global.window={scrollTo:noop,addEventListener:noop,devicePixelRatio:2};
global.requestAnimationFrame=()=>1;global.cancelAnimationFrame=noop;
