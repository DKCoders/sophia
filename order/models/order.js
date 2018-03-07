const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {commonSchemas: {auditSchema}} = require('../../utils/dbHelpers');

const itemSchema = new Schema({
  product: {type: Schema.Types.ObjectId, required: true, ref: 'Product'},
  price: {type: Number, required: true, default: 0},
  quantity: {type: Number, required: true, default: 0}
});

const modifierSchema = new Schema({
  value: {type: Number, required: true},
  description: {type: String, required: true}
});

const orderSchema = new Schema({
  audit: {type: auditSchema, default: {}},
  code: {type: String, required: true, unique: true},
  date: {type: Date, required: true, default: Date.now},
  owner: {type: Schema.Types.ObjectId, required: true}, // Avoiding ref User for security
  client: {type: Schema.Types.ObjectId, required: true, ref: 'Client'},
  items: [itemSchema],
  modifiers: [modifierSchema],
  notes: {type: String}
});

module.exports = mongoose.model('Order', orderSchema);
