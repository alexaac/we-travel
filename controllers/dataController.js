exports.getProjectData = (req, res) => {
  res.send(projectData);
};

// POST request to add incoming data
exports.setProjectData = (req, res) => {

  projectData.city = req.body.city;
  projectData.temperature = req.body.temperature;
  projectData.date = req.body.date;
  projectData.userResponse = req.body.userResponse;
  projectData.photo = req.body.photo;

  res.send(projectData);
};
