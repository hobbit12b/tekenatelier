import type {Point,Stroke} from './model';

const textures=new Map<string,HTMLCanvasElement>();
function texture(tool:string,color:string){
 const key=tool+color,cached=textures.get(key);
 if(cached)return cached;
 const tile=document.createElement('canvas');tile.width=128;tile.height=128;
 const ctx=tile.getContext('2d')!;ctx.fillStyle=color;
 const chalk=tool==='wasco';
 // Fixed paper grain: repainting, exporting and undo never randomize a line.
 for(let y=0;y<128;y++)for(let x=0;x<128;x++){
  const cell=1,seed=Math.sin(Math.floor(x/cell)*127.1+Math.floor(y/cell)*311.7)*43758.5453;
  const grain=seed-Math.floor(seed);
  if(chalk&&grain<.3)continue;
  ctx.globalAlpha=chalk?.25+.75*grain:.78+.22*grain;
  ctx.fillRect(x,y,1,1);
 }
 textures.set(key,tile);
 if(textures.size>24)textures.delete(textures.keys().next().value!);
 return tile;
}

export function drawDryMaterial(ctx:CanvasRenderingContext2D,s:Stroke,points:Point[]){
 if(!points.length)return;
 const chalk=s.tool==='wasco';
 ctx.strokeStyle=ctx.createPattern(texture(s.tool,s.color),'repeat')!;
 ctx.shadowBlur=0;ctx.lineCap='round';ctx.lineJoin='round';
 const trace=(ps:Point[])=>{ctx.beginPath();ctx.moveTo(ps[0].x,ps[0].y);for(const p of ps.slice(1))ctx.lineTo(p.x,p.y);if(ps.length===1)ctx.lineTo(ps[0].x+.01,ps[0].y);ctx.stroke();};
 if(chalk){
  // A dusty edge around the denser, broken chalk deposit.
  for(const [width,opacity] of [[1.12,.12],[.98,.24],[.82,.78]]){
   ctx.lineWidth=s.width*width;ctx.globalAlpha=opacity;trace(points);
  }
 }else{
  ctx.lineWidth=Math.max(.8,s.width*.55);
  if(points.some(p=>p.pressure!==undefined)){
   for(let i=0;i<Math.max(1,points.length-1);i++){
    const a=points[i],b=points[i+1]||a,force=Math.max(.05,Math.min(1,((a.pressure??.5)+(b.pressure??.5))/2));
    ctx.globalAlpha=.08+.92*Math.pow(force,1.2);trace(a===b?[a]:[a,b]);
   }
  }else{ctx.globalAlpha=.78;trace(points);}
 }
}
