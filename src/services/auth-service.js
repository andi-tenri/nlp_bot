import service, { setToken } from ".";

export const login = async (email, password) => {
    const response = await service.post('/auth/login', {
        email,
        password
    });

    if (response.data.data) {
        const data = response.data.data;

        const token = data.token;

        localStorage.setItem('token', token);

        localStorage.setItem('user', JSON.stringify(data.user));

        setToken(token);

        window.location.reload();
    }

    return response.data;
}

export const logout = () => {
    localStorage.removeItem('token');
}

export const getCurrentUser = () => JSON.parse(localStorage.getItem('token'));

export const verifyToken = async () => {
    try {
        const response = await service.post('/auth/verify');
        return response.data;
    } catch (error) {
        return
    }
}
