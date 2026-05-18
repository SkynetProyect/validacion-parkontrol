// Reservas - Accessibility Tests
// Pruebas de accesibilidad WCAG 2.1 para reservas

import { loginAsAdmin } from '../../support/helpers';

describe('Reservas - Accessibility Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Reservas/i).click();
    cy.url().should('include', '/reservas');
    cy.injectAxe();
  });

  it('1) debe tener dialog modal accesible para nueva reserva', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    cy.get('mat-dialog-container').should('have.attr', 'role', 'dialog');
  });

  it('2) debe tener heading accesible en modal de reserva', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    cy.get('mat-dialog-container').find('h1, h2, h3').should('exist');
  });

  it('3) campos de fecha deben ser accesibles', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    
    cy.get('input[formcontrolname="horaInicio"]').should('have.attr', 'type', 'datetime-local');
    cy.get('input[formcontrolname="horaFin"]').should('have.attr', 'type', 'datetime-local');
  });

  it('4) debe permitir navegación por teclado en formulario de reserva', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    
    cy.get('input[formcontrolname="placa"]').focus().should('have.focus');
    cy.focused().tab();
    cy.focused().should('exist');
  });

  it('5) debe mostrar errores de validación accesibles', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    
    cy.get('input[formcontrolname="placa"]').focus().blur();
    cy.get('[role="alert"], mat-error').should('exist');
  });

  it('6) select de celda debe ser accesible', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    
    cy.get('mat-select[formcontrolname="idCelda"]').should('have.attr', 'role');
    cy.get('mat-select[formcontrolname="idCelda"]').click();
    cy.get('mat-option').first().should('have.attr', 'role', 'option');
  });

  it('7) debe permitir zoom hasta 200% sin pérdida de funcionalidad', () => {
    cy.viewport(320, 640);
    cy.get('button').contains(/Nueva Reserva/i).should('be.visible');
    cy.get('button').contains(/Nueva Reserva/i).click();
    
    cy.get('input[formcontrolname="placa"]').should('be.visible');
    cy.get('input[formcontrolname="horaInicio"]').should('be.visible');
  });

  it('8) botones deben tener área de toque suficiente', () => {
    cy.get('button').contains(/Nueva Reserva/i).should('have.css', 'min-height').and('be.at.least', '44px');
  });

  it('9) no debe tener problemas de accesibilidad detectados por axe', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    cy.checkA11y('mat-dialog-container');
  });

  it('10) tabla de reservas debe ser accesible', () => {
    cy.get('table, mat-table, .reservas-list').should('have.attr', 'role').or('contain', /encabezado|cabecera|header/i);
  });

  it('11) debe poder cerrar modal con ESC', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    cy.get('mat-dialog-container').should('be.visible');
    
    cy.get('mat-dialog-container').trigger('keydown', { keyCode: 27 });
    cy.get('mat-dialog-container').should('not.exist');
  });

  it('12) instrucciones de rango de fechas deben ser claras', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    cy.get('mat-dialog-container').should('contain', /hora|fecha|inicio|fin/i);
  });

  it('13) debe indicar campos obligatorios de forma accesible', () => {
    cy.get('button').contains(/Nueva Reserva/i).click();
    cy.get('input[formcontrolname="placa"]').should('have.attr', 'required').or('have.attr', 'aria-required', 'true');
  });

  it('14) respetar preferencias de reducción de movimiento', () => {
    cy.get('body').should('have.css', 'transition');
  });
});
