/**
 * Verdant API Service
 * Drop this file into: verdant/src/services/api.js
 * 
 * Usage example:
 *   import api from '../services/api';
 *   const { plants } = await api.plants.getAll({ category: 'Adaptogen' });
 */

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ─── Token helpers ───────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem('verdant_token');
const setToken = (token) => localStorage.setItem('verdant_token', token);
const clearToken = () => localStorage.removeItem('verdant_token');

// ─── Core fetch wrapper ──────────────────────────────────────────────────────
const request = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// ─── Auth ────────────────────────────────────────────────────────────────────
const auth = {
  register: async ({ name, email, password }) => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    if (data.token) setToken(data.token);
    return data;
  },

  login: async ({ email, password }) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) setToken(data.token);
    return data;
  },

  logout: () => {
    clearToken();
  },

  getMe: () => request('/auth/me'),

  updateProfile: (updates) =>
    request('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  changePassword: ({ currentPassword, newPassword }) =>
    request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  isLoggedIn: () => Boolean(getToken()),
};

// ─── Plants ──────────────────────────────────────────────────────────────────
const plants = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/plants${query ? `?${query}` : ''}`);
  },

  getOne: (plantId) => request(`/plants/${plantId}`),

  getCategories: () => request('/plants/categories'),

  getFeatured: () => request('/plants/featured'),

  getBySymptom: (symptom) => request(`/plants/by-symptom/${encodeURIComponent(symptom)}`),

  search: (query) => request(`/plants?search=${encodeURIComponent(query)}`),
};

// ─── Notes ───────────────────────────────────────────────────────────────────
const notes = {
  getAll: () => request('/notes'),

  create: ({ title, content, plantId, plantName }) =>
    request('/notes', {
      method: 'POST',
      body: JSON.stringify({ title, content, plantId, plantName }),
    }),

  update: (id, { title, content, plantId, plantName }) =>
    request(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content, plantId, plantName }),
    }),

  delete: (id) =>
    request(`/notes/${id}`, { method: 'DELETE' }),
};

// ─── Favorites ───────────────────────────────────────────────────────────────
const favorites = {
  getAll: () => request('/favorites'),

  toggle: (plantId) =>
    request('/favorites/toggle', {
      method: 'POST',
      body: JSON.stringify({ plantId }),
    }),

  sync: (favoritesArray) =>
    request('/favorites/sync', {
      method: 'PUT',
      body: JSON.stringify({ favorites: favoritesArray }),
    }),
};

// ─── Glossary ────────────────────────────────────────────────────────────────
const glossary = {
  getAll: (search = '') => request(`/glossary${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getTerm: (term) => request(`/glossary/${encodeURIComponent(term)}`),
};

// ─── Export ──────────────────────────────────────────────────────────────────
const api = { auth, plants, notes, favorites, glossary };
export default api;
