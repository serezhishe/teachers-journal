const Student = require('../models/Student');


exports.createStudent = async function ({ name, lastName, address, description } = {}) {
  const student = new Student({ name, lastName, address, description });

  return student.save();
}

exports.updateStudent = async function ({ id, name, lastName, address, description, _deletedAt }) {

  const valuesToUpdate = {
    name,
    lastName,
    address,
    description,
    _deletedAt,
  };

  const omited = Object.keys(valuesToUpdate).reduce((result, keys) => {
    if (valuesToUpdate[keys] !== undefined) {
      result[keys] = valuesToUpdate[keys];
    }

    return result;
  }, {});

  return await Student.updateOne({ _id: id }, omited);
}

exports.deleteStudent = async function (id) {
  return await exports.updateStudent({ id, _deletedAt: Date.now() });
};

exports.getStudentById = async function (id) {
  return await Student.find({ _id: id });
}

exports.getAll = async function () {
  return await Student.find({ _deletedAt: null });
}
