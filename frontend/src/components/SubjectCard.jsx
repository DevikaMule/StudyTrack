import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Edit2, Trash2, ChevronRight } from "lucide-react";

export function SubjectCard({ subject, onEdit, onDelete }) {
  const getProgressColor = (progress) => {
    if (progress >= 80) return "#10b981"; // green
    if (progress >= 50) return "#3b82f6"; // blue
    if (progress >= 25) return "#f59e0b"; // yellow/orange
    return "#ef4444"; // red
  };

  const progressColor = getProgressColor(subject.progress);

  return (
    <div className="subject-card">
      <div>
        <div className="subject-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <BookOpen size={20} color="#3b82f6" />
            <h3 className="subject-title">{subject.name}</h3>
          </div>
        </div>

        <p className="subject-desc">{subject.description || "No description provided."}</p>

        <div className="progress-container">
          <div className="progress-labels">
            <span>Progress</span>
            <span style={{ color: progressColor }}>{subject.progress}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${subject.progress}%`,
                backgroundColor: progressColor
              }}
            />
          </div>
        </div>
      </div>

      <div className="card-actions">
        <Link to={`/subjects/${subject.id}`} className="btn btn-secondary btn-sm">
          <span>View Subject</span>
          <ChevronRight size={16} />
        </Link>
        <div style={{ display: "flex", gap: "0.35rem" }}>
          {onEdit && (
            <button
              className="btn-icon"
              onClick={() => onEdit(subject)}
              title="Edit Subject"
            >
              <Edit2 size={16} />
            </button>
          )}
          {onDelete && (
            <button
              className="btn-icon delete"
              onClick={() => onDelete(subject.id)}
              title="Delete Subject"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubjectCard;
