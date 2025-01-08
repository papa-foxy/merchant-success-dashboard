// src/services/api.ts

import axios from 'axios';

// Get environment variables
const CLICKUP_API_URL = process.env.REACT_APP_CLICKUP_API_URL;
const CLICKUP_API_TOKEN = process.env.REACT_APP_CLICKUP_API_TOKEN;

// Create base axios instance
export const clickupApi = axios.create({
  baseURL: CLICKUP_API_URL,
  headers: {
    'Authorization': CLICKUP_API_TOKEN,
    'Content-Type': 'application/json'
  }
});

if (!CLICKUP_API_URL || !CLICKUP_API_TOKEN) {
  console.error("Missing environment variables for ClickUp API");
  // You might want to throw an error or redirect to an error page here
}

// Add request interceptor
clickupApi.interceptors.request.use(
  (config) => {
    // You can add any request preprocessing here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
clickupApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          console.error('Unauthorized access');
          break;
        case 403:
          // Handle forbidden
          console.error('Forbidden access');
          break;
        case 404:
          // Handle not found
          console.error('Resource not found');
          break;
        default:
          // Handle other errors
          console.error('API Error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default clickupApi;