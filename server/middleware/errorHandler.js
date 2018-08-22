const BAD_REQUEST = 400

module.exports = function (err, req, res, next) {
  console.log(err.message)
  res.status(BAD_REQUEST).json({ error: err.message })
}
