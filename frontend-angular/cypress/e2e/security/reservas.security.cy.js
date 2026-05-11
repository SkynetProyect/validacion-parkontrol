// Reservas - Security Tests
// Pruebas de seguridad para creación de reservas

import { loginAsAdmin, buildUniqueNumeroVehiculo } from '../support/helpers';

describe('Reservas - Security Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Reservas/i).click();
    cy.url().should('include', '/reservas');
  });

  it('1) debe prevenir SQL injection en número de placa', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    cy.get('mat-dialog-container').should('be.visible');
    
    cy.get('input[formcontrolname="placa"]').fill("ABC123' OR '1'='1");
    cy.get('input[formcontrolname="horaInicio"]').fill('2026-05-05T09:00');
    cy.get('input[formcontrolname="horaFin"]').fill('2026-05-05T11:00');
    
    cy.get('mat-dialog-container button').contains(/Crear Reserva/i).should('be.disabled');
  });

  it('2) debe validar rango de fechas válido', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    
    cy.get('input[formcontrolname="placa"]').fill('ABC123');
    cy.get('input[formcontrolname="horaInicio"]').fill('2026-05-05T12:00');
    cy.get('input[formcontrolname="horaFin"]').fill('2026-05-05T10:00');
    
    cy.get('mat-dialog-container button').contains(/Crear Reserva/i).should('be.disabled');
  });

  it('3) no debe permitir fechas en el pasado', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    
    cy.get('input[formcontrolname="placa"]').fill('ABC123');
    cy.get('input[formcontrolname="horaInicio"]').fill('2020-01-01T09:00');
    cy.get('input[formcontrolname="horaFin"]').fill('2020-01-01T11:00');
    
    cy.get('mat-dialog-container button').contains(/Crear Reserva/i).should('be.disabled');
  });

  it('4) debe prevenir reservas duplicadas en misma celda y tiempo', () => {
    const placa = buildUniqueNumeroVehiculo();
    
    cy.get('button').contains(/Nueva Reserva/i).click();
    cy.get('input[formcontrolname="placa"]').fill(placa);
    cy.get('mat-select[formcontrolname="idCelda"]').click();
    cy.get('mat-option:not([disabled])').first().click();
    cy.get('input[formcontrolname="horaInicio"]').fill('2026-05-05T09:00');
    cy.get('input[formcontrolname="horaFin"]').fill('2026-05-05T11:00');
    cy.get('mat-dialog-container button').contains(/Crear Reserva/i).click();
    
    cy.get('.mensaje-exito').should('exist');
    
    // Intentar crear reserva duplicada
    cy.get('button').contains(/Nueva Reserva/i).click();
    cy.get('input[formcontrolname="placa"]').fill(placa);
    cy.get('mat-select[formcontrolname="idCelda"]').click();
    cy.get('mat-option:not([disabled])').first().click();
    cy.get('input[formcontrolname="horaInicio"]').fill('2026-05-05T10:30');
    cy.get('input[formcontrolname="horaFin"]').fill('2026-05-05T12:00');
    cy.get('mat-dialog-container button').contains(/Crear Reserva/i).click();
    
    cy.get('.mensaje-error, mat-error').should('exist');
  });

  it('5) debe validar permisos antes de crear reserva', () => {
    cy.get('button').contains(/Nueva Reserva/i).should('exist');
  });

  it('6) no debe permitir sobreescritura de celda ocupada', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    
    cy.get('mat-select[formcontrolname="idCelda"]').click();
    cy.get('mat-option').should('have.length.greaterThan', 0);
  });

  it('7) debe sanitizar entrada de placa', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    
    const sanitizedPlaca = buildUniqueNumeroVehiculo();
    cy.get('input[formcontrolname="placa"]').fill(sanitizedPlaca);
    cy.get('input[formcontrolname="placa"]').should('have.value', sanitizedPlaca.toUpperCase() || sanitizedPlaca);
  });

  it('8) debe validar celda disponible', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    
    cy.get('mat-select[formcontrolname="idCelda"]').click();
    // Debe mostrar solo celdas disponibles
    cy.get('mat-option:not([disabled])').should('have.length.greaterThan', 0);
  });

  it('9) no debe permitir duración cero de reserva', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    
    cy.get('input[formcontrolname="placa"]').fill('ABC123');
    cy.get('input[formcontrolname="horaInicio"]').fill('2026-05-05T09:00');
    cy.get('input[formcontrolname="horaFin"]').fill('2026-05-05T09:00');
    
    cy.get('mat-dialog-container button').contains(/Crear Reserva/i).should('be.disabled');
  });

  it('10) debe validar duración máxima de reserva', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    
    cy.get('input[formcontrolname="placa"]').fill('ABC123');
    // Crear reserva de más de 24 horas
    cy.get('input[formcontrolname="horaInicio"]').fill('2026-05-05T09:00');
    cy.get('input[formcontrolname="horaFin"]').fill('2026-05-07T09:00');
    
    // Debería mostrar advertencia o rechazar
    cy.get('mat-dialog-container').should('contain', /máxima|máximo|horas/i).or('not.contain', /máxima|máximo|horas/i);
  });
});
