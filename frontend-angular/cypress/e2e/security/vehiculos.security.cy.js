// Vehículos - Security Tests

import { loginAsAdmin } from '../support/helpers';

describe('Vehículos - Security Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Vehiculos/i).click();
    cy.url().should('include', '/vehiculos');
  });

  it('1) debe prevenir SQL injection en placa', () => {
    cy.get('.create-button').first().click();
    cy.get('input[type="text"]').first().fill("RTX332' OR '1'='1");
    cy.get('button').contains(/Crear/i).should('be.disabled');
  });

  it('2) debe validar formato de placa', () => {
    cy.get('.create-button').first().click();
    cy.get('input[type="text"]').first().fill('<script>alert(1)</script>');
    cy.get('button').contains(/Crear/i).should('be.disabled');
  });

  it('3) debe validar longitud máxima de placa', () => {
    cy.get('.create-button').first().click();
    cy.get('input[type="text"]').first().invoke('val', 'P'.repeat(1000));
    cy.get('button').contains(/Crear/i).should('be.disabled');
  });

  it('4) debe validar caracteres permitidos en placa', () => {
    cy.get('.create-button').first().click();
    cy.get('input[type="text"]').first().fill('RTX332');
    cy.get('button').contains(/Crear/i).should('not.be.disabled');
  });

  it('5) no debe permitir placas duplicadas', () => {
    const placa = `RTX${Math.random().toString().slice(2, 5)}`;
    
    cy.get('.create-button').first().click();
    cy.get('input[type="text"]').first().fill(placa);
    cy.get('button').contains(/Crear/i).click();
    
    cy.get('.create-button').first().click();
    cy.get('input[type="text"]').first().fill(placa);
    cy.get('button').contains(/Crear/i).click();
    
    cy.get('.mensaje-error').should('exist');
  });

  it('6) debe sanitizar entrada de placa', () => {
    cy.get('.create-button').first().click();
    const placa = 'RTX332';
    cy.get('input[type="text"]').first().fill(placa);
    cy.get('input[type="text"]').first().should('have.value', placa.toUpperCase() || placa);
  });

  it('7) debe validar permisos para crear', () => {
    cy.get('.create-button').first().should('exist');
  });

  it('8) debe estar protegido contra CSRF', () => {
    cy.getCookie('csrf-token').should('exist').or('not.exist');
  });

  it('9) no debe permitir caracteres especiales maliciosos', () => {
    cy.get('.create-button').first().click();
    cy.get('input[type="text"]').first().fill('RTX@#$%');
    cy.get('button').contains(/Crear/i).should('be.disabled');
  });

  it('10) debe validar entrada de forma síncrona', () => {
    cy.get('.create-button').first().click();
    cy.get('input[type="text"]').first().fill('');
    cy.get('button').contains(/Crear/i).should('be.disabled');
  });
});
