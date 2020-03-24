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
const validateNameParam = validateParam('name');

const api = Router();

api.get('/', asyncHandler(async (req, res) => {

  res.send(await getAll())
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

api.patch('/:name', validateNameParam, asyncHandler(async (req, res) => {
  const { name } = req.params;
  const { marks, dates, teacher, cabinet } = req.body;
  console.log(name)
  res.status(200).send(await updateSubject({ name, marks, dates, teacher, cabinet }));
}));

api.delete('/:name', validateNameParam, asyncHandler(async (req, res) => {
  const { id } = req.params;

  await deleteSubject(id);

  res.send(200);
}));

module.exports = api;
