// src/api.js
import axios from 'axios';

const API = axios.create({
    baseURL: 'https://fullstack-todo-app-with-frontend-ba.vercel.app/api',
});

export default API;
