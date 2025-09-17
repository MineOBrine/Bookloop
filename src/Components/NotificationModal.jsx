// src/Components/NotificationModal.jsx
import React from "react";
import "../assets/notificationModal.css";

export default function NotificationModal({
  show,
  onClose,
  message = "",
  type = "success", // can be "success", "error", "info"
}) {
  if (!show) return null;

  // Define styles based on type
  const getTitle = () => {
    switch (type) {
      case "error":
        return "❌ Error";
      case "info":
        return "ℹ️ Info";
      case "success":
        return "✅ Success";
      default :
        return "Something";
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{getTitle()}</h3>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
