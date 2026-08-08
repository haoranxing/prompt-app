import request from './request';

export const getConfig = () => request.get('/config');
