import React from "react";
import { FolderOpen, Plus } from "lucide-react";

export function EmptyState({
  title = "No items found",
  message = "Get started by adding your first item.",
  actionText,
  onAction,
  icon: Icon = FolderOpen
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon-box">
        <Icon size={32} />
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionText && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          <Plus size={18} />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}

export default EmptyState;
