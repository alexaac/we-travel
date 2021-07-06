const express = require('express');
const router = express.Router();
const initialController = require('../controllers/initialController');
const dataController = require('../controllers/dataController');
const validateParams = require('../middleware/validateParams');
const validation = require('../middleware/validation');

// GET request to receive url
router.post('/', initialController.getEnvData);

// GET request to receive projectData
router.get('/all', dataController.getProjectData);

// POST request to add incoming data
router.post(
  '/addData',
  [validateParams.setData, validation],
  dataController.setProjectData
);

module.exports = router;
