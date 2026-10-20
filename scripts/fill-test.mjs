import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
 const page=await browser.newPage();await page.goto('http://127.0.0.1:5174/');
 const result=await page.evaluate(async()=>{
  const {flood,renderArt}=await import('/src/render.ts');const {createDrawing}=await import('/src/model.ts');
  const d={...createDrawing(),width:160,height:160};
  const points=[];for(let i=0;i<=120;i++){const angle=.08+i*(Math.PI*2-.16)/120;points.push({x:80+50*Math.cos(angle),y:80+50*Math.sin(angle)});}
  d.marks=[{kind:'stroke',id:'ring',tool:'stift',color:'#293c3a',width:3,points,mirror:false}];
  const start=performance.now();const src=await flood(d,{x:80,y:80},'#e5554f');const elapsed=performance.now()-start;
  d.marks.push({kind:'fill',id:'fill',src});const c=await renderArt(document.createElement('canvas'),d,1,true),ctx=c.getContext('2d');
  const pixel=(x,y)=>Array.from(ctx.getImageData(x,y,1,1).data);
  return {center:pixel(80,80),outside:pixel(0,0),edge:pixel(80,32),elapsed};
 });
 assert.deepEqual(result.center,[229,85,79,255]);assert.deepEqual(result.outside,[255,255,255,255]);assert(result.edge[1]<200,'geen witte binnenrand');console.log('PASS echte canvaslijn met opening, geen lek, aansluitende vulling',result);
}finally{await browser.close();}
