import { showErrors, initDates } from './helpers';
import { postData } from './api';
import { processData } from './data';
import { displayTrip, displayTrips } from './ui';

/* Global variables */
let projectData = {};
const parentId = document.getElementById('parent-id').value;
const defaultCity = 'Paris';

const setMenuToggle = () => {
  const navbar = document.getElementById('navbar-collapse');
  const navbarWrap = document.getElementById('navbar-collapse-wrap');
  const togglerButton = document.getElementById('navbar-toggler');

  togglerButton.addEventListener('click', () => {
    if (navbar.style.display === 'block') {
      navbar.style.display = 'none';
      navbarWrap.style.display = 'none';
    } else {
      navbar.style.display = 'block';
      navbarWrap.style.display = 'block';
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 576) {
      navbar.style.display = 'block';
      navbarWrap.style.display = 'block';
    } else {
      navbar.style.display = 'none';
      navbarWrap.style.display = 'none';
    }
  });
};

/* Set Actions */
const setActions = async () => {
  setMenuToggle();

  if (parentId === 'trips') {
    // we are on the trips page
    /* Show saved trips */
    displayTrips(parentId, projectData.maptilerApiKey);
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
      lastTripData = await processData(projectData, defaultCity);
    }

    // Clean error div, and update UI
    const errorDiv = document.getElementById('error');
    document.getElementById('error').innerHTML = '';
    displayTrip(parentId, projectData.maptilerApiKey, lastTripData);

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
          displayTrip(parentId, projectData.maptilerApiKey, lastTripData);
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
