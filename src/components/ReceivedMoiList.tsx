import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar } from 'lucide-react';
import { eventService } from '../services/api';
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

const ReceivedMoiList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventService.getAll();
      setEvents(data);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 ml-4">Select Event</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <button
              key={event._id}
              onClick={() => navigate(`/received-moi-form/${event._id}`, { 
                state: { formFields: event.formFields }
              })}
              className="w-full bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all hover:scale-[1.02] text-left"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">{event.eventName}</h3>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-500">{event.eventType}</p>
                  <p className="text-sm text-gray-500">
                    {event.eventAddress.area}, {event.eventAddress.district}, {event.eventAddress.state}
                  </p>
                </div>
                <span className="text-purple-600 font-medium">View Event →</span>
              </div>
            </button>
          ))}

          {events.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No events found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReceivedMoiList;