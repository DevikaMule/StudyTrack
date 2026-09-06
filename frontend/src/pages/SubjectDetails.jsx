import React from "react";
import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import TaskCard from "../components/TaskCard";
import StudySessionCard from "../components/StudySessionCard";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import api from "../services/api";
import { ArrowLeft, BookOpen, CheckSquare, Calendar, AlertCircle } from "lucide-react";

export function SubjectDetails({ showToast }) {
  const { id } = useParams();

  const { data: subject, loading: subjectLoading, error: subjectError } = useFetch(`/subjects/${id}`);
  const { data: tasks, loading: tasksLoading, refetch: refetchTasks } = useFetch("/tasks");
  const { data: sessions, loading: sessionsLoading, refetch: refetchSessions } = useFetch("/sessions");

  if (subjectLoading || tasksLoading || sessionsLoading) {
    return <Loading message="Loading subject details..." />;
  }

  if (subjectError || !subject) {
    return (
      <div className="error-box">
        <AlertCircle size={36} color="#dc2626" style={{ marginBottom: "0.5rem" }} />
        <h3>Subject Not Found</h3>
        <p>{subjectError || `No subject found with ID ${id}`}</p>
        <Link to="/subjects" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          Back to Subjects
        </Link>
      </div>
    );
  }

  // Filter tasks & sessions by subject name
  const subjectTasks = tasks ? tasks.filter((t) => t.subject === subject.name) : [];
  const subjectSessions = sessions ? sessions.filter((s) => s.subject === subject.name) : [];

  const handleToggleTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      refetchTasks();
      showToast("Task status updated.");
    } catch (err) {
      showToast(err.message || "Failed to update task.");
    }
  };

  const handleToggleSession = async (sessionId) => {
    try {
      await api.patch(`/sessions/${sessionId}/complete`);
      refetchSessions();
      showToast("Session status updated.");
    } catch (err) {
      showToast(err.message || "Failed to update session.");
    }
  };

  return (
    <div className="subject-details-page">
      <Link to="/subjects" className="btn btn-secondary btn-sm" style={{ marginBottom: "1.5rem" }}>
        <ArrowLeft size={16} />
        <span>Back to Subjects</span>
      </Link>

      <div className="section-card" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <BookOpen size={28} color="#3b82f6" />
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-main)" }}>
            {subject.name}
          </h1>
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "1.5rem" }}>
          {subject.description || "No description provided for this subject."}
        </p>

        <div className="progress-container">
          <div className="progress-labels">
            <span>Overall Progress</span>
            <span style={{ color: "#3b82f6" }}>{subject.progress}%</span>
          </div>
          <div className="progress-track" style={{ height: "12px" }}>
            <div
              className="progress-fill"
              style={{
                width: `${subject.progress}%`,
                backgroundColor: "#3b82f6"
              }}
            />
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        {/* Subject Tasks */}
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">
              <CheckSquare size={20} color="#3b82f6" />
              Tasks ({subjectTasks.length})
            </h2>
          </div>

          {subjectTasks.length > 0 ? (
            <div className="task-list">
              {subjectTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleTask}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No tasks for this subject."
              message="Create tasks assigned to this subject on the Tasks page."
            />
          )}
        </div>

        {/* Subject Sessions */}
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">
              <Calendar size={20} color="#3b82f6" />
              Study Sessions ({subjectSessions.length})
            </h2>
          </div>

          {subjectSessions.length > 0 ? (
            <div className="session-list">
              {subjectSessions.map((session) => (
                <StudySessionCard
                  key={session.id}
                  session={session}
                  onToggleComplete={handleToggleSession}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No study sessions scheduled."
              message="Schedule study sessions for this subject on the Study Planner page."
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SubjectDetails;
