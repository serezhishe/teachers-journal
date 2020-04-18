const { Router } = require('express');
const asyncHandler = require('express-async-handler')

const {
  getAll,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../services/student');

const {
  validateParam,
} = require('../utils/validator');

const validateIdParam = validateParam('id');

const api = Router();

api.get('/', asyncHandler(async (req, res) => {
  const students = await getAll();

  res.send(students)
}));

api.post('/', asyncHandler(async (req, res) => {
  const { type, name, lastName, address, description } = req.body;

  if (type === 'get') {
    const students = await getAll();

    res.status(200).send(students);
  } else {
    if (!name || !lastName) {
      res.sendStatus(400);
    } else {
      res.status(200).send(await createStudent({ name, lastName, address, description }));
    }
  }
}));

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
