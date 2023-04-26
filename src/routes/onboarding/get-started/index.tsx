import { Button } from '@vegaprotocol/ui-toolkit'
import { useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../../routes'
import { Frame } from '../../../components/frame'
import { Tick } from '../../../components/icons/tick'
import { useMemo } from 'react'
import { StarsWrapper } from '../../../components/stars-wrapper'
import { getStartedButton } from '../../../locator-ids'

export const GetStarted = () => {
  const items = useMemo(
    () => [
      'Securely connect to Vega dapps',
      'Easily deposit and withdraw assets',
      'Instantly approve and reject transactions'
    ],
    []
  )
  const navigate = useNavigate()
  return (
    <StarsWrapper>
      <Frame>
        <ul className="list-none text-left">
          {items.map((i) => (
            <li key={i} className="flex">
              <Tick className="w-3 mr-2 text-vega-green-550" />
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
