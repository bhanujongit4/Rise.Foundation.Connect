'use client';

import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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

const BlogCreationForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [contentImages, setContentImages] = useState([]);
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
      if (mainImage) {
        const storageRef = ref(storage, `blog-images/${mainImage.name}`);
        await uploadBytes(storageRef, mainImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      const contentImageUrls = await Promise.all(
        contentImages.map(async (image) => {
          const storageRef = ref(storage, `blog-content-images/${image.file.name}`);
          await uploadBytes(storageRef, image.file);
          return await getDownloadURL(storageRef);
        })
      );

      const userEmail = session.user.email;
      const userId = session.user.id;

      const formData = {
        title,
        content,
        imageUrl,
        contentImageUrls,
        font,
        createdAt: new Date().toISOString(),
        userEmail: userEmail,
        userId: userId,
      };

      const docRef = await addDoc(collection(db, 'blogs'), formData);
      console.log('Blog post created with ID:', docRef.id);

      router.push('/blogedit');

    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const handleMainImageChange = (event) => {
    if (event.target.files[0]) {
      setMainImage(event.target.files[0]);
    }
  };

  const handleContentImagesChange = (event) => {
    if (event.target.files) {
      const newImages = Array.from(event.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setContentImages([...contentImages, ...newImages]);
    }
  };

  const removeContentImage = (index) => {
    const newImages = [...contentImages];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setContentImages(newImages);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(/images/earth2.jpeg)` }}
    >
      <main className="relative z-10 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="block text-3xl font-bold text-white sm:text-4xl lg:text-6xl lg:leading-tight mb-6">
          Create Your <span className="text-yellow-500">Blog Post</span>
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
            <label htmlFor="main-image-upload" className="block text-sm font-medium text-white">Main Image</label>
            <input
              type="file"
              id="main-image-upload"
              onChange={handleMainImageChange}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
            />
            {mainImage && (
              <div className="mt-2">
                <img src={URL.createObjectURL(mainImage)} alt="Main image preview" className="w-32 h-32 object-cover rounded-md" />
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="content-images-upload" className="block text-sm font-medium text-white">Content Images</label>
            <input
              type="file"
              id="content-images-upload"
              onChange={handleContentImagesChange}
              accept="image/*"
              multiple
              className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
            />
          </div>
          
          {contentImages.length > 0 && (
            <div>
              <h3 className="text-white text-lg font-medium mb-2">Uploaded Content Images:</h3>
              <div className="grid grid-cols-3 gap-4">
                {contentImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image.preview} alt={`Content image ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() => removeContentImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <button type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
              Publish Your Blog Post
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default BlogCreationForm;
