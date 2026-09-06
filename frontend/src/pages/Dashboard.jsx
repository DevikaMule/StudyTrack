import React from "react";
import useFetch from "../hooks/useFetch";
import StatCard from "../components/StatCard";
import SubjectCard from "../components/SubjectCard";
import TaskCard from "../components/TaskCard";
import StudySessionCard from "../components/StudySessionCard";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import api from "../services/api";
import { BookOpen, CheckSquare, CheckCircle, PieChart, Calendar, AlertCircle } from "lucide-react";

export function Dashboard({ showToast }) {
  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useFetch("/dashboard");
  const { data: subjects, loading: subjectsLoading, error: subjectsError } = useFetch("/subjects");
  const { data: tasks, loading: tasksLoading, error: tasksError, refetch: refetchTasks } = useFetch("/tasks");
  const { data: sessions, loading: sessionsLoading, error: sessionsError, refetch: refetchSessions } = useFetch("/sessions");

  const todayStr = new Date().toISOString().split("T")[0];

  // Filter tasks due today (or pending tasks)
  const todayTasks = tasks
    ? tasks.filter((t) => t.dueDate === todayStr || (!t.completed && t.dueDate <= todayStr))
    : [];

  // Filter upcoming study sessions (today or future dates)
  const upcomingSessions = sessions
    ? sessions.filter((s) => !s.completed && s.date >= todayStr).slice(0, 3)
    : [];

  const handleToggleTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      refetchTasks();
      refetchStats();
      showToast("Task status updated.");
    } catch (err) {
      showToast(err.message || "Failed to update task");
    }
  };

  const handleToggleSession = async (sessionId) => {
    try {
      await api.patch(`/sessions/${sessionId}/complete`);
      refetchSessions();
      refetchStats();
      showToast("Session status updated.");
    } catch (err) {
      showToast(err.message || "Failed to update session");
    }
  };

  const isLoading = statsLoading || subjectsLoading || tasksLoading || sessionsLoading;
  const hasError = statsError || subjectsError || tasksError || sessionsError;

  if (isLoading) return <Loading message="Loading dashboard overview..." />;

  if (hasError) {
    return (
      <div className="error-box">
        <AlertCircle size={36} color="#dc2626" style={{ marginBottom: "0.5rem" }} />
        <h3>Unable to load data.</h3>
        <p>Please make sure the backend server is running on http://localhost:5000</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Good morning, Student 👋</h1>
          <p>Here's your study overview.</p>
        </div>
      </div>

      {/* Dynamic Statistics Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Subjects"
          value={stats?.totalSubjects ?? 0}
          icon={BookOpen}
          iconBg="#eff6ff"
          iconColor="#3b82f6"
        />
        <StatCard
          title="Total Tasks"
          value={stats?.totalTasks ?? 0}
          icon={CheckSquare}
          iconBg="#fef3c7"
          iconColor="#d97706"
        />
        <StatCard
          title="Completed Tasks"
          value={stats?.completedTasks ?? 0}
          icon={CheckCircle}
          iconBg="#dcfce7"
          iconColor="#15803d"
        />
        <StatCard
          title="Completion Rate"
          value={`${stats?.completionRate ?? 0}%`}
          icon={PieChart}
          iconBg="#f3e8ff"
          iconColor="#9333ea"
        />
      </div>

      {/* Main Grid: Today's Tasks & Upcoming Sessions */}
      <div className="dashboard-sections">
        {/* Today's Tasks */}
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">
              <CheckSquare size={20} color="#3b82f6" />
              Today's Tasks
            </h2>
          </div>

          {todayTasks.length > 0 ? (
            <div className="task-list">
              {todayTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleTask}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No tasks for today."
              message="You have no tasks scheduled for today. Enjoy your day or add a new task!"
            />
          )}
        </div>

        {/* Upcoming Sessions */}
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">
              <Calendar size={20} color="#3b82f6" />
              Upcoming Study Sessions
            </h2>
          </div>

          {upcomingSessions.length > 0 ? (
            <div className="session-list">
              {upcomingSessions.map((session) => (
                <StudySessionCard
                  key={session.id}
                  session={session}
                  onToggleComplete={handleToggleSession}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No upcoming sessions."
              message="No study sessions scheduled for today or tomorrow."
            />
          )}
        </div>
      </div>

      {/* Recent Subjects Grid */}
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">
            <BookOpen size={20} color="#3b82f6" />
            Recent Subjects
          </h2>
        </div>

        {subjects && subjects.length > 0 ? (
          <div className="subjects-grid">
            {subjects.slice(0, 3).map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No subjects yet."
            message="Add your first subject to get started."
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
