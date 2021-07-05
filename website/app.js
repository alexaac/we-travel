// Personal API Key for OpenWeatherMap API
// api.openweathermap.org/data/2.5/weather?zip=94040,us&appid=98c5aefef4bc6527be76b6bf099592ad

/* Global Variables */
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const zipCode = document.getElementById('zip').value;
const apiKey = '98c5aefef4bc6527be76b6bf099592ad';

const feelings = document.getElementById('feelings').value;

/* Helpers */
const getDate = () => {
  // Create a new date instance dynamically with JS
  let d = new Date();
  let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();
  return newDate;
};

/* Function to GET Web API Data*/
const getWeatherByZipcode = async (baseUrl, zipCode, apiKey) => {
  const url = `${baseUrl + zipCode}&appid=${apiKey}`;
  const res = await fetch(url);

  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

/* Function to POST data */
const postData = async (url = '', data = {}) => {
  console.log(data);
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  try {
    const newData = await res.json();
    console.log(newData);

    return newData;
  } catch (error) {
    console.log('error', error);
  }
};

/* Function to GET Project Data */
const callGetData = () => {
  return getWeatherByZipcode(baseUrl, zipCode, apiKey).then((data) => {
    postData('/addData', {
      zipCode: data.main.temp,
      date: getDate(),
      userResponse: feelings,
    });
  });
};

/* Function called by event listener */
document.getElementById('generate').addEventListener('click', callGetData);
