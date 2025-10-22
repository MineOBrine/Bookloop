// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../assets/home.css";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import exchangeImg from "../assets/exchange.png";
import discoverImg from "../assets/discover.png";
import requestImg from "../assets/request.png";
import uploadImg from "../assets/upload.png";

function Home() {
  const { user, books, setBooks } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: false,
      mirror: true,
    });
    AOS.refresh();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        // ✅ Get token from localStorage
        const token = localStorage.getItem("token");

        // ✅ Include Authorization header
        const res = await fetch("http://localhost:8081/api/books", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch books");
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [setBooks]);

  const personalizedBooks =
    user && Array.isArray(user.interests)
      ? books.filter((book) =>
          user.interests.some((interest) =>
            (book.category || "").toLowerCase().includes(interest.toLowerCase())
          )
        )
      : [];

  const getConditionLabel = (condition) => {
    switch (condition) {
      case "good":
        return "Good";
      case "fair":
        return "Fair";
      case "new":
        return "Like New";
      default:
        return condition || "Unknown";
    }
  };

  return (
    <div className="home-page bg-dark text-light">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container" data-aos="fade-up">
          <h1 className="display-3 fw-bold text-gradient mb-3">
            Exchange Books, Expand Knowledge
          </h1>
          <p className="lead fs-5 mb-4">
            A student-first platform to{" "}
            <strong>list, discover, and request</strong> books — academic or not
            — within your community.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <a
              href="#how-it-works"
              className="btn btn-lg btn-primary px-4 rounded-pill shadow-sm"
              data-aos="zoom-in"
              data-aos-delay="100"
            >
              See How It Works
            </a>

            <Link
              to="/listings"
              className="btn btn-lg btn-outline-light px-4 rounded-pill shadow-sm"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              Explore Books
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-5 bg-navy text-light">
        <div className="container">
          <h2
            className="fw-bold mb-5 text-center text-gradient"
            data-aos="fade-up"
          >
            How It Works
          </h2>

          {/* Step 1 */}
          <div className="horizontal-card row align-items-center mb-5" data-aos="fade-right">
            <div className="col-md-6">
              <div className="card-content p-4">
                <i className="bi bi-upload fs-1 text-primary mb-3"></i>
                <h4 className="fw-semibold">Upload</h4>
                <p className="fs-4">
                  List your books by uploading details and images in a few clicks.
                </p>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <img
                src={uploadImg}
                alt="Upload books"
                className="img-fluid rounded shadow-sm"
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="horizontal-card row align-items-center mb-5 flex-md-row-reverse" data-aos="fade-left">
            <div className="col-md-6">
              <div className="card-content p-4">
                <i className="bi bi-book fs-1 text-primary mb-3"></i>
                <h4 className="fw-semibold">Discover</h4>
                <p className="fs-4">
                  Browse academic & non-academic books shared by students like you.
                </p>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <img
                src={discoverImg}
                alt="Discover books"
                className="img-fluid rounded shadow-sm"
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="horizontal-card row align-items-center mb-5" data-aos="fade-right">
            <div className="col-md-6">
              <div className="card-content p-4">
                <i className="bi bi-currency-rupee fs-1 text-primary mb-3"></i>
                <h4 className="fw-semibold">Exchange / Buy</h4>
                <p className="fs-4">
                  Borrow or buy directly from peers; affordable and simple.
                </p>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <img
                src={exchangeImg}
                alt="Exchange books"
                className="img-fluid rounded shadow-sm"
              />
            </div>
          </div>

          {/* Step 4 */}
          <div className="horizontal-card row align-items-center flex-md-row-reverse" data-aos="fade-left">
            <div className="col-md-6">
              <div className="card-content p-4">
                <i className="bi bi-search fs-1 text-primary mb-3"></i>
                <h4 className="fw-semibold">Request</h4>
                <p className="fs-4">
                  Can’t find a book? Place a request and let the community help you.
                </p>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <img
                src={requestImg}
                alt="Request books"
                className="img-fluid rounded shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5 bg-dark text-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-5 text-gradient" data-aos="fade-up">
            Why BookLoop?
          </h2>
          <div className="row g-4">
            <div className="col-md-4" data-aos="zoom-in">
              <div className="feature-card p-4 h-100">
                <i className="bi bi-wallet2 fs-1 text-primary mb-3"></i>
                <h5 className="fw-semibold">Affordable</h5>
                <p className="small">
                  Save money by buying second-hand or exchanging books directly.
                </p>
              </div>
            </div>
            <div className="col-md-4" data-aos="zoom-in" data-aos-delay="150">
              <div className="feature-card p-4 h-100">
                <i className="bi bi-people fs-1 text-primary mb-3"></i>
                <h5 className="fw-semibold">Community Driven</h5>
                <p className="small">
                  Built for students, by students; helping each other learn.
                </p>
              </div>
            </div>
            <div className="col-md-4" data-aos="zoom-in" data-aos-delay="300">
              <div className="feature-card p-4 h-100">
                <i className="bi bi-lightning-charge fs-1 text-primary mb-3"></i>
                <h5 className="fw-semibold">Fast & Easy</h5>
                <p className="small">
                  Quick uploads, instant discovery, and simple connections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      {user && (
        <section className="container py-5" id="explore" data-aos="fade-up">
          <h2 className="text-center fw-bold mb-5 text-gradient">
            Recommended for You
          </h2>
          {loading ? (
            <div className="text-center">Loading books...</div>
          ) : personalizedBooks.length > 0 ? (
            <div className="row g-4">
              {personalizedBooks.map((book) => (
                <div key={book.id} className="col-sm-6 col-lg-4" data-aos="zoom-in">
                  <div className="card h-100 shadow border-0 bg-dark-subtle text-light card-hover">
                    <div className="card-body">
                      <h5 className="card-title fw-semibold">{book.title}</h5>
                      <p className="small mb-1">
                        <strong>Author:</strong> {book.author || "Unknown"}
                      </p>
                      <p className="small mb-1">
                        <strong>Owner:</strong> {book.owner}
                      </p>
                      <p className="small mb-2">
                        <strong>Location:</strong> {book.location || "Not specified"}
                      </p>
                      <p className="fw-semibold mb-0">
                        {book.type === "borrow" ? "Borrow Fee:" : "Price:"}{" "}
                        {book.price || "N/A"}
                      </p>
                    </div>
                    <div className="card-footer d-flex justify-content-between bg-transparent border-0">
                      <span className="badge bg-primary">{book.category}</span>
                      <span className="badge bg-secondary">
                        {getConditionLabel(book.condition)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">
              No recommendations yet. Add your interests in your profile!
            </p>
          )}
        </section>
      )}

      {/* About Section */}
      <section id="about" className="py-5" data-aos="fade-up">
        <div className="about-section">
          <h2>About BookLoop</h2>
          <p>
            BookLoop is your campus-friendly platform where students can list,
            request, and exchange academic and non-academic books. Our mission is
            to make books more accessible and affordable while fostering a stronger
            student community.
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="footer-cta" data-aos="zoom-in">
        <div className="container">
          <h2 className="fw-bold mb-3">Ready to Join the Loop?</h2>
          <p className="mb-4">
            Sign up today and start exchanging knowledge with your community.
          </p>
          <a
            href="/register"
            className="btn btn-lg btn-primary px-5 rounded-pill shadow-sm"
          >
            Get Started
          </a>
        </div>
      </section>
    </div>
  );
}

export default Home;