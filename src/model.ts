export type Tool = 'potlood'|'stift'|'kwast'|'wasco'|'glitter'|'gum'|'vullen'|'selectie'|'stempel';
export type Point = {x:number;y:number;pressure?:number};
export type Stroke = {kind:'stroke';id:string;tool:Tool;color:string;width:number;points:Point[];mirror:boolean;wet?:boolean;dryBrush?:boolean;grain?:boolean};
export type ShapeName = 'cirkel'|'vierkant'|'rechthoek'|'driehoek'|'ovaal'|'ruit'|'zeshoek'|'ster'|'hart'|'lijn';
export type Item = {kind:'shape'|'text'|'sticker';id:string;x:number;y:number;w:number;h:number;rotation:number;color:string;filled:boolean;shape?:ShapeName;text?:string;font?:string;src?:string};
export type Fill = {kind:'fill';id:string;src:string};
export type Mark = Stroke|Item|Fill;
export type Drawing = {version:1;id:string;name:string;badge?:string;created:number;updated:number;width:number;height:number;background:string;marks:Mark[];colors:string[];status:'draft'|'finished'};
export type Photo = {src:string;x:number;y:number;w:number;h:number;opacity:number;visible:boolean};
export type Envelope = {salt:number[];iv:number[];cipher:number[]};
export type RecordData = {id:string;updated:number;private:boolean;drawing?:Drawing;sealed?:Envelope;thumbnail?:string};
export type Sticker = {id:string;name:string;theme:string;src:string;enabled:boolean};
export type Settings = {themes:string[];tools:Tool[];background:string;size:string;sound:boolean;challenge:boolean;code?:Envelope};
export const tools:Tool[]=['potlood','stift','kwast','wasco','glitter','gum','vullen'];
export const defaults:Settings={themes:['herfst'],tools,background:'#ffffff',size:'landschap',sound:false,challenge:false};
export const colors=['#e5554f','#ec9146','#f1c83c','#90b45b','#348568','#74bbd4','#3d6cbb','#8960a8','#dd85a0','#925e43','#293c3a','#ffffff','#9baba8','#f1d0b4','#c58c68','#704b3c'];
export const widths=[3,7,13,23,38];
export const shapeNames:ShapeName[]=['cirkel','vierkant','rechthoek','driehoek','ovaal','ruit','zeshoek','ster','hart','lijn'];
export const themes=[
 {id:'herfst',name:'herfst in het heksenbos',challenge:'teken een bos voor de egel',assets:['heks','heksenhoed','bezem','heksenketel','toverboek','toverstaf','paddenstoel','eikel','kastanje','herfstblad','egel','uil','spin','vleermuis','eekhoorn','boom','maan','toverster']},
 {id:'sinterklaas',name:'sinterklaas',challenge:'teken een feestelijke stoomboot',assets:['sinterklaas','mijter','staf','paard','cadeautje','schoen','wortel','pepernoot','chocoladeletter','stoomboot','feestmuts','verlanglijstje','zak met cadeautjes','schoorsteen','pakjesstapel']},
 {id:'kerst',name:'kerst',challenge:'versier een kerstboom',assets:['kerstboom','kerstbal','kerstster','cadeau','sneeuwpop','kerstmuts','rendier','kerstman','slee','kerstkrans','kaars','kerstbel','sneeuwvlok','lichtjesslinger','kerstkoekje']},
 {id:'piraten',name:'piraten',challenge:'maak een schatkaart',assets:['piraat','piratenhoed','piratenschip','schatkist','gouden munt','schatkaart','papegaai','ooglapje','piratenvlag','anker','stuurwiel','eiland','palmboom','kanon','verrekijker']},
 {id:'restaurant',name:'restaurant',challenge:'ontwerp een pizza',assets:['kok','koksmuts','pan','bord','vork','lepel','mes','pizza','taart','ijsje','hamburger','tomaat','wortel','appel','menukaart','dienblad','drinkglas','waterkan']},
 {id:'sprookjes',name:'sprookjes',challenge:'teken een kasteel voor de draak',assets:['kasteel','prinses','prins','ridder','draak','kroon','fee','toverstaf','kabouter','wolf','roodkapje','magische spiegel','toverboom','kikker','paddenstoel','schatkist','toren']},
 {id:'beestjes',name:'kriebelbeestjes',challenge:'maak een tuin voor de kriebelbeestjes',assets:['lieveheersbeestje','vlinder','mier','spin','bij','rups','slak','regenworm','kever','sprinkhaan','libel','vlieg','duizendpoot','bloem','blad']},
 {id:'winter',name:'winter',challenge:'teken jouw winterwereld',assets:['sneeuwvlok','sneeuwpop','want','muts','sjaal','slee','schaats','ijspegel','winterboom','pinguïn','ijsbeer','sneeuwbal','bevroren vijver','vogel in de sneeuw','winterjas']}
];
export const uid=()=>crypto.randomUUID();
export function createDrawing(settings=defaults):Drawing {return {version:1,id:uid(),name:'mijn tekening',created:Date.now(),updated:Date.now(),width:settings.size==='vierkant'?900:1200,height:settings.size==='vierkant'?900:848,background:settings.background,marks:[],colors:[],status:'draft'};}
export function validateDrawing(value:unknown):Drawing {const d=value as Drawing;if(!d||d.version!==1||!d.id||!Array.isArray(d.marks)||d.marks.length>20000||!Number.isFinite(d.width)||d.width<1||d.width>4000||!Number.isFinite(d.height)||d.height<1||d.height>4000)throw Error('dit project is beschadigd of heeft een onbekende versie');return d;}
// Explicit allowlist: photo fields can never become part of export or public storage.
export function cleanDrawing(d:Drawing):Drawing {return {version:1,id:d.id,name:d.name,...(['egel','uil','eekhoorn','blad','maan','ster'].includes(d.badge||'')?{badge:d.badge}:{}),created:d.created,updated:d.updated,width:d.width,height:d.height,background:d.background,marks:structuredClone(d.marks),colors:[...d.colors],status:d.status};}
