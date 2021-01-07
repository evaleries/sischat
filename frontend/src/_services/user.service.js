import config from 'config';
import { authHeader } from '../_helpers';

export const userService = {
    login,
    register,
    logout,
    getAll,
    getConversations,
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`${config.apiUrl}/auth/login`, requestOptions)
        .then(handleResponse)
        .then(res => {
            if (res.token) {
                localStorage.setItem('user', JSON.stringify(res));
            }

            return res;
        });
}

function register(username, password, email, jenis_kelamin, alamat) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, jenis_kelamin, alamat })
    };

    return fetch(`${config.apiUrl}/auth/register`, requestOptions)
        .then(handleResponse)
        .then(res => {
            if (res.token) {
                localStorage.setItem('user', JSON.stringify(res.user));
            }

            return res;
        });
}

function getConversations(userId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/message/conversationsWith/${userId}`, requestOptions)
        .then(handleResponse)
        .then(res => {
            if (res.conversations) return res.conversations;
            return res;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                // location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}