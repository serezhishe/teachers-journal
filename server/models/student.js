const { Schema, model } = require('mongoose');

const studentSchema = new Schema({
  name:  {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  _deletedAt: {
    type: Date,
    default: null
  },
});

module.exports = model('student', studentSchema);
