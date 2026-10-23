import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1024,height:768}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5174/');
 await page.getByRole('button',{name:'nieuwe tekening',exact:true}).click();
 for(const [width,height] of [[1024,768],[768,1024]]){
  await page.setViewportSize({width,height});
  for(const name of ['spiegeltekenen','achtergrond','tekening afspelen']){
   const b=await page.getByRole('button',{name,exact:true}).boundingBox();
   assert(b.x>width*.8&&b.y>70&&b.y+b.height<height-130,JSON.stringify(b));
  }
  await page.screenshot({path:`test-results/materialen-${width}.png`});
 }
 await page.setViewportSize({width:1280,height:800});
 const result=await page.evaluate(async()=>{
  const {stroke}=await import('/src/render.ts');
  const c=document.createElement('canvas');c.width=1200;c.height=400;
  const ctx=c.getContext('2d');
  const base={kind:'stroke',id:'sample',tool:'kwast',color:'#1965da',width:38,mirror:false,wet:true,dryBrush:true};
  const points=Array.from({length:551},(_,i)=>({x:30+i*2,y:80}));
  stroke(ctx,{...base,points},1200);
  stroke(ctx,{...base,points:[{x:30,y:170},{x:160,y:170}]},1200);
  const alphaAt=(x,y)=>ctx.getImageData(x,y,1,1).data[3];
  const empty=alphaAt(1080,80),fresh=alphaAt(90,170);
  const thickness=x=>{let n=0;const a=ctx.getImageData(x,40,1,90).data;for(let i=3;i<a.length;i+=4)if(a[i]>10)n++;return n;};
  const thick=[thickness(100),thickness(400),thickness(750)];
  for(const [y,pressure] of [[240,.1],[290,.9]])stroke(ctx,{...base,tool:'potlood',dryBrush:false,wet:false,points:[{x:30,y,pressure},{x:700,y,pressure}]},1200);
  const light=alphaAt(300,240),dark=alphaAt(300,290);
  const first=c.toDataURL();const other=document.createElement('canvas');other.width=1200;other.height=400;
  stroke(other.getContext('2d'),{...base,points},1200);
  const reference=other.getContext('2d').getImageData(0,0,1200,130).data;
  const deterministic=ctx.getImageData(0,0,1200,130).data.every((v,i)=>i%4!==3||Math.abs(v-reference[i])<=3);
  c.style.cssText='background:white;width:1200px;height:400px';document.body.replaceChildren(c);
  return {empty,fresh,thick,light,dark,deterministic};
 });
 assert.equal(result.empty,0);assert(result.fresh>50);assert(result.dark>result.light*3);assert(new Set(result.thick).size>1);await page.screenshot({path:"test-results/kwast-potlood.png"});assert(result.deterministic,JSON.stringify(result));
 await page.screenshot({path:'test-results/kwast-potlood.png'});assert.deepEqual(errors,[]);console.log('PASS',result);
}finally{await browser.close();}
