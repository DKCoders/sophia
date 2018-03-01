const mongoose = require('mongoose');
const User = mongoose.model('User');
const MAX_LIMIT = parseInt(process.env.MAX_LIMIT);
const {parseQuery, mapResponse} = require('../../utils/helpers');

class UserService {
  static async getAll(query, additional) {
    const {find, options} = parseQuery(query, MAX_LIMIT);
    if (additional) {
      Object.assign(find, additional);
    }
    return mapResponse('docs', await User.paginate(find, options));
  }
}

module.exports = UserService;
