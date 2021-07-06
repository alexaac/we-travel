// Personal API Key for OpenWeatherMap API
// api.openweathermap.org/data/2.5/weather?zip=94040,us&appid=98c5aefef4bc6527be76b6bf099592ad

/* Global Variables */

/* Helpers */
const getDate = () => {
  // Create a new date instance dynamically with JS
  let d = new Date();
  let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();
  return newDate;
};

/* Function to GET data */
const getData = async (url = '', data = {}) => {
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  try {
    const newData = await res.json();
    console.log(newData);

    return newData;
  } catch (error) {
    console.error('error', error);
  }
};

/* Function to GET Web API Data*/
const getWeatherByZipcode = (zipCode) =>
  postData('/', {}).then(async (data) => {
    try {
      const url = `${data.baseUrl + zipCode}&appid=${data.apiKey}`;
      const res = await fetch(url);
      const weatherData = res.json();

      return weatherData;
    } catch (error) {
      console.error('error', error);
    }
  });

/* Function to POST data */
const postData = async (url = '', data = {}) => {
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

    return newData;
  } catch (error) {
    console.error('error', error);
  }
};

/* Function to GET Project Data */
const processData = () => {
  const zipCode = document.getElementById('zip').value;
  const feelings = document.getElementById('feelings').value;

  return getWeatherByZipcode(zipCode).then((data) => {
    postData('/addData', {
      temperature: (data.main && data.main.temp) || data.message,
      date: getDate(),
      userResponse: feelings,
    }).then(updateUI());
  });
};

/* Function to update UI */
const updateUI = async () => {
  const request = await fetch('/all');
  try {
    const allData = await request.json();

    document.getElementById('date').innerHTML = allData.date;
    document.getElementById('temp').innerHTML = allData.temperature;
    document.getElementById('content').innerHTML = allData.userResponse;
  } catch (error) {
    console.error('error', error);
  }
};

/* Function called by event listener */
document.getElementById('generate').addEventListener('click', processData);
