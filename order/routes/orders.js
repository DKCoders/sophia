require('dotenv').config();
const Boom = require('boom');
const express = require('express');
const router = new express.Router();
const orderService = require('../services/order');
const {responder, convertQuery} = require('../../utils/helpers');
const {jwtMiddleware, isAdmin} = require('../../utils/jwtHelpers');

router.use(jwtMiddleware);

router.get(
  '/',
  responder(async req => orderService.getAll(convertQuery(req._parsedUrl.query)))
);
router.post(
  '/',
  responder(req => {
    const order = req.body;
    if (order.owner !== req.user._id && !isAdmin(req)) {
      throw Boom.unauthorized('Not enough privileges');
    }
    return orderService.create(req.body, req.user._id);
  })
);
router.get(
  '/:id',
  responder(async req => orderService.getById(req.params.id))
);
router.put(
  '/:id',
  responder(async req => {
    const id = req.params.id;
    const orderPut = req.body;
    const current = await orderService.getById(id);
    if (!current.data) {
      throw Boom.notFound('Not found');
    }
    if (current.data.owner.toString() !== req.user._id && !isAdmin(req)) {
      throw Boom.unauthorized('Not enough privileges');
    }
    return orderService.updateById(id, orderPut, req.user._id, true);
  })
);
router.patch(
  '/:id',
  responder(async req => {
    const id = req.params.id;
    const orderPatch = req.body;
    const current = await orderService.getById(id);
    if (!current.data) {
      throw Boom.notFound('Not found');
    }
    if (current.data.owner.toString() !== req.user._id && !isAdmin(req)) {
      throw Boom.unauthorized('Not enough privileges');
    }
    return orderService.updateById(id, orderPatch, req.user._id);
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
    return orderService.updateById(id, {$set}, req.user._id);
  })
);
router.delete(
  '/:id/restore',
  responder(req => {
    if (!isAdmin(req)) {
      throw Boom.unauthorized('Not enough privileges');
    }
    const id = req.params.id;
    return orderService.updateById(id, {$unset: {'audit._deletedAt': '', 'audit._deletedBy': ''}}, req.user._id);
  })
);

module.exports = router;
