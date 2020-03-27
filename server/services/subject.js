const Subject = require('../models/subject');


exports.createSubject = async function ({ name, marks, dates, teacher, description, cabinet } = {}) {
  const subject = new Subject({ name, marks, dates, teacher, description, cabinet });
  return subject.save();
}

exports.updateSubject = async function ({ id, name, marks, dates, teacher, description, cabinet, _deletedAt }) {

  const valuesToUpdate = {
    name,
    marks,
    dates,
    teacher,
    description,
    cabinet,
    _deletedAt,
  };

  const omited = Object.keys(valuesToUpdate).reduce((result, keys) => {
    if (valuesToUpdate[keys] !== undefined) {
      result[keys] = valuesToUpdate[keys];
    }

    return result;
  }, {});
  await Subject.updateOne({ _id: id }, omited);
  return Subject.findOne({ _id: id })
}

exports.deleteSubject = async function (id) {
  return await Subject.deleteOne({ _id: id})
  // return await exports.updateSubject({ id: id, _deletedAt: Date.now() });
};

exports.getSubjectById = async function (id) {
  return await Subject.findOne({ _id: id, });
}

exports.getAll = async function () {
  return await Subject.find();
}
