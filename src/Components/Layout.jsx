// src/Components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom"; // import Outlet
import "../assets/layout.css";

function Layout() {
  return (
    <>
      <Navbar />
      <main className="layout-main">
        <Outlet /> {/* <-- this is required */}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
