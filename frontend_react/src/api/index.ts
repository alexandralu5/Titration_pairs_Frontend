import { Api } from './Api'

// Клиент веб-сервиса из кодогенерации (swagger-typescript-api, http-клиент axios).
// baseURL пустой: запросы идут на /api/... и проксируются Vite на веб-сервис.
export const api = new Api({ baseURL: '' })
