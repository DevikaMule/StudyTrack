const store = require("../data/store");

// GET /api/dashboard
const getDashboardStats = (req, res) => {
  const totalSubjects = store.subjects.length;
  const totalTasks = store.tasks.length;
  const completedTasks = store.tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const totalSessions = store.sessions.length;
  const completedSessions = store.sessions.filter((s) => s.completed).length;

  res.status(200).json({
    success: true,
    data: {
      totalSubjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      totalSessions,
      completedSessions
    }
  });
};

module.exports = {
  getDashboardStats
};
