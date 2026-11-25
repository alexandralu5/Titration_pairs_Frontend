import './FormPage.css'
import axios, { isAxiosError } from 'axios'
import { type FC, type FormEvent, useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { ROUTES } from '../Routes'
import { useAppDispatch } from '../store/hooks'
import { type User, setUserAction } from '../store/userSlice'

const LoginPage: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Авторизация: только axios, состояние в Redux передаётся вручную.
  // Кука сессии sessionId ставится веб-сервисом (HttpOnly)
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await axios.post<User>('/api/titration_pairs/users/login', { username, password })
      dispatch(setUserAction(data))
      setLoading(false)
      navigate(ROUTES.FEED)
    } catch (err) {
      setError(
        isAxiosError(err) && err.response?.status === 429
          ? 'Слишком много попыток, вход временно заблокирован'
          : 'Неверный логин или пароль',
      )
      setLoading(false)
    }
  }

  return (
    <div className="formScreen">
      <header className="formHeader">
        <h2>🧪 Labster Вход</h2>
      </header>

      {import.meta.env.MODE === 'pages' ? (
        <p className="formBody">Для входа подключитесь к Wi-Fi ноутбука и откройте Labster по его локальному HTTPS-адресу. На GitHub Pages доступна демонстрационная версия.</p>
      ) : <Form className="formBody" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Логин</Form.Label>
          <Form.Control value={username} onChange={(event) => setUsername(event.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button type="submit" className="formButton" disabled={loading}>
          Войти
        </Button>
      </Form>}

      <LoadingOverlay show={loading} />
    </div>
  )
}

export default LoginPage
