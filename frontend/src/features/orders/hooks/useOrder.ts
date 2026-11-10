
import { useQuery } from '@tanstack/react-query'
import { getOrderById } from '../api/orders'

export const useOrder = (id: number) => {
  return useQuery({
    queryKey: ['pedido', id],
    queryFn: () => getOrderById(id),
    enabled: Number.isInteger(id) && id > 0,
  })
}
