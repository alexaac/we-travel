const express = require('express');
const router = express.Router();
const validateParams = require('../middleware/validateParams');
const validation = require('../middleware/validation');

// Import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

// Setup empty JS object to act as endpoint for all routes
projectData = {};
urlData = {
  baseUrl: process.env.WEATHER_API,
  apiKey: process.env.WEATHER_APP_ID,
};

// GET request to receive url
router.post('/', (req, res) => {
  res.send(urlData);
});

// GET request to receive projectData
router.get('/all', (req, res) => {
  res.send(projectData);
});

// POST request to add incoming data
router.post('/addData', [validateParams.addData, validation], (req, res) => {
  projectData.temperature = req.body.temperature;
  projectData.date = req.body.date;
  projectData.userResponse = req.body.userResponse;

  res.send(projectData);
});

module.exports = router;
