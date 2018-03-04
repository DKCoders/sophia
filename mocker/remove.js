require('dotenv').config();
const mongoose = require('mongoose');
require('../utils/dbInit');
const User = mongoose.model('User');
const Brand = mongoose.model('Brand');

const remove = async () => {
  const mongoDBUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sophia';
  await mongoose.connect(mongoDBUri);
  console.log('Removing users');
  await User.remove({});
  console.log('Removing brands');
  await Brand.remove({});
  process.exit(0);
};

remove().catch(err => console.log(err));