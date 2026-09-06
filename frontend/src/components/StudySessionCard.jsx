import React from "react";
import { BookOpen, Calendar, Clock, CheckCircle2, Edit2, Trash2 } from "lucide-react";

export function StudySessionCard({ session, onToggleComplete, onEdit, onDelete }) {
  return (
    <div className={`session-card ${session.completed ? "completed" : ""}`}>
      <div className="session-main">
        <div
          className="session-icon-box"
          style={{
            backgroundColor: session.completed ? "#e2e8f0" : "#eff6ff",
            color: session.completed ? "#64748b" : "#3b82f6"
          }}
        >
          <BookOpen size={24} />
        </div>

        <div className="session-details">
          <h4>{session.subject}</h4>
          <p className="session-topic">Topic: <strong>{session.topic}</strong></p>

          <div className="session-time-info">
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Calendar size={14} />
              {session.date}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Clock size={14} />
              {session.startTime} ({session.duration} min)
            </span>
            {session.completed ? (
              <span className="badge badge-success">✓ Session Finished</span>
            ) : (
              <span className="badge badge-pending">Scheduled</span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {onToggleComplete && (
          <button
            className={`btn btn-sm ${session.completed ? "btn-secondary" : "btn-primary"}`}
            onClick={() => onToggleComplete(session.id)}
          >
            <CheckCircle2 size={15} />
            <span>{session.completed ? "Mark Pending" : "Mark Complete"}</span>
          </button>
        )}

        {onEdit && (
          <button
            className="btn-icon"
            onClick={() => onEdit(session)}
            title="Edit Session"
          >
            <Edit2 size={15} />
          </button>
        )}

        {onDelete && (
          <button
            className="btn-icon delete"
            onClick={() => onDelete(session.id)}
            title="Delete Session"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

export default StudySessionCard;
