describe('login', () => {
    it('deberíaentrar como administrador', () => {
      cy.visit('http://localhost:4200/login')
      cy.get('form input[type="checkbox"]').first().check().should('be.checked')
      cy.get('form input[type="checkbox"]').first().uncheck().should('not.be.checked')
    })
  })
