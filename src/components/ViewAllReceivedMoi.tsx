import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Download,
  Search,
  IndianRupee,
  MapPin,
  Calendar,
  Clock,
  FileText,
  FileSpreadsheet
} from "lucide-react";
import { returnsService } from "../services/api";
import toast from "react-hot-toast";

interface FormFields {
  fullName: string;
  address: {
    area: string;
    state: string;
    district: string;
  };
  emailAddress: string;
  paymentAmount: string;
  surname?: string;
  phoneNumber?: string;
  fathersName?:string;
  mothersName?:String;
  occupation?:string;
}

interface ReceivedMoiEntry {
  _id: string;
  eventId: string;
  createdBy: string;
  formFields: FormFields;
  createdAt: string;
  updatedAt: string;
}

const ViewAllReceivedMoi = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [receivedMoiEntries, setReceivedMoiEntries] = useState<
    ReceivedMoiEntry[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const data = await returnsService.getAll(eventId);
      setReceivedMoiEntries(data);
    } catch (error) {
      toast.error("Failed to fetch entries");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEntries = receivedMoiEntries.filter(
    (entry) =>
      entry.formFields.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      entry.formFields.address.area
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      entry.formFields.paymentAmount
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleDownload = async (format: 'pdf' | 'xlsx') => {
    try {
      const blob = await returnsService.downloadReport(format,eventId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Received-moi-report.${format}`;
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
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 ml-4">
            View All Received Moi
          </h1>
        </div>
      </div>

      {/* Search and Download Section */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, area, or amount..."
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

      {/* Moi Entry Cards */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <div
            key={entry._id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 transform hover:scale-[1.01]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {entry.formFields.fullName}
                  </h3>
                  <div className="flex items-center text-green-600 font-semibold">
                    <IndianRupee className="h-5 w-5 mr-1" />
                    {Number(entry.formFields.paymentAmount).toLocaleString(
                      "en-IN"
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                  <div>
                    <p className="text-gray-600">
                      {entry.formFields.address.area}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {entry.formFields.address.district},{" "}
                      {entry.formFields.address.state}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{new Date(entry.createdAt).toLocaleTimeString()}</span>
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
