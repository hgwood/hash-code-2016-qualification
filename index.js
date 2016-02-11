"use strict"

process.env.DEBUG = "*"

const problem = require("./read")("./busy_day.in.txt")
const solution = require("./solver")(problem)
require("./write")("./out.txt", solution)
