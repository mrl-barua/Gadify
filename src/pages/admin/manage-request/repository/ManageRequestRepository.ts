import axios from 'axios'
import { useJwtStore } from '../../../../stores/jwtHandler'
import { mailRepository } from '../../../../repository/mailRepository'

const mockSubmissions = [
  {
    id: 1,
    submissionId: 'SUB-0001',
    proponentId: 1,
    evaluatorId: 1,
    fileType: 'File',
    proposalTitle: 'Proposal 1 Title',
    proposalDescription: 'This is the description of proposal 1.',
    resourcesLink: 'https://resources-link.com/proposal1',
    submissionStatus: 'OnHold',
    remarksId: null,
    createdAt: '2025-01-25T12:56:56.000Z',
    proponent: {
      proponentId: 'IN-0001',
      departmentId: 1,
      proponentType: 'Inside',
      proponentStatus: 'Approved',
      fullName: 'Charlie Proponent',
      userName: 'mlbarua@usep.edu.ph',
      department: {
        departmentId: 'D-0001',
        campusId: 1,
        departmentName: 'cc',
        campus: {
          campusId: 'C-0001',
          campusName: 'Main Campus',
          campusAddress: '123 Main St, City A',
        },
      },
    },
    evaluator: {
      evaluatorId: 'E-0001',
      campusId: 1,
      departmentId: 1,
      officeId: 1,
      fullName: 'Alice Evaluator',
      email: 'evaluator1@example.com',
      campus: {
        campusId: 'C-0001',
        campusName: 'Main Campus',
        campusAddress: '123 Main St, City A',
      },
      office: {
        officeId: 'O-0001',
        campusId: 1,
        departmentId: 1,
        officeName: 'Office of IT',
        campus: {
          campusId: 'C-0001',
          campusName: 'Main Campus',
          campusAddress: '123 Main St, City A',
        },
        department: {
          departmentId: 'D-0001',
          campusId: 1,
          departmentName: 'cc',
          campus: {
            campusId: 'C-0001',
            campusName: 'Main Campus',
            campusAddress: '123 Main St, City A',
          },
        },
      },
    },
    remarks: null,
  },
  {
    id: 2,
    submissionId: 'SUB-0002',
    proponentId: 1,
    evaluatorId: 1,
    fileType: 'File',
    proposalTitle: 'Proposal 1 Title',
    proposalDescription: 'This is the description of proposal 1.',
    resourcesLink: 'https://resources-link.com/proposal1',
    submissionStatus: 'Evaluation',
    remarksId: null,
    createdAt: '2025-01-25T23:26:48.000Z',
    proponent: {
      proponentId: 'IN-0001',
      departmentId: 1,
      proponentType: 'Inside',
      proponentStatus: 'Approved',
      fullName: 'Charlie Proponent',
      userName: 'mlbarua@usep.edu.ph',
      department: {
        departmentId: 'D-0001',
        campusId: 1,
        departmentName: 'cc',
        campus: {
          campusId: 'C-0001',
          campusName: 'Main Campus',
          campusAddress: '123 Main St, City A',
        },
      },
    },
    evaluator: {
      evaluatorId: 'E-0001',
      campusId: 1,
      departmentId: 1,
      officeId: 1,
      fullName: 'Alice Evaluator',
      email: 'evaluator1@example.com',
      campus: {
        campusId: 'C-0001',
        campusName: 'Main Campus',
        campusAddress: '123 Main St, City A',
      },
      office: {
        officeId: 'O-0001',
        campusId: 1,
        departmentId: 1,
        officeName: 'Office of IT',
        campus: {
          campusId: 'C-0001',
          campusName: 'Main Campus',
          campusAddress: '123 Main St, City A',
        },
        department: {
          departmentId: 'D-0001',
          campusId: 1,
          departmentName: 'cc',
          campus: {
            campusId: 'C-0001',
            campusName: 'Main Campus',
            campusAddress: '123 Main St, City A',
          },
        },
      },
    },
    remarks: null,
  },
  {
    id: 3,
    submissionId: 'SUB-0003',
    proponentId: 1,
    evaluatorId: 1,
    fileType: 'Link',
    proposalTitle: 'Proposal 1 Title',
    proposalDescription: 'This is the description of proposal 1.',
    resourcesLink: 'https://resources-link.com/proposal1',
    submissionStatus: 'Completed',
    remarksId: null,
    createdAt: '2025-01-25T23:27:05.000Z',
    proponent: {
      proponentId: 'IN-0001',
      departmentId: 1,
      proponentType: 'Inside',
      proponentStatus: 'Approved',
      fullName: 'Charlie Proponent',
      userName: 'mlbarua@usep.edu.ph',
      department: {
        departmentId: 'D-0001',
        campusId: 1,
        departmentName: 'cc',
        campus: {
          campusId: 'C-0001',
          campusName: 'Main Campus',
          campusAddress: '123 Main St, City A',
        },
      },
    },
    evaluator: {
      evaluatorId: 'E-0001',
      campusId: 1,
      departmentId: 1,
      officeId: 1,
      fullName: 'Alice Evaluator',
      email: 'evaluator1@example.com',
      campus: {
        campusId: 'C-0001',
        campusName: 'Main Campus',
        campusAddress: '123 Main St, City A',
      },
      office: {
        officeId: 'O-0001',
        campusId: 1,
        departmentId: 1,
        officeName: 'Office of IT',
        campus: {
          campusId: 'C-0001',
          campusName: 'Main Campus',
          campusAddress: '123 Main St, City A',
        },
        department: {
          departmentId: 'D-0001',
          campusId: 1,
          departmentName: 'cc',
          campus: {
            campusId: 'C-0001',
            campusName: 'Main Campus',
            campusAddress: '123 Main St, City A',
          },
        },
      },
    },
    remarks: null,
  },
]

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
      // const response = await apiClient.get('/api/submissions, {
      //   headers: {
      //     Authorization: `Bearer ${jwtStore.getToken}`,
      //   },
      // })
      // console.log('Data:', response.data)
      // return response.data

      return mockSubmissions
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },
}
