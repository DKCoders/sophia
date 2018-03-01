const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = new Schema(
  {
    _createdAt: {type: Date, default: Date.now},
    _createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
    _updatedAt: {type: Date},
    _updatedBy: {type: Schema.Types.ObjectId, ref: 'User'}
  },
  {_id: false}
);

const commonSchemas = {
  auditSchema
};

module.exports = {
  commonSchemas
};
