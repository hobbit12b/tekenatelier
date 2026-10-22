import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage();
try{
 await page.addInitScript(()=>{window.plops=0;const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){if(this.src.includes('/audio/plop.mp3'))window.plops++;return play.call(this);};});
 await page.goto('http://127.0.0.1:5174/');
 await page.getByRole('button',{name:'nieuwe tekening',exact:true}).click();
 await page.getByRole('button',{name:'stempels',exact:true}).click();await page.getByRole('button',{name:'egel',exact:true}).click();
 assert.equal(await page.evaluate(()=>window.plops),0);
 const r=await page.getByLabel('tekenblad',{exact:true}).boundingBox();
 for(let i=0;i<5;i++)await page.mouse.click(r.x+100+i*25,r.y+100);
 assert.equal(await page.evaluate(()=>window.plops),5);
 const decoded=await page.evaluate(async()=>{const ctx=new AudioContext();try{const response=await fetch('/audio/plop.mp3');return (await ctx.decodeAudioData(await response.arrayBuffer())).duration;}finally{await ctx.close();}});
 assert(decoded>0&&decoded<10);
 await page.getByRole('button',{name:'ongedaan maken',exact:true}).click();assert.equal(await page.evaluate(()=>window.plops),5);
 console.log('PASS one plop per stamp, rapid repeat, no sound on selection/undo, MP3 decodes:',decoded);
}finally{await browser.close();}
