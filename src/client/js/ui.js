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

      document.getElementById('tripinfo').innerHTML = `
        <strong>My trip to: ${allData.city}, ${allData.country}</strong><br />
        <strong>Departing: ${allData.date}</strong><br />

        <button class="we-btn we-btn-primary" id="savetrip" type="submit">Save</button>
        <button class="we-btn we-btn-primary" id="removetrip" type="submit" disabled>Remove</button><br />

        ${allData.city}, ${allData.country} trip is ${
        daysUntil === 0 && isToday
          ? 'today'
          : daysUntil === 0
          ? 'tomorrow'
          : daysUntil + 1 + ' days away'
      }<br /><br />

        Typical weather for then is: <br />
        ${allData.temperature}°F ${allData.weather}
      `;
      document.getElementById('error').innerHTML = '';
      document.getElementById(
        'photo'
      ).innerHTML = `<img src=${allData.photo.webformatURL} width="480">`;
    } catch (error) {
      console.error('error', error);
    }
  }
};

export { updateUI };
