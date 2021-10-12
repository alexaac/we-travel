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
    city,
    cityInfo,
    weather,
    temperature,
    startDate,
    endDate,
    photo,
  }).then((data) => data);
};

export { saveToMyStorage };
