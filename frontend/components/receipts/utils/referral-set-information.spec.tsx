import { render, screen, within } from '@testing-library/react'

import { MockNetworkProvider } from '@/contexts/network/mock-network-provider'

import { testingNetwork } from '../../../../config/well-known-networks'
import { locators as dataTableLocators } from '../../data-table/data-table'
import { locators as externalLinkLocators } from '../../external-link'
import locators from '../../locators'
import { ReferralSetInformation } from './referral-set-information'

const renderComponent = ({ referralSetData }: { referralSetData: any }) => {
  return render(
    <MockNetworkProvider>
      <ReferralSetInformation referralSetData={referralSetData} />
    </MockNetworkProvider>
  )
}

describe('ReferralSetInformation', () => {
  it('renders each row', () => {
    renderComponent({
      referralSetData: {
        id: '0'.repeat(64),
        isTeam: false,
        team: {
          name: 'foo',
          teamUrl: 'https://example.com',
          avatarUrl: 'https://example2.com',
          closed: false,
          allowList: ['0'.repeat(64), '1'.repeat(64)]
        }
      }
    })
    const [id, team, name, teamUrl, avatarUrl, closed] = screen.getAllByTestId(dataTableLocators.dataRow)
    expect(id).toHaveTextContent('Id')
    expect(id).toHaveTextContent('000000…0000')
    expect(within(id).getByTestId(externalLinkLocators.externalLink)).toHaveAttribute(
      'href',
      testingNetwork.console + '/#/competitions/teams/' + '0'.repeat(64)
    )
    expect(team).toHaveTextContent('Team')
    expect(team).toHaveTextContent('No')
    expect(name).toHaveTextContent('Name')
    expect(name).toHaveTextContent('foo')
    expect(teamUrl).toHaveTextContent('Team URL')
    expect(teamUrl).toHaveTextContent('https://example.com')
    expect(within(teamUrl).getByTestId(externalLinkLocators.externalLink)).toHaveAttribute(
      'href',
      'https://example.com'
    )
    expect(avatarUrl).toHaveTextContent('Avatar URL')
    expect(avatarUrl).toHaveTextContent('https://example2.com')
    expect(within(avatarUrl).getByTestId(externalLinkLocators.externalLink)).toHaveAttribute(
      'href',
      'https://example2.com'
    )
    expect(closed).toHaveTextContent('Closed')
    expect(closed).toHaveTextContent('No')
    expect(screen.getByTestId(locators.collapsiblePanel)).toBeInTheDocument()
    const content = screen.getByTestId(locators.collapsiblePanelContent)
    expect(content).toHaveTextContent('000000…0000')
    expect(content).toHaveTextContent('111111…1111')
  })
  it('renders Yes when isTeam is true and when closed is true', () => {
    renderComponent({
      referralSetData: {
        id: '0'.repeat(64),
        isTeam: true,
        team: {
          name: 'foo',
          teamUrl: 'https://example.com',
          avatarUrl: 'https://example2.com',
          closed: true,
          allowList: ['0'.repeat(64), '1'.repeat(64)]
        }
      }
    })

    const rows = screen.getAllByTestId(dataTableLocators.dataRow)
    const team = rows[1]
    const closed = rows[5]
    expect(team).toHaveTextContent('Team')
    expect(team).toHaveTextContent('Yes')
    expect(closed).toHaveTextContent('Closed')
    expect(closed).toHaveTextContent('Yes')
  })

  it('does not render avatarUrl or teamUrl when they are undefined', () => {
    renderComponent({
      referralSetData: {
        id: '0'.repeat(64),
        isTeam: false,
        team: {
          name: 'foo',
          closed: false,
          allowList: ['0'.repeat(64), '1'.repeat(64)]
        }
      }
    })
    expect(screen.queryByText('Team URL')).not.toBeInTheDocument()
    expect(screen.queryByText('Avatar URL')).not.toBeInTheDocument()
  })

  it('renders id and isTeam when team is not defined', () => {
    renderComponent({
      referralSetData: {
        id: '0'.repeat(64),
        isTeam: false
      }
    })
    const [id, team] = screen.getAllByTestId(dataTableLocators.dataRow)
    expect(id).toHaveTextContent('Id')
    expect(id).toHaveTextContent('000000…0000')

    expect(team).toHaveTextContent('Team')
    expect(team).toHaveTextContent('No')
    expect(screen.queryByText('Team URL')).not.toBeInTheDocument()
    expect(screen.queryByText('Avatar URL')).not.toBeInTheDocument()
  })

  it('renders no public keys allowed when none are', () => {
    renderComponent({
      referralSetData: {
        id: '0'.repeat(64),
        isTeam: false,
        team: {
          name: 'foo',
          closed: false,
          allowList: []
        }
      }
    })
    expect(screen.getByText('No public keys allowed')).toBeInTheDocument()
  })
})
