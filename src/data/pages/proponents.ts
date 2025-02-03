import api from '../../services/api'
import { Proponent } from '../../pages/admin/proponents/types'

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: 'proponent_name' | 'team' | 'created_at'
  sortingOrder: 'asc' | 'desc' | null
}

export const getProponents = async (options: Partial<Sorting> & Pagination) => {
  const proponents: Proponent[] = await fetch(api.allProponents()).then((r) => r.json())

  return {
    data: proponents,
    pagination: {
      page: options.page,
      perPage: options.perPage,
      total: proponents.length,
    },
  }
}

export const addProponent = async (proponent: Omit<Proponent, 'id' | 'createdAt'>) => {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  return fetch(api.allProponents(), { method: 'POST', body: JSON.stringify(proponent), headers }).then((r) => r.json())
}

export const updateProponent = async (proponent: Omit<Proponent, 'createdAt'>) => {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  return fetch(api.proponent(proponent.id), { method: 'PUT', body: JSON.stringify(proponent), headers }).then((r) =>
    r.json(),
  )
}

export const removeProponent = async (proponent: Proponent) => {
  return fetch(api.proponent(proponent.id), { method: 'DELETE' })
}
