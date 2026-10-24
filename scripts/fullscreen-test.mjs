import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1024,height:768}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5174/');await page.getByRole('button',{name:'spel beeldvullend maken',exact:true}).click();
 await page.waitForFunction(()=>!!document.fullscreenElement);assert(await page.getByRole('button',{name:'beeldvullend sluiten',exact:true}).isVisible());
 await page.getByRole('button',{name:'nieuwe tekening',exact:true}).click();assert(await page.evaluate(()=>!!document.fullscreenElement));
 await page.getByRole('button',{name:'beeldvullend sluiten',exact:true}).click();await page.waitForFunction(()=>!document.fullscreenElement);
 const icon=page.getByRole('button',{name:'hele vel tonen',exact:true}).locator('img');assert((await icon.getAttribute('src')).endsWith('fit-page-spaced.webp'));assert(await icon.evaluate(i=>i.complete&&i.naturalWidth>0));
 for(const [width,height] of [[1024,768],[768,1024]]){await page.setViewportSize({width,height});await page.waitForTimeout(100);const b=await page.getByRole('button',{name:'spel beeldvullend maken',exact:true}).boundingBox();assert(b.x>=0&&b.x+b.width<width);await page.screenshot({path:`test-results/fullscreen-${width}.png`});}
 await page.evaluate(()=>{Object.defineProperty(document,'fullscreenEnabled',{value:false,configurable:true});Object.defineProperty(document.documentElement,'webkitRequestFullscreen',{value:undefined,configurable:true});});await page.getByRole('button',{name:'spel beeldvullend maken',exact:true}).click();await page.getByRole('dialog',{name:'beeldvullend spelen'}).waitFor();assert.deepEqual(errors,[]);
 console.log('PASS fullscreen entry, drawing navigation, exit, new icon, portrait/landscape layout and unsupported fallback');
}finally{await browser.close();}
