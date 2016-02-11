"use strict"

const debug = require("debug")("solver")
const _ = require("lodash")

module.exports = function solve(problem) {
  const commands = []

  const drones = new Array(problem.header.ndrones).fill(problem.header.nturns);
  debug(problem.header)
  _.each(problem.orders, function (order, iorder) {
    const drone = iorder % problem.header.ndrones

    _.each(order.types, function (type) {
      const warehouse = findWarehouseForProduct(problem, type)
      const distanceToRun = distance(problem.warehouses[warehouse], order) + 1000;
      if(drones[drone] < distanceToRun) return commands;

      commands.push({command: "load", drone, warehouse, type, quantity: 1})
      problem.warehouses[warehouse].products[type] -= 1
      commands.push({command: "deliver", drone, order: iorder, type, quantity: 1})
      drones[drone] -= distanceToRun + 1
      console.log(drone, "->", drones[drone]);
    })
  })
  return commands
}

function findWarehouseForProduct(problem, type) {
  return _.findIndex(problem.warehouses, function (warehouse) {
    return warehouse.products[type] > 0
  })
}

function findClosestWarehouseForProduct(problem, type) {

}

function distance(origin, destination) {
  return Math.sqrt(Math.pow(destination.x - origin.x, 2) + Math.pow(destination.y - origin.y, 2))
}
