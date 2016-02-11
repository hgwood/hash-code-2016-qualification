"use strict"

const _ = require("lodash")
const fs = require("fs")
const debug = require("debug")("write")

module.exports = function write(path, solution) {
  writeLines(path, unparse(solution))
}

function writeLines(path, lines) {
  fs.writeFileSync(path, lines.join("\n"))
  debug(`wrote ${lines.length} lines to ${path}`)
}

function unparse(solution) {
  // insert write logic here
  // must return an array of lines to write to the output file
  const commands = _.map(solution, function (command) {
    if (command.command === "load" || command.command === "unload") return `${command.drone} ${command.command[0].toUpperCase()} ${command.warehouse} ${command.type} ${command.quantity}`
    if (command.command === "deliver") return `${command.drone} ${command.command[0].toUpperCase()} ${command.order} ${command.type} ${command.quantity}`
    if (command.command === "wait") return `${command.drone} ${command.command[0].toUpperCase()} ${command.nturns}`
  })
  return [commands.length, ...commands]
}

module.exports.unparse = unparse
