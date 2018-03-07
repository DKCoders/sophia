require('dotenv').config();
const Boom = require('boom');
const express = require('express');
const router = new express.Router();
const categoryService = require('../services/category');
const {responder, convertQuery} = require('../../utils/helpers');
const {jwtMiddleware, isAdmin} = require('../../utils/jwtHelpers');

router.use(jwtMiddleware);

router.get(
  '/',
  responder(async req => categoryService.getAll(convertQuery(req._parsedUrl.query)))
);
router.post(
  '/',
  responder(async req => {
    if (!isAdmin(req)) {
      throw Boom.unauthorized('Not enough privileges');
    }
    return categoryService.create(req.body, req.user._id);
  })
);
router.get(
  '/:id',
  responder(async req => categoryService.getById(req.params.id))
);
router.put(
  '/:id',
  responder(async req => {
    if (!isAdmin(req)) {
      throw Boom.unauthorized('Not enough privileges');
    }
    const id = req.params.id;
    const categoryPut = req.body;
    const current = await categoryService.getById(id);
    if (!current.data) {
      throw Boom.notFound('Not found');
    }
    return categoryService.updateById(id, categoryPut, req.user._id, true);
  })
);
router.patch(
  '/:id',
  responder(req => {
    if (!isAdmin(req)) {
      throw Boom.unauthorized('Not enough privileges');
    }
    const id = req.params.id;
    const categoryPatch = req.body;
    return categoryService.updateById(id, categoryPatch, req.user._id);
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
    return categoryService.updateById(id, {$set}, req.user._id);
  })
);
router.delete(
  '/:id/restore',
  responder(req => {
    if (!isAdmin(req)) {
      throw Boom.unauthorized('Not enough privileges');
    }
    const id = req.params.id;
    return categoryService.updateById(id, {$unset: {'audit._deletedAt': '', 'audit._deletedBy': ''}}, req.user._id);
  })
);

module.exports = router;
