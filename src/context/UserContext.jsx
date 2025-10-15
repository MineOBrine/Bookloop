// src/context/UserContext.jsx
import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const API_URL = "http://localhost:8081/api/auth";

  // --- Register User ---
  const registerUser = async (formData) => {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg);
    }

    return await response.text(); // "User registered successfully!"
  };

  // --- Login User ---
  const loginUser = async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg);
    }

    const result = await response.text(); // "Login successful. Token: <token>"
    const token = result.replace("Login successful. Token: ", "");

    // Store token in localStorage (optional)
    localStorage.setItem("authToken", token);

    // Set user (just store email for now)
    setUser({ email: credentials.email, token });

    return result;
  };

  const logoutUser = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, registerUser, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
