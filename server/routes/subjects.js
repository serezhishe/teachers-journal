const { Router } = require('express');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler')

const {
  getAll,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectById,
} = require('../services/subject');

const {
  validateParam,
} = require('../utils/validator');

const validateIdParam = validateParam('id');

const api = Router();

api.get('/', asyncHandler(async (req, res) => {

  res.send(await getAll());
}));

api.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send()
  } else {
    const subject = await getSubjectById(id);
    if (Object.keys(subject).length == 0) {
      res.status(404).send()
    } else {
      res.send(subject);
    }
  }
}));

api.post('/', asyncHandler(async (req, res) => {
  const { subjectName, marks, dates, teacher, cabinet, description } = req.body;

  if (!subjectName || !marks || !dates || !teacher) {
    res.sendStatus(400);
  } else {
    res.send(await createSubject({ subjectName, marks, dates, teacher, cabinet, description }));
  }
}));

api.patch('/:id', validateIdParam, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { subjectName, marks, dates, teacher, cabinet, description, students } = req.body;

  res.status(200).send(await updateSubject({ id, subjectName, marks, dates, teacher, cabinet, description, students }));
}));

api.delete('/:id', validateIdParam, asyncHandler(async (req, res) => {
  const { id } = req.params;

  await deleteSubject(id);

  res.status(200).send(JSON.stringify({}));
}));

module.exports = api;
