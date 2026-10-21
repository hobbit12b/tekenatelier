import {fillPixels} from './fill';
self.onmessage=(event:MessageEvent<{data:Uint8ClampedArray;width:number;height:number;x:number;y:number;rgb:number[]}>)=>{
 try{const p=event.data;const out=fillPixels(p.data,p.width,p.height,p.x,p.y,p.rgb);postMessage({out},{transfer:[out.buffer]});}catch(e){postMessage({error:e instanceof Error?e.message:'vullen is niet gelukt'});}
};

