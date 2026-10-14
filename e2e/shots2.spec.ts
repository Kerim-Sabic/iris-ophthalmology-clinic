import { test, expect } from '@playwright/test';
for (const id of ['LAB02', 'LAB03', 'LAB04', 'LAB05', 'LAB06', 'LAB07']) {
  test(`studio ${id} renders and interacts`, async ({ page }, info) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(`/#/lab/${id}`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(id);
    // click the first few buttons in the main region to exercise interactions
    const btns = page.locator('main button');
    const n = Math.min(await btns.count(), 14);
    for (let i = 2; i < n; i++) { const b = btns.nth(i); if ((await b.isEnabled({ timeout: 1000 }).catch(() => false)) && (await b.isVisible().catch(() => false))) await b.click({ timeout: 2000 }).catch(() => {}); }
    await page.screenshot({ path: `test-results/shots/${info.project.name}-${id}.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}
