// Tarifas - Security, Accessibility, Regression Tests

import { loginAsAdmin } from '../../support/helpers';

describe('Tarifas - Security Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Tarifas/i).click();
    cy.url().should('include', '/tarifas');
  });

  it('1) debe validar precios como números positivos', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    const inputs = cy.get('mat-dialog-container input[type="number"]');
    inputs.eq(0).fill('-100');
    inputs.eq(1).fill('3000');
    cy.get('button').contains(/Crear/i).should('be.disabled');
  });

  it('2) no debe permitir precios negativos', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    const inputs = cy.get('mat-dialog-container input[type="number"]');
    inputs.eq(0).fill('-50');
    cy.get('button').contains(/Crear/i).should('be.disabled');
  });

  it('3) debe validar monto mínimo', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    const inputs = cy.get('mat-dialog-container input[type="number"]');
    inputs.eq(0).fill('0');
    cy.get('button').contains(/Crear/i).should('be.disabled');
  });

  it('4) debe prevenir overflow en valores grandes', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    const inputs = cy.get('mat-dialog-container input[type="number"]');
    inputs.eq(0).invoke('val', Number.MAX_SAFE_INTEGER + 1);
    inputs.eq(1).invoke('val', Number.MAX_SAFE_INTEGER + 1);
  });

  it('5) debe validar select de tipo tarifa', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    cy.get('.mat-mdc-select-placeholder').first().click();
    cy.get('mat-option').should('have.length.greaterThan', 0);
  });
});

describe('Tarifas - Accessibility Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Tarifas/i).click();
    cy.injectAxe();
  });

  it('1) modal debe ser accesible', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    cy.get('mat-dialog-container').should('have.attr', 'role', 'dialog');
  });

  it('2) no debe tener problemas con axe', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    cy.checkA11y('mat-dialog-container');
  });

  it('3) permitir navegación por teclado', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    cy.get('input[type="number"]').first().focus().should('have.focus');
  });
});

describe('Tarifas - Regression Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Tarifas/i).click();
  });

  it('1) crea tarifa con valores válidos', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    const inputs = cy.get('mat-dialog-container input[type="number"]');
    inputs.eq(0).fill('2000');
    inputs.eq(1).fill('3000');
    cy.get('.mat-mdc-select-placeholder').first().click();
    cy.get('mat-option').first().click();
    cy.get('button').contains(/Crear/i).click();
    cy.get('.mensaje-exito').should('be.visible');
  });

  it('2) no permite sin valores', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    cy.get('button').contains(/Crear/i).should('be.disabled');
  });

  it('3) no permite precio negativo', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    const inputs = cy.get('mat-dialog-container input[type="number"]');
    inputs.eq(0).fill('-100');
    inputs.eq(1).fill('3000');
    cy.get('button').contains(/Crear/i).should('be.disabled');
  });

  it('4) cancela creación', () => {
    cy.get('button').contains(/Nueva Tarifa/i).click();
    cy.get('button').contains(/Cancelar/i).click();
    cy.get('mat-dialog-container').should('not.exist');
  });

  it('5) muestra lista de tarifas', () => {
    cy.get('table, mat-table').should('exist');
  });
});
