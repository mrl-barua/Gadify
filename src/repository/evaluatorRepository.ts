import axios from 'axios'
import { useJwtStore } from '../../src/stores/jwtHandler'

const BASE_URL = import.meta.env.VITE_API_URL

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const jwtStore = useJwtStore()

export const evaluatorsRepository = {
  getEvaluators: async () => {
    try {
      const response = await apiClient.get('/api/evaluators', {
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

  createNewEvaluator: async (
    campusId: number,
    departmentId: number,
    officeId: number,
    fullName: string,
    email: string,
    password: string,
  ) => {
    try {
      const response = await apiClient.post(
        '/api/register/evaluator',
        {
          campusId: campusId,
          departmentId: departmentId,
          officeId: officeId,
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
      console.log('Data:', response.data)
      return response.data
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },

  updateEvaluator: async (
    id: number,
    campusId: number,
    departmentId: number,
    officeId: number,
    fullName: string,
    email: string,
  ) => {
    try {
      const response = await apiClient.put(
        '/api/updateEvaluator',
        {
          id: id,
          campusId: campusId,
          departmentId: departmentId,
          officeId: officeId,
          fullName: fullName,
          email: email,
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
