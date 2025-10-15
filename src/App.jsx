// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Listings from "./pages/Listings";
import Home from "./pages/Home";
import Request from "./pages/Request";
import RequestsBoard from "./pages/RequestsBoard";
import Layout from "./Components/Layout";
import PrivateRoute from "./Components/PrivateRoute";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import BookDetails from "./pages/BookDetails";

function App() {
  return (
    <Routes>
      {/* Shared layout for routes */}
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listings" element={<Listings />} />

        {/* Protected Routes */}
        <Route
          path="/request"
          element={
            <PrivateRoute>
              <Request />
            </PrivateRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <Upload />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/book/:id"
          element={
            <PrivateRoute>
              <BookDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <PrivateRoute>
              <RequestsBoard />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
