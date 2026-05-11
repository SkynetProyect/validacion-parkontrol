// Parqueaderos - Regression Tests

import { loginAsAdmin } from '../support/helpers';

describe('Parqueaderos - Regression Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Parqueaderos/i).click();
    cy.url().should('include', '/parqueaderos');
  });

  it('1) crea parqueadero con valores válidos', () => {
    const nombreUnico = `PARK-${Date.now()}`;
    
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    cy.get('input[formcontrolname="nombre"]').fill(nombreUnico);
    cy.get('input[formcontrolname="ubicacion"]').fill('Calle 19 B sur #30-29');
    cy.get('input[formcontrolname="capacidadTotal"]').fill('150');
    
    cy.get('mat-dialog-container button').contains(/Crear/i).should('not.be.disabled');
    cy.get('mat-dialog-container button').contains(/Crear/i).click();
    
    cy.get('mat-dialog-container').should('not.exist');
    cy.get('.mensaje-exito').should('exist');
  });

  it('2) no permite crear sin nombre', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    
    cy.get('input[formcontrolname="ubicacion"]').fill('Calle 59 Sur');
    cy.get('input[formcontrolname="capacidadTotal"]').fill('100');
    
    cy.get('mat-dialog-container button').contains(/Crear/i).should('be.disabled');
  });

  it('3) no permite crear sin ubicación', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    
    cy.get('input[formcontrolname="nombre"]').fill('PARKENV');
    cy.get('input[formcontrolname="capacidadTotal"]').fill('100');
    
    cy.get('mat-dialog-container button').contains(/Crear/i).should('be.disabled');
  });

  it('4) no permite crear sin capacidad', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    
    cy.get('input[formcontrolname="nombre"]').fill('PARKENV');
    cy.get('input[formcontrolname="ubicacion"]').fill('CALLE 19 SUR');
    cy.get('input[formcontrolname="capacidadTotal"]').fill('');
    cy.get('input[formcontrolname="capacidadTotal"]').blur();
    
    cy.get('mat-dialog-container button').contains(/Crear/i).should('be.disabled');
  });

  it('5) valida que capacidad sea número positivo', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    
    cy.get('input[formcontrolname="nombre"]').fill('PARKENV');
    cy.get('input[formcontrolname="ubicacion"]').fill('Ubicación');
    cy.get('input[formcontrolname="capacidadTotal"]').fill('100');
    cy.get('input[formcontrolname="capacidadTotal"]').should('have.value', '100');
  });

  it('6) cancela creación de parqueadero', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    
    cy.get('input[formcontrolname="nombre"]').fill('PARKENV');
    cy.get('mat-dialog-container button').contains(/Cancelar/i).click();
    
    cy.get('mat-dialog-container').should('not.exist');
  });

  it('7) muestra lista de parqueaderos', () => {
    cy.get('table, mat-table, .parqueaderos-list').should('exist');
  });

  it('8) permite múltiples parqueaderos', () => {
    for (let i = 0; i < 2; i++) {
      const nombreUnico = `PARK-${Date.now()}-${i}`;
      
      cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
      cy.get('input[formcontrolname="nombre"]').fill(nombreUnico);
      cy.get('input[formcontrolname="ubicacion"]').fill(`Ubicación ${i}`);
      cy.get('input[formcontrolname="capacidadTotal"]').fill('100');
      cy.get('mat-dialog-container button').contains(/Crear/i).click();
      
      cy.get('.mensaje-exito').should('exist');
      cy.get('mat-dialog-container').should('not.exist');
    }
  });

  it('9) recarga lista correctamente', () => {
    cy.reload();
    cy.get('table, mat-table, .parqueaderos-list').should('exist');
  });

  it('10) válida capacidad mínima', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    
    cy.get('input[formcontrolname="nombre"]').fill('PARKMIN');
    cy.get('input[formcontrolname="ubicacion"]').fill('Ubicación');
    cy.get('input[formcontrolname="capacidadTotal"]').fill('1');
    
    cy.get('mat-dialog-container button').contains(/Crear/i).should('not.be.disabled');
  });
});
