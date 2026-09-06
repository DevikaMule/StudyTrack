import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BookOpen, CheckSquare, Calendar, Sparkles } from "lucide-react";

export function Sidebar({ isOpen, onCloseMobile }) {
  const navItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Subjects", path: "/subjects", icon: BookOpen },
    { label: "Tasks", path: "/tasks", icon: CheckSquare },
    { label: "Study Planner", path: "/planner", icon: Calendar }
  ];

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={onCloseMobile}
      />
      <aside className={`sidebar ${isOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <BookOpen size={24} color="#3b82f6" />
            <span>StudyTrack</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
                onClick={onCloseMobile}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="quick-tip-card">
            <div className="quick-tip-title">
              <Sparkles size={16} color="#f59e0b" />
              <span>Daily Tip</span>
            </div>
            Break long sessions into 25-minute Pomodoro bursts with short breaks!
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
