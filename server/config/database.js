const mysql = require('mysql')
const bluebird = require('bluebird')

module.exports = () => {
  const client = mysql.createConnection(process.env.SQL_DB_PATH)
  client.connect(err => {
    if (err) return console.log(err)

    console.log('MySQL ready')
  })

  let promisified = bluebird.promisify(client.query.bind(client))
  return promisified
}
