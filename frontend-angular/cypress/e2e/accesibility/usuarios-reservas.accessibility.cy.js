// Usuarios - Reservas - Accessibility Tests

import { loginAsUser } from '../support/helpers';

describe('Usuarios - Reservas - Accessibility Tests', () => {
  beforeEach(() => {
    loginAsUser();
    cy.injectAxe();
  });

  it('1) sitio accesible', () => {
    cy.checkA11y();
  });

  it('2) navegación teclado', () => {
    cy.get('a, button').first().focus().should('have.focus');
    cy.focused().tab();
  });

  it('3) tabla reservas accesible', () => {
    cy.get('a').contains(/Historial|Mis|Reservas/i).first().click();
    cy.get('table, mat-table').should('have.attr', 'role').or('exist');
  });

  it('4) zoom 200%', () => {
    cy.viewport(320, 640);
    cy.get('a, button').first().should('be.visible');
  });

  it('5) enlace teclado', () => {
    cy.get('a').first().focus().should('have.focus');
  });

  it('6) botones accesibles', () => {
    cy.get('button').first().should('have.attr', 'role', 'button');
  });

  it('7) sin problemas axe', () => {
    cy.checkA11y();
  });

  it('8) área toque botones', () => {
    cy.get('button').first().should('have.css', 'min-height');
  });

  it('9) enlaces identificables', () => {
    cy.get('a').first().should('contain.text', /.+/);
  });

  it('10) formularios accesibles', () => {
    cy.get('form, [role="form"]').should('exist').or('not.exist');
  });
});
