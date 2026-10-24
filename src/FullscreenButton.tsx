import {useEffect,useState} from 'react';
import {Icon,Modal} from './ui';

type FullDocument=Document&{webkitFullscreenElement?:Element;webkitExitFullscreen?:()=>Promise<void>};
type FullElement=HTMLElement&{webkitRequestFullscreen?:()=>Promise<void>};
export function FullscreenButton(){
 const [active,setActive]=useState(false),[help,setHelp]=useState(false);
 useEffect(()=>{const sync=()=>setActive(!!(document.fullscreenElement||(document as FullDocument).webkitFullscreenElement));sync();document.addEventListener('fullscreenchange',sync);document.addEventListener('webkitfullscreenchange',sync);return()=>{document.removeEventListener('fullscreenchange',sync);document.removeEventListener('webkitfullscreenchange',sync);};},[]);
 async function toggle(){
  const doc=document as FullDocument,root=document.documentElement as FullElement;
  try{
   if(doc.fullscreenElement)await doc.exitFullscreen();
   else if(doc.webkitFullscreenElement)await doc.webkitExitFullscreen?.();
   else if(root.requestFullscreen&&doc.fullscreenEnabled)await root.requestFullscreen();
   else if(root.webkitRequestFullscreen)await root.webkitRequestFullscreen();
   else setHelp(true);
  }catch{setHelp(true);}
 }
 return <><button className={`btn fullscreen-button ${active?'active':''}`} aria-label={active?'beeldvullend sluiten':'spel beeldvullend maken'} title={active?'beeldvullend sluiten':'spel beeldvullend maken'} aria-pressed={active} onClick={()=>void toggle()}><span className="fullscreen-symbol"><Icon name="selectie" size={35}/></span></button>{help&&<Modal title="beeldvullend spelen" close={()=>setHelp(false)}><p>Deze browser kan het spel hier niet beeldvullend openen.</p><p>Op de iPad: open tekenatelier in Safari en kies via delen ‘zet op beginscherm’. Open het spel daarna met dat pictogram.</p><p>Op een computer kun je ook de beeldvullende stand in het browsermenu gebruiken.</p></Modal>}</>;
}
