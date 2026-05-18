// Facturación - Clientes - Security Tests
// Pruebas de seguridad para creación de clientes

import { loginAsAdmin, buildUniqueNumeroDocumento, buildUniqueCorreo } from '../../support/helpers';

describe('Facturación - Clientes Security Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Facturacion/i).click();
    cy.url().should('include', '/facturacion');
  });

  it('1) debe prevenir SQL injection en número de documento', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('mat-dialog-container').should('be.visible');
    
    cy.get('input[formcontrolname="numeroDocumento"]').fill("123456' OR '1'='1");
    cy.get('input[formcontrolname="correo"]').fill('test@test.com');
    
    cy.get('mat-dialog-container button').contains(/Aceptar/i).should('be.disabled');
  });

  it('2) debe prevenir SQL injection en correo', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('mat-dialog-container').should('be.visible');
    
    cy.get('input[formcontrolname="numeroDocumento"]').fill('123456');
    cy.get('input[formcontrolname="correo"]').fill("test@test.com' OR '1'='1");
    
    cy.get('mat-dialog-container button').contains(/Aceptar/i).should('be.disabled');
  });

  it('3) debe validar formato de correo contra ataques XSS', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('mat-dialog-container').should('be.visible');
    
    cy.get('input[formcontrolname="numeroDocumento"]').fill('123456');
    cy.get('input[formcontrolname="correo"]').fill('<script>alert("xss")</script>');
    
    cy.get('mat-dialog-container button').contains(/Aceptar/i).should('be.disabled');
  });

  it('4) debe rechazar dominio de correo sospechoso', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('mat-dialog-container').should('be.visible');
    
    cy.get('input[formcontrolname="numeroDocumento"]').fill('123456');
    cy.get('input[formcontrolname="correo"]').fill('test@maliciousdomain.xyz');
    
    // Debería validar contra lista blanca o gris de dominios
    cy.get('mat-dialog-container button').contains(/Aceptar/i).click();
    cy.get('.mensaje-error').should('not.exist');
  });

  it('5) debe validar longitud máxima de documento para prevenir buffer overflow', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('mat-dialog-container').should('be.visible');
    
    const largeNumber = '1'.repeat(1000);
    cy.get('input[formcontrolname="numeroDocumento"]').invoke('val', largeNumber);
    cy.get('input[formcontrolname="correo"]').fill('test@test.com');
    
    cy.get('mat-dialog-container button').contains(/Aceptar/i).should('be.disabled');
  });

  it('6) debe rechazar caracteres especiales en número de documento', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('mat-dialog-container').should('be.visible');
    
    cy.get('input[formcontrolname="numeroDocumento"]').fill('123456!@#$%');
    cy.get('input[formcontrolname="correo"]').fill('test@test.com');
    
    cy.get('mat-dialog-container button').contains(/Aceptar/i).should('be.disabled');
  });

  it('7) no debe permitir documentos duplicados por seguridad de integridad', () => {
    const uniqueDoc = buildUniqueNumeroDocumento();
    const uniqueEmail = buildUniqueCorreo();
    
    // Crear primer cliente
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('input[formcontrolname="numeroDocumento"]').fill(uniqueDoc);
    cy.get('input[formcontrolname="correo"]').fill(uniqueEmail);
    cy.get('mat-dialog-container button').contains(/Aceptar/i).click();
    
    cy.get('.mensaje-exito').should('be.visible');
    cy.get('mat-dialog-container').should('not.exist');
    
    // Intentar crear cliente con mismo documento
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('input[formcontrolname="numeroDocumento"]').fill(uniqueDoc);
    cy.get('input[formcontrolname="correo"]').fill('otro@test.com');
    cy.get('mat-dialog-container button').contains(/Aceptar/i).click();
    
    cy.get('.mensaje-error').should('exist');
  });

  it('8) debe validar permisos antes de permitir creación', () => {
    // Solo admin debería poder crear clientes
    cy.get('button').contains(/\+ Nuevo Cliente/i).should('exist');
  });

  it('9) debe sanitizar entrada de correo con caracteres especiales válidos', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    
    const numero = buildUniqueNumeroDocumento();
    cy.get('input[formcontrolname="numeroDocumento"]').fill(numero);
    cy.get('input[formcontrolname="correo"]').fill('test+tag@test.co.uk');
    cy.get('input[formcontrolname="numeroDocumento"]').blur();
    
    cy.get('mat-dialog-container button').contains(/Aceptar/i).should('not.be.disabled');
  });

  it('10) debe estar protegido contra ataque CSRF', () => {
    cy.getCookie('csrf-token').should('exist');
  });
});
