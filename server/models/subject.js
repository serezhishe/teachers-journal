const { Schema, model } = require('mongoose');

const subjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  teacher: {
    type: String,
    required: true,
  },
  cabinet: {
    type: Number,
    min: 0,
    default: null,
  },
  description: {
    type: String,
    default: '',
  },
  _deletedAt: {
    type: Date,
    default: null,
  },
});

module.exports = model('subject', subjectSchema);
