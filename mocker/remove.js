require('dotenv').config();
const mongoose = require('mongoose');
require('../utils/dbInit');
const User = mongoose.model('User');
const Brand = mongoose.model('Brand');
const Category = mongoose.model('Category');
const Product = mongoose.model('Product');
const Client = mongoose.model('Client');
const Order = mongoose.model('Order');

const remove = async () => {
  const mongoDBUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sophia';
  await mongoose.connect(mongoDBUri);
  console.log('Removing Users');
  await User.remove({});
  console.log('Removing Brands');
  await Brand.remove({});
  console.log('Removing Categories');
  await Category.remove({});
  console.log('Removing Products');
  await Product.remove({});
  console.log('Removing Clients');
  await Client.remove({});
  console.log('Removing Orders');
  await Order.remove({});
  process.exit(0);
};

remove().catch(err => console.log(err));
