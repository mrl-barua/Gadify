import axios from 'axios'
import { useJwtStore } from '../stores/jwtHandler'
import { mailRepository } from './mailRepository'

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

  updateProponent: async (
    id: number,
    departmentId: number,
    proponentType: string,
    proponentStatus: string,
    fullName: string,
    userName: string,
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
          userName: userName,
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
      try {
        await mailRepository.sendApproveAccountMail(response.data.email, response.data.username)
      } catch (err) {
        console.log(err)
      }
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
      try {
        await mailRepository.sendRejectAccountMail(response.data.email, response.data.username)
      } catch (err) {
        console.log(err)
      }
      return response.data
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },
}
