import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
        ? 'https://campus-guide-backend-n015.onrender.com'
        : 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Add request interceptor
api.interceptors.request.use(
    config => {
        console.log('Request being sent:', {
            url: config.url,
            method: config.method,
            data: config.data
        });
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                data: error.config?.data
            }
        });
        return Promise.reject(error);
    }
);

export default api;