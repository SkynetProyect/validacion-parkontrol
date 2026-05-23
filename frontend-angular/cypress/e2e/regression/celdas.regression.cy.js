// Celdas - cambiarEstado Tests

import { loginAsAdmin } from '../../support/helpers';

describe('Celdas - Cambiar Estado Tests', () => {

  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Celdas/i).click();
    cy.url().should('include', '/celdas');
    // Esperamos que la tabla cargue antes de cada prueba
    cy.get('mat-table, table', { timeout: 10000 }).should('exist');
  });

  it('1) muestra lista de celdas', () => {
    cy.get('mat-table, table').should('exist');
    cy.get('tr').should('have.length.greaterThan', 1);
  });

  it('2) cambia estado de celda a OCUPADA', () => {
    // Primero resetea el filtro para ver todas las celdas
    cy.get('.filtro-estado mat-select').click();
    cy.get('mat-option').contains('Todos').click();
    cy.get('mat-table, table', { timeout: 10000 }).should('exist');
    cy.get('.estado-select mat-select').first().click();
    cy.get('mat-option').contains('Ocupada').click();
    cy.get('mat-table, table', { timeout: 10000 }).should('exist');
  });

  it('3) cambia estado de celda a LIBRE', () => {
    // Primero resetea el filtro para ver todas las celdas
    cy.get('.filtro-estado mat-select').click();
    cy.get('mat-option').contains('Todos').click();
    cy.get('mat-table, table', { timeout: 10000 }).should('exist');
    cy.get('.estado-select mat-select').first().click();
    cy.get('mat-option').contains('Libre').click();
    cy.get('mat-table, table', { timeout: 10000 }).should('exist');
  });

  it('4) filtra celdas por estado LIBRE', () => {
    cy.get('.filtro-estado mat-select').click();
    cy.get('mat-option').contains('Libre').click();
    cy.get('mat-table, table', { timeout: 10000 }).should('exist');
  });

  it('5) filtra celdas por estado OCUPADA', () => {
    cy.get('.filtro-estado mat-select').click();
    cy.get('mat-option').contains('Ocupada').click();
    cy.get('mat-table, table', { timeout: 10000 }).should('exist');
  });

  it('6) filtra por Todos muestra todas las celdas', () => {
    cy.get('.filtro-estado mat-select').click();
    cy.get('mat-option').contains('Todos').click();
    cy.get('mat-table, table', { timeout: 10000 }).should('exist');
    cy.get('tr').should('have.length.greaterThan', 1);
  });

});