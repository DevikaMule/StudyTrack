import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Toast from "./components/Toast";

import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import SubjectDetails from "./pages/SubjectDetails";
import Tasks from "./pages/Tasks";
import Planner from "./pages/Planner";

export function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      <div className="main-wrapper">
        <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard showToast={showToast} />} />
            <Route path="/subjects" element={<Subjects showToast={showToast} />} />
            <Route path="/subjects/:id" element={<SubjectDetails showToast={showToast} />} />
            <Route path="/tasks" element={<Tasks showToast={showToast} />} />
            <Route path="/planner" element={<Planner showToast={showToast} />} />
          </Routes>
        </main>
      </div>

      <Toast toasts={toasts} />
    </div>
  );
}

export default App;
