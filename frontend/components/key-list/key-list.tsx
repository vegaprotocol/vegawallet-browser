import { List } from '../list'
import { Key } from '../../stores/wallets'
import { ReactNode } from 'react'
import { VegaKey } from '../keys/vega-key'
import { NavLink } from 'react-router-dom'
import { FULL_ROUTES } from '../../routes/route-names'
import { SubHeader } from '../sub-header'

export const locators = {
  walletsSignMessageButton: 'sign-message-button',
  viewDetails: (keyName: string) => `${keyName}-view-details`
}

export interface KeyListProps {
  keys: Key[]
  renderActions?: (key: Key) => ReactNode
  onClick?: () => void
}

export const KeyList = ({ keys, renderActions, onClick }: KeyListProps) => {
  return (
    <section className="text-base mt-6">
      <SubHeader content="Keys" />
      <List<Key>
        className="mt-2"
        idProp="publicKey"
        items={keys}
        renderItem={(k) => (
          <VegaKey publicKey={k.publicKey} name={k.name} actions={renderActions?.(k)}>
            <NavLink
              onClick={onClick}
              to={{ pathname: `${FULL_ROUTES.wallets}/${k.publicKey}` }}
              data-testid={locators.viewDetails(k.name)}
              className="hover:bg-vega-dark-200 w-12 h-full border-l border-1 border-vega-dark-150 flex items-center justify-center"
            >
              <svg width={24} height={24} viewBox="0 0 16 16">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4.75 14.38L4 13.62L9.63 8.00001L4 2.38001L4.75 1.62001L11.13 8.00001L4.75 14.38Z"
                    fill="currentColor"
                  />
                </svg>
              </svg>
            </NavLink>
          </VegaKey>
        )}
      />
    </section>
  )
}
