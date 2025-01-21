import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, Users, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { eventService } from "../services/api";
import toast from 'react-hot-toast';


interface Event {
  _id: string;
  eventName: string;
  eventDate: string;
  eventType: string;
  eventAddress: {
    area: string;
    district: string;
    state: string;
  };
  formFields: {
    fullName: boolean;
    address: boolean;
    paymentAmount: boolean;
    surname: boolean;
    fathersName: boolean;
    mothersName: boolean;
    phoneNumber: boolean;
    emailAddress: boolean;
    occupation: boolean;
    spouseName: boolean;
  };
}

// Mock data for demonstration
const events = [
  {
    id: 1,
    name: "Wedding Ceremony",
    date: "2024-03-15",
    type: "Wedding",
    location: "Anna Nagar, Chennai",
    attendees: 150,
  },
  {
    id: 2,
    name: "House Warming",
    date: "2024-03-20",
    type: "Housewarming",
    location: "Velachery, Chennai",
    attendees: 75,
  },
  {
    id: 3,
    name: "Birthday Celebration",
    date: "2024-03-25",
    type: "Birthday",
    location: "T Nagar, Chennai",
    attendees: 50,
  },
];

const ViewAllReceivedMoiEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventService.getAll();
      setEvents(data.events);
    } catch (error) {
      toast.error("Failed to fetch events");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/")}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 ml-4">Select Event</h1>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <button
            key={event._id}
            onClick={() => navigate(`/view-all-received-moi/${event._id}`)}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all hover:scale-[1.02] text-left group"
          >
            <div className="space-y-4">
              {/* Event Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                    {event.eventType}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(event.eventDate).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {event.eventName}
                </h3>
              </div>

              {/* Event Details */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{event.eventAddress.area}</span>
                </div>
                {/* <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{event.attendees} Attendees</span>
                </div> */}
              </div>

              {/* View Details Button */}
              <div className="pt-2">
                <span className="text-purple-600 text-sm font-medium group-hover:underline">
                  View Received Moi →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ViewAllReceivedMoiEvents;
