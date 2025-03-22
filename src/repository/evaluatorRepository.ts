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

  getEvaluatorById: async (id: number) => {
    try {
      const response = await apiClient.post(
        `/api/getEvaluatorById`,
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

  createNewEvaluator: async (officeId: number, fullName: string, email: string, password: string) => {
    try {
      const response = await apiClient.post(
        '/api/register/evaluator',
        {
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

  updateEvaluator: async (id: number, officeId: number, fullName: string, email: string) => {
    try {
      const response = await apiClient.put(
        '/api/updateEvaluator',
        {
          id: id,
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

  getSubmissionToBeEvaluatedByEvaluatorId: async (evaluatorId: number) => {
    try {
      const response = await apiClient.post(
        '/api/getSubmissionToBeEvaluated',
        { evaluatorId: evaluatorId },
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

  evaluateSubmission: async (
    submissionId: number,
    evaluatorId: number,
    genderAssessments: Array<{
      sectionId: number
      doneNo: boolean
      donePartly: boolean
      doneYes: boolean
      score: number
      comments?: string
    }>,
  ) => {
    try {
      console.log({
        submissionId,
        evaluatorId,
        genderAssessments,
      })
      const response = await apiClient.post(
        '/api/evaluateSubmission',
        {
          submissionId,
          evaluatorId,
          genderAssessments,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtStore.getToken}`,
          },
        },
      )

      console.log('Submission Evaluated:', response.data)
      return response.data
    } catch (error) {
      console.error('Error evaluating submission:', error)
      throw error
    }
  },
}
