import {useEffect,useRef,useState} from 'react';
import type {Drawing} from './model';
import {exportDrawing,share} from './export';
import {Button,Modal} from './ui';
export function PrintDialog({drawings,close,error}:{drawings:Drawing[];close:()=>void;error:(e:unknown)=>void}){
 const [format,setFormat]=useState<'jpg'|'png'|'pdf'>('jpg');
 const [files,setFiles]=useState<{blob:Blob;name:string}[]>([]),[busy,setBusy]=useState(true);
 const reportError=useRef(error);reportError.current=error;
 useEffect(()=>{
  let cancelled=false;
  setBusy(true);setFiles([]);
  void (async()=>{
   const prepared=[];
   for(const [i,drawing] of drawings.entries()){
    const safe=(drawing.name||'tekening').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60)||'tekening';
    prepared.push({blob:await exportDrawing(drawing,format),name:`${String(i+1).padStart(3,'0')}-${safe}.${format}`});
    if(cancelled)return;
   }
   if(!cancelled)setFiles(prepared);
  })().catch(e=>{if(!cancelled)reportError.current(e);}).finally(()=>{if(!cancelled)setBusy(false);});
  return ()=>{cancelled=true;};
 },[drawings,format]);
 return <Modal title="afdrukken via ricoh" close={close}>
  <p>{drawings.length} {drawings.length===1?'tekening':'tekeningen'}, één bestand per tekening. Tijdelijke foto’s worden niet meegenomen.</p>
  <label>bestandstype <select aria-label="bestandstype voor afdrukken" value={format} onChange={e=>{setFiles([]);setBusy(true);setFormat(e.target.value as typeof format);}}><option value="jpg">JPG</option><option value="png">PNG</option><option value="pdf">PDF</option></select></label>
  <p>Bewaar de bestanden en open daarna Ricoh om ze te kiezen. Gebruik JPG of PNG als de printer alleen afbeeldingen accepteert.</p>
  {busy&&<p role="status">bestanden worden klaargezet…</p>}
  {drawings.map((drawing,i)=><div className="row" key={drawing.id}>{drawings.length>1&&<span>{drawing.name||'mijn tekening'}</span>}<Button icon="save" label={drawings.length===1?'bewaar in bestanden':`bewaar ${drawing.name||'mijn tekening'} in bestanden`} disabled={busy||!files[i]} onClick={()=>void share(files[i].blob,files[i].name).catch(error)}>bewaar in bestanden</Button></div>)}
  <a className="btn" href="https://www.eu.smart-integration.ricoh.com/print-site/" target="_blank" rel="noopener noreferrer">open ricoh</a>
 </Modal>;
}
