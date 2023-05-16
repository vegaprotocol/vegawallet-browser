import { Button, ExternalLink } from '@vegaprotocol/ui-toolkit'
import { useForm } from 'react-hook-form'
import { useCallback } from 'react'
import packageJson from '../../../../package.json'
import { settingsPage } from '../../../locator-ids'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'

export const Settings = () => {
  const { client } = useJsonRpcClient()
  const { handleSubmit } = useForm()
  const submit = useCallback(async () => {
    await client.request('admin.lock', null)
  }, [client])
  return (
    <section data-testid={settingsPage}>
      <h1 className="flex justify-center flex-col text-2xl text-white">Settings</h1>
      <div className="mt-6">
        <div className="text-dark-300 text-sm uppercase">Vega wallet version</div>
        <div className="text-white text-lg mt-1">{packageJson.version}</div>
      </div>
      <form className="mt-6" onSubmit={handleSubmit(submit)}>
        {/* TODO create a danger button in UI toolkit */}
        <Button fill={true} className="mt-2" variant="primary" type="submit">
          Lock
        </Button>
      </form>
      <div className="mt-8">
        <div>Spotted any issues or bugs?</div>
        <ExternalLink className="text-white mt-1 underline" href={process.env['REACT_APP_FEEDBACK_LINK']}>
          Provide feedback
        </ExternalLink>
      </div>
    </section>
  )
}
