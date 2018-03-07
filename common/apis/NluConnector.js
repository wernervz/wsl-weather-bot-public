'use strict'

var request = require('request')

let callNlu = function (usePrivate, context, privateContext) {
  return nluPromise(context.inboundMsg).then((locations) => {
    if (usePrivate) {
      privateContext['weatherWhere'] = locations.length > 0 ? locations : null
    } else {
      context['weatherWhere'] = locations.length > 0 ? locations : null
    }
    return ({context, privateContext})
  }, (err) => {
    console.log('Error occurred: ' + err)
    return ({context, privateContext})
  })
}

function nluPromise (msg) {
  console.log('Calling NLU with -> ' + msg)
  return new Promise((resolve, reject) => {
    let data = {
      text: msg,
      features: {
        entities: {
          emotion: false,
          sentiment: false,
          limit: 1
        }
      }
    }
    let options = {
      url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2017-02-27',
      json: true,
      body: data,
      method: 'post'
    }
    request(options, function (err, http, nluResponse) {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        if (http.statusCode === 200) {
          resolve(extractLocations(nluResponse))
        } else {
          reject(nluResponse)
        }
      }
    }).auth(process.env.NATURAL_LANGUAGE_USERNAME, process.env.NATURAL_LANGUAGE_PASSWORD, false)
  })
}

function extractLocations (nluResponse) {
  // Check if a Location was returned
  let locations = []
  for (let entity of nluResponse.entities) {
    if (entity.type === 'Location') {
      locations.push(entity.text)
    }
  }
  return locations
}

module.exports = {
  callNlu
}
