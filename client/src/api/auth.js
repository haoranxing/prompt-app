import request from './request';

export const register = (data) => request.post('/auth/register', data);
export const login = (data) => request.post('/auth/login', data);
export const getMe = () => request.get('/auth/me');
export const updateProfile = (data) => request.put('/auth/profile', data);
export const redeemCode = (code) => request.post('/auth/redeem', { code });
