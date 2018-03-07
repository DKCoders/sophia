require('dotenv').config();
const Boom = require('boom');
const express = require('express');
const router = new express.Router();
const clientService = require('../services/client');
const {responder, convertQuery} = require('../../utils/helpers');
const {jwtMiddleware, isAdmin} = require('../../utils/jwtHelpers');

router.use(jwtMiddleware);

router.get(
  '/',
  responder(async req => clientService.getAll(convertQuery(req._parsedUrl.query)))
);
router.post(
  '/',
  responder(async req => {
    const client = req.body;
    // To prevent no admin user to create verified clients
    if (!isAdmin(req)) {
      client.verified = false;
    }
    return clientService.create(client, req.user._id);
  })
);
router.get(
  '/:id',
  responder(async req => clientService.getById(req.params.id))
);
router.put(
  '/:id',
  responder(async req => {
    const id = req.params.id;
    const clientPut = req.body;
    const current = await clientService.getById(id);
    if (!current.data) {
      throw Boom.notFound('Not found');
    }
    // To prevent verify to be changed by not admin user
    if (!isAdmin(req)) {
      clientPut.verified = current.data.verified;
    }
    return clientService.updateById(id, clientPut, req.user._id, true);
  })
);
router.patch(
  '/:id',
  responder(req => {
    const id = req.params.id;
    const clientPatch = req.body;
    // To prevent verify to be changed by not admin user
    if (!isAdmin(req)) {
      delete clientPatch.verified;
    }
    return clientService.updateById(id, clientPatch, req.user._id);
  })
);
router.delete(
  '/:id',
  responder(req => {
    if (!isAdmin(req)) {
      throw Boom.unauthorized('Not enough privileges');
    }
    const id = req.params.id;
    const $set = {'audit._deletedAt': new Date(), 'audit._deletedBy': req.user._id}
    return clientService.updateById(id, {$set}, req.user._id);
  })
);
router.delete(
  '/:id/restore',
  responder(req => {
    if (!isAdmin(req)) {
      throw Boom.unauthorized('Not enough privileges');
    }
    const id = req.params.id;
    return clientService.updateById(id, {$unset: {'audit._deletedAt': '', 'audit._deletedBy': ''}}, req.user._id);
  })
);

module.exports = router;
