/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const {random: {arrayElement: randomElement}} = require('faker');
require('../utils/dbInit');
const userMocker = require('./users');
const brandMocker = require('./brands');

const main = async () => {
  const mongoDBUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sophia';
  await mongoose.connect(mongoDBUri);
  const admin = await userMocker.createAdminUser();
  console.log('User Admin created! username: admin; password: 12345;');
  const users = await Promise.all([...Array(10)].map(() => userMocker.generateRandomUser()));
  console.log(`${users.length} Users created`);
  const userIds = users.map(user => user._id);
  const brands = await Promise.all(
    [...Array(10)].map(() => brandMocker.generateRandomBrand(admin._id))
  );
  console.log(`${brands.length} Brands created`);  
  process.exit(0);
};

main().catch(err => console.log(err));
