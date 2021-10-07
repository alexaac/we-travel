import { getData } from './api';
import { filterByDay, checkIsToday } from './helpers';

/* Get Data from Geonames API*/
const getLocationData = async (geonamesBaseUrl, geonamesApiKey, city) => {
  const data = await getData(geonamesBaseUrl, {
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
  const mapboxData = await getData(`${mapboxBaseUrl}${city}.json?`, {
    access_token: mapboxApiKey,
    autocomplete: 'true',
    proximity: `${cityInfo && cityInfo.lon}, ${cityInfo && cityInfo.lat}`,
  });

  return mapboxData;
};

/* Get Data from Pixabay API*/
const getPhotoData = async (pixabayBaseUrl, pixabayApiKey, city) => {
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
  let weatherData = await getData(weatherBaseUrl, {
    units: 'I',
    lat: cityInfo && cityInfo.lat,
    lon: cityInfo && cityInfo.lon,
    key: weatherApiKey,
  });

  let startDayData = filterByDay(weatherData.data, startDate);

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

  return [startDayData, weatherData];
};

export { getLocationData, getMapData, getPhotoData, getWeatherData };
