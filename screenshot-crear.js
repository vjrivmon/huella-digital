const puppeteer = require('puppeteer');
const path = require('path');
const SCREENSHOTS_DIR = '/root/.openclaw/workspace/screenshots';
const API = 'http://localhost:5000';
const APP = 'http://localhost:3000';

async function run() {
  const resp = await fetch(`${API}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'web.osyris@gmail.com', password: 'admin123' }) });
  const ld = (await resp.json()).data;

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1200 });
  await page.goto(APP, { waitUntil: 'networkidle2', timeout: 15000 });
  await page.evaluate((ld) => {
    localStorage.clear(); localStorage.setItem('token', ld.token);
    const ud = { ...ld.usuario, token: ld.token, lastLogin: new Date().toISOString(), expiresAt: new Date(Date.now()+86400000).toISOString() };
    localStorage.setItem('osyris_user', JSON.stringify(ud)); localStorage.setItem('user', JSON.stringify(ud)); localStorage.setItem('userRole', ld.usuario.rol);
  }, ld);

  await page.goto(`${APP}/admin/circulares`, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  // Click "Crear Circular" tab
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Crear Circular')) { await btn.click(); break; }
  }
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'crear-circular-top.png'), fullPage: true });

  console.log('Done!');
  await browser.close();
}
run().catch(e => { console.error('Error:', e.message); process.exit(1); });
