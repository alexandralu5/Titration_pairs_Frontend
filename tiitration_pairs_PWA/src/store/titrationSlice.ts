import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit'
import { isAxiosError } from 'axios'
import { api } from '../api'
import { TITRATION_PAIRS_MOCK } from '../modules/mock'
import type { RootState } from '.'
import { useAppSelector } from './hooks'

// Услуга — пара кислоты и щёлочи для титрования (поля как в ответе веб-сервиса).
// is_mine приходит в списке, is_liked — в ленте; для гостя оба равны 0.
export interface TitrationPair {
  id: number
  title: string
  description: string | null
  ph: number | null
  concentration: number | null
  image_url: string
  video_url: string
  likes_count: number
  is_mine?: 0 | 1
  is_liked?: 0 | 1
}

// Данные формы страницы «Добавление»
export interface NewTitrationPair {
  title: string
  ph: string
  concentration: string
  image: File | null
  video: File | null
}

interface TitrationState {
  list: TitrationPair[] // услуги на плитке
  feedItem: TitrationPair | null // текущая услуга в ленте
  feedIds: number[] // id всех опубликованных услуг — для счётчика ленты «1/6»
  pendingRequests: number // число выполняемых запросов: > 0 — показывается анимация загрузки
}

const initialState: TitrationState = {
  list: [],
  feedItem: null,
  feedIds: [],
  pendingRequests: 0,
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{ state: RootState; rejectValue: string }>()
const mockOnly = import.meta.env.MODE === 'pages'

const mockList = (minConcentration: number) =>
  TITRATION_PAIRS_MOCK.filter((item) => minConcentration <= 0 || (item.concentration ?? 0) >= minConcentration)

const mockFeedItem = (id: number | undefined, next: boolean) => {
  if (id === undefined) return TITRATION_PAIRS_MOCK[0] ?? null
  const index = TITRATION_PAIRS_MOCK.findIndex((item) => item.id === id)
  if (index === -1) return null
  return TITRATION_PAIRS_MOCK[next ? (index + 1) % TITRATION_PAIRS_MOCK.length : index] ?? null
}

// Список опубликованных услуг с фильтром из Redux: GET /api/titration_pairs?minConcentration=
// Если веб-сервис недоступен — mock-коллекция (только для гостя)
export const getTitrationPairsList = createAppAsyncThunk(
  'titration/getTitrationPairsList',
  async (_: void, { getState, rejectWithValue }) => {
    const { filter, user } = getState()
    const minConcentration = Number(filter.minConcentration)
    if (mockOnly) return mockList(minConcentration)
    try {
      const { data } = await api.api.servicesControllerList(minConcentration > 0 ? { minConcentration } : {})
      return data as TitrationPair[]
    } catch {
      if (user.isAuth) return rejectWithValue('Не удалось загрузить услуги')
      return mockList(minConcentration)
    }
  },
)

// Запись ленты: без id — первая услуга (GET /api/titration_pairs/feed),
// с id — услуга по id, с next = true — следующая за ней (GET /api/titration_pairs/feed/:id?next=true);
// после последней услуги следующей считается первая.
// null — услуги нет. Если веб-сервис недоступен — mock-коллекция (только для гостя)
export const getFeedItem = createAppAsyncThunk(
  'titration/getFeedItem',
  async ({ id, next = false }: { id?: number; next?: boolean }, { getState, rejectWithValue }) => {
    if (mockOnly) return mockFeedItem(id, next)
    try {
      if (id === undefined) {
        const { data } = await api.api.servicesControllerFeed()
        return data as TitrationPair
      }
      try {
        const { data } = await api.api.servicesControllerFeedItem(id, next ? { next: 'true' } : {})
        return data as TitrationPair
      } catch (error) {
        // Следующей услуги нет (это последняя) — переход к первой услуге ленты
        if (!next || !isAxiosError(error) || error.response?.status !== 404) throw error
        const { data } = await api.api.servicesControllerFeed()
        return data as TitrationPair
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null
      if (getState().user.isAuth) return rejectWithValue('Не удалось загрузить услугу')
      return mockFeedItem(id, next)
    }
  },
)

// id всех опубликованных услуг (без фильтра) для счётчика ленты: GET /api/titration_pairs
// Если веб-сервис недоступен — mock-коллекция (только для гостя)
export const getFeedIds = createAppAsyncThunk(
  'titration/getFeedIds',
  async (_: void, { getState, rejectWithValue }) => {
    if (mockOnly) return TITRATION_PAIRS_MOCK.map((item) => item.id)
    try {
      const { data } = await api.api.servicesControllerList()
      return data.map((item) => item.id)
    } catch {
      if (getState().user.isAuth) return rejectWithValue('Не удалось загрузить услуги')
      return TITRATION_PAIRS_MOCK.map((item) => item.id)
    }
  },
)

// Создание услуги: POST /api/titration_pairs (черновик: название, изображение, видео),
// затем PUT /api/titration_pairs/:id (pH, концентрация — публикация черновика)
export const addTitrationPair = createAppAsyncThunk(
  'titration/addTitrationPair',
  async (form: NewTitrationPair, { rejectWithValue }) => {
    try {
      const { data: draft } = await api.api.servicesControllerCreate({
        title: form.title,
        ...(form.image ? { image: form.image } : {}),
        ...(form.video ? { video: form.video } : {}),
      })
      const { data } = await api.api.servicesControllerUpdate(draft.id, {
        ...(form.ph !== '' ? { ph: Number(form.ph) } : {}),
        ...(form.concentration !== '' ? { concentration: Number(form.concentration) } : {}),
      })
      return data as TitrationPair
    } catch {
      return rejectWithValue('Не удалось добавить услугу')
    }
  },
)

// Удаление услуги: DELETE /api/titration_pairs/:id
export const deleteTitrationPair = createAppAsyncThunk(
  'titration/deleteTitrationPair',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.api.servicesControllerRemove(id)
      return id
    } catch {
      return rejectWithValue('Не удалось удалить услугу')
    }
  },
)

// Лайк: POST /api/titration_pairs/:id/like { value: 1 — поставить, 0 — снять }
export const likeTitrationPair = createAppAsyncThunk(
  'titration/likeTitrationPair',
  async ({ id, value }: { id: number; value: 0 | 1 }, { rejectWithValue }) => {
    try {
      const { data } = await api.api.servicesControllerLike(id, { value })
      return { id, ...data }
    } catch {
      return rejectWithValue('Не удалось изменить лайк')
    }
  },
)

const titrationThunks = [
  getTitrationPairsList,
  getFeedItem,
  getFeedIds,
  addTitrationPair,
  deleteTitrationPair,
  likeTitrationPair,
] as const

const titrationSlice = createSlice({
  name: 'titration',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTitrationPairsList.fulfilled, (state, { payload }) => {
        state.list = payload
      })
      .addCase(getTitrationPairsList.rejected, (state) => {
        state.list = []
      })
      .addCase(getFeedItem.fulfilled, (state, { payload, meta }) => {
        // Следующей услуги нет — остаёмся на текущей
        if (meta.arg.next && !payload) return
        state.feedItem = payload
      })
      .addCase(getFeedItem.rejected, (state, { meta }) => {
        if (!meta.arg.next) state.feedItem = null
      })
      .addCase(getFeedIds.fulfilled, (state, { payload }) => {
        state.feedIds = payload
      })
      .addCase(getFeedIds.rejected, (state) => {
        state.feedIds = []
      })
      .addCase(deleteTitrationPair.fulfilled, (state, { payload }) => {
        state.list = state.list.filter((item) => item.id !== payload)
      })
      .addCase(likeTitrationPair.fulfilled, (state, { payload }) => {
        if (state.feedItem?.id === payload.id) {
          state.feedItem.is_liked = payload.liked ? 1 : 0
          state.feedItem.likes_count = payload.likes_count
        }
        const item = state.list.find((pair) => pair.id === payload.id)
        if (item) item.likes_count = payload.likes_count
      })
      // Анимация загрузки на время любого запроса к веб-сервису
      .addMatcher(isPending(...titrationThunks), (state) => {
        state.pendingRequests += 1
      })
      .addMatcher(isFulfilled(...titrationThunks), (state) => {
        state.pendingRequests -= 1
      })
      .addMatcher(isRejected(...titrationThunks), (state) => {
        state.pendingRequests -= 1
      })
  },
})

export const useTitrationList = () => useAppSelector((state) => state.titration.list)

export const useFeedItem = () => useAppSelector((state) => state.titration.feedItem)

export const useFeedIds = () => useAppSelector((state) => state.titration.feedIds)

export const useTitrationLoading = () => useAppSelector((state) => state.titration.pendingRequests > 0)

export default titrationSlice.reducer
