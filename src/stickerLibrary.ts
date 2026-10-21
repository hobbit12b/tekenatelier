import {themes,type Sticker} from './model';
import {transact} from './storage';
type Entry={id:string;name:string;theme:string;src:string;enabled?:boolean;crop?:number[]};

// Slice the bundled sticker sheet at import time. Each saved sticker is a
// standalone PNG, so drawings remain self-contained when the library changes.
async function stickerSource(image:HTMLImageElement,crop?:number[]){
 const rect=crop||[0,0,1,1];
 if(rect.length!==4||rect.some(v=>!Number.isFinite(v)||v<0||v>1)||rect[2]<=0||rect[3]<=0||rect[0]+rect[2]>1.00001||rect[1]+rect[3]>1.00001)throw Error('ongeldige stickeruitsnede');
 const [x,y,w,h]=rect.map((v,i)=>v*(i%2===0?image.naturalWidth:image.naturalHeight));
 const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(w));canvas.height=Math.max(1,Math.round(h));
 canvas.getContext('2d')!.drawImage(image,x,y,w,h,0,0,canvas.width,canvas.height);
 return canvas.toDataURL('image/png');
}
export async function loadStickerLibrary():Promise<Sticker[]>{
 const existing=await transact<Sticker[]>('stickers','readonly',s=>s.getAll());
 try{
  const response=await fetch('./stickers/manifest.json');if(!response.ok)return existing;
  const manifest=await response.json();if(!Array.isArray(manifest.stickers))return existing;
  const images=new Map<string,HTMLImageElement>();
  for(const s of manifest.stickers as Entry[]){
   if(typeof s.id!=='string'||typeof s.name!=='string'||!themes.some(t=>t.id===s.theme)||typeof s.src!=='string'||!/^\.\/stickers\/[\w/.-]+\.(png|webp)$/.test(s.src))continue;
   const marker='installed-sticker:'+s.id;
   const installed=await transact<boolean|undefined>('settings','readonly',st=>st.get(marker));
   if(installed)continue; // Respect teacher removal, renaming and visibility.
   if(!existing.some(e=>e.id===s.id)){
    let image=images.get(s.src);if(!image){image=new Image();image.src=s.src;await image.decode();images.set(s.src,image);}
    const sticker:Sticker={id:s.id,name:s.name,theme:s.theme,src:await stickerSource(image,s.crop),enabled:s.enabled!==false};
    await transact('stickers','readwrite',st=>st.put(sticker));existing.push(sticker);
   }
   await transact('settings','readwrite',st=>st.put(true,marker));
  }
 }catch(e){console.warn('De meegeleverde stickers konden niet allemaal worden geladen.',e);}
 return existing;
}
