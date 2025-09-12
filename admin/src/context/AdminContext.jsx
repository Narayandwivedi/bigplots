import { createContext, useContext } from 'react';
import axios from 'axios';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Create axios instance with base URL
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // API methods for different resources
  const productAPI = {
    getAll: () => api.get('/api/products'),
    getById: (id) => api.get(`/api/products/${id}`),
    create: (data) => api.post('/api/products/add', data),
    update: (id, data) => api.put(`/api/products/edit/${id}`, data),
    delete: (id) => api.delete(`/api/products/${id}`),
  };

  const userAPI = {
    getAll: (params = {}) => api.get('/api/admin/users', { params }),
    getById: (id) => api.get(`/api/admin/users/${id}`),
    getStats: () => api.get('/api/admin/users/stats'),
    update: (id, data) => api.put(`/api/admin/users/${id}`, data),
    delete: (id) => api.delete(`/api/admin/users/${id}`),
    resetPassword: (id, data) => api.post(`/api/admin/users/${id}/reset-password`, data),
    toggleStatus: (id) => api.patch(`/api/admin/users/${id}/toggle-status`),
  };

  const orderAPI = {
    getAll: () => api.get('/api/orders'),
    getById: (id) => api.get(`/api/orders/${id}`),
    update: (id, data) => api.put(`/api/orders/${id}`, data),
    updateStatus: (id, status) => api.patch(`/api/orders/${id}/status`, { status }),
  };

  const blogAPI = {
    getAll: () => api.get('/api/blogs'),
    getById: (id) => api.get(`/api/blogs/${id}`),
    create: (data) => api.post('/api/blogs', data),
    update: (id, data) => api.put(`/api/blogs/${id}`, data),
    delete: (id) => api.delete(`/api/blogs/${id}`),
    publish: (id) => api.patch(`/api/blogs/${id}/publish`),
  };

  const analyticsAPI = {
    getDashboard: () => api.get('/api/analytics/dashboard'),
    getTraffic: () => api.get('/api/analytics/traffic'),
    getSales: () => api.get('/api/analytics/sales'),
  };

  const chatAPI = {
    getChats: () => api.get('/api/chat/conversations'),
    getMessages: (chatId) => api.get(`/api/chat/conversations/${chatId}/messages`),
    sendMessage: (chatId, message) => api.post(`/api/chat/conversations/${chatId}/messages`, { message }),
  };

  // Helper function for handling API errors
  const handleApiError = (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', message);
    return message;
  };

  // Context value
  const value = {
    API_BASE_URL,
    api,
    productAPI,
    userAPI,
    orderAPI,
    blogAPI,
    analyticsAPI,
    chatAPI,
    handleApiError,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;