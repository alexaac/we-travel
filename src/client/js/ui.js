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

    const tripIds = Object.keys(tripsData);
    if (tripIds.length > 0) {
      document.getElementById(parentId).innerHTML = ``;

      const coords = {};

      Object.keys(tripsData)
        .sort(
          (a, b) =>
            getDateDiff(a.startDate, b.startDate) || a['city'] - b['city']
        )
        .forEach((tripId) => {
          const tripData = JSON.parse(tripsData[tripId]);

          addTripDiv(tripData, parentId, mapboxApiKey);

          coords[tripData.city] = [
            tripData.cityInfo.lon,
            tripData.cityInfo.lat,
          ];
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
        <div class="we-container bd lg">
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
                <p>Return: ${tripData.endDate} (${tripDuration} days)</p>
      
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
                <p>${tripData.city}, ${tripData.cityInfo.country} trip is ${
    daysUntil === 0 && isToday
      ? 'today'
      : daysUntil === 0
      ? 'tomorrow'
      : daysUntil + 1 + ' days away.'
  }</p>
                          <p>
                            Typical weather for then is:<br />
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

        tripsData[tripData.tripId] = JSON.stringify(tripData);
        typeof localStorage !== 'undefined' &&
          localStorage.setItem('trips', JSON.stringify(tripsData));

        document.getElementById(`removetrip-${tripId}`).disabled = false;
        this.disabled = true;
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

/* Update UI */
const displayTrip = async (data, parentId, mapboxApiKey) => {
  if (data && data.errors) {
    showErrors(data.errors);

    return 0;
  } else if (data) {
    const request = await fetch('/getLastTrip');
    try {
      const tripData = await request.json();

      if (tripData.tripId) {
        addTripDiv(tripData, parentId, mapboxApiKey);
        return 1;
      }
    } catch (error) {
      console.error('error', error);
      showErrors(error);

      return 0;
    }
  }
};

export { displayTrip, displayTrips, addTripDiv };
