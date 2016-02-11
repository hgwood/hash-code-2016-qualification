"use strict"

const rp = require('request-promise');
const fs = require('fs');
const Promise = require('bluebird');

//TODO change to current problem
const authorizationToken = 'Bearer ya29.hQJiI4eGSQKmmrDI9rP0V-Tw2U48tZ-i90axU_DlxIHqXfhzT0Oy1fv8Gcy694VguY8bHg';
const dataset = 5157371496103936;

module.exports = submit;

function submit(sourceFile, submissionFile) {
  Promise.join(
    uploadFile(sourceFile),
    uploadFile(submissionFile),
    function(sourceBlob, submissionBlob) {
      let options = {
        method: 'POST',
        uri: 'https://hashcode-judge.appspot.com/_ah/api/judge/v1/submissions',
        headers: {
          'Authorization': authorizationToken
        },
        //json: true, // Automatically parses the JSON string in the response
        qs: { //query string
          dataSet: dataset,
          sourcesBlobKey: sourceBlob,
          submissionBlobKey: submissionBlob
        },
        resolveWithFullResponse: true
      };

      return rp.post(options)
      .then(function(response) {
        //console.log(response.statusCode);
        let data = JSON.parse(response.body);
        console.log('upload done for dataset %s and team %s', data.dataSet.name, data.teamId);
      })
      .catch(function (err) {
        console.log(err);
      });
    });
}

function uploadFile(file) {
  let options = {
    uri: 'https://hashcode-judge.appspot.com/_ah/api/judge/v1/upload/createUrl',
    headers: {
      'Authorization': authorizationToken
    },
    json: true // Automatically parses the JSON string in the response
  };
  return rp(options)
  .then(function(data) {
    console.log('Need to upload to url %s', data.value);
    return data.value;
  })
  .then(function(uploadSourceUrl) {
    let formData = {
      file: fs.createReadStream(__dirname + file),
    };
    let options = {
      method: 'POST',
      uri: uploadSourceUrl,
      formData: formData,
      headers: {
        'Authorization': authorizationToken
      },
      json: true
    };
    return rp.post(options);
  })
  .then(function (data) {
    //console.log('Upload done to blob %s', data.file);
    return data.file[0];
  })
  .catch(function (err) {
    console.log(err)
  });
}


submit(
  '/.builds/submission-sources-2016-02-10T14-12-10.841Z-2492aad05149e692b514774c9d0a00aa8122278f.zip',
  '/.builds/submission-sources-2016-02-10T14-12-10.841Z-2492aad05149e692b514774c9d0a00aa8122278f.zip'
  )
