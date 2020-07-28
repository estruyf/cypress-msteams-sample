import { Cookie } from "playwright-chromium";
import { Config, KeyValuePair } from "../models";

/**
 * Return config
 */
function getConfig(pageUrl: string): Config {
  return {
    username: process.env.CI ? Cypress.env('USERNAME') : Cypress.env('username'),
    password: process.env.CI ? Cypress.env('PASSWORD') : Cypress.env('password'),
    pageUrl
  };
}

/**
 * Visit teams
 */
Cypress.Commands.add("authTeams", (pageUrl) => {
  const config = getConfig(pageUrl);

  // Call the Microsoft Teams Authentication method in order to retrieve all the cookies and local storage
  cy.task('TeamsAuth', config).then((data: { cookies: Cookie[], localStorage: KeyValuePair[] }) => {

    // Let us start clean, and clear all the cookies
    cy.clearCookies();

    // Apply all the retrieved cookies from the auth call
    data.cookies.forEach(cookie => {
      cy.setCookie(cookie.name, cookie.value, {
        domain: cookie.domain,
        expiry: cookie.expires,
        httpOnly: cookie.httpOnly,
        path: cookie.path,
        secure: cookie.secure
      });
      Cypress.Cookies.preserveOnce(cookie.name);
    });

    // Set all the local storage items to the window
    cy.window().then((win) => {
      data.localStorage.forEach((keyValue: KeyValuePair) => {
        win.localStorage.setItem(keyValue.key, keyValue.value);
      });
    });
  });
});