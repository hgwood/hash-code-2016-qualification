"use strict"

const _ = require("lodash")
const fs = require("fs")
const archiver = require("archiver")
const glob = require("glob")
const path = require("path")

const buildDate = new Date().toISOString().replace(/:/g, "-")
const buildDest = `./.builds/submission-sources-${buildDate}.zip`

try {
  fs.mkdirSync(path.dirname(buildDest))
} catch (err) {
  if (err.code !== "EEXIST") throw err
}

_.tap(archiver('zip', {}), function (archive) {
  _.each(glob.sync("!(node_modules)", {}), function (file) {
    archive.file(file, {name: path.basename(file)})
  })
}).finalize().pipe(fs.createWriteStream(buildDest))
