import type { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { LoadingOverlay } from './components/LoadingOverlay'
import { useTitrationLoading } from './store/titrationSlice'

// Общая оболочка: мобильный экран со страницей и нижней навигацией
export const AppLayout: FC = () => {
  const loading = useTitrationLoading()

  return (
    <div className="mobileContainer">
      <Outlet />
      <BottomNav />
      <LoadingOverlay show={loading} />
    </div>
  )
}
