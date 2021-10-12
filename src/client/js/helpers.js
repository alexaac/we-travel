/* Helpers */

// Get date difference in days
const getDateDiff = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return parseInt((d2 - d1) / (24 * 3600 * 1000));
};

// Check today
const checkIsToday = (startDate) => {
  const now = new Date();
  const start = startDate && new Date(startDate.slice(0, 10));

  return start && start.toJSON().split('T')[0] === now.toJSON().split('T')[0];
};

// Filter By Day
const filterByDay = (data, start) =>
  data &&
  data[0] &&
  data.filter((day) => {
    const dayDate = new Date(day.datetime.slice(0, 10))
      .toISOString()
      .split('T')[0];
    const startDate = new Date(start).toISOString().split('T')[0];

    return dayDate === startDate;
  });

const showErrors = (errors) => {
  let errorString = '';

  if (errors.stack) {
    const errorDetails = {
      message: errors.message,
      status: errors.status,
      stackHighlighted: errors.stack.replace(
        /[a-z_-\d]+.js:\d+:\d+/gi,
        '<mark>$&</mark>'
      ),
    };
    errorString = errorDetails.message;
  } else if (typeof errors === String) {
    errorString = errors;
  } else if (errors && errors[0]) {
    errors.forEach((error) => {
      errorString =
        errorString + `${error.param} - ${error.msg}: '${error.value}'<br/> `;
    });
  } else {
    errorString = errorString + errors.msg || errors.message;
  }

  document.getElementById('error').innerHTML = errorString;
};

// Get icons by weather code
const getWeatherIcons = (weatherCode) => {
  const codesList = {
    200: ['t01d', 't01n'],
    201: ['t02d', 't02n'],
    202: ['t03d', 't03n'],
    230: ['t04d', 't04n'],
    231: ['t04d', 't04n'],
    232: ['t04d', 't04n'],
    233: ['t05d', 't05n'],
    300: ['d01d', 'd01n'],
    301: ['d02d', 'd02n'],
    302: ['d03d', 'd03n'],
    500: ['r01d', 'r01n'],
    501: ['r02d', 'r02n'],
    502: ['r03d', 'r03n'],
    511: ['f01d', 'f01n'],
    520: ['r04d', 'r04n'],
    521: ['r05d', 'r05n'],
    522: ['r06d', 'r06n'],
    600: ['s01d', 's01n'],
    601: ['s02d', 's02n'],
    602: ['s03d', 's03n'],
    610: ['s04d', 's04n'],
    611: ['s05d', 's05n'],
    612: ['s05d', 's05n'],
    621: ['s01d', 's01n'],
    622: ['s02d', 's02n'],
    623: ['s06d', 's06n'],
    700: ['a01d', 'a01n'],
    711: ['a02d', 'a02n'],
    721: ['a03d', 'a03n'],
    731: ['a04d', 'a04n'],
    741: ['a05d', 'a05n'],
    800: ['c01d', 'c01n'],
    801: ['c02d', 'c02n'],
    802: ['c02d', 'c02n'],
    803: ['c03d', 'c03n'],
    804: ['c04d', 'c04n'],
    900: ['u00d', 'u00n'],
  };

  return codesList[weatherCode];
};

/* Initialize date input fields */
const initDates = () => {
  const startDate = document.getElementById('start');
  const endDate = document.getElementById('end');

  startDate.min = new Date().toJSON().split('T')[0];
  endDate.min = new Date().toJSON().split('T')[0];

  startDate.addEventListener('click', () => {
    startDate.style.color = 'inherit';
  });
  startDate.addEventListener('focusout', () => {
    endDate.min = startDate.value;
  });

  endDate.addEventListener('click', () => (endDate.style.color = 'inherit'));
};

const toProperCase = (str) => {
  return str
    .trim()
    .split(' ')
    .map((w) => (w[0] ? w[0].toUpperCase() + w.substr(1).toLowerCase() : ''))
    .join(' ');
};

export {
  getDateDiff,
  checkIsToday,
  filterByDay,
  showErrors,
  getWeatherIcons,
  initDates,
  toProperCase,
};
