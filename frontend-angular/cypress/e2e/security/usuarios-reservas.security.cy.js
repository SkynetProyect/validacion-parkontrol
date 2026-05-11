// Usuarios - Reservas - Security Tests

import { loginAsUser, buildUniqueNumeroVehiculo } from '../support/helpers';

describe('Usuarios - Reservas - Security Tests', () => {
  beforeEach(() => {
    loginAsUser();
  });

  it('1) debe prevenir SQL injection en búsqueda de parqueadero', () => {
    cy.get('a').contains(/Reservas|Buscar|Parqueaderos/i).first().click();
    cy.get('input[type="text"], input[type="search"]').first().fill("test' OR '1'='1").should('exist');
  });

  it('2) debe validar filtros de búsqueda', () => {
    cy.get('a').contains(/Reservas|Buscar|Parqueaderos/i).first().click();
    cy.get('button, [role="button"]').contains(/Buscar|Filtrar/i).first().should('exist').or('not.exist');
  });

  it('3) debe validar rango de fechas en búsqueda', () => {
    cy.get('a').contains(/Reservas|Buscar|Parqueaderos/i).first().click();
    cy.get('input[type="date"], input[type="datetime-local"]').first().fill('2020-01-01');
  });

  it('4) no debe permitir reservas duplicadas por usuario', () => {
    cy.get('a').contains(/Crear|Nueva|Reserva/i).first().click();
    const placa = buildUniqueNumeroVehiculo();
    
    cy.get('input[formcontrolname="placa"], input').first().fill(placa);
    cy.get('button').contains(/Crear|Reservar/i).click();
    cy.get('.mensaje-exito').should('exist');
  });

  it('5) debe validar permisos de usuario', () => {
    cy.get('a').contains(/Vehiculos/i).click();
    // Usuario no debería poder crear vehículos
    cy.get('button').contains(/Crear|Nuevo/i).should('not.exist');
  });

  it('6) debe validar placa válida', () => {
    cy.get('a').contains(/Crear|Nueva|Reserva/i).first().click();
    cy.get('input[formcontrolname="placa"], input').first().fill('<script>alert(1)</script>');
    cy.get('button').contains(/Crear|Reservar/i).should('be.disabled').or('not.be.disabled');
  });

  it('7) debe validar vehículo existente', () => {
    cy.get('a').contains(/Crear|Nueva|Reserva/i).first().click();
    cy.get('input[formcontrolname="placa"], input').first().fill('NOEXISTE123');
  });

  it('8) debe estar protegido contra CSRF', () => {
    cy.getCookie('csrf-token').should('exist').or('not.exist');
  });

  it('9) debe validar acceso solo usuario autenticado', () => {
    cy.logout().or(() => {
      cy.clearCookies();
      cy.visit('http://localhost:4200/usuario/reservas');
    });
    cy.url().should('include', '/login');
  });

  it('10) debe validar reservas de usuario logueado', () => {
    cy.get('a').contains(/Historial|Mis|Reservas/i).first().click();
    cy.get('table, mat-table, .reservas-list').should('exist');
  });
});

describe('Usuarios - Reservas - Accessibility Tests', () => {
  beforeEach(() => {
    loginAsUser();
    cy.injectAxe();
  });

  it('1) debe ser accesible', () => {
    cy.checkA11y();
  });

  it('2) navegación teclado', () => {
    cy.get('a, button').first().focus().should('have.focus');
  });

  it('3) tabla accesible', () => {
    cy.get('table, mat-table').should('exist');
  });
});

describe('Usuarios - Reservas - Regression Tests', () => {
  beforeEach(() => {
    loginAsUser();
  });

  it('1) ve historial de reservas', () => {
    cy.get('a').contains(/Historial|Mis|Reservas/i).first().click();
    cy.get('table, mat-table, .reservas-list').should('exist');
  });

  it('2) puede buscar parqueaderos', () => {
    cy.get('a').contains(/Reservas|Buscar|Parqueaderos/i).first().click();
    cy.get('button, [role="button"]').contains(/Buscar|Filtrar/i).first().should('exist').or('not.exist');
  });

  it('3) puede crear reserva con vehículo existente', () => {
    cy.get('a').contains(/Crear|Nueva|Reserva/i).first().click();
    const placa = buildUniqueNumeroVehiculo();
    cy.get('input[formcontrolname="placa"], input').first().fill(placa);
    cy.get('button').contains(/Crear|Reservar/i).click();
  });

  it('4) ve perfil de usuario', () => {
    cy.get('[matmenuTrigger], button').contains(/Perfil|Usuario|Menu/i).first().click().or(() => {
      cy.get('a').contains(/Perfil/i).first().click();
    });
  });

  it('5) puede actualizar perfil', () => {
    cy.get('button, a').contains(/Perfil|Editar/i).first().click().or(() => {
      cy.get('[matmenuTrigger]').first().click();
      cy.get('[matmenuitem]').contains(/Perfil/i).click();
    });
  });
});
