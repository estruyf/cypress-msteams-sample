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

  // Create and retrieve the config object
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