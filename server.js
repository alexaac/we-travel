const path = require('path');
const bodyParser = require('body-parser');
// Require Express to run server and routes
const express = require('express');
const { check, validationResult } = require('express-validator');
// Cors for cross origin allowance
const cors = require('cors');

// Import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

// Setup empty JS object to act as endpoint for all routes
projectData = {};
urlData = {
  baseUrl: process.env.WEATHER_API,
  apiKey: process.env.WEATHER_APP_ID,
};

// console.log('Process: ', process.env);

// Start up an instance of app
const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); // we use the engine pug

// Initialize the main project folder
app.use(express.static(path.join(__dirname, 'website')));

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setup Server
app.set('port', process.env.PORT || 7000);
const server = app.listen(app.get('port'), () => {
  console.log('server running');
  console.log(`running on localhost: ${server.address().port}`);
});

// GET request to receive url
app.post('/', (req, res) => {
  res.send(urlData);
});

// GET request to receive projectData
app.get('/all', (req, res) => {
  res.send(projectData);
});

// POST request to add incoming data
app.post(
  '/addData',
  [
    // Methods for validating data
    check('temperature')
      .not()
      .isEmpty()
      .withMessage('Temperature must not be empty')
      .isDecimal(),
    check('date').not().isEmpty().withMessage('Date must not be empty'),
    check('date').isDate(),
    check('userResponse')
      .not()
      .isEmpty()
      .withMessage('Please provide a status'),
  ],
  (req, res) => {
    projectData.temperature = req.body.temperature;
    projectData.date = req.body.date;
    projectData.userResponse = req.body.userResponse;

    res.send(projectData);
  }
);
