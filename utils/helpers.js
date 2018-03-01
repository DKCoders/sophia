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
    options.limit = query.limit && query.limit < maxLimit ? query.limit : maxLimit;
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

module.exports = {
  parseQuery,
  mapResponse
};
