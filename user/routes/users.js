require('dotenv').config();
const Boom = require('boom');
const express = require('express');
const router = new express.Router();
const userService = require('../services/user');
const {responder, convertQuery} = require('../../utils/helpers');
const {jwtMiddleware, adminRequiredMiddleware} = require('../../utils/jwtHelpers');

router.use(jwtMiddleware);
router.use(adminRequiredMiddleware);

router.get(
  '/',
  responder(async req => {
    const response = await userService.getAll(convertQuery(req._parsedUrl.query));
    response.data = response.data.map(user => ({...user, password: undefined}));
    return response;
  })
);
router.post(
  '/',
  responder(async req => {
    const response = await userService.create(req.body);
    delete response.data.password;
    return response;
  })
);
router.get(
  '/:userId',
  responder(async req => {
    const response = await userService.getById(req.params.userId);
    if (response.data) {
      delete response.data.password;
    }
    return response;
  })
);
router.put(
  '/:userId',
  responder(async req => {
    const userId = req.params.userId;
    const userPut = req.body;
    const currentUser = await userService.getById(userId);
    if (!currentUser.data) {
      throw Boom.notFound('Not found');
    }
    userPut.password = currentUser.data.password;
    const response = await userService.updateById(userId, userPut, true);
    if (response.data) {
      delete response.data.password;
    }
    return response;
  })
);
router.patch(
  '/:userId',
  responder(async req => {
    const userId = req.params.userId;
    const userPatch = req.body;
    if (JSON.stringify(userPatch).match('password')) {
      throw Boom.badRequest('Cannot set passwords with this methods');
    }
    const response = await userService.updateById(userId, userPatch);
    if (response.data) {
      delete response.data.password;
    }
    return response;
  })
);
router.delete(
  '/:userId',
  responder(async req => {
    const userId = req.params.userId;
    const response = await userService.updateById(userId, {$set: {'audit._deletedAt': new Date()}});
    if (response.data) {
      delete response.data.password;
    }
    return response;
  })
);
router.delete(
  '/:userId/restore',
  responder(async req => {
    const userId = req.params.userId;
    const response = await userService.updateById(userId, {$unset: {'audit._deletedAt': new Date()}});
    if (response.data) {
      delete response.data.password;
    }
    return response;
  })
);

module.exports = router;
