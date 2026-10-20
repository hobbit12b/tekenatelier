import {describe,it,expect} from 'vitest';
import 'fake-indexeddb/auto';
import {createDrawing,cleanDrawing,validateDrawing,defaults,themes,type Photo} from './model';
import {seal,unseal,savePrivate,savePublic,openPrivate,allRecords,deleteProject} from './storage';
import {mix} from './mixing';
describe('educatieve verfkleuren',()=>{
 it('mengt geel en blauw naar groen',()=>{const c=mix('#ffff00','#0000ff');const r=parseInt(c.slice(1,3),16),g=parseInt(c.slice(3,5),16),b=parseInt(c.slice(5),16);expect(g).toBeGreaterThan(r);expect(g).toBeGreaterThan(b);});
 it('mengt rood en geel naar oranje',()=>expect(mix('#ff0000','#ffff00')).toBe('#ff8000'));
 it('mengt rood en blauw naar paars',()=>{const c=mix('#ff0000','#0000ff');expect(parseInt(c.slice(1,3),16)).toBeGreaterThan(50);expect(parseInt(c.slice(5),16)).toBeGreaterThan(50);expect(parseInt(c.slice(3,5),16)).toBe(0);});
 it('wit maakt roze en zwart maakt donkerder',()=>{expect(mix('#ff0000','#ffffff')).toBe('#ff7a7a');expect(mix('#ff0000','#000000')).toBe('#800000');});
 it('is commutatief en bewaart dezelfde kleur',()=>{expect(mix('#f1c83c','#3d6cbb')).toBe(mix('#3d6cbb','#f1c83c'));expect(mix('#123456','#123456')).toBe('#123456');});
});
describe('projectmodel',()=>{
 it('heeft acht juiste thema’s',()=>{expect(themes).toHaveLength(8);expect(themes.every(t=>t.assets.length>=15)).toBe(true);});
 it('start met leeg bewerkbaar project',()=>{const d=createDrawing();expect(d.marks).toEqual([]);expect(d.width/d.height).toBeCloseTo(1.415,2);expect(createDrawing({...defaults,size:'vierkant'}).width).toBe(900);});
 it('wijst beschadigde projecten af',()=>expect(()=>validateDrawing({})).toThrow());
 it('neemt geen foto of wachtzin over naar publieke data',()=>{const d={...createDrawing(),photo:'secret-photo',passphrase:'secret'};expect(JSON.stringify(cleanDrawing(d))).not.toContain('secret');});
});
describe('foto-opslag',()=>{
 const photo:Photo={src:'data:image/jpeg;base64,LEERLINGFOTO',x:0,y:0,w:1200,h:848,opacity:.3,visible:false};const phrase='mijn geheime wachtzin voor deze test';
 it('versleutelt en ontsleutelt met willekeurige salt en IV',async()=>{const a=await seal({photo},phrase),b=await seal({photo},phrase);expect(a.salt).not.toEqual(b.salt);expect(a.iv).not.toEqual(b.iv);expect(a.cipher).not.toEqual(b.cipher);expect(JSON.stringify(a)).not.toContain('LEERLINGFOTO');expect(await unseal(a,phrase)).toEqual({photo});});
 it('weigert korte en verkeerde wachtzinnen',async()=>{await expect(seal({},'kort')).rejects.toThrow();await expect(unseal(await seal({photo},phrase),'verkeerde wachtzin')).rejects.toThrow();});
 it('privéproject heeft geen publieke tekening of thumbnail; afronden overschrijft ciphertext atomair',async()=>{const d=createDrawing();await savePrivate(d,photo,phrase);let r=(await allRecords()).find(r=>r.id===d.id)!;expect(r.private).toBe(true);expect(r.thumbnail).toBeUndefined();expect(r.drawing).toBeUndefined();expect((await openPrivate(r,phrase)).photo).toEqual(photo);await savePublic({...d,status:'finished'},'tekening-zonder-foto');r=(await allRecords()).find(r=>r.id===d.id)!;expect(r.private).toBe(false);expect(r.sealed).toBeUndefined();expect(JSON.stringify(r)).not.toContain('LEERLINGFOTO');expect(r.drawing?.status).toBe('finished');await deleteProject(d.id);expect((await allRecords()).some(r=>r.id===d.id)).toBe(false);});
});
