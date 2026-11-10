
import { Outlet } from 'react-router-dom'
import { Header } from '../../shared/components/Header'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#FAF7FF]">
      <Header />
      <Outlet />
    </div>
  )
}
