const faker = require('faker');
const mongoose = require('mongoose');
const Brand = mongoose.model('Brand');

const createBrand = ({code, name, description, logo, origin, audit}) => 
  Brand.create({code, name, description, logo, origin, audit});

const generateRandomBrand = _createdBy => {
  const code = [...Array(5)]
    .map(() => faker.random.alphaNumeric())
    .join('')
    .toUpperCase();
  const name = faker.random.words();
  const description = faker.lorem.paragraph();
  const logo = faker.image.technics();
  const origin = faker.address.country();
  const audit = {_createdBy};
  return createBrand({code, name, description, logo, origin, audit});
};

module.exports = {
  createBrand,
  generateRandomBrand
};
