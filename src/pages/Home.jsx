import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import BookCard from "../components/BookCard";
import Loader from "../components/Loader";

const Home = () => {
  const { user, books, setBooks, authFetch } = useUser(); // ✅ Added authFetch
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        // ✅ Use authFetch (auto includes Authorization header)
        const res = await authFetch("http://localhost:8081/api/books");

        if (!res.ok) {
          if (res.status === 403) {
            console.error("Access forbidden — token may be invalid or expired.");
          }
          throw new Error("Failed to fetch books");
        }

        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [setBooks, authFetch]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Welcome {user?.username ? user.username : "Guest"} 👋
      </h1>

      {loading ? (
        <Loader />
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-lg">No books available at the moment 📚</p>
      )}
    </div>
  );
};

export default Home;
