"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../firebaseConfig"; // Adjust this import path as needed
import Image from 'next/image';

const Account = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  
    useEffect(() => {
      const fetchProfilePicture = async () => {
        if (status === "authenticated" && session.user) {
          try {
            const userRef = doc(db, "users", session.user.id);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setProfilePictureUrl(userData.profilePictureUrl || null);
            }
          } catch (error) {
            console.error("Error fetching profile picture:", error);
          }
        }
      };
  
      fetchProfilePicture();
    }, [status, session]);
  
    const handleLogout = async () => {
      await signOut({ redirect: false });
      setIsMenuOpen(false);
      
      router.push('');
    };
  return (
    <>
               <div className="ml-6 relative">
      <div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Image
            className="h-12 rounded-full"
            src={profilePictureUrl || "/default-avatar.png"}
            alt=""
            width={48}
            height={48}
          />
        </button>
      </div>
      {isMenuOpen && (
        <div className="origin-top-right absolute right-0 mt-2 z-50 w-56 rounded-md shadow-lg py-1 bg-zinc-800 ring-1 ring-black ring-opacity-5">
          <button
            onClick={handleLogout}
            className="block px-4 py-3 text-base text-white hover:bg-zinc-800 w-full text-left"
          >
            Logout
          </button>
          <Link href="/profile" className="block px-4 py-3 text-base text-white hover:bg-zinc-800 w-full text-left">
            Profile
          </Link>
          <Link href="/blogedit" className="block px-4 py-3 text-base text-white hover:bg-zinc-800 w-full text-left">
            Your Blogs
          </Link>
          <Link href="/eventedit" className="block px-4 py-3 text-base text-white hover:bg-zinc-800 w-full text-left">
            Your Events
          </Link>
        </div>
      )}
    </div>
  </>
  )
}

export default Account