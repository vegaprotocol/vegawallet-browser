import { ReactNode } from 'react'

import { CollapsiblePanel } from '@/components/collapsible-panel'
import { DataTable } from '@/components/data-table/data-table'
import { ExternalLink } from '@/components/external-link'
import { PartyLink } from '@/components/vega-entities/party-link'
import { TeamLink } from '@/components/vega-entities/team-link'
import { VegaSection } from '@/components/vega-section'

export const ReferralSetInformation = ({ referralSetData }: { referralSetData: any }) => {
  const { isTeam, team, id } = referralSetData
  const { name, teamUrl, avatarUrl, closed, allowList } = team || {}
  const items = [
    id == null ? null : ['Id', <TeamLink key="referral-set-information-id" id={id} />],
    isTeam == null ? null : ['Team', isTeam ? 'Yes' : 'No'],
    name == null ? name : ['Name', name],
    teamUrl == null
      ? null
      : [
          'Team URL',
          <ExternalLink key="referral-set-information-team" href={teamUrl}>
            {teamUrl}
          </ExternalLink>
        ],
    avatarUrl == null
      ? null
      : [
          'Avatar URL',
          <ExternalLink key="referral-set-information-avatar" href={avatarUrl}>
            {avatarUrl}
          </ExternalLink>
        ],
    closed == null ? null : ['Closed', closed ? 'Yes' : 'No']
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
