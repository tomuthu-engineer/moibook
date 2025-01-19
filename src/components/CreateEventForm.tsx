import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { createEventSchema, type CreateEventFormData } from '../schemas/forms';
import { eventService } from '../services/api';

interface FormField {
  id: string;
  label: string;
  enabled: boolean;
  required: boolean;
}

const CreateEventForm = () => {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      eventDate: new Date().toISOString().split('T')[0],
      formFields: ['fullName', 'address', 'paymentAmount']
    }
  });

  const fields: FormField[] = [
    { id: 'fullName', label: 'Full Name', enabled: true, required: true },
    { id: 'address', label: 'Address', enabled: true, required: true },
    { id: 'paymentAmount', label: 'Payment Amount', enabled: true, required: true },
    { id: 'surname', label: 'Surname', enabled: false, required: false },
    { id: 'fatherName', label: "Father's Name", enabled: false, required: false },
    { id: 'motherName', label: "Mother's Name", enabled: false, required: false },
    { id: 'phoneNumber', label: 'Phone Number', enabled: false, required: false },
    { id: 'emailAddress', label: 'Email Address', enabled: false, required: false },
    { id: 'occupation', label: 'Occupation', enabled: false, required: false },
    { id: 'spouseName', label: 'Spouse Name', enabled: false, required: false },
  ];


  const onSubmit = async (data: CreateEventFormData) => {
    try {
      const payload = {
        eventName: data.eventName,
        eventDate: data.eventDate,
        eventType: data.eventType,
        eventAddress: {
          area: data.area,
          district: data.district,
          state: data.state,
        },
        formFields: Object.fromEntries(
          fields.map((field) => [field.id, data.formFields.includes(field.id)])
        ),
      };
      
      console.log('payload',payload)
      await eventService.create({
        payload,
      });
  
      toast.success('Event created successfully!', {
        icon: <Check className="h-5 w-5 text-green-500" />,
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to create event');
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
        <h1 className="text-2xl font-bold text-gray-900 ml-4">Create Event Entry Form</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Event Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
                Event Name
              </label>
              <input
                {...register('eventName')}
                type="text"
                id="eventName"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.eventName && (
                <p className="mt-1 text-sm text-red-600">{errors.eventName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                Event Date
              </label>
              <input
                {...register('eventDate')}
                type="date"
                id="eventDate"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.eventDate && (
                <p className="mt-1 text-sm text-red-600">{errors.eventDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <input
                {...register('eventType')}
                type="text"
                id="eventType"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.eventType && (
                <p className="mt-1 text-sm text-red-600">{errors.eventType.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                Area/Village
              </label>
              <input
                {...register('area')}
                type="text"
                id="area"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.area && (
                <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                District
              </label>
              <input
                {...register('district')}
                type="text"
                id="district"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.district && (
                <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                {...register('state')}
                type="text"
                id="state"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Toggle Fields Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Form Fields</h2>
          <Controller
            name="formFields"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((formField) => (
                  <div
                    key={formField.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-700">{formField.label}</span>
                    <div className="flex items-center">
                      {formField.required ? (
                        <span className="text-sm text-purple-600 mr-2">Required</span>
                      ) : (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={field.value.includes(formField.id)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...field.value, formField.id]
                                : field.value.filter((id) => id !== formField.id);
                              field.onChange(newValue);
                            }}
                            disabled={formField.required}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventForm;