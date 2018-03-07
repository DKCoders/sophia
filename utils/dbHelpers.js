const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = new Schema(
  {
    _createdAt: {type: Date, required: true, default: Date.now},
    _createdBy: {type: Schema.Types.ObjectId},
    _updatedAt: {type: Date},
    _updatedBy: {type: Schema.Types.ObjectId},
    _deletedAt: {type: Date},
    _deletedBy: {type: Schema.Types.ObjectId}
  },
  {_id: false}
);

const commonSchemas = {
  auditSchema
};

module.exports = {
  commonSchemas
};
