const Subject = require('../models/subject');


exports.createSubject = async function ({ name, marks, dates, teacher, description, cabinet } = {}) {
  const subject = new Subject({ name, marks, dates, teacher, description, cabinet });
  console.log(subject)
  return subject.save();
}

exports.updateSubject = async function ({ name, marks, dates, teacher, description, cabinet, _deletedAt }) {

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

  await Subject.updateOne({ name: name }, omited);
  return Subject.findOne({ name: name })
}

exports.deleteSubject = async function (id) {
  return await exports.updateSubject({ id, _deletedAt: Date.now() });
};

exports.getSubjectByName = async function (name) {
  return await Subject.findOne({ name: name });
}

exports.getAll = async function () {
  return await Subject.find({ _deletedAt: null });
}