import {useEffect,useRef,useState} from 'react';
import type {Drawing,Sticker,ShapeName} from './model';
import {colors} from './model';
import {renderArt,shapePath} from './render';
import {mix} from './mixing';
import {Button,Modal,Icon} from './ui';
import {exportDrawing,download,share} from './export';
export const badges=['egel','uil','eekhoorn','blad','maan','ster'] as const;
export function Badge({name}:{name:string}){
 const cells:Record<string,number[]>={egel:[377,385,361,338],uil:[738,385,368,338],eekhoorn:[1106,385,342,338],blad:[0,723,377,363],maan:[738,723,368,363],ster:[1106,723,342,363]};
 return <svg aria-hidden="true" className="badge-art" viewBox={(cells[name]||cells.ster).join(' ')}><image href={import.meta.env.BASE_URL+'stickers/herfst/stickervel.png'} width="1448" height="1086"/></svg>;
}
export function BadgePicker({value,onChange,all=false}:{value:string;onChange:(v:string)=>void;all?:boolean}){return <div className="badge-picker" aria-label={all?'zoek jouw plaatje':'kies jouw plaatje'}>{all&&<button aria-label="alle tekeningen" aria-pressed={!value} onClick={()=>onChange('')}><Icon name="folder"/></button>}{badges.map(b=><button key={b} aria-label={`${all?'tekeningen van':'mijn plaatje'} ${b}`} aria-pressed={value===b} onClick={()=>onChange(b)}><Badge name={b}/></button>)}</div>;}
export function Artwork({drawing}:{drawing:Drawing}){const canvas=useRef<HTMLCanvasElement>(null);useEffect(()=>{let stopped=false;void renderArt(document.createElement('canvas'),drawing,.65,true).then(c=>{if(!stopped&&canvas.current){canvas.current.width=c.width;canvas.current.height=c.height;canvas.current.getContext('2d')!.drawImage(c,0,0);}});return()=>{stopped=true;};},[drawing]);return <canvas ref={canvas} className="artwork-preview" aria-label="jouw kunstwerk"/>;}
export function ColorMixer({custom,onUse,close}:{custom:string[];onUse:(c:string)=>void;close:()=>void}){
 const [a,setA]=useState<string|null>(null),[b,setB]=useState<string|null>(null),[phase,setPhase]=useState<'waiting'|'mixing'|'ready'>('waiting');
 useEffect(()=>{setPhase('waiting');if(!a||!b)return;const start=setTimeout(()=>setPhase('mixing'),500),end=setTimeout(()=>setPhase('ready'),1700);return()=>{clearTimeout(start);clearTimeout(end);};},[a,b]);
 const result=a&&b?mix(a,b):null;
 const choose=(first:boolean,color:string)=>{if((first?a:b)===color)return;setPhase('waiting');first?setA(color):setB(color);};
 return <Modal title="kleuren mengen" close={close}><div className={`mix-stage mix-${phase}`} aria-label={phase==='waiting'?'kies twee kleuren':phase==='mixing'?'kleuren worden gemengd':'mengkleur klaar'}><i className="paint-left" style={{background:a||'#f5eddf'}}>{!a&&'?'}</i><i className="paint-right" style={{background:b||'#f5eddf'}}>{!b&&'?'}</i>{result&&<i className="paint-result" style={{background:phase==='mixing'?`conic-gradient(${a},${b},${result},${a},${b},${result},${a})`:result}}/>}</div><div className="mix-palettes">{[true,false].map(first=><div className="palette" key={String(first)}>{[...colors,...custom].map((c,i)=><button key={i} aria-label={`${first?'eerste':'tweede'} mengkleur ${c}`} aria-pressed={(first?a:b)===c} className={`color ${(first?a:b)===c?'chosen':''}`} onClick={()=>choose(first,c)}><i style={{background:c}}/></button>)}</div>)}</div><div className="row mix-actions"><Button icon="kwast" label="met mengkleur tekenen" className="primary" disabled={phase!=='ready'} onClick={()=>result&&onUse(result)}>tekenen</Button></div></Modal>;
}
export function StampLibrary({stickers,color,onSticker,onShape}:{stickers:Sticker[];color:string;onSticker:(s:Sticker)=>void;onShape:(s:ShapeName)=>void}){
 const ref=useRef<HTMLDivElement>(null),[columns,setColumns]=useState(4);
 const count=stickers.length+3;
 useEffect(()=>{const el=ref.current!;const observer=new ResizeObserver(([entry])=>{const {width,height}=entry.contentRect;setColumns(Math.max(3,Math.ceil(Math.sqrt(count*width/Math.max(1,height)))));});observer.observe(el);return()=>observer.disconnect();},[count]);
 return <div ref={ref} className="stamp-library sticker-grid" style={{gridTemplateColumns:`repeat(${columns},minmax(0,1fr))`,gridTemplateRows:`repeat(${Math.ceil(count/columns)},minmax(0,1fr))`}}>{stickers.map(s=><button key={s.id} aria-label={s.name} title={s.name} onClick={()=>onSticker(s)}><img src={s.src} alt={s.name}/></button>)}{(['ster','hart','cirkel'] as const).map(shape=><button key={shape} aria-label={`stempel ${shape}`} onClick={()=>onShape(shape)}><ShapePreview shape={shape} color={color}/></button>)}</div>;
}
export function TeacherExport({drawing,close,error}:{drawing:Drawing;close:()=>void;error:(e:unknown)=>void}){
 const [prepared,setPrepared]=useState<{blob:Blob;name:string}|null>(null),[busy,setBusy]=useState(false);
 return <Modal title="kunstwerk bewaren of delen" close={close}><Artwork drawing={drawing}/><p>kies een bestandstype. de originele foto wordt nooit opgenomen.</p><div className="export-buttons">{(['png','jpg','pdf'] as const).map(f=><Button key={f} icon="download" label={`voorbereiden ${f}`} disabled={busy} onClick={()=>{setBusy(true);setPrepared(null);void exportDrawing(drawing,f).then(blob=>setPrepared({blob,name:`tekening.${f}`})).catch(error).finally(()=>setBusy(false));}}>{f.toUpperCase()}</Button>)}</div>{busy&&<p role="status">bestand wordt gemaakt…</p>}{prepared&&<div className="row"><Button icon="download" label={`download ${prepared.name.split('.').pop()}`} onClick={()=>download(prepared.blob,prepared.name)}>download</Button><Button icon="save" label="delen of bewaren in bestanden" onClick={()=>void share(prepared.blob,prepared.name).catch(error)}>delen / bestanden</Button></div>}</Modal>;
}

export function ShapePreview({shape,color='#b38b41'}:{shape:string;color?:string}){const ref=useRef<HTMLCanvasElement>(null);useEffect(()=>{const c=ref.current!,ctx=c.getContext('2d')!;ctx.clearRect(0,0,64,64);ctx.save();ctx.translate(32,32);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=3;ctx.lineJoin='round';shapePath(ctx,shape,45,shape==='rechthoek'||shape==='ovaal'?29:45);ctx.stroke();ctx.restore();},[shape,color]);return <canvas ref={ref} width={64} height={64} className="shape-preview" aria-hidden="true"/>;}
