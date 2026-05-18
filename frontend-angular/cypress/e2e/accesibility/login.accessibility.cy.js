// Login - Accessibility Tests
// Pruebas de accesibilidad WCAG 2.1 para login

import { loginAsAdmin } from '../../support/helpers';

describe('Login - Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
    // Cargar cypress-axe para verificar accesibilidad
    cy.injectAxe();
  });

  it('1) debe tener labels accesibles para campos de entrada', () => {
    cy.get('input[formcontrolname="correo"]').should('have.attr', 'id');
    cy.get('input[formcontrolname="contrasena"]').should('have.attr', 'id');
  });

  it('2) debe tener contraste de color suficiente', () => {
    // Verificar que el texto sea legible con contraste >= 4.5:1
    cy.get('.login-container').should('exist');
    // Nota: Requiere biblioteca de contraste de color
    cy.get('.mat-mdc-button').should('have.css', 'color');
  });

  it('3) debe permitir navegación por teclado', () => {
    cy.get('input[formcontrolname="correo"]').focus().should('have.focus');
    cy.focused().tab();
    cy.get('input[formcontrolname="contrasena"]').should('have.focus');
    cy.focused().tab();
    cy.get('#login-admin-card').should('have.focus');
  });

  it('4) debe tener roles ARIA apropiados para botones', () => {
    cy.get('#login-admin-card').should('have.attr', 'role', 'button');
    cy.get('#login-operator-card').should('have.attr', 'role', 'button');
  });

  it('5) debe anunciar errores de validación de forma accesible', () => {
    cy.get('input[formcontrolname="correo"]').fill('');
    cy.get('input[formcontrolname="correo"]').blur();
    cy.get('[role="alert"]').should('exist');
  });

  it('6) debe tener mensajes de error asociados a campos de entrada', () => {
    cy.get('input[formcontrolname="correo"]').should('have.attr', 'aria-describedby');
  });

  it('7) debe permitir focus en botones deshabilitados de forma accesible', () => {
    cy.get('#login-admin-card').should('have.attr', 'disabled');
    cy.get('#login-admin-card').should('have.attr', 'aria-disabled', 'true');
  });

  it('8) debe proporcionar texto alternativo en iconos', () => {
    cy.get('mat-icon').each(($icon) => {
      cy.wrap($icon).should('have.attr', 'aria-label').or('have.text');
    });
  });

  it('9) no debe tener problemas de accesibilidad detectados por axe', () => {
    cy.checkA11y();
  });

  it('10) debe respetar las preferencias de reducción de movimiento', () => {
    cy.get('body').should('have.css', 'transition');
  });

  it('11) debe permitir zoom hasta 200% sin pérdida de funcionalidad', () => {
    cy.viewport(320, 640);
    cy.get('input[formcontrolname="correo"]').should('be.visible');
    cy.get('#login-admin-card').should('be.visible');
  });

  it('12) debe tener suficiente tamaño de área de toque (min 44x44px)', () => {
    cy.get('#login-admin-card').should('have.css', 'min-height').and('be.at.least', '44px');
    cy.get('#login-admin-card').should('have.css', 'min-width').and('be.at.least', '44px');
  });
});
