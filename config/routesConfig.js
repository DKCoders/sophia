const auth = require('../user/routes/auth');
const users = require('../user/routes/users');
const brands = require('../brand/routes/brands');

const generateRoutes = app => {
  // User routes
  app.use('/auth', auth);
  app.use('/users', users);
  app.use('/brands', brands);
};

module.exports = generateRoutes;
