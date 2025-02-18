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

interface Submission {
  id: number
  submissionId: string
  proponentId: number
  fileType: string
  proposalTitle: string
  proposalDescription: string
  resourcesLink: string | null
  submissionStatus: string
}

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

      console.log(link + ' ' + fileType)
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

  uploadSubmissionFile: async (files: File[]) => {
    try {
      console.log('Starting file upload process...')

      const formData = new FormData()
      files.forEach((file) => {
        console.log(`Appending file: ${file.name}`)
        formData.append('files', file)
      })

      console.log('Sending request to upload files...')
      const response = await apiClient.post('/api/uploadFiles', formData, {
        headers: {
          Authorization: `Bearer ${jwtStore.getToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      console.log('Files uploaded successfully. Response received: ' + JSON.stringify(response.data.files))
      console.log('Uploaded Files:', response.data.files)

      return response.data.files
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = (error as any).response?.data?.message || (error as Error).message
      console.log('Error occurred during file upload: ' + errorMessage)
      throw error
    }
  },

  createSubmission: async (submission: Submission) => {
    try {
      console.log('Creating submission...')
      console.log(JSON.stringify(submission))
      const response = await apiClient.post('/api/submission', submission, {
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
