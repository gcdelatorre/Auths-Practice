import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000',
    // withCredentials is required to send and receive cookies from the server,
    // which is essential for our authentication flow that uses HttpOnly cookies for refresh tokens.
    withCredentials: true,
})

export default api;