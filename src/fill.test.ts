import {describe,it,expect} from 'vitest';
import {fillPixels} from './fill';
const w=80,h=80;
function drawing(gap=0){const a=new Uint8ClampedArray(w*h*4).fill(255);for(let y=15;y<=65;y++)for(let x=15;x<=65;x++)if((x===15||x===65||y===65||y===15)&&!(y===15&&Math.abs(x-40)<gap/2)){a.set([0,0,0,255],(y*w+x)*4);}return a;}
const alpha=(a:Uint8ClampedArray,x:number,y:number)=>a[(y*w+x)*4+3];
describe('vergevingsgezind vullen',()=>{
 it('overbrugt een kleine opening zonder buiten de vorm te vullen',()=>{const out=fillPixels(drawing(8),w,h,40,40,[255,0,0]);expect(alpha(out,40,40)).toBe(255);expect(alpha(out,5,5)).toBe(0);expect(alpha(out,40,10)).toBe(0);});
 it('laat een grote opening open',()=>{expect(alpha(fillPixels(drawing(24),w,h,40,40,[255,0,0]),5,5)).toBe(255);});
 it('kleurt de witte bijdrage van een zachte rand zonder de zwarte lijn te overschilderen',()=>{const a=drawing();for(let y=16;y<65;y++)a.set([220,220,220,255],(y*w+16)*4);const out=fillPixels(a,w,h,40,40,[255,0,0]);expect(Array.from(out.slice((40*w+16)*4,(40*w+16)*4+4))).toEqual([220,0,0,255]);expect(alpha(out,15,40)).toBe(0);});
 it('vult een leeg blad tot aan de rand',()=>{const out=fillPixels(new Uint8ClampedArray(w*h*4).fill(255),w,h,40,40,[0,100,200]);expect(Array.from(out.slice(0,4))).toEqual([0,100,200,255]);});
});
