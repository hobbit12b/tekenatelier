const actions=import.meta.env.BASE_URL+'art/actions.png';
const materials=['potlood','stift','kwast','wasco','glitter','gum'] as const;
const illustrated=['vullen','mix','home','shapes','stickers','stempel','text','selectie','undo','redo','check','close','back','next','plus','minus','rotate','copy','delete','settings','lock','eye','hidden','download','upload','camera','folder','mirror','background','play','save','book','sound','mute','palette'] as const;
export type IconName=typeof materials[number]|typeof illustrated[number];
export function ToolChoiceArt({mode}:{mode:'close'|'flow'|'wide'|'erase'|'clear'}){
 const fill=mode==='close'||mode==='flow'||mode==='wide';
 return <svg className={`choice-demo choice-${mode}`} aria-hidden="true" viewBox="0 0 80 72" fill="none" strokeLinecap="round" strokeLinejoin="round">
  <rect className="demo-paper" x="4" y="4" width="72" height="64" rx="7" fill="#fffdf5" stroke="#cbbd9f" strokeWidth="2"/>
  {fill?<>
   <circle className="demo-fill" cx="34" cy="38" r="21" fill="#52b8e8"/>
   {mode!=='flow'?<path d={mode==='wide'?'M41.9 16.4A23 23 0 1 0 55.6 30.1':'M47.2 19.2A23 23 0 1 0 52.8 24.8'} stroke="#394c57" strokeWidth="4"/>:<circle cx="34" cy="38" r="23" stroke="#394c57" strokeWidth="4"/>}
  </>:<>
   <g className="demo-drawing">
    <path d="m14 40 18-16 18 16M19 39v19h26V39" stroke="#e87e5f" strokeWidth="4"/>
    <path className="demo-door" d="M29 57V46h8v11" stroke="#a576b1" strokeWidth="4"/>
    <circle cx="59" cy="21" r="6" fill="#f2c63f"/>
    <path d="m14 61 48-1" stroke="#81b270" strokeWidth="4"/>
   </g>
   {mode==='erase'&&<g className="demo-eraser" stroke="#b26d78" strokeWidth="1.5">
    <path d="m29 38 12-15q2-2 4 0l4 3q2 2 0 4L37 45Z" fill="#ee9ca9"/>
    <path d="m29 38 5-6 8 7-5 6Z" fill="#f7dfad"/>
   </g>}
   {mode==='clear'&&<>
    <g className="demo-magic" fill="white" stroke="none">
     {[[16,23,4],[28,9,3],[39,26,5],[52,13,4],[64,27,3],[24,35,3],[53,35,4],[10,12,2],[68,8,2]].map(([x,y,r],i)=><g key={i} transform={`translate(${x} ${y})`}><path className={`magic-star magic-star-${i%3}`} d={`M0 ${-r} ${r*.12} ${-r*.12} ${r} 0 ${r*.12} ${r*.12} 0 ${r} ${-r*.12} ${r*.12} ${-r} 0 ${-r*.12} ${-r*.12}Z`}/></g>)}
    </g>
    <g className="demo-clean" fill="white" stroke="none">
     {[[24,24,4],[43,37,7],[59,21,3],[21,51,3],[60,53,4]].map(([x,y,r],i)=><g key={i} transform={`translate(${x} ${y})`}><path className={`magic-star magic-star-${i%3}`} d={`M0 ${-r} ${r*.12} ${-r*.12} ${r} 0 ${r*.12} ${r*.12} 0 ${r} ${-r*.12} ${r*.12} ${-r} 0 ${-r*.12} ${-r*.12}Z`}/></g>)}
    </g>
   </>}

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




