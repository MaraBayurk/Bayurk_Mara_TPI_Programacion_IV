
import { api } from '../../../shared/services/api'
import type { AdminUser } from '../types/user.types'

export const getUsers = async (): Promise<AdminUser[]> => {
  const response = await api.get<AdminUser[]>('/admin/usuarios')
  return response.data
}

export const activateUser = async (id: number): Promise<AdminUser> => {
  const response = await api.post<AdminUser>(
    `/admin/usuarios/${id}/activar`,
  )
  return response.data
}

export const deactivateUser = async (id: number): Promise<AdminUser> => {
  const response = await api.post<AdminUser>(
    `/admin/usuarios/${id}/desactivar`,
  )
  return response.data
}
