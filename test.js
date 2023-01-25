const { writeFileSync } = require("fs")
const { impundler } = require("x-bundler")

impundler("./api/users.ts", code => {
  writeFileSync("./to.js", code, "utf-8")
})
