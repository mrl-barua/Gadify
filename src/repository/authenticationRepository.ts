import axios from 'axios'
import { useJwtStore } from '../../src/stores/jwtHandler'

const BASE_URL = import.meta.env.VITE_API_URL

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const adminLoginApiService = {
  async login(email: string, password: string) {
    try {
      return await apiClient.post('/api/login/admin', { email, password })
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },
}

export const proponentLoginApiService = {
  async login(email: string, password: string) {
    try {
      return await apiClient.post('/api/login/proponent', { email, password })
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },
}

export const evaluatorLoginApiService = {
  async login(email: string, password: string) {
    try {
      return await apiClient.post('/api/login/evaluator', { email, password })
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },
}

export const logoutApiService = {
  async logout() {
    try {
      const jwtStore = useJwtStore() // Access the store
      const token = jwtStore.getToken // Get the current token

      if (token) {
        await apiClient.post(
          '/api/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        jwtStore.logout() // Clear the token after logout
      }
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  },
}
