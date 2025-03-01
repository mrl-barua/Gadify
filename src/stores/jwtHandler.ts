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
    updateUserame(username: string) {
      if (!this.decodedToken) return
      this.decodedToken.username = username
    },
    logout() {
      console.log('Logging out')
      this.token = null
      this.decodedToken = null
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      alert('You have been logged out')
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
    getUserId: (state) => state.decodedToken?.id ?? 0,
    getUsername: (state) => state.decodedToken?.username,
    getUserRole: (state) => state.decodedToken?.role,
  },
})
