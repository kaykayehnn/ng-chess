const { getById, getAll, deleteById } = require('../models/Game')

exports.getById = (req, res, next) => {
  let { gameId } = req.params
  getById(req.database)(gameId)
    .then(rows => {
      if (rows.length === 0) {
        return next(new Error('Not Found'))
      }

      let game = rows[0]
      res.json(game)
    })
}

exports.getAll = (req, res, next) => {
  getAll(req.database)()
    .then(rows => res.json(rows))
}

exports.deleteById = (req, res, next) => {
  deleteById(req.database)(+req.params.gameId)
    .then(() => res.json({}))
}
