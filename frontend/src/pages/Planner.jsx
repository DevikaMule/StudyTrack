import React, { useState, useMemo } from "react";
import useFetch from "../hooks/useFetch";
import StudySessionCard from "../components/StudySessionCard";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import api from "../services/api";
import { Plus, Calendar as CalendarIcon, AlertCircle } from "lucide-react";

export function Planner({ showToast }) {
  const { data: sessions, loading: sessionsLoading, error: sessionsError, refetch: refetchSessions } = useFetch("/sessions");
  const { data: subjects } = useFetch("/subjects");

  // View & Filter State
  const [viewMode, setViewMode] = useState("all"); // 'all' | 'upcoming'
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "18:00",
    duration: 45
  });
  const [formError, setFormError] = useState("");

  // Delete Confirm State
  const [deleteId, setDeleteId] = useState(null);

  const todayStr = new Date().toISOString().split("T")[0];

  // Filtered sessions calculation
  const filteredSessions = useMemo(() => {
    if (!sessions) return [];
    return sessions.filter((session) => {
      // 1. View Mode ('upcoming' vs 'all')
      if (viewMode === "upcoming" && (session.completed || session.date < todayStr)) {
        return false;
      }

      // 2. Subject Filter
      if (subjectFilter !== "All" && session.subject !== subjectFilter) {
        return false;
      }

      // 3. Status Filter
      if (statusFilter === "Completed" && !session.completed) return false;
      if (statusFilter === "Pending" && session.completed) return false;

      // 4. Date Filter
      if (dateFilter && session.date !== dateFilter) return false;

      return true;
    });
  }, [sessions, viewMode, subjectFilter, statusFilter, dateFilter, todayStr]);

  const handleOpenAddModal = () => {
    setEditingSession(null);
    const defaultSubject = subjects && subjects.length > 0 ? subjects[0].name : "React Development";
    setFormData({
      subject: defaultSubject,
      topic: "",
      date: new Date().toISOString().split("T")[0],
      startTime: "18:00",
      duration: 45
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (session) => {
    setEditingSession(session);
    setFormData({
      subject: session.subject,
      topic: session.topic,
      date: session.date,
      startTime: session.startTime,
      duration: session.duration
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.subject || formData.subject.trim() === "") {
      setFormError("Subject is required.");
      return;
    }
    if (!formData.topic || formData.topic.trim() === "") {
      setFormError("Topic is required.");
      return;
    }
    if (!formData.date) {
      setFormError("Date is required.");
      return;
    }
    if (!formData.startTime) {
      setFormError("Start time is required.");
      return;
    }
    const dur = Number(formData.duration);
    if (isNaN(dur) || dur <= 0) {
      setFormError("Duration must be a number greater than 0 minutes.");
      return;
    }

    try {
      if (editingSession) {
        await api.put(`/sessions/${editingSession.id}`, { ...formData, duration: dur });
        showToast("Study session updated successfully.");
      } else {
        await api.post("/sessions", { ...formData, duration: dur });
        showToast("Study session scheduled successfully.");
      }
      setIsModalOpen(false);
      refetchSessions();
    } catch (err) {
      setFormError(err.message || "Failed to save session.");
    }
  };

  const handleToggleComplete = async (sessionId) => {
    try {
      await api.patch(`/sessions/${sessionId}/complete`);
      refetchSessions();
      showToast("Session status updated.");
    } catch (err) {
      showToast(err.message || "Failed to update session status.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/sessions/${deleteId}`);
      showToast("Session deleted successfully.");
      setDeleteId(null);
      refetchSessions();
    } catch (err) {
      showToast(err.message || "Failed to delete session.");
    }
  };

  if (sessionsLoading) return <Loading message="Loading study sessions..." />;

  if (sessionsError) {
    return (
      <div className="error-box">
        <AlertCircle size={36} color="#dc2626" style={{ marginBottom: "0.5rem" }} />
        <h3>Unable to load study planner</h3>
        <p>{sessionsError}</p>
        <button className="btn btn-primary" onClick={refetchSessions}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="planner-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Study Planner</h1>
          <p>Schedule focused study blocks and build consistent study habits.</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>Add Session</span>
        </button>
      </div>

      {/* Filter and View Toggle Toolbar */}
      <div className="filter-toolbar">
        <div className="tab-toggle">
          <button
            className={`tab-btn ${viewMode === "all" ? "active" : ""}`}
            onClick={() => setViewMode("all")}
          >
            All Sessions
          </button>
          <button
            className={`tab-btn ${viewMode === "upcoming" ? "active" : ""}`}
            onClick={() => setViewMode("upcoming")}
          >
            Upcoming
          </button>
        </div>

        <div className="filter-group">
          <select
            className="select-control"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="All">All Subjects</option>
            {subjects &&
              subjects.map((subj) => (
                <option key={subj.id} value={subj.name}>
                  {subj.name}
                </option>
              ))}
          </select>

          <select
            className="select-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <input
            type="date"
            className="select-control"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />

          {dateFilter && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setDateFilter("")}
            >
              Clear Date
            </button>
          )}
        </div>
      </div>

      {/* Sessions List */}
      {filteredSessions.length > 0 ? (
        <div className="session-list">
          {filteredSessions.map((session) => (
            <StudySessionCard
              key={session.id}
              session={session}
              onToggleComplete={handleToggleComplete}
              onEdit={handleOpenEditModal}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarIcon}
          title="No study sessions scheduled."
          message="Schedule study sessions to keep track of your daily learning routines."
          actionText="Add Session"
          onAction={handleOpenAddModal}
        />
      )}

      {/* Add / Edit Session Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingSession ? "Edit Study Session" : "Add Study Session"}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="error-box" style={{ padding: "0.75rem", marginBottom: "1rem" }}>
              {formError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="session-subject">Subject *</label>
            <select
              id="session-subject"
              className="form-control"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            >
              {subjects && subjects.length > 0 ? (
                subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))
              ) : (
                <option value="React Development">React Development</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="session-topic">Topic *</label>
            <input
              id="session-topic"
              type="text"
              className="form-control"
              placeholder="e.g. React Hooks, Binary Trees"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="session-date">Date *</label>
              <input
                id="session-date"
                type="date"
                className="form-control"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="session-time">Start Time *</label>
              <input
                id="session-time"
                type="time"
                className="form-control"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="session-duration">Duration (Minutes) *</label>
            <input
              id="session-duration"
              type="number"
              min="5"
              max="480"
              className="form-control"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
          </div>

          <div className="modal-footer" style={{ paddingRight: 0, paddingLeft: 0, paddingBottom: 0 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingSession ? "Save Changes" : "Add Session"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={Boolean(deleteId)}
        title="Confirm Delete Session"
        onClose={() => setDeleteId(null)}
      >
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          Are you sure you want to delete this scheduled study session?
        </p>
        <div className="modal-footer" style={{ paddingRight: 0, paddingLeft: 0, paddingBottom: 0 }}>
          <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDeleteConfirm}>
            Delete Session
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Planner;
