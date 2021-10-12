import { showErrors, initDates, getDateDiff } from './helpers';
import { postData } from './api';
import { getLastTripBundle } from './data';
import { displayTrip, displayTrips } from './ui';
import { saveToMyStorage } from './storage';

/* Global variables */
let projectData = {};
const parentId = document.getElementById('parent-id').value;

/* Set Actions */
const setActions = async () => {
  /* GET Data for the Project */
  const processData = async () => {
    const now = new Date();

    /* Get local storage data */
    let lastTripData =
      typeof localStorage !== 'undefined' &&
      (await localStorage.getItem('lastTrip'))
        ? JSON.parse(localStorage.getItem('lastTrip'))
        : {};

    const city =
      document.getElementById('city').value || lastTripData.city || 'Paris';
    const startDate =
      document.getElementById('start').value ||
      lastTripData.startDate ||
      now.toJSON().split('T')[0];
    const endDate =
      document.getElementById('end').value || lastTripData.endDate || startDate;

    // Alert the user that won't receive weather data outside the forecast interval
    if (getDateDiff(new Date(), startDate) >= 15) {
      throw new Error(
        'The start date is outside the 16 day forecast interval.'
      );
    }

    const tripDataBundle = await getLastTripBundle(
      projectData,
      city,
      startDate,
      endDate
    );

    // Save trip details to lastTripData
    lastTripData = tripDataBundle && (await saveToMyStorage(tripDataBundle));

    if (lastTripData && lastTripData.city) {
      localStorage.setItem('lastTrip', JSON.stringify(lastTripData));

      // Clean error div, and update UI
      const errorDiv = document.getElementById('error');
      document.getElementById('error').innerHTML = '';
      displayTrip(lastTripData, parentId, projectData.mapboxApiKey);
    }
  };

  if (parentId === 'trips') {
    // we are on the trips page
    /* Show saved trips */
    displayTrips(parentId, projectData.mapboxApiKey);
  } else if (parentId === 'last-trip') {
    // we are on homepage
    /* Initialize date input fields */
    initDates();

    // Front page initial display
    const lastTripData = await processData();

    /* Event listener */
    document
      .getElementById('main-form')
      .addEventListener('submit', async function (e) {
        e.preventDefault();

        document.getElementById(parentId).innerHTML = '';

        try {
          const lastTripData = await processData();
        } catch (error) {
          console.error('error', error);
          showErrors(error);
        }
      });
  }
};

const getEnvData = async () => {
  const request = await fetch('/init');

  try {
    const initData = await request.json();

    projectData = initData;

    setActions();
  } catch (error) {
    console.error('error', error);
    showErrors(error);
  }
};

getEnvData();

export { showErrors, postData, getEnvData, setActions };
