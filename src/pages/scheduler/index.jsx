import { useState } from "react";

export default function EmailSchedulerControl() {
    const [status, setStatus] = useState('stopped');
    const [error, setError] = useState(null);
  
    const startScheduler = async () => {
      try {
        const response = await fetch('/api/cron/postcron', {
          method: 'POST',
        });
  
        if (!response.ok) {
          throw new Error('Failed to start scheduler');
        }
  
        setStatus('running');
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to start scheduler');
      }
    };
  
    const stopScheduler = async () => {
      try {
        const response = await fetch('/api/cron/postcron', {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          throw new Error('Failed to stop scheduler');
        }
  
        setStatus('stopped');
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to stop scheduler');
      }
    };
  
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Email Scheduler Control</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <button
            onClick={startScheduler}
            disabled={status === 'running'}
            className={`w-full py-2 px-4 rounded-md transition-colors ${
              status === 'running'
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            Start Scheduler
          </button>
          
          <button
            onClick={stopScheduler}
            disabled={status === 'stopped'}
            className={`w-full py-2 px-4 rounded-md transition-colors ${
              status === 'stopped'
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            Stop Scheduler
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <p className="text-gray-700">
            Status: {' '}
            <span className={`font-semibold ${
              status === 'running' ? 'text-green-600' : 'text-red-600'
            }`}>
              {status}
            </span>
          </p>
        </div>
      </div>
    );
  }
  