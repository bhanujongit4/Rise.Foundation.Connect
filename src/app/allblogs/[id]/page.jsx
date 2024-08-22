'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const BlogPost = () => {
  const params = useParams();
  const id = params?.id;
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (id) {
        const blogDoc = doc(db, 'blogs', id);
        const blogSnapshot = await getDoc(blogDoc);
        if (blogSnapshot.exists()) {
          setBlog({ id: blogSnapshot.id, ...blogSnapshot.data() });
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) {
    return <div className="text-white">Loading...</div>;
  }

  const renderContentWithImages = () => {
    const contentParts = blog.content.split('[IMAGE]');
    return contentParts.map((part, index) => (
      <React.Fragment key={index}>
        <p className="text-white whitespace-pre-wrap">{part}</p>
        {index < blog.contentImageUrls.length && (
          <img 
            src={blog.contentImageUrls[index]} 
            alt={`Content image ${index + 1}`} 
            className="w-full rounded-md my-4"
          />
        )}
      </React.Fragment>
    ));
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundColor: `black` }}
    >
      <main className="relative z-10 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="block text-3xl font-bold text-white sm:text-4xl lg:text-6xl lg:leading-tight mb-6">
          <span className="text-yellow-500">{blog.title}</span>
        </h1>
        <div className="space-y-6">
          {blog.imageUrl && (
            <div>
              <img src={blog.imageUrl} alt={blog.title} className="w-full rounded-md" />
            </div>
          )}
          <div>{renderContentWithImages()}</div>
          <div className="text-sm text-yellow-500">
            <p>By: {blog.userName}</p>
            <p>Posted on: {new Date(blog.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPost;
