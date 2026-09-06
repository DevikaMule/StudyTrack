const store = require("../data/store");

// GET /api/tasks
const getTasks = (req, res) => {
  res.status(200).json({
    success: true,
    data: store.tasks
  });
};

// GET /api/tasks/:id
const getTaskById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = store.tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: `Task with ID ${id} not found`
    });
  }

  res.status(200).json({
    success: true,
    data: task
  });
};

// POST /api/tasks
const createTask = (req, res) => {
  const { title, description, subject, priority, dueDate } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Task title is required"
    });
  }

  const validPriorities = ["Low", "Medium", "High"];
  const selectedPriority = validPriorities.includes(priority) ? priority : "Medium";

  const newTask = {
    id: store.getNextTaskId(),
    title: title.trim(),
    description: description ? description.trim() : "",
    subject: subject ? subject.trim() : "General",
    priority: selectedPriority,
    dueDate: dueDate || new Date().toISOString().split("T")[0],
    completed: false
  };

  store.tasks.push(newTask);

  res.status(201).json({
    success: true,
    data: newTask
  });
};

// PUT /api/tasks/:id
const updateTask = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const taskIndex = store.tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Task with ID ${id} not found`
    });
  }

  const { title, description, subject, priority, dueDate, completed } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Task title is required"
    });
  }

  const validPriorities = ["Low", "Medium", "High"];
  const selectedPriority = validPriorities.includes(priority)
    ? priority
    : store.tasks[taskIndex].priority;

  const updatedTask = {
    ...store.tasks[taskIndex],
    title: title.trim(),
    description: description !== undefined ? description.trim() : store.tasks[taskIndex].description,
    subject: subject !== undefined ? subject.trim() : store.tasks[taskIndex].subject,
    priority: selectedPriority,
    dueDate: dueDate || store.tasks[taskIndex].dueDate,
    completed: completed !== undefined ? Boolean(completed) : store.tasks[taskIndex].completed
  };

  store.tasks[taskIndex] = updatedTask;

  res.status(200).json({
    success: true,
    data: updatedTask
  });
};

// DELETE /api/tasks/:id
const deleteTask = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const taskIndex = store.tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Task with ID ${id} not found`
    });
  }

  const deletedTask = store.tasks.splice(taskIndex, 1)[0];

  res.status(200).json({
    success: true,
    data: deletedTask
  });
};

// PATCH /api/tasks/:id/complete
const completeTask = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = store.tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: `Task with ID ${id} not found`
    });
  }

  // Toggle completion status or explicit boolean if passed
  if (req.body && req.body.completed !== undefined) {
    task.completed = Boolean(req.body.completed);
  } else {
    task.completed = !task.completed;
  }

  res.status(200).json({
    success: true,
    data: task
  });
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  completeTask
};
