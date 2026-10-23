import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:5174/');
 const results=await page.evaluate(async()=>{
  const {stroke}=await import('/src/render.ts'),{fillPixels}=await import('/src/fill.ts'),{widthsForTool}=await import('/src/model.ts');
  return widthsForTool('potlood').map(width=>{
   const c=document.createElement('canvas');c.width=300;c.height=250;const ctx=c.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,300,250);
   const points=Array.from({length:241},(_,i)=>({x:150+85*Math.cos(i*Math.PI/120),y:125+85*Math.sin(i*Math.PI/120)}));
   stroke(ctx,{kind:'stroke',id:'closed',tool:'potlood',color:'#3d6cbb',width,points,mirror:false,grain:true},300);
   const out=fillPixels(ctx.getImageData(0,0,300,250).data,300,250,150,125,[229,85,79],0);
   return {width,inside:out[(125*300+150)*4+3],outside:out[(10*300+10)*4+3]};
  });
 });
 for(const r of results){assert.equal(r.inside,255);assert.equal(r.outside,0,JSON.stringify(r));}console.log('PASS closed textured pencil shapes fill without leaks at all five widths',results);
}finally{await browser.close();}
