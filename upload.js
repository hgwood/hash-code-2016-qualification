"use strict"

const _ = require("lodash")
const debug = require("debug")("upload")
const fs = require("fs")
const joi = require("joi")
const request = require("request-promise")

const createUrlUri = "https://hashcode-judge.appspot.com/_ah/api/judge/v1/upload/createUrl"
const submitUri = "https://hashcode-judge.appspot.com/_ah/api/judge/v1/submissions"
const authorizationHeader = {"Authorization": "Bearer ya29.hgI_shO08rI0OQZi4tVvJwUBdOnbwOJdfjExAce_Ron4KoLpFy2yPFLrinUn28ZZlMzO8Q"}
const dataSets = {
  busyDay: 4570104243159040,
  motherOfAllWarehouses: 6716350940577792,
  redundancy: 5272254355079168,
}

function* submitSolution(solution) {
  const solutionSchema = joi.object().min(2)
    .keys(_.mapValues(dataSets, _.constant(joi.string())))
    .keys({sources: joi.string().required()})
  joi.assert(solution, solutionSchema, "invalid solution parameters")
  
  const blobKeys = yield _.mapValues(solution, upload)
  const solutionBlobKeys = _.omit(blobKeys, "sources")
  return yield _.mapValues(solutionBlobKeys, function (blobKey, dataSetName) {
    debug(`submitting data set ${dataSetName} (key: ${shorten(blobKey)}`)
    return submit(dataSets[dataSetName], blobKey, blobKeys.sources)
  })
}

function* upload(filePath) {
  const uploadUri = yield createUploadUri()
  debug(`uploading ${filePath} to ${shorten(uploadUri)}`)
  const formData = {file: fs.createReadStream(filePath)}
  const responseBody = yield request({
    method: "POST", 
    uri: uploadUri, 
    formData, 
    json: true})
  const blobKey = responseBody.file[0]
  debug(`file ${filePath} uploaded (key: ${shorten(blobKey)})`)
  return blobKey
}

function* createUploadUri() {
  const response = yield request({
    method: "GET", 
    uri: createUrlUri, 
    json: true})
  return response.value
}

function* submit(dataSet, submissionBlobKey, sourcesBlobKey) {
  const queryParameters = {dataSet, submissionBlobKey, sourcesBlobKey}
  return yield request({
    method: "POST", 
    uri: submitUri, 
    headers: authorizationHeader, 
    qs: queryParameters
  })
}

function shorten(str) {
  return _(str).slice(0, 20).join("") + "..."
}

if (module === require.main) {
  const co = require("co")
  const explode = err => process.nextTick(() => { throw err })
  const solution = _(process.argv).drop(2).chunk(2).fromPairs().value()
  debug("solution", solution)
  co(submitSolution(solution)).catch(explode)
}
