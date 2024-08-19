'use client';

import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from 'next/image';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const eventsListing = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchEvents = async () => {
      if (session && session.user) {
        const eventsCollection = collection(db, 'events');
        const q = query(eventsCollection, where("userId", "==", session.user.id));
        const eventSnapshot = await getDocs(q);
        const eventsList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsList);
      }
    };

    if (status === "authenticated") {
      fetchEvents();
    } else if (status === "unauthenticated") {
      router.push("/authentication/login");
    }
  }, [status, session, router]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedEvent({ ...selectedEvent });
  };

  const handleEditChange = (e) => {
    setEditedEvent({ ...editedEvent, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      const eventRef = doc(db, 'events', editedEvent.id);
      await updateDoc(eventRef, editedEvent);
      setSelectedEvent(editedEvent);
      setEvents(events.map(event => event.id === editedEvent.id ? editedEvent : event));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDoc(doc(db, 'events', selectedEvent.id));
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setSelectedEvent(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  if (status === "unauthenticated") {
    return <p>Access denied. Please log in.</p>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <main className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white mb-6">
          Your <span className="text-yellow-500">Events</span>
        </h1>
        <Link href="/eventcreation" className="mb-8 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
          Create New Event
        </Link>
        {selectedEvent ? (
          <div className="bg-white dark:bg-neutral-900 shadow-md rounded-lg p-6 mb-6">
            <button onClick={() => setSelectedEvent(null)} className="mb-4 text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300">
              Back to List
            </button>
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={editedEvent.title}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                  placeholder="Title"
                />
                <textarea
                  name="content"
                  value={editedEvent.content}
                  onChange={handleEditChange}
                  rows="4"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                  placeholder="Content"
                ></textarea>
                <input
                  type="text"
                  name="link"
                  value={editedEvent.link}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                  placeholder="Link"
                />
                <input
                  type="date"
                  name="date"
                  value={editedEvent.date}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                />
                <input
                  type="text"
                  name="location"
                  value={editedEvent.location}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                  placeholder="Location"
                />
                <button onClick={handleEditSubmit} className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                  Save Changes
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{selectedEvent.title}</h2>
                {selectedEvent.imageUrl && (
                  <Image 
                    src={selectedEvent.imageUrl} 
                    alt={selectedEvent.title} 
                    width={800} 
                    height={450} 
                    className="w-full mb-4 rounded-lg" 
                  />
                )}
                <p className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-wrap" style={{ fontFamily: selectedEvent.font }}>
                  {selectedEvent.content}
                </p>
                <p className="text-yellow-500 dark:text-yellow-400 mb-2">Link: {selectedEvent.link}</p>
                <p className="text-gray-600 dark:text-gray-300 mb-2">Date: {selectedEvent.date}</p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Location: {selectedEvent.location}</p>
                <div className="flex space-x-4">
                  <button onClick={handleEditClick} className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                    Edit
                  </button>
                  <button onClick={handleDeleteClick} className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            {events.map((event) => (
              <div key={event.id} onClick={() => handleEventClick(event)} className="bg-white dark:bg-neutral-900 shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition duration-300">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{event.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {event.content.substring(0, 100)}...
                </p>
                <p className="text-gray-500 dark:text-gray-400">Date: {event.date}</p>
                <p className="text-gray-500 dark:text-gray-400">Location: {event.location}</p>
              </div>
            ))}
          </div>
        )}
        {isDeleteDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this event? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button onClick={() => setIsDeleteDialogOpen(false)} className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:ring-neutral-700 dark:focus:ring-offset-neutral-800">
                  Cancel
                </button>
                <button onClick={handleDeleteConfirm} className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default eventsListing;