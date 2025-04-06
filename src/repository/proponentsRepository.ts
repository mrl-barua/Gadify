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

  getProponentById: async (id: number) => {
    try {
      const response = await apiClient.post(
        `/api/getProponentById`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${jwtStore.getToken}`,
          },
        },
      )
      return response.data
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },

  updateProponent: async (
    id: number,
    departmentId: number,
    proponentType: string,
    proponentStatus: string,
    fullName: string,
    email: string,
  ) => {
    try {
      const response = await apiClient.put(
        `/api/updateProponents`,
        {
          id: id,
          departmentId: departmentId,
          proponentType: proponentType,
          proponentStatus: proponentStatus,
          fullName: fullName,
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtStore.getToken}`,
          },
        },
      )
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

  approveProponent: async (proponentId: number) => {
    try {
      const response = await apiClient.post(
        `/api/admin/approve-proponent`,
        { proponentId },
        {
          headers: {
            Authorization: `Bearer ${jwtStore.getToken}`,
          },
        },
      )
      console.log('Reject response:', response)
      return response.data
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },
  rejectProponent: async (proponentId: number) => {
    try {
      const response = await apiClient.post(
        `/api/admin/reject-proponent`,
        { proponentId },
        {
          headers: {
            Authorization: `Bearer ${jwtStore.getToken}`,
          },
        },
      )
      console.log('Reject response:', response)

      return response.data
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },

  registerProponent: async (departmentId: number, fullName: string, email: string, password: string) => {
    try {
      const response = await apiClient.post(
        `/api/register/proponent`,
        {
          id: 0,
          departmentId: departmentId,
          proponentType: 'Insider',
          proponentStatus: 'Pending',
          fullName: fullName,
          email: email,
          password: password,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtStore.getToken}`,
          },
        },
      )
      return response.data
    } catch (error) {
      console.error('Error:', error)

      throw error
    }
  },
}
