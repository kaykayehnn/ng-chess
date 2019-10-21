const { server } = require('./index.js')()

const port = process.env.PORT
server.listen(port, () => console.log(`Server listening on port ${port}...`))
