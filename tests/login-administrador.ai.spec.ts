import { expect, test } from './percy';
import { fillFieldsWithAi } from './helpers/ai-filler';

const ADMIN_EMAIL = 'admin1@parkontrol.com';
const ADMIN_PASSWORD = 'Admin1234';

test.describe('Login administrador - IA', () => {
  test('1) inicia sesión como administrador con prompts', async ({ page }) => {
    await page.goto('/login');

    await fillFieldsWithAi('login de administrador válido', [
      {
        key: 'correo',
        prompt: 'Correo válido del administrador de Parkontrol',
        locator: page.locator('input[formcontrolname="correo"]'),
        fallback: ADMIN_EMAIL,
        kind: 'login',
        existingValues: [ADMIN_EMAIL],
      },
      {
        key: 'contrasena',
        prompt: 'Contraseña válida del administrador de Parkontrol',
        locator: page.locator('input[formcontrolname="contrasena"]'),
        fallback: ADMIN_PASSWORD,
        kind: 'login',
        existingValues: [ADMIN_PASSWORD],
      },
    ]);

    const loginButton = page.locator('#login-submit-btn > .mat-mdc-button-touch-target');
    await loginButton.click();
    await expect(page).toHaveURL(/\/(dashboard|home|reservas|pagos)/);
    await expect(page.locator('text=Dashboard').first()).toBeVisible();
  });

  test('2) no inicia sesión con contraseña incorrecta', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[formcontrolname="correo"]').fill(ADMIN_EMAIL);
    await page.locator('input[formcontrolname="contrasena"]').fill('WrongPassword1!');
    const loginButton = page.locator('#login-submit-btn > .mat-mdc-button-touch-target');
    await Promise.all([
      loginButton.click(),
      page.waitForURL(/\/login/, { timeout: 5000 }),
    ]);
    await expect(page).toHaveURL(/\/login/);
  });

  test('3) no permite iniciar sesión sin correo', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[formcontrolname="contrasena"]').fill(ADMIN_PASSWORD);
    const loginButton = page.locator('#login-submit-btn > .mat-mdc-button-touch-target');
    await expect(loginButton).toBeDisabled();
  });
});
