// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import BookCard from "../Components/BookCard";
import Loader from "../Components/Loader";

const Home = () => {
  const { authFetch, books, setBooks } = useUser();
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const response = await authFetch("http://localhost:8081/api/books");
      if (!response.ok) throw new Error("Failed to fetch books");

      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
        📚 Available Books
      </h1>

      {books.length === 0 ? (
        <p className="text-center text-gray-500">No books available right now.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
