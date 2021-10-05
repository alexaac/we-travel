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
        <h4>My trip to: ${allData.city}, ${allData.country}</h4>
        <h5>Departing: ${allData.date}</h5>
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
          ${allData.temperature}°F ${allData.weather}
        </p>
      `;
      console.log(allData.photo);
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
          class="post-img"
        />
      `;
    } catch (error) {
      console.error('error', error);
    }
  }
};

export { updateUI };
