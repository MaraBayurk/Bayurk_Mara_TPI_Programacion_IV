
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../api/products'
import type { ProductFilters } from '../types/product.types'

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['productos', filters],
    queryFn: () => getProducts(filters),
  })
}
