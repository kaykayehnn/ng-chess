const controllers = require('../controllers/')
const auth = require('./auth')
const errorHandler = require('../middleware/errorHandler')

module.exports = (app) => {
  const onlyAuthenticated = auth.enforceAuthStatus(true)
  const onlyAdmins = auth.isInRole('admin')

  app.get('/api/users', controllers.users.getByEmail)
  app.get('/api/users/:userId', controllers.users.getById)
  app.post('/api/users', controllers.users.register)
  app.post('/api/users/_login', controllers.users.login)
  app.post('/api/users/_logout', onlyAuthenticated, controllers.users.logout)

  app.get('/api/admin/users', onlyAdmins, controllers.users.getAllUsers)
  app.put('/api/admin/users/:userId', onlyAdmins, controllers.users.editUser)
  app.delete('/api/admin/users/:userId', onlyAdmins, controllers.users.deleteUser)

  app.get('/*', controllers.home.index)

  app.use(errorHandler)
}
