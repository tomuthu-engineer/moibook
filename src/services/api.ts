import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  requestOTP: async (mobile: string) => {
    const response = await api.post('/auth/request-otp', { mobile });
    return response.data;
  },

  verifyOTP: async (mobile: string, otp: string) => {
    const response = await api.post('/auth/verify-otp', { mobile, otp });
    const { accessToken, refreshToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return response.data;
  },
};

// Investment Services
export const investService = {
  create: async (data: any) => {
    const response = await api.post('/invest/create', data);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/invest/all');
    return response.data;
  },

  getTotalAmount: async () => {
    const response = await api.get('/invest/total-amount');
    return response.data;
  },

  downloadReport: async (format: 'pdf' | 'export-excel') => {
    const response = await api.get(`/invest/export-excel`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

// Event Services
export const eventService = {

    create: async (data: any) => {
      const response = await api.post('/event/create', data);
      console.log(response)
      return response.data;
    },

  getAll: async () => {
    const response = await api.get('/event/all');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/event/${id}`);
    return response.data;
  }
};

// Returns Services
export const returnsService = {
  create: async (data: any) => {
    const response = await api.post('/returns', data);
    return response.data;
  },

  getTotalPayment: async () => {
    const response = await api.get('/returns/total-payment');
    return response.data;
  },

  getAll: async (eventId:any) => {
    const response = await api.get(`/returns/event/${eventId}`);
    return response.data;
  },
  downloadReport: async (format: 'pdf' | 'export-excel',eventId:any) => {
    const response = await api.get(`/returns/event/${eventId}/export-excel`, {
      responseType: 'blob'
    });
    return response.data;
  }

};