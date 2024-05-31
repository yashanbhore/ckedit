// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import EditorPage from "./components/EditorPage";
import BlogsPage from "./components/BlogsPage";
import EditPage from "./components/EditPage";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Editor</Link></li>
            <li><Link to="/blogs">Blogs</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<EditorPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/edit/:id" element={<EditPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
