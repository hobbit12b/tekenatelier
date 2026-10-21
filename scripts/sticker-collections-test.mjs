import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1160}});
 await page.goto('http://127.0.0.1:5174/');
 await page.getByRole('button',{name:/nieuwe tekening/}).click();
 const result=await page.evaluate(async()=>{
  const {transact}=await import('/src/storage.ts');
  const {themes}=await import('/src/model.ts');
  const stickers=await transact('stickers','readonly',s=>s.getAll());
  document.body.replaceChildren();document.body.style.cssText='margin:0;padding:20px;background:#fbf1df;font:16px sans-serif';
  const counts={};
  for(const theme of themes){
   const row=document.createElement('section');row.style.cssText='display:grid;grid-template-columns:150px repeat(12,1fr);align-items:center;gap:6px;height:135px;border-bottom:1px solid #cdbd9b';
   const title=document.createElement('strong');title.textContent=theme.name;row.append(title);
   const items=stickers.filter(s=>s.theme===theme.id);counts[theme.id]=items.length;
   for(const item of items){
    const cell=document.createElement('div'),image=new Image();image.src=item.src;await image.decode();
    const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
    const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);
    const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let empty=0,opaque=0;for(let i=3;i<pixels.length;i+=4){if(pixels[i]===0)empty++;if(pixels[i]>200)opaque++;}
    if(empty<100||opaque<100)throw Error('lege of niet-transparante sticker: '+item.id);
    image.style.cssText='width:100%;height:98px;object-fit:contain';
    const label=document.createElement('div');label.textContent=item.name;label.style.cssText='font-size:11px;text-align:center';cell.append(image,label);row.append(cell);
   }
   document.body.append(row);
  }
  return counts;
 });
 assert.equal(Object.keys(result).length,8);assert(Object.values(result).every(n=>n===12),JSON.stringify(result));
 await page.screenshot({path:'test-results/acht-stickercollecties.png',fullPage:true});
 console.log('PASS acht collecties met twaalf zelfstandig gedecodeerde, transparante stickers',result);
}finally{await browser.close();}
