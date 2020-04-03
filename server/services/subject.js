const Subject = require('../models/subject');
const SubjectPage = require('../models/subject-page');
const Student = require('../models/student');


exports.createSubject = async function ({ name, marks, dates, teacher, description, cabinet } = {}) {
  const subject = new Subject({ name, teacher, description, cabinet });
  const studentsList = (await Student.find()).map(elem => elem._id);
  const subjectPage = new SubjectPage({ marks, dates, subjectId: subject._id, students: studentsList });
  
  return {
    ...JSON.parse(JSON.stringify(await subjectPage.save())),
    ...JSON.parse(JSON.stringify(await subject.save())),
  };
}

exports.updateSubject = async function ({ id, name, marks, dates, teacher, description, cabinet, students, _deletedAt }) {
  const subjectValuesToUpdate = {
    name,
    teacher,
    _deletedAt,
    description,
    cabinet,
  }
  
  const pageValuesToUpdate = {
    marks,
    dates,
    students,
    _deletedAt,
  };

  const subjectOmited = Object.keys(subjectValuesToUpdate).reduce((result, keys) => {
    if (subjectValuesToUpdate[keys] !== undefined) {
      result[keys] = subjectValuesToUpdate[keys];
    }

    return result;
  }, {});

  const pageOmited = Object.keys(pageValuesToUpdate).reduce((result, keys) => {
    if (pageValuesToUpdate[keys] !== undefined) {
      result[keys] = pageValuesToUpdate[keys];
    }
    return result;
  }, {});

  await Subject.updateOne({ _id: id }, subjectOmited);
  await SubjectPage.updateOne({ subjectId: id }, pageOmited);
  return {
    ...JSON.parse(JSON.stringify(await Subject.findOne({ _id: id }))),
    ...JSON.parse(JSON.stringify(await SubjectPage.findOne({ subjectId: id }))),
  }
}

exports.deleteSubject = async function (id) {
  await SubjectPage.deleteOne({ subjectId: id });
  return await Subject.deleteOne({ _id: id })
};

exports.getSubjectById = async function (id) {
  return {
    ...JSON.parse(JSON.stringify(await SubjectPage.findOne({ subjectId: id, }))),
    ...JSON.parse(JSON.stringify(await Subject.findOne({ _id: id, }))),
  };
}

exports.getAll = async function () {
  return await Subject.find();
}
