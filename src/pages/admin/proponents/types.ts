export enum ProponentType {
  Insider = 'Insider',
  Outsider = 'Outsider',
}

export enum ProponentStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export interface Proponent {
  id: number
  proponentId: string
  departmentId: number
  proponentType: ProponentType
  proponentStatus: ProponentStatus
  fullName: string
  userName: string
  password: string
  createdAt: Date
}

export interface Department {
  id: number
  name: string
  proponents: Proponent[]
}
