import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { useAppSelector } from './hooks'

// Фильтр услуг: минимальная концентрация (М). '0' — фильтр не задан, показываются все услуги
interface FilterState {
  minConcentration: string
}

const initialState: FilterState = {
  minConcentration: '0',
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setMinConcentration(state, { payload }: PayloadAction<string>) {
      state.minConcentration = payload
    },
    // Сброс фильтра при выходе пользователя
    resetFilter() {
      return initialState
    },
  },
})

export const useMinConcentration = () => useAppSelector((state) => state.filter.minConcentration)

export const {
  setMinConcentration: setMinConcentrationAction,
  resetFilter: resetFilterAction,
} = filterSlice.actions

export default filterSlice.reducer
