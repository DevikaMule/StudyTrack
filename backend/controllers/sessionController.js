const store = require("../data/store");

// GET /api/sessions
const getSessions = (req, res) => {
  res.status(200).json({
    success: true,
    data: store.sessions
  });
};

// GET /api/sessions/:id
const getSessionById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const session = store.sessions.find((s) => s.id === id);

  if (!session) {
    return res.status(404).json({
      success: false,
      message: `Study session with ID ${id} not found`
    });
  }

  res.status(200).json({
    success: true,
    data: session
  });
};

// POST /api/sessions
const createSession = (req, res) => {
  const { subject, topic, date, startTime, duration } = req.body;

  if (!subject || subject.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Subject is required"
    });
  }

  if (!topic || topic.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Topic is required"
    });
  }

  if (!date) {
    return res.status(400).json({
      success: false,
      message: "Date is required"
    });
  }

  if (!startTime) {
    return res.status(400).json({
      success: false,
      message: "Start time is required"
    });
  }

  const parsedDuration = Number(duration);
  if (isNaN(parsedDuration) || parsedDuration <= 0) {
    return res.status(400).json({
      success: false,
      message: "Duration must be a number greater than 0"
    });
  }

  const newSession = {
    id: store.getNextSessionId(),
    subject: subject.trim(),
    topic: topic.trim(),
    date: date,
    startTime: startTime,
    duration: parsedDuration,
    completed: false
  };

  store.sessions.push(newSession);

  res.status(201).json({
    success: true,
    data: newSession
  });
};

// PUT /api/sessions/:id
const updateSession = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const sessionIndex = store.sessions.findIndex((s) => s.id === id);

  if (sessionIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Study session with ID ${id} not found`
    });
  }

  const { subject, topic, date, startTime, duration, completed } = req.body;

  if (!subject || subject.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Subject is required"
    });
  }

  if (!topic || topic.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Topic is required"
    });
  }

  if (!date) {
    return res.status(400).json({
      success: false,
      message: "Date is required"
    });
  }

  if (!startTime) {
    return res.status(400).json({
      success: false,
      message: "Start time is required"
    });
  }

  const parsedDuration = Number(duration);
  if (isNaN(parsedDuration) || parsedDuration <= 0) {
    return res.status(400).json({
      success: false,
      message: "Duration must be a number greater than 0"
    });
  }

  const updatedSession = {
    ...store.sessions[sessionIndex],
    subject: subject.trim(),
    topic: topic.trim(),
    date: date,
    startTime: startTime,
    duration: parsedDuration,
    completed: completed !== undefined ? Boolean(completed) : store.sessions[sessionIndex].completed
  };

  store.sessions[sessionIndex] = updatedSession;

  res.status(200).json({
    success: true,
    data: updatedSession
  });
};

// DELETE /api/sessions/:id
const deleteSession = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const sessionIndex = store.sessions.findIndex((s) => s.id === id);

  if (sessionIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Study session with ID ${id} not found`
    });
  }

  const deletedSession = store.sessions.splice(sessionIndex, 1)[0];

  res.status(200).json({
    success: true,
    data: deletedSession
  });
};

// PATCH /api/sessions/:id/complete
const completeSession = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const session = store.sessions.find((s) => s.id === id);

  if (!session) {
    return res.status(404).json({
      success: false,
      message: `Study session with ID ${id} not found`
    });
  }

  if (req.body && req.body.completed !== undefined) {
    session.completed = Boolean(req.body.completed);
  } else {
    session.completed = !session.completed;
  }

  res.status(200).json({
    success: true,
    data: session
  });
};

module.exports = {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  completeSession
};
