// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import "../assets/Profile.css";
import { Link } from "react-router-dom";

function Profile() {
  const { user, logoutUser } = useUser(); // ✅ use logoutUser instead of signOut
  const [activeTab, setActiveTab] = useState("account");

  const [uploads, setUploads] = useState([]);
  const [requests, setRequests] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const uploadsRes = await fetch(
          `http://localhost:8080/api/books/user/${encodeURIComponent(user.email)}`
        );
        if (uploadsRes.ok) setUploads(await uploadsRes.json());

        const requestsRes = await fetch(
          `http://localhost:8080/api/requests/user/${encodeURIComponent(user.email)}`
        );
        if (requestsRes.ok) setRequests(await requestsRes.json());

        const exchangesRes = await fetch(
          `http://localhost:8080/api/exchanges/user/${encodeURIComponent(user.email)}`
        );
        if (exchangesRes.ok) setExchanges(await exchangesRes.json());
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.email]);

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-hero">
          <h1>My Profile</h1>
          <p>Please register to view your profile.</p>
        </div>
        <div className="profile-container centered">
          <h2>You need to register first.</h2>
          <Link to="/register" className="btn-primary">
            Go to Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <h1>My Profile</h1>
        <p>Manage your account, uploads, and requests all in one place.</p>
      </div>

      <div className="profile-container">
        <div className="tabs nav nav-pills justify-content-center mb-4 flex-wrap">
          <button
            className={`pill-btn ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            Account Details
          </button>
          <button
            className={`pill-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Exchange History
          </button>
          <button
            className={`pill-btn ${activeTab === "uploads" ? "active" : ""}`}
            onClick={() => setActiveTab("uploads")}
          >
            My Uploads
          </button>
          <button
            className={`pill-btn ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            My Requests
          </button>
          <button onClick={logoutUser} className="pill-btn signout"> {/* ✅ updated here */}
            Sign Out
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "account" && (
            <div className="tab-card">
              <h2>Account Details</h2>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>College:</strong> {user.college}</p>

              {user.interests?.length > 0 && (
                <div className="interests-section">
                  <strong>Interests:</strong>
                  <div className="interests-list">
                    {user.interests.map((interest, i) => (
                      <span key={i} className="interest-tag">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="tab-card">
              <h2>Exchange History</h2>
              {loading ? (
                <p>Loading exchanges...</p>
              ) : exchanges.length > 0 ? (
                <ul>
                  {exchanges.map((ex, i) => (
                    <li key={i}>
                      <strong>{ex.bookTitle}</strong> with {ex.otherPartyName || "Unknown"}
                      <br />
                      <em>Status: {ex.status || "Pending"}</em>
                      <br />
                      <small>{ex.date ? new Date(ex.date).toLocaleDateString() : "N/A"}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No exchanges yet.</p>
              )}
            </div>
          )}

          {activeTab === "uploads" && (
            <div className="tab-card">
              <h2>My Uploads</h2>
              {loading ? (
                <p>Loading uploads...</p>
              ) : uploads.length > 0 ? (
                <ul>
                  {uploads.map((book) => (
                    <li key={book.id}>
                      <Link to={`/book/${book.id}`} className="upload-link">
                        <strong>{book.title}</strong> — {book.author} ({book.condition})
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No uploads yet.</p>
              )}
            </div>
          )}

          {activeTab === "requests" && (
            <div className="tab-card">
              <h2>My Requests</h2>
              {loading ? (
                <p>Loading requests...</p>
              ) : requests.length > 0 ? (
                <ul>
                  {requests.map((req, i) => (
                    <li key={i}>
                      <strong>{req.title}</strong> — {req.location}
                      <br />
                      <em>{req.notes}</em>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No requests yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
