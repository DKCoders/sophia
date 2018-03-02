/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
require('../utils/dbInit');
const userMocker = require('./users');

const main = async () => {
  const mongoDBUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sophia';
  await mongoose.connect(mongoDBUri);
  await userMocker.createAdminUser();
  console.log('User Admin created! username: admin; password: 12345;');
  const users = await Promise.all([...Array(10)].map(() => userMocker.generateRandomUser()));
  console.log(`${users.length} Users created`);
  process.exit(0);
};

main().catch(err => console.log(err));
