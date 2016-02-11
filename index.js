"use strict"

process.env.DEBUG = "*"

const _ = require("lodash")

let files = _.slice(process.argv, 2)
files = _.isEmpty(files) ? ["./mother_of_all_warehouses.in.txt", "./redundancy.in.txt", "./busy_day.in.txt"] : files

_.each(files, function (file) {
  const problem = require("./read")(file)
  const solution = require("./solver")(problem)
  require("./write")(`${file}.out.txt`, solution)
})
