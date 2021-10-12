exports.getTrips = (req, res) => {
  res.sendFile('../dist/trips.html');
};

exports.getLastTripData = (req, res) => {
  res.send(lastTripData);
};

// POST request to add incoming data
exports.setLastTripData = (req, res) => {
  lastTripData = req.body;

  res.send(lastTripData);
};
