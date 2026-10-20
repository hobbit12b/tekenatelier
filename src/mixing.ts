const anchors=[[0,0],[60,120],[120,180],[180,240],[240,280],[300,320],[360,360]];
function mapHue(h:number,inverse=false){for(let i=1;i<anchors.length;i++){const a=anchors[i-1],b=anchors[i],j=inverse?1:0,k=inverse?0:1;if(h<=b[j])return a[k]+(h-a[j])/(b[j]-a[j])*(b[k]-a[k]);}return h;}
function rgb(hex:string){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);}
function hsv(hex:string){const [r,g,b]=rgb(hex),max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;let h=0;if(d)h=max===r?((g-b)/d)%6:max===g?(b-r)/d+2:(r-g)/d+4;return [(h*60+360)%360,max?d/max:0,max];}
function hex(h:number,s:number,v:number){const c=v*s,x=c*(1-Math.abs(h/60%2-1)),m=v-c;const a=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];return '#'+a.map(n=>Math.round((n+m)*255).toString(16).padStart(2,'0')).join('');}
// Educational RYB wheel: red-yellow-orange, yellow-blue-green, red-blue-purple.
export function mix(a:string,b:string){if(a===b)return a;const [ha,sa,va]=hsv(a),[hb,sb,vb]=hsv(b);if(sa<.06||sb<.06){const [h,s,v]=sa<.06?[hb,sb,vb]:[ha,sa,va],n=sa<.06?va:vb;return hex(h,n>.85?s*.52:s,(v+n)/2);}let x=mapHue(ha),y=mapHue(hb);if(Math.abs(x-y)>180){if(x<y)x+=360;else y+=360;}return hex(mapHue((x+y)/2%360,true),(sa+sb)/2,(va+vb)/2);}
