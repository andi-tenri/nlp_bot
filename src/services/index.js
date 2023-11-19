import axios from 'axios';

const service = axios.create({
    baseURL: '/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

service.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const setToken = (token) => {
    if (token) {
        service.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete service.defaults.headers.common['Authorization'];
    }
}

export default service