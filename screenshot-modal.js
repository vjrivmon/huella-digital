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

  console.log('1. Go to dashboard...');
  await page.goto(`${APP}/admin/circulares`, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 3000));

  // Click on "Campamento de Aniversario"
  console.log('2. Click on circular...');
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.cursor-pointer');
    for (const card of cards) {
      if (card.textContent.includes('Campamento de Aniversario')) { card.click(); break; }
    }
  });
  await new Promise(r => setTimeout(r, 3000));
  
  // Screenshot: dashboard with "Ver" button visible
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'dashboard-ver-btn.png'), fullPage: true });

  // Click "Ver" button for Pablo (the one that's firmada)
  console.log('3. Click Ver button...');
  const clicked = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
      if (btn.textContent.includes('Ver')) { btn.click(); return true; }
    }
    return false;
  });
  console.log('Clicked Ver:', clicked);
  await new Promise(r => setTimeout(r, 3000));
  
  // Screenshot: modal with detail
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'modal-detalle.png'), fullPage: false });

  console.log('Done!');
  await browser.close();
}
run().catch(e => { console.error('Error:', e.message); process.exit(1); });
