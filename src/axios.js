// src/axios.js
import axios from 'axios';

const instance = axios.create({
    baseURL: '192.168.1.73:8000', 
    timeout: 1000,
    headers: {'Content-Type': 'application/json'}
});

export default instance;
