import { showErrors, initDates } from './helpers';
import { postData } from './api';
import {
  getLocationData,
  getMapData,
  getPhotoData,
  getWeatherData,
} from './data';
import { updateUI } from './ui';
import { panToLatLon } from './map';

/* Global variables */
let projectData = {};

/* Initialize date input fields */

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
    const startDate =
      document.getElementById('start').value || now.toJSON().split('T')[0];
    const endDate = document.getElementById('end').value || startDate;

    /* Get Data from Geonames API*/
    const cityInfo = await getLocationData(
      geonamesBaseUrl,
      geonamesApiKey,
      city
    );
    console.log(cityInfo);

    /* Get Data from Mapbox API*/
    const mapboxData = await getMapData(
      mapboxBaseUrl,
      mapboxApiKey,
      city,
      cityInfo
    );

    /* Center map on location */
    if (city && cityInfo) panToLatLon(map, mapboxData);

    /* Get Data from Pixabay API*/
    const pixabayData = await getPhotoData(pixabayBaseUrl, pixabayApiKey, city);

    /* Get Data from Weather API*/
    const [startDayData, weatherData] = await getWeatherData(
      weatherBaseUrl,
      currWeatherBaseUrl,
      weatherApiKey,
      cityInfo,
      startDate
    );

    // Update projectData and UI
    return postData('/addData', {
      city,
      country: cityInfo && cityInfo.country,
      weather: startDayData && startDayData[0] && startDayData[0].weather,
      temperature:
        (startDayData && startDayData[0] && startDayData[0].temp) ||
        weatherData.error ||
        'The date is outside the 16 day forecast interval.',

      startDate,
      endDate,
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
