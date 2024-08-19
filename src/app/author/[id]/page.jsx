"use client"

import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Link from 'next/link';
import { UserCircleIcon, MapPinIcon, BriefcaseIcon, CalendarIcon } from '@heroicons/react/24/solid';

const AuthorPage = ({ params }) => {
  const [author, setAuthor] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const authorId = params.id;

  useEffect(() => {
    const fetchAuthorBlogsAndEvents = async () => {
      try {
        // Fetch author's details
        let userDoc = await getDoc(doc(db, 'users', authorId));
        
        if (!userDoc.exists()) {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('uid', '==', authorId));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            userDoc = querySnapshot.docs[0];
          }
        }
        
        if (userDoc.exists()) {
          setAuthor(userDoc.data());
        } else {
          setAuthor({ name: 'Unknown Author' });
        }

        // Fetch blogs by this author
        const blogCollection = collection(db, 'blogs');
        const authorBlogsQuery = query(blogCollection, where('userId', '==', authorId));
        const blogSnapshot = await getDocs(authorBlogsQuery);
        const blogList = blogSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBlogs(blogList);

        // Fetch events by this author
        const eventCollection = collection(db, 'events');
        const authorEventsQuery = query(eventCollection, where('userId', '==', authorId));
        const eventSnapshot = await getDocs(authorEventsQuery);
        const eventList = eventSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventList);
      } catch (error) {
        console.error("Error fetching author's details, blogs, and events: ", error);
      }
    };

    fetchAuthorBlogsAndEvents();
  }, [authorId]);

  const formatDate = (dateField) => {
    if (!dateField) return 'Unknown date';
    
    let date;
    if (dateField instanceof Date) {
      date = dateField;
    } else if (dateField.toDate && typeof dateField.toDate === 'function') {
      date = dateField.toDate();
    } else if (dateField.seconds) {
      date = new Date(dateField.seconds * 1000);
    } else if (typeof dateField === 'string') {
      date = new Date(dateField);
    } else {
      return 'Invalid date';
    }
    
    return date.toLocaleDateString();
  };

  if (!author) {
    return <div className="text-center mt-8 text-white">Loading...</div>;
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url('/images/stars.jpg')` }}
    >
      <main className="relative z-10 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-zinc-950 bg-opacity-80 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="w-32 h-32 mb-4 md:mb-0 md:mr-6">
              {author.profilePictureUrl ? (
                <img src={author.profilePictureUrl} alt={author.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <UserCircleIcon className="w-full h-full text-white" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{author.name}</h1>
              {author.location && (
                <p className="text-yellow-500 mb-2 flex items-center">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  {author.location}
                </p>
              )}
              <p className="text-white mb-4">{author.bio}</p>
              {author.organization && (
                <p className=" text-white mb-2 flex items-center">
                  <BriefcaseIcon className="w-5 h-5 mr-2" />
                  {author.organization}
                </p>
              )}
              <div className="flex space-x-4 mb-4">
                {author.twitter && (
                  <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:text-yellow-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                )}
                {author.linkedin && (
                  <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-yellow-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                )}
                {author.github && (
                  <a href={`https://github.com/${author.github}`} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-yellow-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">Blogs by <span className="text-yellow-500">{author.name}</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-zinc-800 bg-opacity-40 rounded-lg overflow-hidden shadow-lg">
              {blog.imageUrl && (
                <img className="w-full h-48 object-cover" src={blog.imageUrl} alt={blog.title} />
              )}
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">{blog.title}</h3>
                <p className="text-white mb-4">{blog.content.substring(0, 100)}...</p>
                <p className="text-sm text-yellow-500 mb-2 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Posted on: {formatDate(blog.createdAt)}
                </p>
                <Link href={`/blogs/${blog.id}`} className="inline-block bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition duration-300">
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
        {blogs.length === 0 && (
          <p className="text-center text-white mb-8">No blogs found for this author.</p>
        )}

        <h2 className="text-2xl font-bold text-white mb-6">Events by <span className="text-yellow-500">{author.name}</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-zinc-800 bg-opacity-40 rounded-lg overflow-hidden shadow-lg">
              {event.imageUrl && (
                <img className="w-full h-48 object-cover" src={event.imageUrl} alt={event.title} />
              )}
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                <p className="text-white mb-4">{event.description
              }...</p>
                <p className="text-sm text-yellow-500 mb-2 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Date: {formatDate(event.date)}
                </p>
                <p className="text-sm text-yellow-500 mb-2 flex items-center">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  Location: {event.location}
                </p>
                <Link href={`/events/${event.id}`} className="inline-block bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition duration-300">
                  View Event
                </Link>
              </div>
            </div>
          ))}
        </div>
        {events.length === 0 && (
          <p className="text-center text-white">No events found for this author.</p>
        )}
      </main>
    </div>
  );
};

export default AuthorPage;