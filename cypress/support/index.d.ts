/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    // Add custom commands if needed
    authTeams(pageUrl: string): Chainable<void>;
  }
}