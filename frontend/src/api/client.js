const API_BASE = '/api';

async function request(endpoint, { method = 'GET', body, token } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };

  const storedToken = token || localStorage.getItem('token');
  if (storedToken) {
    headers['Authorization'] = `Bearer ${storedToken}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({ message: 'Failed to parse response' }));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  getCurrentUser: () => request('/auth/me'),
  updateProfile: (payload) => request('/auth/profile', { method: 'PUT', body: payload }),

  // Rides
  postRide: (payload) => request('/rides', { method: 'POST', body: payload }),
  searchRides: (params = {}) => {
    const query = new URLSearchParams();
    if (params.source) query.append('source', params.source);
    if (params.destination) query.append('destination', params.destination);
    if (params.date) query.append('date', params.date);
    if (params.time) query.append('time', params.time);
    if (params.minSeats) query.append('minSeats', params.minSeats);
    return request(`/rides/search?${query.toString()}`);
  },
  getActiveRides: () => request('/rides'),
  getRideById: (id) => request(`/rides/${id}`),
  getMyRides: () => request('/rides/my-rides'),
  cancelRide: (id) => request(`/rides/${id}/cancel`, { method: 'PATCH' }),

  // Requests
  sendSeatRequest: (rideId, seatsRequested, pickupNote) =>
    request('/requests', {
      method: 'POST',
      body: { rideId, seatsRequested, pickupNote },
    }),
  acceptRequest: (id, responseMessage) =>
    request(`/requests/${id}/accept`, {
      method: 'PATCH',
      body: { responseMessage },
    }),
  rejectRequest: (id, responseMessage) =>
    request(`/requests/${id}/reject`, {
      method: 'PATCH',
      body: { responseMessage },
    }),
  cancelRequest: (id) =>
    request(`/requests/${id}/cancel`, {
      method: 'PATCH',
    }),
  getMyRequests: () => request('/requests/my-requests'),
  getReceivedRequests: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.rideId) query.append('rideId', params.rideId);
    return request(`/requests/received?${query.toString()}`);
  },

  // Health
  checkHealth: () => request('/health'),
};

