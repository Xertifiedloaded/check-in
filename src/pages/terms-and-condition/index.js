import React from 'react';
import Head from 'next/head';

const TermsAndConditions = () => {
  return (
    <>
      <Head>
        <title>Terms and Conditions - Daily Check-in</title>
        <meta name="description" content="Read our Terms and Conditions to understand the rules and regulations that govern the use of Daily Check-in." />
      </Head>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Terms and Conditions</h1>
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
              <p className='text-sm text-gray-700 dark:text-gray-300'>By accessing or using Daily Check-in, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the service.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">2. Changes to Terms</h2>
              <p className='text-sm text-gray-700 dark:text-gray-300'>We reserve the right to modify or replace these Terms at any time. It is your responsibility to check the Terms periodically for changes.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">3. Access to the Service</h2>
              <p className='text-sm text-gray-700 dark:text-gray-300'>We reserve the right to withdraw or amend our service, and any service or material we provide, in our sole discretion without notice. We will not be liable if, for any reason, all or any part of the service is unavailable at any time or for any period.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">4. User Accounts</h2>
              <p className='text-sm text-gray-700 dark:text-gray-300'>You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">5. Intellectual Property</h2>
              <p className='text-sm text-gray-700 dark:text-gray-300'>The service and its original content, features, and functionality are and will remain the exclusive property of Daily Check-in and its licensors. The service is protected by copyright, trademark, and other laws.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">6. User Content</h2>
              <p className='text-sm text-gray-700 dark:text-gray-300'>You retain any and all of your rights to any content you submit, post or display on or through the service and you are responsible for protecting those rights.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">7. Termination</h2>
              <p className='text-sm text-gray-700 dark:text-gray-300'>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">8. Limitation of Liability</h2>
              <p className='text-sm text-gray-700 dark:text-gray-300'>In no event shall Daily Check-in, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">10. Contact Us</h2>
              <p className='text-sm text-gray-700 dark:text-gray-300'>If you have any questions about these Terms, please contact us at:</p>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Email: makindeolaitan01@gmail.com<br />
              </p>
            </section>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;