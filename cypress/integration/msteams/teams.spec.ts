/// <reference types="cypress" />
/// <reference types="../../support" />

describe('Microsoft Teams', function() {
  const PAGE_URL = "https://teams.microsoft.com/_";

  /**
   * Before visiting SharePoint, we first need to authenticate
   */
  before(() =>  {
    // Add an on window load event to make sure that we are able to override the iframe check
    cy.on('window:load', (win: any) => {
      const checkOverride = () => {
        if (win.teamspace && win.teamspace.AppController && win.teamspace.AppController.prototype && win.teamspace.AppController.prototype.isInIFrame) {
          win.teamspace.AppController.prototype.isInIFrame = () => {
            console.log('Calling the custom iframe check');
            return false;
          };
        } else {
          console.log('teamspace not available')
          setTimeout(() => {
            checkOverride();
          }, 1);
        }
      };

      checkOverride();
    });

    cy.authTeams(PAGE_URL);
  });
  
  it('1. Check if we can login into Microsoft Teams', () => {
    cy.visit(PAGE_URL);
  });

  it('2. Check if Microsoft Teams is loaded correctly', () => {
    cy.get(`[data-tid=newMessageFooter]`).should('exist').click();
  });

  it('3. Check if we can start chatting', () => {
    cy.get('.cke_wysiwyg_div > div').should('exist').click().type('Hello, this is just cool{enter}');
  });

  it('3. Check if we can reply to a chat', () => {
    cy.get('button[data-tid="replyMessageButtonShort"]').should('exist').last().click();
    cy.get('div[data-tid="newMessage"] .cke_wysiwyg_div[data-tid="ckeditor-replyConversation"]').should('exist').type('Just a quick reply{enter}');
  });

});