// src/pages/RequestsBoard.jsx
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../assets/request.css";

export default function RequestsBoard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    // ✅ Fetch requests from Spring Boot backend
    const fetchRequests = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/requests");
        if (res.ok) {
          const data = await res.json();
          setRequests(data);
        } else {
          console.error("Failed to fetch requests:", res.status);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="request-page">
      <div className="container" data-aos="fade-up">
        {/* Title */}
        <div className="request-hero">
          <h1>📋 Book Requests</h1>
          <p>Browse requests made by fellow readers</p>
        </div>

        {/* Loading */}
        {loading && <p className="loading-text">Loading requests...</p>}

        {/* No requests */}
        {!loading && (!requests || requests.length === 0) && (
          <p className="empty-text">No requests yet.</p>
        )}

        {/* Requests grid */}
        {!loading && requests.length > 0 && (
          <div className="requests-grid">
            {requests.map((req) => (
              <div
                key={req.id}
                className="request-card pill-card"
                data-aos="zoom-in"
              >
                <h5>{req.title}</h5>
                <p>
                  <strong>Author:</strong> {req.author || "Unknown"}
                </p>
                <p>
                  <strong>Requested by:</strong> {req.requester}
                </p>
                <p>
                  <strong>Location:</strong> {req.location}
                </p>
                {req.notes && (
                  <p>
                    <strong>Notes:</strong> {req.notes}
                  </p>
                )}
                {req.requesterPhone && (
                  <p>
                    <strong>Contact:</strong> {req.requesterPhone}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
