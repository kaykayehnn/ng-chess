const app = require('./index.js')()

const port = process.env.PORT
app.listen(port, () => console.log(`Server listening on port ${port}...`))
