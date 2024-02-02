import { truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { ReactNode } from 'react'

import { CollapsiblePanel } from '@/components/collapsible-panel'
import { DataTable } from '@/components/data-table/data-table'
import { ExternalLink } from '@/components/external-link'
import { PartyLink } from '@/components/vega-entities/party-link'
import { useNetwork } from '@/contexts/network/network-context'

export const ReferralSetInformation = ({ referralSetData }: { referralSetData: any }) => {
  const { isTeam, team, id } = referralSetData
  const { name, teamUrl, avatarUrl, closed, allowList } = team || {}
  const { network } = useNetwork()
  const items = [
    [
      'Id',
      <ExternalLink key="referral-set-information-id" href={`${network.console}/#/competitions/teams/${id}`}>
        {truncateMiddle(id)}
      </ExternalLink>
    ],
    ['Team', isTeam ? 'Yes' : 'No'],
    ['Name', name],
    teamUrl
      ? [
          'Team URL',
          <ExternalLink key="referral-set-information-team" className="text-vega-dark-400" href={teamUrl}>
            {teamUrl}
          </ExternalLink>
        ]
      : null,
    avatarUrl
      ? [
          'Avatar URL',
          <ExternalLink key="referral-set-information-avatar" className="text-vega-dark-400" href={avatarUrl}>
            {avatarUrl}
          </ExternalLink>
        ]
      : null,
    ['Closed', closed ? 'Yes' : 'No']
  ]
  const dataTableItems = items.filter((item) => !!item) as [ReactNode, ReactNode][]
  const allowedPublicKeys = allowList as string[]
  return (
    <>
      <DataTable items={dataTableItems} />
      <CollapsiblePanel
        title="Allow list"
        panelContent={
          allowedPublicKeys.length === 0 ? (
            'No public keys allowed'
          ) : (
            <ul>
              {allowedPublicKeys.map((publicKey) => (
                <PartyLink key={publicKey} publicKey={publicKey} />
              ))}
            </ul>
          )
        }
      />
    </>
  )
}
