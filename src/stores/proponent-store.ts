import { defineStore } from 'pinia'

export const useProponentStore = defineStore({
  id: 'proponent',
  state: () => ({
    proponent: {
      fullname: '',
      username: '',
      department: 0,
      email: '',
      password: '',
    },
  }),
  actions: {
    setProponentFullName(fullName: string) {
      this.proponent.fullname = fullName
    },
    setProponentEmail(email: string) {
      this.proponent.email = email
    },
    setProponentUsername(username: string) {
      this.proponent.username = username
    },

    setProponentDepartment(department: number) {
      this.proponent.department = department
    },
    setProponentPassword(password: string) {
      this.proponent.password = password
    },
  },
})
