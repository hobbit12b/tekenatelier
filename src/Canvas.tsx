import {useEffect,useRef,useState} from 'react';
import {type Drawing,type Photo,type Tool,type Item,type Point,type Stroke,uid,widths} from './model';
import {background,renderArt,renderMarks,stroke,hit,flood} from './render';
import type {DrawingEdit} from './edits';
import {transformItem} from './manipulation';
import {Sparkles} from './GlitterLayer';
type Props={drawing:Drawing;photo:Photo|null;tool:Tool;color:string;size:number;gapRadius:number;mirror:boolean;selected:string|null;stamp:Item|null;onSelect:(id:string|null)=>void;onChange:(edit:DrawingEdit,expected?:Drawing)=>void;onStart:()=>void;onError:(e:unknown)=>void};
type Move={mode?:'scale'|'rotate';original:Drawing;item:Item;start:Point;distance?:number;angle?:number;changed?:Item;base?:HTMLCanvasElement};
export function DrawingCanvas(p:Props){
 const bg=useRef<HTMLCanvasElement>(null),art=useRef<HTMLCanvasElement>(null),live=useRef<HTMLCanvasElement>(null);
 const state=useRef(p);state.current=p;
 const pointers=useRef(new Map<number,Point>()),draft=useRef<Stroke|null>(null),moving=useRef<Move|null>(null);
 const previewSerial=useRef(0),serial=useRef(0),frame=useRef(0),committed=useRef<Drawing|null>(null),alive=useRef(true),fillPending=useRef(false);
 const [filling,setFilling]=useState(false),[movingPreview,setMovingPreview]=useState<Item|null>(null);
 useEffect(()=>()=>{alive.current=false;serial.current++;cancelAnimationFrame(frame.current);},[]);
 useEffect(()=>{const c=bg.current!;c.width=p.drawing.width;c.height=p.drawing.height;background(c.getContext('2d')!,p.drawing);},[p.drawing.width,p.drawing.height,p.drawing.background]);
 useEffect(()=>{
  const n=++serial.current,previous=committed.current,draw=p.drawing;
  const append=previous&&previous.id===draw.id&&previous.width===draw.width&&previous.height===draw.height&&previous.marks.length<=draw.marks.length&&previous.marks.every((m,i)=>m===draw.marks[i]);
  const render=async()=>{let c:HTMLCanvasElement;
   if(append){c=document.createElement('canvas');c.width=draw.width;c.height=draw.height;c.getContext('2d')!.drawImage(art.current!,0,0);await renderMarks(c.getContext('2d')!,{...draw,marks:draw.marks.slice(previous.marks.length)});}
   else c=await renderArt(document.createElement('canvas'),draw);
   if(n!==serial.current||!art.current)return;
   art.current.width=c.width;art.current.height=c.height;art.current.getContext('2d')!.drawImage(c,0,0);committed.current=draw;
   if(!draft.current&&!moving.current)live.current?.getContext('2d')!.clearRect(0,0,c.width,c.height);
  };void render().catch(p.onError);
 },[p.drawing]);
 const point=(e:{clientX:number;clientY:number;pointerType?:string;pressure?:number})=>{const r=live.current!.getBoundingClientRect(),d=state.current.drawing;return {x:(e.clientX-r.left)/r.width*d.width,y:(e.clientY-r.top)/r.height*d.height,...(e.pointerType==='pen'&&e.pressure!==undefined?{pressure:Math.max(.05,Math.min(1,e.pressure))}:{})};};
 const paint=()=>{cancelAnimationFrame(frame.current);frame.current=requestAnimationFrame(()=>{
  const c=live.current;if(!c)return;const ctx=c.getContext('2d')!,s=draft.current,m=moving.current;
  if(!m?.changed)ctx.clearRect(0,0,c.width,c.height);
  if(s){if(s.tool==='gum'||s.wet){ctx.drawImage(art.current!,0,0);art.current!.style.visibility='hidden';}stroke(ctx,s,c.width);}
  else if(m?.base&&m.changed){
   const changed=m.changed,n=++previewSerial.current;setMovingPreview(changed);
   // Replay the selected item and everything above it, including erasers.
   // Render offscreen so an older asynchronous image cannot overwrite a newer drag.
   const preview=document.createElement('canvas');preview.width=c.width;preview.height=c.height;
   const target=preview.getContext('2d')!;target.drawImage(m.base,0,0);
   const index=m.original.marks.findIndex(o=>o.id===m.item.id);
   void renderMarks(target,{...m.original,marks:[changed,...m.original.marks.slice(index+1)]}).then(()=>{
    if(n!==previewSerial.current||moving.current!==m||!live.current)return;
    ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(preview,0,0);art.current!.style.visibility='hidden';
   }).catch(state.current.onError);
  }
 });};
 const reset=()=>{previewSerial.current++;setMovingPreview(null);cancelAnimationFrame(frame.current);pointers.current.clear();draft.current=null;moving.current=null;if(art.current)art.current.style.visibility='visible';live.current?.getContext('2d')!.clearRect(0,0,state.current.drawing.width,state.current.drawing.height);};
 useEffect(()=>{reset();fillPending.current=false;setFilling(false);},[p.drawing.id]);
 const down=(e:React.PointerEvent<HTMLCanvasElement>)=>{
  e.preventDefault();if(e.pointerType==='mouse'&&e.button!==0)return;
  e.currentTarget.setPointerCapture(e.pointerId);const pt=point(e),p=state.current;
  pointers.current.set(e.pointerId,pt);p.onStart();
  if(pointers.current.size>1){draft.current=null;live.current!.getContext('2d')!.clearRect(0,0,p.drawing.width,p.drawing.height);art.current!.style.visibility='visible';if(moving.current){const [a,b]=[...pointers.current.values()];moving.current.distance=Math.hypot(b.x-a.x,b.y-a.y);moving.current.angle=Math.atan2(b.y-a.y,b.x-a.x);}return;}
  if(p.tool==='selectie'){
   const found=[...p.drawing.marks].reverse().find(m=>['shape','text','sticker'].includes(m.kind)&&hit(m as Item,pt)) as Item|undefined;
   p.onSelect(found?.id||null);
   if(found){const m:Move={original:p.drawing,item:{...found},start:pt};moving.current=m;void renderArt(document.createElement('canvas'),{...p.drawing,marks:p.drawing.marks.slice(0,p.drawing.marks.findIndex(i=>i.id===found.id))}).then(c=>{if(moving.current===m){m.base=c;paint();}}).catch(p.onError);}
   return;
  }
  p.onSelect(null);
  if(p.tool==='vullen'){
   if(fillPending.current)return;fillPending.current=true;setFilling(true);const original=p.drawing;
   void flood(original,pt,p.color,p.gapRadius).then(src=>{if(alive.current)state.current.onChange({...original,marks:[...original.marks,{kind:'fill',id:uid(),src}]},original);}).catch(p.onError).finally(()=>{fillPending.current=false;if(alive.current)setFilling(false);});return;
  }
  if(p.tool==='stempel'){if(p.stamp){const mark={...p.stamp,id:uid(),x:pt.x,y:pt.y};p.onChange(d=>d.id===p.drawing.id?{...d,marks:[...d.marks,mark]}:d);}return;}
  draft.current={kind:'stroke',id:uid(),tool:p.tool,color:p.color,width:widths[p.size]*(p.tool==='gum'?2:1),points:[pt],mirror:p.mirror,...(p.tool==='kwast'?{wet:true,dryBrush:true}:{})};paint();
 };
 const move=(e:React.PointerEvent)=>{
  if(!pointers.current.has(e.pointerId))return;const pt=point(e);pointers.current.set(e.pointerId,pt);
  const m=moving.current;if(m){if(m.distance&&pointers.current.size<2)return;
   let changed={...m.item,x:m.item.x+pt.x-m.start.x,y:m.item.y+pt.y-m.start.y};
   if(pointers.current.size===2&&m.distance){const [a,b]=[...pointers.current.values()],min=Math.max(24/m.item.w,24/m.item.h),max=Math.min(state.current.drawing.width*2/m.item.w,state.current.drawing.height*2/m.item.h),scale=Math.max(min,Math.min(max,Math.hypot(b.x-a.x,b.y-a.y)/m.distance));changed={...m.item,w:m.item.w*scale,h:m.item.h*scale,rotation:m.item.rotation+Math.atan2(b.y-a.y,b.x-a.x)-(m.angle||0)};}
   if(m.mode)changed=transformItem(m.item,m.start,pt,m.mode,state.current.drawing.width,state.current.drawing.height);m.changed=changed;paint();return;
  }
  if(draft.current){const events=[...(e.nativeEvent.getCoalescedEvents?.()||[]),e.nativeEvent];for(const ev of events){const next=point(ev),last=draft.current.points.at(-1)!;if(Math.hypot(next.x-last.x,next.y-last.y)>.5)draft.current.points.push(next);}paint();}
 };
 const up=(e:React.PointerEvent)=>{
  pointers.current.delete(e.pointerId);if(pointers.current.size)return;previewSerial.current++;
  const p=state.current,mark=draft.current,m=moving.current;cancelAnimationFrame(frame.current);
  if(mark)p.onChange(d=>({...d,marks:[...d.marks,mark]}));
  if(m?.changed)p.onChange({...m.original,marks:m.original.marks.map(o=>o.id===m.item.id?m.changed!:o)},m.original);
  draft.current=null;moving.current=null;setMovingPreview(null);art.current!.style.visibility='visible';
  // Keep the live stroke until the asynchronous committed render replaces it.
  if(!mark)live.current!.getContext('2d')!.clearRect(0,0,p.drawing.width,p.drawing.height);
 };
 const selected=movingPreview||p.drawing.marks.find(m=>m.id===p.selected) as Item|undefined;
 const handleDown=(e:React.PointerEvent<HTMLButtonElement>,mode:'scale'|'rotate')=>{
  e.preventDefault();e.stopPropagation();if(!selected||e.button!==0)return;
  e.currentTarget.setPointerCapture(e.pointerId);pointers.current.clear();const pt=point(e);pointers.current.set(e.pointerId,pt);state.current.onStart();
  const m:Move={original:state.current.drawing,item:{...selected},start:pt,mode};moving.current=m;
  void renderArt(document.createElement('canvas'),{...m.original,marks:m.original.marks.slice(0,m.original.marks.findIndex(i=>i.id===selected.id))}).then(c=>{if(moving.current===m){m.base=c;paint();}}).catch(state.current.onError);
 };
 return <div className="paper" style={{'--paper-ratio':p.drawing.width/p.drawing.height,aspectRatio:`${p.drawing.width}/${p.drawing.height}`} as React.CSSProperties}>
  <canvas ref={bg}/>{p.photo&&<div className="photo-layer" style={{opacity:p.photo.visible?p.photo.opacity:0}}><img draggable={false} src={p.photo.src} style={{left:`${p.photo.x/p.drawing.width*100}%`,top:`${p.photo.y/p.drawing.height*100}%`,width:`${p.photo.w/p.drawing.width*100}%`,height:`${p.photo.h/p.drawing.height*100}%`}}/></div>}
  <canvas ref={art} className="art-layer"/><canvas ref={live} width={p.drawing.width} height={p.drawing.height} aria-label="tekenblad" onContextMenu={e=>e.preventDefault()} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={reset}/>
  <Sparkles drawing={p.drawing} active={draft} activeTool={p.tool}/>{p.mirror&&<div className="mirror-guide"/>}
  {filling&&<div className="fill-status" role="status">de verf loopt…</div>}
  {selected&&<div className="selection" style={{left:`${selected.x/p.drawing.width*100}%`,top:`${selected.y/p.drawing.height*100}%`,width:`${selected.w/p.drawing.width*100}%`,height:`${selected.h/p.drawing.height*100}%`,minWidth:72,minHeight:72,transform:`translate(-50%,-50%) rotate(${selected.rotation}rad)`}}>{(['rotate','scale'] as const).map(mode=><button key={mode} className={`selection-handle ${mode}`} aria-label={mode==='scale'?'vorm schalen':'vorm draaien'} onPointerDown={e=>handleDown(e,mode)} onPointerMove={move} onPointerUp={up} onPointerCancel={reset} onKeyDown={e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const direction=e.key==='ArrowUp'||e.key==='ArrowRight'?1:-1;const changed=mode==='rotate'?{...selected,rotation:selected.rotation+direction*Math.PI/12}:transformItem(selected,{x:selected.x+100,y:selected.y},{x:selected.x+100*(direction>0?1.1:1/1.1),y:selected.y},'scale',p.drawing.width,p.drawing.height);p.onChange(d=>({...d,marks:d.marks.map(m=>m.id===changed.id?changed:m)}));}}><span aria-hidden="true">{mode==='rotate'?'↻':'↔'}</span></button>)}</div>}
 </div>;
}
