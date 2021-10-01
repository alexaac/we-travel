const path = require('path');
const bodyParser = require('body-parser');
// Require Express to run server and routes
const express = require('express');
// Cors for cross origin allowance
const cors = require('cors');
const validation = require('../../middleware/validation');
const routes = require('../../routes/index');

// Import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

// Setup JS object to act as endpoint for all routes
projectData = {
  geonamesBaseUrl: 'https://secure.geonames.org/searchJSON?',
  geonamesApiKey: process.env.GEONAMES_APP_ID,
  weatherBaseUrl: 'https://api.weatherbit.io/v2.0/forecast/daily?',
  weatherApiKey: process.env.WEATHER_APP_ID,
  currWeatherBaseUrl: 'https://api.weatherbit.io/v2.0/current?',
  mapboxBaseUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places/',
  mapboxApiKey: process.env.MAPBOX_API_KEY,
  pixabayBaseUrl: 'https://pixabay.com/api/?',
  pixabayApiKey: process.env.PIXABAY_API_KEY,
};

// Start up an instance of app
const app = express();

// Initialize the main project folder
app.use(express.static('dist'));

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

// Use validation
app.use(validation);

// Use routes
app.use('/', routes);
