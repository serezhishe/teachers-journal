const { Router } = require('express');
const asyncHandler = require('express-async-handler')

const {
  getAll,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectByName,
} = require('../services/subject');

const {
  validateParam,
} = require('../utils/validator');

const validateIdParam = validateParam('id');

const api = Router();

api.get('/', asyncHandler(async (req, res) => {
  const subjects = (await getAll()).map(subject => subject.name);

  res.send(subjects)
}));

api.get('/:name', asyncHandler(async (req, res) => {
  const { name } = req.params;

  const subject = await getSubjectByName(name);

  res.send(subject);
}));

api.post('/', asyncHandler(async (req, res) => {
  const { name, marks, dates, teacher, cabinet } = req.body;

  if ( !name || !marks || !dates || !teacher ) {
    return res.sendStatus(400);
  }

  res.send(await createSubject({ name, marks, dates, teacher, cabinet }));

}));

// api.put('/:id', validateIdParam, asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { name, marks, dates, teacher, cabinet } = req.body;

//   if ( !name || !marks || !dates || !teacher ) {
//     return res.sendStatus(400);
//   }

//   await updateSubject({ id, name, marks, dates, teacher, cabinet });

//   res.send(200);
// }));

api.patch('/:id', validateIdParam, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, marks, dates, teacher, cabinet } = req.body;

  await updateSubject({ id, name, marks, dates, teacher, cabinet });
  res.send(200);
}));

api.delete('/:id', validateIdParam, asyncHandler(async (req, res) => {
  const { id } = req.params;

  await deleteSubject(id);

  res.send(200);
}));

module.exports = api;
