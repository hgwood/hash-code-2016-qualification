"use strict"

const _ = require("lodash")
const fs = require("fs")

module.exports = function read(path) {
  return parse(readLines(path))
}

function readLines(path) {
  return fs.readFileSync(path, "utf8").split("\n")
}

function parse(lines) {
  // insert read logic here
}
