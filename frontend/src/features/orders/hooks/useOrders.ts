
import { useQuery } from '@tanstack/react-query'
import { getOrders } from '../api/orders'

export const useOrders = () => {
  return useQuery({
    queryKey: ['pedidos'],
    queryFn: () => getOrders(),
  })
}
