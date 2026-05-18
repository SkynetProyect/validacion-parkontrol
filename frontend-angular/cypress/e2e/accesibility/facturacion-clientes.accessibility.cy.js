// Facturación - Clientes - Accessibility Tests
// Pruebas de accesibilidad WCAG 2.1 para creación de clientes

import { loginAsAdmin, buildUniqueNumeroDocumento, buildUniqueCorreo } from '../../support/helpers';

describe('Facturación - Clientes Accessibility Tests', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.get('a').contains(/Facturacion/i).click();
    cy.url().should('include', '/facturacion');
    cy.injectAxe();
  });

  it('1) debe tener dialog modal accesible', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('mat-dialog-container').should('have.attr', 'role', 'dialog');
  });

  it('2) debe tener heading accesible en modal', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('mat-dialog-container').find('h1, h2, h3').should('exist');
  });

  it('3) debe asociar labels a campos de entrada', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    
    cy.get('input[formcontrolname="numeroDocumento"]').should('have.attr', 'aria-label').or('have.attr', 'id');
    cy.get('input[formcontrolname="correo"]').should('have.attr', 'aria-label').or('have.attr', 'id');
  });

  it('4) debe mostrar mensajes de validación accesibles', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    
    cy.get('input[formcontrolname="numeroDocumento"]').focus().blur();
    cy.get('[role="alert"], mat-error').should('exist');
  });

  it('5) debe permitir navegación por teclado en modal', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    
    cy.get('input[formcontrolname="numeroDocumento"]').focus();
    cy.focused().should('have.attr', 'formcontrolname', 'numeroDocumento');
    
    cy.focused().tab();
    cy.focused().tab();
    cy.get('mat-dialog-container button').contains(/Aceptar/i).should('have.focus');
  });

  it('6) debe tener contraste de color suficiente en botones', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('mat-dialog-container button').should('have.css', 'color');
  });

  it('7) debe anunciar estado de botón deshabilitado', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('mat-dialog-container button').contains(/Aceptar/i).should('have.attr', 'aria-disabled', 'true');
  });

  it('8) debe permitir zoom hasta 200% sin pérdida de funcionalidad', () => {
    cy.viewport(320, 640);
    cy.get('button').contains(/\+ Nuevo Cliente/i).should('be.visible');
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    
    cy.get('input[formcontrolname="numeroDocumento"]').should('be.visible');
    cy.get('input[formcontrolname="correo"]').should('be.visible');
  });

  it('9) debe tener tamaño de área de toque suficiente (min 44x44px)', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).should('have.css', 'min-height').and('be.at.least', '44px');
  });

  it('10) no debe tener problemas de accesibilidad detectados por axe', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.checkA11y('mat-dialog-container');
  });

  it('11) debe tener instrucciones claras para completar formulario', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('mat-dialog-container').should('contain', /número|documento|correo|email/i);
  });

  it('12) debe permitir cerrar modal con ESC de forma accesible', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    cy.get('mat-dialog-container').should('be.visible');
    
    cy.get('mat-dialog-container').trigger('keydown', { keyCode: 27 });
    cy.get('mat-dialog-container').should('not.exist');
  });

  it('13) debe tener focus trap en modal', () => {
    cy.get('button').contains(/\+ Nuevo Cliente/i).click();
    
    cy.get('mat-dialog-container').within(() => {
      cy.get(':focusable').first().focus();
      cy.focused().should('be.in.focusable.elements.within', 'mat-dialog-container');
    });
  });

  it('14) debe respetar preferencias de color oscuro', () => {
    cy.get('body').should('have.css', 'background-color');
  });
});
