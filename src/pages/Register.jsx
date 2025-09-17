// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { FcGoogle } from "react-icons/fc";
import { useUser } from "../context/UserContext";
import "../assets/register.css";
import NotificationModal from "../Components/NotificationModal";
import { categories } from "../data/categories";

function Register() {
  const { registerUser, loginUser, user } = useUser();
  const navigate = useNavigate();

  const [mode, setMode] = useState("signup"); // "signup" or "signin"
  const [step, setStep] = useState(1); // step 1: info | step 2: interests
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    college: "",
    password: "",
    interests: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const interestsList = categories.filter((cat) => cat !== "Other");

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleInterest = (interest) =>
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "signup") {
        if (step === 1) {
          setStep(2);
          return;
        }
        await registerUser(formData);
        setShowModal(true);
      } else {
        await loginUser({
          email: formData.email,
          password: formData.password,
        });
        setShowModal(true);
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <div className="register-page bg-gradient">
      <section className="hero-section register-hero">
        <div className="container hero-container" data-aos="fade-up">
          {/* Left Column */}
          <div className="hero-text" data-aos="fade-right">
            <h1 className="display-3 fw-bold text-gradient mb-4">
              {mode === "signup" ? "Join BookLoop" : "Welcome Back"}
            </h1>
            <p className="lead fs-5 text-light">
              {mode === "signup"
                ? "Sign up to start exchanging books with your community"
                : "Sign in to continue your journey"}
            </p>
          </div>

          {/* Right Column */}
          <div className="hero-form" data-aos="fade-left">
            <div className="register-card">
              {mode === "signup" ? (
                step === 1 ? (
                  <form onSubmit={handleSubmit}>
                    {error && <p className="error-text">{error}</p>}
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="college"
                      placeholder="College Name"
                      value={formData.college}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="submit"
                      className="btn btn-lg btn-primary w-100 mt-3"
                    >
                      Next
                    </button>
                    <div className="google-btn disabled mt-3">
                      <FcGoogle size={22} style={{ marginRight: "8px" }} />
                      Continue with Google{" "}
                      <span className="note">(Coming soon)</span>
                    </div>
                    <p className="switch-text mt-3">
                      Already have an account?{" "}
                      <span
                        className="switch-link"
                        onClick={() => {
                          setMode("signin");
                          setStep(1);
                        }}
                      >
                        Sign In
                      </span>
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <h3 className="mb-4 text-gradient">Select Your Interests</h3>
                    {error && <p className="error-text">{error}</p>}
                    <div className="interests-grid">
                      {interestsList.map((interest, i) => (
                        <div
                          key={i}
                          className={`interest-card ${
                            formData.interests.includes(interest)
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => toggleInterest(interest)}
                        >
                          {interest}
                        </div>
                      ))}
                    </div>
                    <button
                      type="submit"
                      className="btn btn-lg btn-primary w-100 mt-3"
                    >
                      Finish
                    </button>
                  </form>
                )
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && <p className="error-text">{error}</p>}
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary w-100 mt-3"
                  >
                    Sign In
                  </button>
                  <p className="switch-text mt-3">
                    Don’t have an account?{" "}
                    <span
                      className="switch-link"
                      onClick={() => {
                        setMode("signup");
                        setStep(1);
                      }}
                    >
                      Sign Up
                    </span>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <NotificationModal
        show={showModal}
        onClose={handleCloseModal}
        message={
          mode === "signup"
            ? "Registration successful! Welcome aboard 🎉"
            : "Sign in Successful! 🎉"
        }
      />
    </div>
  );
}

export default Register;
