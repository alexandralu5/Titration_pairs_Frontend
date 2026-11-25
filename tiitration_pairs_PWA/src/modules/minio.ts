const MINIO_ORIGIN = 'http://localhost:9000'

// Адрес файла из MinIO -> адрес через прокси Vite (второй маршрут /minio в vite.config.ts):
// http://localhost:9000/titration/img.jpg -> /minio/titration/img.jpg
export const minioUrl = (url: string) =>
  url.startsWith(MINIO_ORIGIN) ? `/minio${url.slice(MINIO_ORIGIN.length)}` : url
