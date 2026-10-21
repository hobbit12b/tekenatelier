import type {Item,Point} from './model';
export function transformItem(item:Item,start:Point,point:Point,mode:'scale'|'rotate',width:number,height:number):Item {
 const a={x:start.x-item.x,y:start.y-item.y},b={x:point.x-item.x,y:point.y-item.y};
 if(mode==='rotate')return {...item,rotation:item.rotation+Math.atan2(b.y,b.x)-Math.atan2(a.y,a.x)};
 const factor=Math.hypot(b.x,b.y)/Math.max(1,Math.hypot(a.x,a.y));
 const scale=Math.max(24/Math.min(item.w,item.h),Math.min(factor,Math.min(width*2/item.w,height*2/item.h)));
 return {...item,w:item.w*scale,h:item.h*scale};
}
