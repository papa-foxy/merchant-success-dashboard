import axios from 'axios';

export const clickupApi = axios.create({
  baseURL: process.env.REACT_APP_CLICKUP_API_URL,
  headers: {
    'Authorization': process.env.REACT_APP_CLICKUP_API_TOKEN,
    'Content-Type': 'application/json'
  }
});