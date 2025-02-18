import axios from 'axios'
import { useJwtStore } from '../../src/stores/jwtHandler'

const BASE_URL = import.meta.env.VITE_API_URL
console.log('API URL:', BASE_URL)

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const jwtStore = useJwtStore()

export const mailRepository = {
  sendPendingAccountMail: async (to: string, username: string) => {
    try {
      const response = await apiClient.post(
        '/mail/pending-account',
        { to, username },
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
  sendApproveAccountMail: async (to: string, username: string) => {
    try {
      const response = await apiClient.post(
        '/mail/approve-account',
        { to, username },
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
  sendRejectAccountMail: async (to: string, username: string) => {
    try {
      const response = await apiClient.post(
        '/mail/reject-account',
        { to, username },
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
  sendProposalSubmissionMail: async (to: string, username: string, proposalTitle: string) => {
    try {
      const response = await apiClient.post(
        '/mail/proposal-submission',
        { to, username, proposalTitle },
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
  sendProposalEvaluatedMail: async (to: string, username: string, proposalTitle: string) => {
    try {
      const response = await apiClient.post(
        '/mail/proposal-evaluated',
        { to, username, proposalTitle },
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
  sendProposalAssignedMail: async (to: string, evaluatorName: string, proposalTitle: string) => {
    try {
      const response = await apiClient.post(
        '/mail/proposal-assigned',
        { to, evaluatorName, proposalTitle },
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
  sendUserSignupPendingMail: async (to: string) => {
    try {
      const response = await apiClient.post(
        '/mail/user-signup-pending',
        { to },
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
  sendProposalAwaitingAssignmentMail: async (to: string, proposalTitle: string) => {
    try {
      const response = await apiClient.post(
        '/mail/proposal-awaiting-assignment',
        { to, proposalTitle },
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
  sendProposalEvaluationCompletedMail: async (to: string, proposalTitle: string) => {
    try {
      const response = await apiClient.post(
        '/mail/proposal-evaluation-completed',
        { to, proposalTitle },
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
