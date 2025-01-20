import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { BookOpenCheck, User } from 'lucide-react';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import PaidMoiForm from './components/PaidMoiForm';
import ReceivedMoiList from './components/ReceivedMoiList';
import ReceivedMoiForm from './components/ReceivedMoiForm';
import CreateEventForm from './components/CreateEventForm';
import ViewAllPaidMoi from './components/ViewAllPaidMoi';
import ViewAllReceivedMoi from './components/ViewAllReceivedMoi';
import ViewAllReceivedMoiEvents from './components/ViewAllReceivedMoiEvents';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('welcome XXX');

  const openModal = (type: 'login' | 'signup') => {
    setAuthType(type);
    setIsModalOpen(true);
  };

  const handleSuccessfulAuth = () => {
    setIsAuthenticated(true);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <BookOpenCheck className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                MoiBook
              </span>
            </div>

            {/* Auth Buttons or Profile */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">{userName}</span>
                <User className="h-6 w-6 text-purple-600" />
              </div>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={() => openModal('login')}
                  className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => openModal('signup')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/paid-moi-entry" element={<PaidMoiForm />} />
            <Route path="/received-moi-entry" element={<ReceivedMoiList />} />
            <Route path="/received-moi-form/:eventId" element={<ReceivedMoiForm />} />
            <Route path="/create-event" element={<CreateEventForm />} />
            <Route path="/view-all-paid-moi" element={<ViewAllPaidMoi />} />
            <Route path="/view-all-received-moi-events" element={<ViewAllReceivedMoiEvents />} />
            <Route path="/view-all-received-moi/:eventId" element={<ViewAllReceivedMoi />} />
          </Routes>
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
              Welcome to MoiBook
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Connect, Share, and Discover with MoiBook
            </p>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={authType}
        onSuccess={handleSuccessfulAuth}
      />
    </div>
  );
}

export default App;