import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { useAppSelector } from './hooks'

// Пользователь из ответа POST /api/titration_pairs/users/login
export interface User {
  id: number
  username: string
  role: string
}

// Состояние интерфейса после авторизации: гость (isAuth = false) или пользователь
interface UserState {
  isAuth: boolean
  username: string
}

const initialState: UserState = {
  isAuth: false,
  username: '',
}

// Запросы входа и выхода выполняются через axios без thunk,
// результат передаётся в Redux вручную действиями setUser / resetUser
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<User>) {
      state.isAuth = true
      state.username = payload.username
    },
    resetUser() {
      return initialState
    },
  },
})

export const useIsAuth = () => useAppSelector((state) => state.user.isAuth)

export const { setUser: setUserAction, resetUser: resetUserAction } = userSlice.actions

export default userSlice.reducer
