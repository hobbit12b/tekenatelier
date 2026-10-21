// Close only small breaks in the boundary; the visible drawing is never changed.
function box(mask:Uint8Array,w:number,h:number,r:number,dilate:boolean){
 const tmp=new Uint8Array(mask.length),out=new Uint8Array(mask.length);
 for(let y=0;y<h;y++){let sum=0;for(let x=0;x<=Math.min(r,w-1);x++)sum+=mask[y*w+x];for(let x=0;x<w;x++){const count=Math.min(w-1,x+r)-Math.max(0,x-r)+1;tmp[y*w+x]=+(dilate?sum>0:sum===count);if(x-r>=0)sum-=mask[y*w+x-r];if(x+r+1<w)sum+=mask[y*w+x+r+1];}}
 for(let x=0;x<w;x++){let sum=0;for(let y=0;y<=Math.min(r,h-1);y++)sum+=tmp[y*w+x];for(let y=0;y<h;y++){const count=Math.min(h-1,y+r)-Math.max(0,y-r)+1;out[y*w+x]=+(dilate?sum>0:sum===count);if(y-r>=0)sum-=tmp[(y-r)*w+x];if(y+r+1<h)sum+=tmp[(y+r+1)*w+x];}}
 return out;
}
export function fillPixels(a:Uint8ClampedArray,w:number,h:number,x:number,y:number,rgb:number[],gapRadius=5){
 const seed=Math.max(0,Math.min(h-1,Math.round(y)))*w+Math.max(0,Math.min(w-1,Math.round(x))),target=Array.from(a.slice(seed*4,seed*4+3));
 const difference=new Uint8Array(w*h),barrier=new Uint8Array(w*h);
 for(let n=0;n<barrier.length;n++){difference[n]=Math.max(Math.abs(target[0]-a[n*4]),Math.abs(target[1]-a[n*4+1]),Math.abs(target[2]-a[n*4+2]));barrier[n]=+(difference[n]>36);}
 const closed=box(box(barrier,w,h,gapRadius,true),w,h,gapRadius,false);
 // A very narrow region can disappear during closing. Keep it usable.
 const boundary=closed[seed]?barrier:closed;
 const region=new Uint8Array(w*h),queue=new Int32Array(w*h);let head=0,tail=1;queue[0]=seed;region[seed]=1;
 while(head<tail){const n=queue[head++],xx=n%w;for(const next of [xx>0?n-1:-1,xx<w-1?n+1:-1,n-w,n+w])if(next>=0&&next<region.length&&!region[next]&&!boundary[next]){region[next]=1;queue[tail++]=next;}}
 const fringe=box(region,w,h,2,true),out=new Uint8ClampedArray(a.length);
 for(let n=0;n<region.length;n++){
  if(!fringe[n])continue;
  let coverage=1;
  if(difference[n]){
   let strongest=difference[n];const xx=n%w,yy=Math.floor(n/w);
   for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++)if(xx+dx>=0&&xx+dx<w&&yy+dy>=0&&yy+dy<h)strongest=Math.max(strongest,difference[(yy+dy)*w+xx+dx]);
   coverage=1-difference[n]/strongest;
  }
  if(!region[n]&&(!barrier[n]||coverage<=0))continue;
  // Replace the background contribution of antialiased pixels, preserving ink.
  for(let j=0;j<3;j++)out[n*4+j]=a[n*4+j]+(rgb[j]-target[j])*coverage;
  out[n*4+3]=255;
 }
 return out;
}
