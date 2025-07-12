// src/api.js
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:4500/api', // Change if your backend port is different
});

export default API;
