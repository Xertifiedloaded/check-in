
import React, { useEffect, useState, useCallback } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


const AnalyticsDashboard = () => {
  const [data, setData] = useState({
    totalVisitors: 0,
    dailyVisitors: 0,
    avgDuration: 0,
    hourlyBreakdown: [],
    pageViews: [],
    deviceTypes: [],
    activeVisitors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetch('/api/analytics/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const analyticsData = await response.json();
      setData(analyticsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data. Please try again later.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    const intervalId = setInterval(fetchAnalytics, 60000); 
    return () => clearInterval(intervalId);
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-500 text-center p-4 rounded-lg mt-6">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center text-gray-800">Visitor Analytics Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Visitors" value={data.totalVisitors} />
        <StatCard title="Daily Visitors" value={data.dailyVisitors} />
        <StatCard title="Avg. Duration (min)" value={data.avgDuration.toFixed(2)} />
        <StatCard title="Active Visitors" value={data.activeVisitors} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Hourly Visitor Breakdown">
          <LineChart data={data.hourlyBreakdown}>
            <XAxis dataKey="visitDate" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="_count.id" stroke="#4a90e2" strokeWidth={2} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Top Pages">
          <BarChart data={data.pageViews}>
            <XAxis dataKey="path" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="_count.id" fill="#82ca9d" />
          </BarChart>
        </ChartCard>
      </div>

      {/* Device Types */}
      <div className="grid grid-cols-1">
        <ChartCard title="Device Types">
          <PieChart>
            <Pie
              data={data.deviceTypes}
              dataKey="_count.id"
              nameKey="deviceType"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.deviceTypes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out text-center">
    <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">{title}</h2>
    <p className="text-2xl md:text-3xl font-bold text-blue-600">{value}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">{title}</h2>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

export default AnalyticsDashboard;
