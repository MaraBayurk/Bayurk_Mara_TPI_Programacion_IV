
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelOrder } from '../api/orders'

export const useCancelOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] })
      queryClient.invalidateQueries({
        queryKey: ['pedido', updatedOrder.id],
      })
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })
}
