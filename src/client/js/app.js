/* Helpers */

// Get date difference in days
const getDateDiff = (start) => {
  const now = new Date();
  const startDate = new Date(start);

  return parseInt((startDate - now) / (24 * 3600 * 1000));
};

// Check today
const checkIsToday = (start) => {
  const now = new Date();
  const startDate = new Date(start);

  return startDate.toJSON().split('T')[0] === now.toJSON().split('T')[0];
};

// Make use choose a date in the future
document.getElementById('start').min = new Date().toJSON().split('T')[0];
document.getElementById('start').valueAsDate = new Date();

const showErrors = (errors) => {
  let errorString = '';

  errors.forEach((error) => {
    errorString =
      errorString + `${error.param} - ${error.msg}: '${error.value}'<br/> `;
  });

  document.getElementById('days').innerHTML = '';
  document.getElementById('temp').innerHTML = '';
  document.getElementById('content').innerHTML = '';
  document.getElementById('error').innerHTML = errorString;
};

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
// Setup empty JS object to act as endpoint for all routes
let projectData = {};

/* Function to get global variables */
const getEnvData = async () => {
  const request = await fetch('/all');

  try {
    const allData = await request.json();

    projectData = allData;

    setActions();
  } catch (error) {
    console.error('error', error);
  }
};

getEnvData();

const setActions = () => {
  // Personal API Key for OpenWeatherMap API and Mapbox
  const {
    weatherBaseUrl,
    weatherApiKey,
    mapboxBaseUrl,
    mapboxApiKey,
    geonamesBaseUrl,
    geonamesApiKey,
  } = projectData;

  /* MapBox map */
  mapboxgl.accessToken = mapboxApiKey;

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-122.11, 37.4], // starting position
    zoom: 5, // starting zoom
  });

  /* Function to get Geonames API Data*/
  const getInfoByCity = async (city) => {
    try {
      const url = `${geonamesBaseUrl}&name=${city}&username=${geonamesApiKey}`;
      const res = await fetch(url);
      const cityData = await res.json();

      cityInfo = cityData.geonames[0] && {
        lat: cityData.geonames[0].lat,
        lon: cityData.geonames[0].lng,
        country: cityData.geonames[0].countryName,
      };

      return cityInfo;
    } catch (error) {
      console.error('error', error);
    }
  };

  /* Function to get Weather API Data*/
  const getWeatherByLatLonDate = async (lat, lon, start) => {
    const now = new Date();

    const url = `${weatherBaseUrl}?units=I&lat=${lat}&lon=${lon}&key=${weatherApiKey}`;

    try {
      const res = await fetch(url);
      const weatherData = await res.json();

      return weatherData;
    } catch (error) {
      console.error('error', error);
    }
  };

  /* Function to pan map to zipcode */
  const panToLatLon = async (city, lat, lon) => {
    const url = `${mapboxBaseUrl}${city}.json?access_token=${mapboxApiKey}&autocomplete=trueproximity=${lon},${lat}`;
    const request = await fetch(url);

    try {
      const data = await request.json();

      if (data.features[0]) {
        const coords = data.features[0].geometry.coordinates;

        var el = document.createElement('div');
        el.className = 'marker';
        var marker = new mapboxgl.Marker(el).setLngLat(coords).addTo(map);

        map.flyTo({ center: coords, zoom: 12 });
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  /* Function to GET Project Data */
  const processData = async () => {
    const city = document.getElementById('city').value;
    const cityInfo = await getInfoByCity(city);
    const feelings = document.getElementById('feelings').value;
    const start = document.getElementById('start').value;

    if (city && cityInfo) panToLatLon(city, cityInfo.lat, cityInfo.lon);

    return getWeatherByLatLonDate(
      cityInfo && cityInfo.lat,
      cityInfo && cityInfo.lon,
      start
    ).then((data) => {
      const startDayData = data.data.filter((day) => {
        const dayDate = new Date(day.datetime.slice(0, 10))
          .toISOString()
          .split('T')[0];
        const startDate = new Date(start).toISOString().split('T')[0];
        console.log(data.data);
        console.log(day.datetime);
        console.log(start);

        console.log(dayDate);
        console.log(startDate);
        return dayDate === startDate;
      });

      postData('/addData', {
        city: city,
        temperature:
          (startDayData[0] && startDayData[0].temp) ||
          data.error ||
          'The date is outside the 16 day forecast interval.',
        date: start,
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

        const daysUntil = getDateDiff(allData.date);
        const isToday = checkIsToday(allData.date);

        document.getElementById('days').innerHTML = `${allData.city} trip is ${
          daysUntil === 0 && isToday
            ? 'today'
            : daysUntil === 0
            ? 'tomorrow'
            : daysUntil + 1 + ' days away'
        }`;
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
};
