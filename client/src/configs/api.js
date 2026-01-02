import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Log the API URL to help debug in production
console.log("Current API Base URL:", baseURL);

const api = axios.create({
    baseURL: baseURL,
});

export default api;
