import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Restore user from localStorage (if token exists)
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    return token && email ? { email, token } : null;
  });

  const [books, setBooks] = useState([]); // ✅ Prevents .filter errors

  // --- Register User ---
  const registerUser = async (formData) => {
    const response = await fetch("http://localhost:8081/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const data = await response.json(); // Expecting a JSON response
    setUser(formData);
    return data;
  };

  // --- Login User ---
 // UserContext.jsx
const loginUser = async ({ email, password }) => {
  const response = await fetch("http://localhost:8081/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  // ✅ Parse JSON response (token + user info)
  const data = await response.json();

  // ✅ Set user context
  setUser({
    email,
    name: data.name,
    username: data.username,
    college: data.college,
  });

  // ✅ Save token to localStorage
  localStorage.setItem("token", data.token);

  return data.token; // optional return
};



  // --- Logout ---
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
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
