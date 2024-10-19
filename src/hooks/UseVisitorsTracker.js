
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';



export function useVisitTracker() {
  const [visitorId, setVisitorId] = useState(null);
  const startTime = Date.now();
  const router = useRouter();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const response = await fetch('/api/analytics/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ip: await getIP(),
            userAgent: navigator.userAgent,
            page: router.pathname,
          }),
        });
        const data = await response.json();
        setVisitorId(data.visitorId);
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    trackVisit();

    const intervalId = setInterval(() => {
      if (visitorId) {
        updateDuration();
      }
    }, 60000); 

    return () => {
      clearInterval(intervalId);
      if (visitorId) {
        updateDuration();
      }
    };
  }, [router.pathname]);

  const updateDuration = async () => {
    const duration = Math.round((Date.now() - startTime) / 1000 / 60);
    try {
      await fetch('/api/analytics/analytics', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visitorId, duration }),
      });
    } catch (error) {
      console.error('Error updating visit duration:', error);
    }
  };

  const getIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting IP:', error);
      return 'unknown';
    }
  };
}