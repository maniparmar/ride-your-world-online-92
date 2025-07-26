const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  total?: number;
  error?: string;
  message?: string;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// User API functions
export const userApi = {
  getAll: () => apiRequest<User[]>('/users'),
  
  getById: (id: number) => apiRequest<User>(`/users/${id}`),
  
  create: (data: { name: string; email: string }) =>
    apiRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: { name?: string; email?: string }) =>
    apiRequest<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiRequest<User>(`/users/${id}`, {
      method: 'DELETE',
    }),
};

// Todo API functions
export const todoApi = {
  getAll: (params?: { completed?: boolean; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.completed !== undefined) {
      searchParams.append('completed', String(params.completed));
    }
    if (params?.search) {
      searchParams.append('search', params.search);
    }
    
    const query = searchParams.toString();
    return apiRequest<Todo[]>(`/todos${query ? `?${query}` : ''}`);
  },
  
  getById: (id: number) => apiRequest<Todo>(`/todos/${id}`),
  
  create: (data: { title: string; description?: string }) =>
    apiRequest<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: { title?: string; description?: string; completed?: boolean }) =>
    apiRequest<Todo>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  toggle: (id: number) =>
    apiRequest<Todo>(`/todos/${id}/toggle`, {
      method: 'PATCH',
    }),
  
  delete: (id: number) =>
    apiRequest<Todo>(`/todos/${id}`, {
      method: 'DELETE',
    }),
};

// Health check
export const healthCheck = () => 
  fetch(`${API_BASE_URL.replace('/api', '')}/health`)
    .then(res => res.json());