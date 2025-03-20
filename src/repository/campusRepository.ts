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

export const campusRepository = {
  getCampuses: async () => {
    try {
      const response = await apiClient.get('/api/campus', {
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

  createCampus: async (campusName: string, campusAddress: string) => {
    try {
      const response = await apiClient.post(
        '/api/campus',
        {
          campusName: campusName,
          campusAddress: campusAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtStore.getToken}`,
          },
        },
      )
      console.log('Data:', response.data)
      return response.data
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },

  updateCampus: async (id: number, campusName: string, campusAddress: string) => {
    try {
      const response = await apiClient.put(
        '/api/campus',
        {
          id: id,
          campusName: campusName,
          campusAddress: campusAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtStore.getToken}`,
          },
        },
      )
      console.log('Data:', response.data)
      return response.data
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },
}
