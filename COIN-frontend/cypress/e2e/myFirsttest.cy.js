///  <reference types="cypress" />
  describe('Тестирование формы авторизации', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8080/')
    })
    it('При неправильном вводе пароля/логина появляется надпись об ошибке и поля инпутов подсвечиваются красным', () => {
      cy.get('input').eq(0).type('fkfk');
      cy.get('input').eq(1).type('gjgjg');

      cy.get('.enter-container__btn').click();
      cy.get('input').eq(0).should('have.class', 'error-border');
      cy.get('input').eq(1).should('have.class', 'error-border');
      cy.get('.enter-container__error-container').should('not.be.empty');
    })
    it('При верном вводе пароля/логина надпись об ошибке пуста', () => {
      cy.get('input').eq(0).type('developer');
      cy.get('input').eq(1).type('skillbox');

      cy.get('.enter-container__btn').click();
      // cy.get('input').eq(0).should('have.class', 'success-border');
      // cy.get('input').eq(1).should('have.class', 'success-border');
      cy.get('.enter-container__error-container').should('be.empty');
    })
  })

