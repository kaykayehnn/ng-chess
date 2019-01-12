const redis = require('redis')
const bluebird = require('bluebird')
const { ROOMS } = require('../websocket/controllers/rooms')

module.exports = () => {
  const client = redis.createClient(process.env.REDIS_PATH)

  client.on('error', (err) => {
    console.log(`Redis error: ${err}`)
  })

  client.on('connect', () => {
    let dbId = process.env.REDIS_DB_ID || 0
    client.select(dbId, (_, res) => {
      console.log(`Redis ready id: ${dbId}`)

      client.del(ROOMS, (deleted) => {
        console.log(`Redis delete ${ROOMS}: ${deleted}`)
      })
    })
  })

  let promisified = bluebird.promisifyAll(client)
  return promisified
}
