const {isEmail} = require('validator');
const generator = require('generate-password');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {auditSchema} = require('../../utils/dbHelpers').commonSchemas;

const userSchema = new Schema({
  audit: {type: auditSchema, default: {}},
  username: {type: String, unique: true},
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: [isEmail, 'invalid email']
  },
  // TODO: improve password security
  password: {type: String, required: true, default: generator.generate},
  name: {type: String},
  admin: {type: Boolean, required: true, default: false}
});

module.exports = mongoose.model('User', userSchema);
