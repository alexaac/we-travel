import { toProperCase } from './helpers';

const math = require('mathjs');

const saveToMyStorage = ({
  city,
  cityInfo,
  weather,
  temperature,
  startDate,
  endDate,
  photo,
}) => {
  const tripId = city
    ? `${city.toLowerCase()}-${startDate}-${endDate}`
    : undefined;

  return postData('/addLastTrip', {
    tripId,
    city: toProperCase(city),
    cityInfo,
    weather,
    temperature,
    startDate,
    endDate,
    photo,
  }).then((data) => data);
};

export { saveToMyStorage };
