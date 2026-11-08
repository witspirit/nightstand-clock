/* Regression: old cached clock assets must not mix with the Earth entry point.
 * Uses an external Playwright installation, like check-production-earth.cjs.
 */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('assert'),fs=require('fs'),http=require('http'),path=require('path');
const root=process.cwd(),origin='http://127.0.0.1:8004';
const html=fs.readFileSync('src/index.html','utf8');
// Model the preceding release: same bare URLs, no Earth CSS, ordinary palette initializer.
const oldCSS=fs.readFileSync('src/style.css','utf8').split('/* Fixed geography;')[0];
const oldJS=fs.readFileSync('src/script.js','utf8').replace("initNightstandClock('clock-container', { colorStops: [[0, [0, 0, 0]], [24, [0, 0, 0]]] })", "initNightstandClock('clock-container')");
assert(!oldCSS.includes('#earth-backdrop'));assert.notEqual(oldJS,fs.readFileSync('src/script.js','utf8'));
let phase='seed', requests=[];
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,origin);requests.push({phase,url:req.url});
 const entry=url.pathname==='/src/'||url.pathname==='/src/index.html';
 res.setHeader('Content-Type',entry?'text/html':({'css':'text/css','js':'text/javascript','jpg':'image/jpeg'})[url.pathname.split('.').pop()]||'text/plain');
 res.setHeader('Cache-Control',entry?'no-store':'public, max-age=3600');
 if(entry){let body=html;if(phase==='seed')body=html.replace(/<div id="earth-backdrop"[\s\S]*?<\/div>/,'').replace(/    <script src="earth(?:-math)?\.js[^\n]*\n/g,'');if(phase==='seed'||phase==='unversioned')body=body.replace(/\?v=[^"]+/g,'');res.end(body);return;}
 if(phase==='seed'&&url.pathname==='/src/style.css'){res.end(oldCSS);return;}
 if(phase==='seed'&&url.pathname==='/src/script.js'){res.end(oldJS);return;}
 fs.readFile(path.join(root,url.pathname),(e,b)=>{if(e){res.writeHead(404);res.end();}else res.end(b);});
});
(async()=>{
 await new Promise(r=>server.listen(8004,'127.0.0.1',r));const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||undefined});
 const results={browser:browser.version(),date:new Date().toISOString(),checks:[]};
 try{
  const p=await browser.newPage({viewport:{width:1896,height:1020}});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.clock.install({time:new Date('2026-11-04T18:19:00Z')});
  await p.goto(origin+'/src/index.html');await p.locator('.tick').first().waitFor();
  phase='unversioned';await p.reload();await p.waitForFunction(()=>getComputedStyle(document.getElementById('earth-surface')).display==='block');
  // The old palette fades from initial black; allow that CSS transition to begin.
  await p.waitForFunction(()=>getComputedStyle(document.body).backgroundColor!=='rgb(0, 0, 0)');
  const broken=await p.evaluate(()=>({background:getComputedStyle(document.body).backgroundColor,position:getComputedStyle(document.getElementById('earth-backdrop')).position,canvas:document.getElementById('earth-surface').getBoundingClientRect().toJSON()}));
  assert.notEqual(broken.background,'rgb(0, 0, 0)');assert.equal(broken.position,'static');assert.equal(broken.canvas.width,512);
  assert(!requests.some(r=>r.phase==='unversioned'&&/\/src\/(style\.css|script\.js)/.test(r.url)),'Bare CSS and clock script must come from the seeded cache to reproduce this bug');
  await p.screenshot({path:'/tmp/production-cache-before.jpg'});results.reproduced=broken;
  phase='fixed';await p.reload();await p.waitForFunction(()=>getComputedStyle(document.getElementById('earth-surface')).display==='block');
  for(const [width,height] of [[1896,1020],[1024,768],[768,1024]]){
   await p.setViewportSize({width,height});const d=await p.evaluate(()=>{const g=document.getElementById('earth-backdrop'),c=document.getElementById('clock-face');return {background:getComputedStyle(document.body).backgroundColor,position:getComputedStyle(g).position,opacity:getComputedStyle(g).opacity,globe:g.getBoundingClientRect().toJSON(),dial:c.getBoundingClientRect().toJSON(),ticks:document.querySelectorAll('.tick').length};});
   assert.equal(d.background,'rgb(0, 0, 0)');assert.equal(d.position,'absolute');assert.equal(d.opacity,'1');assert.equal(d.ticks,60);
   assert(Math.abs(d.globe.width-Math.min(width,height)*.9)<.1);assert(Math.abs(d.globe.x+d.globe.width/2-width/2)<.1);assert(Math.abs(d.globe.y+d.globe.height/2-height/2)<.1);
   assert(Math.abs(d.globe.x+d.globe.width/2-d.dial.x-d.dial.width/2)<.1);assert(Math.abs(d.globe.y+d.globe.height/2-d.dial.y-d.dial.height/2)<.1);
   assert(d.dial.y>=0 && d.dial.y+d.dial.height<=height+.1);results.checks.push({width,height,...d});await p.screenshot({path:`/tmp/production-cache-after-${width}.jpg`});
  }
  for(const name of ['style.css','script.js','earth-math.js','earth.js'])assert(requests.some(r=>r.phase==='fixed'&&r.url.startsWith('/src/'+name+'?v=')),name+' must use a fresh versioned URL');
  await p.clock.runFor(120000);assert.equal(await p.evaluate(()=>getComputedStyle(document.body).backgroundColor),'rgb(0, 0, 0)');assert.deepEqual(errors,[]);
  results.requests=requests;results.errors=errors;fs.writeFileSync('/tmp/production-cache-results.json',JSON.stringify(results,null,2)+'\n');console.log('PASS: reproduced cached-asset mismatch; ordinary reload loads corrected resources and centers Earth/clock on black in 3 viewports.');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
