'use strict'

var request = require('request')
var moment = require('moment')
var fxHash = require('../util/fxhash').init()

var whatFunctionMap = {
  'general': generalForecast,
  'percipitation': precipitationForecast,
  'thunder': thunderForecast,
  'wind': windForecast,
  'golf': golfForecast,
  'temperature': temperatureForecast,
  'outsideactivities': outsideActivitiesForecast
}

let callWeather = function (usePrivate, context, privateContext) {
  console.log('In Weather Connector triggered by inbound message: ' + context.inboundMsg)
  console.log('Where = ' + context.weatherWhere)
  console.log('When = ' + context.weatherWhen)
  console.log('What = ' + context.weatherWhat)
  console.log('Time of Day = ' + context.weatherTime)
  return weatherConditionsPromise(context.weatherWhere, context.weatherWhen, context.weatherWhat, context.weatherTime).then((weather) => {
    context.weatherNarrative = weather
    return ({context, privateContext})
  }).catch((err) => {
    // Reset everything and start over.
    delete context.weatherWhere
    delete context.weatherWhen
    delete context.weatherWhat
    delete context.weatherTime
    delete context.weatherNarrative
    delete context.inboundMsg
    // Respond with the error.
    context.weatherNarrative = err
    return ({context, privateContext})
  })
}

function weatherConditionsPromise (where, when, what, time) {
  return new Promise((resolve, reject) => {
    weatherLocationPromise(where).then((geoCode) => {
      let forecastDays = getForecastDuration(when)
      let url = 'https://twcservice.mybluemix.net/api/weather/v1/geocode/' +
        geoCode.latitude +
        '/' +
        geoCode.longitude +
        '/forecast/daily/' + forecastDays + 'day.json'
      request.get(url, { json: true }, function (err, http, weatherResponse) {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          weatherFxPromise(geoCode.zipCode).then((fx) => {
            console.log(JSON.stringify(fx))
            for (let trigger of fx.wfxtg.dailyForecast[0].trigger) {
              let triggerDesc = fxHash.find(trigger)
              if (triggerDesc) console.log(triggerDesc)
            }
            whatFunctionMap[what](when, time, geoCode.address, weatherResponse.forecasts).then((narrative) => resolve(narrative))
          })
        }
      }).auth(process.env.WEATHER_USERNAME, process.env.WEATHER_PASSWORD, false)
    }, (err) => {
      console.log(err)
      reject(err)
    })
  })
}

function weatherLocationPromise (location) {
  return new Promise((resolve, reject) => {
    try {
      let url = 'http://twcservice.mybluemix.net/api/weather/v3/location/search' +
        '?query=' + location + '&locationType=city&language=en-US'
      request.get(url, { json: true }, function (err, http, locationResponse) {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          if (locationResponse && locationResponse.location && locationResponse.location.address.length > 0) {
            let geoLocation = {
              latitude: locationResponse.location.latitude[0],
              longitude: locationResponse.location.longitude[0],
              address: locationResponse.location.address[0],
              zipCode: locationResponse.location.postalKey[0].substr(0, (locationResponse.location.postalKey[0].indexOf(':')))
            }
            resolve(geoLocation)
          } else {
            reject('Please try again, seems like I misunderstood what you were asking.')
          }
        }
      }).auth(process.env.WEATHER_USERNAME, process.env.WEATHER_PASSWORD, false)
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

function weatherFxPromise (zipCode) {
  return new Promise((resolve, reject) => {
    try {
      let url = 'http://partners.wfxtriggers.com/partners/json/?resp_type=json&acctid=' +
        process.env.WEATHER_FX_ACCT_ID +
        '&loc=US_4_' +
        zipCode +
        '&df=0'

      request.get(url, { json: true }, (err, http, response) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(response)
        }
      })
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

function generalForecast (when, time, where, forecasts) {
  return new Promise((resolve, reject) => {
    try {
      let whenDt = moment(when)
      let narrative = 'You asked for weather on ' + whenDt.format('dddd, MMMM Do YYYY') + ' but I can only tell you weather for the next 10 days.'
      let forecast = getMostRelevantForecast(forecasts, when, time)
      if (forecast) {
        narrative = 'Weather for ' + whenDt.format('dddd, MMMM Do YYYY') + ' is ' + forecast.narrative + ' in ' + where
      }
      resolve(narrative)
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

function precipitationForecast (when, time, where, forecasts) {
  return new Promise((resolve, reject) => {
    try {
      let whenDt = moment(when)
      let narrative = 'You asked for weather on ' + whenDt.format('dddd, MMMM Do YYYY') + ' but I can only tell you weather for the next 10 days.'
      let forecast = getMostRelevantForecast(forecasts, when, time)
      if (forecast) {
        if (forecast.qpf > 0) {
          narrative = 'Looks like you might get some precipitation on ' + whenDt.format('dddd, MMMM Do YYYY') + ' in ' + where
        } else {
          narrative = 'It looks like its going to be dry on ' + whenDt.format('dddd, MMMM Do YYYY') + ' in ' + where
        }
      }
      resolve(narrative)
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

function golfForecast (when, time, where, forecasts) {
  return new Promise((resolve, reject) => {
    let whenDt = moment(when)
    let narrative = 'You asked for weather on ' + whenDt.format('dddd, MMMM Do YYYY') + ' but I can only tell you weather for the next 10 days.'
    let forecast = getMostRelevantForecast(forecasts, when, time)
    if (forecast) {
      if (forecast.day) {
        narrative = 'Conditions to play golf is ' + forecast.day.golf_category + ' on ' + whenDt.format('dddd, MMMM Do YYYY') + ' in ' + where
      } else {
        if (forecast.night) {
          narrative = 'Conditions to play golf is ' + forecast.night.golf_category + ' on ' + whenDt.format('dddd, MMMM Do YYYY') + ' in ' + where
        }
      }
    }
    resolve(narrative)
  })
}

function outsideActivitiesForecast (when, time, where, forecasts) {
  return new Promise((resolve, reject) => {
    let whenDt = moment(when)
    let narrative = 'You asked for weather on ' + whenDt.format('dddd, MMMM Do YYYY') + ' but I can only tell you weather for the next 10 days.'
    let forecast = getMostRelevantForecast(forecasts, when, time)
    if (forecast) {
      if (forecast.day) {
        narrative = 'Conditions for outside activities are ' + forecast.day.golf_category + ' on ' + whenDt.format('dddd, MMMM Do YYYY') + ' in ' + where
      } else {
        if (forecast.night) {
          narrative = 'Conditions for outside activities are ' + forecast.night.golf_category + ' on ' + whenDt.format('dddd, MMMM Do YYYY') + ' in ' + where
        }
      }
    }
    resolve(narrative)
  })
}

function thunderForecast (when, time, where, forecasts) {
  return new Promise((resolve, reject) => {
    let whenDt = moment(when)
    let narrative = 'You asked for weather on ' + whenDt.format('dddd, MMMM Do YYYY') + ' but I can only tell you weather for the next 10 days.'
    let forecast = getMostRelevantForecast(forecasts, when, time)
    if (forecast) {
      if (forecast.day) {
        narrative = 'It looks like there is ' + forecast.day.thunder_enum_phrase + ' warnings on ' + whenDt.format('dddd, MMMM Do YYYY') + ' in ' + where
      } else {
        if (forecast.night) {
          narrative = 'It looks like there is ' + forecast.night.thunder_enum_phrase + ' warnings on ' + whenDt.format('dddd, MMMM Do YYYY') + ' in ' + where
        }
      }
    }
    resolve(narrative)
  })
}

function windForecast (when, time, where, forecasts) {
  return new Promise((resolve, reject) => {
    let whenDt = moment(when)
    let narrative = 'You asked for weather on ' + whenDt.format('dddd, MMMM Do YYYY') + ' but I can only tell you weather for the next 10 days.'
    let forecast = getMostRelevantForecast(forecasts, when, time)
    if (forecast) {
      if (forecast.day) {
        narrative = 'There will be ' + forecast.day.wind_phrase + ' on ' + whenDt.format('dddd, MMMM Do YYYY') + ' in ' + where
      } else {
        if (forecast.night) {
          narrative = 'There will be ' + forecast.night.wind_phrase + ' on ' + whenDt.format('dddd, MMMM Do YYYY') + ' in ' + where
        }
      }
    }
    resolve(narrative)
  })
}

function temperatureForecast (when, time, where, forecasts) {
  return new Promise((resolve, reject) => {
    let whenDt = moment(when)
    let narrative = 'You asked for weather on ' + whenDt.format('dddd, MMMM Do YYYY') + ' but I can only tell you weather for the next 10 days.'
    let forecast = getMostRelevantForecast(forecasts, when, time)
    if (forecast) {
      let mostRecent = forecast.day ? forecast.day : forecast.night
      if (mostRecent.hi < 60) {
        narrative = 'It will be on the cold side with a high of ' + mostRecent.hi + ' on ' + whenDt.format('dddd, MMMM Do YYYY') + ' in ' + where
      }
      if (mostRecent.hi > 60 && mostRecent.hi < 90) {
        narrative = 'It will be nice with a high of ' + mostRecent.hi + ' on ' + whenDt.format('dddd, MMMM Do YYYY') + ' in ' + where
      }
      if (mostRecent.hi > 90) {
        narrative = 'It will be on the hot side with a high of ' + mostRecent.hi + ' on ' + whenDt.format('dddd, MMMM Do YYYY') + ' in ' + where
      }
    }
    resolve(narrative)
  })
}

function getMostRelevantForecast (forecasts, when, time) {
  // Use this to search the forecast for the right day
  let whenDt = moment(when)
  let mostRelevant
  for (let forecast of forecasts) {
    let forecastDt = moment(forecast.fcst_valid_local)
    if (forecastDt.isSame(whenDt, 'day')) {
      if (!time || time === 'Morning' || time === 'Afternoon') {
        mostRelevant = forecast.day ? forecast.day : forecast
      } else {
        mostRelevant = forecast.night ? forecast.night : forecast
      }
      break
    }
  }
  return mostRelevant
}

function getForecastDuration (when) {
  let m = moment(when)
  let now = moment()
  var days = moment(m, 'DD/MM/YYYY').diff(moment(now, 'DD/MM/YYYY'), 'days') + 1
  let forecastDays = 3
  switch (true) {
    case (days < 3):
      forecastDays = 3
      break
    case (days < 5):
      forecastDays = 5
      break
    case (days < 7):
      forecastDays = 7
      break
    case (days < 10):
      forecastDays = 10
      break
  }
  return forecastDays
}

module.exports = {
  callWeather
}
