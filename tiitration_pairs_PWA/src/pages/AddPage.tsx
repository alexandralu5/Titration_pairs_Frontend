import './AddPage.css'
import { type ChangeEvent, type FC, type FormEvent, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ROUTES } from '../Routes'
import { useAppDispatch } from '../store/hooks'
import { addTitrationPair } from '../store/titrationSlice'
import { useIsAuth } from '../store/userSlice'

const defaultImage = `${import.meta.env.BASE_URL}DefaultImage.jpg`
const defaultVideo = `${import.meta.env.BASE_URL}DefaultVideo.mp4`

const useSelectedMedia = () => {
  const [media, setMedia] = useState<{ file: File; url: string } | null>(null)

  useEffect(() => {
    if (media) return () => URL.revokeObjectURL(media.url)
  }, [media])

  const select = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) setMedia({ file, url: URL.createObjectURL(file) })
  }

  return [media, select] as const
}

const AddPage: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuth = useIsAuth()
  const [step, setStep] = useState<1 | 2>(1)
  const [title, setTitle] = useState('')
  const [ph, setPh] = useState('7.0')
  const [concentration, setConcentration] = useState('0.10')
  const [image, handleImage] = useSelectedMedia()
  const [video, handleVideo] = useSelectedMedia()
  const [error, setError] = useState('')

  const demo = import.meta.env.MODE === 'pages'
  if (!isAuth) return <Navigate to={ROUTES.LOGIN} replace />

  const handleNext = (event: FormEvent) => {
    event.preventDefault()
    setStep(2)
  }

  const handlePublish = async (event: FormEvent) => {
    event.preventDefault()
    if (demo) return
    setError('')
    const result = await dispatch(addTitrationPair({
      title,
      ph,
      concentration,
      image: image?.file ?? null,
      video: video?.file ?? null,
    }))
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

      <form className="addCard" onSubmit={step === 1 ? handleNext : handlePublish}>
        {step === 2 && <h3 className="addDraftTitle">{title}</h3>}

        <div className="addFormGroup">
          <span className="addFieldLabel">Фото</span>
          {step === 1 ? (
            <label className="mediaPicker">
              <input className="visually-hidden" aria-label="Выбрать фото" id="imageInput" type="file" accept=".jpg,.jpeg,.png,.gif,.webp" onChange={handleImage} />
              <img className="mediaPreviewImg" src={image?.url ?? defaultImage} alt="Фото опыта" />
            </label>
          ) : (
            <img className="mediaPreviewImg" src={image?.url ?? defaultImage} alt="Фото опыта" />
          )}
        </div>

        <div className="addFormGroup">
          <span className="addFieldLabel">Видео</span>
          {step === 1 ? (
            <label className="mediaPicker">
              <input className="visually-hidden" aria-label="Выбрать видео" id="videoInput" type="file" accept=".mp4,.webm,.mov" onChange={handleVideo} />
              <video className="mediaPreviewVideo" src={video?.url ?? defaultVideo} autoPlay loop muted playsInline />
            </label>
          ) : (
            <video className="mediaPreviewVideo" src={video?.url ?? defaultVideo} autoPlay loop muted playsInline />
          )}
        </div>

        {step === 1 ? (
          <>
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
          </>
        ) : (
          <>
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

            {demo && <p>Для публикации войдите в Labster по локальному HTTPS-адресу ноутбука.</p>}
            {error && <p className="addError">{error}</p>}
            <button type="submit" className="buttonPrimary" disabled={demo}>
              Опубликовать
            </button>
          </>
        )}
      </form>
    </div>
  )
}

export default AddPage
