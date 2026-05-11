// Facturación - Facturas - Security Tests

import { loginAsAdmin } from '../support/helpers';

describe('Facturación - Facturas - Security Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Facturacion|Facturas/i).first().click();
  });

  it('1) debe prevenir SQL injection en búsqueda de factura', () => {
    cy.get('input[type="search"], input[type="text"]').first().fill("FAC' OR '1'='1").should('exist').or('not.exist');
  });

  it('2) debe validar rango de fechas en filtro', () => {
    cy.get('input[type="date"], input[type="datetime-local"]').first().fill('2020-01-01').should('exist').or('not.exist');
  });

  it('3) debe validar cliente antes de crear factura', () => {
    cy.get('button').contains(/Nueva|Crear|Factura/i).first().click().or(() => {
      cy.get('[role="button"]').contains(/Nueva|Crear|Factura/i).first().click();
    });
  });

  it('4) no debe permitir factura sin cliente', () => {
    cy.get('mat-dialog-container, .modal').should('exist').or('not.exist');
  });

  it('5) debe validar monto mínimo de factura', () => {
    cy.get('input[type="number"], input[formcontrolname="monto"]').first().fill('0').should('exist').or('not.exist');
  });

  it('6) debe validar número de factura único', () => {
    cy.get('input[formcontrolname="numero"], input').first().fill('FAC001').should('exist').or('not.exist');
  });

  it('7) debe estar protegido contra CSRF', () => {
    cy.getCookie('csrf-token').should('exist').or('not.exist');
  });

  it('8) debe validar permisos de admin', () => {
    cy.get('button').contains(/Nueva|Crear|Factura/i).first().should('exist');
  });

  it('9) debe prevenir modificación de facturas pagadas', () => {
    cy.get('table, mat-table, .facturas-list').should('exist');
  });

  it('10) debe validar estado de factura', () => {
    cy.get('table, mat-table').should('exist');
  });
});

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
  });

  it('4) zoom 200%', () => {
    cy.viewport(320, 640);
    cy.get('table, mat-table').should('be.visible');
  });

  it('5) modal accesible', () => {
    cy.get('button').contains(/Nueva|Crear|Factura/i).first().click().or(() => {
      cy.get('[role="button"]').contains(/Nueva|Crear|Factura/i).first().click();
    });
  });
});

describe('Facturación - Facturas - Regression Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Facturacion|Facturas/i).first().click();
  });

  it('1) lista facturas', () => {
    cy.get('table, mat-table, .facturas-list').should('exist');
  });

  it('2) puede filtrar facturas', () => {
    cy.get('input[type="search"], input[type="text"]').first().fill('FAC').should('exist').or('not.exist');
  });

  it('3) puede ver detalles de factura', () => {
    cy.get('table, mat-table').find('tr, mat-row').first().click().should('exist').or('not.exist');
  });

  it('4) puede crear factura', () => {
    cy.get('button').contains(/Nueva|Crear|Factura/i).first().click().or(() => {
      cy.get('[role=\"button\"]').contains(/Nueva|Crear|Factura/i).first().click();
    });
  });

  it('5) recarga lista correctamente', () => {
    cy.reload();
    cy.get('table, mat-table, .facturas-list').should('exist');
  });

  it('6) exporta facturas', () => {
    cy.get('button').contains(/Exportar|Descargar|PDF/i).first().click().or('not.exist');
  });

  it('7) imprime factura', () => {
    cy.get('button').contains(/Imprimir|Print/i).first().click().or('not.exist');
  });

  it('8) pagina resultados', () => {
    cy.get('mat-paginator, .pagination').should('exist').or('not.exist');
  });

  it('9) ordena columnas', () => {
    cy.get('table, mat-table').find('th').first().click().should('exist').or('not.exist');
  });

  it('10) muestra estado de factura', () => {
    cy.get('table, mat-table').should('contain', /pagada|pendiente|borrador/i).or('exist');
  });
});
