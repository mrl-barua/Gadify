import axios from 'axios'
import { useJwtStore } from '../../../../stores/jwtHandler'

const BASE_URL = 'http://localhost:3000'

// Create Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const jwtStore = useJwtStore()

export const proponentsRepository = {
  getProponents: async () => {
    try {
      const response = await apiClient.get('/api/proponents/', {
        headers: {
          Authorization: `Bearer ${jwtStore.getToken}`,
        },
      })
      console.log('Data:', response.data)
      return response.data
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },
  getProponentById: async (id: string) => {
    try {
      const response = await apiClient.get(`/api/proponents/${id}`, {
        headers: {
          Authorization: `Bearer ${jwtStore.getToken}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },
  createProponent: async (proponentData: any) => {
    try {
      const response = await apiClient.post('/api/proponents', proponentData, {
        headers: {
          Authorization: `Bearer ${jwtStore.getToken}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },
  updateProponent: async (id: string, proponentData: any) => {
    try {
      const response = await apiClient.put(`/api/proponents/${id}`, proponentData, {
        headers: {
          Authorization: `Bearer ${jwtStore.getToken}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },
  deleteProponent: async (id: string) => {
    try {
      const response = await apiClient.delete(`/api/proponents/${id}`, {
        headers: {
          Authorization: `Bearer ${jwtStore.getToken}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },
}
