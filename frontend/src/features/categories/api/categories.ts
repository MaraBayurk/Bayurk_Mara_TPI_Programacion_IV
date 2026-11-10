
import { api } from '../../../shared/services/api'
import type {
  Category,
  CategoryCreate,
  CategoryUpdate,
} from '../types/category.types'

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>('/categorias')
  return response.data
}

export const createCategory = async (
  data: CategoryCreate,
): Promise<Category> => {
  const response = await api.post<Category>('/categorias', data)
  return response.data
}

export const updateCategory = async (
  id: number,
  data: CategoryUpdate,
): Promise<Category> => {
  const response = await api.put<Category>(`/categorias/${id}`, data)
  return response.data
}

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categorias/${id}`)
}
