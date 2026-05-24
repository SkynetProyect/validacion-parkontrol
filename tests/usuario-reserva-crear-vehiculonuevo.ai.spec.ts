import { expect, test } from './percy';
import { fillFieldsWithAi } from './helpers/ai-filler';
import { loginAsUser } from './helpers/auth';

test.describe('Usuario reserva - vehículo nuevo - IA', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
    await page.getByRole('link', { name: /Reservas/i }).click();
    await expect(page).toHaveURL(/\/reservas/);
  });

  test('1) crea reserva con vehículo nuevo', async ({ page }) => {
    await page.getByRole('button', { name: /Nueva Reserva/i }).click();

    await fillFieldsWithAi('crear reserva con vehículo nuevo', [
      {
        key: 'placa',
        prompt: 'Placa válida y única para vehículo nuevo',
        locator: page.locator('#mat-input-22'),
        fallback: 'RTX123',
      },
      {
        key: 'horaInicio',
        prompt: 'Hora de inicio futura en formato datetime-local',
        locator: page.locator('#mat-input-19'),
        fallback: '2026-05-03T09:00',
      },
      {
        key: 'horaFin',
        prompt: 'Hora de fin posterior a la de inicio en formato datetime-local',
        locator: page.locator('#mat-input-16'),
        fallback: '2026-05-03T18:00',
      },
    ]);

    await page.locator('#mat-input-18').selectOption('10');
    await page.getByRole('button', { name: /Crear Reserva/i }).click();
    await expect(page.locator('text=Activa')).toBeVisible();
  });

  test('2) no permite reserva con placa vacía', async ({ page }) => {
    await page.getByRole('button', { name: /Nueva Reserva/i }).click();
    await page.locator('#mat-input-22').fill('');
    await page.locator('#mat-input-19').fill('2026-05-03T09:00');
    await page.locator('#mat-input-16').fill('2026-05-03T18:00');
    await expect(page.getByRole('button', { name: /Crear Reserva/i })).toBeDisabled();
  });
});
