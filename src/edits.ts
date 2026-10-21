import type {Drawing} from './model';
export type DrawingEdit=Drawing|((current:Drawing)=>Drawing);
/** An async result may only replace the exact snapshot on which it was based. */
export function applyEdit(current:Drawing,edit:DrawingEdit,expected?:Drawing):Drawing{
 if(expected&&current!==expected)return current;
 const next=typeof edit==='function'?edit(current):edit;
 if(next===current||next.id!==current.id)return current;
 return {...next,status:'draft',updated:Math.max(Date.now(),current.updated+1)};
}
