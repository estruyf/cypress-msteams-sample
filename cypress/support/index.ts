// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Make sure the following cookies are not removed between tests
Cypress.Cookies.defaults({
  whitelist: ['FedAuth', 'rtFa', 'TSAUTHCOOKIE', 'authtoken', 'fpc', 'SignInStateCookie', 'CCState', 'buid']
});

// Prevent the clearing the local storage, this creates conflicts for tests
const clear = Cypress.LocalStorage.clear;
(Cypress as any).LocalStorage.clear = function (keys, ls, rs) {};