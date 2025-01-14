import axios from 'axios'

const BASE_URL = 'http://localhost:3000'

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const loginApiService = {
  login: (userName: string, password: string) => {
    return apiClient.post('/api/login', { userName, password })
  },
}
export const logoutApiService = {
  logout: (token: string) => {
    return apiClient.post(
      '/api/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
  },
}
