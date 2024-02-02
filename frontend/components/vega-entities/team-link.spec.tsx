import { render, screen } from '@testing-library/react'

import { MockNetworkProvider } from '@/contexts/network/mock-network-provider'

import { testingNetwork } from '../../../config/well-known-networks'
import { locators, TeamLink } from './team-link'

describe('TeamLink', () => {
  it('returns a link to the team', () => {
    render(
      <MockNetworkProvider>
        <TeamLink id={'0'.repeat(64)} />
      </MockNetworkProvider>
    )
    expect(screen.getByTestId(locators.teamLink)).toHaveAttribute(
      'href',
      `${testingNetwork.console}/#/competitions/teams/${'0'.repeat(64)}`
    )
  })
})
