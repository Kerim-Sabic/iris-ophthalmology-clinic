import { test } from '@playwright/test';
test('shots: new screens', async ({ page }, info) => {
  await page.goto('/#/patients');
  await page.screenshot({ path: `test-results/shots/${info.project.name}-patients.png`, fullPage: true });
  await page.goto('/#/patients/pt-m2e');
  const cc = page.getByTestId('clinical-case');
  for (const b of ['Cover OD', 'Uncover', 'Cover OS', 'Uncover']) await cc.getByRole('button', { name: b, exact: true }).click();
  await cc.getByRole('button', { name: 'Perform sequence' }).click();
  await cc.getByRole('button', { name: 'Resting size: light vs dark' }).click();
  await page.screenshot({ path: `test-results/shots/${info.project.name}-clinical.png`, fullPage: true });
});
