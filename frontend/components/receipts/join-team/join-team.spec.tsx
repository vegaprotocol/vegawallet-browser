import { render, screen } from '@testing-library/react'

import { MockNetworkProvider } from '@/contexts/network/mock-network-provider'

import { testingNetwork } from '../../../../config/well-known-networks'
import { locators } from '../../vega-entities/team-link'
import { JoinTeam } from './join-team'

describe('JoinTeam', () => {
  it('returns a link to the team', () => {
    // 1141-JNTM-001 I can see the id of the team I want to join
    // 1141-JNTM-002 I can see a link to the team's page on console
    render(
      <MockNetworkProvider>
        <JoinTeam
          transaction={{
            joinTeam: {
              id: '0'.repeat(64)
            }
          }}
        />
      </MockNetworkProvider>
    )
    expect(screen.getByTestId(locators.teamLink)).toHaveTextContent('000000…0000')
    expect(screen.getByTestId(locators.teamLink)).toHaveAttribute(
      'href',
      `${testingNetwork.console}/#/competitions/teams/${'0'.repeat(64)}`
    )
  })
})
