import axios from 'axios'
import { useJwtStore } from '../../src/stores/jwtHandler'
import { create } from 'domain'

const BASE_URL = import.meta.env.VITE_API_URL

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const jwtStore = useJwtStore()

export const officeRepository = {
  getOffices: async () => {
    try {
      const response = await apiClient.get('/api/offices', {
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

  createOffice: async (departmentId: number, officeName: string) => {
    try {
      const response = await apiClient.post(
        '/api/office',
        {
          departmentId: departmentId,
          officeName: officeName,
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

  updateOffice: async (officeId: number, departmentId: number, officeName: string) => {
    try {
      const response = await apiClient.put(
        `/api/office`,

        { id: officeId, departmentId: departmentId, officeName: officeName },
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
