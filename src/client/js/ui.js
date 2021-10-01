import { getDateDiff, checkIsToday, showErrors } from './helpers';

/* Update UI */
const updateUI = async (data) => {
  if (data.errors) {
    showErrors(data.errors);
  } else {
    const request = await fetch('/all');
    try {
      const allData = await request.json();

      const daysUntil = getDateDiff(allData.date);
      const isToday = checkIsToday(allData.date);

      document.getElementById('days').innerHTML = `${allData.city} trip is ${
        daysUntil === 0 && isToday
          ? 'today'
          : daysUntil === 0
          ? 'tomorrow'
          : daysUntil + 1 + ' days away'
      }`;
      document.getElementById('temp').innerHTML = allData.temperature + '°F';
      document.getElementById('content').innerHTML =
        'You feel ' + allData.userResponse;
      document.getElementById('error').innerHTML = '';
    } catch (error) {
      console.error('error', error);
    }
  }
};

export { updateUI };
