import client from './client';

export const authAPI = {
  login: (email, password) => client.post('/auth/login', { email, password }),
  signup: (data) => client.post('/auth/signup', data),
  getMe: () => client.get('/auth/me'),
};

export const productsAPI = {
  getAll: (params) => client.get('/products', { params }),
  getBySlug: (slug) => client.get(`/products/${slug}`),
  getCategories: () => client.get('/products/categories'),
  getReviews: (id) => client.get(`/products/${id}/reviews`),
};

export const cartAPI = {
  get: () => client.get('/cart'),
  add: (product_id, quantity = 1, size = '250g') => client.post('/cart', { product_id, quantity, size }),
  update: (id, quantity) => client.put(`/cart/${id}`, { quantity }),
  remove: (id) => client.delete(`/cart/${id}`),
  clear: () => client.delete('/cart/clear'),
};

export const ordersAPI = {
  place: (data) => client.post('/orders', data),
  getAll: (params) => client.get('/orders', { params }),
  getById: (id) => client.get(`/orders/${id}`),
};

export const addressAPI = {
  getAll: () => client.get('/addresses'),
  add: (data) => client.post('/addresses', data),
  update: (id, data) => client.put(`/addresses/${id}`, data),
  remove: (id) => client.delete(`/addresses/${id}`),
};

export const userAPI = {
  getProfile: () => client.get('/user/profile'),
  updateProfile: (data) => client.put('/user/profile', data),
  changePassword: (data) => client.put('/user/profile/password', data),
  addReview: (data) => client.post('/user/reviews', data),
};
