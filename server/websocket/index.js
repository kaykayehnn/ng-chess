const ws = require('ws')

const applyMiddleware = require('./middleware/')
const applyControllers = require('./controllers/')

module.exports = (config) => {
  const wss = new ws.Server({ server: config.server })
  delete config.server // it won't be used anymore

  wss.on('connection', socket => {
    console.log('websocket connection opened') // FIXME: remove
    applyMiddleware(config, socket)
    applyControllers(config, socket)

    socket.on('message', (message) => {
      try {
        let messageObj = JSON.parse(message)
        console.log('received message', messageObj.resource, messageObj.payload.event)
        socket.emit(messageObj.resource, messageObj.payload)
      } catch (e) {
        console.log('failed parse', e)
      }
    })

    socket.on('close', () => {
      console.log('websocket connection closed') // FIXME: remove
    })
  })

  wss.on('listening', () => console.log('WebSocket listening...'))
  return wss
}
