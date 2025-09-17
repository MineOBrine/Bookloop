// src/pages/Listings.jsx
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../assets/listings.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import BookImg from "../assets/Book.png"; // placeholder image

export default function Listings() {
  const { user, books } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const getConditionLabel = (condition = "") => {
    const labels = { good: "Good", fair: "Fair", new: "Like New" };
    return labels[condition.toLowerCase()] || "Unknown";
  };

  const getCategory = (book, index) => {
    if (book.category) return book.category;
    const fallback = [
      "Engineering",
      "Computer Science",
      "Mathematics",
      "Fiction",
      "Non-fiction",
      "Literature",
      "History",
      "Economics",
    ];
    return fallback[index % fallback.length];
  };

  const handleBookClick = (book) => {
    if (!user) {
      navigate("/register");
    } else {
      // ✅ pass book object along with route
      navigate(`/book/${book.id}`, { state: { book } });
    }
  };

  // ✅ Demo fallback books
  const sampleBooks = [
    {
      id: "1",
      title: "Clean Code",
      author: "Robert C. Martin",
      owner: "Alice",
      location: "Campus Library",
      type: "buy",
      price: "₹500",
      condition: "good",
      category: "Computer Science",
      imageURL: BookImg,
    },
    {
      id: "2",
      title: "Introduction to Algorithms",
      author: "Cormen et al.",
      owner: "Bob",
      location: "Hostel Block A",
      type: "borrow",
      price: "₹50/week",
      condition: "fair",
      category: "Engineering",
      imageURL: BookImg,
    },
    {
      id: "3",
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt",
      owner: "Charlie",
      location: "Main Library",
      type: "buy",
      price: "₹650",
      condition: "new",
      category: "Computer Science",
      imageURL: BookImg,
    },
  ];

  const displayedBooks = books?.length ? books : sampleBooks;

  return (
    <div className="listings-page">
      <section className="listings-hero" data-aos="fade-down">
        <h1>Available Books</h1>
        <p>Browse and explore books shared by the community</p>
      </section>

      <div className="book-grid">
        {displayedBooks.map((book, index) => (
          <div
            key={book.id || index}
            className="book-card"
            data-aos="zoom-in"
            data-aos-delay={index * 100}
            onClick={() => handleBookClick(book)}
          >
            <img
              src={book.imageURL || BookImg}
              alt={book.title || "Book"}
              className="book-image"
            />
            <h5>{book.title || "Untitled Book"}</h5>
            <p>
              <strong>Author:</strong> {book.author || "Unknown"}
            </p>
            <p>
              <strong>Owner:</strong> {book.owner || "Anonymous"}
            </p>
            <p>
              <strong>Location:</strong> {book.location || "Not specified"}
            </p>
            <p>
              <strong>{book.type === "borrow" ? "Borrow Fee:" : "Price:"}</strong>{" "}
              {book.price || "N/A"}
            </p>

            <div className="chips-container">
              <span className="book-category">{getCategory(book, index)}</span>
              <span className={`book-condition condition-${book.condition}`}>
                {getConditionLabel(book.condition)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
