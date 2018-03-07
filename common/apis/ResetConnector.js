'use strict'

let resetContext = function (usePrivate, context, privateContext) {
  return resetPromise(context.inboundMsg).then(() => {
    console.log('In Reset Connector triggered by inbound message: ' + context.inboundMsg)
    delete context.weatherWhere
    delete context.weatherWhen
    delete context.weatherWhat
    delete context.weatherTime
    delete context.weatherNarrative
    delete context.inboundMsg
    return ({context, privateContext})
  })
}

function resetPromise () {
  return new Promise((resolve, reject) => {
    resolve()
  })
}

module.exports = {
  resetContext
}
