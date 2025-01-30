import axios from 'axios'
import { useJwtStore } from '../../../../stores/jwtHandler'
import { mailRepository } from '../../../../repository/mailRepository'

const BASE_URL = 'http://localhost:3000'

// Create Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const jwtStore = useJwtStore()

export const submissionRepository = {
  getSubmissions: async () => {
    try {
      const response = await apiClient.get('/api/submissions', {
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

  getSubmissionById: async (id: number) => {
    try {
      const response = await apiClient.post(
        '/api/submission',
        { Id: id }, // JSON body
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
