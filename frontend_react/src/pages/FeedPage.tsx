import './FeedPage.css'
import { type FC, useEffect, useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { minioUrl } from '../modules/minio'
import { ROUTES } from '../Routes'
import { useAppDispatch } from '../store/hooks'
import { getFeedIds, getFeedItem, likeTitrationPair, useFeedIds, useFeedItem, useTitrationLoading } from '../store/titrationSlice'
import { useIsAuth } from '../store/userSlice'

const defaultVideo = '/DefaultVideo.mp4'

// Первое предложение описания показывается сразу, остальное — по кнопке «Ещё»
const splitDescription = (description: string) => {
  const end = description.search(/[.!?…](?:\s|$)/)
  if (end === -1 || end >= description.length - 1) return { short: description, extra: '' }
  return { short: description.slice(0, end + 1), extra: description.slice(end + 1).trim() }
}

const FeedPage: FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const item = useFeedItem()
  const feedIds = useFeedIds()
  const isAuth = useIsAuth()
  const loading = useTitrationLoading()
  const [loaded, setLoaded] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // Услуга загружается заново при смене id и при входе/выходе (признак is_liked)
  useEffect(() => {
    dispatch(getFeedItem({ id: id === undefined ? undefined : Number(id) })).then(() => {
      setExpanded(false)
      setLoaded(true)
    })
  }, [dispatch, id, isAuth])

  // Счётчик ленты «номер/всего» считается по списку id опубликованных услуг
  useEffect(() => {
    dispatch(getFeedIds())
  }, [dispatch, isAuth])

  const handleNext = async () => {
    if (!item) return
    const result = await dispatch(getFeedItem({ id: item.id, next: true }))
    if (getFeedItem.fulfilled.match(result) && result.payload) {
      navigate(`${ROUTES.FEED}/${result.payload.id}`)
    }
  }

  const handleLike = () => {
    if (!item) return
    dispatch(likeTitrationPair({ id: item.id, value: item.is_liked === 1 ? 0 : 1 }))
  }

  if (!item && (loading || !loaded)) {
    return (
      <div className="feedLoader">
        <Spinner animation="border" variant="light" />
      </div>
    )
  }

  if (!item) {
    return <div className="feedLoader">Услуга не найдена</div>
  }

  const { short, extra } = splitDescription(item.description ?? '')
  const position = feedIds.indexOf(item.id) + 1

  return (
    <div className="feedScreen">
      <header className="feedHeader">
        <h2>🧪 Labster Feed{position > 0 && ` (${position}/${feedIds.length})`}</h2>
      </header>

      <div className="feedMediaWrapper">
        <video
          key={item.id}
          className="feedMedia"
          src={item.video_url ? minioUrl(item.video_url) : defaultVideo}
          autoPlay
          loop
          muted
          playsInline
        />

        <div className="feedOverlay">
          <div className="feedActions">
            {isAuth ? (
              <Button
                variant="link"
                className="likeLarge likeButton"
                title={item.is_liked === 1 ? 'Убрать лайк' : 'Поставить лайк'}
                onClick={handleLike}
              >
                {item.is_liked === 1 ? '❤️' : '🤍'} {item.likes_count}
              </Button>
            ) : (
              <span className="likeLarge">❤️ {item.likes_count}</span>
            )}
            <Button className="btnNext" title="Следующий" aria-label="Следующий" onClick={handleNext}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Button>
          </div>

          <h3>{item.title}</h3>

          {short && <p className="descText">{short}</p>}
          {extra && expanded && <p className="descText">{extra}</p>}
          {extra && (
            <Button variant="link" className="btnMoreDesc" onClick={() => setExpanded((state) => !state)}>
              {expanded ? 'Скрыть' : 'Ещё'}
            </Button>
          )}

          <div className="statsRow">
            <span>🧪 pH: {item.ph}</span>
            <span>💧 {item.concentration} М</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedPage
