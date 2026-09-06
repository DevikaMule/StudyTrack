import React from "react";
import { Check, Calendar, Edit2, Trash2 } from "lucide-react";

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }) {
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "High":
        return "badge-high";
      case "Medium":
        return "badge-medium";
      case "Low":
        return "badge-low";
      default:
        return "badge-pending";
    }
  };

  return (
    <div className={`task-card ${task.completed ? "completed" : ""}`}>
      <div className="task-left">
        <button
          className={`task-checkbox ${task.completed ? "checked" : ""}`}
          onClick={() => onToggleComplete && onToggleComplete(task.id)}
          title={task.completed ? "Mark as Pending" : "Mark as Completed"}
          aria-label="Toggle Complete"
        >
          {task.completed && <Check size={14} strokeWidth={3} />}
        </button>

        <div className="task-content">
          <div className="task-title">{task.title}</div>
          {task.description && <p className="task-desc">{task.description}</p>}

          <div className="task-meta">
            <span className="task-subject-tag">{task.subject}</span>
            <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
              {task.priority} Priority
            </span>
            {task.dueDate && (
              <span className="task-due">
                <Calendar size={13} />
                {task.dueDate}
              </span>
            )}
            {task.completed ? (
              <span className="badge badge-success">✓ Completed</span>
            ) : (
              <span className="badge badge-pending">Pending</span>
            )}
          </div>
        </div>
      </div>

      <div className="task-actions">
        {onEdit && (
          <button
            className="btn-icon"
            onClick={() => onEdit(task)}
            title="Edit Task"
          >
            <Edit2 size={15} />
          </button>
        )}
        {onDelete && (
          <button
            className="btn-icon delete"
            onClick={() => onDelete(task.id)}
            title="Delete Task"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
