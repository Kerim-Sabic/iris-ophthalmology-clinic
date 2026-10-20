import { expect, test } from '@playwright/test';

test('diagnosis writing: learn → lecture examples → presbyopia trap → exam → checker', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('dialog', (d) => d.accept());
  const shot = async (n: string) => { await page.waitForTimeout(1400); await page.screenshot({ path: `test-results/shots/${info.project.name}-dg-${n}.png`, fullPage: true }); };

  await page.goto('/#/today');
  await expect(page.getByRole('heading', { name: 'What do you want to do?' })).toBeVisible();
  await shot('home');
  await page.getByTestId('hero-dg').click();

  // lesson 1: click a token to get its explanation
  await page.getByRole('button', { name: 'VOS: explain' }).click();
  await expect(page.getByText(/oculi sinistri/).first()).toBeVisible();
  await page.getByRole('button', { name: 'ax: explain' }).click();
  await expect(page.getByText('ax — axis')).toBeVisible();
  await shot('learn-line');

  // lesson 2: find-it game, answer all 7
  await page.getByTestId('lesson-next').click();
  const answers = ['VOD', '0.4', '+1.00', '-2.00', '90', '1.0', 'Dg?'];
  for (const a of answers) {
    await page.getByRole('button', { name: `${a}: explain` }).first().click();
    await page.waitForTimeout(750);
  }
  await expect(page.getByText(/All 7 found/)).toBeVisible();

  // lesson 3: rule table row click updates the example
  await page.getByTestId('lesson-next').click();
  await page.getByRole('row', { name: /Astigmatismus mixtus/ }).click();
  await expect(page.getByText('→ Astigmatismus mixtus')).toBeVisible();
  await shot('learn-rule');
  // lesson 4: the plus-cylinder trap
  await page.getByTestId('lesson-next').click();
  await page.getByTestId('flip-trap').click();
  await expect(page.getByText('+1.00 dsph −1.00 dcyl ax 90')).toBeVisible();
  // lesson 5: presbyopia
  await page.getByTestId('lesson-next').click();
  await expect(page.getByTestId('near-panel')).toBeVisible();
  await shot('learn-presbyopia');

  // lecture example 1 with the builder
  await page.goto('/#/dg/examples');
  const card = page.getByTestId('dg-card');
  await card.getByRole('radiogroup', { name: 'OD diagnosis' }).getByRole('radio', { name: 'Myopia' }).click();
  await card.getByRole('radiogroup', { name: 'OS diagnosis' }).getByRole('radio', { name: 'Astig. myop. simplex' }).click();
  await card.getByRole('button', { name: 'rectus' }).click();
  await expect(card.getByText('Dg: Myopia OD; Astigmatismus myopicus simplex rectus OS')).toBeVisible();
  await page.getByTestId('dg-check').click();
  await expect(page.getByText('Correct!')).toBeVisible();
  await page.getByTestId('solve-OS').click();
  for (let i = 0; i < 9; i++) { const b = page.getByTestId('dstep-next'); if (await b.isEnabled()) await b.click(); }
  await expect(page.getByText(/Step \d: Write the diagnosis/)).toBeVisible();
  await shot('example1-solved');

  // lecture example 5 written incompletely → specific feedback
  await page.getByTestId('ex-LEC-5').click();
  await card.getByRole('button', { name: 'Write it myself' }).click();
  await page.getByTestId('dg-text').fill('Dg: Hypermetropia OU');
  await expect(page.getByText(/We read:/)).toBeVisible();
  await page.getByTestId('dg-check').click();
  await expect(page.getByText('Not quite — see what differs')).toBeVisible();
  await expect(page.getByText(/Anisometropia should be mentioned/)).toBeVisible();
  await expect(page.getByText(/does not reach 1.0 even with the lens/)).toBeVisible();

  // presbyopia trap (age only)
  await page.getByTestId('ex-PRES-4').click();
  await card.getByRole('button', { name: 'Write it myself' }).click();
  await page.getByTestId('dg-text').fill('Astigmatismus myopicus compositus rectus OD; Emmetropia OS; Presbyopia');
  await page.getByTestId('dg-check').click();
  await expect(page.getByText(/Do not diagnose it from age alone/)).toBeVisible();
  await shot('presbyopia-trap');

  // exam
  await page.goto('/#/dg/exam');
  await page.getByRole('group', { name: 'Number of cases' }).getByRole('button', { name: '5' }).click();
  await page.getByTestId('dg-exam-start').click();
  await expect(page.getByTestId('dg-exam')).toBeVisible();
  await page.getByTestId('dg-text').fill('Dg: Myopia OU');
  await page.reload();
  await expect(page.getByTestId('dg-text')).toHaveValue('Dg: Myopia OU');
  await page.getByTestId('dg-exam-submit').click();
  await expect(page.getByTestId('dg-exam-results')).toBeVisible();
  await shot('exam-results');

  // checker
  await page.goto('/#/dg/sheet');
  await page.getByTestId('checker-input').fill('VOD: sc 0.5, cc +1.00 dsph +1.00 dcyl ax 180 1.0\nVOS: sc 0.8, cc +1.00 dcyl ax 180 1.0');
  await expect(page.getByTestId('checker-answer')).toContainText('Astigmatismus hypermetropicus compositus inversus OD; Astigmatismus hypermetropicus simplex inversus OS');
  await shot('sheet');
  expect(errors).toEqual([]);
});
