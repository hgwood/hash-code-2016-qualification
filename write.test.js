"use strict"

const assert = require("assert")
const unparse = require("./write").unparse

describe("unparse", function () {
  it("return solution", function () {
    const response = unparse([
      {
        "drone": 0,
        "command": "load",
        "warehouse": "0",
        "type": "3",
        "quantity": "3"
      },
      {
        "drone": 0,
        "command": "unload",
        "warehouse": "1",
        "type": "3",
        "quantity": "1"
      },
      {
        "drone": 0,
        "command": "deliver",
        "order": "0",
        "type": "3",
        "quantity": "2"
      },
      {
        "drone": 1,
        "command": "wait",
        "nturns": "3"
      },
    ]);
    assert.deepEqual(response, [
      4,
      "0 L 0 3 3",
      "0 U 1 3 1",
      "0 D 0 3 2",
      "1 W 3"
    ])
  })
})
