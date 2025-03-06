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
      const response = await apiClient.get('/api/departments', {
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

  createDepartment: async (campusId: number, departmentName: string) => {
    try {
      const response = await apiClient.post(
        '/api/department',
        {
          campusId: campusId,
          departmentName: departmentName,
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

  updateDepartment: async (id: number, campusId: number, departmentName: string) => {
    try {
      const response = await apiClient.put(
        `/api/department`,
        {
          id: id,
          campusId: campusId,
          departmentName: departmentName,
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
