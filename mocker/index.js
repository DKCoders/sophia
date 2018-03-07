/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const {random: {arrayElement: randomElement, number}} = require('faker');
require('../utils/dbInit');
const userMocker = require('./users');
const brandMocker = require('./brands');
const categoryMocker = require('./categories');
const productMocker = require('./products');
const clientMocker = require('./clients');
const orderMocker = require('./orders');

const main = async () => {
  const mongoDBUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sophia';
  await mongoose.connect(mongoDBUri);
  const admin = await userMocker.createAdminUser();
  console.log('User Admin created! username: admin; password: 12345;');
  const users = await Promise.all([...Array(10)].map(() => userMocker.generateRandomUser()));
  console.log(`${users.length} Users created`);
  const brands = await Promise.all([...Array(10)].map(() => brandMocker.generateRandomBrand(admin._id)));
  console.log(`${brands.length} Brands created`);
  const categories = await Promise.all([...Array(10)].map(() => categoryMocker.generateRandomCategory(admin._id)));
  console.log(`${categories.length} Categories created`);
  const brandIds = brands.map(brand => brand._id);
  const categoryIds = categories.map(category => category._id);
  const products = await Promise.all([...Array(50)].map(() => 
    productMocker.generateRandomProduct(randomElement(brandIds), randomElement(categoryIds), admin._id)));
  console.log(`${products.length} Products created`);
  const userIds = [admin._id, ...users.map(user => user._id)];
  const clients = await Promise.all([...Array(20)].map(() => clientMocker.generateRandomClient(randomElement(userIds))));
  console.log(`${clients.length} Clients created`);
  const orders = await Promise.all([...Array(10)].map(
    () => 
    orderMocker.generateRandomOrder(
      randomElement(userIds),
      randomElement(clients)._id,
      [...Array(number(7) + 1)].map(() => randomElement(products))
    )
  ));
  console.log(`${orders.length} Orders created`);
  process.exit(0);
};

main().catch(err => console.log(err));
