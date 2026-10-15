import { expect, test } from '@playwright/test';

test('Today shows a simple Watch → Try → Check path; tour opens in a player', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/#/today');
  await expect(page.getByTestId('learning-path')).toBeVisible();
  await page.screenshot({ path: `test-results/shots/${info.project.name}-today-path.png`, fullPage: true });
  await page.getByTestId('watch-tour').click();
  const player = page.getByTestId('tutorial-player');
  await expect(player).toBeVisible();
  await expect(page.getByTestId('tutorial-caption')).toContainText('Welcome to IRIS');
  expect(errors).toEqual([]);
});

test('cylinder tutorial: captions-only playback advances and scenes follow the model', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/#/learn/cylinder');
  await page.getByRole('group', { name: 'Narration' }).getByRole('button', { name: 'Captions only' }).click();
  await page.getByRole('group', { name: 'Speed' }).getByRole('button', { name: '1.25×' }).click();
  await page.getByTestId('tutorial-play').click();
  // step 1 (sphere) auto-advances to step 2 in captions mode
  await expect(page.getByTestId('tutorial-caption')).toContainText('Step 2 of 6', { timeout: 15000 });
  await page.getByTestId('tutorial-play').click(); // pause
  await page.getByRole('tab', { name: 'Go to step 3' }).click();
  await expect(page.locator('.tutorial-big')).toContainText('180° → plano');
  await page.getByRole('tab', { name: 'Go to step 4' }).click();
  await page.getByTestId('tutorial-play').click();
  await expect(page.locator('.tutorial-big')).toContainText('090° → −4.00', { timeout: 15000 });
  await page.screenshot({ path: `test-results/shots/${info.project.name}-tutorial-cylinder.png`, fullPage: true });
  expect(errors).toEqual([]);
});

for (const id of ['transpose', 'foci', 'retino', 'pupils', 'cover', 'fields', 'slitlamp']) {
  test(`tutorial ${id}: every step renders`, async ({ page }, info) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(`/#/learn/${id}`);
    const tabs = page.getByRole('tab');
    const n = await tabs.count();
    for (let i = 0; i < n; i++) {
      await tabs.nth(i).click();
      await expect(page.getByTestId('tutorial-caption')).toContainText(`Step ${i + 1} of ${n}`);
    }
    await page.screenshot({ path: `test-results/shots/${info.project.name}-tutorial-${id}.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}

test('studio help bar offers the matching tutorial', async ({ page }) => {
  await page.goto('/#/lab/LAB05');
  await expect(page.getByTestId('help-bar')).toBeVisible();
  await page.getByTestId('watch-pupils').click();
  await expect(page.getByTestId('tutorial-caption')).toContainText('Shine a light in one eye');
});

test('tutorials use the installed ElevenLabs recordings', async ({ page }) => {
  const mp3s: string[] = [];
  page.on('response', (r) => { if (r.url().endsWith('.mp3') && r.ok()) mp3s.push(r.url()); });
  await page.goto('/#/learn/tour');
  await page.getByRole('group', { name: 'Narration' }).getByRole('button', { name: /Voice/ }).first().click();
  await expect(page.getByText('Narration: ElevenLabs recording.')).toBeVisible();
  await page.getByTestId('tutorial-play').click();
  await expect.poll(() => mp3s.some((u) => u.endsWith('/audio/tour/welcome.mp3')), { timeout: 10000 }).toBe(true);
  await expect(page.getByTestId('tutorial-caption')).toContainText('Step 2 of 7', { timeout: 30000 });
  await expect.poll(() => mp3s.some((u) => u.endsWith('/audio/tour/today.mp3')), { timeout: 10000 }).toBe(true);
});
