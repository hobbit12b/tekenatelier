import {useEffect,useRef,useState} from 'react';
import type {Drawing} from './model';
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
 const [a,setA]=useState(colors[2]),[b,setB]=useState(colors[6]),[round,setRound]=useState(0),[ready,setReady]=useState(false);
 useEffect(()=>{setReady(false);const t=setTimeout(()=>setReady(true),850);return()=>clearTimeout(t);},[a,b,round]);
 return <Modal title="een beetje kleurmagie" close={close}><p>kies twee kleuren. wat zou er gebeuren?</p><div className="mix-stage" key={a+b+round} aria-label="twee kleuren worden één"><i className="paint-left" style={{background:a}}/><i className="paint-right" style={{background:b}}/><i className="paint-result" style={{background:mix(a,b)}}/><Icon name="mix" size={70}/></div><div className="mix-palettes">{[true,false].map(first=><div className="palette" key={String(first)}>{[...colors,...custom].map((c,i)=><button key={i} aria-label={`${first?'eerste':'tweede'} mengkleur ${c}`} aria-pressed={(first?a:b)===c} className={`color ${(first?a:b)===c?'chosen':''}`} onClick={()=>first?setA(c):setB(c)}><i style={{background:c}}/></button>)}</div>)}</div><div className="row mix-actions"><Button icon="mix" label="nog eens mengen" onClick={()=>setRound(r=>r+1)}>mengen</Button><Button icon="kwast" label="met mengkleur tekenen" className="primary" disabled={!ready} onClick={()=>onUse(mix(a,b))}>tekenen</Button></div></Modal>;
}
export function TeacherExport({drawing,close,error}:{drawing:Drawing;close:()=>void;error:(e:unknown)=>void}){
 const [prepared,setPrepared]=useState<{blob:Blob;name:string}|null>(null),[busy,setBusy]=useState(false);
 return <Modal title="kunstwerk bewaren of delen" close={close}><Artwork drawing={drawing}/><p>kies een bestandstype. de originele foto wordt nooit opgenomen.</p><div className="export-buttons">{(['png','jpg','pdf'] as const).map(f=><Button key={f} icon="download" label={`voorbereiden ${f}`} disabled={busy} onClick={()=>{setBusy(true);setPrepared(null);void exportDrawing(drawing,f).then(blob=>setPrepared({blob,name:`tekening.${f}`})).catch(error).finally(()=>setBusy(false));}}>{f.toUpperCase()}</Button>)}</div>{busy&&<p role="status">bestand wordt gemaakt…</p>}{prepared&&<div className="row"><Button icon="download" label={`download ${prepared.name.split('.').pop()}`} onClick={()=>download(prepared.blob,prepared.name)}>download</Button><Button icon="save" label="delen of bewaren in bestanden" onClick={()=>void share(prepared.blob,prepared.name).catch(error)}>delen / bestanden</Button></div>}</Modal>;
}

export function ShapePreview({shape,color='#b38b41'}:{shape:string;color?:string}){const ref=useRef<HTMLCanvasElement>(null);useEffect(()=>{const c=ref.current!,ctx=c.getContext('2d')!;ctx.clearRect(0,0,64,64);ctx.save();ctx.translate(32,32);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=3;ctx.lineJoin='round';shapePath(ctx,shape,45,shape==='rechthoek'||shape==='ovaal'?29:45);ctx.stroke();ctx.restore();},[shape,color]);return <canvas ref={ref} width={64} height={64} className="shape-preview" aria-hidden="true"/>;}
