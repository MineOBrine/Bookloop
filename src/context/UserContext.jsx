import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]); // ✅ default empty array (fixes .filter issue)

  // --- Register ---
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

    setUser(formData); // temporarily set user
    return await response.text();
  };

  // --- Login ---
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

    const data = await response.text();
    setUser({ email }); // temporarily set user
    return data; // returns dummy token
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, books, setBooks, registerUser, loginUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
