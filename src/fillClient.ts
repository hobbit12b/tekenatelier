import {fillPixels} from './fill';
export function calculateFill(data:Uint8ClampedArray,width:number,height:number,x:number,y:number,rgb:number[]):Promise<Uint8ClampedArray<ArrayBuffer>>{
 if(typeof Worker==='undefined')return Promise.resolve(fillPixels(data,width,height,x,y,rgb));
 return new Promise((resolve,reject)=>{
  const worker=new Worker(new URL('./fill.worker.ts',import.meta.url),{type:'module'});
  const done=()=>{clearTimeout(timeout);worker.terminate();};
  const timeout=setTimeout(()=>{done();reject(Error('vullen duurde te lang. probeer een kleiner vlak.'));},20000);
  worker.onmessage=({data:result})=>{done();if(result.error)reject(Error(result.error));else resolve(result.out);};
  worker.onerror=()=>{done();reject(Error('vullen is niet gelukt. probeer opnieuw.'));};
  worker.postMessage({data,width,height,x,y,rgb},[data.buffer]);
 });
}

