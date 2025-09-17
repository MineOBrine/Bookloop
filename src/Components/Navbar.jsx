// src/Components/Navbar.jsx
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../Components/Navbar.css";
import { useUser } from "../context/UserContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUser();
  const location = useLocation(); // detect current route


  // Smooth scroll handler
  const scrollToSection = (id) => {
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setMenuOpen(false);
    }
  };

  // Check if on home page
  const isHomePage = location.pathname === "/";

  return (
    <nav className="home-navbar navbar navbar-expand-lg fixed-top shadow-sm">
      <div className="container">
        {/* Logo */}
        {isHomePage ? (
          <button
            className="navbar-brand fw-bold fs-3 text-gradient btn btn-link p-0"
            onClick={() => scrollToSection(".hero-section")}
          >
            BookLoop
          </button>
        ) : (
          <NavLink
            to="/"
            className="navbar-brand fw-bold fs-3 text-gradient"
            onClick={() => setMenuOpen(false)}
          >
            BookLoop
          </NavLink>
        )}

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {!user ? (
              <>
                {isHomePage && (
                  <>

                    <li className="nav-item mx-2">
                      <button
                        className="nav-link btn btn-link p-0"
                        onClick={() => scrollToSection("#how-it-works")}
                      >
                        How It Works
                      </button>
                    </li>

                    <li className="nav-item mx-2">
                      <button
                        className="nav-link btn btn-link p-0"
                        onClick={() => scrollToSection("#features")}
                      >
                        Features
                      </button>
                    </li>

                    <li className="nav-item mx-2">
                      <button
                        className="nav-link btn btn-link p-0"
                        onClick={() => scrollToSection("#about")}
                      >
                        About
                      </button>
                    </li>

                  </>
                )}
                <li className="nav-item mx-2">
                  <NavLink
                    to="/register"
                    className="btn btn-sm btn-primary rounded-pill px-3"
                    onClick={() => setMenuOpen(false)}
                  >
                    Join Now
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item mx-2">
                  <NavLink
                    to="/"
                    className="nav-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    Home
                  </NavLink>
                </li>
                <li className="nav-item mx-2">
                  <NavLink
                    to="/listings"
                    className="nav-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    Listings
                  </NavLink>
                </li>
                <li className="nav-item mx-2">
                  <NavLink
                    to="/request"
                    className="nav-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    Request
                  </NavLink>
                </li>
                <li className="nav-item mx-2">
                  <NavLink
                    to="/upload"
                    className="nav-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    Upload
                  </NavLink>
                </li>
                <li className="nav-item mx-2">
                  <NavLink
                    to="/profile"
                    className="nav-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
