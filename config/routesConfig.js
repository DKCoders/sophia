const auth = require('../user/routes/auth');
const users = require('../user/routes/users');
const brands = require('../brand/routes/brands');
const categories = require('../category/routes/categories');
const products = require('../product/routes/products');
const clients = require('../client/routes/clients');
const orders = require('../order/routes/orders');
const imgsLoader = require('../imgs-loader/routes/imgs-loader');

const generateRoutes = app => {
  // User routes
  app.use('/auth', auth);
  app.use('/users', users);
  app.use('/brands', brands);
  app.use('/categories', categories);
  app.use('/products', products);
  app.use('/clients', clients);
  app.use('/orders', orders);
  app.use('/imgs-loader', imgsLoader);
};

module.exports = generateRoutes;
