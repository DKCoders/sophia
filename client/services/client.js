const mongoose = require('mongoose');
const Client = mongoose.model('Client');
const MAX_LIMIT = parseInt(process.env.MAX_LIMIT);
const {parseQuery, mapResponse} = require('../../utils/helpers');

class ClientService {
  static async getAll(query, additional) {
    const {find, options} = parseQuery(query, MAX_LIMIT);
    if (additional) {
      Object.assign(find, additional);
    }
    const clients = await Client.paginate(find, options);
    return mapResponse('docs', clients);
  }

  static async getById(clientId) {
    const document = await Client.findById(clientId);
    return mapResponse('document', {document});
  }

  static async getQuery(find, options) {
    const result = await Client.paginate(find, options);
    return mapResponse('docs', result);
  }

  static async create(client, userId) {
    client.audit = {_createdBy: userId, _createdAt: new Date()};
    const document = await Client.create(client);
    return mapResponse('document', {document});
  }

  static async updateById(clientId, client, userId, overwrite = false) {
    const document = await Client.findByIdAndUpdate(clientId, client, {overwrite, new: true, runValidators: true});
    const doc = !document
      ? null
      : await Client.findByIdAndUpdate(
          clientId,
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
      meta: await Client.update(query, body, options)
    };
  }
}

module.exports = ClientService;
