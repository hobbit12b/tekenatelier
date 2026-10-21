import {describe,it,expect} from 'vitest';
import 'fake-indexeddb/auto';
import {applyEdit} from './edits';
import {createDrawing,cleanDrawing} from './model';
import {savePublic,allRecords,deleteProject} from './storage';
describe('snelle en vertraagde bewerkingen',()=>{
 it('verwerpt een vertraagde vulling na een nieuwere wijziging',()=>{const old=createDrawing(),newer=applyEdit(old,d=>({...d,name:'nieuw'}));expect(applyEdit(newer,{...old,name:'vertraagd'},old)).toBe(newer);});
 it('voegt twee snelle bewerkingen toe aan de actuele staat',()=>{let d=createDrawing();const append=(name:string)=>{d=applyEdit(d,current=>({...current,colors:[...current.colors,name]}));};append('#123456');append('#abcdef');expect(d.colors).toEqual(['#123456','#abcdef']);});
 it('past nooit een bewerking uit een ander project toe',()=>{const a=createDrawing(),b=createDrawing();expect(applyEdit(a,b)).toBe(a);});
 it('geeft edits binnen dezelfde milliseconde verschillende revisies',()=>{const a=createDrawing(),b=applyEdit(a,{...a,name:'b'}),c=applyEdit(b,{...b,name:'c'});expect(c.updated).toBeGreaterThan(b.updated);});
 it('laat een oudere opslag nooit nieuw tekenwerk vervangen',async()=>{const d=createDrawing();await savePublic({...d,name:'nieuw',updated:d.updated+10},'nieuw');await savePublic({...d,name:'oud'},'oud');expect((await allRecords()).find(r=>r.id===d.id)?.drawing?.name).toBe('nieuw');await deleteProject(d.id);});
 it('bewaart alleen bekende herkenningsplaatjes',()=>{expect(cleanDrawing({...createDrawing(),badge:'egel'}).badge).toBe('egel');expect(cleanDrawing({...createDrawing(),badge:'naam van een kind'}).badge).toBeUndefined();});
});
