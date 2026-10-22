import {useState} from 'react';
import type {Drawing} from './model';
import {exportPrintPdf,download,share} from './export';
import {Button,Modal} from './ui';
export function PrintDialog({drawings,close,error}:{drawings:Drawing[];close:()=>void;error:(e:unknown)=>void}){
 const [pdf,setPdf]=useState<Blob|null>(null),[busy,setBusy]=useState(false);
 return <Modal title="afdrukken via ricoh" close={close}>
  <p>{drawings.length} {drawings.length===1?'tekening':'tekeningen'}, één tekening per A4-pagina. Tijdelijke foto’s worden niet meegenomen.</p>
  <ol><li>Maak de afdruk-pdf en bewaar deze in bestanden of downloads.</li><li>Open Ricoh, meld je aan met je schoolaccount en upload de pdf.</li><li>Geef de afdruk vrij bij de printer volgens de afspraken op school.</li></ol>
  <p>Er wordt vanuit tekenatelier niets automatisch verstuurd.</p>
  {!pdf&&<Button icon="download" label="afdruk-pdf maken" disabled={busy} onClick={()=>{setBusy(true);void exportPrintPdf(drawings).then(setPdf).catch(error).finally(()=>setBusy(false));}}>{busy?'pdf wordt gemaakt…':'afdruk-pdf maken'}</Button>}
  {pdf&&<div className="row"><Button icon="download" label="afdruk-pdf downloaden" onClick={()=>download(pdf,'tekenatelier-print.pdf')}>pdf downloaden</Button><Button icon="save" label="afdruk-pdf bewaren in bestanden" onClick={()=>void share(pdf,'tekenatelier-print.pdf').catch(error)}>bewaar in bestanden</Button><a className="btn" href="https://www.eu.smart-integration.ricoh.com/print-site/" target="_blank" rel="noopener noreferrer">open ricoh</a></div>}
 </Modal>;
}
