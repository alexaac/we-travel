import { getDateDiff, filterByDay, showErrors, checkIsToday } from './helpers';
import { postData, getData } from './api';
import { updateUI } from './ui';
import { panToLatLon } from './map';

/* Global variables */
let projectData = {};

/* Initialize date input fields */
const initDates = () => {
  const startElem = document.getElementById('start');
  const endElem = document.getElementById('end');

  startElem.min = new Date().toJSON().split('T')[0];
  endElem.min = new Date().toJSON().split('T')[0];

  startElem.addEventListener('click', () => {
    startElem.style.color = 'inherit';
    endElem.value = '';
  });
  startElem.addEventListener('focusout', () => {
    endElem.min = startElem.value;
  });

  endElem.addEventListener('click', () => (endElem.style.color = 'inherit'));
};

initDates();

const setActions = () => {
  // Personal API Key for OpenWeatherMap API and Mapbox
  const {
    weatherBaseUrl,
    currWeatherBaseUrl,
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
    const now = new Date();

    const city = document.getElementById('city').value || 'Paris';
    const start =
      document.getElementById('start').value || now.toJSON().split('T')[0];
    const end = document.getElementById('end').value || start;

    /* Get Data from Geonames API*/
    const cityData = await getData(geonamesBaseUrl, {
      name: city,
      username: geonamesApiKey,
      maxRows: 10,
    });

    const cityInfo = cityData &&
      cityData.geonames &&
      cityData.geonames[0] && {
        lat: cityData.geonames[0].lat || -122.11,
        lon: cityData.geonames[0].lng || 37.4,
        country: cityData.geonames[0].countryName,
      };

    /* Get Data from Mapbox API*/
    const mapboxData = await getData(`${mapboxBaseUrl}${city}.json?`, {
      access_token: mapboxApiKey,
      autocomplete: 'true',
      proximity: `${cityInfo && cityInfo.lon}, ${cityInfo && cityInfo.lat}`,
    });

    if (city && cityInfo) panToLatLon(map, mapboxData);

    /* Get Data from Pixabay API*/
    let pixabayData = await getData(pixabayBaseUrl, {
      key: pixabayApiKey,
      q: `${city} city`,
      category: 'travel',
      safesearch: 'true',
      image_type: 'photo',
      orientation: 'horizontal',
      min_width: 1200,
      min_height: 630,
    });

    // Pull in an image for the country from Pixabay API when the entered location brings up no results
    if (pixabayData.total === 0) {
      pixabayData = await getData(pixabayBaseUrl, {
        key: pixabayApiKey,
        q: `${cityInfo && cityInfo.country} country`,
        category: 'travel',
        safesearch: 'true',
        image_type: 'photo',
        orientation: 'horizontal',
        min_width: 1200,
        min_height: 630,
      });
    }

    /* Get Data from Weather API*/
    // Check if forecast data includes 'today'
    let weatherData = await getData(weatherBaseUrl, {
      units: 'I',
      lat: cityInfo && cityInfo.lat,
      lon: cityInfo && cityInfo.lon,
      key: weatherApiKey,
    });

    let startDayData = filterByDay(weatherData.data, start);

    if (
      !(startDayData && startDayData[0] && startDayData[0].temp) &&
      checkIsToday(start)
    ) {
      // Check if current data includes 'today'; there are moments when
      // only previous day data can be received
      weatherData = await getData(currWeatherBaseUrl, {
        units: 'I',
        lat: cityInfo && cityInfo.lat,
        lon: cityInfo && cityInfo.lon,
        key: weatherApiKey,
      });

      startDayData = weatherData.data;
    }

    // Update projectData and UI
    return postData('/addData', {
      city,
      country: cityInfo && cityInfo.country,
      weather: startDayData && startDayData[0] && startDayData[0].weather,
      temperature:
        (startDayData && startDayData[0] && startDayData[0].temp) ||
        weatherData.error ||
        'The date is outside the 16 day forecast interval.',

      startDate: start,
      endDate: end,
      photo: pixabayData.hits && pixabayData.hits[0],
    }).then((data) => updateUI(data));
  };

  processData();

  /* Event listener */
  document.getElementById('generate').addEventListener('click', processData);
};

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

export { showErrors, postData, getEnvData, setActions };
