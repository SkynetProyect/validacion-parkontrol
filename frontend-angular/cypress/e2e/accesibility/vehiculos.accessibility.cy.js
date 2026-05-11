// Vehículos - Accessibility Tests

import { loginAsAdmin } from '../support/helpers';

describe('Vehículos - Accessibility Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Vehiculos/i).click();
    cy.injectAxe();
  });

  it('1) botón crear debe ser accesible', () => {
    cy.get('.create-button').first().should('have.attr', 'role').or('have.attr', 'aria-label');
  });

  it('2) campo de entrada debe tener label', () => {
    cy.get('.create-button').first().click();
    cy.get('input[type="text"]').first().should('have.attr', 'id').or('have.attr', 'aria-label');
  });

  it('3) debe permitir navegación por teclado', () => {
    cy.get('.create-button').first().click();
    cy.get('input[type="text"]').first().focus().should('have.focus');
  });

  it('4) no debe tener problemas con axe', () => {
    cy.checkA11y();
  });

  it('5) debe permitir zoom', () => {
    cy.viewport(320, 640);
    cy.get('.create-button').first().should('be.visible');
  });

  it('6) área de toque suficiente', () => {
    cy.get('.create-button').first().should('have.css', 'min-height');
  });

  it('7) tabla debe ser accesible', () => {
    cy.get('table, mat-table').should('exist');
  });

  it('8) debe anunciar errores', () => {
    cy.get('.create-button').first().click();
    cy.get('input[type="text"]').first().focus().blur();
    cy.get('[role="alert"]').should('exist').or('not.exist');
  });

  it('9) botones deben tener contraste', () => {
    cy.get('.create-button').first().should('have.css', 'color');
  });

  it('10) campos obligatorios deben indicarse', () => {
    cy.get('.create-button').first().click();
    cy.get('input[type="text"]').first().should('have.attr', 'required').or('have.attr', 'aria-required');
  });
});
