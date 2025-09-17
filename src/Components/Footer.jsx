// src/Components/Footer.jsx
import React from "react";
import { useUser } from "../context/UserContext";
import "../Components/footer.css";

export default function Footer() {
  const { user } = useUser();

  return (
    <footer className="home-footer d-flex flex-column flex-md-row justify-content-between align-items-center">
      <div className="footer-left text-center text-md-start mb-3 mb-md-0">
        <p className="mb-1 fw-semibold">BookLoop — Built for students, by students.</p>
        {user && (
          <p className="small mb-0">Logged in as: {user.name} ({user.email})</p>
        )}
      </div>
      <div className="footer-right text-center text-md-end">
        <p className="mb-1">📧 acsc.business@bookloop.com | 📞 +91 90000 00000</p>
        <p className="mb-0 small">&copy; {new Date().getFullYear()} BookLoop. All rights reserved.</p>
      </div>
    </footer>
  );
}
