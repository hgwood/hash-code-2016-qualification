"use strict"

const debug = require("debug")("solver")
const _ = require("lodash")

module.exports = function solve(problem) {
  const commands = []
  const drones = _.times(problem.header.ndrones, () => ({x: 0, y: 0, remainingTurns: problem.header.nturns, load: 0}))
  debug(problem.header)
  _.each(problem.orders, function (order, iorder) {
    const drone = iorder % problem.header.ndrones

    _.each(order.types, function (type) {
      const warehouse = findClosestWarehouseForProduct(problem.warehouses, drones[drone], type)
      const turnsToDelivery = Math.ceil(distance(problem.warehouses[warehouse], order)) + Math.ceil(distance(drone, problem.warehouses[warehouse])) + 2
      if(drones[drone].remainingTurns < turnsToDelivery) return false;
      drones[drone].remainingTurns -= turnsToDelivery
      commands.push({command: "load", drone, warehouse, type, quantity: 1})
      problem.warehouses[warehouse].products[type] -= 1
      commands.push({command: "deliver", drone, order: iorder, type, quantity: 1})
      drones[drone] = order
    })
  })
  return commands
}

// function findWarehouseForProduct(warehouses, type) {
//   return _.findIndex(warehouses, function (warehouse) {
//     return warehouse.products[type] > 0
//   })
// }

// function findClosestWarehouseForProduct(warehouses, drone, type) {
//   const sortedWarehouses = _.sortBy(warehouses, (warehouse) => distance(drone, warehouse))
//   return findWarehouseForProduct(sortedWarehouses, type)
// }

function findClosestWarehouseForProduct(warehouses, drone, type) {
  return _(warehouses)
    .map((warehouse, index) => _.assign(warehouse, {id: index}))
    .filter((warehouse) => warehouse.products[type] > 0)
    .map(warehouse => _.assign(warehouse, {distance: distance(drone, warehouse)}))
    .sortBy("distance")
    // .tap(value => debug(_.map(_.take(value, 2), "distance")))
    .first().id
}

function distance(origin, destination) {
  return Math.sqrt(Math.pow(destination.x - origin.x, 2) + Math.pow(destination.y - origin.y, 2))
}
