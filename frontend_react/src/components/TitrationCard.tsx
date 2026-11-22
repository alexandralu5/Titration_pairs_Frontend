import './TitrationCard.css'
import type { FC } from 'react'
import { Badge, Card } from 'react-bootstrap'
import { minioUrl } from '../modules/minio'

const defaultImage = '/DefaultImage.jpg'

interface Props {
  title: string
  image_url: string
  ph: number | null
  concentration: number | null
  likes_count: number
  onClick: () => void
  onDelete?: () => void
}

// Карточка услуги на плитке. Кнопка удаления — только у услуг текущего пользователя
export const TitrationCard: FC<Props> = ({ title, image_url, ph, concentration, likes_count, onClick, onDelete }) => (
  <Card className="gridCard" onClick={onClick}>
    <div className="cardMedia">
      <Card.Img variant="top" src={image_url ? minioUrl(image_url) : defaultImage} alt={title} />
      <Badge bg="dark" className="phTag">
        pH {ph}
      </Badge>
    </div>
    <Card.Body className="gridCardBody">
      <Card.Title className="gridCardTitle">{title}</Card.Title>
      <Card.Text className="concText">{concentration} </Card.Text>
      {onDelete && (
        // Кнопка удаления — нижний левый угол, в одном стиле с лайками (как в лабораторной работе №4)
        <button
          type="button"
          className="cardActionBtn deleteCard"
          title="Удалить"
          aria-label="Удалить"
          onClick={(event) => {
            event.stopPropagation()
            onDelete()
          }}
        >
          🗑️
        </button>
      )}
      <span className="cardActionBtn likesCount">❤️ {likes_count}</span>
    </Card.Body>
  </Card>
)
