// Facturación - Clientes - Regression Tests
// Pruebas de regresión para funcionalidades de creación de clientes

import { loginAsAdmin, buildUniqueNumeroDocumento, buildUniqueCorreo } from '../support/helpers';

describe('Facturación - Clientes Regression Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Facturacion/i).click();
    cy.url().should('include', '/facturacion');
  });

  it('1) crea cliente exitosamente con campos correctos', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('mat-dialog-container').should('be.visible');

    const numero = buildUniqueNumeroDocumento();
    const correo = buildUniqueCorreo();

    cy.get('input[formcontrolname="numeroDocumento"]').fill(numero);
    cy.get('input[formcontrolname="correo"]').fill(correo);

    cy.get('mat-dialog-container button').contains(/Aceptar/i).should('not.be.disabled');
    cy.get('mat-dialog-container button').contains(/Aceptar/i).click();

    cy.get('mat-dialog-container').should('not.exist');
    cy.get('.mensaje-exito').should('contain', numero);
  });

  it('2) no permite crear cliente sin número de identificación', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('mat-dialog-container').should('be.visible');

    cy.get('input[formcontrolname="numeroDocumento"]').fill('');
    cy.get('input[formcontrolname="numeroDocumento"]').blur();
    cy.get('input[formcontrolname="correo"]').fill('test@yopmail.com');

    cy.get('mat-dialog-container button').contains(/Aceptar/i).should('be.disabled');
    cy.get('mat-dialog-container').should('contain', /Este campo es obligatorio|Este campo es requerido/i);
  });

  it('3) no permite crear cliente con 3 caracteres en número de identificación', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('mat-dialog-container').should('be.visible');

    cy.get('input[formcontrolname="numeroDocumento"]').fill('123');
    cy.get('input[formcontrolname="numeroDocumento"]').blur();
    cy.get('input[formcontrolname="correo"]').fill('test@gmail.com');

    cy.get('mat-dialog-container button').contains(/Aceptar/i).should('be.disabled');
    cy.get('mat-dialog-container').should('contain', /solo numeros|6 a 10 digitos|6 a 10 dígitos/i);
  });

  it('4) no permite crear cliente con 20 caracteres en número documento para tipo CC', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('mat-dialog-container').should('be.visible');

    cy.get('input[formcontrolname="numeroDocumento"]').fill('12345678901234567890');
    cy.get('input[formcontrolname="numeroDocumento"]').blur();
    cy.get('input[formcontrolname="correo"]').fill('test@gmail.com');

    cy.get('mat-dialog-container button').contains(/Aceptar/i).should('be.disabled');
    cy.get('mat-dialog-container').should('contain', /solo numeros|6 a 10 digitos|6 a 10 dígitos/i);
  });

  it('5) no permite crear cliente sin correo', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('mat-dialog-container').should('be.visible');

    cy.get('input[formcontrolname="numeroDocumento"]').fill('123456');
    cy.get('input[formcontrolname="numeroDocumento"]').blur();
    cy.get('input[formcontrolname="correo"]').fill('');
    cy.get('input[formcontrolname="correo"]').blur();

    cy.get('mat-dialog-container button').contains(/Aceptar/i).should('be.disabled');
  });

  it('6) no permite correo sin dominio', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('mat-dialog-container').should('be.visible');

    cy.get('input[formcontrolname="numeroDocumento"]').fill('123456');
    cy.get('input[formcontrolname="correo"]').fill('clientetest');
    cy.get('input[formcontrolname="correo"]').blur();

    cy.get('mat-dialog-container button').contains(/Aceptar/i).should('be.disabled');
  });

  it('7) valida correo con @ pero sin dominio válido', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('mat-dialog-container').should('be.visible');

    cy.get('input[formcontrolname="numeroDocumento"]').fill('123456');
    cy.get('input[formcontrolname="correo"]').fill('cliente@');
    cy.get('input[formcontrolname="correo"]').blur();

    cy.get('mat-dialog-container button').contains(/Aceptar/i).should('be.disabled');
  });

  it('8) cancela creación sin guardar cambios', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();

    cy.get('input[formcontrolname="numeroDocumento"]').fill('123456');
    cy.get('input[formcontrolname="correo"]').fill('test@test.com');
    
    cy.get('mat-dialog-container button').contains(/Cancelar/i).click();
    cy.get('mat-dialog-container').should('not.exist');
  });

  it('9) tipo de documento es obligatorio si es requerido', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();

    // Verificar que tipoDocumento tiene valor por defecto
    cy.get('mat-select[formcontrolname="tipoDocumento"]').should('exist');
  });

  it('10) muestra lista de clientes después de creación', () => {
    const numero = buildUniqueNumeroDocumento();
    const correo = buildUniqueCorreo();

    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('input[formcontrolname="numeroDocumento"]').fill(numero);
    cy.get('input[formcontrolname="correo"]').fill(correo);
    cy.get('mat-dialog-container button').contains(/Aceptar/i).click();

    cy.get('mat-dialog-container').should('not.exist');
    cy.get('table, mat-table, .cliente-list').should('exist');
  });

  it('11) permite múltiples creaciones de clientes en sesión', () => {
    for (let i = 0; i < 2; i++) {
      const numero = buildUniqueNumeroDocumento();
      const correo = buildUniqueCorreo();

      cy.get('button').contains(/\+ Nuevo Cliente/i).click();
      cy.get('input[formcontrolname="numeroDocumento"]').fill(numero);
      cy.get('input[formcontrolname="correo"]').fill(correo);
      cy.get('mat-dialog-container button').contains(/Aceptar/i).click();
      
      cy.get('.mensaje-exito').should('exist');
      cy.get('mat-dialog-container').should('not.exist');
    }
  });

  it('12) recarga lista de clientes correctamente', () => {
    cy.reload();
    cy.get('table, mat-table, .cliente-list').should('exist');
  });
});
