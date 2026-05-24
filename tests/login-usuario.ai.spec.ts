import { expect, test } from './percy';
import { fillFieldsWithAi } from './helpers/ai-filler';

const USER_EMAIL = 'user4@parkontrol.com';
const USER_PASSWORD = 'user1234';

test.describe('Login usuario - IA', () => {
  test('1) inicia sesión como usuario correctamente con prompts', async ({ page }) => {
    await page.goto('/login');

    await fillFieldsWithAi('login de usuario válido', [
      {
        key: 'correo',
        prompt: 'Correo válido de usuario para Parkontrol',
        locator: page.locator('input[formcontrolname="correo"]'),
        fallback: USER_EMAIL,
        kind: 'login',
        existingValues: [USER_EMAIL],
      },
      {
        key: 'contrasena',
        prompt: 'Contraseña válida de usuario para Parkontrol',
        locator: page.locator('input[formcontrolname="contrasena"]'),
        fallback: USER_PASSWORD,
        kind: 'login',
        existingValues: [USER_PASSWORD],
      },
    ]);

    await page.locator('#login-submit-btn').click();
    await expect(page.locator('.contenedor-cliente')).toBeVisible();
  });

  test('2) no inicia sesión con correo inválido', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[formcontrolname="correo"]').fill('invalid@parkontrol.com');
    await page.locator('input[formcontrolname="contrasena"]').fill(USER_PASSWORD);
    const loginButton = page.locator('#login-submit-btn > .mat-mdc-button-touch-target');
    await Promise.all([
      loginButton.click(),
      page.waitForURL(/\/login/, { timeout: 5000 }),
    ]);
    await expect(page).toHaveURL(/\/login/);
  });

  test('3) no permite iniciar sesión sin contraseña', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[formcontrolname="correo"]').fill(USER_EMAIL);
    const loginButton = page.locator('#login-submit-btn > .mat-mdc-button-touch-target');
    await expect(loginButton).toBeDisabled();
  });
});
