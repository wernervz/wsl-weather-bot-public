'use strict'

let conEx = new (require('conversation-extension-framework'))(process.env.CONVERSATION_API_URL, process.env.CONVERSATION_API_USER, process.env.CONVERSATION_API_PASSWORD)

conEx.addAPI('ResetConnector', require('../apis/ResetConnector').resetContext)
conEx.addAPI('WeatherConnector', require('../apis/WeatherConnector').callWeather)

module.exports = function (Conversation) {
  Conversation.disableRemoteMethodByName('invoke', true)
  Conversation.send = async function (req, body, token, cb) {
    let response = {}

    try {
      let input = body.input
      if (!input.user) {
        console.warn('No user specfied in send message method. You must specify a user in input.user')
      }
      response = await conEx.handleIncoming(input.text, (input.user | 'NOUSER'), 'webapp')
    } catch (e) {
      console.log(e)
      throw (e)
    }

    if (!response) {
      throw new Error('conversation returned a bad response')
    }
    return [response.responseText, response.conversationResponse]
  }
  // Register the Remote Method
  Conversation.remoteMethod(
    'send', {
      description: 'Pass the results of the Watson Conversation through additional APIs',
      http: {
        path: '/send',
        verb: 'post'
      },
      accepts: [
        {
          arg: 'req',
          type: 'object',
          http: {source: 'req'},
          description: 'Express Request'
        },
        {
          arg: 'body',
          type: 'Conversation',
          http: {source: 'body'},
          description: 'Input to supply to Watson Conversation',
          required: true
        },
        {
          arg: 'access_token',
          type: 'string',
          http: {source: 'query'},
          description: 'Loopback Access Token',
          required: false
        }
      ],
      returns: [
        {
          arg: 'text',
          type: 'string',
          description: 'The text to return to the user'
        },
        {
          arg: 'conversationResponse',
          type: 'object',
          description: 'The raw response from Conversation'
        }
      ]
    }
  )
}
