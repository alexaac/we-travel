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
  const getWeatherByLatLon = async (lat, lon) => {
    try {
      const url = `${weatherBaseUrl}?units=I&lat=${lat}&lon=${lon}&key=${weatherApiKey}`;
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

    if (city && cityInfo) panToLatLon(city, cityInfo.lat, cityInfo.lon);

    return getWeatherByLatLon(
      cityInfo && cityInfo.lat,
      cityInfo && cityInfo.lon
    ).then((data) => {
      postData('/addData', {
        temperature: (data.data && data.data[0].temp) || data.error,
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
};
