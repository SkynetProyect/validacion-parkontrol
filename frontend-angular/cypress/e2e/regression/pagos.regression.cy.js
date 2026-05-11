// Pagos - Regression Tests

import { loginAsAdmin } from '../support/helpers';

describe('Pagos - Regression Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Pagos/i).click();
    cy.url().should('include', '/pagos');
  });

  it('1) crea pago con dato válido', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    const dialog = cy.get('mat-dialog-container, .mat-mdc-dialog-container').first();
    
    dialog.get('mat-select[formcontrolname="idReserva"], mat-select').first().click();
    cy.get('mat-option').first().click();
    dialog.get('input[type="number"], input[formcontrolname="cantidad"]').first().fill('1');
    cy.get('button').contains(/Procesar Pago|Pagar/i).first().should('not.be.disabled');
    cy.get('button').contains(/Procesar Pago|Pagar/i).first().click();
    
    cy.get('.mensaje-exito').should('be.visible');
  });

  it('2) no permite sin reserva', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    const dialog = cy.get('mat-dialog-container, .mat-mdc-dialog-container').first();
    
    dialog.get('input[type="number"], input[formcontrolname="cantidad"]').first().fill('1');
    cy.get('button').contains(/Procesar Pago|Pagar/i).first().should('be.disabled');
  });

  it('3) no permite cantidad cero', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    const dialog = cy.get('mat-dialog-container, .mat-mdc-dialog-container').first();
    
    dialog.get('mat-select[formcontrolname="idReserva"], mat-select').first().click();
    cy.get('mat-option').first().click();
    dialog.get('input[type="number"], input[formcontrolname="cantidad"]').first().fill('0');
    dialog.get('input[type="number"], input[formcontrolname="cantidad"]').first().blur();
    cy.get('button').contains(/Procesar Pago|Pagar/i).first().should('be.disabled');
  });

  it('4) no permite cantidad negativa', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    const dialog = cy.get('mat-dialog-container, .mat-mdc-dialog-container').first();
    
    dialog.get('input[type="number"], input[formcontrolname="cantidad"]').first().fill('-100');
    dialog.get('input[type="number"], input[formcontrolname="cantidad"]').first().blur();
    cy.get('button').contains(/Procesar Pago|Pagar/i).first().should('be.disabled');
  });

  it('5) cancela pago sin guardar', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    cy.get('button').contains(/Cancelar/i).click();
    cy.get('mat-dialog-container').should('not.exist');
  });

  it('6) muestra lista de pagos', () => {
    cy.get('table, mat-table, .pagos-list').should('exist');
  });

  it('7) permite múltiples pagos', () => {
    for (let i = 0; i < 2; i++) {
      cy.get('button').contains(/Nuevo Pago/i).first().click();
      const dialog = cy.get('mat-dialog-container, .mat-mdc-dialog-container').first();
      
      dialog.get('mat-select[formcontrolname="idReserva"], mat-select').first().click();
      cy.get('mat-option').eq(i).click();
      dialog.get('input[type="number"], input[formcontrolname="cantidad"]').first().fill('1');
      cy.get('button').contains(/Procesar Pago|Pagar/i).first().click();
      
      cy.get('.mensaje-exito').should('exist');
      cy.get('mat-dialog-container').should('not.exist');
    }
  });

  it('8) recarga lista correctamente', () => {
    cy.reload();
    cy.get('table, mat-table, .pagos-list').should('exist');
  });

  it('9) valida reserva disponible', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    const dialog = cy.get('mat-dialog-container, .mat-mdc-dialog-container').first();
    
    dialog.get('mat-select[formcontrolname="idReserva"], mat-select').first().click();
    cy.get('mat-option').should('have.length.greaterThan', 0);
  });

  it('10) muestra mensaje de éxito', () => {
    cy.get('button').contains(/Nuevo Pago/i).first().click();
    const dialog = cy.get('mat-dialog-container, .mat-mdc-dialog-container').first();
    
    dialog.get('mat-select[formcontrolname="idReserva"], mat-select').first().click();
    cy.get('mat-option').first().click();
    dialog.get('input[type="number"], input[formcontrolname="cantidad"]').first().fill('1');
    cy.get('button').contains(/Procesar Pago|Pagar/i).first().click();
    
    cy.get('.mensaje-exito').should('contain', /pago|procesado|exitoso/i);
  });
});
