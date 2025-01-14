import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
interface JwtState {
  token: string | null
  decodedToken: string | null
}

export const useJwtStore = defineStore('jwt', {
  state: (): JwtState => ({
    token: '',
    decodedToken: '',
  }),
  actions: {
    setToken(token: string) {
      console.log('token', token)
      this.token = token
      this.decodedToken = jwtDecode(token)
    },
    clearToken() {
      this.token = null
      this.decodedToken = null
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    getDecodedToken: (state) => state.decodedToken,
    getToken: (state) => state.token,
  },
})
