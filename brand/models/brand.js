const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {commonSchemas: {auditSchema}} = require('../../utils/dbHelpers');

const brandSchema = new Schema({
  audit: {type: auditSchema, default: {}},
  code: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  description: {type: String},
  logo: {type: String},
  origin: {type: String}
});

module.exports = mongoose.model('Brand', brandSchema);
