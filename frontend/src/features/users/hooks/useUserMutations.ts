
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateUser, deactivateUser } from '../api/users'

export const useUserMutations = () => {
  const queryClient = useQueryClient()

  const activateMutation = useMutation({
    mutationFn: activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })

  const deactivateMutation = useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })

  return {
    activateMutation,
    deactivateMutation,
  }
}
