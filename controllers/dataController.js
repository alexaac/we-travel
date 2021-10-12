exports.getHomepage = (req, res) => {
  res.sendFile('../dist/index.html');
};

exports.getProjectData = (req, res) => {
  res.send(projectData);
};
