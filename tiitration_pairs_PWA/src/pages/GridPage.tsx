import './GridPage.css'
import { type FC, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { ConcentrationFilter } from '../components/ConcentrationFilter'
import { TitrationCard } from '../components/TitrationCard'
import { ROUTES } from '../Routes'
import { setMinConcentrationAction, useMinConcentration } from '../store/filterSlice'
import { useAppDispatch } from '../store/hooks'
import {
  deleteTitrationPair,
  getTitrationPairsList,
  useTitrationList,
  useTitrationLoading,
} from '../store/titrationSlice'
import { useIsAuth } from '../store/userSlice'

const GridPage: FC = () => {
  const dispatch = useAppDispatch()
  const minConcentration = useMinConcentration()
  const titrationPairs = useTitrationList()
  const loading = useTitrationLoading()
  const isAuth = useIsAuth()

  // Список загружается с фильтром из Redux; при входе/выходе — заново (признак is_mine)
  useEffect(() => {
    dispatch(getTitrationPairsList())
  }, [dispatch, isAuth])

  return (
    <div className="gridScreen">
      <header className="gridHeader">
        <h2>🧪 Labster Grid</h2>
      </header>

      <ConcentrationFilter
        value={minConcentration}
        setValue={(value) => dispatch(setMinConcentrationAction(value))}
        onSubmit={() => dispatch(getTitrationPairsList())}
        loading={loading}
      />

      <div className="gridScrollArea">
        <Row xs={1} sm={2} md={3} xl={4} className="g-3">
          {titrationPairs.map((item) => (
            <Col key={item.id}>
              <TitrationCard
                {...item}
                detailsUrl={`${ROUTES.FEED}/${item.id}`}
                onDelete={isAuth && item.is_mine === 1 ? () => dispatch(deleteTitrationPair(item.id)) : undefined}
              />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default GridPage
