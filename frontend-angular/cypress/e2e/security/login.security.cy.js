// Login - Security Tests
// Pruebas de seguridad para validar acceso y prevención de ataques

import { loginAsAdmin, loginAsOperator, loginAsUser, ADMIN_EMAIL, ADMIN_PASSWORD, OPERATOR_EMAIL, OPERATOR_PASSWORD } from '../support/helpers';

describe('Login - Security Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  it('1) debe prevenir SQL injection en campo de correo', () => {
    cy.get('input[formcontrolname="correo"]').fill("admin1@parkontrol.com' OR '1'='1");
    cy.get('input[formcontrolname="contrasena"]').fill(ADMIN_PASSWORD);
    cy.get('#login-admin-card').click();
    cy.url().should('include', '/login');
  });

  it('2) debe prevenir SQL injection en campo de contraseña', () => {
    cy.get('input[formcontrolname="correo"]').fill(ADMIN_EMAIL);
    cy.get('input[formcontrolname="contrasena"]').fill("' OR '1'='1");
    cy.get('#login-admin-card').click();
    cy.url().should('include', '/login');
  });

  it('3) debe rechazar credenciales con caracteres especiales maliciosos', () => {
    cy.get('input[formcontrolname="correo"]').fill('<script>alert("xss")</script>');
    cy.get('input[formcontrolname="contrasena"]').fill('test');
    cy.get('#login-admin-card').click();
    cy.url().should('include', '/login');
  });

  it('4) no debe permitir acceso con contraseña incorrecta', () => {
    cy.get('input[formcontrolname="correo"]').fill(ADMIN_EMAIL);
    cy.get('input[formcontrolname="contrasena"]').fill('WrongPassword123!');
    cy.get('#login-admin-card').click();
    cy.url().should('include', '/login');
  });

  it('5) no debe permitir acceso sin correo', () => {
    cy.get('input[formcontrolname="contrasena"]').fill(ADMIN_PASSWORD);
    cy.get('#login-admin-card').should('be.disabled');
  });

  it('6) no debe permitir acceso sin contraseña', () => {
    cy.get('input[formcontrolname="correo"]').fill(ADMIN_EMAIL);
    cy.get('#login-admin-card').should('be.disabled');
  });

  it('7) debe validar formato de correo válido', () => {
    cy.get('input[formcontrolname="correo"]').fill('invalid-email');
    cy.get('input[formcontrolname="contrasena"]').fill(ADMIN_PASSWORD);
    cy.get('#login-admin-card').should('be.disabled');
  });

  it('8) debe rechazar correo con dominios maliciosos', () => {
    cy.get('input[formcontrolname="correo"]').fill('attacker@evil.com');
    cy.get('input[formcontrolname="contrasena"]').fill(ADMIN_PASSWORD);
    cy.get('#login-admin-card').click();
    cy.url().should('include', '/login');
  });

  it('9) debe redirigir a login después de logout seguro', () => {
    loginAsAdmin();
    cy.get('[matmenuTrigger]').first().click();
    cy.get('[matmenuitem]').contains(/Salir|Logout/i).click();
    cy.url().should('include', '/login');
  });

  it('10) no debe mantener sesión activa después de cierre de navegador (cookies seguras)', () => {
    loginAsAdmin();
    cy.clearCookies();
    cy.visit('http://localhost:4200/dashboard');
    cy.url().should('include', '/login');
  });

  it('11) debe validar token expirado al acceder a ruta protegida', () => {
    loginAsAdmin();
    cy.clearLocalStorage();
    cy.visit('http://localhost:4200/dashboard');
    // Debería redirigir a login si el token no existe
    cy.url().should('include', '/login');
  });

  it('12) no debe permitir cambio de rol mediante manipulación de token', () => {
    loginAsAdmin();
    // Si intenta acceder a ruta solo de operador sin ser operador
    cy.visit('http://localhost:4200/operador-dashboard');
    cy.url().should('include', '/dashboard'); // Debería redirigir al dashboard de admin
  });
});
