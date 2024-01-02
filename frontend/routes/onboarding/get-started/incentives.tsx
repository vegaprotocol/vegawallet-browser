import { ExternalLink } from '@/components/external-link'
import { useNetwork } from '@/contexts/network/network-context'

export const locators = {
  paragraph: 'incentives-paragraph',
  link: 'incentives-link'
}

export const Incentives = () => {
  const { network } = useNetwork()
  return (
    <p className="text-xs mb-2" data-testid={locators.paragraph}>
      This is an experimental release for testing purposes only and supports trading in testnet assets with no financial
      risk. Download to get involved in testing on Vega and participate in Fairground{' '}
      <ExternalLink className="underline" data-testid={locators.link} href={network.console}>
        <>incentives</>
      </ExternalLink>{' '}
      to earn rewards!
    </p>
  )
}
