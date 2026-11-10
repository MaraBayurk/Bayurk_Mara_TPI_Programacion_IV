
import { api } from '../../../shared/services/api'

import type {
  Product,
  ProductCreate,
  ProductFilters,
  ProductStockUpdate,
  ProductUpdate,
  ProductsPaginated,
} from '../types/product.types'

export const getProducts = async (
  filters: ProductFilters,
): Promise<ProductsPaginated> => {
  const response = await api.get<ProductsPaginated>('/productos', {
    params: filters,
  })

  return response.data
}

export const createProduct = async (
  data: ProductCreate,
): Promise<Product> => {
  const response = await api.post<Product>('/productos', data)
  return response.data
}

export const updateProduct = async (
  id: number,
  data: ProductUpdate,
): Promise<Product> => {
  const response = await api.put<Product>(`/productos/${id}`, data)
  return response.data
}

export const updateProductStock = async (
  id: number,
  data: ProductStockUpdate,
): Promise<Product> => {
  const response = await api.patch<Product>(
    `/productos/${id}/stock`,
    data,
  )

  return response.data
}

export const deleteProduct = async (
  id: number,
): Promise<void> => {
  await api.delete(`/productos/${id}`)
}
