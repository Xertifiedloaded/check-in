import axios from 'axios';

export function trackingComponent() {
  const startTime = Date.now();
  let visitorId = null;

  const trackVisit = async () => {
    try {
      const response = await axios.post('/api/analytics/track-visit');
      console.log(response);
      visitorId = response.data.visitorId; 
    } catch (error) {
      console.error('Error tracking visit:', error);
    }
  };


  const updateVisitDuration = async () => {
    if (visitorId) {
      const duration = Math.round((Date.now() - startTime) / 1000 / 60); 
      try {
        await axios.post('/api/analytics/update-visitor', { ip: visitorId, duration });
      } catch (error) {
        console.error('Error updating visit duration:', error);
      }
    }
  };

  trackVisit();

  window.addEventListener('beforeunload', updateVisitDuration);

  return () => {
    updateVisitDuration();
    window.removeEventListener('beforeunload', updateVisitDuration);
  };
}
