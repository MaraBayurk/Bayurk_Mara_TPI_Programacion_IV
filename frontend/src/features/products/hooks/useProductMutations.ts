
import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createProduct,
  updateProduct,
  updateProductStock,
  deleteProduct,
} from '../api/products'

import type {
  ProductStockUpdate,
  ProductUpdate,
} from '../types/product.types'

export const useProductMutations = () => {
  const queryClient = useQueryClient()

  const invalidateProducts = () =>
    queryClient.invalidateQueries({
      queryKey: ['productos'],
    })

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: invalidateProducts,
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: ProductUpdate
    }) => updateProduct(id, data),
    onSuccess: invalidateProducts,
  })

  const stockMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: ProductStockUpdate
    }) => updateProductStock(id, data),
    onSuccess: invalidateProducts,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: invalidateProducts,
  })

  return {
    createMutation,
    updateMutation,
    stockMutation,
    deleteMutation,
  }
}
