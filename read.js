"use strict"

const _ = require("lodash")
const fs = require("fs")
const debug = require("debug")("read")

module.exports = function read(path) {
  return parse(readLines(path))
}

function readLines(path) {
  const lines = fs.readFileSync(path, "utf8").split("\n")
  debug(`read ${lines.length} lines from ${path}`)
  return lines
}

function parse(lines) {
  // insert read logic here
}

module.exports.parse = parse
