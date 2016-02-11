"use strict"

const assert = require("assert")
const read = require("./read")

describe("parse", function () {

   it("", function () {
    const problem = read("in.test.txt");
    assert.deepEqual(problem, {
      header: {
        nrows: 100,
        ncols: 100,
        ndrones: 3,
        nturns: 50,
        maxLoad: 500,
      },
      weights: [100, 5, 450],
      warehouses: [{
        x: 0,
        y: 0,
        products: [5, 1, 0]
      },
      {
        x: 5,
        y: 5,
        products: [0, 10, 2]
      }],
      orders: [{
        x: 1,
        y: 1,
        nitems: 2,
        types: [2, 0],
        quantities: [1, 0, 1]
      },
      {
        x: 3,
        y: 3,
        nitems: 3,
        types: [0, 0, 0],
        quantities: [3, 0, 0]
      },
      {
        x: 5,
        y: 6,
        nitems: 1,
        types: [2],
        quantities: [0, 0, 1]
      }]
    });
  })
})
