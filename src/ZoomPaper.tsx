import {useEffect,useLayoutEffect,useRef,useState,type ReactNode} from 'react';

import {Icon} from './ui';

function ZoomIcon({kind}:{kind:'plus'|'minus'|'fit'|'hand'}){
 if(kind==='hand')return <svg viewBox="0 0 44 44" width="38" height="38" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round"><path d="M12 24V13q0-4 4-3V7q1-5 5-2v4q4-3 5 1v3q4-2 5 2v12q-1 7-8 10h-5q-5-2-7-6l-6-8q-1-4 3-3Z" fill="#f3c894" stroke="#c88e59" strokeWidth="1.4"/><path d="M16 11v11M21 10v11M26 14v9M15 27q5-3 9 1" fill="none" stroke="#dca46e" strokeWidth="1.2"/><path d="M13 16v6M18 9v10M23 13v7M28 17v6" fill="none" stroke="#ffe5ba" strokeWidth="1.6"/><path d="m14 35 14-1 1 7-15 1Z" fill="#85bfc9" stroke="#639daa"/><path d="m17 37 8-1" stroke="#c0e1da"/></svg>;
 if(kind==='fit')return <img src={import.meta.env.BASE_URL+'art/fit-page-spaced.webp'} width="38" height="38" alt="" draggable={false}/>;
 return <span className="zoom-glass"><svg viewBox="0 0 44 44" aria-hidden="true"><path d="m28 29 10 10" stroke="#b98b59" strokeWidth="9" strokeLinecap="round"/><path d="m28 28 10 10" stroke="#efbf7c" strokeWidth="6" strokeLinecap="round"/><path d="m30 29 7 7" stroke="#ffe3ad" strokeWidth="1.4"/><path d="M32 17c1 9-5 16-14 16S2 27 3 18 8 3 17 3 31 7 32 17Z" fill="#b9dfdf" stroke="#79b7b5" strokeWidth="2"/><circle cx="17.5" cy="18" r="11" fill="#f5fcf3"/><path d="M7 16Q8 7 17 6" fill="none" stroke="#e5f4df" strokeWidth="2.5" strokeLinecap="round"/></svg><Icon name={kind} size={23}/></span>;
}
export function ZoomPaper({ratio,tool,children}:{ratio:number;tool:string;children:ReactNode}){
 const view=useRef<HTMLDivElement>(null),drag=useRef<{x:number;y:number;left:number;top:number}|null>(null);
 const focus=useRef<{x:number;y:number}|null>(null);
 useEffect(()=>setPan(false),[tool]);
 const [zoom,setZoom]=useState(1),[pan,setPan]=useState(false),[bounds,setBounds]=useState({w:1,h:1});
 useEffect(()=>{const el=view.current!;const observer=new ResizeObserver(()=>setBounds({w:el.clientWidth,h:el.clientHeight}));observer.observe(el);return()=>observer.disconnect();},[]);
 const width=Math.max(1,Math.min(bounds.w-28,(bounds.h-28)*ratio))*zoom,height=width/ratio;
 useLayoutEffect(()=>{const el=view.current,f=focus.current;if(el&&f){el.scrollTo(f.x*el.scrollWidth-el.clientWidth/2,f.y*el.scrollHeight-el.clientHeight/2);focus.current=null;}},[zoom]);
 useLayoutEffect(()=>{
  const el=view.current,studio=el?.closest<HTMLElement>('.studio'),sheet=el?.querySelector<HTMLElement>('.zoom-sheet');
  if(!el||!studio||!sheet)return;
  const update=()=>{const v=el.getBoundingClientRect(),r=sheet.getBoundingClientRect(),s=studio.getBoundingClientRect();const center=(Math.max(v.top,r.top)+Math.min(v.bottom,r.bottom))/2-s.top;studio.style.setProperty('--paper-middle',`${center}px`);};
  update();el.addEventListener('scroll',update);return()=>el.removeEventListener('scroll',update);
 },[bounds,zoom]);
 const changeZoom=(value:number)=>{const el=view.current!;focus.current={x:(el.scrollLeft+el.clientWidth/2)/el.scrollWidth,y:(el.scrollTop+el.clientHeight/2)/el.scrollHeight};setZoom(Math.max(.5,Math.min(3,value)));};
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
