import './LoadingOverlay.css'
import type { FC } from 'react'
import { Spinner } from 'react-bootstrap'

// Анимация загрузки поверх экрана: блокирует кнопки пользователя на время запроса
export const LoadingOverlay: FC<{ show: boolean }> = ({ show }) =>
  show ? (
    <div className="loadingOverlay">
      <Spinner animation="border" variant="light" />
    </div>
  ) : null
