import './TitrationCard.css'
import type { FC } from 'react'
import { Badge, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { minioUrl } from '../modules/minio'

const defaultImage = `${import.meta.env.BASE_URL}DefaultImage.jpg`

interface Props {
  title: string
  image_url: string
  ph: number | null
  concentration: number | null
  likes_count: number
  detailsUrl: string
  onDelete?: () => void
}

// Карточка услуги на плитке. Кнопка удаления — только у услуг текущего пользователя
export const TitrationCard: FC<Props> = ({ title, image_url, ph, concentration, likes_count, detailsUrl, onDelete }) => (
  <Card className="gridCard">
    <div className="cardMedia">
      <Card.Img variant="top" src={image_url ? minioUrl(image_url) : defaultImage} alt={title} />
      <Badge bg="dark" className="phTag">
        pH {ph}
      </Badge>
    </div>
    <Card.Body className="gridCardBody">
      <Card.Title className="gridCardTitle">
        <Link to={detailsUrl} state={{ fromGrid: true }} className="stretched-link">{title}</Link>
      </Card.Title>
      <Card.Text className="concText">{concentration} </Card.Text>
      <div className="cardActions">
        {onDelete && (
          <button type="button" className="cardActionBtn deleteCard" aria-label="Удалить" onClick={onDelete}>
            🗑️
          </button>
        )}
        <span className="cardActionBtn">❤️ {likes_count}</span>
      </div>
    </Card.Body>
  </Card>
)
