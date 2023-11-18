import axios from 'axios';

const service = axios.create({
    baseURL: '/api/',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
    },
});

export const setToken = (token) => {
    if (token) {
        service.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete service.defaults.headers.common['Authorization'];
    }
}

export default service