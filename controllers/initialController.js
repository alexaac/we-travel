// Import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

envData = {
  weatherBaseUrl: process.env.WEATHER_API,
  weatherApiKey: process.env.WEATHER_APP_ID,
  mapboxBaseUrl: process.env.MAPBOX_API,
  mapboxApiKey: process.env.MAPBOX_API_KEY,
};

exports.getEnvData = (req, res) => {
  res.send(envData);
};
