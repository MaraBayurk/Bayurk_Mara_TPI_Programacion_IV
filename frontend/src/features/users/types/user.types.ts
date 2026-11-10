
import type { AuthUser } from '../../auth/types/auth.types'

export interface AdminUser extends AuthUser {
  created_at: string
}
