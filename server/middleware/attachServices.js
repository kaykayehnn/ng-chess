module.exports = function attachServices (services) {
  const servicesMap = new Map(Object.entries(services))

  return (req, res, next) => {
    for (let [key, value] of servicesMap) {
      req[key] = value
    }

    next()
  }
}
