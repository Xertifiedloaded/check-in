import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CelebrationBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const lastCelebrationMonth = localStorage.getItem('lastCelebrationMonth');
    
    if (lastCelebrationMonth !== currentMonth) {
      setIsVisible(true);
      localStorage.setItem('lastCelebrationMonth', currentMonth);
      
      setTimeout(() => {
        setIsVisible(false);
      }, 10000);
    }
  }, []);

  if (!isVisible) return null;

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="fixed top-4 right-4 left-4 md:left-auto md:w-[420px] z-50">
      <Alert className="bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-900 shadow-xl rounded-xl p-0 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        <div className="p-4">

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-50 dark:bg-indigo-900/50 p-2 rounded-lg">
                <Sparkles className="h-5 w-5 text-indigo-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Welcome to {currentMonth}
              </h2>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center py-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="relative mx-2 group"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="w-5 h-14 rounded-xl bg-gradient-to-b from-indigo-400 to-purple-400 transform group-hover:scale-105 transition-transform duration-200 ease-in-out shadow-lg" />
                  <div className="w-1.5 h-10 bg-indigo-200 dark:bg-indigo-700 mx-auto -mb-1 rounded-b-full shadow-sm" />
                </div>
              ))}
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              Here's to new achievements and continued success!
            </p>
          </div>
        </div>
      </Alert>
    </div>
  );
};

export default CelebrationBanner;