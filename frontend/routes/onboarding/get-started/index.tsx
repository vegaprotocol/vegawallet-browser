import { Button } from '@vegaprotocol/ui-toolkit'
import { useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../../route-names'
import { Frame } from '../../../components/frame'
import { Tick } from '../../../components/icons/tick'
import { useMemo } from 'react'
import { StarsWrapper } from '../../../components/stars-wrapper'
import { getStartedButton } from '../../../locator-ids'
import { VegaHeader } from '../../../components/vega-header'

export const GetStarted = () => {
  const items = useMemo(() => ['Securely connect to Vega dapps', 'Instantly approve and reject transactions'], [])
  const navigate = useNavigate()
  return (
    <StarsWrapper>
      <VegaHeader />
      <Frame>
        <ul className="list-none text-left">
          {items.map((i) => (
            <li key={i} className="flex">
              <div>
                <Tick className="w-3 mr-2 text-vega-green-550" />
              </div>
              <p className="text-light-200">{i}</p>
            </li>
          ))}
        </ul>
      </Frame>
      <Button
        data-testid={getStartedButton}
        variant="primary"
        onClick={() => {
          navigate(FULL_ROUTES.createPassword)
        }}
        fill={true}
      >
        Get Started
      </Button>
    </StarsWrapper>
  )
}
