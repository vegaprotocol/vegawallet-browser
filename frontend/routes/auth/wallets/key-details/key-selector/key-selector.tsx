import { Dropdown } from '@/components/dropdown'
import { Header } from '@/components/header'
import { KeyList } from '@/components/key-list'
import { Key, useWalletStore } from '@/stores/wallets'

export const locators = {
  keySelectedCurrentKey: (keyName: string) => `${keyName}-selected-current-key`,
  keySelectorDropdownContent: 'key-selector-dropdown-content'
}

export const KeySelector = ({ currentKey }: { currentKey: Key }) => {
  const { keys } = useWalletStore((state) => ({
    keys: state.wallets.flatMap((w) => w.keys)
  }))

  return (
    <Dropdown
      enabled={keys.length > 1}
      trigger={<Header data-testid={locators.keySelectedCurrentKey(currentKey.name)} content={currentKey.name} />}
      content={(setOpen) => (
        <div data-testid={locators.keySelectorDropdownContent} className="my-4">
          <KeyList keys={keys} onClick={() => setOpen(false)} />
        </div>
      )}
    />
  )
}
