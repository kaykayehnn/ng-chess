const ws = require('ws')

module.exports = (server) => {
  const wss = new ws.Server({ server: server })

  wss.on('connection', socket => {
    socket.send('hello')

    let id = setInterval(() => {
      socket.send(Date.now())
      console.log('sending date', Date.now())
    }, 1000)

    socket.on('close', () => {
      console.log('websocket connection closed')
      clearInterval(id)
    })

    socket.on('message', (data) => {
      console.log(data)
    })

    console.log('websocket connection opened')
  })

  wss.on('listening', () => console.log('WebSocket listening...'))
  return wss
}
