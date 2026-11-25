import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import AddPage from './pages/AddPage'
import FeedPage from './pages/FeedPage'
import GridPage from './pages/GridPage'
import LoginPage from './pages/LoginPage'
import { ROUTES } from './Routes'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to={ROUTES.FEED} replace />} />
          <Route path={ROUTES.FEED} element={<FeedPage />} />
          <Route path={`${ROUTES.FEED}/:id`} element={<FeedPage />} />
          <Route path={ROUTES.ADD} element={<AddPage />} />
          <Route path={ROUTES.GRID} element={<GridPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
