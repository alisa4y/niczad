import { defineConfig } from "cypress"
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
  },
  viewportHeight: 800,
  experimentalInteractiveRunEvents: true,
})
