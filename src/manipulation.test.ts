import {describe,it,expect} from 'vitest';
import {transformItem} from './manipulation';
import type {Item} from './model';
const item:Item={id:'a',kind:'shape',shape:'rechthoek',x:300,y:200,w:100,h:50,rotation:Math.PI/4,color:'#ff0000',filled:true};
describe('hoekgrepen',()=>{
 it('schaalt vanuit het midden met behoud van verhouding en draaiing',()=>{const result=transformItem(item,{x:350,y:250},{x:400,y:300},'scale',1200,848);expect(result.w).toBeCloseTo(200);expect(result.h).toBeCloseTo(100);expect(result.x).toBe(300);expect(result.rotation).toBe(item.rotation);});
 it('draait om het midden zonder formaatverandering',()=>{const result=transformItem(item,{x:350,y:200},{x:300,y:250},'rotate',1200,848);expect(result.rotation).toBeCloseTo(item.rotation+Math.PI/2);expect(result.w).toBe(100);expect(result.h).toBe(50);});
 it('begrenst piepklein en zeer groot schalen zonder vervorming',()=>{for(const target of [{x:300,y:200},{x:900000,y:200}]){const r=transformItem(item,{x:350,y:200},target,'scale',1200,848);expect(r.w/r.h).toBe(2);expect(r.h).toBeGreaterThanOrEqual(24);expect(r.w).toBeLessThanOrEqual(2400);}});
});
