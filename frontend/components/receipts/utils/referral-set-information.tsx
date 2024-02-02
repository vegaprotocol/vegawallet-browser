import { truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { ReactNode } from 'react'

import { CollapsiblePanel } from '@/components/collapsible-panel'
import { DataTable } from '@/components/data-table/data-table'
import { ExternalLink } from '@/components/external-link'
import { PartyLink } from '@/components/vega-entities/party-link'
import { VegaSection } from '@/components/vega-section'
import { useNetwork } from '@/contexts/network/network-context'

export const ReferralSetInformation = ({ referralSetData }: { referralSetData: any }) => {
  const { isTeam, team, id } = referralSetData
  const { name, teamUrl, avatarUrl, closed, allowList } = team || {}
  const { network } = useNetwork()
  const items = [
    id
      ? [
          'Id',
          <ExternalLink
            key="referral-set-information-id"
            className="font-mono"
            href={`${network.console}/#/competitions/teams/${id}`}
          >
            {truncateMiddle(id)}
          </ExternalLink>
        ]
      : null,
    isTeam ? ['Team', isTeam ? 'Yes' : 'No'] : null,
    name ? ['Name', name] : name,
    teamUrl
      ? [
          'Team URL',
          <ExternalLink key="referral-set-information-team" href={teamUrl}>
            {teamUrl}
          </ExternalLink>
        ]
      : null,
    avatarUrl
      ? [
          'Avatar URL',
          <ExternalLink key="referral-set-information-avatar" href={avatarUrl}>
            {avatarUrl}
          </ExternalLink>
        ]
      : null,
    closed ? ['Closed', closed ? 'Yes' : 'No'] : null
  ]
  const dataTableItems = items.filter((item) => !!item) as [ReactNode, ReactNode][]
  const allowedPublicKeys = allowList as string[]
  return (
    <>
      <DataTable items={dataTableItems} />
      {allowedPublicKeys && (
        <VegaSection>
          <CollapsiblePanel
            title="Allow list"
            panelContent={
              allowedPublicKeys.length === 0 ? (
                'No public keys allowed'
              ) : (
                <ul>
                  {allowedPublicKeys.map((publicKey) => (
                    <div key={publicKey}>
                      <PartyLink publicKey={publicKey} />
                    </div>
                  ))}
                </ul>
              )
            }
          />
        </VegaSection>
      )}
    </>
  )
}
