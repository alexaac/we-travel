// Personal API Key for OpenWeatherMap API
// api.openweathermap.org/data/2.5/weather?zip=94040,us&appid=98c5aefef4bc6527be76b6bf099592ad
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const zipCode = document.getElementById('zip').value;
const apiKey = '98c5aefef4bc6527be76b6bf099592ad';

console.log('-------------------------');

const callGetData = () => {
  return getWeatherByZipcode(baseUrl, zipCode, apiKey);
};

// Event listener to get new input
const getWeatherByZipcode = async (baseUrl, zipCode, apiKey) => {
  const url = `${baseUrl + zipCode}&appid=${apiKey}`;
  const res = await fetch(url);

  try {
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

document.getElementById('generate').addEventListener('click', callGetData);

/* Function called by event listener */

/* Function to GET Web API Data*/

/* Function to POST data */

/* Function to GET Project Data */

/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();
