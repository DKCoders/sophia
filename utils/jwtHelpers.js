require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = user => jwt.sign({user: {_id: user._id}}, process.env.SECRET, {expiresIn: '2 years'});

module.exports = {
  generateToken
};
