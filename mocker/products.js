const faker = require('faker');
const mongoose = require('mongoose');
const Product = mongoose.model('Product');

const createProduct = ({code, name, description, imgs, brand, category, price, audit}) => 
  Product.create({code, name, description, imgs, brand, category, price, audit});

const generateRandomProduct = (brand, category, _createdBy) => {
  const code = [...Array(5)]
    .map(() => faker.random.alphaNumeric())
    .join('')
    .toUpperCase();
  const name = faker.commerce.productName();
  const description = faker.lorem.paragraph();
  const imgs = [faker.image.food()];
  const price = parseFloat(faker.commerce.price());
  const audit = {_createdBy};
  return createProduct({code, name, description, imgs, brand, category, price, audit});
};

module.exports = {
  createProduct,
  generateRandomProduct
};
