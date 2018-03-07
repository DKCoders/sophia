/* eslint-disable no-console */
require('./paginationPlugin');
const glob = require('glob'),
  path = require('path');
glob.sync('./**/models/**/*.js').forEach(function(file) {
  require(path.resolve(file));
});
module.exports = db => {
  db.on('error', () => console.log('Database connection error'));
  db.on('connecting', () => console.log('Database connecting'));
  db.on('reconnected', () => console.log('Database reconnected'));
  db.once('open', () => console.log('Database connection established'));
};
