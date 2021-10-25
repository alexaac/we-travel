import { getLastTrip } from './api';
import { filterByDay, checkIsToday, getDateDiff } from './helpers';
import { saveToMyStorage } from './storage';

/* GET Data for the Project */
const processData = async (projectData, defaultCity) => {
  const now = new Date();

  const city = document.getElementById('city').value || defaultCity;
  const startDate =
    document.getElementById('start').value || now.toJSON().split('T')[0];
  const endDate = document.getElementById('end').value || startDate;

  // Alert the user that won't receive weather data outside the forecast interval
  if (getDateDiff(new Date(), startDate) >= 15) {
    throw new Error('The start date is outside the 16 day forecast interval.');
  }

  const tripDataBundle = await getLastTripBundle(
    projectData,
    city,
    startDate,
    endDate
  );

  // Save trip details to lastTripData
  const lastTripData =
    tripDataBundle && (await saveToMyStorage(tripDataBundle));

  if (lastTripData && lastTripData.city) {
    localStorage.setItem('lastTrip', JSON.stringify(lastTripData));
  }

  return lastTripData;
};

/* Get Data from Geonames API*/
const getLocationData = async (geonamesBaseUrl, geonamesApiKey, city) => {
  const data = await getLastTrip(geonamesBaseUrl, {
    name: city,
    username: geonamesApiKey,
    maxRows: 10,
  });

  const locationData = data.data || data;

  // Throw error if no results
  if (
    locationData === undefined ||
    (locationData && locationData.totalResultsCount === 0)
  ) {
    throw new Error(`Couldn't find any city with this name.`);
  } else {
    const cityData = locationData &&
      locationData.geonames &&
      locationData.geonames[0] && {
        lat: locationData.geonames[0].lat || -122.11,
        lon: locationData.geonames[0].lng || 37.4,
        country: locationData.geonames[0].countryName,
      };

    return cityData;
  }
};

/* Get Data from Pixabay API*/
const getPhotoData = async (pixabayBaseUrl, pixabayApiKey, city, cityInfo) => {
  let data = await getLastTrip(pixabayBaseUrl, {
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
  if (data === undefined || (data && data.total === 0)) {
    data = await getLastTrip(pixabayBaseUrl, {
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

  const pixabayData = data.data || data;

  // Throw error if no results
  if (pixabayData === undefined || (pixabayData && pixabayData.total === 0)) {
    throw new Error(`Couldn't find any photo for this city or country.`);
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
  let data = await getLastTrip(weatherBaseUrl, {
    units: 'I', //TODO: add weather units option on form
    lat: cityInfo && cityInfo.lat,
    lon: cityInfo && cityInfo.lon,
    key: weatherApiKey,
  });

  let weatherData = data.data || data;

  // Throw error if no results/error
  if (weatherData === undefined) {
    throw new Error('Could retrieve no weather data for this location.');
  } else if (weatherData && weatherData.error) {
    throw new Error(weatherData.error);
  }

  let startDayData = filterByDay(weatherData, startDate);

  if (
    !(startDayData && startDayData[0] && startDayData[0].temp) &&
    checkIsToday(startDate)
  ) {
    // Check if current data includes 'today'; there are moments when
    // only previous day data can be received
    weatherData = await getLastTrip(currWeatherBaseUrl, {
      units: 'M',
      lat: cityInfo && cityInfo.lat,
      lon: cityInfo && cityInfo.lon,
      key: weatherApiKey,
    });

    startDayData = weatherData.data;
  }

  if (startDayData.length === 0) {
    throw new Error(`Couldn't find weather data for this date`);
  }

  return startDayData;
};

const getLastTripBundle = async (projectData, city, startDate, endDate) => {
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
  const startDayData = await getWeatherData(
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
    temperature: startDayData && startDayData[0] && startDayData[0].temp,
    startDate,
    endDate,
    photo: pixabayData.hits && pixabayData.hits[0],
  };
};

export {
  processData,
  getLocationData,
  getPhotoData,
  getWeatherData,
  getLastTripBundle,
};
