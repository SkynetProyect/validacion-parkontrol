// Parqueaderos - Accessibility Tests

import { loginAsAdmin } from '../../support/helpers';

describe('Parqueaderos - Accessibility Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Parqueaderos/i).click();
    cy.injectAxe();
  });

  it('1) modal debe tener rol dialog', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    cy.get('mat-dialog-container').should('have.attr', 'role', 'dialog');
  });

  it('2) debe tener heading accesible', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    cy.get('mat-dialog-container').find('h1, h2, h3').should('exist');
  });

  it('3) campos deben tener labels asociados', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    
    cy.get('input[formcontrolname="nombre"]').should('have.attr', 'id').or('have.attr', 'aria-label');
  });

  it('4) debe permitir navegación por teclado', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    
    cy.get('input[formcontrolname="nombre"]').focus().should('have.focus');
    cy.focused().tab();
  });

  it('5) mensajes de error deben ser anunciados', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    
    cy.get('input[formcontrolname="nombre"]').focus().blur();
    cy.get('[role="alert"]').should('exist');
  });

  it('6) no debe tener problemas de accesibilidad con axe', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    cy.checkA11y('mat-dialog-container');
  });

  it('7) debe permitir zoom hasta 200%', () => {
    cy.viewport(320, 640);
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().should('be.visible');
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    cy.get('input[formcontrolname="nombre"]').should('be.visible');
  });

  it('8) botones deben tener área de toque suficiente', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().should('have.css', 'min-height');
  });

  it('9) debe poder cerrar con ESC', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    cy.get('mat-dialog-container').trigger('keydown', { keyCode: 27 });
    cy.get('mat-dialog-container').should('not.exist');
  });

  it('10) campos obligatorios deben indicarse', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    cy.get('input[formcontrolname="nombre"]').should('have.attr', 'required').or('have.attr', 'aria-required');
  });
});
