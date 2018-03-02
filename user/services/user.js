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

  static async getById(userId) {
    const document = await User.findById(userId);
    return mapResponse('document', {document});
  }

  static async getQuery(find, options) {
    const result = await User.paginate(find, options);
    return mapResponse('docs', result);
  }

  static async create(user) {
    const document = await User.create(user);
    return mapResponse('document', {document});
  }

  static async updateById(userId, user, overwrite = false) {
    const document = await User.findByIdAndUpdate(userId, user, {overwrite, new: true});
    const doc = !document ? null : await User.findByIdAndUpdate(userId, {'audit._updatedAt': new Date()}, {new: true});
    return mapResponse('doc', {doc});
  }

  static async update(query, body, options) {
    body.$set = body.$set || {};
    body.$setOnInsert = body.$setOnInsert || {};
    Object.assign(body.$set, {
      'audit._updatedAt': new Date()
    });
    return {
      data: {},
      meta: await User.update(query, body, options)
    };
  }
}

module.exports = UserService;
