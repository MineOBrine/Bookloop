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
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
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
      let errorMsg = "Registration failed";
      try {
        const err = await response.json();
        errorMsg = err.error || err.message || errorMsg;
      } catch {
        const text = await response.text();
        errorMsg = text || errorMsg;
      }
      throw new Error(errorMsg);
    }

    // ✅ Auto-login after successful signup
    await loginUser({ email: formData.email, password: formData.password });
  };

  // --- Login User ---
  const loginUser = async ({ email, password }) => {
    const response = await fetch("http://localhost:8081/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      let errorMsg = "Invalid credentials";
      try {
        const err = await response.json();
        errorMsg = err.error || err.message || errorMsg;
      } catch {
        const text = await response.text();
        errorMsg = text || errorMsg;
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();

    // ✅ Save token to localStorage
    localStorage.setItem("token", data.token);

    // --- Build full user object ---
    const fullUser = {
      email,
      name: data.name,
      username: data.username,
      college: data.college,
      phone: data.phone || "",
      interests: data.interests || [],
    };

    // Save user to localStorage and state
    localStorage.setItem("user", JSON.stringify(fullUser));
    setUser(fullUser);

    return data.token; // optional
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
    if (response.status === 401 || response.status === 403) logoutUser();
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
