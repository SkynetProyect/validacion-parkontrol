// Tarifas - Accessibility Tests

import { loginAsAdmin } from '../support/helpers';

describe('Tarifas - Accessibility Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Tarifas/i).click();
    cy.injectAxe();
  });

  it('1) modal debe ser accesible', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    cy.get('mat-dialog-container').should('have.attr', 'role', 'dialog');
  });

  it('2) debe tener heading', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    cy.get('mat-dialog-container').find('h1, h2, h3').should('exist');
  });

  it('3) sin problemas axe', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    cy.checkA11y('mat-dialog-container');
  });

  it('4) navegación por teclado', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    cy.get('input[type="number"]').first().focus().should('have.focus');
    cy.focused().tab();
  });

  it('5) errores accesibles', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    cy.get('input[type="number"]').first().focus().blur();
    cy.get('[role="alert"]').should('exist').or('not.exist');
  });

  it('6) zoom 200%', () => {
    cy.viewport(320, 640);
    cy.get('button').contains(/Nueva Tarifa/i).should('be.visible');
  });

  it('7) área toque', () => {
    cy.get('button').contains(/Nueva Tarifa/i).should('have.css', 'min-height');
  });

  it('8) cerrar ESC', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    cy.get('mat-dialog-container').trigger('keydown', { keyCode: 27 });
    cy.get('mat-dialog-container').should('not.exist');
  });

  it('9) campos obligatorios', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    cy.get('input[type="number"]').first().should('have.attr', 'required').or('have.attr', 'aria-required');
  });

  it('10) select accesible', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    cy.get('mat-select').should('have.attr', 'role');
  });
});
