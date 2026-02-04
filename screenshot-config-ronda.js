const puppeteer = require('puppeteer');
const path = require('path');
const SCREENSHOTS_DIR = '/root/.openclaw/workspace/screenshots';
const API = 'http://localhost:5000';
const APP = 'http://localhost:3000';

async function loginViaAPI(email, password) {
  const resp = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await resp.json();
  return data.data;
}

async function setSession(page, loginData) {
  await page.evaluate((ld) => {
    localStorage.clear();
    localStorage.setItem('token', ld.token);
    const userData = { ...ld.usuario, token: ld.token, lastLogin: new Date().toISOString(), expiresAt: new Date(Date.now() + 86400000).toISOString() };
    localStorage.setItem('osyris_user', JSON.stringify(userData));
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userRole', ld.usuario.rol);
  }, loginData);
}

async function run() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const adminData = await loginViaAPI('web.osyris@gmail.com', 'admin123');
  await page.goto(APP, { waitUntil: 'networkidle2', timeout: 15000 });
  await setSession(page, adminData);

  // Config Ronda tab
  console.log('1. Config Ronda tab...');
  await page.goto(`${APP}/admin/circulares`, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));
  
  // Click on "Config Ronda" tab
  const tabs = await page.$$('button');
  for (const tab of tabs) {
    const text = await page.evaluate(el => el.textContent, tab);
    if (text && text.includes('Config Ronda')) {
      await tab.click();
      await new Promise(r => setTimeout(r, 2000));
      break;
    }
  }
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'config-ronda.png'), fullPage: true });

  // Scroll down to see more
  await page.evaluate(() => window.scrollBy(0, 600));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'config-ronda-2.png'), fullPage: true });

  // Click on circular "Campamento de Aniversario" (1/2 firmadas)
  console.log('2. Click circular detail...');
  await page.goto(`${APP}/admin/circulares`, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));
  
  // Click on the first circular card
  const cards = await page.$$('[class*="card"], [class*="Card"], div[class*="cursor"]');
  if (cards.length > 0) {
    await cards[0].click();
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'circular-detail.png'), fullPage: true });
  } else {
    // Try clicking on the text
    const links = await page.$$('a, [role="button"], div');
    for (const link of links) {
      const text = await page.evaluate(el => el.textContent, link);
      if (text && text.includes('Campamento de Aniversario') && text.includes('1/2')) {
        await link.click();
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'circular-detail.png'), fullPage: true });
        break;
      }
    }
  }

  console.log('Done!');
  await browser.close();
}

run().catch(e => { console.error('Error:', e.message); process.exit(1); });
