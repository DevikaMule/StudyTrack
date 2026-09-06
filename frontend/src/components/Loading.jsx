import React from "react";

export function Loading({ message = "Loading data..." }) {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p style={{ marginTop: "1rem", color: "var(--text-muted)", fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
}

export default Loading;
