import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  LayoutDashboard, 
  Users, 
  Mail, 
  Award, 
  Settings, 
  LogOut, 
  MenuIcon,
  X,
  CheckCircle,
  Bell
} from 'lucide-react';

const AdminDashboard = () => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newStreakValue, setNewStreakValue] = useState('');
  const [newsletterContent, setNewsletterContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  useEffect(() => {
    if (!userId) return;
    fetchProfile();
  }, [userId]);
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/user/profile/userinfo?userId=${userId}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProfile(data.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if current user is owner
  if (!profile?.isOwner) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>
                You don't have permission to access this area.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  const showMessage = (text, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleVerifyUser = async () => {
    if (!selectedUserId) {
      showMessage('Please enter a user ID', true);
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showMessage(`User ${selectedUserId} verified successfully`);
      setSelectedUserId('');
    } catch (error) {
      showMessage('Error verifying user', true);
    }
    setLoading(false);
  };

  const handleUpdateStreak = async () => {
    if (!selectedUserId || !newStreakValue) {
      showMessage('Please fill in all fields', true);
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showMessage(`Streak updated to ${newStreakValue} for user ${selectedUserId}`);
      setSelectedUserId('');
      setNewStreakValue('');
    } catch (error) {
      showMessage('Error updating streak', true);
    }
    setLoading(false);
  };

  const handleSendNewsletter = async () => {
    if (!newsletterContent) {
      showMessage('Please enter newsletter content', true);
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showMessage('Newsletter sent successfully');
      setNewsletterContent('');
    } catch (error) {
      showMessage('Error sending newsletter', true);
    }
    setLoading(false);
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'streaks', label: 'Streaks', icon: Award },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Verify User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter User ID"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleVerifyUser}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Verify User
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      
      case 'streaks':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Update User Streak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter User ID"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              />
              <Input
                type="number"
                placeholder="New Streak Value"
                value={newStreakValue}
                onChange={(e) => setNewStreakValue(e.target.value)}
              />
              <Button 
                onClick={handleUpdateStreak}
                disabled={loading}
                className="w-full flex items-center gap-2 justify-center"
              >
                <Award className="w-4 h-4" />
                Update Streak
              </Button>
            </CardContent>
          </Card>
        );
      
      case 'newsletter':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Send Weekly Newsletter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                className="w-full h-48 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter newsletter content..."
                value={newsletterContent}
                onChange={(e) => setNewsletterContent(e.target.value)}
              />
              <Button 
                onClick={handleSendNewsletter}
                disabled={loading}
                className="w-full flex items-center gap-2 justify-center"
              >
                <Mail className="w-4 h-4" />
                Send Newsletter
              </Button>
            </CardContent>
          </Card>
        );
      
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">1,234</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Active Streaks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">892</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">12</p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          {isMobileSidebarOpen ? <X /> : <MenuIcon />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-gray-950 shadow-lg transition-transform duration-300 z-40
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <h1 className="text-xl font-bold mb-8">Admin Dashboard</h1>
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`
                    w-full px-4 py-2 rounded-lg flex items-center gap-3
                    ${activeTab === item.id 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="absolute bottom-6 left-0 w-full px-6">
            <Button
              variant="ghost"
              className="w-full flex items-center gap-2 text-gray-500"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-6">
        {/* Messages */}
        {message && (
          <Alert 
            variant={message.isError ? "destructive" : "default"} 
            className="mb-6"
          >
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Content */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{
            navigationItems.find(item => item.id === activeTab)?.label
          }</h2>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;