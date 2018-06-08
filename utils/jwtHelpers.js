require('dotenv').config();
const jwt = require('jsonwebtoken');
const Boom = require('boom');

const generateToken = (user, admin) =>
  jwt.sign({user: {_id: user._id, isAdmin: !!admin || undefined}}, process.env.SECRET, {expiresIn: '2 years'});

const jwtMiddleware = (req, res, next) => {
  const authorization = req.header('authorization');
  if (!authorization) {
    res.error(Boom.unauthorized('Unauthorized'));
  }
  const token = authorization.split(' ');
  if (token[0] !== 'Bearer') {
    res.error('Invalid token');
  }
  try {
    const decoded = jwt.verify(token[1], process.env.SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.error(error);
  }
};

const isAdmin = req => req.user && req.user.isAdmin;

const adminRequiredMiddleware = (req, res, next) => {
  if (!isAdmin(req)) {
    res.error(Boom.unauthorized('Not enough privileges'));
  }
  next();
};

module.exports = {
  generateToken,
  jwtMiddleware,
  adminRequiredMiddleware,
  isAdmin
};
