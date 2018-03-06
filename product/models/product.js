const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {commonSchemas: {auditSchema}} = require('../../utils/dbHelpers');

const productSchema = new Schema({
  audit: {type: auditSchema, default: {}},
  code: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  description: {type: String},
  imgs: [{type: String}],
  brand: {type: Schema.Types.ObjectId, ref: 'Brand'},
  category: {type: Schema.Types.ObjectId, ref: 'Category'},
  price: {type: Number, required: true, default: 0}
});

module.exports = mongoose.model('Product', productSchema);
