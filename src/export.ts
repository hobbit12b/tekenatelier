import {zipSync} from 'fflate';
import {cleanDrawing,type Drawing} from './model';
import {renderArt} from './render';
export async function preview(d:Drawing){return (await renderArt(document.createElement('canvas'),cleanDrawing(d),.25,true)).toDataURL('image/png');}
export async function exportDrawing(d:Drawing,format:'png'|'jpg'|'pdf'):Promise<Blob>{const c=await renderArt(document.createElement('canvas'),cleanDrawing(d),3508/d.width,true);if(format==='pdf'){const {jsPDF}=await import('jspdf');const pdf=new jsPDF({orientation:d.width>=d.height?'landscape':'portrait',unit:'mm',format:'a4'});const pw=pdf.internal.pageSize.getWidth(),ph=pdf.internal.pageSize.getHeight(),scale=Math.min((pw-16)/d.width,(ph-16)/d.height),w=d.width*scale,h=d.height*scale;pdf.addImage(c.toDataURL('image/jpeg',.95),'JPEG',(pw-w)/2,(ph-h)/2,w,h);return pdf.output('blob');}return new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(Error('exporteren is niet gelukt')),format==='jpg'?'image/jpeg':'image/png',.95));}
export async function exportZip(drawings:Drawing[]){const files:Record<string,Uint8Array>={};for(let i=0;i<drawings.length;i++)files[`tekening_${String(i+1).padStart(3,'0')}.png`]=new Uint8Array(await (await exportDrawing(drawings[i],'png')).arrayBuffer());return new Blob([zipSync(files) as BlobPart],{type:'application/zip'});}
export async function exportPrintPdf(drawings:Drawing[]):Promise<Blob>{
 if(!drawings.length)throw Error('selecteer eerst een tekening');
 const {jsPDF}=await import('jspdf');
 const pdf=new jsPDF({orientation:'landscape',unit:'mm',format:'a4',compress:true});
 for(let i=0;i<drawings.length;i++){
  if(i)pdf.addPage('a4','landscape');
  const d=cleanDrawing(drawings[i]),c=await renderArt(document.createElement('canvas'),d,2400/d.width,true);
  const scale=Math.min(281/d.width,194/d.height),w=d.width*scale,h=d.height*scale;
  pdf.addImage(c.toDataURL('image/jpeg',.9),'JPEG',(297-w)/2,(210-h)/2,w,h);
 }
 const blob=pdf.output('blob');if(blob.size>40*1024*1024)throw Error('de pdf is te groot voor Ricoh. selecteer minder tekeningen.');return blob;
}
export function download(blob:Blob,name:string){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
export async function share(blob:Blob,name:string){const file=new File([blob],name,{type:blob.type});if(navigator.canShare?.({files:[file]})){await navigator.share({files:[file]});}else download(blob,name);}
