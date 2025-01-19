import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { returnsService } from '../services/api';

const REQUIRED_FIELDS = ['fullName', 'paymentAmount','date', 'area', 'district', 'state', ];

const ReceivedMoiForm = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const location = useLocation();
  const dynamicFormFields = location.state?.formFields || {};

  // Preprocess fields to include address components and always include required fields
  const formFields = {
    ...Object.fromEntries(REQUIRED_FIELDS.map((field) => [field, true])),
    ...dynamicFormFields,
  };

  // Replace "address" with its nested fields
  if (formFields.address) {
    formFields.area = true;
    formFields.district = true;
    formFields.state = true;
    delete formFields.address; // Remove "address" to avoid confusion
  }

  // Initialize default values
  const defaultValues = Object.keys(formFields).reduce((acc, key) => {
    if (formFields[key]) {
      acc[key] = key === 'date' ? new Date().toISOString().split('T')[0] : ''; // Set today's date as default for 'date'
    }
    return acc;
  }, {});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
  });

  const onSubmit = async (data: any) => {
    try {
      // Extract address fields and remove them from the top-level data
      const { area, state, district, ...formFields } = data;
  
      // Prepare the payload
      const payload = {
        eventId,
        formFields: {
          ...formFields,
          address: { area, state, district },  // Nest the address fields
        },
      };
  
      // Make the API call
      await returnsService.create(payload);
  
      toast.success('Received moi entry saved successfully!', {
        icon: <Check className="h-5 w-5 text-green-500" />,
      });
    } catch (error) {
      toast.error('Failed to save received moi entry');
    }
  };
  

  const renderField = (fieldName, fieldType = 'text') => {
    const label = fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
    return (
      <div key={fieldName}>
        <label
          htmlFor={fieldName}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
        <input
          {...register(fieldName)}
          type={fieldType}
          id={fieldName}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        {errors[fieldName] && (
          <p className="mt-1 text-sm text-red-600">
            {errors[fieldName]?.message}
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/received-moi-entry')}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 ml-4">Received Moi Entry Form</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(formFields).map((key) => {
            if (!formFields[key]) return null; // Render only fields marked as true

            return renderField(key, key === 'phoneNumber' ? 'tel' : key === 'date' ? 'date' : 'text');
          })}
        </div>

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

export default ReceivedMoiForm;
