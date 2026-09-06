import React from "react";
import { Menu, Bell, BookOpen } from "lucide-react";

export function Navbar({ onToggleSidebar }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="brand-title">
          <BookOpen size={24} />
          <span>StudyTrack</span>
          <span className="badge">v1.0</span>
        </div>
      </div>

      <div className="navbar-right">
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="notification-dot" />
        </button>

        <div className="user-profile-badge">
          <div className="avatar">S</div>
          <span className="user-name">Student</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
