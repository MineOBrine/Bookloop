// src/pages/BookDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../assets/bookDetails.css";
import NotificationModal from "../Components/NotificationModal";
import { useUser } from "../context/UserContext";
import BookImg from "../assets/Book.png";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, books, addRequest } = useUser();

  const [book, setBook] = useState(location.state?.book || null);
  const [loading, setLoading] = useState(!location.state?.book);
  const [action, setAction] = useState("buy");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (!book) {
      const foundBook = books.find((b) => String(b.id) === String(id));
      if (foundBook) setBook(foundBook);
      setLoading(false);
    }
  }, [id, books, book]);

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
        <button
          className="btn-pill-secondary"
          onClick={() => navigate("/listings")}
        >
          Back to Listings
        </button>
      </div>
    );
  }

  const getConditionLabel = (condition) => {
    const labels = { good: "Good", fair: "Fair", new: "Like New" };
    return labels[condition?.toLowerCase()] || "Unknown";
  };

  const handleAction = () => {
    if (!user) {
      setModalMessage("⚠️ Please login or register to proceed.");
      setShowModal(true);
      return;
    }

    const requestData = {
      id: Date.now(),
      bookId: book.id,
      bookTitle: book.title,
      action,
      requestedBy: {
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
      date: new Date().toLocaleString(),
    };

    addRequest(requestData);

    setModalMessage(
      `✅ Your ${action === "buy" ? "purchase" : "borrow request"} for "${book.title}" has been recorded!`
    );
    setShowModal(true);
  };

  return (
    <div className="book-details-page">
      <div className="book-details-container">
        <img
          src={book.imageURL || BookImg}
          alt={book.title}
          className="book-image-details"
        />

        <div className="book-info">
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Category:</strong> {book.category}</p>
          <p><strong>Condition:</strong> {getConditionLabel(book.condition)}</p>
          <p><strong>Price:</strong> {book.price}</p>
          <p><strong>Owner:</strong> {book.owner || "Unknown"}</p>
          <p><strong>Contact:</strong> {book.ownerPhone || "Not provided"}</p>
          <p><strong>Location:</strong> {book.location || "Not specified"}</p>

          <div className="chips-container">
            <span className="book-category">{book.category}</span>
            <span className={`book-condition condition-${book.condition}`}>
              {getConditionLabel(book.condition)}
            </span>
          </div>

          {/* Action Section as Toggle Pills */}
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

          <div className="buttons-wrapper">
            <button className="btn-pill-primary" onClick={handleAction}>
              {action === "buy" ? "Buy Now" : "Request Borrow"}
            </button>
            <button
              className="btn-pill-secondary"
              onClick={() => navigate("/listings")}
            >
              Back to Listings
            </button>
          </div>
        </div>
      </div>

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
