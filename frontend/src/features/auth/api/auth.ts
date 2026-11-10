import { api } from '../../../shared/services/api'
import type { AuthUser, RegisterData } from '../types/auth.types'

export const loginRequest = async (
  username: string,
  password: string,
): Promise<void> => {
  const formData = new URLSearchParams()

  formData.append('username', username)
  formData.append('password', password)

  await api.post('/auth/token', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

export const registerRequest = async (
  data: RegisterData,
): Promise<AuthUser> => {
  const response = await api.post<AuthUser>('/auth/register', data)
  return response.data
}

export const getCurrentUser = async (): Promise<AuthUser> => {
  const response = await api.get<AuthUser>('/auth/me')
  return response.data
}

export const logoutRequest = async (): Promise<void> => {
  await api.post('/auth/logout')
}