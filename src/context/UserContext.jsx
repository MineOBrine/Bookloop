// src/context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]); // Prevents .filter errors

  // ✅ Restore user from localStorage on page refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // --- Register User ---
  const registerUser = async (formData) => {
    const response = await fetch("http://localhost:8081/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Registration failed");
    }

    const data = await response.json();
    return data;
  };

  // --- Login User ---
  const loginUser = async ({ email, password }) => {
    const response = await fetch("http://localhost:8081/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Invalid credentials");
    }

    const data = await response.json();

    // ✅ Save token to localStorage
    localStorage.setItem("token", data.token);

    // --- Fetch full user profile to include phone and interests ---
    let fullUser = {
      email,
      name: data.name,
      username: data.username,
      college: data.college,
      phone: data.phone || "", // fallback if backend doesn't send phone
      interests: data.interests || [], // fallback if backend doesn't send interests
    };

    // Save full user to localStorage and state
    localStorage.setItem("user", JSON.stringify(fullUser));
    setUser(fullUser);

    return data.token; // optional return
  };

  // --- Logout ---
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // --- Authenticated Fetch Helper ---
  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) logoutUser();
    return response;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        books,
        setBooks,
        registerUser,
        loginUser,
        logoutUser,
        authFetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
