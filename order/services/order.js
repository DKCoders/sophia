const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const MAX_LIMIT = parseInt(process.env.MAX_LIMIT);
const {parseQuery, mapResponse} = require('../../utils/helpers');

class OrderService {
  static async getAll(query, additional) {
    const {find, options} = parseQuery(query, MAX_LIMIT);
    if (additional) {
      Object.assign(find, additional);
    }
    const orders = await Order.paginate(find, options);
    return mapResponse('docs', orders);
  }

  static async getById(orderId) {
    const document = await Order.findById(orderId);
    return mapResponse('document', {document});
  }

  static async getQuery(find, options) {
    const result = await Order.paginate(find, options);
    return mapResponse('docs', result);
  }

  static async create(order, userId) {
    order.audit = {_createdBy: userId, _createdAt: new Date()};
    const document = await Order.create(order);
    return mapResponse('document', {document});
  }

  static async updateById(orderId, order, userId, overwrite = false) {
    const document = await Order.findByIdAndUpdate(orderId, order, {overwrite, new: true, runValidators: true});
    const doc = !document
      ? null
      : await Order.findByIdAndUpdate(
          orderId,
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
      meta: await Order.update(query, body, options)
    };
  }
}

module.exports = OrderService;
