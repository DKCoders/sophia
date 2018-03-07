const faker = require('faker');
const mongoose = require('mongoose');
const Category = mongoose.model('Category');

const createCategory = ({code, name, description, img, audit}) =>
  Category.create({code, name, description, img, audit});

const generateRandomCategory = _createdBy => {
  const code = [...Array(5)]
    .map(() => faker.random.alphaNumeric())
    .join('')
    .toUpperCase();
  const name = faker.random.words();
  const description = faker.lorem.paragraph();
  const img = faker.image.image();
  const audit = {_createdBy};
  return createCategory({code, name, description, img, audit});
};

module.exports = {
  createCategory,
  generateRandomCategory
};
