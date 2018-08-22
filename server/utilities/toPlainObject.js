module.exports = function toPlainObject (obj) {
  let plain = {}
  for (let prop in obj) {
    plain[prop] = obj[prop]
  }

  return plain
}
