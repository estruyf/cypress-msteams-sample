// cypress/plugins/index.js
/// <reference types="cypress" />

import { TeamsAuth } from './teams-auth';

/**
 * @type {Cypress.PluginConfig}
 */
export default (on, config) => {
  on('task', { TeamsAuth })
};
