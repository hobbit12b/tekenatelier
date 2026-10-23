import {useEffect,useRef,useState,type ReactNode} from 'react';

function ZoomIcon({kind}:{kind:'plus'|'minus'|'fit'|'hand'}){
 return <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
  {kind==='plus'||kind==='minus'?<><circle cx="13" cy="13" r="9" fill="#fffaf0"/><path d="m20 20 8 8M9 13h8"/>{kind==='plus'&&<path d="M13 9v8"/>}</>:kind==='fit'?<><rect x="8" y="6" width="16" height="20" rx="2" fill="#fffaf0"/><path d="M3 10V3h7M22 3h7v7M29 22v7h-7M10 29H3v-7"/></>:<path fill="#fff0d4" d="M9 17V9q0-4 4-2V5q2-3 4 0v2q4-2 4 2v2q4-1 4 3v9q-1 6-8 6h-2q-4-1-6-5l-5-7q0-4 3-2l2 2ZM13 7v9M17 7v9M21 11v6"/>}
 </svg>;
}
export function ZoomPaper({ratio,children}:{ratio:number;children:ReactNode}){
 const view=useRef<HTMLDivElement>(null),drag=useRef<{x:number;y:number;left:number;top:number}|null>(null);
 const [zoom,setZoom]=useState(1),[pan,setPan]=useState(false),[bounds,setBounds]=useState({w:1,h:1});
 useEffect(()=>{const el=view.current!;const observer=new ResizeObserver(()=>setBounds({w:el.clientWidth,h:el.clientHeight}));observer.observe(el);return()=>observer.disconnect();},[]);
 const width=Math.max(1,Math.min(bounds.w-28,(bounds.h-28)*ratio))*zoom,height=width/ratio;
 const changeZoom=(value:number)=>{setZoom(Math.max(.5,Math.min(3,value)));};
 return <div className="zoom-paper">
  <div className="zoom-controls" role="group" aria-label="inzoomen en uitzoomen">
   <button className="btn" aria-label="uitzoomen" title="uitzoomen" disabled={zoom<=.5} onClick={()=>changeZoom(zoom-.25)}><ZoomIcon kind="minus"/></button>
   <output aria-label="zoompercentage">{Math.round(zoom*100)}%</output>
   <button className="btn" aria-label="inzoomen" title="inzoomen" disabled={zoom>=3} onClick={()=>changeZoom(zoom+.25)}><ZoomIcon kind="plus"/></button>
   <button className="btn" aria-label="hele vel tonen" title="hele vel tonen" onClick={()=>{setZoom(1);setPan(false);view.current?.scrollTo(0,0);}}><ZoomIcon kind="fit"/></button>
   <button className={`btn ${pan?'active':''}`} aria-label="vel verschuiven" title="vel verschuiven" aria-pressed={pan} onClick={()=>setPan(!pan)}><ZoomIcon kind="hand"/></button>
  </div>
  <div className="zoom-viewport" ref={view}>
   <div className="zoom-space" style={{width:Math.max(bounds.w,width+28),height:Math.max(bounds.h,height+28)}}>
    <div className="zoom-sheet" style={{width,height}}>{children}
     {pan&&<div className="pan-cover" aria-label="sleep om het vel te verschuiven" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);drag.current={x:e.clientX,y:e.clientY,left:view.current!.scrollLeft,top:view.current!.scrollTop};}} onPointerMove={e=>{const d=drag.current;if(d)view.current!.scrollTo(d.left+d.x-e.clientX,d.top+d.y-e.clientY);}} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}/>}
    </div>
   </div>
  </div>
 </div>;
}
