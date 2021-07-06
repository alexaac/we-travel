// Personal API Key for OpenWeatherMap API
// api.openweathermap.org/data/2.5/weather?zip=94040,us&appid=98c5aefef4bc6527be76b6bf099592ad

/* Global Variables */

/* Helpers */
const getDate = () => {
  // Create a new date instance dynamically with JS
  let d = new Date();
  let newDate = `${d.toLocaleString('en-us', {
    weekday: 'long',
  })}, ${d.getDate()} ${d.toLocaleString('en-us', {
    month: 'long',
  })} ${d.getFullYear()}`;
  return newDate;
};

const showErrors = (errors) => {
  let errorString = '';

  errors.forEach((error) => {
    errorString =
      errorString + `${error.param} - ${error.msg}: '${error.value}'<br/> `;
  });

  document.getElementById('date').innerHTML = '';
  document.getElementById('temp').innerHTML = '';
  document.getElementById('content').innerHTML = '';
  document.getElementById('error').innerHTML = errorString;
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

    if (newData.errors) {
      showErrors(newData.errors);
    }

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
    }).then((data) => updateUI(data));
  });
};

/* Function to update UI */
const updateUI = async (data) => {
  if (data.errors) {
    showErrors(data.errors);
  } else {
    const request = await fetch('/all');
    try {
      const allData = await request.json();

      document.getElementById('date').innerHTML = allData.date;
      document.getElementById('temp').innerHTML = allData.temperature + '°F';
      document.getElementById('content').innerHTML =
        'You feel ' + allData.userResponse;
      document.getElementById('error').innerHTML = '';
    } catch (error) {
      console.error('error', error);
    }
  }
};

/* Function called by event listener */
document.getElementById('generate').addEventListener('click', processData);
