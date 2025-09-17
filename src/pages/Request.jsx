// src/pages/Request.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "../assets/request.css";
import { useUser } from "../context/UserContext";
import NotificationModal from "../Components/NotificationModal";

function Request() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [notes, setNotes] = useState("");
  const [requests, setRequests] = useState([]);

  const [activeTab, setActiveTab] = useState("form"); // NEW: tab state

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/requests");
      if (res.ok) {
        setRequests(await res.json());
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setModalMessage("Please register or login to submit a request.");
      setShowModal(true);
      return;
    }

    const newRequest = {
      title: title.trim(),
      author: author.trim(),
      location: user.college || "Unknown College",
      notes: notes.trim(),
      requester: user?.name || user?.username || "Anonymous",
      requesterEmail: user?.email,
      requesterPhone: user?.phone,
    };

    try {
      const res = await fetch("http://localhost:8080/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRequest),
      });

      if (res.ok) {
        setModalMessage("✅ Request submitted successfully!");
        setShowModal(true);
        setTitle("");
        setAuthor("");
        setNotes("");
        fetchRequests();
      } else {
        setModalMessage("❌ Failed to submit request.");
        setShowModal(true);
      }
    } catch (err) {
      console.error("Error submitting request:", err);
      setModalMessage("⚠️ Error submitting request.");
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (user) navigate("/requests");
  };

  return (
    <div className="request-page">
      {/* Hero */}
      <div className="request-hero">
        <h1>Book Requests</h1>
        <p>Request books and see what others are looking for.</p>
      </div>

      {/* Pill Buttons for Tabs */}
      <ul className="tabs justify-content-center mb-4">
        <li className="nav-item">
          <button
            className={`pillr-btn ${activeTab === "form" ? "active" : ""}`}
            onClick={() => setActiveTab("form")}
          >
            📖 Request a Book
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`pillr-btn ${activeTab === "list" ? "active" : ""}`}
            onClick={() => setActiveTab("list")}
          >
            📋 Existing Requests
          </button>
        </li>
      </ul>


      {/* Request Form */}
      {activeTab === "form" && (
        <div className="request-card" data-aos="fade-up">
          <h2>📖 Request a Book</h2>
          <form className="request-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Book Title</label>
              <input
                type="text"
                placeholder="Enter book title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                placeholder="Enter author name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                placeholder="Any specific edition, condition, or details?"
                rows="4"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn-submit">
              Submit Request
            </button>
          </form>
        </div>
      )}

      {/* Existing Requests */}
      {activeTab === "list" && (
        <>
          <h2 className="requests-heading">📋 Existing Requests</h2>
          {loading ? (
            <p>Loading requests...</p>
          ) : requests && requests.length > 0 ? (
            <div className="requests-grid">
              {requests.map((req) => (
                <div key={req.id} className="request-display" data-aos="zoom-in">
                  <h3>{req.title}</h3>
                  <p>
                    <strong>Author:</strong> {req.author || "Unknown"}
                  </p>
                  <p>
                    <strong>College:</strong> {req.location}
                  </p>
                  {req.notes && (
                    <p>
                      <strong>Notes:</strong> {req.notes}
                    </p>
                  )}
                  <p>
                    <em>Requested by: {req.requester}</em>
                  </p>
                  {req.requesterPhone && (
                    <p>
                      <strong>Contact:</strong> {req.requesterPhone}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No requests available.</p>
          )}
        </>
      )}

      {/* Notification Modal */}
      <NotificationModal
        show={showModal}
        onClose={handleCloseModal}
        message={modalMessage}
      />
    </div>
  );
}

export default Request;
