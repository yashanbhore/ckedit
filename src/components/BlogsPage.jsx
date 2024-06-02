// components/BlogsPage.jsx
import React, { useEffect, useState } from "react";
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const querySnapshot = await getDocs(collection(db, 'editorData'));
      setBlogs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'editorData', id));
    setBlogs(blogs.filter(blog => blog.id !== id));
  };

  return (
    <div>
      <h2 className="mb-4">Blogs</h2>
      <div className="list-group">
        {blogs.map(blog => (
          <div key={blog.id} className="list-group-item d-flex justify-content-between align-items-center">
            <Link to={`/blog/${blog.id}`} className="text-dark">{blog.title || "Untitled"}</Link>
            <div>
              <Link className="btn btn-primary mr-2" to={`/edit/${blog.id}`}>Edit</Link>
              <button className="btn btn-danger" onClick={() => handleDelete(blog.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogsPage;
