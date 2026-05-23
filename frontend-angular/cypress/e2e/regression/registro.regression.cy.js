function llenarFormulario(tipoDoc, numeroDoc, correo, contrasena) {
  cy.get('mat-select[formcontrolname="tipoDocumento"]').click();
  cy.get('mat-option').contains(tipoDoc).click();
  cy.get('input[formcontrolname="numeroDocumento"]').type(numeroDoc, { force: true });
  cy.get('input[formcontrolname="correo"]').type(correo, { force: true });
  cy.get('input[formcontrolname="contrasena"]').type(contrasena, { force: true });
}

describe('Registro - Regression Tests', () => {

  it('1) Registro exitoso redirige al login', () => {
    cy.visit('http://localhost:4200/registro');
    const correoUnico = `usuario_${Date.now()}@correo.com`;
    llenarFormulario('Cédula de ciudadanía (CC)', '9532746101', 'user11@parkontrol.com', 'user1234');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/login');
  });

  it('2) Muestra error si el correo ya existe', () => {
    cy.visit('http://localhost:4200/registro');
    llenarFormulario('Cédula de ciudadanía (CC)', '4670132960', 'user10@parkontrol.com', 'park1234');
    cy.get('button[type="submit"]').click();
    cy.get('.mensaje-error')
      .should('contain', 'Ya existe un usuario con este correo electrónico');
  });

  it('3) Muestra error si el servidor no responde', () => {
    cy.intercept('POST', 'http://localhost:7820/**', { forceNetworkError: true });
    cy.visit('http://localhost:4200/registro');
    llenarFormulario('Cédula de ciudadanía (CC)', '1234567890', 'test@correo.com', 'Password1');
    cy.get('button[type="submit"]').click();
    cy.get('.mensaje-error')
      .should('contain', 'No se pudo conectar con el servidor');
  });

  it('4) Muestra error si el servidor falla', () => {
  cy.intercept('POST', 'http://localhost:7820/**', {
    statusCode: 500,
    body: { message: 'Internal server error' }
  }).as('registro');
  
  cy.visit('http://localhost:4200/registro');
  llenarFormulario('Cédula de ciudadanía (CC)', '1234567890', 'test@correo.com', 'Password1');
  cy.get('button[type="submit"]').click();
  
  cy.wait('@registro');
  
  // Esto imprime el mensaje real en la terminal
  cy.get('.mensaje-error').then(($el) => {
    cy.log('MENSAJE REAL: ' + $el.text());
  });
});

it('5) Muestra error si el recurso no existe', () => {
  cy.intercept('POST', 'http://localhost:7820/**', {
    statusCode: 404,
    body: { message: 'Not found' }
  }).as('registro');
  
  cy.visit('http://localhost:4200/registro');
  llenarFormulario('Cédula de ciudadanía (CC)', '1234567890', 'test@correo.com', 'Password1');
  cy.get('button[type="submit"]').click();
  cy.wait('@registro');
  
  cy.get('.mensaje-error').then(($el) => {
    cy.log('MENSAJE REAL 5: ' + $el.text());
  });
});

it('6) Muestra error general si falla el registro', () => {
  cy.intercept('POST', 'http://localhost:7820/**', {
    statusCode: 400,
    body: { message: 'Bad request' }
  }).as('registro');
  
  cy.visit('http://localhost:4200/registro');
  llenarFormulario('Cédula de ciudadanía (CC)', '1234567890', 'test@correo.com', 'Password1');
  cy.get('button[type="submit"]').click();
  cy.wait('@registro');
  
  cy.get('.mensaje-error').then(($el) => {
    cy.log('MENSAJE REAL 6: ' + $el.text());
  });
});
});
