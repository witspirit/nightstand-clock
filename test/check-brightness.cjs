/* Exercise the actual production page; uses the same external Playwright setup as other checks. */
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('assert'), fs = require('fs'), http = require('http'), path = require('path');
const origin = 'http://127.0.0.1:8005', root = process.cwd();
const key = 'nightstand-brightness-v1';
const server = http.createServer((req, res) => {
    let file = path.join(root, new URL(req.url, origin).pathname);
    if (file.endsWith('/')) file += 'index.html';
    fs.readFile(file, (error, body) => {
        if (error) { res.writeHead(404); res.end(); return; }
        res.setHeader('Content-Type', ({html:'text/html', css:'text/css', js:'text/javascript', jpg:'image/jpeg'})[file.split('.').pop()] || 'text/plain');
        res.end(body);
    });
});
(async () => {
    await new Promise(resolve => server.listen(8005, '127.0.0.1', resolve));
    const browser = await chromium.launch({headless:true, executablePath:process.env.BROWSER_EXECUTABLE || undefined});
    const context = await browser.newContext({viewport:{width:1024,height:768}, timezoneId:'Europe/Brussels', hasTouch:true});
    const errors = [], requests = [];
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => requests.push(request.url()));
    async function opacity(id) { return Number(await page.locator(id).evaluate(el => getComputedStyle(el).opacity)); }
    async function slide(id, value) {
        await page.locator(id).evaluate((el, value) => { el.value = value; el.dispatchEvent(new Event('input', {bubbles:true})); }, String(value));
    }
    async function selectProfile(name, target = page) {
        await target.locator('#brightness-mode [data-profile="' + name + '"]').tap();
        assert.equal(await target.locator('#brightness-mode [aria-pressed="true"]').count(), 1);
        assert.equal(await target.locator('#brightness-mode [aria-pressed="true"]').getAttribute('data-profile'), name);
    }
    try {
        // November: Brussels is UTC+1. Start just before local 20:00.
        await page.clock.install({time:new Date('2026-11-07T18:59:58Z')});
        await page.goto(origin + '/src/');
        await page.locator('#earth-surface').waitFor({state:'visible'});
        assert(await page.locator('#brightness-panel').isHidden());
        assert.equal(await opacity('#clock-container'), 1);
        assert.equal(await opacity('#earth-backdrop'), 1);
        assert.equal(await page.locator('meta[name="apple-mobile-web-app-capable"]').getAttribute('content'), 'yes');
        assert.equal(await page.locator('meta[name="apple-mobile-web-app-status-bar-style"]').getAttribute('content'), 'black');
        await page.clock.runFor(2100);
        assert.equal(await opacity('#clock-container'), .12);
        await page.locator('#brightness-toggle').tap();
        assert(await page.locator('#brightness-panel').isVisible());
        await slide('#clock-brightness', 5);
        await slide('#earth-brightness', 75);
        assert.equal(await opacity('#clock-container'), .05);
        assert.equal(await opacity('#earth-backdrop'), .75);
        await selectProfile('day');
        assert.equal(await opacity('#clock-container'), 1);
        await slide('#clock-brightness', 62);
        await slide('#earth-brightness', 55);
        await page.locator('#brightness-toggle').tap();
        assert(await page.locator('#brightness-panel').isHidden());
        const target = await page.locator('#brightness-toggle').evaluate(el => {
            const s = getComputedStyle(el); return {background:s.backgroundColor,border:s.borderTopWidth,highlight:s.webkitTapHighlightColor};
        });
        assert.equal(target.background, 'rgba(0, 0, 0, 0)');
        assert.equal(target.border, '0px');
        assert.equal(target.highlight, 'rgba(0, 0, 0, 0)');
        await page.reload();
        assert(await page.locator('#brightness-panel').isHidden());
        assert.equal(await opacity('#clock-container'), .62);
        assert.equal(await opacity('#earth-backdrop'), .55);
        assert.equal(await page.locator('#brightness-mode [aria-pressed="true"]').getAttribute('data-profile'), 'day');
        await page.locator('#brightness-toggle').tap();
        await selectProfile('auto');
        assert.equal(await opacity('#clock-container'), .05);
        assert.equal(await opacity('#earth-backdrop'), .75);
        // Both off must still leave the corner target and controls operable.
        await slide('#clock-brightness', 0); await slide('#earth-brightness', 0);
        await page.locator('#brightness-close').tap();
        await page.locator('#brightness-toggle').tap();
        assert(await page.locator('#brightness-panel').isVisible());
        await selectProfile('day');
        await page.setViewportSize({width:768,height:1024});
        const bounds = await page.locator('#brightness-panel').boundingBox();
        assert(bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.width <= 768 && bounds.y + bounds.height <= 1024);
        await page.screenshot({path:'/tmp/brightness-panel-portrait.png'});
        await page.keyboard.press('Escape');
        assert(await page.locator('#brightness-panel').isHidden());
        await page.screenshot({path:'/tmp/brightness-hidden-portrait.png'});
        await page.setViewportSize({width:1024,height:768});
        await page.locator('#brightness-toggle').tap();
        await page.screenshot({path:'/tmp/brightness-panel-landscape.png'});
        await selectProfile('auto');
        // Hidden and repeated resume events must not duplicate timers or miss morning switching.
        await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
        await page.clock.setSystemTime(new Date('2026-11-08T06:59:59Z'));
        for (let i = 0; i < 4; i++) await page.evaluate(() => window.dispatchEvent(new Event('pageshow')));
        await page.clock.runFor(1100);
        assert.equal(await opacity('#clock-container'), .62);
        assert.equal(await opacity('#earth-backdrop'), .55);
        assert.equal(await page.locator('.tick').count(), 60);
        assert.equal(await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(0, 0, 0)');
        const hand = await page.locator('#second-hand').evaluate(el => getComputedStyle(el).transform);
        // CSS animations use the browser animation timeline, not the mocked JS timers.
        await page.clock.resume();
        await page.waitForFunction(previous => getComputedStyle(document.getElementById('second-hand')).transform !== previous, hand);
        for (const resource of ['style.css','script.js','earth.js','earth-math.js','brightness.js']) {
            assert(requests.some(url => url.endsWith('/' + resource + '?v=brightness-2')));
        }
        // Corrupt and hostile saved values must never leave a broken or over-range UI.
        for (const saved of ['{broken', 'null', JSON.stringify({mode:'invalid', day:{clock:null, earth:'white'}}), JSON.stringify({mode:'night',night:{clock:-20,earth:500}}), JSON.stringify({mode:'day',day:{clock:100,earth:40}})]) {
            await page.evaluate(({key,saved}) => localStorage.setItem(key,saved), {key,saved});
            await page.reload();
            const expected = saved.includes('500') ? [0,1] : saved.includes('day":{"clock":100') ? [1,.4] : [1,1];
            assert.equal(await opacity('#clock-container'), expected[0]);
            assert.equal(await opacity('#earth-backdrop'), expected[1]);
        }
        // Old Safari private mode can allow reads and reject writes; also test blocked reads.
        for (const readsBlocked of [false,true]) {
            const blocked = await context.newPage();
            blocked.on('pageerror', error => errors.push(error.message));
            await blocked.addInitScript(readsBlocked => {
                Storage.prototype.setItem = function () { throw Error('storage blocked'); };
                if (readsBlocked) Storage.prototype.getItem = function () { throw Error('storage blocked'); };
            }, readsBlocked);
            await blocked.goto(origin + '/src/');
            await blocked.locator('#brightness-toggle').tap();
            await selectProfile('night', blocked);
            await blocked.locator('#clock-brightness').evaluate(el => { el.value = '7'; el.dispatchEvent(new Event('change')); });
            assert.equal(await blocked.locator('#clock-container').evaluate(el => Number(el.style.opacity)), .07);
            assert((await blocked.locator('#brightness-storage').textContent()).includes('unavailable'));
            await blocked.close();
        }
        assert.deepEqual(errors, []);
        fs.writeFileSync('/tmp/brightness-results.json',JSON.stringify({browser:browser.version(),checks:'profiles, schedule boundaries, resume, opacity independence, persistence, corrupt/blocked storage, touch toggle, hidden target, layout, metadata, animation, versioned assets',errors},null,2)+'\n');
        console.log('PASS production brightness controls; screenshots and results under /tmp/brightness-*');
    } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
