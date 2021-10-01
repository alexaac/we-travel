/* Helpers */

// Get date difference in days
const getDateDiff = (start) => {
  const now = new Date();
  const startDate = new Date(start);

  return parseInt((startDate - now) / (24 * 3600 * 1000));
};

// Check today
const checkIsToday = (start) => {
  const now = new Date();
  const startDate = new Date(start);

  return startDate.toJSON().split('T')[0] === now.toJSON().split('T')[0];
};

// Filter By Day
const filterByDay = (data, start) =>
  data.filter((day) => {
    const dayDate = new Date(day.datetime.slice(0, 10))
      .toISOString()
      .split('T')[0];
    const startDate = new Date(start).toISOString().split('T')[0];

    return dayDate === startDate;
  });

const showErrors = (errors) => {
  let errorString = '';

  errors.forEach((error) => {
    errorString =
      errorString + `${error.param} - ${error.msg}: '${error.value}'<br/> `;
  });

  document.getElementById('days').innerHTML = '';
  document.getElementById('temp').innerHTML = '';
  document.getElementById('content').innerHTML = '';
  document.getElementById('error').innerHTML = errorString;
};

export { getDateDiff, checkIsToday, filterByDay, showErrors };
