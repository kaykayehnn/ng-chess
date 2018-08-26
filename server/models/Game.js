const QUERIES = {
  CREATE_GAME: `INSERT INTO games (blackPlayerId) VALUES (?)`,
  SET_WHITE_PLAYER: `UPDATE games g
  SET g.whitePlayerId = ?
  WHERE g.id = ?`,
  GET_BY_ID: `
  SELECT
    g.id,
    g.result,
    uw.id AS 'whitePlayerId',
    ub.id AS 'blackPlayerId',
    uw.email AS 'whitePlayerEmail',
    ub.email AS 'blackPlayerEmail',
    uw.avatarUrl AS 'whitePlayerAvatarUrl',
    ub.avatarUrl AS 'blackPlayerAvatarUrl'
  FROM games g
  JOIN users_stats uw ON uw.id = g.whitePlayerId
  JOIN users_stats ub ON ub.id = g.blackPlayerId
  WHERE g.id = ?`,
  END_GAME: `
  UPDATE games g
  SET g.result = ?, g.fen = ?
  WHERE g.id = ?`,
  GET_STATS: `SELECT
  ? as 'id',
  (SELECT COUNT(id)
   FROM Games g
   WHERE (g.whitePlayerId = ?
          AND g.result = 'w')
     OR (g.blackPlayerId = ?
         AND g.result = 'b')) AS 'winCount',
  (SELECT COUNT(id)
   FROM Games g
   WHERE (g.whitePlayerId = ?
          AND g.result = 'b')
     OR (g.blackPlayerId = ?
         AND g.result = 'w')) AS 'lossCount',
  (SELECT COUNT(id)
   FROM Games g
   WHERE (g.whitePlayerId = ?
     OR g.blackPlayerId = ?)
     AND g.result IS NULL) AS 'unfinishedCount'`,
  GET_LAST_N: `
  SELECT *
  FROM games_stats gs
  WHERE gs.whitePlayerId = ? OR gs.blackPlayerId = ?
  ORDER BY gs.id DESC
  LIMIT ?`,
  GET_ALL: `SELECT
  *
  FROM games_stats`,
  DELETE_BY_ID: `DELETE FROM games
  WHERE id = ?`
}

exports.createRoom = execQuery => function createRoom (whitePlayerId) {
  return execQuery(QUERIES.CREATE_GAME, [whitePlayerId])
    .then(results => results.insertId)
    .catch(console.log)
}

exports.setWhitePlayer = execQuery => function createRoom (gameId, blackPlayerId) {
  return execQuery(QUERIES.SET_WHITE_PLAYER, [blackPlayerId, gameId])
    .catch(console.log)
}

exports.getById = execQuery => function getById (id) {
  return execQuery(QUERIES.GET_BY_ID, [id])
    .catch(console.log)
}

exports.endGame = execQuery => function endGame (id, result, fen) {
  return execQuery(QUERIES.END_GAME, [result, fen, id])
    .catch(console.log)
}

exports.getStats = execQuery => function getStats (userId) {
  return execQuery(QUERIES.GET_STATS, [userId, userId, userId, userId, userId, userId, userId])
}

exports.getLast = execQuery => function getLast (userId, n) {
  return execQuery(QUERIES.GET_LAST_N, [userId, userId, n])
}

exports.getAll = execQuery => function getAll () {
  return execQuery(QUERIES.GET_ALL)
}

exports.deleteById = execQuery => function deleteById (id) {
  return execQuery(QUERIES.DELETE_BY_ID, [id])
}
