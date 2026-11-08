/* External Playwright/Chromium only; exercise the deployed src entry point. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('assert'),fs=require('fs'),http=require('http'),path=require('path');
const root=process.cwd(),origin='http://127.0.0.1:8003';
assert.equal(fs.readFileSync('src/earth-math.js','utf8'),fs.readFileSync('test/earth/solar-math.js','utf8'));
const server=http.createServer((req,res)=>{let file=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(file.endsWith('/'))file+='index.html';fs.readFile(file,(e,b)=>{if(e){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',({'html':'text/html','css':'text/css','js':'text/javascript','jpg':'image/jpeg'})[file.split('.').pop()]||'text/plain');res.end(b);});});
(async()=>{
 await new Promise(r=>server.listen(8003,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE || undefined});
 const errors=[],results={browser:browser.version(),cpu:require('os').cpus()[0].model,date:new Date().toISOString(),captures:[],runtime:[]};
 async function page(){const p=await browser.newPage({viewport:{width:1024,height:768}});p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>{
  window.earthTest={draws:0,reads:0,buffers:0,images:[],maxDrawMs:0};
  const original=CanvasRenderingContext2D.prototype.putImageData;
  CanvasRenderingContext2D.prototype.putImageData=function(...args){const t=performance.now();const result=original.apply(this,args);earthTest.draws++;earthTest.maxDrawMs=Math.max(earthTest.maxDrawMs,performance.now()-t);return result;};
  for(const [method,key] of [['getImageData','reads'],['createImageData','buffers']]){const original=CanvasRenderingContext2D.prototype[method];CanvasRenderingContext2D.prototype[method]=function(...args){earthTest[key]++;return original.apply(this,args);};}
 });p.on('request',r=>{if(r.url().includes('/assets/'))p.images.push(r.url());});p.images=[];return p;}
 async function ready(p){await p.goto(origin+'/src/');await p.waitForFunction(()=>earthTest.draws===1);}
 try{
  for(const preset of ['2026-03-20T05:50:00Z','2026-03-20T12:00:00Z','2026-03-20T17:50:00Z','2026-03-20T00:00:00Z']) {
   const p=await page();await p.clock.install({time:new Date(preset)});await ready(p);
   for(const [width,height] of [[1024,768],[768,1024]]){await p.setViewportSize({width,height});const d=await p.evaluate(()=>({background:getComputedStyle(document.body).backgroundColor,globe:document.getElementById('earth-backdrop').getBoundingClientRect().width,opacity:getComputedStyle(document.getElementById('earth-backdrop')).opacity,time:document.getElementById('digital-time').textContent,controls:Array.from(document.querySelectorAll('select,button,iframe')).filter(el=>el.id!=='brightness-toggle' && !el.closest('#brightness-panel')).length}));assert.equal(d.background,'rgb(0, 0, 0)');assert(Math.abs(d.globe-Math.min(width,height)*.9)<.1);assert.equal(d.opacity, await p.evaluate(() => new Date().getHours() >= 8 && new Date().getHours() < 20 ? '1' : '0.4'));assert.equal(d.controls,0);assert.equal(await p.locator('.tick').count(),60);const file=`/tmp/production-earth-${preset.substring(11,13)}-${width}.jpg`;await p.screenshot({path:file});results.captures.push({preset,width,height,...d});}
   assert.equal(p.images.length,2);await p.close();
  }
  // 24 simulated hours: buffers and image requests stay constant, one draw per minute.
  const long=await page();await long.clock.install({time:new Date('2026-03-20T12:00:00Z')});await ready(long);
  for(let i=0;i<4;i++)await long.clock.runFor(6*3600000);
  let d=await long.evaluate(()=>earthTest);assert.equal(d.draws,1441);assert.equal(d.reads,2);assert.equal(d.buffers,1);assert.equal(long.images.length,2);
  results.simulatedDay={...d,imageRequests:long.images.length};
  await long.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});await long.clock.runFor(120000);assert.equal((await long.evaluate(()=>earthTest)).draws,1441);
  await long.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});assert.equal((await long.evaluate(()=>earthTest)).draws,1442);
  for(let i=0;i<4;i++){await long.evaluate(()=>window.dispatchEvent(new Event('pagehide')));await long.evaluate(()=>window.dispatchEvent(new Event('pageshow')));}
  const before=(await long.evaluate(()=>earthTest)).draws;await long.clock.runFor(60100);assert.equal((await long.evaluate(()=>earthTest)).draws,before+1);assert.equal(long.images.length,2);await long.close();
  // Asset/renderer failures leave the ordinary clock ticking on black.
  for(const mode of ['night','day','canvas','draw','math']){
   const p=await page();if(mode==='night'||mode==='day')await p.route('**/assets/earth/'+mode+'.jpg',r=>r.abort());
   if(mode==='math')await p.route('**/earth-math.js*',r=>r.abort());
   if(mode==='canvas')await p.addInitScript(()=>{HTMLCanvasElement.prototype.getContext=function(){return null;};});
   if(mode==='draw')await p.addInitScript(()=>{CanvasRenderingContext2D.prototype.putImageData=function(){throw Error('simulated');};});
   await p.goto(origin+'/src/');if(mode==='day')await p.waitForFunction(()=>getComputedStyle(document.getElementById('earth-backdrop')).display==='none');else await p.locator('#earth-still').waitFor({state:'visible'});
   assert(/\d\d:\d\d/.test(await p.locator('#digital-time').textContent()));assert.equal(await p.evaluate(()=>getComputedStyle(document.body).backgroundColor),'rgb(0, 0, 0)');await p.close();
  }
  // Clock-only and Earth real-time observations each span a minute redraw/rollover.
  for(const earth of [false,true]){
   const p=await page();if(!earth)await p.route('**/assets/earth/*.jpg',r=>r.abort());await p.goto(origin+'/src/');if(earth)await p.waitForFunction(()=>earthTest.draws===1);
   const start=await p.evaluate(()=>{window.sampling=true;window.gaps=[];window.lastRAF=performance.now();function sample(t){gaps.push(t-lastRAF);lastRAF=t;if(sampling)requestAnimationFrame(sample);}requestAnimationFrame(sample);return {time:document.getElementById('digital-time').textContent,hand:getComputedStyle(document.getElementById('second-hand')).transform};});
   await p.waitForTimeout(65000);const end=await p.evaluate(()=>{sampling=false;return {time:document.getElementById('digital-time').textContent,hand:getComputedStyle(document.getElementById('second-hand')).transform,maxRAFGap:Math.max(...gaps),telemetry:earthTest};});assert.notEqual(start.time,end.time);assert.notEqual(start.hand,end.hand);if(earth)assert.equal(end.telemetry.draws,2);results.runtime.push({earth,start,end,imageRequests:p.images.length});await p.close();
  }
  assert.deepEqual(errors,[]);results.errors=errors;fs.writeFileSync('/tmp/production-earth-results.json',JSON.stringify(results,null,2)+'\n');console.log('PASS production Earth integration; evidence /tmp/production-earth-results.json');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
