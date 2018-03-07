const faker = require('faker');
const mongoose = require('mongoose');
const Client = mongoose.model('Client');

const createClient = ({code, name, taxId, address, phones, emails, contacts, verified, logo, imgs, audit}) => 
  Client.create({code, name, taxId, address, phones, emails, contacts, verified, logo, imgs, audit});

const generateRandomClient = _createdBy => {
  const code = [...Array(5)]
    .map(() => faker.random.alphaNumeric())
    .join('')
    .toUpperCase();
  const name = faker.company.companyName();
  const taxId = [...Array(10)]
    .map(() => faker.random.alphaNumeric())
    .join('')
    .toUpperCase();
  const {streetAddress, city, country} = faker.address;
  const address = `${streetAddress()}, ${city()}, ${country()}`;
  const phones = [...Array(faker.random.number(3))]
    .map(() => ({type: faker.random.word(), number: faker.phone.phoneNumber()}));
  const emails = [...Array(faker.random.number(3))]
    .map(() => ({type: faker.random.word(), email: faker.internet.email()}));
  const contacts = [...Array(faker.random.number(2))]
    .map(() => ({name: faker.name.findName(), phone: faker.phone.phoneNumber(), email: faker.internet.email()}));
  const verified = !!faker.random.number(1);
  const logo = faker.image.technics();
  const imgs = [faker.address.country()];
  const audit = {_createdBy};
  return createClient({code, name, taxId, address, phones, emails, contacts, verified, logo, imgs, audit});
};

module.exports = {
  createClient,
  generateRandomClient
};
