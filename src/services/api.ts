// Real API client connecting to backend
// Updated to work with actual Express backend on port 5000

const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'veoflow.netlify.app' ? '' : 'http://localhost:5000');

type ApiResponse = any;

// Simple token management
let authToken: string | null = localStorage.getItem('auth_token');

const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('auth_token', token);
};

const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('auth_token');
};

// Helper function for making requests
async function request(path: string, options: RequestInit = {}): Promise<ApiResponse> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available (development mode allows requests without token)
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      
      // In development, log helpful debugging info
      if (response.status === 401) {
        console.warn('Authentication failed - this is OK in development mode');
        throw new Error('Authentication failed');
      }
      
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    // Handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to backend. Make sure backend is running on port 5002');
    }
    throw error;
  }
}

const api = {
  baseUrl: API_BASE_URL,
  
  setAuthToken,
  clearAuthToken,

  // GET requests
  get: async (path: string): Promise<ApiResponse> => {
    return request(path, { method: 'GET' });
  },

  // POST requests
  post: async (path: string, body?: any): Promise<ApiResponse> => {
    return request(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  // PUT requests
  put: async (path: string, body?: any): Promise<ApiResponse> => {
    return request(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  // DELETE requests
  del: async (path: string): Promise<ApiResponse> => {
    return request(path, { method: 'DELETE' });
  },
};

export default api;
