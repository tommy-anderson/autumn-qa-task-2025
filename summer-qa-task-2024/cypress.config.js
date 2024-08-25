import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
		specPattern: "cypress/e2e/test.spec.js",
		baseUrl: 'http://127.0.0.1:5174',
  },
});
