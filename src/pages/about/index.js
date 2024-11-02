import React from 'react';
import Head from 'next/head';
import { CheckCircle, Users, Zap } from 'lucide-react';

const AboutUs = () => {
  return (
    <>
      <Head>
        <title>About Us - Daily Check-in</title>
        <meta name="description" content="Learn about Daily Check-in, our mission, and our team." />
      </Head>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold text-center mb-8 dark:text-white">About Daily Check-in</h1>
          
          <section className="mb-12">
            <h2 className="md:text-2xl text-lg font-semibold mb-4 dark:text-gray-300">Our Mission</h2>
            <p className="lg:text-lg leading-[1.7] text-gray-700 dark:text-gray-400 text-sm">
              At Daily Check-in, we believe in the power of consistency and community. Our mission is to help individuals build positive habits, stay accountable, and connect with like-minded people on their personal growth journeys.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="md:text-2xl text-lg font-semibold mb-4 dark:text-gray-300">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <CheckCircle className="text-green-500 mb-4" size={32} />
                <h3 className="md:text-2xl text-lg font-semibold mb-2 dark:text-white">Daily Check-ins</h3>
                <p className="text-gray-700 dark:text-gray-400 text-sm lg:text-lg">Track your progress and build streaks to stay motivated.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <Users className="text-blue-500 mb-4" size={32} />
                <h3 className="md:text-2xl text-lg font-semibold mb-2 dark:text-white">Community Support</h3>
                <p className="text-gray-700 dark:text-gray-400 text-sm lg:text-lg">Connect with others, share experiences, and grow together.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <Zap className="text-yellow-500 mb-4" size={32} />
                <h3 className="md:text-2xl text-lg font-semibold mb-2 dark:text-white">Personalized Insights</h3>
                <p className="text-gray-700 dark:text-gray-400 text-sm lg:text-lg">Gain valuable insights into your habits and progress over time.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 dark:text-gray-300">Our Team</h2>
            <p className="text-sm lg:text-lg leading-[1.7] text-gray-700 dark:text-gray-400 mb-4">
              Daily Check-in was founded by a group of passionate individuals who believe in the power of personal growth and community support. Our diverse team brings together expertise in psychology, technology, and user experience design to create a platform that truly empowers our users.
            </p>
            <p className="lg:text-lg text-sm leading-[1.7] text-gray-700 dark:text-gray-400">
              Led by Makinde Olaitan Oreofe, our team is committed to continuously improving Daily Check-in to meet the evolving needs of our community.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default AboutUs;