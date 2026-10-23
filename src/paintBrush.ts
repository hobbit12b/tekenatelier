import type {Point,Stroke} from './model';

// Sample by distance, so paint runs out equally on slow and fast devices.
// Each bristle carries its own paint supply, leaving a ragged, dry tail.
export function paintDryBrush(ctx:CanvasRenderingContext2D,s:Stroke,points:Point[]){
 if(!points.length)return;
 ctx.shadowBlur=0;ctx.lineCap='round';
 const supply=Math.max(420,s.width*24),step=2,bristles=20;
 let walked=0,next=0,previous:Point|undefined,previousDistance=0;
 const dab=(p:Point,distance:number)=>{
  const force=p.pressure??.55;
  const spread=s.width*(.38+force*1.12)*(1+.12*Math.sin(distance/43))*(1-.35*Math.min(1,distance/supply));
  const before=previous||{...p,x:p.x-.1};
  const previousForce=before.pressure??.55;
  const previousSpread=s.width*(.38+previousForce*1.12)*(1+.12*Math.sin(previousDistance/43))*(1-.35*Math.min(1,previousDistance/supply));
  // Fixed bristle angle makes turns spread and narrow like a flat brush.
  for(let j=0;j<bristles;j++){
   const lane=(j/(bristles-1)-.5),seed=(Math.sin(j*73.13)*43758.5453)%1;
   const end=supply*(.65+.35*Math.abs(seed));
   const remaining=Math.max(0,1-distance/end);
   if(!remaining)continue;
   const noise=Math.abs(Math.sin(Math.floor(distance/3)*127.1+j*311.7)*43758.5453)%1;
   const grain=.88+.12*noise;
   ctx.globalAlpha=.78*Math.min(1,remaining*3)*grain;
   ctx.lineWidth=Math.max(.35,s.width/bristles*1.7)*Math.min(1,remaining*5);
   ctx.beginPath();
   ctx.moveTo(before.x+lane*previousSpread*.25,before.y+lane*previousSpread);
   ctx.lineTo(p.x+lane*spread*.25,p.y+lane*spread);
   ctx.stroke();
  }
  previous=p;previousDistance=distance;
 };
 dab(points[0],0);next=step;
 for(let i=1;i<points.length&&walked<supply;i++){
  const a=points[i-1],b=points[i],length=Math.hypot(b.x-a.x,b.y-a.y);
  if(!length)continue;
  while(next<=walked+length&&next<supply){
   const t=(next-walked)/length;
   dab({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,pressure:(a.pressure??.55)+((b.pressure??.55)-(a.pressure??.55))*t},next);
   next+=step;
  }
  walked+=length;
 }
}
