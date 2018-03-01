require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbWrapper = require('./utils/dbInit');
const app = new express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

dbWrapper(mongoose.connection);
const mongoDBUri = process.env.MONGODB_URI || `mongodb://localhost:27017/sophia`;
mongoose.connect(mongoDBUri);

app.get('/', (req, res) => {
  res.json({hello: ' World'});
});

const port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('Node app is running on port', port);
});