import { Button } from '@vegaprotocol/ui-toolkit'
import { useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../../route-names'
import { Frame } from '../../../components/frame'
import { Tick } from '../../../components/icons/tick'
import { StarsWrapper } from '../../../components/stars-wrapper'
import { VegaHeader } from '../../../components/vega-header'
import { Disclaimer } from './disclaimer'
import config from '!/config'
import { Incentives } from './incentives'
import { ExternalLink } from '../../../components/external-link'

export const locators = {
  getStartedButton: 'get-started-button'
}

const ITEMS = ['Securely connect to Vega dapps', 'Instantly approve and reject transactions']

export const GetStarted = () => {
  const navigate = useNavigate()
  return (
    <StarsWrapper>
      <VegaHeader />
      <Frame>
        <ul className="list-none text-left">
          {ITEMS.map((i) => (
            <li key={i} className="flex">
              <div>
                <Tick size={12} className="mr-2 text-vega-green-550" />
              </div>
              <p className="text-white">{i}</p>
            </li>
          ))}
        </ul>
      </Frame>
      {config.showDisclaimer ? <Disclaimer /> : <Incentives />}
      <Button
        className="mt-4"
        autoFocus
        onClick={() => {
          navigate(FULL_ROUTES.createPassword)
        }}
        type="submit"
        data-testid={locators.getStartedButton}
        variant="primary"
        fill={true}
      >
        {config.showDisclaimer ? 'I understand' : 'Get Started'}
      </Button>
      <ExternalLink className="text-xs text-white mt-4" href={config.userDataPolicy}>
        User data policy
      </ExternalLink>
    </StarsWrapper>
  )
}
