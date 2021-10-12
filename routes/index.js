const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const tripsController = require('../controllers/tripsController');
const validateParams = require('../middleware/validateParams');
const validation = require('../middleware/validation');

// GET request to receive homepage
router.get('/', dataController.getHomepage);

// GET request to receive projectData
router.get('/init', dataController.getProjectData);

// GET request to receive saved trips
router.get('/trips', tripsController.getTrips);

// GET request to receive lastTripData
router.get('/getLastTrip', tripsController.getLastTripData);

// POST request to add incoming data
router.post(
  '/addLastTrip',
  [validateParams.setData, validation],
  tripsController.setLastTripData
);

module.exports = router;
