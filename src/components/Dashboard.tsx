import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, Send, Inbox, Calendar, FileText } from 'lucide-react';
import { investService, returnsService } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const [paidAmount, receivedAmount] = await Promise.all([
          investService.getTotalAmount(),
          returnsService.getTotalPayment()
        ]);
        
        setTotalPaid(paidAmount);
        setTotalReceived(receivedAmount);
      } catch (error) {
        toast.error('Failed to fetch totals');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotals();
  }, []);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Moi Paid Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Moi Paid</h3>
          <div className="flex items-center text-2xl font-bold text-gray-900">
            <IndianRupee className="h-6 w-6 text-purple-600 mr-1" />
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
            ) : (
              <span>{totalPaid.totalAmount}</span>
            )}
          </div>
        </div>

        {/* Moi Received Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Moi Received</h3>
          <div className="flex items-center text-2xl font-bold text-gray-900">
            <IndianRupee className="h-6 w-6 text-green-600 mr-1" />
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
            ) : (
              <span>{totalReceived.totalPayment}</span>
            )}
          </div>
        </div>
      </div>

      {/* Rest of the dashboard content remains the same */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Moi Entry</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => navigate('/paid-moi-entry')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all hover:scale-105 text-left"
          >
            <div className="flex items-center space-x-3">
              <Send className="h-6 w-6 text-purple-600" />
              <span className="font-semibold text-gray-800">Paid Moi Entry</span>
            </div>
          </button>

          <button 
            onClick={() => navigate('/received-moi-entry')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all hover:scale-105 text-left"
          >
            <div className="flex items-center space-x-3">
              <Inbox className="h-6 w-6 text-green-600" />
              <span className="font-semibold text-gray-800">Received Moi Entry</span>
            </div>
          </button>

          <button 
            onClick={() => navigate('/create-event')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all hover:scale-105 text-left"
          >
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-800">Create Event</span>
            </div>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">View Moi Entry</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => navigate('/view-all-paid-moi')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all hover:scale-105 text-left"
          >
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-purple-600" />
              <span className="font-semibold text-gray-800">View All Paid Moi Entry</span>
            </div>
          </button>

          <button 
            onClick={() => navigate('/view-all-received-moi-events')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all hover:scale-105 text-left"
          >
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-green-600" />
              <span className="font-semibold text-gray-800">View All Received Moi Entry</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;