const auth = require('../user/routes/auth');
const users = require('../user/routes/users');

const generateRoutes = app => {
  // User routes
  app.use('/auth', auth);
  app.use('/users', users);
};

module.exports = generateRoutes;
