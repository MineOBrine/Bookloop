// src/Components/PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import NotificationModal from "./NotificationModal";
import "../assets/privateRoute.css";

export default function PrivateRoute({ children }) {
  const { user, loadingUser } = useUser(); // assume loadingUser for async auth check
  const [showNotif, setShowNotif] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!loadingUser && !user) {
      setShowNotif(true);
      const timer = setTimeout(() => {
        setShowNotif(false);
        setRedirect(true);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [user, loadingUser]);

  if (loadingUser) {
    // optionally show a loader while user auth is being verified
    return (
      <div className="loading-container">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!user && redirect) {
    return <Navigate to="/register" replace />;
  }

  return (
    <>
      {!user && showNotif && (
        <NotificationModal
          show={true}
          message="🔒 Please register or sign in to access this page."
          type="info"
          onClose={() => setShowNotif(false)}
        />
      )}
      {user ? children : null}
    </>
  );
}
