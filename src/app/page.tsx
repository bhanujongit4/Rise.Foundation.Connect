'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Slack, Calendar, BarChart2, Users, BookOpen, Volume2 } from 'react-feather';


const HomePage = () => {
  return (
    <div className="bg-custom-gradient dark:bg-black min-h-screen relative">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/earth.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          quality={100}
          priority
          className="w-full h-full"
        />
      </div>
      
      <div className="relative">
       
        <main className="relative max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
          <br></br>
          <br></br>
          <br></br>
          <br></br>
            <h1 className="text-4xl font-extrabold text-zinc-900 sm:text-4xl lg:text-5xl">
              Unite for a Greener 
              <span className='text-green-500'> Future</span>
              <br></br>
              
              
            </h1>
            <p className="mt-3 max-w-xl font-bold mx-auto text-xl text-white">
              Connect, collaborate, and make an impact with like-minded organizations dedicated to environmental protection.
            </p>
            <div className="mt-5 flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-x-3 sm:space-y-0">
              <Link href="/eventcreation" className="rounded-md shadow w-full sm:w-auto">
                <span className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-green-500 hover:bg-yellow-400 dark:text-white dark:bg-yellow-550 dark:hover:bg-yellow-400">
                  Host an Event
                </span>
              </Link>
              <Link href="/authentication/signup" className="rounded-md shadow w-full sm:w-auto">
                <span className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-500 bg-white hover:bg-gray-50 dark:text-yellow-400 dark:bg-black dark:hover:bg-black">
                  Join Us Now
                </span>
              </Link>
            </div>
          </div>
           {/* Features Section */}
           <div className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
        { icon: <Slack className="w-8 h-8" />, title: 'Sustainable Practices', description: 'Learn and share eco-friendly methods with our global community' },
        { icon: <Calendar className="w-8 h-8" />, title: 'Event Management', description: 'Organize and join impactful environmental events' },
        { icon: <BarChart2 className="w-8 h-8" />, title: 'Impact Analytics', description: 'Measure and visualize your environmental initiatives' },
        { icon: <Users className="w-8 h-8" />, title: 'Community Building', description: 'Connect with passionate eco-advocates worldwide' },
        { icon: <BookOpen className="w-8 h-8" />, title: 'Resource Sharing', description: 'Access a wealth of environmental knowledge' },
        { icon: <Volume2 className="w-8 h-8" />, title: 'Advocacy Tools', description: 'Amplify your voice for a greener future' },
      ].map((feature, index) => (
                <div key={index} className="bg-blue-200 dark:bg-zinc-950 bg-opacity-70 dark:bg-opacity-50 overflow-hidden shadow rounded-lg">
                  <div className="p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 text-green-500 dark:text-green-400">
                        {feature.icon}
                      </div>
                      <div className="ml-4 flex-1">
                        <dt className="text-lg font-medium text-gray-900 dark:text-white truncate">
                          {feature.title}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300">
                          {feature.description}
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial Section */}
          <div className="mt-10 bg-blue-100 dark:bg-zinc-950 bg-opacity-65 dark:bg-opacity-80 overflow-hidden shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">What Our Members Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className=" text-gray-700 dark:text-gray-300">
                <p className="mb-2">"This platform has revolutionized how we connect with other organizations. The shared commitment to sustainability is inspiring!"</p>
                <p className="font-bold">- Jordan Smith, Eco Warriors</p>
              </div>
              <div className=" text-gray-700 dark:text-gray-300">
                <p className="mb-2">"The tools and community here have significantly amplified our efforts in promoting green practices."</p>
                <p className="font-bold">- Taylor Green, Earth Advocates</p>
              </div>
            </div>
          </div>
         
        </main>
      </div>
    </div>
  );
};

export default HomePage;