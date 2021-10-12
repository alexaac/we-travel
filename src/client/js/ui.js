import {
  getDateDiff,
  checkIsToday,
  showErrors,
  getWeatherIcons,
} from './helpers';
import { showMarker, showMarkers } from './map';

const displayTrips = async (parentId, mapboxApiKey) => {
  if (parentId === 'trips') {
    /* Get local storage data */
    let tripsData =
      typeof localStorage !== 'undefined' &&
      (await localStorage.getItem('trips'))
        ? JSON.parse(localStorage.getItem('trips'))
        : {};

    const tripsIds = Object.keys(tripsData);
    const tripsCount = tripsIds.length;

    if (tripsCount > 0) {
      document.getElementById(
        parentId
      ).innerHTML = `You have ${tripsCount} saved trips.`;

      const coords = {};
      const expired = [];

      tripsIds
        .sort((a, b) =>
          getDateDiff(
            JSON.parse(tripsData[b]).startDate,
            JSON.parse(tripsData[a]).startDate
          )
        )
        .forEach((tripId) => {
          const tripData = JSON.parse(tripsData[tripId]);

          const daysUntil = getDateDiff(new Date(), tripData.startDate);

          if (daysUntil < 0) {
            expired.push(tripData);
          } else {
            addTripDiv(tripData, parentId, mapboxApiKey);
          }

          coords[tripData.city] = [
            tripData.cityInfo.lon,
            tripData.cityInfo.lat,
          ];
        });

      expired.forEach((tripData) => {
        addTripDiv(tripData, parentId, mapboxApiKey);
      });

      /* Center map on locations */
      showMarkers(coords, mapboxApiKey);
    }
  }
};

const checkAlreadySaved = async (tripId) => {
  let alreadySaved = 0;

  if (tripId) {
    /* Get local storage data */
    let tripsData =
      typeof localStorage !== 'undefined' &&
      (await localStorage.getItem('trips'))
        ? JSON.parse(localStorage.getItem('trips'))
        : {};

    const checkTripId = (currentId) => {
      return currentId === tripId;
    };

    // check if the trip has been already saved by id
    if (tripsData) {
      return Object.keys(tripsData).find(checkTripId);
    }
  }

  return alreadySaved;
};

const addTripDiv = async (tripData, parentId, mapboxApiKey) => {
  const tripId = tripData.tripId;
  const alreadySaved = await checkAlreadySaved(tripData.tripId);

  const daysUntil = getDateDiff(new Date(), tripData.startDate);

  const tripDuration = getDateDiff(tripData.startDate, tripData.endDate);
  const isToday = checkIsToday(tripData.startDate);
  const weatherIcons = getWeatherIcons(tripData.weather.code);

  const parentDiv = document.getElementById(parentId);
  const tripDiv = document.createElement('div');
  tripDiv.id = tripId || math.floor(math.random() * 100);
  parentDiv.appendChild(tripDiv);

  document.getElementById(tripId).innerHTML = `
        <div class="we-container bd lg ${daysUntil < 0 ? 'expired' : ''}">
          <div class="we-post-grid inversed">
            <div class="img-link we-inline-block">
              <div id="photo" class="post-img-wrap pointer-events-none">
                <img
                  src=${tripData.photo.webformatURL}
                  alt="Cheile Aiudului 3D Map WebGL"
                  srcset="
                    ${tripData.photo.previewURL}  576w,
                    ${tripData.photo.webformatURL}  992w,
                    ${tripData.photo.largeImageURL} 1200w
                  "
                  class="post-img photo"
                />
              </div>
            </div>
            <div class="we-post-info-flex">
              <div class="mapholder">
                <div id="map-${tripId}" class="map"></div>
              </div>
              <div class="we-post-link">
              <div id="trip-${tripId}">
                <h5>My trip to: ${tripData.city}, ${
    tripData.cityInfo.country
  }</h5>
                <span class="helper-text">${
                  alreadySaved ? 'saved trip' : ''
                }</span>
                <p>Departing: ${tripData.startDate}</p>
                <p>Return: ${tripData.endDate} (${
    tripDuration > 0 ? tripDuration + ' days' : 'same day'
  })</p>
      
                <button
                  class="we-btn we-btn-primary we-btn-sm"
                  id="savetrip-${tripId}"
                  value="${tripId}"
                  type="submit"
                >
                  Save
                </button>
      
                <button
                  class="we-btn we-btn-primary we-btn-sm"
                  id="removetrip-${tripId}"
                  value="${tripId}"
                  type="submit"
                  disabled
                >
                  Remove</button
                ><br />
                <p>${tripData.city}, ${tripData.cityInfo.country} trip ${
    daysUntil === 0 && isToday
      ? 'is today'
      : daysUntil === 0
      ? 'is tomorrow'
      : daysUntil < 0
      ? 'was ' + Math.abs(daysUntil) + ' days ago.'
      : 'is ' + (daysUntil + 1) + ' days away.'
  }</p>
                          <p>
                            Typical weather for then ${
                              daysUntil < 0 ? 'was' : 'is'
                            }:<br />
                            <span class="helper-text">${
                              tripData.temperature
                            }°F ${tripData.weather.description}</span>
                        <img alt="${
                          tripData.weather.description
                        }" style="" src="https://mps-ph.s3.us-east-2.amazonaws.com/we/icons/${
    weatherIcons[0]
  }.png" width="50" height="50">
                        <img alt="${
                          tripData.weather.description
                        }" style="" src="https://mps-ph.s3.us-east-2.amazonaws.com/we/icons/${
    weatherIcons[1]
  }.png" width="50" height="50">
                </p>
              </div>
                <div id="content"></div>
              </div>
            </div>
          </div>
        </div>
      `;

  /* Disable save button on already saved trips */
  if (alreadySaved) {
    document.getElementById(`savetrip-${tripId}`).disabled = true;
    document.getElementById(`removetrip-${tripId}`).disabled = false;
  }

  /* Save / Remove trip from local storage */
  document
    .getElementById(`savetrip-${tripId}`)
    .addEventListener('click', async function () {
      const tripId = this.value;

      if (tripData.city) {
        /* Get local storage data */
        let tripsData =
          typeof localStorage !== 'undefined' &&
          (await localStorage.getItem('trips'))
            ? JSON.parse(localStorage.getItem('trips'))
            : {};

        const tripsIds = Object.keys(tripsData);
        const tripsCount = tripsIds.length;

        if (1) {
          tripsData[tripData.tripId] = JSON.stringify(tripData);
          typeof localStorage !== 'undefined' &&
            localStorage.setItem('trips', JSON.stringify(tripsData));

          document.getElementById(`removetrip-${tripId}`).disabled = false;
          this.disabled = true;
        } else {
          showErrors('You have reached the maximum limit of 100 saved trips.');
          throw new Error(
            'You have reached the maximum limit of 100 saved trips.'
          );
        }
      }
    });

  document
    .getElementById(`removetrip-${tripId}`)
    .addEventListener('click', async function () {
      const tripId = this.value;

      if (tripId) {
        /* Get local storage data */
        let tripsData =
          typeof localStorage !== 'undefined' &&
          (await localStorage.getItem('trips'))
            ? JSON.parse(localStorage.getItem('trips'))
            : {};

        delete tripsData[tripId];
        typeof localStorage !== 'undefined' &&
          localStorage.setItem('trips', JSON.stringify(tripsData));

        document.getElementById(`savetrip-${tripId}`).disabled = false;
        this.disabled = true;

        //TODO: maybe reload page after removing trip
      }
    });

  /* Center map on location */
  showMarker(
    tripId,
    [tripData.cityInfo.lon, tripData.cityInfo.lat],
    mapboxApiKey
  );
};

/* Update input fields based on last visited city */
const updateInputs = (tripData) => {
  const city = document.getElementById('city');
  const startDate = document.getElementById('start');
  const endDate = document.getElementById('end');

  city.value = tripData.city;

  startDate.value = tripData.startDate;
  startDate.style.color = 'inherit';

  endDate.value = tripData.endDate;
  endDate.style.color = 'inherit';
};

/* Update UI */
const displayTrip = async (tripData, parentId, mapboxApiKey) => {
  if (tripData && tripData.errors) {
    showErrors(tripData.errors);

    return 0;
  } else if (tripData) {
    if (tripData.tripId) {
      addTripDiv(tripData, parentId, mapboxApiKey);

      updateInputs(tripData);

      return 1;
    }
  }
};

export { displayTrip, displayTrips, addTripDiv };
