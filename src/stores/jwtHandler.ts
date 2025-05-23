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

let _token: string | null = localStorage.getItem('token') || sessionStorage.getItem('token') || null

export const useJwtStore = defineStore('jwt', {
  state: (): JwtState => ({
    token: _token,
    decodedToken: _token ? jwtDecode<DecodedToken>(_token) : null,
  }),

  actions: {
    setLocalStorageToken(token: string) {
      console.log('Setting token in localStorage:', token)
      _token = token
      this.token = token
      this.decodedToken = jwtDecode<DecodedToken>(token)
      localStorage.setItem('token', token)
      sessionStorage.removeItem('token') // Ensure only one source
    },

    setSessionStorageToken(token: string) {
      console.log('Setting token in sessionStorage:', token)
      _token = token
      this.token = token
      this.decodedToken = jwtDecode<DecodedToken>(token)
      sessionStorage.setItem('token', token)
      localStorage.removeItem('token') // Ensure only one source
    },

    updateUsername(username: string) {
      if (!this.decodedToken) return
      this.decodedToken.username = username
    },

    logout() {
      console.log('Logging out')
      _token = null
      this.token = null
      this.decodedToken = null
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
    },

    loadFromStorage() {
      _token = localStorage.getItem('token') || sessionStorage.getItem('token') || null
      this.token = _token
      this.decodedToken = _token ? jwtDecode<DecodedToken>(_token) : null
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
