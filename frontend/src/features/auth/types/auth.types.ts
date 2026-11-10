export type UserRole = 'admin' | 'user'

export interface AuthUser {
  id: number
  username: string
  full_name: string
  email: string
  role: UserRole
  disabled: boolean
}

export interface RegisterData {
  username: string
  full_name: string
  email: string
  password: string
}