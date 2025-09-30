import { expect, test } from '@playwright/test';

test.describe('Trash Simulator UI', () => {
  test('runs a simulation and shows results', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Trash Simulator' })).toBeVisible();

    const runsInput = page.getByLabel('Number of runs');
    await runsInput.fill('50');

    await page.getByRole('button', { name: /run simulation/i }).click();

    await expect(page.getByText('Runs: 50')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/Perfect first-round wins/i)).toBeVisible();
  });

  test('persists theme selection', async ({ page }) => {
    await page.goto('/');

    const themePicker = page.getByRole('combobox');
    await themePicker.selectOption('dark');

    await expect(await page.evaluate(() => localStorage.getItem('trash-sim-theme'))).toBe('dark');

    await page.reload();

    await expect(page.getByRole('combobox')).toHaveValue('dark');
  });
});
