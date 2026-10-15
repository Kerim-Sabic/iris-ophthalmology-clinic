/**
 * Scored studio journeys. Where the hidden answer comes from a seeded draw, the test re-derives the
 * hidden case from the displayed seed with the domain draw function (oracle for WHICH case was drawn);
 * the examination steps, grading and recording run through the real UI.
 */
import { expect, test, type Page } from '@playwright/test';
import { ALL_LESIONS, SITE_INFO } from '../src/domain/fields';
import { MOTILITY_FINDING_LABELS, motilityCase } from '../src/domain/motility';
import { PUPIL_FINDING_LABELS, pupilCase } from '../src/domain/pupils';
import { rng } from '../src/domain/random';

test.use({ reducedMotion: 'reduce' });

async function expectRecorded(page: Page, families: string[]) {
  await page.goto('/#/review');
  const sched = page.locator('details', { hasText: 'Full schedule' });
  await sched.locator('summary').click();
  for (const f of families) await expect(sched.getByRole('cell', { name: f, exact: true })).toBeVisible();
}

function noErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

test('LAB04: record a hidden patient’s distance acuity, moving closer only when needed', async ({ page }) => {
  const errors = noErrors(page);
  await page.goto('/#/lab/LAB04');
  await page.getByRole('group', { name: 'Mode' }).getByRole('button', { name: 'Independent challenge' }).click();
  await page.getByLabel('Variant seed').fill('424242');
  let recorded = false;
  for (const d of ['6', '3', '1']) {
    await page.getByRole('group', { name: 'Test distance' }).getByRole('button', { name: `${d} m` }).click();
    await page.getByRole('button', { name: 'Present the chart to the patient' }).click();
    const obs = await page.getByText(/^Observation:/).locator('..').innerText();
    const m = obs.match(/line labelled (\d+)/);
    if (m) {
      await page.getByPlaceholder('e.g. 6/12').fill(`${d}/${m[1]}`);
      await page.getByRole('button', { name: 'Check record' }).click();
      await expect(page.getByText('Correctly documented')).toBeVisible();
      recorded = true;
      break;
    }
  }
  expect(recorded, 'this seed draws a patient who can read the chart at ≤ 1 m').toBe(true);
  await expectRecorded(page, ['F-VA-RECORD']);
  expect(errors).toEqual([]);
});

test('LAB05: examine a hidden pupil case (light/dark, direct, swing) and submit a supported interpretation', async ({ page }) => {
  const errors = noErrors(page);
  await page.goto('/#/lab/LAB05');
  await page.getByRole('group', { name: 'Studio mode' }).getByRole('button', { name: 'Independent challenge' }).click();
  const seed = Number((await page.getByText(/^seed \d+$/).innerText()).replace('seed ', ''));
  const finding = pupilCase(seed).finding;
  await page.getByLabel('Predict before each move').uncheck();
  const room = page.getByRole('group', { name: 'Room illumination' });
  const torch = page.getByRole('group', { name: 'Torch position' });
  await room.getByRole('button', { name: 'Dark' }).click();
  await room.getByRole('button', { name: 'Ambient light' }).click();
  await room.getByRole('button', { name: 'Dark' }).click();
  await torch.getByRole('button', { name: /^OD/ }).click();
  await torch.getByRole('button', { name: /^OS/ }).click();
  await torch.getByRole('button', { name: /^OD/ }).click();
  await expect(page.locator('table.data tbody tr')).toHaveCount(7);
  await page.getByLabel(PUPIL_FINDING_LABELS[finding]).check();
  await page.getByRole('button', { name: 'Submit interpretation' }).click();
  await expect(page.getByText('Supported by the observations')).toBeVisible();
  await expectRecorded(page, [finding === 'symp-OD' || finding === 'symp-OS' || finding === 'para-OD' || finding === 'para-OS' || finding === 'physio' ? 'F-PUPIL-ANISOCORIA' : 'F-PUPIL-LOCALIZE']);
  expect(errors).toEqual([]);
});

test('LAB06: guided K2 prediction, then a hidden cover-test case', async ({ page }) => {
  const errors = noErrors(page);
  await page.goto('/#/lab/LAB06');
  const modes = page.getByRole('group', { name: 'Studio mode' });
  await modes.getByRole('button', { name: 'Guided practice' }).click();
  await page.getByRole('button', { name: 'Cover OD' }).click();
  await page.getByRole('group', { name: 'Prediction for OS' }).getByRole('button', { name: 'moves out' }).click();
  await page.getByRole('button', { name: 'Perform' }).click();
  await expect(page.getByText('Prediction matched')).toBeVisible();

  await modes.getByRole('button', { name: 'Independent challenge' }).click();
  const seed = Number((await page.getByText(/^seed \d+$/).innerText()).replace('seed ', ''));
  const finding = motilityCase(seed).finding;
  const predict = page.getByLabel('Predict before each move');
  if (await predict.isChecked()) await predict.uncheck();
  await page.getByRole('button', { name: 'Cover–uncover each eye' }).click();
  await page.getByRole('button', { name: 'Alternate cover' }).click();
  await page.getByLabel(MOTILITY_FINDING_LABELS[finding]).check();
  await page.getByRole('button', { name: 'Submit interpretation' }).click();
  await expect(page.getByText('Supported by the cover-test evidence')).toBeVisible();
  await expectRecorded(page, ['F-COVER-PREDICT', 'F-COVER-TEST']);
  expect(errors).toEqual([]);
});

test('LAB07: localise a hidden left homonymous hemianopia to every consistent right retrochiasmal site', async ({ page }) => {
  const errors = noErrors(page);
  const hidden = ALL_LESIONS.filter((l) => l.site !== 'optic-nerve' || l.variant === 'complete');
  let seed = 1;
  while (!(() => { const l = rng(seed).pick(hidden); return l.site === 'occipital' && l.side === 'R' && l.variant === 'complete'; })()) seed++;
  await page.goto('/#/lab/LAB07');
  await page.getByRole('group', { name: 'Mode' }).getByRole('button', { name: 'Independent challenge' }).click();
  await page.getByLabel('Variant seed').fill(String(seed));
  // Student reasoning (independent of the app's localiser): left homonymous → right tract, right LGN, right occipital.
  for (const site of ['optic-tract', 'lgn', 'occipital'] as const) await page.getByRole('button', { name: `Right ${SITE_INFO[site].name}`, exact: true }).click();
  await page.getByRole('button', { name: /Submit localization \(3 marked\)/ }).click();
  await expect(page.getByText('All consistent sites, none extra')).toBeVisible();
  await expectRecorded(page, ['F-FIELD-LOCALIZE']);
  expect(errors).toEqual([]);
});

test('LAB08: expose AC cells with a conical beam and endothelial deposits in an optical section, then document', async ({ page }, info) => {
  const errors = noErrors(page);
  await page.goto('/#/lab/LAB08');
  await page.getByRole('group', { name: 'Studio mode' }).getByRole('button', { name: 'Patient case' }).click();
  const obs = page.getByTestId('slit-observation');
  // Diffuse light: nothing in the aqueous is visible.
  await page.getByLabel('Focus depth').fill('1.5');
  await expect(obs).toContainText('No finding visible');
  // Documenting before exposure is unsupported (tested in unit tests); here build the evidence first.
  await page.getByLabel('Room lights off').check();
  await page.getByRole('group', { name: 'Magnification' }).getByRole('button', { name: '16×' }).click();
  await page.getByLabel('Beam width').fill('0.2');
  await page.getByLabel('Beam height').fill('1');
  await expect(obs).toContainText('Conical');
  await expect(obs).toContainText('small particles moving in the beam');
  await expect(obs).toContainText('No grade');
  await page.getByLabel('Beam height').fill('8');
  await page.getByLabel('Focus depth').fill('0.51');
  await expect(obs).toContainText('Optical section');
  await expect(obs).toContainText('corneal endothelium: fine pigmented dots');
  await page.screenshot({ path: `test-results/shots/${info.project.name}-LAB08-section.png`, fullPage: true });
  const nb = page.getByTestId('slit-notebook');
  for (const [layer, desc] of [['Anterior chamber (aqueous)', 'small particles moving in the beam'], ['Corneal endothelium', 'fine pigmented dots']]) {
    await nb.getByLabel('Layer').selectOption({ label: layer });
    await nb.getByLabel('Description').selectOption({ label: desc });
    await nb.getByRole('button', { name: 'Add to note' }).click();
  }
  await page.getByTestId('submit-slit').click();
  await expect(page.getByText('Documentation supported by what you exposed')).toBeVisible();
  await expect(page.getByTestId('slit-grade')).not.toContainText('unsupported');
  await expectRecorded(page, ['F-SLIT-DOCUMENT']);
  expect(errors).toEqual([]);
});

test('Clinical case (right occipital): full examination through the shared models gives a supported note', async ({ page }) => {
  const errors = noErrors(page);
  await page.goto('/#/patients');
  await page.getByTestId('case-Patient J').click();
  const cc = page.getByTestId('clinical-case');
  for (const b of ['OD unaided', 'OS unaided', 'Resting size: light vs dark', 'Swinging light', 'Request automated field']) await cc.getByRole('button', { name: b, exact: true }).click();
  for (const b of ['Cover OD', 'Uncover', 'Cover OS', 'Uncover']) await cc.getByRole('button', { name: b, exact: true }).click();
  await cc.getByRole('button', { name: 'Perform sequence' }).click();
  const obsList = page.getByTestId('clinical-observations');
  await expect(obsList).toContainText('left eye loss in the superior patient-left, inferior patient-left');
  await expect(obsList).toContainText('light to OD: both constricts');
  const nb = page.getByTestId('clinical-notebook');
  await nb.getByLabel('Pupil finding').selectOption({ label: PUPIL_FINDING_LABELS.none });
  await nb.getByLabel('Field pattern').selectOption({ label: 'Left homonymous hemianopia with macular sparing' });
  await nb.getByLabel('Alignment finding').selectOption({ label: MOTILITY_FINDING_LABELS.ortho });
  await nb.getByLabel('Localisation finding').selectOption('retro-right');
  await nb.getByLabel('Next action choice').selectOption('neuro');
  await page.getByTestId('submit-clinical').click();
  await expect(page.getByText('Assessment supported by your evidence')).toBeVisible();
  const note = page.getByTestId('clinical-note');
  await expect(note).toContainText('Swinging light');
  await expect(note).not.toContainText('confronted');
  expect(errors).toEqual([]);
});

test('Clinical case (afferent): a normal pupil note without examining pupils is unsupported', async ({ page }) => {
  await page.goto('/#/patients/pt-q1v');
  const cc = page.getByTestId('clinical-case');
  await cc.getByRole('button', { name: 'OD pinhole', exact: true }).click();
  await expect(page.getByTestId('clinical-observations')).toContainText('OD distance acuity with pinhole (6 m): 6/36');
  const nb = page.getByTestId('clinical-notebook');
  await nb.getByLabel('Pupil finding').selectOption({ label: PUPIL_FINDING_LABELS.none });
  await nb.getByLabel('Field pattern').selectOption('not-examined');
  await nb.getByLabel('Alignment finding').selectOption('not-examined');
  await nb.getByLabel('Localisation finding').selectOption('prechiasmal-OD');
  await nb.getByLabel('Next action choice').selectOption('urgent');
  await page.getByTestId('submit-clinical').click();
  const dims = page.getByTestId('clinical-dims');
  await expect(dims).toContainText('unsupported');
  await expect(dims).toContainText('correctly recorded as not examined');
  await expect(page.getByTestId('clinical-note')).not.toContainText('Swinging');
});
