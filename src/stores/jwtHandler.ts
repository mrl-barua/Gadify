import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import { get } from 'http'

interface DecodedToken {
  [key: string]: any // Replace with the exact structure of your token if known
}

interface JwtState {
  token: string | null
  decodedToken: DecodedToken | null
}

export const useJwtStore = defineStore('jwt', {
  state: (): JwtState => ({
    token: localStorage.getItem('token'), // Load token from localStorage
    decodedToken: localStorage.getItem('token')
      ? jwtDecode<DecodedToken>(localStorage.getItem('token') as string)
      : null, // Decode token if it exists
  }),
  actions: {
    setToken(token: string) {
      console.log('Setting token:', token)
      this.token = token
      this.decodedToken = jwtDecode<DecodedToken>(token)
      localStorage.setItem('token', token) // Save token to localStorage
    },
    getLoggedInUserId() {
      const mockUserId = 1
      return mockUserId
    },
    logout() {
      console.log('Logging out')
      this.token = null
      this.decodedToken = null
      localStorage.removeItem('token') // Remove token from localStorage
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token, // Returns true if a token exists
    getDecodedToken: (state) => state.decodedToken, // Returns the decoded token payload
    getToken: (state) => state.token, // Returns the raw token
  },
})
