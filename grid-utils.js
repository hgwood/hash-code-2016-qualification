"use strict"

const _ = require("lodash")

module.exports = {
  cells: lift(_.flatMap, _.map, (value, x, y) => ({value, x, y})),
  each: lift(_.each, _.each, (value, x, y, grid, row, f) => f(value, x, y, grid, row)),
  map: lift(_.map, _.map, (value, x, y, grid, row, f) => f(value, x, y, grid, row))
}

function lift(fgrid, frow, fvalue) {
  return function (grid) {
    const args = _.tail(arguments)
    return fgrid(grid, function (row, y) {
      return frow(row, function (value, x) {
        return fvalue(value, x, y, grid, row, ...args)
      })
    })
  }
}

// old version, here for reference
// these are equivalent to the new version
// but the lift is duplicated in each function

// module.exports = {cells, each, map}

// function cells(grid) {
//   return _.flatMap(grid, function (row, y) {
//     return _.map(row, function (value, x) {
//       return {x, y, value}
//     })
//   })
// }

// function each(grid, f) {
//   _.each(grid, function (row, y) {
//     _.each(row, function (value, x) {
//       f(value, x, y, grid, row)
//     })
//   })
// }

// function map(grid, f) {
//   return _.map(grid, function (row) {
//     return _.map(row, function (value) {
//       return f(value, x, y, grid, row)
//     })
//   })
// }
