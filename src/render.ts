import {calculateFill} from './fillClient';
import {type Drawing,type Stroke,type Item,type Point} from './model';
import {drawSparkle,sparklePoints} from './sparkles';
const images=new Map<string,{image:HTMLImageElement;ready:Promise<void>;bytes:number}>();
const IMAGE_BUDGET=32*1024*1024;
export async function getImage(src:string){
 let entry=images.get(src);
 if(!entry){const image=new Image();image.src=src;entry={image,ready:image.decode(),bytes:0};images.set(src,entry);}
 try{await entry.ready;}catch(e){images.delete(src);throw e;}
 entry.bytes=entry.image.naturalWidth*entry.image.naturalHeight*4;
 images.delete(src);images.set(src,entry);
 let bytes=[...images.values()].reduce((n,v)=>n+v.bytes,0);
 for(const [key,value] of images){if(bytes<=IMAGE_BUDGET&&images.size<=24)break;if(key===src)continue;bytes-=value.bytes;images.delete(key);}
 return entry.image;
}
export function clearImages(){images.clear();}
export function imageCacheStats(){return {count:images.size,bytes:[...images.values()].reduce((n,v)=>n+v.bytes,0)};}
export function stroke(ctx:CanvasRenderingContext2D,s:Stroke,canvasWidth:number){ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=s.color;ctx.fillStyle=s.color;ctx.lineWidth=s.width;ctx.globalCompositeOperation=s.tool==='gum'?'destination-out':'source-over';if(s.tool==='potlood'){ctx.globalAlpha=.72;ctx.lineWidth=s.width*.55;}if(s.tool==='kwast'){ctx.globalCompositeOperation=s.wet?'multiply':'source-over';ctx.globalAlpha=.65;ctx.shadowBlur=s.width*.16;ctx.shadowColor=s.color;}
 const path=(points:Point[])=>{if(!points.length)return;ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);for(const p of points.slice(1))ctx.lineTo(p.x,p.y);if(points.length===1)ctx.lineTo(points[0].x+.01,points[0].y);ctx.stroke();};
 const draw=(ps:Point[])=>{
  const pressure=(s.tool==='kwast'||s.tool==='potlood')&&ps.some(p=>p.pressure!==undefined);
  if(pressure){
   const segments=ps.length===1?[[ps[0],{...ps[0],x:ps[0].x+.01}]]:ps.slice(1).map((p,i)=>[ps[i],p]);
   for(const [a,b] of segments){const force=Math.max(.05,Math.min(1,((a.pressure??.5)+(b.pressure??.5))/2));ctx.lineWidth=s.width*(s.tool==='kwast'?.25+1.5*force:.55);ctx.globalAlpha=s.tool==='potlood'?.12+.83*force:.65;path([a,b]);}
  }else if(s.tool==='wasco'){ctx.globalAlpha=.18;for(let n=0;n<8;n++){ctx.lineWidth=s.width/8;path(ps.map(p=>({x:p.x+Math.sin(n*9)*s.width*.4,y:p.y+Math.cos(n*9)*s.width*.4})));}}else path(ps);
  if(s.tool==='glitter'){let distance=0;for(let i=1;i<ps.length;i++){const a=ps[i-1],b=ps[i],len=Math.hypot(b.x-a.x,b.y-a.y);for(let t=0;t<len;t+=5){const k=distance+t,x=a.x+(b.x-a.x)*t/len+Math.sin(k*19)*s.width*.4,y=a.y+(b.y-a.y)*t/len+Math.cos(k*13)*s.width*.4;ctx.fillStyle=k%3<1?'#fff6bb':'#ffffff';ctx.fillRect(x,y,2.5,2.5);}distance+=len;}}};
 draw(s.points);if(s.mirror)draw(s.points.map(p=>({...p,x:canvasWidth-p.x})));if(s.tool==='glitter'){for(const star of sparklePoints([s],canvasWidth,160)){ctx.fillStyle='#fff8c8';drawSparkle(ctx,star.x,star.y,star.radius*.8);ctx.fillStyle='#ffffff';drawSparkle(ctx,star.x,star.y,star.radius*.35);}}ctx.restore();}
export function shapePath(ctx:CanvasRenderingContext2D,name:string,w:number,h:number){ctx.beginPath();if(name==='cirkel'||name==='ovaal')ctx.ellipse(0,0,w/2,h/2,0,0,Math.PI*2);else if(name==='hart'){ctx.moveTo(0,h/2);ctx.bezierCurveTo(-w,-h*.1,-w*.4,-h*.85,0,-h*.25);ctx.bezierCurveTo(w*.4,-h*.85,w,-h*.1,0,h/2);}else if(name==='lijn'){ctx.moveTo(-w/2,0);ctx.lineTo(w/2,0);}else if(name==='vierkant'||name==='rechthoek')ctx.rect(-w/2,-h/2,w,h);else{const n=name==='ster'?10:name==='driehoek'?3:name==='ruit'?4:6;for(let i=0;i<n;i++){const r=name==='ster'&&i%2?.44:1,a=i*Math.PI*2/n-Math.PI/2;const x=Math.cos(a)*w/2*r,y=Math.sin(a)*h/2*r;if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);}ctx.closePath();}}
export async function item(ctx:CanvasRenderingContext2D,o:Item){ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.rotation);ctx.fillStyle=o.color;ctx.strokeStyle=o.color;ctx.lineWidth=5;ctx.lineJoin='round';if(o.kind==='shape'){shapePath(ctx,o.shape!,o.w,o.h);if(o.filled&&o.shape!=='lijn')ctx.fill();else ctx.stroke();}else if(o.kind==='text'){ctx.font=`bold ${o.h}px ${o.font==='speels'?'Georgia':'Arial'}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(o.text||'',0,0,o.w);}else if(o.src){const image=await getImage(o.src);ctx.drawImage(image,-o.w/2,-o.h/2,o.w,o.h);}ctx.restore();}
export function background(ctx:CanvasRenderingContext2D,d:Drawing){ctx.fillStyle=d.background.startsWith('#')?d.background:'#fffef8';ctx.fillRect(0,0,d.width,d.height);ctx.strokeStyle='#dce7e4';ctx.fillStyle='#bdcecc';ctx.lineWidth=1;if(d.background==='ruitjes'){ctx.beginPath();for(let x=0;x<d.width;x+=35){ctx.moveTo(x,0);ctx.lineTo(x,d.height);}for(let y=0;y<d.height;y+=35){ctx.moveTo(0,y);ctx.lineTo(d.width,y);}ctx.stroke();}if(d.background==='stippen')for(let x=18;x<d.width;x+=35)for(let y=18;y<d.height;y+=35){ctx.beginPath();ctx.arc(x,y,1.5,0,Math.PI*2);ctx.fill();}}
export async function renderMarks(ctx:CanvasRenderingContext2D,d:Drawing){for(const m of d.marks){if(m.kind==='stroke')stroke(ctx,m,d.width);else if(m.kind==='fill')ctx.drawImage(await getImage(m.src),0,0,d.width,d.height);else await item(ctx,m);}}
export async function renderArt(canvas:HTMLCanvasElement,d:Drawing,scale=1,withBackground=false){canvas.width=Math.round(d.width*scale);canvas.height=Math.round(d.height*scale);const ctx=canvas.getContext('2d')!;ctx.scale(scale,scale);await renderMarks(ctx,d);if(withBackground){const sheet=document.createElement('canvas');sheet.width=canvas.width;sheet.height=canvas.height;const paper=sheet.getContext('2d')!;paper.scale(scale,scale);background(paper,d);ctx.globalCompositeOperation='destination-over';ctx.drawImage(sheet,0,0,d.width,d.height);ctx.globalCompositeOperation='source-over';}return canvas;}
export function hit(o:Item,p:Point){const dx=p.x-o.x,dy=p.y-o.y,x=dx*Math.cos(o.rotation)+dy*Math.sin(o.rotation),y=-dx*Math.sin(o.rotation)+dy*Math.cos(o.rotation);return Math.abs(x)<Math.max(28,o.w/2+8)&&Math.abs(y)<Math.max(28,o.h/2+8);}
export async function flood(d:Drawing,p:Point,color:string,gapRadius=5){
 const c=await renderArt(document.createElement('canvas'),d,1,true),ctx=c.getContext('2d')!;
 const pixels=ctx.getImageData(0,0,c.width,c.height);
 const out=await calculateFill(pixels.data,c.width,c.height,p.x,p.y,[1,3,5].map(i=>parseInt(color.slice(i,i+2),16)),gapRadius);
 ctx.putImageData(new ImageData(out,c.width,c.height),0,0);
 return c.toDataURL('image/png');
}
