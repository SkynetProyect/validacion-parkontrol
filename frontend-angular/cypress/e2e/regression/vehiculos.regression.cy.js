// Vehículos - Regression Tests

import { loginAsAdmin } from '../support/helpers';

describe('Vehículos - Regression Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Vehiculos/i).click();
    cy.url().should('include', '/vehiculos');
  });

  it('1) crea vehículo con placa válida', () => {
    cy.get('.create-button').first().click();
    cy.get('input[type="text"]').first().fill('RTX332');
    cy.get('button').contains(/Crear/i).click();
    cy.get('text=RTX332').should('be.visible');
  });

  it('2) no permite crear sin placa', () => {
    cy.get('.create-button').first().click();
    cy.get('input[type="text"]').first().fill('');
    cy.get('button').contains(/Crear/i).should('be.disabled');
  });

  it('3) muestra lista de vehículos', () => {
    cy.get('table, mat-table, .vehiculos-list').should('exist');
  });

  it('4) permite múltiples vehículos', () => {
    for (let i = 0; i < 2; i++) {
      cy.get('.create-button').first().click();
      cy.get('input[type="text"]').first().fill(`PLC${i}${Math.random().toString().slice(2, 5)}`);
      cy.get('button').contains(/Crear/i).click();
    }
  });

  it('5) recarga lista correctamente', () => {
    cy.reload();
    cy.get('table, mat-table, .vehiculos-list').should('exist');
  });

  it('6) valida formato de placa en tiempo real', () => {
    cy.get('.create-button').first().click();
    cy.get('input[type="text"]').first().fill('PLACA');
    cy.get('button').contains(/Crear/i).should('not.be.disabled');
  });

  it('7) limpia campo después de crear', () => {
    cy.get('.create-button').first().click();
    cy.get('input[type="text"]').first().fill('PLC001');
    cy.get('button').contains(/Crear/i).click();
    cy.get('input[type="text"]').first().should('have.value', '');
  });

  it('8) visualiza placa creada en tabla', () => {
    const placa = `PLC${Date.now().toString().slice(-3)}`;
    cy.get('.create-button').first().click();
    cy.get('input[type="text"]').first().fill(placa);
    cy.get('button').contains(/Crear/i).click();
    cy.get('table, mat-table').should('contain', placa);
  });

  it('9) no permite campo vacío en validación', () => {
    cy.get('.create-button').first().click();
    cy.get('input[type="text"]').first().focus().blur();
    cy.get('button').contains(/Crear/i).should('be.disabled');
  });

  it('10) permite cancelar creación', () => {
    cy.get('.create-button').first().click();
    cy.get('input[type="text"]').first().fill('PLC123');
    cy.get('button').contains(/Cancelar|ESC/i).click().or(() => {
      cy.get('mat-dialog-container').trigger('keydown', { keyCode: 27 });
    });
  });
});
