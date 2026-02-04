const puppeteer = require('puppeteer');
const path = require('path');
const SCREENSHOTS_DIR = '/root/.openclaw/workspace/screenshots';
const API = 'http://localhost:5000';
const APP = 'http://localhost:3000';

async function loginViaAPI(email, password) {
  const resp = await fetch(`${API}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  return (await resp.json()).data;
}

async function setSession(page, ld) {
  await page.evaluate((ld) => {
    localStorage.clear();
    localStorage.setItem('token', ld.token);
    const ud = { ...ld.usuario, token: ld.token, lastLogin: new Date().toISOString(), expiresAt: new Date(Date.now() + 86400000).toISOString() };
    localStorage.setItem('osyris_user', JSON.stringify(ud));
    localStorage.setItem('user', JSON.stringify(ud));
    localStorage.setItem('userRole', ld.usuario.rol);
  }, ld);
}

async function run() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const adminData = await loginViaAPI('web.osyris@gmail.com', 'admin123');
  await page.goto(APP, { waitUntil: 'networkidle2', timeout: 15000 });
  await setSession(page, adminData);

  // Go to circulares dashboard
  console.log('1. Go to dashboard...');
  await page.goto(`${APP}/admin/circulares`, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 3000));

  // Click on "Campamento de Aniversario" card (the one with 1/2)
  console.log('2. Click on Campamento de Aniversario...');
  const clicked = await page.evaluate(() => {
    const cards = document.querySelectorAll('[data-testid="circulares-list"] .cursor-pointer');
    for (const card of cards) {
      if (card.textContent.includes('Campamento de Aniversario')) {
        card.click();
        return true;
      }
    }
    // Try all clickable cards
    const allCards = document.querySelectorAll('.cursor-pointer');
    for (const card of allCards) {
      if (card.textContent.includes('Campamento de Aniversario')) {
        card.click();
        return true;
      }
    }
    return false;
  });
  console.log('Clicked:', clicked);
  
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'detail-dashboard.png'), fullPage: true });

  // Scroll down to see table
  await page.evaluate(() => window.scrollBy(0, 400));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'detail-dashboard-table.png'), fullPage: true });

  console.log('Done!');
  await browser.close();
}

run().catch(e => { console.error('Error:', e.message); process.exit(1); });
