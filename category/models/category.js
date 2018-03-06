const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {commonSchemas: {auditSchema}} = require('../../utils/dbHelpers');

const categorySchema = new Schema({
  audit: {type: auditSchema, default: {}},
  code: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  description: {type: String},
  img: {type: String}
});

module.exports = mongoose.model('Category', categorySchema);
