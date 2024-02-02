import { render, screen } from '@testing-library/react'

import { MockNetworkProvider } from '@/contexts/network/mock-network-provider'

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
      `https://console.vega.xyz/#/competitions/teams/${'0'.repeat(64)}`
    )
  })
})
