import { useCallback, useState } from 'react'
import { Page } from '../../../components/page'
import { Button } from '@vegaprotocol/ui-toolkit'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../..'
import { Checkbox } from '../../../components/checkbox'
import { MnemonicContainer } from '../../../components/mnemonic-container'
import { saveMnemonicButton, saveMnemonicDescription } from '../../../locator-ids'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'

interface FormFields {
  acceptedTerms: boolean
}

export const SaveMnemonic = () => {
  const { client } = useJsonRpcClient()
  const navigate = useNavigate()
  const { control, handleSubmit } = useForm<FormFields>()
  const [mnemonicShown, setMnemonicShown] = useState<boolean>(false)
  const [mnemonic] = useState<string>(
    [
      'symptomatic',
      'hissing',
      'hill',
      'ugly',
      'lavish',
      'possessive',
      'suck',
      'anger',
      'circle',
      'neighborly',
      'unit',
      'wait',
      'matter',
      'incandescent',
      'null',
      'borrow',
      'classy',
      'quiet',
      'branch',
      'awake',
      'responsible',
      'meeting',
      'religion',
      'tremble'
    ].join(' ')
  )
  const acceptedTerms = useWatch({ control, name: 'acceptedTerms' })

  const submit = useCallback(async () => {
    await client.request('admin.create_wallet', { mnemonic, name: 'Wallet 1' })
    navigate(FULL_ROUTES.wallets)
  }, [client, mnemonic, navigate])
  return (
    <Page name="Secure your wallet">
      <>
        <p data-testid={saveMnemonicDescription} className="pb-6">
          Write down or save this recovery phrase to a safe place. You'll need it to recover your wallet. Never share
          this with anyone else.
        </p>
        <MnemonicContainer mnemonic={mnemonic} onChange={setMnemonicShown} />
        <form className="mt-8" onSubmit={handleSubmit(submit)}>
          {mnemonicShown && (
            <Checkbox
              name="acceptedTerms"
              label="I understand that if I lose my recovery phrase, I lose access to my wallet and keys."
              control={control}
            />
          )}
          <Button
            data-testid={saveMnemonicButton}
            fill={true}
            type="submit"
            variant="primary"
            className="mt-8"
            disabled={!Boolean(acceptedTerms)}
          >
            Continue
          </Button>
        </form>
      </>
    </Page>
  )
}
