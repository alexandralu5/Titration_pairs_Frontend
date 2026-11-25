# Labster — фронтенд (лабораторная работа №7)

Одностраничное приложение на React + TypeScript + Vite + React-Bootstrap + Redux Toolkit:
просмотр, добавление, удаление и лайки услуг — пар кислоты и щёлочи для титрования.

## GitHub Pages и PWA

Сборка для GitHub Pages использует данные из `src/modules/mock.ts` и медиа из `public/mock/`. Установленная PWA запрашивает полноэкранный режим. Резервный режим — `standalone`. Service Worker кэширует интерфейс, данные из сборки, изображения и видео.

```sh
npm install
npm run deploy
```

Команда собирает проект с базовым путём `/Titration_pairs_Frontend/` и публикует `dist-pages/` в корень ветки `gh-pages`. [Открыть Labster на GitHub Pages](https://alexandralu5.github.io/Titration_pairs_Frontend/)

## Локальный запуск по HTTPS

Запустите Docker Desktop. Если существующие контейнеры остановлены, выполните `docker start postgres redis minio_storage`. Если NestJS ещё не запущен, откройте отдельный терминал WSL и запустите его на порту `3000`.

```sh
cd ~/Titration_pairs/titration_pairs_authorization
npm run start:dev
```

В терминале фронтенда выполните сборку и запуск. Если HTTPS-сервер уже работает на порту `3001`, используйте его или остановите его перед новым запуском.

```sh
npm install
npm run build
npm run preview:https
```

Для существующих файлов `.certs/cert.crt` и `.certs/cert.key` выпускать сертификат повторно не нужно. Если файлов нет, создайте их перед запуском. Команды используют Wi-Fi IP ноутбука `192.168.1.60`. При смене адреса выпустите новый серверный сертификат с тем же CA и обновите адрес в команде Docker ниже.

```sh
umask 077
mkdir -p .certs
# Только если файлов CA ещё нет
npx mkcert create-ca --organization "Labster Local" --cert .certs/ca.crt --key .certs/ca.key
npx mkcert create-cert --ca-cert .certs/ca.crt --ca-key .certs/ca.key \
  --cert .certs/cert.crt --key .certs/cert.key --domains localhost 127.0.0.1 192.168.1.60
```

В WSL 2 с NAT порт `3001` перенаправляется с Windows на WSL через Docker Desktop. Если контейнер `labster-lan` уже работает, повторно запускать его не нужно.

```sh
WSL_IP=$(hostname -I | awk '{print $1}')
docker run --rm --name labster-lan -p 192.168.1.60:3001:3001 \
  -e LABSTER_WSL_IP="$WSL_IP" node:24-slim node -e '
  const net = require("node:net");
  net.createServer(client => {
    const target = net.connect(3001, process.env.LABSTER_WSL_IP);
    client.pipe(target).pipe(client);
    client.on("error", () => target.destroy());
    target.on("error", () => client.destroy());
  }).listen(3001, "0.0.0.0");'
```

Подключите телефон к той же Wi-Fi сети и импортируйте на нём публичный сертификат `.certs/ca.crt` как доверенный CA. Локальное приложение открывается по адресу `https://192.168.1.60:3001/`. Приватные ключи хранятся в игнорируемой папке `.certs/`.

## Режим разработки

```shell
npm install
npm run dev       # http://localhost:3001
npm run dev:https # HTTPS на порту 3001
npm run codegen   # кодогенерация src/api/Api.ts из http://localhost:3000/api-json (веб-сервис должен быть запущен)
```

Vite использует одинаковые маршруты проксирования в режимах разработки и просмотра локальной сборки.

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

Количество столбцов зависит от ширины окна. Фильтр «Мин. концентрация» (значение хранится в Redux и передаётся в запрос
`GET /api/titration_pairs?minConcentration=...`). У услуг пользователя (`is_mine = 1`) — кнопка удаления 🗑.

### Добавление — `/add`

На первом шаге указывают название опыта, выбирают фото и видео и нажимают «Далее». На втором шаге
отображаются выбранные файлы или стандартные превью и вводятся pH (7.0 по умолчанию) и концентрация (0.10).
Кнопка «Опубликовать» создаёт черновик через `POST /api/titration_pairs` и публикует его через
`PUT /api/titration_pairs/:id`, затем открывается «Плитка».

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
deployment.drawio                диаграмма развёртывания
```

## Параметры адаптивности

| Ширина окна | Колонки на «Плитке» | Высота изображения карточки |
|---|---:|---:|
| До 576 px | 1 | 140 px |
| От 576 до 767 px | 2 | 140 px |
| От 768 до 1199 px | 3 | 180 px |
| От 1200 px | 4 | 180 px |

В каждой карточке ширина равна ширине колонки, высота заполняет строку. В mock шесть карточек до фильтрации. С 768 px «Лента» делится на видео и описание в пропорции 3:2, а «Добавление» размещает превью в двух равных колонках с общей шириной формы до 960 px. Высота превью задана как `clamp(160px, 35dvh, 280px)`. В окне уже 576 px ссылки навигации сворачиваются в меню.
