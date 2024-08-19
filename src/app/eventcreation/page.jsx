'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
const storage = getStorage(app);

const CreationForm = () => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [font, setFont] = useState('Arial');
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/authentication/login");
    }
  }, [status, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!session || !session.user) {
      console.error('User not authenticated');
      return;
    }

    try {
      let imageUrl = '';
      if (image) {
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const userEmail = session.user.email;
      const userId = session.user.id;

      const formData = {
        title,
        content,
        imageUrl,
        link,
        font,
        createdAt: new Date().toISOString(),
        userEmail: userEmail,
        userId: userId,
      };

      const docRef = await addDoc(collection(db, 'events'), formData);
      console.log('Project created with ID:', docRef.id);

      router.push('/eventedit');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(/images/earth.jpg)` }}
    >
      <main className="relative z-10 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="block text-3xl font-bold text-white sm:text-4xl lg:text-6xl lg:leading-tight mb-6">
          Create Your <span className="text-yellow-500">Event</span>
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 text-white bg-white bg-opacity-40 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-white">Link</label>
            <input
              type="text"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 text-white bg-white bg-opacity-40 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-white">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="10"
              className="mt-1 block w-full px-3 py-2 text-white bg-white bg-opacity-40 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            ></textarea>
          </div>
          <div>
            <label htmlFor="image-upload" className="block text-sm font-medium text-white">Image</label>
            <input
              type="file"
              id="image-upload"
              onChange={handleImageChange}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
            />
          </div>
          
          <div>
            <button type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
              Publish Your Project
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreationForm;