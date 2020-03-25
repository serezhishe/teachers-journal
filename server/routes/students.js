const { Router } = require('express');
const asyncHandler = require('express-async-handler')

const {
  getAll,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
} = require('../services/student');

const {
  validateParam,
} = require('../utils/validator');

const validateIdParam = validateParam('id');

const api = Router();

api.get('/', asyncHandler(async (req, res) => {
  const subjects = await getAll();

  res.send(subjects)
}));

// api.get('/:id', asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const subject = await getStudentById(id);

//   res.send(subject);
// }));

api.post('/', asyncHandler(async (req, res) => {
  const { name, lastName, address, description } = req.body;

  if (!name || !lastName) {
    return res.sendStatus(400);
  }

  res.status(200).send(await createStudent({ name, lastName, address, description }));
}));

// api.put('/:id', validateIdParam, asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { name, lastName, address, description } = req.body;

//   if (!name || !lastName) {
//     return res.sendStatus(400);
//   }

//   await updateStudent({ id, name, lastName, address, description });

//   res.send(200);
// }));

api.patch('/:id', validateIdParam, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, lastName, address, description } = req.body;

  await updateStudent({ id, name, lastName, address, description });
  res.sendStatus(200);
}));

api.delete('/:id', validateIdParam, asyncHandler(async (req, res) => {
  const { id } = req.params;

  await deleteStudent(id);

  res.status(200).send(JSON.stringify({}));
}));

module.exports = api;
