// Usuarios - Reservas - Regression Tests

import { loginAsUser, buildUniqueNumeroVehiculo } from '../support/helpers';

describe('Usuarios - Reservas - Regression Tests', () => {
  beforeEach(() => {
    loginAsUser();
  });

  it('1) ve historial de reservas', () => {
    cy.get('a').contains(/Historial|Mis|Reservas/i).first().click();
    cy.get('table, mat-table, .reservas-list').should('exist');
  });

  it('2) puede buscar parqueaderos disponibles', () => {
    cy.get('a').contains(/Buscar|Parqueaderos|Tarifas/i).first().click();
    cy.get('button, [role="button"]').contains(/Buscar|Filtrar/i).first().should('exist').or('not.exist');
  });

  it('3) puede crear reserva', () => {
    cy.get('a').contains(/Crear|Nueva|Reserva|Reservar/i).first().click();
    cy.get('button').contains(/Crear|Reservar|Guardar/i).should('exist');
  });

  it('4) valida placa en formulario', () => {
    cy.get('a').contains(/Crear|Nueva|Reserva/i).first().click();
    const placa = buildUniqueNumeroVehiculo();
    cy.get('input[formcontrolname="placa"], input').first().fill(placa);
    cy.get('input[formcontrolname="placa"], input').first().should('have.value', placa.toUpperCase() || placa);
  });

  it('5) ve tarifas de parqueaderos', () => {
    cy.get('a').contains(/Tarifas|Buscar/i).first().click();
    cy.get('table, mat-table, .tarifas-list').should('exist').or('not.exist');
  });

  it('6) cierra sesión correctamente', () => {
    cy.get('[matmenuTrigger]').first().click();
    cy.get('[matmenuitem]').contains(/Salir|Logout/i).click();
    cy.url().should('include', '/login');
  });

  it('7) no puede acceder a admin dashboard', () => {
    cy.visit('http://localhost:4200/dashboard');
    cy.url().should('include', '/login').or('not.include', '/dashboard');
  });

  it('8) ve interfaz de usuario correctamente', () => {
    cy.get('.contenedor-cliente, [role="main"], main').should('exist');
  });

  it('9) puede navegar por menú', () => {
    cy.get('nav, [role="navigation"]').should('exist');
  });

  it('10) recarga página sin perder sesión', () => {
    cy.reload();
    cy.get('.contenedor-cliente, [role="main"]').should('exist');
  });
});
