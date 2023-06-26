import { useCallback } from 'react'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'
import { RpcMethods } from '../../../lib/client-rpc-methods'
import config from '@config'
import { SettingsSection } from './settings-section'
import { ExternalLink } from '@vegaprotocol/ui-toolkit'

export const locators = {
  settingsOpenPopoutButton: 'open-popout-button'
}

export const FooterSection = () => {
  const { client } = useJsonRpcClient()
  const popout = useCallback(async () => {
    await client.request(RpcMethods.OpenPopout, null)
    if (config.closeWindowOnPopupOpen) {
      window.close()
    }
  }, [client])
  return (
    <SettingsSection>
      <ExternalLink
        onClick={popout}
        data-testid={locators.settingsOpenPopoutButton}
        className="text-white"
        type="submit"
      >
        Open wallet in a new window
      </ExternalLink>
    </SettingsSection>
  )
}
