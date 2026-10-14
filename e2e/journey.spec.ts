import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';

const D = (t: string) => Number(t.replace('−', '-').replace(/[^\d.+-]/g, ''));

async function typeRx(page: Page, prefix: string, text: string) {
  const scope = page.locator(`#${prefix}-text`);
  if (!(await scope.isVisible())) await page.getByRole('group', { name: 'Entry mode' }).last().getByRole('button', { name: 'Type it' }).click();
  await page.locator(`#${prefix}-text`).fill(text);
}

test('mandatory first journey: scope → mission → reload → review → exam → export/import', async ({ page }, info) => {
  page.on('dialog', (d) => d.accept());
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/#/today');
  await expect(page.getByRole('heading', { name: 'Solve this lens' })).toBeVisible();

  // scope: L05 + one clinical lecture (L09)
  await page.goto('/#/lectures');
  await page.getByRole('group', { name: 'Scope for L05' }).getByRole('button', { name: 'Include' }).click();
  await page.getByRole('group', { name: 'Scope for L09' }).getByRole('button', { name: 'Include' }).click();
  await page.getByTestId('save-scope').click();
  await expect(page.getByText(/Saved as v1/)).toBeVisible();

  // exact cylinder mission
  await page.goto('/#/lab/LAB01?mode=mission');
  for (const v of ['-1', '-2', '-3', '-4']) {
    await page.locator('#predict-input').fill(v);
    await page.getByRole('button', { name: 'Commit prediction' }).click();
  }
  await expect(page.getByText('Prediction matches the model').first()).toBeVisible();
  await page.screenshot({ path: `test-results/shots/${info.project.name}-mission-predicted.png`, fullPage: true });
  await page.getByRole('button', { name: 'Continue: rotate the meridian' }).click();
  await page.getByRole('button', { name: /I have explored/ }).click();
  // a wrong answer first: −4.00 DS → targeted feedback
  await typeRx(page, 'mission-write', '-4.00 DS');
  await page.getByRole('button', { name: 'Check my lens' }).click();
  await expect(page.getByText(/supplies that power in every meridian/)).toBeVisible();
  await page.screenshot({ path: `test-results/shots/${info.project.name}-mission-feedback.png`, fullPage: true });
  await typeRx(page, 'mission-write', 'plano -4.00 x 180');
  await page.getByRole('button', { name: 'Check my lens' }).click();
  await page.getByRole('button', { name: 'Next: plus-cylinder form' }).click();
  await typeRx(page, 'mission-plus', '-4.00 +4.00 x 090');
  await page.getByRole('button', { name: 'Check', exact: true }).click();
  await expect(page.getByTestId('transposition')).toBeVisible();
  await page.getByRole('slider', { name: 'Representation scrubber' }).fill('0.5');
  await page.screenshot({ path: `test-results/shots/${info.project.name}-transposition-mid.png`, fullPage: true });
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByLabel('Cannot be established from the isolated lens image').check();
  await page.getByRole('button', { name: 'Commit' }).click();
  await page.getByRole('button', { name: 'Supply the patient context' }).click();
  await page.getByLabel('Refractive classification').selectOption('simple-myopic-astigmatism');
  await page.getByLabel('Principal meridian needing no correction').selectOption('180');
  await page.getByLabel('Principal meridian needing minus correction').selectOption('90');
  await page.getByRole('button', { name: 'Submit classification' }).click();
  await expect(page.getByText('Supported classification')).toBeVisible();
  await page.getByRole('button', { name: /Final task/ }).click();

  // oblique: probe the unknown lens with the keyboard to find the principal meridians
  const handle = page.getByRole('slider', { name: 'Measurement meridian' });
  await handle.focus();
  const samples: { p: number; m: number }[] = [];
  for (let i = 0; i < 180; i++) {
    await handle.press('ArrowLeft');
    samples.push({ p: D(await page.getByTestId('probe-power').innerText()), m: Number(await handle.getAttribute('aria-valuenow')) });
  }
  const maxP = Math.max(...samples.map((s) => s.p));
  const minP = Math.min(...samples.map((s) => s.p));
  // centre of the plateau of the maximum (readouts are rounded) — handle wrap-around at 180/1
  const atMax = samples.filter((s) => s.p === maxP).map((s) => s.m);
  const spread = Math.max(...atMax) - Math.min(...atMax);
  const centre = spread > 90 ? ((atMax.map((m) => (m < 90 ? m + 180 : m)).reduce((a, b) => a + b, 0) / atMax.length) % 180) : atMax.reduce((a, b) => a + b, 0) / atMax.length;
  const best = { p: maxP, m: Math.round(centre) || 180 };
  const worst = { p: minP };
  const sg = (x: number) => (x >= 0 ? '+' : '') + x.toFixed(2);
  await typeRx(page, 'mission-oblique', `${sg(best.p)} ${sg(worst.p - best.p)} x ${best.m}`);
  await page.getByRole('button', { name: 'Check', exact: true }).click();
  await expect(page.getByText('Correct', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'See summary' }).click();
  await expect(page.getByTestId('mission-summary')).toBeVisible();

  // reload → retained
  await page.reload();
  await expect(page.getByTestId('mission-summary')).toBeVisible();
  await expect(page.getByText(/Delayed retrieval scheduled/)).toBeVisible();

  // advance the controlled clock → due review
  await page.goto('/#/settings');
  await page.getByTestId('advance-day').click();
  await page.goto('/#/review');
  const task = page.getByTestId('review-task');
  await expect(task).toBeVisible();
  if (await task.locator('input[type=radio]').count()) await task.locator('input[type=radio]').first().check();
  else if (await task.locator('input[id^="n-"]').count()) await task.locator('input[id^="n-"]').fill('0');
  else if (await task.getByRole('button', { name: 'Type it' }).count()) {
    await task.getByRole('button', { name: 'Type it' }).click();
    await task.locator('input[id$="-text"]').fill('plano DS');
  } else for (const inp of await task.locator('input.num').all()) await inp.fill('90');
  await task.getByRole('button', { name: /^Submit/ }).click();
  await expect(task.getByText(/^(Correct|Not yet)/).first()).toBeVisible();

  // selected-scope exam
  await page.goto('/#/exam');
  await page.getByRole('button', { name: 'Use my scope' }).click();
  await page.getByTestId('create-exam').click();
  await expect(page.getByTestId('exam-session')).toBeVisible();
  await page.reload(); // interrupted exam persists
  await expect(page.getByTestId('exam-session')).toBeVisible();
  await page.getByTestId('submit-exam').click();
  await expect(page.getByTestId('exam-results')).toBeVisible();

  // export → import into a fresh profile
  await page.goto('/#/settings');
  const before = await page.getByText(/attempts · \d+ scope snapshots/).innerText();
  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByTestId('export').click()]);
  const path = join(tmpdir(), `iris-export-${info.project.name}.json`);
  await dl.saveAs(path);
  await page.getByRole('button', { name: 'Create fresh profile' }).click();
  await expect(page.getByText(/^0 attempts/)).toBeVisible();
  await page.getByTestId('import').setInputFiles(path);
  await expect(page.getByText(/Imported into a new profile/)).toBeVisible();
  await expect(page.getByText(/attempts · \d+ scope snapshots/)).toHaveText(before);
  await page.goto('/#/lectures');
  await expect(page.getByRole('group', { name: 'Scope for L05' }).getByRole('button', { name: 'Include' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('group', { name: 'Scope for L09' }).getByRole('button', { name: 'Include' })).toHaveAttribute('aria-pressed', 'true');
  expect(errors).toEqual([]);
});

test('reduced motion: transposition offers steps, no autoplay', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:5199/#/lab/LAB01?mode=explore');
  await page.getByRole('button', { name: 'Transposition' }).click();
  await expect(page.getByRole('button', { name: 'Play' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Step ▶' })).toBeVisible();
  await ctx.close();
});

test('storage unavailable and malformed import are reported, not hidden', async ({ page }, info) => {
  await page.goto('/?nostorage=1#/today');
  await expect(page.getByText(/Progress will not be saved/)).toBeVisible();
  await page.goto('/#/settings');
  const p = join(tmpdir(), 'iris-bad.json');
  writeFileSync(p, '{"format":"nope"}');
  await page.getByTestId('import').setInputFiles(p);
  await expect(page.getByText(/Import rejected/)).toBeVisible();
});

test('45 vs 135 trap in explore compare', async ({ page }) => {
  await page.goto('/#/lab/LAB01?mode=explore&S=0&C=-4&A=45');
  await page.getByRole('group', { name: 'Compare with' }).getByRole('button', { name: 'Mirror axis' }).click();
  await expect(page.getByText(/Different lens: largest difference/)).toBeVisible();
});

test('refraction patient: retinoscopy on shared target, note only from obtained evidence', async ({ page }) => {
  await page.goto('/#/patients/pt-4k2');
  await page.getByRole('button', { name: 'Restart case' }).click().catch(() => {});
  page.on('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Distance acuity, unaided (6 m)' }).click();
  await expect(page.getByText('OD unaided distance acuity: 6/12')).toBeVisible();
  await page.getByRole('button', { name: 'Static retinoscopy' }).click();
  const r = page.getByTestId('retinoscope');
  await expect(page.getByTestId('reflex-observation')).toContainText('WITH');
  await r.getByRole('button', { name: '+1.00' }).click();
  await r.getByRole('button', { name: '+1.00' }).click();
  await expect(page.getByTestId('reflex-observation')).toContainText('Neutral');
  await page.getByTestId('record-neutral').click();
  await r.getByRole('button', { name: 'Horizontal streak (measures 90°)' }).click();
  await expect(page.getByTestId('reflex-observation')).toContainText('AGAINST');
  for (let i = 0; i < 8; i++) await r.getByRole('button', { name: '−0.25' }).nth(1).click();
  await expect(page.getByTestId('reflex-observation')).toContainText('Neutral');
  await page.getByTestId('record-neutral').click();
  const nb = page.getByTestId('case-notebook');
  await nb.locator('#case-OD-sph').fill('0');
  await nb.locator('#case-OD-cyl').fill('-2.00');
  await nb.locator('#case-OD-ax').fill('180');
  await nb.locator('#case-OS-sph').fill('0');
  await nb.locator('#case-OS-cyl').fill('-1.75');
  await nb.locator('#case-OS-ax').fill('180');
  await nb.locator('select').nth(0).selectOption('simple-myopic-astigmatism');
  await nb.locator('select').nth(1).selectOption('simple-myopic-astigmatism');
  await nb.locator('select').nth(2).selectOption('rx');
  await page.getByTestId('submit-case').click();
  await expect(nb.getByText('exact (optically equivalent)').first()).toBeVisible();
  await expect(nb.getByText('unsupported: no refraction was performed on this eye')).toBeVisible();
  const note = page.getByTestId('case-note');
  await expect(note).toContainText('OD retinoscopy records');
  await expect(note).not.toContainText('OS retinoscopy');
  await expect(note).not.toContainText('OS VA');
});
