import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Search, IndianRupee, MapPin, Calendar, Clock, Building } from 'lucide-react';

// Mock data for demonstration
const receivedMoiEntries = [
  {
    id: 1,
    beneficiaryName: "Anand Kumar",
    amount: 10000,
    eventType: "Wedding",
    area: "Anna Nagar",
    district: "Chennai",
    state: "Tamil Nadu",
    date: "2024-03-15",
    time: "15:30"
  },
  {
    id: 2,
    beneficiaryName: "Lakshmi Devi",
    amount: 5000,
    eventType: "House Warming",
    area: "Velachery",
    district: "Chennai",
    state: "Tamil Nadu",
    date: "2024-03-14",
    time: "12:00"
  },
  {
    id: 3,
    beneficiaryName: "Karthik Raja",
    amount: 7500,
    eventType: "Birthday",
    area: "Mylapore",
    district: "Chennai",
    state: "Tamil Nadu",
    date: "2024-03-13",
    time: "17:45"
  }
];

const ViewAllReceivedMoi = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = receivedMoiEntries.filter(entry =>
    entry.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadReport = () => {
    // Implement download functionality here
    console.log('Downloading report...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 ml-4">View All Received Moi</h1>
        </div>
      </div>

      {/* Search and Download Section */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, event type, or area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleDownloadReport}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Download className="h-5 w-5 mr-2" />
          Download Report
        </button>
      </div>

      {/* Moi Entry Cards */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 transform hover:scale-[1.01]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {entry.beneficiaryName}
                  </h3>
                  <div className="flex items-center text-green-600 font-semibold">
                    <IndianRupee className="h-5 w-5 mr-1" />
                    {entry.amount.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Building className="h-4 w-4 mr-2" />
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                    {entry.eventType}
                  </span>
                </div>
              </div>

              {/* Right Section */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                  <div>
                    <p className="text-gray-600">{entry.area}</p>
                    <p className="text-gray-500 text-sm">{entry.district}, {entry.state}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(entry.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{entry.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAllReceivedMoi;