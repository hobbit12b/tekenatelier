import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1000,height:600}});
 await page.goto('http://127.0.0.1:5174/');
 const result=await page.evaluate(async()=>{
  const {stroke}=await import('/src/render.ts');
  const c=document.createElement('canvas');c.width=1000;c.height=500;const ctx=c.getContext('2d',{willReadFrequently:true});
  const base={kind:'stroke',id:'grain',color:'#3d6cbb',width:38,mirror:false,grain:true};
  for(const [tool,y,pressure] of [['potlood',70,.15],['potlood',140,.9],['wasco',240,.5]])stroke(ctx,{...base,tool,points:[{x:50,y,pressure},{x:900,y,pressure}]},1000);
  const stats=y=>{const a=ctx.getImageData(100,y-5,700,10).data;let sum=0,holes=0;const levels=new Set();for(let i=3;i<a.length;i+=4){sum+=a[i];if(!a[i])holes++;levels.add(a[i]);}return {sum,holes,levels:levels.size};};
  const light=stats(70),dark=stats(140),chalk=stats(240);
  const original=ctx.getImageData(0,0,1000,500).data;
  const copy=document.createElement('canvas');copy.width=1000;copy.height=500;const cc=copy.getContext('2d',{willReadFrequently:true});
  for(const [tool,y,pressure] of [['potlood',70,.15],['potlood',140,.9],['wasco',240,.5]])stroke(cc,{...base,tool,points:[{x:50,y,pressure},{x:900,y,pressure}]},1000);
  const same=cc.getImageData(0,0,1000,500).data.every((v,i)=>v===original[i]);
  stroke(ctx,{...base,tool:'wasco',color:'#e5554f',points:Array.from({length:300},(_,i)=>({x:50+i*2.7,y:370+Math.sin(i/30)*25}))},1000);
  c.style.background='white';document.body.replaceChildren(c);return {light,dark,chalk,same};
 });
 assert(result.dark.sum>result.light.sum*3);assert(result.dark.holes>0);assert(result.chalk.holes>result.dark.holes);assert(result.chalk.levels>20);assert(result.same);
 await page.screenshot({path:'test-results/potlood-krijt.png'});console.log('PASS grain, chalk gaps, pencil pressure and identical redraw',result);
}finally{await browser.close();}
