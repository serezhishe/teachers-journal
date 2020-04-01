const { Schema, model } = require('mongoose');
const moment = require('moment');
const subjectPageSchema = new Schema({
  subjectID: {
    type: String,
    required: true,
  },
  dates: {
    type: [String],
    required: true,
  },
  marks: {
    type: Map,
    of: [Number],
    required: true,
  },
  students: {
    type: [String],
  },
  _deletedAt: {
    type: Date,
    default: null,
  },
});

module.exports = model('subjectPage', subjectPageSchema);
