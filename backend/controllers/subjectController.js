const store = require("../data/store");

// GET /api/subjects
const getSubjects = (req, res) => {
  res.status(200).json({
    success: true,
    data: store.subjects
  });
};

// GET /api/subjects/:id
const getSubjectById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const subject = store.subjects.find((s) => s.id === id);

  if (!subject) {
    return res.status(404).json({
      success: false,
      message: `Subject with ID ${id} not found`
    });
  }

  res.status(200).json({
    success: true,
    data: subject
  });
};

// POST /api/subjects
const createSubject = (req, res) => {
  const { name, description, progress } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Subject name is required"
    });
  }

  const parsedProgress = progress !== undefined ? Number(progress) : 0;
  if (isNaN(parsedProgress) || parsedProgress < 0 || parsedProgress > 100) {
    return res.status(400).json({
      success: false,
      message: "Progress must be a number between 0 and 100"
    });
  }

  const newSubject = {
    id: store.getNextSubjectId(),
    name: name.trim(),
    description: description ? description.trim() : "",
    progress: parsedProgress
  };

  store.subjects.push(newSubject);

  res.status(201).json({
    success: true,
    data: newSubject
  });
};

// PUT /api/subjects/:id
const updateSubject = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const subjectIndex = store.subjects.findIndex((s) => s.id === id);

  if (subjectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Subject with ID ${id} not found`
    });
  }

  const { name, description, progress } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Subject name is required"
    });
  }

  const parsedProgress = progress !== undefined ? Number(progress) : store.subjects[subjectIndex].progress;
  if (isNaN(parsedProgress) || parsedProgress < 0 || parsedProgress > 100) {
    return res.status(400).json({
      success: false,
      message: "Progress must be a number between 0 and 100"
    });
  }

  const updatedSubject = {
    ...store.subjects[subjectIndex],
    name: name.trim(),
    description: description !== undefined ? description.trim() : store.subjects[subjectIndex].description,
    progress: parsedProgress
  };

  store.subjects[subjectIndex] = updatedSubject;

  res.status(200).json({
    success: true,
    data: updatedSubject
  });
};

// DELETE /api/subjects/:id
const deleteSubject = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const subjectIndex = store.subjects.findIndex((s) => s.id === id);

  if (subjectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Subject with ID ${id} not found`
    });
  }

  const deletedSubject = store.subjects.splice(subjectIndex, 1)[0];

  res.status(200).json({
    success: true,
    data: deletedSubject
  });
};

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
};
