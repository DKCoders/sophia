const auth = require('../user/routes/auth');
const users = require('../user/routes/users');
const brands = require('../brand/routes/brands');
const categories = require('../category/routes/categories');

const generateRoutes = app => {
  // User routes
  app.use('/auth', auth);
  app.use('/users', users);
  app.use('/brands', brands);
  app.use('/categories', categories);
};

module.exports = generateRoutes;
