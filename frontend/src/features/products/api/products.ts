
import { api } from '../../../shared/services/api'
import type {
  ProductFilters,
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
