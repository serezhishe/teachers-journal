const Student = require('../models/student');
const Subject = require('../models/subject');

const {
  updateSubject
} = require('../services/subject');

exports.createStudent = async function ({ name, lastName, address, description } = {}) {
  const student = new Student({ name, lastName, address, description });
  (await Subject.find({_deletedAt: null})).forEach(elem => {
    elem.marks.set('' + student._id, []);
    updateSubject(elem);
  })
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
  (await Subject.find({_deletedAt: null})).forEach(elem => {
    elem.marks.delete(id);
    updateSubject(elem);
  })
  return await exports.updateStudent({ id, _deletedAt: Date.now() });
};

exports.getStudentById = async function (id) {
  return await Student.find({ _id: id });
}

exports.getAll = async function () {
  return await Student.find({ _deletedAt: null });
}
