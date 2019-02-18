const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const MAX_LIMIT = parseInt(process.env.MAX_LIMIT);
const {parseQuery, mapResponse} = require('../../utils/helpers');

class CategoryService {
  static async getAll(query, additional) {
    const {find, options} = parseQuery(query, MAX_LIMIT);
    if (additional) {
      Object.assign(find, additional);
    }
    const categories = await Category.paginate(find, options);
    return mapResponse('docs', categories);
  }

  static async getById(categoryId) {
    const document = await Category.findById(categoryId);
    return mapResponse('document', {document});
  }

  static async getQuery(find, options) {
    const result = await Category.paginate(find, options);
    return mapResponse('docs', result);
  }

  static async create(category, userId) {
    category.audit = {_createdBy: userId, _createdAt: new Date()};
    const document = await Category.create(category);
    return mapResponse('document', {document});
  }

  static async updateById(categoryId, category, userId, overwrite = false) {
    const document = await Category.findByIdAndUpdate(categoryId, category, {
      overwrite,
      new: true,
      runValidators: true
    });
    const doc = !document
      ? null
      : await Category.findByIdAndUpdate(
          categoryId,
          {'audit._updatedAt': new Date(), 'audit._updatedBy': userId},
          {new: true}
        );
    return mapResponse('doc', {doc});
  }

  static async update(query, body, options, userId) {
    body.$set = body.$set || {};
    body.$setOnInsert = body.$setOnInsert || {};
    Object.assign(body.$set, {
      'audit._updatedAt': new Date(),
      'audit._updatedBy': userId
    });
    return {
      data: {},
      meta: await Category.update(query, body, options)
    };
  }
}

module.exports = CategoryService;
