import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  id: number
  username: string
  role: string
  iat: number
  exp: number
}

interface JwtState {
  token: string | null
  decodedToken: DecodedToken | null
}

export const useJwtStore = defineStore('jwt', {
  state: (): JwtState => {
    const token = localStorage.getItem('token')
    return {
      token,
      decodedToken: token ? jwtDecode<DecodedToken>(token) : null,
    }
  },
  actions: {
    setLocalStorageToken(token: string) {
      console.log('Setting token:', token)
      this.token = token
      this.decodedToken = jwtDecode<DecodedToken>(token)
      localStorage.setItem('token', token)
    },
    setSessionStorageToken(token: string) {
      console.log('Setting token:', token)
      this.token = token
      this.decodedToken = jwtDecode<DecodedToken>(token)
      sessionStorage.setItem('token', token)
    },
    getLoggedInUserId() {
      return this.decodedToken?.id ?? null
    },
    getLoggedInUserRole() {
      return this.decodedToken?.role ?? null
    },
    logout() {
      console.log('Logging out')
      this.token = null
      this.decodedToken = null
      localStorage.removeItem('token')
    },
  },
  getters: {
    isAuthenticated: (state) => {
      if (!state.token || !state.decodedToken) return false
      const currentTime = Math.floor(Date.now() / 1000)
      return state.decodedToken.exp > currentTime
    },
    getDecodedToken: (state) => state.decodedToken,
    getToken: (state) => state.token,
  },
})
