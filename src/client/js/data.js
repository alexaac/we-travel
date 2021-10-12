import { getLastTrip } from './api';
import { filterByDay, checkIsToday } from './helpers';

/* Get Data from Geonames API*/
const getLocationData = async (geonamesBaseUrl, geonamesApiKey, city) => {
  const data = await getLastTrip(geonamesBaseUrl, {
    name: city,
    username: geonamesApiKey,
    maxRows: 10,
  });

  const cityData = data &&
    data.geonames &&
    data.geonames[0] && {
      lat: data.geonames[0].lat || -122.11,
      lon: data.geonames[0].lng || 37.4,
      country: data.geonames[0].countryName,
    };

  return cityData;
};

/* Get Data from Mapbox API*/
const getMapData = async (mapboxBaseUrl, mapboxApiKey, city, cityInfo) => {
  const mapboxData = await getLastTrip(`${mapboxBaseUrl}${city}.json?`, {
    access_token: mapboxApiKey,
    autocomplete: 'true',
    proximity: `${cityInfo && cityInfo.lon}, ${cityInfo && cityInfo.lat}`,
  });

  return mapboxData;
};

/* Get Data from Pixabay API*/
const getPhotoData = async (pixabayBaseUrl, pixabayApiKey, city, cityInfo) => {
  let pixabayData = await getLastTrip(pixabayBaseUrl, {
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
    pixabayData = await getLastTrip(pixabayBaseUrl, {
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

  return pixabayData;
};

/* Get Data from Weather API*/
const getWeatherData = async (
  weatherBaseUrl,
  currWeatherBaseUrl,
  weatherApiKey,
  cityInfo,
  startDate
) => {
  // Check if forecast data includes 'today'
  let weatherData = await getLastTrip(weatherBaseUrl, {
    units: 'I',
    lat: cityInfo && cityInfo.lat,
    lon: cityInfo && cityInfo.lon,
    key: weatherApiKey,
  });

  let startDayData = filterByDay(weatherData.data, startDate);

  if (
    !(startDayData && startDayData[0] && startDayData[0].temp) &&
    checkIsToday(startDate)
  ) {
    // Check if current data includes 'today'; there are moments when
    // only previous day data can be received
    weatherData = await getLastTrip(currWeatherBaseUrl, {
      units: 'I',
      lat: cityInfo && cityInfo.lat,
      lon: cityInfo && cityInfo.lon,
      key: weatherApiKey,
    });

    startDayData = weatherData.data;
  }

  return [startDayData, weatherData];
};

const getLastTripBundle = async (projectData) => {
  // Personal API Keys
  const {
    weatherBaseUrl,
    currWeatherBaseUrl,
    weatherApiKey,
    geonamesBaseUrl,
    geonamesApiKey,
    pixabayBaseUrl,
    pixabayApiKey,
  } = projectData;

  const now = new Date();

  /* Get local storage data */
  let lastTripData =
    typeof localStorage !== 'undefined' &&
    (await localStorage.getItem('lastTrip'))
      ? JSON.parse(localStorage.getItem('lastTrip'))
      : {};

  const city =
    document.getElementById('city').value || lastTripData.city || 'Paris';
  const startDate =
    document.getElementById('start').value ||
    lastTripData.startDate ||
    now.toJSON().split('T')[0];
  const endDate =
    document.getElementById('end').value || lastTripData.endDate || startDate;

  /* Get Data from Geonames API*/
  const cityInfo = await getLocationData(geonamesBaseUrl, geonamesApiKey, city);

  /* Get Data from Pixabay API*/
  const pixabayData = await getPhotoData(
    pixabayBaseUrl,
    pixabayApiKey,
    city,
    cityInfo
  );

  /* Get Data from Weather API*/
  const [startDayData, weatherData] = await getWeatherData(
    weatherBaseUrl,
    currWeatherBaseUrl,
    weatherApiKey,
    cityInfo,
    startDate
  );

  return {
    city,
    cityInfo,
    weather: startDayData && startDayData[0] && startDayData[0].weather,
    temperature:
      (startDayData && startDayData[0] && startDayData[0].temp) ||
      weatherData.error ||
      'The date is outside the 16 day forecast interval.',
    startDate,
    endDate,
    photo: pixabayData.hits && pixabayData.hits[0],
  };
};

export {
  getLocationData,
  getMapData,
  getPhotoData,
  getWeatherData,
  getLastTripBundle,
};
