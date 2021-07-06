// Setup empty JS object to act as endpoint for all routes
projectData = {};

exports.getProjectData = (req, res) => {
  res.send(projectData);
};

// POST request to add incoming data
exports.setProjectData = (req, res) => {
  projectData.temperature = req.body.temperature;
  projectData.date = req.body.date;
  projectData.userResponse = req.body.userResponse;

  res.send(projectData);
};
