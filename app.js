/*
* Created by Alexys Gonzalez (DK) - DKCoders
*/
require('dotenv').config();
const Express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbWrapper = require('./utils/dbInit');
const generateRoutes = require('./config/routesConfig');
const {errorMiddleware} = require('./utils/helpers');
const app = new Express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(
  bodyParser.json({
    limit: '50mb'
  })
);
app.use(
  cors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(errorMiddleware);
app.use('/imgs', Express.static(__dirname + '/imgs'));

dbWrapper(mongoose.connection);
const mongoDBUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sophia';
mongoose.connect(mongoDBUri);

generateRoutes(app);

const port = process.env.PORT || 5000;
app.listen(port, function() {
  // eslint-disable-next-line no-console
  console.log('Sophia is running on port', port);
});
