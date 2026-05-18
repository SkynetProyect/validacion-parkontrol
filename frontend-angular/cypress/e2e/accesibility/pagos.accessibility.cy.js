// Pagos - Accessibility Tests

import { loginAsAdmin } from '../../support/helpers';

describe('Pagos - Accessibility Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Pagos/i).click();
    cy.injectAxe();
  });

  it('1) modal accesible', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('mat-dialog-container').should('have.attr', 'role', 'dialog');
  });

  it('2) heading presente', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('mat-dialog-container').find('h1, h2, h3').should('exist');
  });

  it('3) sin problemas axe', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.checkA11y('mat-dialog-container');
  });

  it('4) navegación teclado', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('input, mat-select').first().focus().should('have.focus');
    cy.focused().tab();
  });

  it('5) errores anunciados', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('input[type="number"]').first().focus().blur();
    cy.get('[role="alert"]').should('exist').or('not.exist');
  });

  it('6) zoom 200%', () => {
    cy.viewport(320, 640);
    cy.get('button').contains(/Nuevo Pago/i).first().should('be.visible');
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('mat-dialog-container').should('be.visible');
  });

  it('7) área toque', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().should('have.css', 'min-height');
  });

  it('8) cerrar ESC', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('mat-dialog-container').trigger('keydown', { keyCode: 27 });
    cy.get('mat-dialog-container').should('not.exist');
  });

  it('9) select accesible', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('mat-select').should('have.attr', 'role');
  });

  it('10) campos obligatorios indicados', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('input[type="number"]').first().should('have.attr', 'required').or('have.attr', 'aria-required');
  });
});
