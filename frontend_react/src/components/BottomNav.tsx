import './BottomNav.css'
import axios from 'axios'
import { type FC, useState } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { LOGOUT_LABEL, ROUTES, ROUTE_LABELS } from '../Routes'
import { resetFilterAction } from '../store/filterSlice'
import { useAppDispatch } from '../store/hooks'
import { resetUserAction, useIsAuth } from '../store/userSlice'
import { LoadingOverlay } from './LoadingOverlay'

// Нижняя навигационная панель. Гостю «Добавление» недоступно, последний пункт — «Вход»;
// после авторизации доступно «Добавление», последний пункт — «Выход»
export const BottomNav: FC = () => {
  const dispatch = useAppDispatch()
  const isAuth = useIsAuth()
  const [loading, setLoading] = useState(false)

  // Деавторизация: только axios, состояние в Redux передаётся вручную
  const handleLogout = async () => {
    setLoading(true)
    try {
      await axios.post('/api/titration_pairs/users/logout')
    } catch {
      // Сессии на сервере уже нет — интерфейс всё равно переключается на гостя
    }
    dispatch(resetUserAction())
    dispatch(resetFilterAction())
    setLoading(false)
  }

  return (
    <>
      <Navbar className="bottomNav">
        <Nav className="bottomNavItems">
          <Nav.Link as={NavLink} to={ROUTES.FEED}>
            {ROUTE_LABELS.FEED}
          </Nav.Link>
          {isAuth ? (
            <Nav.Link as={NavLink} to={ROUTES.ADD}>
              {ROUTE_LABELS.ADD}
            </Nav.Link>
          ) : (
            <Nav.Link disabled>{ROUTE_LABELS.ADD}</Nav.Link>
          )}
          <Nav.Link as={NavLink} to={ROUTES.GRID}>
            {ROUTE_LABELS.GRID}
          </Nav.Link>
          {isAuth ? (
            <Nav.Link onClick={handleLogout}>{LOGOUT_LABEL}</Nav.Link>
          ) : (
            <Nav.Link as={NavLink} to={ROUTES.LOGIN}>
              {ROUTE_LABELS.LOGIN}
            </Nav.Link>
          )}
        </Nav>
      </Navbar>
      <LoadingOverlay show={loading} />
    </>
  )
}
