exports.getProjectData = (req, res) => {
  res.send(projectData);
};

// POST request to add incoming data
exports.setProjectData = (req, res) => {
  projectData = req.body;

  res.send(projectData);
};
