'use client';

import React, { useState } from 'react';
import Account from '../account/page';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  let navLinks = [
    { href: '/allblogs', label: 'Read' },
    { href: '/authentication/login', label: 'Login' },
    { href: '/authentication/signup', label: 'Signup' },
    { href: '/allevents', label: 'Events' },
  ];
  
  // Remove the 'Login' and 'Signup' links if authenticated
  if (status === 'authenticated') {
    navLinks = navLinks.filter(link => link.href !== '/authentication/login' && link.href !== '/authentication/signup');
    
    // Add the 'Create Blog' link for authenticated users
    navLinks.push({ href: '/listing', label: 'Create Blog' });
    navLinks.push({ href: '/eventcreation', label: 'Create Event' });
  }

  return (
    <header className="bg-zinc-900 dark:bg-black shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl text-white">
          <Link href="/">Home</Link>
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white hover:text-yellow-500 dark:hover:text-yellow-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center">
          {status === 'authenticated' && <Account />}
          {/* Mobile Menu Button */}
          <button
            className="ml-4 text-white md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 px-4 text-white hover:text-yellow-500 dark:hover:text-yellow-400"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}