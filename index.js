"use strict"

const problem = require("./read")("./in.txt")
const solution = require("./solver")(problem)
require("./write")("./out.txt", solution)
