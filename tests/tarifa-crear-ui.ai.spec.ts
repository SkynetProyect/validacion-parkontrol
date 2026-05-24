import { expect, test } from './percy';
import { fillFieldsWithAi } from './helpers/ai-filler';
import { loginAsAdmin } from './helpers/auth';

test.describe('Tarifa - UI creación - IA', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.getByRole('link', { name: /Tarifas/i }).click();
    await expect(page).toHaveURL(/\/tarifas/);
    await page.getByRole('button', { name: /Nueva Tarifa/i }).click();
    await expect(page.locator('mat-dialog-container')).toBeVisible();
  });

  test('1) crea tarifa con valores válidos usando prompts', async ({ page }) => {
    const dialog = page.locator('mat-dialog-container');
    const inputs = dialog.locator('input[type="number"]');

    await fillFieldsWithAi('crear una tarifa válida', [
      {
        key: 'tarifaEntrada',
        prompt: 'Valor entero positivo para tarifa de entrada',
        locator: inputs.nth(0),
        fallback: '2000',
      },
      {
        key: 'tarifaSalida',
        prompt: 'Valor entero positivo para tarifa de salida',
        locator: inputs.nth(1),
        fallback: '3000',
      },
    ]);

    await dialog.locator('.mat-mdc-select-placeholder').first().click();
    await dialog.locator('mat-option').first().click();

    await expect(page.getByRole('button', { name: /Crear/i }).first()).toBeEnabled();
    await page.getByRole('button', { name: /Crear/i }).click();
    await expect(page.locator('.mensaje-exito')).toBeVisible();
  });

  test('2) no permite crear tarifa sin valores', async ({ page }) => {
    const creaButton = page.getByRole('button', { name: /Crear/i }).first();
    await expect(creaButton).toBeDisabled();
  });

  test('3) no permite crear tarifa con precio negativo', async ({ page }) => {
    const dialog = page.locator('mat-dialog-container');
    const inputs = dialog.locator('input[type="number"]');
    await inputs.nth(0).fill('-100');
    await inputs.nth(1).fill('3000');
    await dialog.locator('.mat-mdc-select-placeholder').first().click();
    await dialog.locator('mat-option').first().click();
    await expect(page.getByRole('button', { name: /Crear/i }).first()).toBeDisabled();
  });
});
