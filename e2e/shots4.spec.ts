import { test } from '@playwright/test';
const want: [string, number][] = [['acuity', 3], ['acuity', 5], ['note', 3], ['rxdesk', 5]];
for (const [id, step] of want) {
  test(`shot ${id} step ${step}`, async ({ page }, info) => {
    await page.goto(`/#/learn/${id}`);
    await page.getByRole('tab', { name: `Go to step ${step}` }).click();
    await page.waitForTimeout(300);
    await page.locator('.tutorial-stage').screenshot({ path: `test-results/shots/${info.project.name}-${id}-${step}.png` });
  });
}
