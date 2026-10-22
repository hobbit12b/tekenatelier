import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1080,height:810}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:5174/');
 await page.evaluate(async()=>{
  const {createDrawing}=await import('/src/model.ts');const {savePublic}=await import('/src/storage.ts');
  const c=document.createElement('canvas');c.width=c.height=100;const ctx=c.getContext('2d');ctx.fillStyle='#cc5522';ctx.fillRect(0,0,100,100);
  for(const kind of ['shape','sticker']){
   const d=createDrawing();d.name=kind;d.marks=[
    {kind,id:'object',x:400,y:400,w:240,h:240,rotation:0,color:'#cc5522',filled:true,shape:'vierkant',...(kind==='sticker'?{src:c.toDataURL()}: {})},
    {kind:'stroke',id:'erase',tool:'gum',color:'#000000',width:60,mirror:false,points:[{x:260,y:400},{x:650,y:400}]},
    {kind:'stroke',id:'over',tool:'stift',color:'#2277cc',width:25,mirror:false,points:[{x:450,y:240},{x:450,y:570}]}
   ];await savePublic(d);
  }
 });
 await page.reload();
 for(let index=0;index<2;index++){
  await page.getByRole('button',{name:'mijn tekeningen',exact:true}).click();await page.locator('.drawing-card').nth(index).click();
  await page.getByRole('button',{name:'verplaatsen',exact:true}).click();
  const r=await page.getByLabel('tekenblad',{exact:true}).boundingBox();
  const pos=(x,y)=>({x:r.x+x*r.width/1200,y:r.y+y*r.height/848});
  const a=pos(400,350),b=pos(470,350);
  await page.mouse.move(a.x,a.y);await page.mouse.down();await page.waitForTimeout(150);await page.mouse.move(b.x,b.y,{steps:12});await page.waitForTimeout(200);
  const preview=await page.getByLabel('tekenblad',{exact:true}).evaluate(c=>c.toDataURL());
  await page.mouse.up();await page.waitForTimeout(250);
  const committed=await page.locator('.art-layer').evaluate(c=>c.toDataURL());
  assert.equal(preview,committed,'erased object and later paint must match during and after drag');
  await page.keyboard.press('Control+z');await page.waitForTimeout(150);await page.keyboard.press('Control+y');await page.waitForTimeout(200);
  assert.equal(await page.locator('.art-layer').evaluate(c=>c.toDataURL()),committed,'redo preserves ordering');
  await page.mouse.click(b.x,b.y);
  for(const handle of ['vorm schalen','vorm draaien']){
   const box=await page.getByRole('button',{name:handle,exact:true}).boundingBox();
   await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.waitForTimeout(100);await page.mouse.move(box.x+box.width/2+30,box.y+box.height/2+25,{steps:8});await page.waitForTimeout(150);
   const live=await page.getByLabel('tekenblad',{exact:true}).evaluate(c=>c.toDataURL());await page.mouse.up();await page.waitForTimeout(200);
   assert.equal(await page.locator('.art-layer').evaluate(c=>c.toDataURL()),live,handle+' after erasing');
  }
  await page.getByRole('button',{name:'naar huis',exact:true}).click();
 }
 assert.deepEqual(errors,[]);console.log('PASS stamp and shape after erasing: move, scale, rotate, preview/commit pixel equality, undo/redo');
}finally{await browser.close();}

