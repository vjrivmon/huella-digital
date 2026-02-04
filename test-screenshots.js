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
  await page.evaluate((loginData) => {
    const data = loginData;
    localStorage.clear();
    localStorage.setItem('token', data.token);
    const userData = {
      ...data.usuario,
      token: data.token,
      lastLogin: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString()
    };
    localStorage.setItem('osyris_user', JSON.stringify(userData));
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userRole', data.usuario.rol);
    if (data.usuario.rol === 'familia') {
      localStorage.setItem('familia_token', data.token);
    }
  }, loginData);
}

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Login admin via API
  console.log('1. Login admin via API...');
  const adminData = await loginViaAPI('web.osyris@gmail.com', 'admin123');

  // Set admin session in browser
  await page.goto(APP, { waitUntil: 'networkidle2', timeout: 15000 });
  await setSession(page, adminData);

  // Admin circulares
  console.log('2. Admin circulares page...');
  await page.goto(`${APP}/admin/circulares`, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01-admin-circulares.png'), fullPage: true });

  // Login familiar via API
  console.log('3. Login familiar via API...');
  const famData = await loginViaAPI('maria.garcia@test.com', 'admin123');

  // Set familiar session
  await setSession(page, famData);

  // Familia circulares list
  console.log('4. Familia circulares list...');
  await page.goto(`${APP}/familia/circulares`, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02-familia-lista.png'), fullPage: true });

  // Familia circular detail (Lucía, educando 2 - not signed)
  console.log('5. Familia wizard (Lucía)...');
  await page.goto(`${APP}/familia/circulares/1?educandoId=2`, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03-wizard-step1.png'), fullPage: true });

  // Click "Siguiente" to go through steps
  try {
    const nextBtn = await page.$('button:has-text("Siguiente")');
    if (nextBtn) {
      await nextBtn.click();
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04-wizard-step2.png'), fullPage: true });
      
      // Next step
      const nextBtn2 = await page.$('button:has-text("Siguiente")');
      if (nextBtn2) {
        await nextBtn2.click();
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05-wizard-step3.png'), fullPage: true });
      }
    }
  } catch(e) {
    console.log('Could not click next buttons:', e.message);
  }

  // Try to navigate through wizard by clicking buttons with xpath
  console.log('6. Navigating wizard steps...');
  for (let step = 2; step <= 6; step++) {
    try {
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text && text.includes('Siguiente')) {
          await btn.click();
          await new Promise(r => setTimeout(r, 2000));
          await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `06-wizard-step${step}.png`), fullPage: true });
          break;
        }
      }
    } catch(e) {
      console.log(`Step ${step}: ${e.message}`);
    }
  }

  console.log('Done! Screenshots in', SCREENSHOTS_DIR);
  await browser.close();
}

run().catch(e => { console.error('Error:', e.message); process.exit(1); });
