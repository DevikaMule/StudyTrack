import React, { useState } from "react";
import useFetch from "../hooks/useFetch";
import SubjectCard from "../components/SubjectCard";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import api from "../services/api";
import { Plus, BookOpen, AlertCircle } from "lucide-react";

export function Subjects({ showToast }) {
  const { data: subjects, loading, error, refetch } = useFetch("/subjects");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    progress: 0
  });
  const [formError, setFormError] = useState("");

  // Delete Confirm Modal State
  const [deleteId, setDeleteId] = useState(null);

  const handleOpenAddModal = () => {
    setEditingSubject(null);
    setFormData({ name: "", description: "", progress: 0 });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description || "",
      progress: subject.progress || 0
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name || formData.name.trim() === "") {
      setFormError("Subject name is required.");
      return;
    }

    const progressNum = Number(formData.progress);
    if (isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
      setFormError("Progress must be a number between 0 and 100.");
      return;
    }

    try {
      if (editingSubject) {
        await api.put(`/subjects/${editingSubject.id}`, {
          name: formData.name,
          description: formData.description,
          progress: progressNum
        });
        showToast("Subject updated successfully.");
      } else {
        await api.post("/subjects", {
          name: formData.name,
          description: formData.description,
          progress: progressNum
        });
        showToast("Subject added successfully.");
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err.message || "Failed to save subject.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/subjects/${deleteId}`);
      showToast("Subject deleted successfully.");
      setDeleteId(null);
      refetch();
    } catch (err) {
      showToast(err.message || "Failed to delete subject.");
    }
  };

  if (loading) return <Loading message="Loading subjects..." />;

  if (error) {
    return (
      <div className="error-box">
        <AlertCircle size={36} color="#dc2626" style={{ marginBottom: "0.5rem" }} />
        <h3>Unable to load subjects</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={refetch}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="subjects-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>My Subjects</h1>
          <p>Organize your academic modules and track course progress.</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>Add Subject</span>
        </button>
      </div>

      {subjects && subjects.length > 0 ? (
        <div className="subjects-grid">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onEdit={handleOpenEditModal}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No subjects yet."
          message="Add your first subject to get started."
          actionText="Add Subject"
          onAction={handleOpenAddModal}
        />
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingSubject ? "Edit Subject" : "Add New Subject"}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          {formError && <div className="error-box" style={{ padding: "0.75rem", marginBottom: "1rem" }}>{formError}</div>}

          <div className="form-group">
            <label htmlFor="subj-name">Subject Name *</label>
            <input
              id="subj-name"
              type="text"
              className="form-control"
              placeholder="e.g. React Development"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subj-desc">Description</label>
            <textarea
              id="subj-desc"
              className="form-control"
              placeholder="Brief summary of the subject..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="subj-progress">Progress (%): {formData.progress}%</label>
            <input
              id="subj-progress"
              type="range"
              min="0"
              max="100"
              step="5"
              className="form-control"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
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
              {editingSubject ? "Save Changes" : "Add Subject"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteId)}
        title="Confirm Delete"
        onClose={() => setDeleteId(null)}
      >
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          Are you sure you want to delete this subject? All associated view data will be affected.
        </p>
        <div className="modal-footer" style={{ paddingRight: 0, paddingLeft: 0, paddingBottom: 0 }}>
          <button
            className="btn btn-secondary"
            onClick={() => setDeleteId(null)}
          >
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDeleteConfirm}>
            Delete Subject
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Subjects;
