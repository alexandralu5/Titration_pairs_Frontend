import { combineReducers, configureStore } from '@reduxjs/toolkit'
import filterReducer from './filterSlice'
import titrationReducer from './titrationSlice'
import userReducer from './userSlice'

// Глобальное хранилище. configureStore подключает redux-thunk middleware по умолчанию.
export const store = configureStore({
  reducer: combineReducers({
    user: userReducer,
    filter: filterReducer,
    titration: titrationReducer,
  }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
