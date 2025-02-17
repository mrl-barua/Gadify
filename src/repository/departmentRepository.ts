import axios from 'axios'
import { useJwtStore } from '../stores/jwtHandler'

const BASE_URL = import.meta.env.VITE_API_URL
console.log('API URL:', BASE_URL)

console.log('BASE_URL:', BASE_URL)

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const jwtStore = useJwtStore()

export const departmentRepository = {
  getDepartments: async () => {
    try {
      const response = await apiClient.get('/api/deparments/', {
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
}
