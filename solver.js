"use strict"

const debug = require("debug")("solver")
const _ = require("lodash")

module.exports = function solve(problem) {
  const commands = []
  const firstWarehouse = _.first(problem.warehouses);
  const drones = _.times(problem.header.ndrones, (id) => ({id, x: firstWarehouse.x, y: firstWarehouse.y, remainingTurns: problem.header.nturns, load: 0, queue: 0}))
  //_(problem.orders).take(10).map(_.property("nitems")).each((it) => console.log(it));
  _(problem.orders).sortBy("nitems").each(function (order) {
    _.each(order.quantities, function (quantity, type) {
      if(!quantity) return
      while(quantity > 0) {
        // debug(order)
        const warehousesThatHaveThisProductType = warehousesForProductType(problem.warehouses, type)
        const shortestCombination = shortestDeliveryPaths(order, drones, warehousesThatHaveThisProductType)
        const drone = shortestCombination.drone
        const warehouse = shortestCombination.warehouse
        const quantitTaken = _.min([quantity, Math.floor(problem.header.maxLoad / problem.weights[type]), warehouse.products[type]])
        if(!quantitTaken) return
        const numberOfTurnsForDelivery = shortestCombination.numberOfTurnsForDelivery
        const turnsToDelivery = shortestCombination.turnsToDelivery
        drone.remainingTurns -= numberOfTurnsForDelivery
        commands.push({command: "load", drone: drone.id, warehouse: warehouse.id, type, quantity: quantitTaken})
        warehouse.products[type] -= quantitTaken
        commands.push({command: "deliver", drone: drone.id, order: order.id, type, quantity: quantitTaken})
        drone.x = order.x
        drone.y = order.y
        drone.queue = turnsToDelivery
        quantity -= quantitTaken
      }
    })
  })
  return commands
}

function shortestDeliveryPaths(order, drones, warehouses) {
  const all = allDeliveryPaths(order, drones, warehouses)
  // debug(warehouses)
  return _.minBy(all, "turnsToDelivery")
}

function allDeliveryPaths(order, drones, warehouses) {
  return _.flatMap(drones, function (drone) {
    return _.compact(_.map(warehouses, function (warehouse) {
      const numberOfTurnsForDelivery = numberOfTurnsRequiredToDeliver(order, drone, warehouse)
      const turnsToDelivery = numberOfTurnsForDelivery + drone.queue
      if (drone.remainingTurns < numberOfTurnsForDelivery) return null
      else return {drone, warehouse, numberOfTurnsForDelivery, turnsToDelivery}
    }))
  })
}

function numberOfTurnsRequiredToDeliver(order, drone, warehouse) {
  return Math.ceil(distance(warehouse, order)) + Math.ceil(distance(drone, warehouse)) + 2
}

function warehousesForProductType(warehouses, type) {
  // debug("type", type)
  // debug("warehouse length", warehouses.length)
  // debug("warehouse find", _.find(warehouse => warehouse.products[type]))
  return _(warehouses)
    .map((warehouse, index) => _.assign(warehouse, {id: index}))
    .filter(warehouse => warehouse.products[type] > 0)
    .value()
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
