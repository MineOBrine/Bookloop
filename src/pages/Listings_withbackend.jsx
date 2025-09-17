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

  const getConditionLabel = (condition) => {
    switch (condition) {
      case "good":
        return "Good";
      case "fair":
        return "Fair";
      case "new":
        return "Like New";
      default:
        return condition || "Unknown";
    }
  };

  // Assign a fallback category if missing
  const getCategory = (book, index) => {
    if (book.category) return book.category;

    const fallbackCategories = [
      "Engineering",
      "Computer Science",
      "Mathematics",
      "Fiction",
      "Non-fiction",
      "Literature",
      "History",
      "Economics",
    ];
    return fallbackCategories[index % fallbackCategories.length];
  };

  const handleBookClick = (book) => {
    if (!user) {
      navigate("/register");
    } else {
      navigate(`/book/${book.id}`);
    }
  };

  // ✅ Sample books (fallback if no books are loaded from context)
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

  const displayedBooks = books.length > 0 ? books : sampleBooks;

  return (
    <div className="listings-page">
      {/* ✅ Hero Section */}
      <div className="listings-hero" data-aos="fade-down">
        <h1>Available Books</h1>
        <p>Browse and explore books shared by the community</p>
      </div>

      {/* ✅ Book Grid */}
      <div className="book-grid">
        {displayedBooks.map((book, index) => (
          <div
            key={book.id}
            className="book-card"
            data-aos="zoom-in"
            data-aos-delay={index * 100}
            onClick={() => handleBookClick(book)}
          >
            {/* Book Image */}
            <img
              src={book.imageURL || BookImg}
              alt={book.title}
              className="book-image"
            />

            {/* Book Info */}
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

            {/* ✅ Chips Container */}
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
