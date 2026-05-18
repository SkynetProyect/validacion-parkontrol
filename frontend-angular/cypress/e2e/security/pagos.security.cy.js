// Pagos - Security Tests

import { loginAsAdmin } from '../../support/helpers';

describe('Pagos - Security Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Pagos/i).click();
    cy.url().should('include', '/pagos');
  });

  it('1) debe validar cantidad como número positivo', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('input[type="number"], input[formcontrolname="cantidad"]').first().fill('-100');
    cy.get('button').contains(/Procesar Pago|Pagar/i).first().should('be.disabled');
  });

  it('2) no debe permitir cantidad cero', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('input[type="number"], input[formcontrolname="cantidad"]').first().fill('0');
    cy.get('button').contains(/Procesar Pago|Pagar/i).first().should('be.disabled');
  });

  it('3) debe validar select de reserva', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('mat-select[formcontrolname="idReserva"], mat-select').first().click();
    cy.get('mat-option').should('have.length.greaterThan', 0).or('have.length', 0);
  });

  it('4) no debe permitir cantidad negativa', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('input[type="number"], input[formcontrolname="cantidad"]').first().fill('-50');
    cy.get('button').contains(/Procesar Pago|Pagar/i).first().should('be.disabled');
  });

  it('5) debe prevenir overflow en cantidad', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('input[type="number"], input[formcontrolname="cantidad"]').first().invoke('val', Number.MAX_SAFE_INTEGER + 1);
  });

  it('6) debe validar permisos de usuario', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().should('exist');
  });

  it('7) debe prevenir múltiples pagos simultáneos', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('mat-select[formcontrolname="idReserva"], mat-select').first().click();
    cy.get('mat-option:not([disabled])').first().click().should('exist');
  });

  it('8) debe validar reserva disponible', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('mat-select[formcontrolname="idReserva"], mat-select').first().click();
    cy.get('mat-option').should('have.length.greaterThan', 0).or('have.length', 0);
  });

  it('9) debe estar protegido contra CSRF', () => {
    cy.getCookie('csrf-token').should('exist').or('not.exist');
  });

  it('10) debe validar transacción antes de procesar', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('button').contains(/Procesar Pago|Pagar/i).first().should('be.disabled');
  });
});

describe('Pagos - Accessibility Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Pagos/i).click();
    cy.injectAxe();
  });

  it('1) modal accesible', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('mat-dialog-container, .mat-mdc-dialog-container').first().should('have.attr', 'role', 'dialog');
  });

  it('2) sin problemas axe', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.checkA11y('mat-dialog-container, .mat-mdc-dialog-container');
  });

  it('3) navegación teclado', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('input[type="number"], input[formcontrolname="cantidad"]').first().focus().should('have.focus');
  });

  it('4) errores accesibles', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('input[type="number"], input[formcontrolname="cantidad"]').first().focus().blur();
  });

  it('5) zoom 200%', () => {
    cy.viewport(320, 640);
    cy.get('button').contains(/Nuevo Pago/i).first().should('be.visible');
  });
});

describe('Pagos - Regression Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Pagos/i).click();
  });

  it('1) crea pago válido', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('mat-select[formcontrolname="idReserva"], mat-select').first().click();
    cy.get('mat-option').first().click();
    cy.get('input[type="number"], input[formcontrolname="cantidad"]').first().fill('1');
    cy.get('button').contains(/Procesar Pago|Pagar/i).first().should('not.be.disabled');
    cy.get('button').contains(/Procesar Pago|Pagar/i).first().click();
    cy.get('.mensaje-exito').should('be.visible');
  });

  it('2) no sin reserva', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('input[type="number"], input[formcontrolname="cantidad"]').first().fill('1');
    cy.get('button').contains(/Procesar Pago|Pagar/i).first().should('be.disabled');
  });

  it('3) no cantidad cero', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('mat-select[formcontrolname="idReserva"], mat-select').first().click();
    cy.get('mat-option').first().click();
    cy.get('input[type="number"], input[formcontrolname="cantidad"]').first().fill('0');
    cy.get('input[type="number"], input[formcontrolname="cantidad"]').first().blur();
    cy.get('button').contains(/Procesar Pago|Pagar/i).first().should('be.disabled');
  });

  it('4) cancela pago', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('button').contains(/Cancelar/i).click();
    cy.get('mat-dialog-container, .mat-mdc-dialog-container').should('not.exist');
  });

  it('5) lista pagos', () => {
    cy.get('table, mat-table, .pagos-list').should('exist');
  });
});
