// Reservas - Regression Tests
// Pruebas de regresión para funcionalidades de reservas

import { loginAsAdmin, buildUniqueNumeroVehiculo } from '../../support/helpers';

describe('Reservas - Regression Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Reservas/i).click();
    cy.url().should('include', '/reservas');
  });

  it('1) crea reserva con datos válidos', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    cy.get('mat-dialog-container').should('be.visible');

    const placa = buildUniqueNumeroVehiculo();

    cy.get('input[formcontrolname="placa"]').fill(placa);
    cy.get('mat-select[formcontrolname="idCelda"]').click();
    cy.get('mat-option:not([disabled])').first().click();

    cy.get('input[formcontrolname="horaInicio"]').fill('2026-05-05T09:00');
    cy.get('input[formcontrolname="horaFin"]').fill('2026-05-05T11:00');

    cy.get('mat-dialog-container button').contains(/Crear Reserva/i).should('not.be.disabled');
    cy.get('mat-dialog-container button').contains(/Crear Reserva/i).click();

    cy.get('.mensaje-exito').should('be.visible');
  });

  it('2) no permite crear reserva sin placa', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    cy.get('mat-dialog-container').should('be.visible');

    cy.get('mat-select[formcontrolname="idCelda"]').click();
    cy.get('mat-option:not([disabled])').first().click();
    cy.get('input[formcontrolname="horaInicio"]').fill('2026-05-05T09:00');
    cy.get('input[formcontrolname="horaFin"]').fill('2026-05-05T11:00');

    cy.get('mat-dialog-container button').contains(/Crear Reserva/i).should('be.disabled');
  });

  it('3) no permite crear reserva con hora fin anterior a hora inicio', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    cy.get('mat-dialog-container').should('be.visible');

    const placa = buildUniqueNumeroVehiculo();

    cy.get('input[formcontrolname="placa"]').fill(placa);
    cy.get('mat-select[formcontrolname="idCelda"]').click();
    cy.get('mat-option:not([disabled])').first().click();

    cy.get('input[formcontrolname="horaInicio"]').fill('2026-05-05T12:00');
    cy.get('input[formcontrolname="horaFin"]').fill('2026-05-05T10:00');

    cy.get('mat-dialog-container button').contains(/Crear Reserva/i).should('be.disabled');
  });

  it('4) no permite crear reserva sin seleccionar celda', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();

    const placa = buildUniqueNumeroVehiculo();
    cy.get('input[formcontrolname="placa"]').fill(placa);
    cy.get('input[formcontrolname="horaInicio"]').fill('2026-05-05T09:00');
    cy.get('input[formcontrolname="horaFin"]').fill('2026-05-05T11:00');

    cy.get('mat-dialog-container button').contains(/Crear Reserva/i).should('be.disabled');
  });

  it('5) cancela creación de reserva', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();

    cy.get('input[formcontrolname="placa"]').fill('ABC123');
    cy.get('mat-dialog-container button').contains(/Cancelar/i).click();

    cy.get('mat-dialog-container').should('not.exist');
  });

  it('6) muestra lista de reservas después de creación', () => {
    const placa = buildUniqueNumeroVehiculo();

    cy.get('button').contains(/Nueva Reserva/i).click();
    cy.get('input[formcontrolname="placa"]').fill(placa);
    cy.get('mat-select[formcontrolname="idCelda"]').click();
    cy.get('mat-option:not([disabled])').first().click();
    cy.get('input[formcontrolname="horaInicio"]').fill('2026-05-05T09:00');
    cy.get('input[formcontrolname="horaFin"]').fill('2026-05-05T11:00');
    cy.get('mat-dialog-container button').contains(/Crear Reserva/i).click();

    cy.get('mat-dialog-container').should('not.exist');
    cy.get('table, mat-table, .reservas-list').should('exist');
  });

  it('7) permite múltiples reservas en sesión', () => {
    for (let i = 0; i < 2; i++) {
      const placa = buildUniqueNumeroVehiculo();

      cy.get('button').contains(/Nueva Reserva/i).click();
      cy.get('input[formcontrolname="placa"]').fill(placa);
      cy.get('mat-select[formcontrolname="idCelda"]').click();
      cy.get('mat-option:not([disabled])').first().click();
      cy.get('input[formcontrolname="horaInicio"]').fill(`2026-05-0${i + 5}T09:00`);
      cy.get('input[formcontrolname="horaFin"]').fill(`2026-05-0${i + 5}T11:00`);
      cy.get('mat-dialog-container button').contains(/Crear Reserva/i).click();

      cy.get('.mensaje-exito').should('exist');
      cy.get('mat-dialog-container').should('not.exist');
    }
  });

  it('8) recarga lista de reservas correctamente', () => {
    cy.reload();
    cy.get('table, mat-table, .reservas-list').should('exist');
  });

  it('9) valida que fecha inicio sea mayor que fecha actual', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();

    cy.get('input[formcontrolname="placa"]').fill('ABC123');
    cy.get('input[formcontrolname="horaInicio"]').fill('2020-01-01T09:00');
    cy.get('input[formcontrolname="horaFin"]').fill('2020-01-01T11:00');

    cy.get('mat-dialog-container button').contains(/Crear Reserva/i).should('be.disabled');
  });

  it('10) todas las celdas listadas deben estar disponibles', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();

    cy.get('mat-select[formcontrolname="idCelda"]').click();
    cy.get('mat-option').each(($option) => {
      cy.wrap($option).should('not.have.class', 'mat-mdc-option-disabled');
    });
  });

  it('11) no permite cambiar datos después de guardar reserva', () => {
    const placa = buildUniqueNumeroVehiculo();

    cy.get('button').contains(/Nueva Reserva/i).click();
    cy.get('input[formcontrolname="placa"]').fill(placa);
    cy.get('mat-select[formcontrolname="idCelda"]').click();
    cy.get('mat-option:not([disabled])').first().click();
    cy.get('input[formcontrolname="horaInicio"]').fill('2026-05-05T09:00');
    cy.get('input[formcontrolname="horaFin"]').fill('2026-05-05T11:00');
    cy.get('mat-dialog-container button').contains(/Crear Reserva/i).click();

    cy.get('mat-dialog-container').should('not.exist');
    cy.get('button').contains(/Nueva Reserva/i).click();
    cy.get('input[formcontrolname="placa"]').should('have.value', '');
  });

  it('12) muestra mensaje de éxito con información de reserva', () => {
    const placa = buildUniqueNumeroVehiculo();

    cy.get('button').contains(/Nueva Reserva/i).click();
    cy.get('input[formcontrolname="placa"]').fill(placa);
    cy.get('mat-select[formcontrolname="idCelda"]').click();
    cy.get('mat-option:not([disabled])').first().click();
    cy.get('input[formcontrolname="horaInicio"]').fill('2026-05-05T09:00');
    cy.get('input[formcontrolname="horaFin"]').fill('2026-05-05T11:00');
    cy.get('mat-dialog-container button').contains(/Crear Reserva/i).click();

    cy.get('.mensaje-exito').should('contain', /reserva|creada|exitosa/i);
  });
});
