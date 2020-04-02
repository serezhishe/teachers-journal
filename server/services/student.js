const Student = require('../models/student');
const SubjectPage = require('../models/subject-page');

const {
  updateSubject
} = require('../services/subject');

exports.createStudent = async function ({ name, lastName, address, description } = {}) {
  const student = new Student({ name, lastName, address, description });
  (await SubjectPage.find()).forEach(async elem => {
    elem.students.push('' + student._id);
    elem.marks.set('' + student._id, []);
    await updateSubject({
      ...JSON.parse(JSON.stringify(elem)),
      id: elem.subjectID,
    });
  });
  return await student.save();
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
  (await SubjectPage.find()).forEach(async (elem) => {
    elem.marks.delete(id);
    elem.students = elem.students.filter(studentID => studentID !== id);
    await updateSubject({
      ...JSON.parse(JSON.stringify(elem)),
      id: elem.subjectID,
    });
  })
  return await Student.deleteOne({ _id: id})
  // return await exports.updateStudent({ id, _deletedAt: Date.now() });
};

exports.getStudentById = async function (id) {
  return await Student.find({ _id: id });
}

exports.getAll = async function () {
  return await Student.find();
}
