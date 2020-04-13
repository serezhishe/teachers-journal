const { Schema, model } = require('mongoose');
const subjectPageSchema = new Schema({
  subjectId: {
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
