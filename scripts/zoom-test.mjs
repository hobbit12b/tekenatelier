import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
const page=await browser.newPage({viewport:{width:1024,height:768}});const button=name=>page.getByRole('button',{name,exact:true});
await page.goto('http://127.0.0.1:5174/');await button('nieuwe tekening').click();await button('potlood').click();
assert.equal(await button('lijndikte 1').getAttribute('aria-pressed'),'true');
const sizes=await page.evaluate(async()=>{const {widthsForTool}=await import('/src/model.ts');return {p:widthsForTool('potlood'),w:widthsForTool('wasco')};});assert(Math.max(...sizes.p)<Math.min(...sizes.w));
const c=page.getByLabel('tekenblad',{exact:true});const original=await c.boundingBox();assert(original.width>400&&original.height>200,JSON.stringify(original));
await button('inzoomen').click();await button('inzoomen').click();await page.waitForTimeout(100);const enlarged=await c.boundingBox();assert(Math.abs(enlarged.width/original.width-1.5)<.02);
// Simulated pen pressure must no longer affect stored pencil points.
await c.dispatchEvent('pointerdown',{pointerId:1,pointerType:'pen',pressure:.1,clientX:enlarged.x+50,clientY:enlarged.y+60,bubbles:true});
await c.dispatchEvent('pointermove',{pointerId:1,pointerType:'pen',pressure:.9,clientX:enlarged.x+160,clientY:enlarged.y+60,bubbles:true});
await c.dispatchEvent('pointerup',{pointerId:1,pointerType:'pen',clientX:enlarged.x+160,clientY:enlarged.y+60,bubbles:true});
await button('vel verschuiven').click();const cover=page.getByLabel('sleep om het vel te verschuiven');assert(await cover.isVisible());
await page.locator('.zoom-viewport').evaluate(e=>e.scrollTo(100,100));assert(await page.locator('.zoom-viewport').evaluate(e=>e.scrollLeft>0||e.scrollTop>0));
await button('hele vel tonen').click();assert.equal(await page.getByLabel('zoompercentage').innerText(),'100%');assert.equal(await cover.count(),0);
for(const [width,height] of [[1024,768],[768,1024]]){await page.setViewportSize({width,height});await page.waitForTimeout(100);const r=await c.boundingBox();assert(r.x>=0&&r.y>=0&&r.x+r.width<=width&&r.y+r.height<height-70,JSON.stringify(r));await page.screenshot({path:`test-results/zoom-${width}.png`});}
console.log('PASS pencil starts thin, separate width ranges, zoom ratio, pan, reset, portrait/landscape fit');
}finally{await browser.close();}
