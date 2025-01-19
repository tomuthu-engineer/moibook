import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Search, IndianRupee, MapPin, Calendar, Clock, Building, FileText, FileSpreadsheet } from 'lucide-react';
import { investService } from '../services/api';
import toast from 'react-hot-toast';

interface PaidMoiEntry {
  _id: string;
  beneficiaryName: string;
  amount: number;
  eventType: string;
  area: string;
  district: string;
  state: string;
  date: string;
  time: string;
  remarks?: string;
}

const ViewAllPaidMoi = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState<PaidMoiEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const data = await investService.getAll();
      setEntries(data);
    } catch (error) {
      toast.error('Failed to fetch entries');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = async (format: 'pdf' | 'xlsx') => {
    try {
      const blob = await investService.downloadReport(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `paid-moi-report.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setShowDownloadModal(false);
    } catch (error) {
      toast.error(`Failed to download ${format.toUpperCase()} report`);
    }
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
          <h1 className="text-2xl font-bold text-gray-900 ml-4">View All Paid Moi</h1>
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
          onClick={() => setShowDownloadModal(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Download className="h-5 w-5 mr-2" />
          Download Report
        </button>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Download Report</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleDownload('pdf')}
                className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <FileText className="h-8 w-8 text-red-500 mb-2" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => handleDownload('xlsx')}
                className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <FileSpreadsheet className="h-8 w-8 text-green-500 mb-2" />
                <span>Excel</span>
              </button>
            </div>
            <button
              onClick={() => setShowDownloadModal(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        /* Moi Entry Cards */
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <div
              key={entry._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {entry.beneficiaryName}
                    </h3>
                    <div className="flex items-center text-purple-600 font-semibold">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {entry.amount.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Building className="h-4 w-4 mr-2" />
                    <span>{entry.eventType}</span>
                  </div>
                  {entry.remarks && (
                    <p className="text-sm text-gray-500">{entry.remarks}</p>
                  )}
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

          {filteredEntries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No entries found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewAllPaidMoi;