require('dotenv').config();
const Boom = require('boom');
const aqp = require('api-query-params');

const convertQuery = query => (query ? aqp(query, {skipKey: 'offset'}) : {});
const parseQuery = (query, maxLimit) => {
  let find = {};
  const options = {};
  if (query) {
    find = query.filter || {};
    if (find.populate) {
      options.populate = find.populate;
      options.populate = options.populate.$in || options.populate;
      find.populate = undefined;
    }
    options.sort = query.sort ? query.sort : undefined;
    options.limit = query.limit && query.limit < maxLimit 
      ? query.limit 
      : query.limit === 0
      ? 0
      : maxLimit;
    options.offset = query.skip || 0;
    options.select = query.projection || undefined;
  }
  return {find, options};
};

const mapResponse = (dataKey, results) => {
  const response = {};
  response.data = results[dataKey];
  delete results[dataKey];
  response.meta = results;
  return response;
};

const responder = func => async (req, res, next) => {
  try {
    res.json(await func(req, res, next));
  } catch (err) {
    res.error(err);
  }
};

const errorMiddleware = (req, res, next) => {
  res.error = err => {
    if (!err.isBoom) {
      if (err.error && err.error.statusCode) {
        err = Boom.create(err.error.statusCode, err.error.message);
      } else {
        err = Boom.badRequest(err);
      }
    }
    res.status(err.output.statusCode).json(err.output.payload);
  };
  next();
};

module.exports = {
  convertQuery,
  parseQuery,
  mapResponse,
  responder,
  errorMiddleware
};
