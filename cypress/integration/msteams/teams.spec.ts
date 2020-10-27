/// <reference types="cypress" />
/// <reference types="../../support" />

describe('Microsoft Teams', function() {
  const PAGE_URL = "https://teams.microsoft.com/_";

  /**
   * Before visiting SharePoint, we first need to authenticate
   */
  before(() =>  {
    cy.authTeams(PAGE_URL);
  });
  
  it('1. Check if we can login into Microsoft Teams', () => {
    cy.visit(PAGE_URL);
  });

  it('2. Check if Microsoft Teams is loaded correctly', () => {
    cy.get(`#new-post-button`).should('exist').click();
  });

  it('3. Check if we can start chatting', () => {
    cy.get('.cke_wysiwyg_div > div').should('exist').click().type('Hello, this is just cool');
    cy.get(`#send-message-button`).should('exist').click();
  });

  it('3. Check if we can reply to a chat', () => {
    cy.get('button[data-tid="replyMessageButtonShort"]').should('exist').last().click();
    cy.get('div[data-tid="newMessage"] .cke_wysiwyg_div[data-tid="ckeditor-replyConversation"]').should('exist').type('Just a quick reply{enter}');
  });

});