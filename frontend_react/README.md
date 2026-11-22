# Labster — фронтенд (лабораторная работа №6)

Одностраничное приложение на React + TypeScript + Vite + React-Bootstrap + Redux Toolkit:
просмотр, добавление, удаление и лайки услуг — пар кислоты и щёлочи для титрования.

## Запуск

```shell
npm install
npm run dev       # http://localhost:3001
npm run build     # сборка в dist/
npm run codegen   # кодогенерация src/api/Api.ts из http://localhost:3000/api-json (веб-сервис должен быть запущен)
```

Проксирование dev-сервера Vite (`server.proxy` в `vite.config.ts`), обход CORS:

| Маршрут | Куда |
|---|---|
| `/api/...` | веб-сервис NestJS `http://localhost:3000/api/...` |
| `/minio/...` | S3 (MinIO) `http://localhost:9000/...` |

Если веб-сервис недоступен, гость получает данные из mock-коллекции `src/modules/mock.ts`.

## Redux Toolkit

| Слайс | Состояние | Как меняется |
|---|---|---|
| `user` | `isAuth`, `username` | вход/выход — только axios, действия `setUser` / `resetUser` вручную |
| `filter` | `minConcentration` | ползунок на «Плитке»; сбрасывается при выходе |
| `titration` | `list`, `feedItem`, `feedIds`, `pendingRequests` | thunk'и на сгенерированном клиенте `src/api/Api.ts` |

Thunk'и `titrationSlice.ts`: `getTitrationPairsList`, `getFeedItem`, `getFeedIds`, `addTitrationPair`,
`deleteTitrationPair`, `likeTitrationPair`. Пока выполняется запрос, поверх экрана показывается
анимация загрузки, блокирующая кнопки.

## Страницы приложения

### Нижняя навигационная панель

| Пункт | Гость | Пользователь |
|---|---|---|
| Лента | `/feed` | `/feed` |
| Добавление | недоступен | `/add` |
| Плитка | `/grid` | `/grid` |
| Вход / Выход | «Вход» → `/login` | «Выход» — деавторизация, сброс фильтра |

### Лента — `/feed`, `/feed/:id`

Одна услуга на весь экран, в заголовке счётчик «номер/всего» (например, `1/6`): видео, название, описание с кнопкой «Ещё» / «Скрыть», pH, концентрация,
лайки, кнопка «Следующий» (после последней услуги — снова первая). Пользователю доступна кнопка лайка (🤍 — поставить, ❤️ — снять).

### Плитка — `/grid`

Услуги в 2 столбца, фильтр «Мин. концентрация» (значение хранится в Redux и передаётся в запрос
`GET /api/titration_pairs?minConcentration=...`). У услуг пользователя (`is_mine = 1`) — кнопка удаления 🗑.

### Добавление — `/add`

Как в лабораторной работе №4, два шага. Шаг 1: заглушки фото и видео, поле «Название опыта», кнопка
«Далее ➜». Шаг 2: название, фото и видео (выбираются кликом по превью), pH (по умолчанию 7.0),
концентрация (0.10), кнопка «Опубликовать» — создание черновика `POST /api/titration_pairs`
(название, фото, видео) и его публикация `PUT /api/titration_pairs/:id` (pH, концентрация),
затем переход на «Плитку».

### Вход — `/login`

Логин и пароль, `POST /api/titration_pairs/users/login`. Веб-сервис ставит HttpOnly-куку `sessionId`.
После обновления страницы (F5) Redux возвращается в состояние гостя, кука остаётся.

## Структура

```
src/
  main.tsx                       точка входа, Provider хранилища
  App.tsx                        роутинг
  Routes.ts                      адреса страниц и подписи пунктов меню
  AppLayout.tsx                  оболочка: страница + нижняя навигация + анимация загрузки
  api/Api.ts                     сгенерированный клиент веб-сервиса (axios)
  api/index.ts                   экземпляр клиента
  store/index.ts                 хранилище
  store/hooks.ts                 типизированные useAppDispatch / useAppSelector
  store/userSlice.ts             состояние авторизации
  store/filterSlice.ts           фильтр услуг
  store/titrationSlice.ts        услуги и thunk'и
  pages/FeedPage.tsx             «Лента»
  pages/GridPage.tsx             «Плитка»
  pages/AddPage.tsx              «Добавление»
  pages/LoginPage.tsx            «Вход»
  components/BottomNav.tsx       нижняя навигационная панель, выход
  components/ConcentrationFilter.tsx  фильтр по концентрации
  components/TitrationCard.tsx   карточка услуги
  components/LoadingOverlay.tsx  анимация загрузки
  modules/mock.ts                mock-коллекция услуг
  modules/minio.ts               адрес файла MinIO через прокси
use-case.drawio                  диаграмма прецедентов интерфейса
```
