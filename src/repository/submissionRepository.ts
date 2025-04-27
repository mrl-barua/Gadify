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
interface SubmissionFile {
  resourcesLink: string // Assuming "resourcesLink" is a string in the files
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

  getOnHoldSubmissions: async (page: number, searchFilter: string) => {
    try {
      const response = await apiClient.post(
        `/api/onHoldSubmissions`,
        { page: page, limit: 10, searchFilter: searchFilter },
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

  getForEvaluationSubmissions: async (page: number, searchFilter: string) => {
    try {
      const response = await apiClient.post(
        `/api/forEvaluationSubmissions`,
        { page: page, limit: 10, searchFilter: searchFilter },
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

  getForCorrectionSubmissions: async (page: number, searchFilter: string) => {
    try {
      const response = await apiClient.post(
        `/api/forCorrectionSubmissions`,
        { page: page, limit: 10, searchFilter: searchFilter },
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

  getCompletedSubmissions: async (page: number, searchFilter: string) => {
    try {
      const response = await apiClient.post(
        `/api/completedSubmissions`,
        { page: page, limit: 10, searchFilter: searchFilter },
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

  getSubmissionCertificates: async (submissionId: number) => {
    try {
      const response = await apiClient.post(
        '/report/generate-report',
        { submissionId },
        {
          headers: {
            Authorization: `Bearer ${jwtStore.getToken}`,
          },
          responseType: 'blob',
        },
      )

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Failed to fetch report. Status: ${response.status}`)
      }

      console.log('Downloaded PDF Blob:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching submission certificates:', error)
      throw error
    }
  },

  assignEvaluatorToSubmission: async (submissionId: number, evaluatorIds: number[]) => {
    try {
      const actorName = jwtStore.getUsername
      const response = await apiClient.post(
        '/api/assignEvaluators',
        { submissionId, evaluatorIds, actorName },
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
        formData.append('file', file)
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

  updateSubmission: async (
    id: number,
    submissionId: string,
    fileType: string,
    proposalTitle: string,
    proposalDescription: string,
    submissionStatus: string,
    submissionFiles: SubmissionFile[],
    actorName: string,
  ) => {

    try {
      console.log('Updating submission...')
      const response = await apiClient.put(
        '/api/updateSubmission',
        {
          id: id,
          submissionId: submissionId,
          fileType: fileType,
          proposalTitle: proposalTitle,
          proposalDescription: proposalDescription,
          submissionStatus: submissionStatus,
          submissionFiles: submissionFiles,
          actorName: actorName,
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

  approveSubmission: async (submissionId: number) => {
    try {
      const actorName = jwtStore.getUsername
      const response = await apiClient.post(
        '/api/approveSubmission',
        { submissionId: submissionId, actorName: actorName },
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

  forCorrectionSubmission: async (submissionId: number, remarks: string) => {
    try {
      const actorName = jwtStore.getUsername
      const response = await apiClient.post(
        '/api/forCorrectionSubmission',
        { submissionId: submissionId, actorName: actorName, remarks: remarks },
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

  forEvaluationSubmission: async (submissionId: number, remarks: string) => {
    try {
      const actorName = jwtStore.getUsername
      const response = await apiClient.post(
        '/api/forEvaluationSubmission',
        { submissionId: submissionId, actorName: actorName, remarks: remarks },
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
