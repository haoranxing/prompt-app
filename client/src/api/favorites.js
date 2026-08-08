import request from './request';

export const getFavorites = () => request.get('/favorites');
export const addFavorite = (prompt_id) => request.post('/favorites', { prompt_id });
export const removeFavorite = (prompt_id) => request.delete(`/favorites/${prompt_id}`);
