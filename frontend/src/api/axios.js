import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000',
    withCredentials: true, // required for refresh token cookie
})

export default api;