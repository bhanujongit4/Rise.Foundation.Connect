'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Link from 'next/link';

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchUserName = async (userId) => {
    try {
      let userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', '==', userId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          userDoc = querySnapshot.docs[0];
        } else {
          return 'Unknown User';
        }
      }
      
      return userDoc.data().name;
    } catch (error) {
      console.error("Error fetching user data: ", error);
      return 'Unknown User';
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogCollection = collection(db, 'blogs');
        const blogSnapshot = await getDocs(blogCollection);
        const blogList = blogSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const blogsWithUserNames = await Promise.all(blogList.map(async (blog) => {
          const userName = await fetchUserName(blog.userId);
          return {
            ...blog,
            userName
          };
        }));

        setBlogs(blogsWithUserNames);
      } catch (error) {
        console.error("Error fetching blogs: ", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundColor: `black` }}
    >
      <main className="relative z-10 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="block text-3xl font-bold text-white sm:text-4xl lg:text-6xl lg:leading-tight mb-6">
          All <span className="text-green-500">Blogs</span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-zinc-700 bg-opacity-40 rounded-lg overflow-hidden shadow-lg">
              {blog.imageUrl && (
                <img className="w-full h-48 object-cover" src={blog.imageUrl} alt={blog.title} />
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold text-white mb-2">{blog.title}</h2>
                <p className="text-white mb-4">{blog.content.substring(0, 100)}...</p>
                <div className="text-sm text-green-500 mb-2">
                  By: <Link href={`/author/${blog.userId}`} className="hover:underline">{blog.userName}</Link>
                </div>
                <div className="text-sm text-green-500 mb-4">
                  Posted on: {new Date(blog.createdAt).toLocaleDateString()}
                </div>
                <Link href={`/allblogs/${blog.id}`} className="inline-block bg-green-text-green-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition duration-300">
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllBlogs;