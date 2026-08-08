import request from './request';

export const getHome = () => request.get('/prompts/home');
export const getPrompts = (params) => request.get('/prompts', { params });
export const getPrompt = (id) => request.get(`/prompts/${id}`);
