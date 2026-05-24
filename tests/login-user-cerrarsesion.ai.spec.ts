import { expect, test } from './percy';
import { fillFieldsWithAi } from './helpers/ai-filler';

const USER_EMAIL = 'user4@parkontrol.com';
const USER_PASSWORD = 'user1234';

test.describe('Login usuario y cierre de sesión - IA', () => {
  test('1) inicia sesión y cierra sesión correctamente', async ({ page }) => {
    await page.goto('/login');

    await fillFieldsWithAi('login de usuario para cerrar sesión', [
      {
        key: 'correo',
        prompt: 'Correo válido del usuario de prueba de Parkontrol',
        locator: page.locator('input[formcontrolname="correo"]'),
        fallback: USER_EMAIL,
        kind: 'login',
        existingValues: [USER_EMAIL],
      },
      {
        key: 'contrasena',
        prompt: 'Contraseña válida del usuario de prueba de Parkontrol',
        locator: page.locator('input[formcontrolname="contrasena"]'),
        fallback: USER_PASSWORD,
        kind: 'login',
        existingValues: [USER_PASSWORD],
      },
    ]);

    await page.locator('#login-submit-btn > .mat-mdc-button-touch-target').click();
    await expect(page.getByRole('button', { name: /Cerrar sesión/i })).toBeVisible();

    await page.getByRole('button', { name: /Cerrar sesión/i }).click();
    await expect(page.getByRole('button', { name: /Cerrar sesión/i })).toHaveCount(0);
    await expect(page).toHaveURL(/\/login/);
  });

  test('2) el botón de cerrar sesión no aparece sin autenticación', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: /Cerrar sesión/i })).toHaveCount(0);
  });
});
