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
  const header = parseLineOfInts(lines[0], ["nrows", "ncols", "ndrones", "nturns", "maxLoad"])
  const weights = _.map(lines[2].split(" "), _.ary(parseInt, 1))
  const nwarehouses = parseInt(lines[3])
  const warehouses = _.times(nwarehouses, function (i) {
    const warehouse = parseLineOfInts(lines[3 + i * 2 + 1], ["x", "y"])
    warehouse.products = _.map(lines[3 + i * 2 + 2].split(" "), _.ary(parseInt, 1))
    return warehouse
  })
  const indexOfFirstOrder = 3 + nwarehouses * 2 + 1
  const orders = _.times(parseInt(lines[indexOfFirstOrder]), function (i) {
    const order = parseLineOfInts(lines[indexOfFirstOrder + i * 3 + 1], ["x", "y"])
    order.nitems = parseInt(lines[indexOfFirstOrder + i * 3 + 2])
    order.types = _.map(lines[indexOfFirstOrder + i * 3 + 3].split(" "),  _.ary(parseInt, 1))
    order.quantities = new Array(weights.length).fill(0)
    _.each(order.types, function (type) {
      order.quantities[type] += 1
    })
    return order
  })
  return {header, weights, warehouses, orders}
}

function parseLineOfInts(line, keys) {
  return _.zipObject(keys, _.map(line.split(" "), _.ary(parseInt, 1)));
}

module.exports.parse = parse
