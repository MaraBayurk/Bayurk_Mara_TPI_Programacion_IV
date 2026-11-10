
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateOrderStatus } from '../api/orders'
import type { OrderStatusUpdate } from '../types/order.types'

export const useAdminOrderMutations = () => {
  const queryClient = useQueryClient()

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: OrderStatusUpdate
    }) => updateOrderStatus(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pedidos'],
      })
    },
  })

  return {
    updateStatusMutation,
  }
}
