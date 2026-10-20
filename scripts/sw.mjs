import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const walk=async(dir)=>(await Promise.all((await readdir(dir,{withFileTypes:true})).map(async e=>e.isDirectory()?walk(`${dir}/${e.name}`):`${dir}/${e.name}`))).flat();
const files=(await walk('dist')).filter(f=>!f.endsWith('/sw.js'));
const version=createHash('sha256');for(const f of files)version.update(await readFile(f));
const cache='tekenatelier-'+version.digest('hex').slice(0,12);
await writeFile('dist/sw.js',`const CACHE=${JSON.stringify(cache)},FILES=${JSON.stringify(files.map(f=>'./'+f.slice(5)))};const URLS=FILES.map(f=>new URL(f,self.registration.scope).href);self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(URLS))));self.addEventListener('activate',e=>e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('tekenatelier-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==self.location.origin)return;if(e.request.mode==='navigate'&&u.href.startsWith(self.registration.scope)){e.respondWith(caches.open(CACHE).then(c=>c.match(new URL('./index.html',self.registration.scope).href)).then(r=>r||fetch(e.request)));return;}if(URLS.includes(u.href))e.respondWith(caches.open(CACHE).then(c=>c.match(e.request)).then(r=>r||fetch(e.request)));});`);
console.log('Offlinecache gemaakt:',files.length,'algemene appbestanden.');
