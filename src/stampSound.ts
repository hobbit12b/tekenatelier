// Small voice pool lets rapid stamps overlap without creating unlimited players.
export function createStampSound(){
 const voices=Array.from({length:4},()=>{const audio=new Audio(import.meta.env.BASE_URL+'audio/plop.mp3');audio.preload='auto';audio.volume=.65;return audio;});
 let next=0;
 return {
  play(){const audio=voices.find(v=>v.paused||v.ended)||voices[next++%voices.length];audio.currentTime=0;void audio.play().catch(()=>{});},
  dispose(){for(const audio of voices){audio.pause();audio.removeAttribute('src');audio.load();}},
 };
}
