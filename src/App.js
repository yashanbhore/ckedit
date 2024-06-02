// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import EditorPage from "./components/EditorPage";
import BlogsPage from "./components/BlogsPage";
import EditPage from "./components/EditPage";
import BlogDetailPage from "./components/BlogDetailPage";

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-custom bg-custom">
          <div className="container">
          <Link className="nav-link" to="/blogs">

            <a className="navbar-brand" href="/">
              My Blog
            </a>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <Link className="navbar-brand" to="/">
                    Editor <span className="sr-only">(current)</span>
                  </Link>
                </li>
              
              </ul>
            </div>
          </div>
        </nav>

        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<EditorPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/edit/:id" element={<EditPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
