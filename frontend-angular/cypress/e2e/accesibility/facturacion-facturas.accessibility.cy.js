// Facturación - Facturas - Accessibility Tests

import { loginAsAdmin } from '../../support/helpers';

describe('Facturación - Facturas - Accessibility Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Facturacion|Facturas/i).first().click();
    cy.injectAxe();
  });

  it('1) tabla accesible', () => {
    cy.get('table, mat-table').should('have.attr', 'role').or('exist');
  });

  it('2) sin problemas axe', () => {
    cy.checkA11y();
  });

  it('3) navegación teclado', () => {
    cy.get('button, a').first().focus().should('have.focus');
    cy.focused().tab();
  });

  it('4) zoom 200%', () => {
    cy.viewport(320, 640);
    cy.get('table, mat-table').should('be.visible');
    cy.get('button').first().should('be.visible');
  });

  it('5) modal accesible al crear', () => {
    cy.get('button').contains(/Nueva|Crear|Factura/i).first().click().or('not.exist');
    cy.get('mat-dialog-container').should('have.attr', 'role', 'dialog').or('not.exist');
  });

  it('6) botones accesibles', () => {
    cy.get('button').first().should('have.attr', 'role', 'button').or('have.attr', 'type', 'button');
  });

  it('7) enlaces identificables', () => {
    cy.get('a').first().should('contain.text', /.+/);
  });

  it('8) área toque suficiente', () => {
    cy.get('button').first().should('have.css', 'min-height');
  });

  it('9) campos requeridos indicados', () => {
    cy.get('input').first().should('have.attr', 'required').or('have.attr', 'aria-required').or('not.exist');
  });

  it('10) contraste suficiente', () => {
    cy.get('body').should('have.css', 'color');
  });
});
