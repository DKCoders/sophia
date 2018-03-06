const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const MAX_LIMIT = parseInt(process.env.MAX_LIMIT);
const {parseQuery, mapResponse} = require('../../utils/helpers');

class ProductService {
  static async getAll(query, additional) {
    const {find, options} = parseQuery(query, MAX_LIMIT);
    if (additional) {
      Object.assign(find, additional);
    }
    const products = await Product.paginate(find, options);
    return mapResponse('docs', products);
  }

  static async getById(productId) {
    const document = await Product.findById(productId);
    return mapResponse('document', {document});
  }

  static async getQuery(find, options) {
    const result = await Product.paginate(find, options);
    return mapResponse('docs', result);
  }

  static async create(product, userId) {
    product.audit = {_createdBy: userId, _createdAt: new Date()};
    const document = await Product.create(product);
    return mapResponse('document', {document});
  }

  static async updateById(productId, product, userId, overwrite = false) {
    const document = await Product.findByIdAndUpdate(productId, product, {overwrite, new: true});
    const doc = !document ? null : await Product.findByIdAndUpdate(productId, {'audit._updatedAt': new Date(), 'audit._updatedBy': userId}, {new: true});
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
      meta: await Product.update(query, body, options)
    };
  }
}

module.exports = ProductService;
