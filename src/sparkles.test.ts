import {describe,it,expect} from 'vitest';
import {sparklePoints} from './sparkles';
import type {Stroke} from './model';
const s:Stroke={kind:'stroke',id:'glitter',tool:'glitter',color:'#8960a8',width:30,points:[{x:100,y:100},{x:1100,y:100}],mirror:false};
describe('glittersterretjes',()=>{
 it('verdeelt sterretjes langs de hele lijn',()=>{const p=sparklePoints([s],1200);expect(p.length).toBeGreaterThan(25);expect(p[p.length-1].x).toBeGreaterThan(1050);});
 it('begrensde animatie bij veel lijnen',()=>expect(sparklePoints(Array.from({length:1000},()=>s),1200)).toHaveLength(260));
 it('spiegelt de sterretjes',()=>{const p=sparklePoints([{...s,mirror:true,points:[{x:100,y:100}]}],1200);expect(p).toHaveLength(2);expect(p[0].x+p[1].x).toBe(1200);});
 it('geen animatie voor gewone lijnen of lege geschiedenis',()=>{expect(sparklePoints([{...s,tool:'stift'}],1200)).toEqual([]);expect(sparklePoints([],1200)).toEqual([]);});
});
