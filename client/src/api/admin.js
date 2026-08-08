import request from './request';

export const getAdminPrompts = () => request.get('/admin/prompts');
export const createPrompt = (data) => request.post('/admin/prompts', data);
export const updatePrompt = (id, data) => request.put(`/admin/prompts/${id}`, data);
export const deletePrompt = (id) => request.delete(`/admin/prompts/${id}`);

export const getAdminCategories = () => request.get('/admin/categories');
export const createCategory = (data) => request.post('/admin/categories', data);
export const updateCategory = (id, data) => request.put(`/admin/categories/${id}`, data);
export const deleteCategory = (id) => request.delete(`/admin/categories/${id}`);

export const getUsers = () => request.get('/admin/users');
export const updateUserRole = (id, role) => request.put(`/admin/users/${id}/role`, { role });
export const updateUserLevel = (id, level) => request.put(`/admin/users/${id}/level`, { level });
export const deleteUser = (id) => request.delete(`/admin/users/${id}`);

export const getCodes = () => request.get('/admin/codes');
export const createCodes = (data) => request.post('/admin/codes', data);
export const deleteCode = (id) => request.delete(`/admin/codes/${id}`);

export const getAdminConfig = () => request.get('/admin/config');
export const updateAdminConfig = (data) => request.put('/admin/config', data);

export const uploadImage = (file) => {
  const form = new FormData();
  form.append('file', file);
  return request.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
};
