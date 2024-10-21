import React from 'react';
import Head from 'next/head';

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy - Daily Check-in</title>
        <meta name="description" content="Read our Privacy Policy to understand how we collect, use, and protect your personal information." />
      </Head>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="lg:text-2xl text-2xl font-bold text-center mb-8">Privacy Policy</h1>
          
          <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-2">1. Introduction</h2>
              <p className='text-sm'>At Daily Check-in, we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">2. Information We Collect</h2>
              <p  className='text-sm'>We collect information that you provide directly to us, such as when you create an account, use our services, or communicate with us. This may include:</p>
              <ul className="list-disc pl-5 text-sm mt-2">
                <li>Personal information (e.g., name, email address)</li>
                <li>Account information</li>
                <li>User-generated content</li>
                <li>Communication data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">3. How We Use Your Information</h2>
              <p  className='text-sm'>We use the information we collect to:</p>
              <ul className="list-disc pl-5 text-sm mt-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Communicate with you about our services</li>
                <li>Personalize your experience</li>
                <li>Analyze how you use our services</li>
                <li>Protect against, identify, and prevent fraud and other illegal activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">4. Data Sharing and Disclosure</h2>
              <p  className='text-sm'>We do not sell your personal information. We may share your information in the following situations:</p>
              <ul className="list-disc text-sm pl-5 mt-2">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and interests</li>
                <li>In connection with a business transfer or transaction</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">5. Data Security</h2>
              <p  className='text-sm'>We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">6. Your Rights</h2>
              <p  className='text-sm'>Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">7. Changes to This Policy</h2>
              <p  className='text-sm'>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">8. Contact Us</h2>
              <p  className='text-sm'>If you have any questions about this Privacy Policy, please contact us at:</p>
              <p className="mt-2 text-sm">
                Email: makindeolaitan01@gmail.com<br />
              </p>
            </section>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;