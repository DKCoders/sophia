const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
mongoosePaginate.paginate.options = {
  limit: 500,
  lean: true
};
mongoose.plugin(mongoosePaginate);
