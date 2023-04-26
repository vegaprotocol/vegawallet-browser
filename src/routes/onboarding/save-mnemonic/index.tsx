import { useCallback, useState } from 'react'
import { Page } from '../../../components/page'
import { Button } from '@vegaprotocol/ui-toolkit'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../..'
import { Checkbox } from '../../../components/checkbox'
import { MnemonicContainer } from '../../../components/mnemonic-container'

interface FormFields {
  acceptedTerms: boolean
}

export const SaveMnemonic = () => {
  const navigate = useNavigate()
  const { control, handleSubmit } = useForm<FormFields>()
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

  const submit = useCallback(() => {
    navigate(FULL_ROUTES.wallets)
  }, [navigate])
  return (
    <Page name="Secure your wallet">
      <>
        <p className="pb-6">
          Write down or save this recovery phrase to a safe place. You'll need
          it to recover your wallet. Never share this with anyone else.
        </p>
        <MnemonicContainer mnemonic={mnemonic} />
        <form className="mt-8" onSubmit={handleSubmit(submit)}>
          <Checkbox
            name="acceptedTerms"
            label="I understand that if I lose my recovery phrase, I lose access to my wallet and keys."
            control={control}
          />
          <Button
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
