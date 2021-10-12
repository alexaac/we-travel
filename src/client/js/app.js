import { showErrors, initDates } from './helpers';
import { postData } from './api';
import { getLastTripBundle } from './data';
import { displayTrip, displayTrips, addTripDiv } from './ui';
import { saveToMyStorage } from './storage';

/* Global variables */
let projectData = {};
const parentId = document.getElementById('parent-id').value;

/* Set Actions */
const setActions = async () => {
  /* GET Data for the Project */
  const processData = async () => {
    const tripDataBundle = await getLastTripBundle(projectData);

    // Save trip details to lastTripData
    const lastTripData = await saveToMyStorage(tripDataBundle);

    if (lastTripData.city) {
      localStorage.setItem('lastTrip', JSON.stringify(lastTripData));
    }

    // Clean error div, and update UI
    document.getElementById('error').innerHTML = '';
    displayTrip(lastTripData, parentId, projectData.mapboxApiKey);
  };

  if (parentId === 'trips') {
    // we are on the trips page
    /* Show saved trips */
    displayTrips(parentId, projectData.mapboxApiKey);
  } else {
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
