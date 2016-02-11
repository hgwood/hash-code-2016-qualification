"use strict"

process.env.DEBUG = "*"

const _ = require("lodash")

_.each(["mother_of_all_warehouses", "redundancy", "busy_day"], function (file) {
  const problem = require("./read")(`./${file}.in.txt`)
  const solution = require("./solver")(problem)
  require("./write")(`./${file}.out.txt`, solution)
})
