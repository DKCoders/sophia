require('dotenv').config();
const Boom = require('boom');
const express = require('express');
const router = new express.Router();
const brandService = require('../services/brand');
const {responder, convertQuery} = require('../../utils/helpers');
const {jwtMiddleware, isAdmin} = require('../../utils/jwtHelpers');

router.use(jwtMiddleware);

router.get(
  '/',
  responder(async req => brandService.getAll(convertQuery(req._parsedUrl.query)))
);
router.post(
  '/',
  responder(async req => {
    if (!isAdmin(req)) {
      throw Boom.unauthorized('Not enough privileges');
    }
    return brandService.create(req.body, req.user._id);
  })
);
router.get(
  '/:id',
  responder(async req => brandService.getById(req.params.id))
);
router.put(
  '/:id',
  responder(async req => {
    if (!isAdmin(req)) {
      throw Boom.unauthorized('Not enough privileges');
    }
    const id = req.params.id;
    const brandPut = req.body;
    const current = await brandService.getById(id);
    if (!current.data) {
      throw Boom.notFound('Not found');
    }
    return brandService.updateById(id, brandPut, req.user._id, true);
  })
);
router.patch(
  '/:id',
  responder(req => {
    if (!isAdmin(req)) {
      throw Boom.unauthorized('Not enough privileges');
    }
    const id = req.params.id;
    const brandPatch = req.body;
    return brandService.updateById(id, brandPatch, req.user._id);
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
    return brandService.updateById(id, {$set});
  })
);
router.delete(
  '/:id/restore',
  responder(req => {
    if (!isAdmin(req)) {
      throw Boom.unauthorized('Not enough privileges');
    }
    const id = req.params.id;
    return brandService.updateById(id, {$unset: {'audit._deletedAt': '', 'audit._deletedBy': ''}});
  })
);

module.exports = router;
