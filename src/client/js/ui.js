import {
  getDateDiff,
  checkIsToday,
  showErrors,
  getWeatherIcons,
} from './helpers';

/* Update UI */
const updateUI = async (data) => {
  if (data.errors) {
    showErrors(data.errors);
  } else {
    const request = await fetch('/all');
    try {
      const allData = await request.json();

      const daysUntil = getDateDiff(new Date(), allData.startDate);
      const tripDuration = getDateDiff(allData.startDate, allData.endDate);
      const isToday = checkIsToday(allData.startDate);
      const weatherIcons = getWeatherIcons(allData.weather.code);

      document.getElementById('tripinfo').innerHTML = `
        <h5>My trip to: ${allData.city}, ${allData.country}</h5>
        <p>Departing: ${allData.startDate}</p>
        <p>Return: ${allData.endDate} (${tripDuration} days)</p>

        <button
          class="we-btn we-btn-primary we-btn-sm"
          id="savetrip"
          type="submit"
        >
          Save
        </button>

        <button
          class="we-btn we-btn-primary we-btn-sm"
          id="removetrip"
          type="submit"
          disabled
        >
          Remove</button
        ><br />
        <p>${allData.city}, ${allData.country} trip is ${
        daysUntil === 0 && isToday
          ? 'today'
          : daysUntil === 0
          ? 'tomorrow'
          : daysUntil + 1 + ' days away.'
      }</p>
        <p>
          Typical weather for then is:<br />
          <span class="helper-text">${allData.temperature}°F ${
        allData.weather.description
      }</span>
      <img alt="${
        allData.weather.description
      }" style="" src="https://mps-ph.s3.us-east-2.amazonaws.com/we/icons/${
        weatherIcons[0]
      }.png" width="50" height="50">
      <img alt="${
        allData.weather.description
      }" style="" src="https://mps-ph.s3.us-east-2.amazonaws.com/we/icons/${
        weatherIcons[1]
      }.png" width="50" height="50">
        </p>
      `;

      document.getElementById('error').innerHTML = '';
      document.getElementById('photo').innerHTML = `
        <img
          src=${allData.photo.webformatURL}
          alt="Cheile Aiudului 3D Map WebGL"
          srcset="
            ${allData.photo.previewURL}  576w,
            ${allData.photo.webformatURL}  992w,
            ${allData.photo.largeImageURL} 1200w
          "
          class="post-img photo"
        />
      `;
    } catch (error) {
      console.error('error', error);
    }
  }
};

export { updateUI };
