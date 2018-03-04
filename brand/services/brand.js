const mongoose = require('mongoose');
const Brand = mongoose.model('Brand');
const MAX_LIMIT = parseInt(process.env.MAX_LIMIT);
const {parseQuery, mapResponse} = require('../../utils/helpers');

class BrandService {
  static async getAll(query, additional) {
    const {find, options} = parseQuery(query, MAX_LIMIT);
    if (additional) {
      Object.assign(find, additional);
    }
    const brands = await Brand.paginate(find, options);
    return mapResponse('docs', brands);
  }

  static async getById(brandId) {
    const document = await Brand.findById(brandId);
    return mapResponse('document', {document});
  }

  static async getQuery(find, options) {
    const result = await Brand.paginate(find, options);
    return mapResponse('docs', result);
  }

  static async create(brand, userId) {
    brand.audit = {_createdBy: userId, _createdAt: new Date()};
    const document = await Brand.create(brand);
    return mapResponse('document', {document});
  }

  static async updateById(brandId, brand, userId, overwrite = false) {
    const document = await Brand.findByIdAndUpdate(brandId, brand, {overwrite, new: true});
    const doc = !document ? null : await Brand.findByIdAndUpdate(brandId, {'audit._updatedAt': new Date(), 'audit._updatedBy': userId}, {new: true});
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
      meta: await Brand.update(query, body, options)
    };
  }
}

module.exports = BrandService;
