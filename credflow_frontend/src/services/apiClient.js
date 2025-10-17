import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api', // Adjust this to your backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;