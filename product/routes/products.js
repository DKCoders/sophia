require('dotenv').config();
const Boom = require('boom');
const express = require('express');
const router = new express.Router();
const productService = require('../services/product');
const {responder, convertQuery} = require('../../utils/helpers');
const {jwtMiddleware, isAdmin} = require('../../utils/jwtHelpers');

router.use(jwtMiddleware);

router.get(
  '/',
  responder(async req => productService.getAll(convertQuery(req._parsedUrl.query)))
);
router.post(
  '/',
  responder(async req => {
    if (!isAdmin(req)) {
      throw Boom.unauthorized('Not enough privileges');
    }
    return productService.create(req.body, req.user._id);
  })
);
router.get(
  '/:id',
  responder(async req => productService.getById(req.params.id))
);
router.put(
  '/:id',
  responder(async req => {
    if (!isAdmin(req)) {
      throw Boom.unauthorized('Not enough privileges');
    }
    const id = req.params.id;
    const productPut = req.body;
    const current = await productService.getById(id);
    if (!current.data) {
      throw Boom.notFound('Not found');
    }
    return productService.updateById(id, productPut, req.user._id, true);
  })
);
router.patch(
  '/:id',
  responder(req => {
    if (!isAdmin(req)) {
      throw Boom.unauthorized('Not enough privileges');
    }
    const id = req.params.id;
    const productPatch = req.body;
    return productService.updateById(id, productPatch, req.user._id);
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
    return productService.updateById(id, {$set}, req.user._id);
  })
);
router.delete(
  '/:id/restore',
  responder(req => {
    if (!isAdmin(req)) {
      throw Boom.unauthorized('Not enough privileges');
    }
    const id = req.params.id;
    return productService.updateById(id, {$unset: {'audit._deletedAt': '', 'audit._deletedBy': ''}}, req.user._id);
  })
);

module.exports = router;
