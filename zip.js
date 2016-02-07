"use strict"

const _ = require("lodash")
const fs = require("fs")
const archiver = require("archiver")
const glob = require("glob")
const path = require("path")
const exec = require("child_process").execSync

const sha1 = exec("git rev-parse HEAD", {encoding: "utf8"}).trim()
const date = new Date().toISOString().replace(/:/g, "-")
const dest = `./.builds/submission-sources-${date}-${sha1}.zip`

try {
  fs.mkdirSync(path.dirname(dest))
} catch (err) {
  if (err.code !== "EEXIST") throw err
}

_.tap(archiver('zip', {}), function (archive) {
  _.each(glob.sync("!(node_modules)", {}), function (file) {
    archive.file(file, {name: path.basename(file)})
  })
}).finalize().pipe(fs.createWriteStream(dest))
