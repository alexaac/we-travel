import { filterByDay, showErrors } from './helpers';
import { postData, getData } from './api';
import { updateUI } from './ui';
import { panToLatLon } from './map';

/* Global variables */
let projectData = {};

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

/* Initialize */
document.getElementById('start').min = new Date().toJSON().split('T')[0];
document.getElementById('start').valueAsDate = new Date();

const setActions = () => {
  // Personal API Key for OpenWeatherMap API and Mapbox
  const {
    weatherBaseUrl,
    weatherApiKey,
    mapboxBaseUrl,
    mapboxApiKey,
    geonamesBaseUrl,
    geonamesApiKey,
    pixabayBaseUrl,
    pixabayApiKey,
  } = projectData;

  /* Initialize MapBox map */
  mapboxgl.accessToken = mapboxApiKey;

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-122.11, 37.4], // starting position
    zoom: 5, // starting zoom
  });

  /* GET Data for the Project */
  const processData = async () => {
    const city = document.getElementById('city').value;
    const feelings = document.getElementById('feelings').value;
    const start = document.getElementById('start').value;

    /* Get Data from Geonames API*/
    const cityData = await getData(geonamesBaseUrl, {
      name: city,
      username: geonamesApiKey,
      maxRows: 10,
    });

    const cityInfo = cityData.geonames[0] && {
      lat: cityData.geonames[0].lat,
      lon: cityData.geonames[0].lng,
      country: cityData.geonames[0].countryName,
    };

    /* Get Data from Mapbox API*/
    const mapboxData = await getData(`${mapboxBaseUrl}${city}.json?`, {
      access_token: mapboxApiKey,
      autocomplete: 'true',
      proximity: `${cityInfo.lon}, ${cityInfo.lat}`,
    });
    if (city && cityInfo) panToLatLon(map, mapboxData);
    console.log(pixabayBaseUrl);
    /* Get Data from Pixabay API*/
    const pixabayData = await getData(pixabayBaseUrl, {
      key: pixabayApiKey,
      q: `${city} city`,
      category: 'travel',
      safesearch: 'true',
      image_type: 'photo',
      orientation: 'horizontal',
      min_width: 1200,
      min_height: 630,
    });

    /* Get Data from Weather API*/
    return getData(weatherBaseUrl, {
      units: 'I',
      lat: cityInfo && cityInfo.lat,
      lon: cityInfo && cityInfo.lon,
      key: weatherApiKey,
    }).then((data) => {
      const startDayData = filterByDay(data.data, start);

      console.log(pixabayData.hits[0]);
      // Update projectData and UI
      postData('/addData', {
        city: city,
        temperature:
          (startDayData[0] && startDayData[0].temp) ||
          data.error ||
          'The date is outside the 16 day forecast interval.',
        date: start,
        userResponse: feelings,
        photo: pixabayData.hits && pixabayData.hits[0],
      }).then((data) => updateUI(data));
    });
  };

  /* Event listener */
  document.getElementById('generate').addEventListener('click', processData);
};

export { showErrors, postData, getEnvData, setActions };
