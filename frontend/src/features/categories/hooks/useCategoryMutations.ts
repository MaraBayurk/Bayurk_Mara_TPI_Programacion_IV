
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api/categories'

export const useCategoryMutations = () => {
  const queryClient = useQueryClient()

  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: ['categorias'] })
  }

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: invalidateCategories,
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: { nombre?: string; descripcion?: string }
    }) => updateCategory(id, data),
    onSuccess: invalidateCategories,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: invalidateCategories,
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
