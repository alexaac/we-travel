import { showErrors, initDates } from './helpers';
import { postData } from './api';
import { processData } from './data';
import { displayTrip, displayTrips } from './ui';

/* Global variables */
let projectData = {};
const parentId = document.getElementById('parent-id').value;

/* Set Actions */
const setActions = async () => {
  if (parentId === 'trips') {
    // we are on the trips page
    /* Show saved trips */
    displayTrips(parentId, projectData.mapboxApiKey);
  } else if (parentId === 'last-trip') {
    // we are on homepage
    /* Initialize date input fields */
    initDates();

    // Front page initial display

    /* Get local storage data */
    let lastTripData =
      typeof localStorage !== 'undefined' &&
      (await localStorage.getItem('lastTrip'))
        ? JSON.parse(localStorage.getItem('lastTrip'))
        : {};

    if (!lastTripData.city) {
      lastTripData = processData(projectData);
    }

    // Clean error div, and update UI
    const errorDiv = document.getElementById('error');
    document.getElementById('error').innerHTML = '';
    displayTrip(lastTripData, parentId, projectData.mapboxApiKey);

    /* Event listener */
    document
      .getElementById('main-form')
      .addEventListener('submit', async function (e) {
        e.preventDefault();

        document.getElementById(parentId).innerHTML = '';

        try {
          const lastTripData = await processData(projectData);

          // Clean error div, and update UI
          const errorDiv = document.getElementById('error');
          document.getElementById('error').innerHTML = '';
          displayTrip(lastTripData, parentId, projectData.mapboxApiKey);
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
