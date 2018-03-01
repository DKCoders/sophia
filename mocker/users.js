const faker = require('faker');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const createAdminUser = () =>
  User.create({username: 'admin', email: 'admin@sophia.com', password: '12345', admin: true});
const createUser = ({username, email, password}) => User.create({username, email, password});
const generateRandomUser = () => {
  const email = faker.internet.email();
  const username = email.split('@')[0].toLowerCase();
  const password = faker.internet.password();
  return createUser({username, email, password});
};

module.exports = {
  createAdminUser,
  createUser,
  generateRandomUser
};
