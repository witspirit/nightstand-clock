/* Uses an external Playwright install, matching check-motion.cjs. No app dependency. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('fs'), http=require('http'), path=require('path'), assert=require('assert');
const solar=require('./solar-math.js');
for(const [date,expected] of [['2026-06-21T12:00:00Z',23.44],['2026-12-21T12:00:00Z',-23.44],['2026-03-20T12:00:00Z',0]]) {
 const sun=solar.sun(new Date(date)); assert(Math.abs(sun.declination-expected)<.6);
 assert(Math.abs(Math.hypot(...sun.vector)-1)<1e-10);
}
for(const year of [2024,2026]) assert(Number.isFinite(solar.sun(new Date(`${year}-12-31T23:59:00Z`)).declination));
assert.equal(solar.blend(-1),0);assert.equal(solar.blend(1),1);assert.equal(solar.blend(0),.5);
const root=process.cwd(), origin='http://127.0.0.1:8002';
const server=http.createServer((req,res)=>{const file=path.join(root,decodeURIComponent(req.url.split('?')[0]));fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',({'html':'text/html','js':'text/javascript','css':'text/css','jpg':'image/jpeg'})[file.split('.').pop()]||'application/octet-stream');res.setHeader('Cache-Control','public, max-age=3600');res.end(data);});});
(async()=>{
 await new Promise(r=>server.listen(8002,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE || undefined});
 const errors=[], results={environment:{date:new Date().toISOString(),browser:browser.version(),cpu:require('os').cpus()[0].model},presets:[],loads:[],runtime:[]};
 const url=q=>origin+'/test/earth/solar.html?standalone=1&'+q;
 async function page(){const p=await browser.newPage({viewport:{width:1024,height:768}});p.on('pageerror',e=>errors.push(e.message));return p;}
 async function ready(p,q){await p.goto(url(q));await p.waitForFunction(()=>window.earthSolarDiagnostics && !earthSolarDiagnostics().loading);return p.evaluate(()=>earthSolarDiagnostics());}
 try {
  const p=await page();
  for(const [preset,sign] of [['dawn',0],['day',1],['dusk',0],['night',-1],['summer',1],['winter',1]]) {
   const d=await ready(p,'preset='+preset); assert.equal(d.activeView,'solar');assert(d.ready);assert.equal(d.draws,1);assert(!d.timerActive);assert.equal(d.opacity,.28);assert.equal(await p.locator('.tick').count(),60);
   const center=d.sun.vector[2]; if(sign) assert(center*sign>0); else assert(Math.abs(center)<.03);
   // Check blend output against independently read local day/night source pixels.
   const pixels=await p.evaluate(async()=>{const samples=[];for(const name of ['day','night']){const img=new Image();img.src='assets/brasschaat/'+name+'.jpg';await img.decode();const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);samples.push(Array.from(ctx.getImageData(256,256,1,1).data));}samples.push(Array.from(document.getElementById('solar').getContext('2d').getImageData(256,256,1,1).data));return samples;});
   if(preset==='night') assert.deepEqual(pixels[2],pixels[1]);if(preset==='day') assert.deepEqual(pixels[2],pixels[0]);
   results.presets.push({preset,diagnostics:d,centerPixels:pixels});
   for(const [width,height] of [[1024,768],[768,1024]]){await p.setViewportSize({width,height});await p.screenshot({path:`/tmp/solar-${preset}-${width}.jpg`});}
  }
  await p.setViewportSize({width:1024,height:768});
  // Earth-off requests no imagery. Unsupported Canvas and failed assets degrade progressively.
  let requests=[];p.on('request',r=>{if(r.url().includes('/assets/'))requests.push(r.url());});
  let d=await ready(p,'view=off');assert.equal(requests.length,0);assert.equal(d.activeView,'off');
  await p.addInitScript(()=>{HTMLCanvasElement.prototype.getContext=function(){return null;};});
  d=await ready(p,'');assert.equal(d.activeView,'still');assert(d.failure.includes('unsupported'));await p.close();
  const f=await page();await f.route('**/assets/brasschaat/night.jpg',r=>r.abort());d=await ready(f,'');assert.equal(d.activeView,'still');
  await f.route('**/assets/brasschaat/day.jpg',r=>r.abort());d=await ready(f,'');assert.equal(d.activeView,'original');
  await f.route('**/assets/blue-marble-512.jpg',r=>r.abort());d=await ready(f,'');assert.equal(d.activeView,'off');assert(/\d\d:\d\d/.test(await f.locator('#digital-time').textContent()));await f.close();
  const timeout=await page();await timeout.clock.install();let stalled;const stalledRequest=new Promise(r=>stalled=r);await timeout.route('**/assets/brasschaat/night.jpg',()=>stalled());await timeout.goto(url(''),{waitUntil:'domcontentloaded'});await stalledRequest;await timeout.clock.runFor(10100);await timeout.waitForFunction(()=>earthSolarDiagnostics().activeView==='still' && !earthSolarDiagnostics().loading);await timeout.close();
  const bad=await page();await bad.addInitScript(()=>{CanvasRenderingContext2D.prototype.putImageData=function(){throw new Error('simulated draw failure');};});d=await ready(bad,'');assert.equal(d.activeView,'still');await bad.close();
  // Real cadence, hidden/resume and BFCache-style lifecycle; no catch-up draw loop.
  const life=await page();await life.clock.install();d=await ready(life,'time=real&clock=real');assert(d.timerActive);const first=d.solarUTC;
  await life.clock.runFor(60100);d=await life.evaluate(()=>earthSolarDiagnostics());assert.equal(d.draws,2);assert.notEqual(d.solarUTC,first);
  await life.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});await life.clock.runFor(120000);assert.equal((await life.evaluate(()=>earthSolarDiagnostics())).draws,2);
  await life.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});d=await life.evaluate(()=>earthSolarDiagnostics());assert.equal(d.draws,3);assert(d.timerActive);
  await life.evaluate(()=>window.dispatchEvent(new Event('pagehide')));await life.clock.runFor(120000);assert.equal((await life.evaluate(()=>earthSolarDiagnostics())).draws,3);await life.evaluate(()=>window.dispatchEvent(new Event('pageshow')));assert.equal((await life.evaluate(()=>earthSolarDiagnostics())).draws,4);await life.close();
  // Hide while loading; canceled preparation starts again on resume.
  const loading=await page();let release,intercept;const intercepted=new Promise(r=>intercept=r);await loading.route('**/assets/brasschaat/night.jpg',async r=>{intercept();await new Promise(resolve=>release=resolve);await r.continue().catch(()=>{});});await loading.goto(url('time=real'),{waitUntil:'domcontentloaded'});await intercepted;await loading.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});assert(!(await loading.evaluate(()=>earthSolarDiagnostics())).loading);await loading.unrouteAll({behavior:'ignoreErrors'});if(release)release();await loading.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});await loading.waitForFunction(()=>earthSolarDiagnostics().ready);await loading.close();
  // Harness has real root scrolling, reachable preview, usable controls at narrow widths.
  const h=await page();for(const [width,height] of [[1280,720],[768,1024],[390,844]]) {
   await h.setViewportSize({width,height});await h.goto(origin+'/test/earth/solar.html');await h.selectOption('#viewport','portrait');await h.selectOption('#preset','winter');await h.waitForFunction(()=>document.getElementById('preview').contentWindow.earthSolarDiagnostics?.().ready);
   assert(await h.locator('#settings').evaluate(e=>e.scrollWidth<=innerWidth));await h.mouse.move(width/2,height/2);await h.mouse.wheel(0,3000);await h.waitForTimeout(200);assert(await h.evaluate(()=>scrollY>0));
   assert(await h.locator('#frame-space').evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight+1));await h.locator('#read-diagnostics').click();assert((await h.locator('#diagnostics').textContent()).includes('coordinates'));
  }await h.close();
  // Three cold and warm startup samples per baseline; timings are JS-init/load, not paint.
  for(const view of ['off','original','still','solar']) {
   const p=await page(),cdp=await p.context().newCDPSession(p);
   for(const cache of ['cold','warm'])for(let run=0;run<3;run++){
    if(cache==='cold')await cdp.send('Network.clearBrowserCache');
    const d=await ready(p,'view='+view+'&time=real&clock=real');
    const resources=await p.evaluate(()=>performance.getEntriesByType('resource').map(r=>({name:r.name.split('/').pop(),duration:r.duration,encoded:r.encodedBodySize,transfer:r.transferSize})));
    results.loads.push({view,cache,run,diagnostics:d,resources});
   }await p.close();
  }
  // Serial 65s samples include a genuine sunlight update and digital minute rollover.
  for(const view of ['off','still','solar']){
   const p=await page();const before=await ready(p,'view='+view+'&time=real&clock=real');
   const start=await p.evaluate(()=>{window.gaps=[];window.lastRAF=performance.now();window.sampling=true;function frame(t){gaps.push(t-lastRAF);lastRAF=t;if(sampling)requestAnimationFrame(frame);}requestAnimationFrame(frame);return {digital:document.getElementById('digital-time').textContent,hand:getComputedStyle(document.getElementById('second-hand')).transform};});
   await p.waitForTimeout(65000);
   const end=await p.evaluate(()=>{sampling=false;return {digital:document.getElementById('digital-time').textContent,hand:getComputedStyle(document.getElementById('second-hand')).transform,maxRAFGap:Math.max(...gaps),samples:gaps.length,diagnostics:earthSolarDiagnostics()};});
   assert.notEqual(start.digital,end.digital);assert.notEqual(start.hand,end.hand);if(view==='solar')assert(end.diagnostics.draws>=2);
   results.runtime.push({view,before,start,end});await p.close();
  }
  assert.deepEqual(errors,[]);results.errors=errors;fs.writeFileSync('/tmp/solar-results.json',JSON.stringify(results,null,2));console.log('PASS: solar math, imagery, failures, lifecycle, responsive harness, startup and 65s clock samples. Results: /tmp/solar-results.json');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
