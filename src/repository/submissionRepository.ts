import axios from 'axios'
import { useJwtStore } from '../stores/jwtHandler'
// import { mailRepository } from './mailRepository'
// import { get } from 'http'

const BASE_URL = import.meta.env.VITE_API_URL
console.log('API URL:', BASE_URL)

console.log('BASE_URL:', BASE_URL)
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
        '/api/submissionById',
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

  getSubmissionByUserId: async (userId: number) => {
    try {
      const response = await apiClient.post(
        '/api/submissionByProponentId',
        { proponentId: userId },
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

  getSubmissionFiles: async (link: string, fileType: string) => {
    try {
      if (fileType === 'File') {
        const response = await apiClient.get(`http://localhost:3000/api/file/${link}`, {
          headers: {
            Authorization: `Bearer ${jwtStore.getToken}`,
          },
          responseType: 'blob',
        })

        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
        const a = document.createElement('a')
        a.href = url
        a.download = 'Downloaded-File.pdf'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } else if (fileType === 'Link') {
        window.open(link, '_blank')
        return
      }

      alert(link + ' ' + fileType)
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },

  assignEvaluatorToSubmission: async (submissionId: number, evaluatorIds: number[]) => {
    try {
      const response = await apiClient.post(
        '/api/assignEvaluators',
        { submissionId, evaluatorIds },
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

  getSubmissionEvaluatorsById: async (submissionId: number) => {
    try {
      const response = await apiClient.post(
        '/api/getEvaluators',
        { submissionId: submissionId },
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
