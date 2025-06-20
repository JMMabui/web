const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export const api = {
  get: async (endpoint: string, options?: RequestInit) => {
    const response = await fetch(`${baseURL}${endpoint}`, options)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response
  },

  post: async (endpoint: string, data?: any, options?: RequestInit) => {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response
  },

  put: async (endpoint: string, data?: any, options?: RequestInit) => {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response
  },

  delete: async (endpoint: string, options?: RequestInit) => {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'DELETE',
      ...options,
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response
  },
}
