// src/context/UserContext.jsx
import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [requests, setRequests] = useState([]);

  /* ------------------------- User Handling ------------------------- */

  // ✅ Register new user (local only)
  const registerUser = async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser(userData);
        resolve(userData);
      }, 300); // simulate delay
    });
  };

  // ✅ Login user (local only)
  const loginUser = async (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (user && credentials.email === user.email) {
          resolve(user);
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 300);
    });
  };

  // ✅ Sign out
  const signOut = () => {
    setUser(null);
    setBooks([]);
    setRequests([]);
  };

  /* ------------------------- Book Handling ------------------------- */

  // ✅ Add a new book (local only)
  const addBook = (bookData) => {
    if (!user) return;
    const newBook = {
      ...bookData,
      id: books.length + 1, // local incremental id
      owner: user.username || user.name || "Anonymous",
      ownerEmail: user.email,
    };
    setBooks((prev) => [...prev, newBook]);
    return newBook;
  };

  // ✅ Get all uploads by this user
  const myUploads = user
    ? books.filter((b) => b.ownerEmail === user.email)
    : [];

  // ✅ Get book by ID (for BookDetails page)
  const getBookById = (id) =>
    books.find((b) => String(b.id) === String(id)) || null;

  /* ------------------------- Request Handling ------------------------- */

  // ✅ Add a new request (local only)
  const addRequest = (requestData) => {
    setRequests((prev) => [...prev, requestData]);
    return requestData;
  };

  return (
    <UserContext.Provider
      value={{
        // user state
        user,
        registerUser,
        loginUser,
        signOut,

        // books state + helpers
        books,
        setBooks,
        addBook,
        myUploads,
        getBookById,

        // requests state + helpers
        requests,
        addRequest,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
