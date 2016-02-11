"use strict"

const debug = require("debug")("solver")
const _ = require("lodash")

module.exports = function solve(problem) {
  const commands = []
  debug(problem.warehouses)
  _.each(problem.orders, function (order, iorder) {
    const drone = 0
    _.each(order.types, function (type) {
      const warehouse = findWarehouseForProduct(problem, type)
      commands.push({command: "load", drone, warehouse, type, quantity: 1})
      problem.warehouses[warehouse].products[type] -= 1
      commands.push({command: "deliver", drone, order: iorder, type, quantity: 1})
    })
  })
  return commands
}

function findWarehouseForProduct(problem, type) {
  return _.findIndex(problem.warehouses, function (warehouse) {
    return warehouse.products[type] > 0
  })
}
