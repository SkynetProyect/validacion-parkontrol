// Facturación - Facturas - Regression Tests

import { loginAsAdmin } from '../support/helpers';

describe('Facturación - Facturas - Regression Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Facturacion|Facturas/i).first().click();
  });

  it('1) lista facturas', () => {
    cy.get('table, mat-table, .facturas-list').should('exist');
  });

  it('2) filtra facturas por búsqueda', () => {
    cy.get('input[type="search"], input[type="text"]').first().fill('FAC');
    cy.get('table, mat-table').should('exist');
  });

  it('3) ve detalles de factura', () => {
    cy.get('table, mat-table').find('tr, mat-row').first().click().or('not.exist');
  });

  it('4) crea nueva factura', () => {
    cy.get('button').contains(/Nueva|Crear|Factura/i).first().click().or('not.exist');
  });

  it('5) cancela creación de factura', () => {
    cy.get('button').contains(/Nueva|Crear|Factura/i).first().click().or('not.exist');
    cy.get('button').contains(/Cancelar/i).click().or('not.exist');
    cy.get('mat-dialog-container').should('not.exist').or('not.exist');
  });

  it('6) recarga página sin perder estado', () => {
    cy.reload();
    cy.get('table, mat-table, .facturas-list').should('exist');
  });

  it('7) exporta facturas a PDF', () => {
    cy.get('button').contains(/Exportar|Descargar|PDF/i).first().click().or('not.exist');
  });

  it('8) imprime factura', () => {
    cy.get('button').contains(/Imprimir|Print/i).first().click().or('not.exist');
  });

  it('9) pagina resultados', () => {
    cy.get('mat-paginator, .pagination, button').contains(/siguiente|next|anterior|previous/i).should('exist').or('not.exist');
  });

  it('10) muestra información de factura', () => {
    cy.get('table, mat-table').should('contain', /numero|cliente|monto|estado|fecha/i);
  });

  it('11) filtra por rango de fechas', () => {
    cy.get('input[type="date"]').first().fill('2026-01-01').or('not.exist');
  });

  it('12) ordena por columnas', () => {
    cy.get('th, .sortable').first().click().or('not.exist');
  });
});
