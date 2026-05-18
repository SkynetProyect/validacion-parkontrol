// Login - Regression Tests
// Pruebas de regresión para funcionalidades básicas de login

import { loginAsAdmin, loginAsOperator, loginAsUser, ADMIN_EMAIL, ADMIN_PASSWORD, OPERATOR_EMAIL, OPERATOR_PASSWORD, USER_EMAIL, USER_PASSWORD } from '../../support/helpers';

describe('Login - Regression Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  it('1) inicia sesión como administrador correctamente', () => {
    loginAsAdmin();
    cy.url().should('include', '/dashboard');
    cy.get('text=Dashboard').should('be.visible');
  });

  it('2) inicia sesión como operador correctamente', () => {
    loginAsOperator();
    cy.url().should('include', '/operador-dashboard');
  });

  it('3) inicia sesión como usuario correctamente', () => {
    loginAsUser();
    cy.get('.contenedor-cliente').should('be.visible');
  });

  it('4) no inicia sesión con contraseña incorrecta', () => {
    cy.get('input[formcontrolname="correo"]').fill(ADMIN_EMAIL);
    cy.get('input[formcontrolname="contrasena"]').fill('WrongPassword1!');
    cy.get('#login-admin-card').click();
    cy.url().should('include', '/login');
  });

  it('5) no permite iniciar sesión sin correo', () => {
    cy.get('input[formcontrolname="contrasena"]').fill(ADMIN_PASSWORD);
    cy.get('#login-admin-card').should('be.disabled');
  });

  it('6) no permite iniciar sesión sin contraseña', () => {
    cy.get('input[formcontrolname="correo"]').fill(ADMIN_EMAIL);
    cy.get('#login-admin-card').should('be.disabled');
  });

  it('7) limpia campos al actualizar la página', () => {
    cy.get('input[formcontrolname="correo"]').fill(ADMIN_EMAIL);
    cy.reload();
    cy.get('input[formcontrolname="correo"]').should('have.value', '');
  });

  it('8) muestra vista de admin correctamente', () => {
    loginAsAdmin();
    cy.get('[matmenuitem]').should('exist');
    cy.get('nav').should('exist');
  });

  it('9) muestra vista de operador correctamente', () => {
    loginAsOperator();
    cy.url().should('include', '/operador-dashboard');
  });

  it('10) valida formato de correo en tiempo real', () => {
    cy.get('input[formcontrolname="correo"]').fill('invalid-email');
    cy.get('input[formcontrolname="contrasena"]').fill(ADMIN_PASSWORD);
    cy.get('#login-admin-card').should('be.disabled');
  });

  it('11) permite correo válido después de ser inválido', () => {
    cy.get('input[formcontrolname="correo"]').fill('invalid-email');
    cy.get('input[formcontrolname="correo"]').clear();
    cy.get('input[formcontrolname="correo"]').fill(ADMIN_EMAIL);
    cy.get('input[formcontrolname="contrasena"]').fill(ADMIN_PASSWORD);
    cy.get('#login-admin-card').should('not.be.disabled');
  });

  it('12) cierra sesión correctamente', () => {
    loginAsAdmin();
    cy.get('[matmenuTrigger]').first().click();
    cy.get('[matmenuitem]').contains(/Salir|Logout/i).click();
    cy.url().should('include', '/login');
  });

  it('13) no permite acceso directo a rutas protegidas sin login', () => {
    cy.visit('http://localhost:4200/dashboard');
    cy.url().should('include', '/login');
  });

  it('14) recuerda rol seleccionado durante sesión', () => {
    loginAsAdmin();
    cy.reload();
    cy.url().should('include', '/dashboard');
  });

  it('15) valida cambio entre campos de entrada', () => {
    cy.get('input[formcontrolname="correo"]').fill(ADMIN_EMAIL);
    cy.get('input[formcontrolname="correo"]').tab();
    cy.get('input[formcontrolname="contrasena"]').should('have.focus');
    cy.get('input[formcontrolname="contrasena"]').fill(ADMIN_PASSWORD);
    cy.get('input[formcontrolname="contrasena"]').tab();
    cy.get('#login-admin-card').should('have.focus');
  });
});
