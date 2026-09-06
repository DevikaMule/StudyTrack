import React from "react";

export function StatCard({ title, value, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
      {Icon && (
        <div
          className="stat-icon-wrapper"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          <Icon size={26} />
        </div>
      )}
    </div>
  );
}

export default StatCard;
