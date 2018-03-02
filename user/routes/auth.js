require('dotenv').config();
const express = require('express');
const router = new express.Router();
const userService = require('../services/user');
const {generateToken} = require('../../utils/jwtHelpers');

router.post('/login', async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const find = username ? {username, password} : {email, password};
  try {
    const response = await userService.getQuery(find);
    if (response.data.length > 0) {
      const {password, admin, __v, ...user} = response.data[0];
      const token = generateToken(user);
      res.header('Authorization', `JWT ${token}`).json({data: user});
    } else {
      res.json({error: 'Unauthorized'});
    }
  } catch (error) {
    res.error(error);
  }
});

module.exports = router;
