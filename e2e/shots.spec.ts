import { test } from '@playwright/test';
const pages = [
  ['explore', '/#/lab/LAB01?mode=explore&S=1&C=-3&A=45'],
  ['focus', '/#/lab/LAB01?mode=explore&S=0&C=-4&A=180'],
  ['guided', '/#/lab/LAB01?mode=guided&family=F-CROSS-OBLIQUE'],
  ['lab02', '/#/lab/LAB02'],
  ['lab03-lenso', '/#/lab/LAB03'],
  ['case', '/#/patients/pt-5x1'],
  ['lab', '/#/lab'],
  ['lecture', '/#/lectures/L05'],
  ['today', '/#/today'],
];
for (const [name, url] of pages) {
  test(`shot ${name}`, async ({ page }, info) => {
    await page.goto(url);
    await page.waitForTimeout(400);
    if (name === 'focus') await page.getByRole('button', { name: 'Focus in the eye' }).click();
    if (name === 'lab03-lenso') await page.getByRole('button', { name: 'Lensometer (T020)' }).click();
    if (name === 'case') { await page.getByRole('button', { name: 'Static retinoscopy' }).click(); }
    if (name === 'lab02') { await page.getByRole('slider', { name: 'Streak sweep position' }).fill('0.6'); }
    await page.screenshot({ path: `test-results/shots/${info.project.name}-${name}.png`, fullPage: true });
  });
}
