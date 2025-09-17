// src/pages/BookDetails(with backedn).jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/bookDetails.css";
import NotificationModal from "../Components/NotificationModal";
import { useUser } from "../context/UserContext";
import BookImg from "../assets/Book.png";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState("buy"); // ✅ toggle state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // ✅ Fetch book details from backend
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/books/${id}`);
        if (!res.ok) throw new Error("Book not found");
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="book-details-page">
        <p>Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-details-page">
        <p>Book not found.</p>
        <button className="back-pill" onClick={() => navigate("/listings")}>
          ⬅ Back to Listings
        </button>
      </div>
    );
  }

  const getConditionLabel = (condition) => {
    switch (condition?.toLowerCase()) {
      case "good": return "Good";
      case "fair": return "Fair";
      case "new": return "Like New";
      default: return condition || "Unknown";
    }
  };

  // ✅ Perform Buy or Borrow request (backend POST)
  const handleAction = async () => {
    if (!user) {
      setModalMessage("⚠️ Please login or register to proceed.");
      setShowModal(true);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/books/${id}/${action}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
          }),
        }
      );

      if (!res.ok) throw new Error("Action failed");

      setModalMessage(
        `✅ Your ${action === "buy" ? "purchase" : "borrow request"} is confirmed!`
      );
    } catch (err) {
      console.error("Error performing action:", err);
      setModalMessage("❌ Failed to complete action. Please try again.");
    } finally {
      setShowModal(true);
    }
  };

  return (
    <div className="book-details-page">
      <div className="book-details-container">
        {/* Image */}
        <img
          src={book.imageUrl || BookImg}
          alt={book.title}
          className="book-image-details"
        />

        {/* Info */}
        <div className="book-info">
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Category:</strong> {book.category}</p>
          <p><strong>Condition:</strong> {getConditionLabel(book.condition)}</p>
          <p><strong>Price:</strong> ₹{book.price}</p>

          {/* Owner details */}
          <p><strong>Owner:</strong> {book.owner || "Unknown"}</p>
          <p><strong>Contact:</strong> {book.ownerPhone || "Not provided"}</p>
          <p><strong>Location:</strong> {book.location || "Not specified"}</p>

          {/* ✅ Action Section as Toggle Pills */}
          <div className="toggle-section">
            <button
              className={`toggle-pill ${action === "buy" ? "active" : ""}`}
              onClick={() => setAction("buy")}
            >
              Buy
            </button>
            <button
              className={`toggle-pill ${action === "borrow" ? "active" : ""}`}
              onClick={() => setAction("borrow")}
            >
              Borrow
            </button>
          </div>

          {/* Confirm Action */}
          <button className="confirm-button" onClick={handleAction}>
            {action === "buy" ? "Buy Now" : "Request Borrow"}
          </button>

          {/* Back to Listings */}
          <button
            className="back-pill"
            onClick={() => navigate("/listings")}
          >
            ⬅ Back to Listings
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <NotificationModal
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default BookDetails;
