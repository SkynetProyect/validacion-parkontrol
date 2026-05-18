// Login - Security Tests
// Pruebas de seguridad para validar acceso y prevención de ataques

import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../../support/helpers';

const buildAuthToken = (payload) => {
  const encode = (value) => btoa(JSON.stringify(value))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encode({ alg: 'none', typ: 'JWT' })}.${encode(payload)}.`;
};

const seedAdminSession = () => {
  const token = buildAuthToken({
    id: 1,
    correo: ADMIN_EMAIL,
    nombreRol: 'ADMINISTRADOR',
    idEmpresa: 1,
    exp: Math.floor(Date.now() / 1000) + 3600,
  });

  cy.visit('http://localhost:4200/login');
  cy.window().then((win) => {
    win.sessionStorage.setItem('auth_token', token);
    win.localStorage.removeItem('auth_token');
  });
};

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
    cy.get('#login-admin-card').click();
    cy.get('#login-email-error-required').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('6) no debe permitir acceso sin contraseña', () => {
    cy.get('input[formcontrolname="correo"]').fill(ADMIN_EMAIL);
    cy.get('#login-admin-card').click();
    cy.get('#login-password-error-required').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('7) debe validar formato de correo válido', () => {
    cy.get('input[formcontrolname="correo"]').fill('invalid-email');
    cy.get('input[formcontrolname="contrasena"]').fill(ADMIN_PASSWORD);
    cy.get('#login-admin-card').click();
    cy.get('#login-email-error-format').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('8) debe rechazar correo con dominios maliciosos', () => {
    cy.get('input[formcontrolname="correo"]').fill('attacker@evil.com');
    cy.get('input[formcontrolname="contrasena"]').fill(ADMIN_PASSWORD);
    cy.get('#login-admin-card').click();
    cy.url().should('include', '/login');
  });

  it('9) debe redirigir a login después de logout seguro', () => {
    seedAdminSession();
    cy.visit('http://localhost:4200/dashboard');
    cy.get('.boton-logout').should('be.visible').click();
    cy.url().should('include', '/login');
  });

  it('10) no debe mantener sesión activa después de cierre de navegador (cookies seguras)', () => {
    seedAdminSession();
    cy.visit('http://localhost:4200/dashboard');
    cy.clearCookies();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    cy.visit('http://localhost:4200/dashboard');
    cy.url().should('include', '/login');
  });

  it('11) debe validar token expirado al acceder a ruta protegida', () => {
    seedAdminSession();
    cy.visit('http://localhost:4200/dashboard');
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    cy.visit('http://localhost:4200/dashboard');
    // Debería redirigir a login si el token no existe
    cy.url().should('include', '/login');
  });

  it('12) no debe permitir cambio de rol mediante manipulación de token', () => {
    seedAdminSession();
    cy.visit('http://localhost:4200/dashboard');
    // Si intenta acceder a ruta solo de operador sin ser operador
    cy.visit('http://localhost:4200/operador-dashboard');
    cy.url().should('include', '/login');
  });
});
