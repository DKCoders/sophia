require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = (user, admin) =>
  jwt.sign({user: {_id: user._id, isAdmin: !!admin || undefined}}, process.env.SECRET, {expiresIn: '2 years'});

module.exports = {
  generateToken
};
