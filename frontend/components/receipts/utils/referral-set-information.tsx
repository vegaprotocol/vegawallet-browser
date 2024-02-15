import { CollapsiblePanel } from '@/components/collapsible-panel'
import { ConditionalDataTable, RowConfig } from '@/components/data-table/conditional-data-table'
import { ExternalLink } from '@/components/external-link'
import { PartyLink } from '@/components/vega-entities/party-link'
import { TeamLink } from '@/components/vega-entities/team-link'
import { VegaSection } from '@/components/vega-section'

export const ReferralSetInformation = ({ referralSetData }: { referralSetData: any }) => {
  const allowList = referralSetData?.team?.allowList
  const items: RowConfig<typeof referralSetData>[] = [
    { prop: 'id', render: (data) => ['Id', <TeamLink key="referral-set-information-id" id={data.id} />] },
    { prop: 'isTeam', render: (data) => ['Team', data.isTeam ? 'Yes' : 'No'] },
    { prop: 'team.name', render: (data) => ['Name', data.team.name] },
    {
      prop: 'team.teamUrl',
      render: (data) => [
        'Team URL',
        <ExternalLink key="referral-set-information-team" href={data.team.teamUrl}>
          {data.team.teamUrl}
        </ExternalLink>
      ]
    },
    {
      prop: 'team.avatarUrl',
      render: (data) => [
        'Avatar URL',
        <ExternalLink key="referral-set-information-avatar" href={data.team.avatarUrl}>
          {data.team.avatarUrl}
        </ExternalLink>
      ]
    },
    { prop: 'team.closed', render: (data) => ['Closed', data.team.closed ? 'Yes' : 'No'] }
  ]
  const allowedPublicKeys = allowList as string[]
  return (
    <>
      <ConditionalDataTable items={items} data={referralSetData} />
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
