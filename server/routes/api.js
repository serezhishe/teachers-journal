const { Router } = require('express');
const subjectsApi = require('./subjects');
const studentsApi = require('./students');

const api = Router();

api.use('/subjects', subjectsApi);
api.use('/students', studentsApi);

module.exports = api;
