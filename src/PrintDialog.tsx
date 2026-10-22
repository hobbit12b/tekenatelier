import {useState} from 'react';
import type {Drawing} from './model';
import {exportDrawing,download,share} from './export';
import {Button,Modal} from './ui';
export function PrintDialog({drawings,close,error}:{drawings:Drawing[];close:()=>void;error:(e:unknown)=>void}){
 const [images,setImages]=useState<{blob:Blob;name:string;title:string}[]>([]),[busy,setBusy]=useState(false);
 async function prepare(){
  setBusy(true);
  try{
   const prepared=[];
   for(const [i,drawing] of drawings.entries()){
    const title=drawing.name||'mijn tekening',safe=title.replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60)||'tekening';
    prepared.push({blob:await exportDrawing(drawing,'jpg'),name:`${String(i+1).padStart(3,'0')}-${safe}.jpg`,title});
   }
   setImages(prepared);
  }catch(e){error(e);}finally{setBusy(false);}
 }
 return <Modal title="afdrukken via ricoh" close={close}>
  <p>{drawings.length} {drawings.length===1?'tekening':'tekeningen'}, één JPG-afbeelding per tekening. Tijdelijke foto’s worden niet meegenomen.</p>
  <ol><li>Maak de afbeeldingen en bewaar ze in bestanden of downloads.</li><li>Open Ricoh, meld je aan met je schoolaccount en kies de JPG-bestanden bij de printer.</li><li>Kies het papierformaat en pas de afbeelding op de pagina. Geef de afdruk vrij volgens de afspraken op school.</li></ol>
  {!images.length&&<Button icon="download" label="afdrukafbeeldingen maken" disabled={busy||!drawings.length} onClick={()=>void prepare()}>{busy?'afbeeldingen worden gemaakt…':'afbeeldingen maken'}</Button>}
  {images.map(image=><div className="row" key={image.name}><span>{image.title}</span><Button icon="download" label={`download ${image.name}`} onClick={()=>download(image.blob,image.name)}>JPG downloaden</Button><Button icon="save" label={`bewaar ${image.name} in bestanden`} onClick={()=>void share(image.blob,image.name).catch(error)}>bewaar in bestanden</Button></div>)}
  {!!images.length&&<a className="btn" href="https://www.eu.smart-integration.ricoh.com/print-site/" target="_blank" rel="noopener noreferrer">open ricoh</a>}
 </Modal>;
}
