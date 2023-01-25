const { pugPlugin } = require("pug-ez-server")

module.exports = {
  port: 3000,
  host: "localhost",
  protocol: "http",
  publicDir: "public",
  defaultFile: "home",
  watch: true,
  apiExtension: ".ts", // .ts .js
  skipExtensions: [], // skip watching files with these extensions
  reloadExtRgx: /^(?:(?!\.css).)+$/, // server won't send reload signal for css files
  plugins: {
    ".pug": pugPlugin,
  },
}
