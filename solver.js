"use strict"

const debug = require("debug")("solver")
const _ = require("lodash")

module.exports = function solve(problem) {
  const commands = []
  const drones = _.times(problem.header.ndrones, () => ({x: 0, y: 0, remainingTurns: problem.header.nturns, load: 0}))
  debug(problem.header)
  _.each(problem.orders, function (order, iorder) {
    const drone = iorder % problem.header.ndrones

    let warehouse

    _.each(order.quantities, function (quantity, product) {
      if (!quantity) return

      if (!warehouse) {
        warehouse = findClosestWarehouseForProduct(problem.warehouses, drones[drone], product);
        let distanceToRun = distance(problem.warehouses[warehouse], order) + 1000;
        if (drones[drone].remainingTurns < distanceToRun) return false;
        drones[drone].remainingTurns -= distanceToRun + 1
      }

      var shippableQuantity = getShippableQuantity(problem, problem.warehouses[warehouse], product, quantity)
      if (!shippableQuantity) return

      commands.push({ command: "load", drone, warehouse, type: product, quantity: shippableQuantity })
      problem.warehouses[warehouse].products[product] -= shippableQuantity

      commands.push({ command: "deliver", drone, order: iorder, type: product, quantity: shippableQuantity })

      order.quantities[product] -= shippableQuantity
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

function findShippableProductForGivenWarehouse(problem, warehouse, drone, order) {
  return _.findIndex(order.types, (type) => isProductAvailable(type) && (drone.load + problem.weights[type] <= problem.header.maxLoad))
}

function distance(origin, destination) {
  return Math.sqrt(Math.pow(destination.x - origin.x, 2) + Math.pow(destination.y - origin.y, 2))
}

function isProductAvailable(warehouse, product) {
  return warehouse.products[product] > 0
}

function getShippableQuantity(problem, warehouse, product, quantity) {
  var weight = problem.weights[product]
  var maxLoad = problem.header.maxLoad
  // console.log(Math.floor(maxLoad / weight), warehouse.products[product], quantity)
  return _.min([Math.floor(maxLoad / weight), warehouse.products[product], quantity])
}
