import './AddPage.css'
import { type ChangeEvent, type FC, type FormEvent, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ROUTES } from '../Routes'
import { useAppDispatch } from '../store/hooks'
import { addTitrationPair } from '../store/titrationSlice'
import { useIsAuth } from '../store/userSlice'

const defaultImage = '/DefaultImage.jpg'
const defaultVideo = '/DefaultVideo.mp4'

// Страница «Добавление» (доступна после авторизации), как в лабораторной работе №4:
// шаг 1 — название опыта, шаг 2 — фото, видео, pH, концентрация и публикация
const AddPage: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuth = useIsAuth()
  const [step, setStep] = useState<1 | 2>(1)
  const [title, setTitle] = useState('')
  const [ph, setPh] = useState('7.0')
  const [concentration, setConcentration] = useState('0.10')
  const [image, setImage] = useState<File | null>(null)
  const [video, setVideo] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(defaultImage)
  const [videoPreview, setVideoPreview] = useState(defaultVideo)
  const [error, setError] = useState('')

  if (!isAuth) return <Navigate to={ROUTES.LOGIN} replace />

  const handleNext = (event: FormEvent) => {
    event.preventDefault()
    setStep(2)
  }

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleVideo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setVideo(file)
    setVideoPreview(URL.createObjectURL(file))
  }

  const handlePublish = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    const result = await dispatch(addTitrationPair({ title, ph, concentration, image, video }))
    if (addTitrationPair.fulfilled.match(result)) {
      navigate(ROUTES.GRID)
    } else {
      setError(result.payload ?? 'Не удалось добавить услугу')
    }
  }

  return (
    <div className="addScreen">
      <header className="addHeader">
        <h2>🧪 Новый опыт</h2>
      </header>

      {step === 1 ? (
        // Шаг 1: фото и видео — только заглушки, под ними поле ввода названия
        <form className="addCard" onSubmit={handleNext}>
          <div className="addFormGroup">
            <label>Фото</label>
            <img className="mediaPreviewImg mediaPreviewStatic" src={defaultImage} alt="Фото опыта" />
          </div>

          <div className="addFormGroup">
            <label>Видео</label>
            <video
              className="mediaPreviewVideo mediaPreviewStatic"
              src={defaultVideo}
              autoPlay
              loop
              muted
              playsInline
            />
          </div>

          <div className="addFormGroup">
            <label htmlFor="title">Название опыта</label>
            <input
              id="title"
              type="text"
              maxLength={100}
              placeholder="Например: HCl + NaOH"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <button type="submit" className="buttonPrimary">
            Далее ➜
          </button>
        </form>
      ) : (
        // Шаг 2: фото и видео выбираются кликом по превью, pH и концентрация
        <form className="addCard" onSubmit={handlePublish}>
          <h3 className="addDraftTitle">{title}</h3>

          <input
            type="file"
            id="imageInput"
            accept=".jpg,.jpeg,.png,.gif,.webp"
            style={{ display: 'none' }}
            onChange={handleImage}
          />
          <div className="addFormGroup">
            <label>Фото</label>
            <img
              className="mediaPreviewImg"
              src={imagePreview}
              alt="Фото опыта"
              onClick={() => document.getElementById('imageInput')?.click()}
            />
          </div>

          <input
            type="file"
            id="videoInput"
            accept=".mp4,.webm,.mov"
            style={{ display: 'none' }}
            onChange={handleVideo}
          />
          <div className="addFormGroup">
            <label>Видео</label>
            <video
              className="mediaPreviewVideo"
              src={videoPreview}
              autoPlay
              loop
              muted
              playsInline
              onClick={() => document.getElementById('videoInput')?.click()}
            />
          </div>

          <div className="addFormGroup">
            <label htmlFor="ph">pH</label>
            <input
              id="ph"
              type="number"
              step="0.1"
              min={0}
              max={14}
              value={ph}
              onChange={(event) => setPh(event.target.value)}
              required
            />
          </div>

          <div className="addFormGroup">
            <label htmlFor="concentration">Концентрация (М)</label>
            <input
              id="concentration"
              type="number"
              step="0.01"
              min={0}
              value={concentration}
              onChange={(event) => setConcentration(event.target.value)}
              required
            />
          </div>

          {error && <p className="addError">{error}</p>}

          <button type="submit" className="buttonPrimary">
            Опубликовать
          </button>
        </form>
      )}
    </div>
  )
}

export default AddPage
