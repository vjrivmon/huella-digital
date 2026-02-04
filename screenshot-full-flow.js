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
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(APP, { waitUntil: 'networkidle2', timeout: 15000 });
  await page.evaluate((ld) => {
    localStorage.clear(); localStorage.setItem('token', ld.token);
    const ud = { ...ld.usuario, token: ld.token, lastLogin: new Date().toISOString(), expiresAt: new Date(Date.now()+86400000).toISOString() };
    localStorage.setItem('osyris_user', JSON.stringify(ud)); localStorage.setItem('user', JSON.stringify(ud)); localStorage.setItem('userRole', ld.usuario.rol);
  }, ld);

  // Dashboard
  await page.goto(`${APP}/admin/circulares`, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'flow-1-dashboard.png'), fullPage: true });

  // Click circular
  await page.evaluate(() => {
    document.querySelectorAll('.cursor-pointer').forEach(c => {
      if (c.textContent.includes('Campamento de Aniversario')) c.click();
    });
  });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'flow-2-detail-all-signed.png'), fullPage: true });

  // Click Ver on Lucía (first Ver button - Lucía is now signed too)
  await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('button')];
    const verBtn = buttons.find(b => b.textContent.includes('Ver'));
    if (verBtn) verBtn.click();
  });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'flow-3-modal-lucia.png'), fullPage: false });

  console.log('Done!');
  await browser.close();
}
run().catch(e => { console.error('Error:', e.message); process.exit(1); });
