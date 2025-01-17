import { defineStore } from 'pinia'
import {
  addProponent,
  getProponents,
  Pagination,
  removeProponent,
  Sorting,
  updateProponent,
} from '../data/pages/proponents'
import { Proponent } from '../pages/admin/proponents/types'

export const useProponentsStore = defineStore('proponents', {
  state: () => {
    return {
      items: [] as Proponent[],
      pagination: {
        page: 1,
        perPage: 10,
        total: 0,
      } as Pagination,
    }
  },

  actions: {
    async getAll(options: { pagination: Pagination; sorting?: Sorting }) {
      const { data, pagination } = await getProponents({
        ...options.sorting,
        ...options.pagination,
      })
      this.items = data
      this.pagination = pagination
    },

    async add(proponent: Omit<Proponent, 'id' | 'created_at'>) {
      const [newProponent] = await addProponent(proponent)
      this.items.push(newProponent)
    },

    async update(proponent: Proponent) {
      const [updatedProponent] = await updateProponent(proponent)
      const index = this.items.findIndex(({ id }) => id === proponent.id)
      this.items.splice(index, 1, updatedProponent)
    },

    async remove(proponent: Proponent) {
      const isRemoved = await removeProponent(proponent)

      if (isRemoved) {
        const index = this.items.findIndex(({ id }) => id === proponent.id)
        this.items.splice(index, 1)
      }
    },
  },
})
