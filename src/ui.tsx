const actions=import.meta.env.BASE_URL+'art/actions.png';
const materials=['potlood','stift','kwast','wasco','glitter','gum'] as const;
const illustrated=['vullen','mix','home','shapes','stickers','stempel','text','selectie','undo','redo','check','close','back','next','plus','minus','rotate','copy','delete','settings','lock','eye','hidden','download','upload','camera','folder','mirror','background','play','save','book','sound','mute','palette'] as const;
export type IconName=typeof materials[number]|typeof illustrated[number];
export function ToolChoiceArt({mode}:{mode:'close'|'flow'|'erase'|'clear'}){
 const fill=mode==='close'||mode==='flow';
 return <svg aria-hidden="true" viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round">
  <path d="M8 6 49 8 56 17 54 57 7 55Z" fill="#fffdf5" stroke="#d4c4a5" strokeWidth="2"/>
  {fill?<>
   {mode==='flow'&&<path d="M38 19Q58 13 57 30L55 51Q42 58 14 50L12 31Q20 24 38 19" fill="#f6c64a" opacity=".8"/>}
   <path d="M36 20Q20 13 16 29Q11 47 29 48Q47 51 47 34L44 28Q41 23 36 20" fill="#f4c642"/>
   <path d="M34 18Q17 12 14 30Q10 49 30 50Q50 52 49 32" stroke="#538d85" strokeWidth="4"/>
   {mode==='close'?<path d="M38 20 47 27" stroke="#538d85" strokeWidth="4" strokeDasharray="2 5"/>:<path d="m38 25 14-7m-6 0 6 0-2 6" stroke="#be7c26" strokeWidth="3"/>}
  </>:mode==='erase'?<>
   <path d="m13 42 9-11 2 16m-10-9 10 1m13 8 7-11 5 12" stroke="#73a4c6" strokeWidth="4"/>
   <path d="m22 35 12-17q3-4 7-1l9 7q3 3 0 6L38 46Z" fill="#ef9f9f" stroke="#c77f83" strokeWidth="2"/>
   <path d="m22 35 9-12 16 12-9 11Z" fill="#f6dfc0"/>
   <path d="m29 51 13 1" stroke="#d9c4a0" strokeWidth="2"/>
  </>:<>
   <path d="m29 21 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill="#f2c44d"/>
   <path d="m46 12 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#83b9a5"/>
   <path d="m14 45 1 4 4 1-4 1-1 4-1-4-4-1 4-1Z" fill="#e8ad6c"/>
  </>}
 </svg>;
}
export function Icon({name,size=25}:{name:IconName;size?:number}){
 const tool=materials.indexOf(name as typeof materials[number]);
 if(tool>=0)return <span aria-hidden="true" className={`tool-art tool-art-${tool}`} style={{backgroundPosition:`${(tool%3)*50}% ${Math.floor(tool/3)*100}%`}}/>;
 const index=illustrated.indexOf(name as typeof illustrated[number]);
 const columns=[0,213,431,635,848,1064,1254],rows=[0,249,448,638,841,1042,1254],col=index%6,row=Math.floor(index/6);
 const crops:Record<string,number[]>={vullen:[5,20,205,224],mix:[218,40,211,198],home:[439,30,193,207],shapes:[650,35,190,205],stickers:[854,30,197,210],stempel:[1077,30,170,215],background:[857,845,196,191]};
 const rect=crops[name]||[columns[col],rows[row],columns[col+1]-columns[col],rows[row+1]-rows[row]];
 return <svg aria-hidden="true" className={`crayon-icon crayon-icon-${name}`} width={size} height={size} viewBox={rect.join(" ")}><image href={actions} width="1254" height="1254"/></svg>;
}
export function Button({icon,label,onClick,active=false,disabled=false,className='',children}:{icon?:IconName;label:string;onClick:()=>void;active?:boolean;disabled?:boolean;className?:string;children?:React.ReactNode}){return <button aria-label={label} title={label} aria-pressed={active} disabled={disabled} onClick={onClick} className={`btn ${active?'active':''} ${className}`}>{icon&&<Icon name={icon}/>} {children}</button>;}
export function Modal({title,close,children}:{title:string;close:()=>void;children:React.ReactNode}){return <div className="scrim" onClick={close}><section className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={e=>e.stopPropagation()}><header><h2>{title}</h2><Button icon="close" label="sluiten" onClick={close}/></header>{children}</section></div>;}
export function Brand(){return <span className="brand" aria-label="tekenatelier">{Array.from('tekenatelier').map((letter,i)=><span key={i} style={{color:['#e97b64','#e5ac36','#55a897','#699fc2','#b081b3'][i%5],transform:`rotate(${[-4,2,-2,3,0][i%5]}deg)`}}>{letter}</span>)}<i/></span>;}
export function ArtCard({type}:{type:'new'|'photo'|'gallery'}){const index={new:0,photo:1,gallery:2}[type];return <div className={`card-art ${type}`} aria-hidden="true"><div className="picture-sprite" style={{backgroundPosition:`${index*50}% 0%`}}/></div>;}




