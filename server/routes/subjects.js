const { Router } = require('express');
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

const validateNameParam = validateParam('name');
const validateIdParam = validateParam('id');

const api = Router();

api.get('/', asyncHandler(async (req, res) => {

  res.send((await getAll()).map(elem => ({name: elem.name, _id: elem._id})))
}));

api.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const subject = await getSubjectById(id);

  res.send(subject);
}));

api.post('/', asyncHandler(async (req, res) => {
  const { name, marks, dates, teacher, cabinet, description } = req.body;

  if ( !name || !marks || !dates || !teacher ) {
    return res.sendStatus(400);
  }

  res.send(await createSubject({ name, marks, dates, teacher, cabinet, description }));

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
  const { name, marks, dates, teacher, cabinet, description } = req.body;

  res.status(200).send(await updateSubject({ id, name, marks, dates, teacher, cabinet, description }));
}));

api.delete('/:id', validateIdParam, asyncHandler(async (req, res) => {
  const { id } = req.params;

  await deleteSubject(id);

  res.status(200).send(JSON.stringify({}));
}));

module.exports = api;
