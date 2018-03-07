const faker = require('faker');
const mongoose = require('mongoose');
const Order = mongoose.model('Order');

const createOrder = ({code, owner, client, notes, items, modifiers, audit}) => 
  Order.create({code, owner, client, notes, items, modifiers, audit});

const generateRandomOrder = (_createdBy, client, products) => {
  const code = [...Array(5)]
    .map(() => faker.random.alphaNumeric())
    .join('')
    .toUpperCase();
  const notes = faker.lorem.paragraph();
  const items = products.map(({_id: product, price}) => ({
    product,
    price,
    quantity: faker.random.number(9) + 1
  }));
  const modifiers = [...Array(2)].map(() => ({
    value: (faker.random.number(50) / 100) * (faker.random.number(1) ? 1 : -1) ,
    description: faker.random.words()
  }));
  const audit = {_createdBy};
  return createOrder({code, owner: _createdBy, client, notes, items, modifiers, audit});
};

module.exports = {
  createOrder,
  generateRandomOrder
};
