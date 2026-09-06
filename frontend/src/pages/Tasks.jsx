import React, { useState, useMemo } from "react";
import useFetch from "../hooks/useFetch";
import TaskCard from "../components/TaskCard";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import api from "../services/api";
import { Plus, Search, CheckSquare, AlertCircle } from "lucide-react";

export function Tasks({ showToast }) {
  const { data: tasks, loading: tasksLoading, error: tasksError, refetch: refetchTasks } = useFetch("/tasks");
  const { data: subjects } = useFetch("/subjects");

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    priority: "Medium",
    dueDate: new Date().toISOString().split("T")[0]
  });
  const [formError, setFormError] = useState("");

  // Delete Confirm State
  const [deleteId, setDeleteId] = useState(null);

  // Filter Tasks based on Search and Filters working together
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter((task) => {
      // 1. Search Query
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query)) ||
        (task.subject && task.subject.toLowerCase().includes(query));

      // 2. Priority Filter
      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      // 3. Status Filter
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Completed" && task.completed) ||
        (statusFilter === "Pending" && !task.completed);

      // 4. Subject Filter
      const matchesSubject =
        subjectFilter === "All" || task.subject === subjectFilter;

      return matchesSearch && matchesPriority && matchesStatus && matchesSubject;
    });
  }, [tasks, searchTerm, priorityFilter, statusFilter, subjectFilter]);

  const handleOpenAddModal = () => {
    setEditingTask(null);
    const defaultSubject = subjects && subjects.length > 0 ? subjects[0].name : "General";
    setFormData({
      title: "",
      description: "",
      subject: defaultSubject,
      priority: "Medium",
      dueDate: new Date().toISOString().split("T")[0]
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      subject: task.subject || (subjects?.[0]?.name || "General"),
      priority: task.priority || "Medium",
      dueDate: task.dueDate || new Date().toISOString().split("T")[0]
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title || formData.title.trim() === "") {
      setFormError("Task title is required.");
      return;
    }

    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, formData);
        showToast("Task updated successfully.");
      } else {
        await api.post("/tasks", formData);
        showToast("Task created successfully.");
      }
      setIsModalOpen(false);
      refetchTasks();
    } catch (err) {
      setFormError(err.message || "Failed to save task.");
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      refetchTasks();
      showToast("Task completion toggled.");
    } catch (err) {
      showToast(err.message || "Failed to update task completion.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/tasks/${deleteId}`);
      showToast("Task deleted successfully.");
      setDeleteId(null);
      refetchTasks();
    } catch (err) {
      showToast(err.message || "Failed to delete task.");
    }
  };

  if (tasksLoading) return <Loading message="Loading tasks..." />;

  if (tasksError) {
    return (
      <div className="error-box">
        <AlertCircle size={36} color="#dc2626" style={{ marginBottom: "0.5rem" }} />
        <h3>Unable to load tasks</h3>
        <p>{tasksError}</p>
        <button className="btn btn-primary" onClick={refetchTasks}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Tasks</h1>
          <p>Track your assignments, homework, and study goals.</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="filter-toolbar">
        <div className="search-box">
          <Search size={18} className="search-box-icon" />
          <input
            type="text"
            placeholder="Search tasks by title, description, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            className="select-control"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
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
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <div className="task-list">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={handleOpenEditModal}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found."
          message={
            searchTerm || priorityFilter !== "All" || statusFilter !== "All" || subjectFilter !== "All"
              ? "No tasks match your current filter and search criteria."
              : "No tasks created yet. Click below to add your first task."
          }
          actionText="Add Task"
          onAction={handleOpenAddModal}
        />
      )}

      {/* Add / Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingTask ? "Edit Task" : "Add New Task"}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="error-box" style={{ padding: "0.75rem", marginBottom: "1rem" }}>
              {formError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="task-title">Task Title *</label>
            <input
              id="task-title"
              type="text"
              className="form-control"
              placeholder="e.g. Complete React Assignment"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              className="form-control"
              placeholder="Task instructions or details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-subject">Subject</label>
            <select
              id="task-subject"
              className="form-control"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            >
              {subjects && subjects.length > 0 ? (
                subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))
              ) : (
                <option value="General">General</option>
              )}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                className="form-control"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-date">Due Date</label>
              <input
                id="task-date"
                type="date"
                className="form-control"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
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
              {editingTask ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={Boolean(deleteId)}
        title="Confirm Delete Task"
        onClose={() => setDeleteId(null)}
      >
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          Are you sure you want to delete this task?
        </p>
        <div className="modal-footer" style={{ paddingRight: 0, paddingLeft: 0, paddingBottom: 0 }}>
          <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDeleteConfirm}>
            Delete Task
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Tasks;
