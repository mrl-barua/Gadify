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

export const adminRepository = {
  getAllAdmin: async () => {
    const response = await apiClient.get(`/api/admin`, {
      headers: {
        Authorization: `Bearer ${jwtStore.getToken}`,
      },
    })
    return response.data
  },

  getAdminById: async (id: number) => {
    try {
      const response = await apiClient.post(
        `/api/getAdminById`,
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

  updateAdmin: async (id: number, adminId: string, fullName: string, email: string) => {
    try {
      const response = await apiClient.put(
        `/api/updateAdmin`,
        {
          id: id,
          adminId: adminId,
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

  createAdmin: async (fullName: string, email: string, password: string) => {
    try {
      const response = await apiClient.post(
        `/api/register/admin`,
        {
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
