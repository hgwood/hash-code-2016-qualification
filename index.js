"use strict"

process.env.DEBUG = "*"

const problem = require("./read")("./mother_of_all_warehouses.in.txt")
const solution = require("./solver")(problem)
require("./write")("./mother_of_all_warehouses.out.txt", solution)
