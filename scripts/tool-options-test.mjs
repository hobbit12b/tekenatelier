import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1024,height:768}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const button=name=>page.getByRole('button',{name,exact:true});
try{
 await page.goto('http://127.0.0.1:5174/');
 await page.evaluate(async()=>{
  const {createDrawing}=await import('/src/model.ts'),{savePublic}=await import('/src/storage.ts');
  const d=createDrawing();d.marks=[{kind:'stroke',id:'open-box',tool:'stift',color:'#000000',width:3,mirror:false,points:[{x:596,y:250},{x:450,y:250},{x:450,y:550},{x:750,y:550},{x:750,y:250},{x:604,y:250}]}];await savePublic(d);
 });
 await button('mijn tekeningen').click();await page.locator('.drawing-card').first().click();
 const canvas=page.getByLabel('tekenblad',{exact:true});
 const pixel=()=>page.locator('.art-layer').evaluate(c=>[...c.getContext('2d').getImageData(30,30,1,1).data]);
 for(const mode of ['kleine opening sluiten','gesloten vorm vullen','grotere opening sluiten']){
  await button('vullen').click();assert.equal(await page.locator('.side-panel').count(),0);assert.equal(await page.locator('.tool-popout').innerText(),'');await page.waitForTimeout(2400);await page.screenshot({path:'test-results/vul-subknoppen.png'});await button(mode).click();const r=await canvas.boundingBox();await page.mouse.click(r.x+r.width/2,r.y+r.height*400/848);await page.waitForTimeout(600);
  assert.equal((await pixel())[3],mode==='gesloten vorm vullen'?255:0,mode);
  await button('ongedaan maken').click();await page.waitForTimeout(150);
 }
 const before=await page.locator('.art-layer').evaluate(c=>c.toDataURL());
 await button('gum').click();assert.equal(await page.locator('.tool-popout').innerText(),'');await page.waitForTimeout(2400);await page.screenshot({path:'test-results/gum-subknoppen.png'});await button('zelf gummen').click();assert.equal(await page.locator('.side-panel').count(),0);
 await button('gum').click();await button('hele vel leegmaken').click();await page.waitForTimeout(200);
 assert(await page.locator('.art-layer').evaluate(c=>!c.getContext('2d').getImageData(0,0,c.width,c.height).data.some(v=>v)));
 await page.keyboard.press('Control+z');await page.waitForTimeout(200);assert.equal(await page.locator('.art-layer').evaluate(c=>c.toDataURL()),before);
 for(const [width,height] of [[1024,768],[768,1024]]){
  await page.setViewportSize({width,height});await button('vullen').click();const pop=await page.locator('.tool-popout').boundingBox(),tool=await button('vullen').boundingBox();assert(pop.x>=tool.x+tool.width&&pop.x+pop.width<=width&&pop.y>=0&&pop.y+pop.height<=height);await button('vullen').click();assert.equal(await page.locator('.tool-popout').count(),0);const home=await button('naar huis').boundingBox(),title=await page.locator('.header-title').boundingBox();assert(home.x<title.x&&home.x<100&&title.x+title.width<=width);
  await button('kleuren mengen').click();await button('eerste mengkleur #f1c83c').click();await button('tweede mengkleur #3d6cbb').click();await page.waitForTimeout(1800);
  const circles=await page.locator('.mix-stage>i').evaluateAll(es=>es.map(e=>({opacity:getComputedStyle(e).opacity,bg:getComputedStyle(e).backgroundColor,x:e.getBoundingClientRect().x,right:e.getBoundingClientRect().right})));
  assert(circles.every(c=>c.opacity==='1'&&c.x>=0&&c.right<=width));assert(circles[0].right<circles[1].x&&circles[1].right<circles[2].x);assert.equal(await page.locator('.mix-symbol').allTextContents().then(a=>a.join('')),'+=');
  await page.screenshot({path:`test-results/kleurensom-${width}x${height}.png`});
  // Even reselecting the same first colour starts a fresh pair.
  await button('eerste mengkleur #f1c83c').click();assert.equal(await page.locator('.paint-right').innerText(),'?');await page.waitForTimeout(1800);assert(await button('met mengkleur tekenen').isDisabled());
  await button('tweede mengkleur #e5554f').click();await page.waitForTimeout(1800);assert(await button('met mengkleur tekenen').isEnabled());
  await button('sluiten').click();
 }
 assert.equal(await page.locator('.tool-feedback').count(),0);
 await page.getByLabel('titel van je tekening',{exact:true}).fill('mijn regenboog');await page.getByLabel('titel van je tekening',{exact:true}).press('Enter');
 await button('naar huis').click();await button('mijn tekeningen').click();assert.equal(await page.locator('.drawing-card h3').first().innerText(),'mijn regenboog');assert.equal(await page.getByText('teken lekker verder',{exact:true}).count(),0);
 await page.locator('.drawing-card').first().click();assert.equal(await page.getByLabel('titel van je tekening',{exact:true}).inputValue(),'mijn regenboog');await button('naar huis').click();
 await button('nieuwe tekening').click();await page.getByLabel('titel van je tekening',{exact:true}).fill('tweede werk');await button('naar huis').click();
 await button('voor de leerkracht').click();await page.getByLabel('leerkrachtcode',{exact:true}).fill('2468');await button('openen').click();await button('projecten').click();await button('alle tekeningen selecteren').click();
 await button('selectie afdrukken via ricoh').click();
 assert.equal(await page.getByRole('button',{name:/^bewaar .* in bestanden$/}).count(),2);
 assert.equal(await page.getByRole('link',{name:'open ricoh',exact:true}).getAttribute('href'),'https://www.eu.smart-integration.ricoh.com/print-site/');
 const {readFile}=await import('node:fs/promises');
 for(const format of ['jpg','png','pdf']){
  await page.getByLabel('bestandstype voor afdrukken',{exact:true}).selectOption(format);
  const save=page.getByRole('button',{name:'bewaar mijn regenboog in bestanden',exact:true});
  await page.waitForFunction(()=>!document.querySelector('button[aria-label="bewaar mijn regenboog in bestanden"]').disabled);
  const downloaded=page.waitForEvent('download');await save.click();const file=await downloaded;
  assert(file.suggestedFilename().endsWith('.'+format));await file.saveAs(`test-results/afdruk-selectie.${format}`);
  const bytes=await readFile(`test-results/afdruk-selectie.${format}`);
  if(format==='jpg'){assert.equal(bytes[0],255);assert.equal(bytes[1],216);}
  if(format==='png')assert.equal(bytes.subarray(1,4).toString(),'PNG');
  if(format==='pdf')assert.equal(bytes.subarray(0,4).toString(),'%PDF');
 }
 await button('sluiten').click();await button('druk mijn regenboog af via ricoh').click();assert(await page.getByText('1 tekening,',{exact:false}).count());
 assert.equal(await button('bewaar in bestanden').count(),1);
 assert.equal(await page.getByText('afdruk-pdf maken',{exact:true}).count(),0);
 assert.deepEqual(errors,[]);console.log('PASS both fill modes through worker/UI; eraser choices and undo clear; home left/title right; persistent colour equation and fresh pair each round');
}finally{await browser.close();}
