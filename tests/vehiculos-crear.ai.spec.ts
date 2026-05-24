import { expect, test } from './percy';
import { fillFieldsWithAi } from './helpers/ai-filler';
import { loginAsAdmin } from './helpers/auth';

test.describe('Vehículos - creación - IA', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.getByRole('link', { name: /Vehiculos/i }).click();
    await expect(page).toHaveURL(/\/vehiculos/);
  });

  test('1) crea vehículo con placa válida', async ({ page }) => {
    await page.locator('.create-button > .mat-icon').click();

    await fillFieldsWithAi('crear vehículo válido', [
      {
        key: 'placa',
        prompt: 'Placa alfanumérica válida y única para vehículo',
        locator: page.locator('#mat-input-40'),
        fallback: 'RTX332',
      },
    ]);

    await page.getByRole('button', { name: /Crear/i }).click();
    await expect(page.locator('text=RTX332')).toBeVisible();
  });

  test('2) no permite crear vehículo sin placa', async ({ page }) => {
    await page.locator('.create-button > .mat-icon').click();
    await page.locator('#mat-input-40').fill('');
    await expect(page.getByRole('button', { name: /Crear/i })).toBeDisabled();
  });
});
