const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const tripsController = require('../controllers/tripsController');
const validateParams = require('../middleware/validateParams');
const validation = require('../middleware/validation');

router.get('/', function (req, res) {
  res.sendFile('../dist/index.html');
});

router.get('/trips', function (req, res) {
  res.sendFile('../dist/trips.html');
});

// GET request to receive projectData
router.get('/init', dataController.getProjectData);

// GET request to receive lastTripData
router.get('/getLastTrip', tripsController.getLastTripData);

// POST request to add incoming data
router.post(
  '/addLastTrip',
  [validateParams.setData, validation],
  tripsController.setLastTripData
);

module.exports = router;
