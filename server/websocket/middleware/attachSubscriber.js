module.exports = function attachSubscriberFactory (config) {
  let subscriber = config.cache.duplicate()

  return function attachSubscriber () {
    this.sub = subscriber
  }
}
