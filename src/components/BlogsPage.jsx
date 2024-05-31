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
      <h2>Blogs</h2>
      {blogs.map(blog => (
        <div key={blog.id}>
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          <Link to={`/edit/${blog.id}`}>Edit</Link>
          <button onClick={() => handleDelete(blog.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default BlogsPage;
