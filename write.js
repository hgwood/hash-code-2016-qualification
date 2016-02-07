"use strict"

const _ = require("lodash")
const fs = require("fs")

module.exports = function write(path, solution) {
  writeLines(unparse(solution))
}

function writeLines(path, lines) {
  fs.writeFileSync(path, lines.join("\n"))
}

function unparse(solution) {
  // insert write logic here
  // must return an array of lines to write to the output file
}
