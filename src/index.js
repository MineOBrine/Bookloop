import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Import Bootstrap & AOS
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import AOS from "aos";

// Wrapper component to initialize AOS once
function Main() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // you can tweak settings here
  }, []);

  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Main />);

// Performance tracking (optional)
reportWebVitals();
