
import { useQuery } from '@tanstack/react-query'
import { getOrders } from '../api/orders'
import type { OrderStatus } from '../types/order.types'

export const useAdminOrders = (estado?: OrderStatus) => {
  return useQuery({
    queryKey: ['pedidos', 'admin', { estado }],
    queryFn: () => getOrders(0, 100, estado),
  })
}
