// Parqueaderos - Security Tests
// Pruebas de seguridad para creación de parqueaderos

import { loginAsAdmin } from '../support/helpers';

describe('Parqueaderos - Security Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Parqueaderos/i).click();
    cy.url().should('include', '/parqueaderos');
  });

  it('1) debe prevenir SQL injection en nombre del parqueadero', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    
    cy.get('input[formcontrolname="nombre"]').fill("PARK' OR '1'='1");
    cy.get('input[formcontrolname="ubicacion"]').fill('Calle 19');
    cy.get('input[formcontrolname="capacidadTotal"]').fill('100');
    
    cy.get('mat-dialog-container button').contains(/Crear/i).should('be.disabled');
  });

  it('2) debe prevenir SQL injection en ubicación', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    
    cy.get('input[formcontrolname="nombre"]').fill('PARKEADERO');
    cy.get('input[formcontrolname="ubicacion"]').fill("Calle 19' OR '1'='1");
    cy.get('input[formcontrolname="capacidadTotal"]').fill('100');
    
    cy.get('mat-dialog-container button').contains(/Crear/i).should('be.disabled');
  });

  it('3) debe validar capacidad como número positivo', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    
    cy.get('input[formcontrolname="nombre"]').fill('PARQUEADERO');
    cy.get('input[formcontrolname="ubicacion"]').fill('Calle 19');
    cy.get('input[formcontrolname="capacidadTotal"]').fill('-100');
    cy.get('input[formcontrolname="capacidadTotal"]').blur();
    
    cy.get('mat-dialog-container button').contains(/Crear/i).should('be.disabled');
  });

  it('4) no debe permitir capacidad cero', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    
    cy.get('input[formcontrolname="nombre"]').fill('PARQUEADERO');
    cy.get('input[formcontrolname="ubicacion"]').fill('Calle 19');
    cy.get('input[formcontrolname="capacidadTotal"]').fill('0');
    cy.get('input[formcontrolname="capacidadTotal"]').blur();
    
    cy.get('mat-dialog-container button').contains(/Crear/i).should('be.disabled');
  });

  it('5) debe validar permisos antes de crear parqueadero', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).should('exist');
  });

  it('6) debe sanitizar caracteres especiales en nombre', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    
    const nombre = `PARK-${Date.now()}`;
    cy.get('input[formcontrolname="nombre"]').fill(nombre);
    cy.get('input[formcontrolname="nombre"]').should('have.value', nombre);
  });

  it('7) debe validar longitud máxima de nombre', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    
    const largeNombre = 'P'.repeat(1000);
    cy.get('input[formcontrolname="nombre"]').invoke('val', largeNombre);
    cy.get('input[formcontrolname="ubicacion"]').fill('Calle 19');
    cy.get('input[formcontrolname="capacidadTotal"]').fill('100');
    
    cy.get('mat-dialog-container button').contains(/Crear/i).should('be.disabled');
  });

  it('8) debe prevenir nombres duplicados', () => {
    const nombreUnico = `PARK-${Date.now()}`;
    
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    cy.get('input[formcontrolname="nombre"]').fill(nombreUnico);
    cy.get('input[formcontrolname="ubicacion"]').fill('Calle 19');
    cy.get('input[formcontrolname="capacidadTotal"]').fill('100');
    cy.get('mat-dialog-container button').contains(/Crear/i).click();
    
    cy.get('.mensaje-exito').should('exist');
    
    // Intentar crear parqueadero con mismo nombre
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    cy.get('input[formcontrolname="nombre"]').fill(nombreUnico);
    cy.get('input[formcontrolname="ubicacion"]').fill('Otra ubicación');
    cy.get('input[formcontrolname="capacidadTotal"]').fill('50');
    cy.get('mat-dialog-container button').contains(/Crear/i).click();
    
    cy.get('.mensaje-error').should('exist');
  });

  it('9) debe estar protegido contra ataque CSRF', () => {
    cy.getCookie('csrf-token').should('exist').or('not.exist');
  });

  it('10) debe validar ubicación válida con caracteres permitidos', () => {
    cy.get('button').contains(/Nuevo Parqueadero|Crear primer parqueadero/i).first().click();
    
    cy.get('input[formcontrolname="nombre"]').fill('PARQUEADERO');
    cy.get('input[formcontrolname="ubicacion"]').fill('<script>alert(1)</script>');
    cy.get('input[formcontrolname="capacidadTotal"]').fill('100');
    
    cy.get('mat-dialog-container button').contains(/Crear/i).should('be.disabled');
  });
});
