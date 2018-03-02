const auth = require('../user/routes/auth');

const generateRoutes = app => {
  // User routes
  app.use('/auth', auth);
};

module.exports = generateRoutes;
