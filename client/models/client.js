const {isEmail} = require('validator');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {commonSchemas: {auditSchema}} = require('../../utils/dbHelpers');

const phoneSchema = new Schema({
  type: {type: String, required: true},
  number: {type: String, required: true}
}, {_id: false});

const emailSchema = new Schema({
  type: {type: String, required: true},
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: [isEmail, 'invalid client email']
  },
}, {_id: false});

const contactSchema = new Schema({
  name: {type: String, required: true},
  phone: {type: String},
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: [isEmail, 'invalid contact email']
  }
}, {_id: false});

const clientSchema = new Schema({
  audit: {type: auditSchema, default: {}},
  code: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  taxId: {type: String, unique: true},
  address: {type: String},
  phones: [phoneSchema],
  emails: [emailSchema],
  contacts: [contactSchema],
  logo: {type: String},
  imgs: [{type: String}],
  verified: {type: Boolean, required: true, default: false}
});

module.exports = mongoose.model('Client', clientSchema);
