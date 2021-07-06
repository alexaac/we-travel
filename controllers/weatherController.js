// Import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

urlData = {
  baseUrl: process.env.WEATHER_API,
  apiKey: process.env.WEATHER_APP_ID,
};

exports.getUrlData = (req, res) => {
  res.send(urlData);
};
