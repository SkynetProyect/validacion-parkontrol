// Tarifas - Regression Tests

import { loginAsAdmin } from '../support/helpers';

describe('Tarifas - Regression Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Tarifas/i).click();
    cy.url().should('include', '/tarifas');
  });

  it('1) crea tarifa válida', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    const inputs = cy.get('mat-dialog-container input[type="number"]');
    inputs.eq(0).fill('2000');
    inputs.eq(1).fill('3000');
    cy.get('.mat-mdc-select-placeholder').first().click();
    cy.get('mat-option').first().click();
    cy.get('button').contains(/Crear/i).click();
    cy.get('.mensaje-exito').should('be.visible');
  });

  it('2) no sin valores', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    cy.get('button').contains(/Crear/i).should('be.disabled');
  });

  it('3) no precio negativo', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    const inputs = cy.get('mat-dialog-container input[type="number"]');
    inputs.eq(0).fill('-100');
    inputs.eq(1).fill('3000');
    cy.get('button').contains(/Crear/i).should('be.disabled');
  });

  it('4) no precio cero', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    const inputs = cy.get('mat-dialog-container input[type="number"]');
    inputs.eq(0).fill('0');
    inputs.eq(1).fill('3000');
    cy.get('button').contains(/Crear/i).should('be.disabled');
  });

  it('5) cancela creación', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    cy.get('button').contains(/Cancelar/i).click();
    cy.get('mat-dialog-container').should('not.exist');
  });

  it('6) lista tarifas', () => {
    cy.get('table, mat-table, .tarifas-list').should('exist');
  });

  it('7) múltiples tarifas', () => {
    for (let i = 0; i < 2; i++) {
      cy.get('button').contains(/Nueva Tarifa/i).click();
      const inputs = cy.get('mat-dialog-container input[type="number"]');
      inputs.eq(0).fill(`${1000 + (i * 500)}`);
      inputs.eq(1).fill(`${2000 + (i * 500)}`);
      cy.get('.mat-mdc-select-placeholder').first().click();
      cy.get('mat-option').first().click();
      cy.get('button').contains(/Crear/i).click();
    }
  });

  it('8) recarga lista', () => {
    cy.reload();
    cy.get('table, mat-table, .tarifas-list').should('exist');
  });

  it('9) valida tipo requerido', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    const inputs = cy.get('mat-dialog-container input[type="number"]');
    inputs.eq(0).fill('2000');
    inputs.eq(1).fill('3000');
    cy.get('button').contains(/Crear/i).should('be.disabled');
  });

  it('10) permite valores válidos después de inválidos', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    const inputs = cy.get('mat-dialog-container input[type="number"]');
    inputs.eq(0).fill('-100');
    inputs.eq(0).clear();
    inputs.eq(0).fill('2000');
    inputs.eq(1).fill('3000');
    cy.get('.mat-mdc-select-placeholder').first().click();
    cy.get('mat-option').first().click();
    cy.get('button').contains(/Crear/i).should('not.be.disabled');
  });
});
