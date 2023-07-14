import { Button } from '@vegaprotocol/ui-toolkit'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../../route-names'
import { Page } from '../../../components/page'
import { useCallback, useEffect, useState } from 'react'
import uniq from 'lodash/uniq'
import { ConfirmMnemonicInput } from './confirm-mnemonic-input'

// const WORD_CONFIRMATION_STORAGE_KEY = 'word-confirmation'
// const WORD_ENTRIES_STORAGE_KEY = 'word-entries'

const mnemonic =
  'spell spell spell spell spell spell spell spell spell spell spell spell spell spell spell spell spell spell spell spell spell spell spell spell'

interface FormFields {
  [key: string]: string
}

const useGetRandomWords = (count: number) => {
  const [words, setWords] = useState<number[]>([])
  const getRandom = useCallback(() => Math.floor(Math.random() * 24), [])
  useEffect(() => {
    const initialRandoms = new Array(count).fill(null).map(() => getRandom())
    let uniqueRandoms = uniq(initialRandoms)
    while (uniqueRandoms.length !== count) {
      uniqueRandoms = uniq([...uniqueRandoms, getRandom()])
    }
    setWords(uniqueRandoms.sort())
  }, [count, getRandom])
  return words
}

export const ConfirmMnemonic = () => {
  const words = useGetRandomWords(4)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()
  const navigate = useNavigate()
  const onSubmit = () => {
    navigate(FULL_ROUTES.telemetry)
  }
  const splitMnemonic = mnemonic.split(' ')

  if (splitMnemonic.length !== 24) {
    throw new Error('Invalid mnemonic')
  }
  return (
    <Page name="Confirm Recovery Phrase" backLocation={FULL_ROUTES.saveMnemonic}>
      <>
        <p className="my-6">Confirm that you have saved your recovery phrase by filling in the blanks.</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8 grid grid-cols-3 gap-2">
            {new Array(24).fill(null).map((_, index) => (
              <ConfirmMnemonicInput
                key={`mnemonic-input-${index}`}
                splitMnemonic={splitMnemonic}
                index={index}
                requiredWords={words}
                register={register}
                errors={errors}
              />
            ))}
          </div>
          <Button variant="primary" fill={true} type="submit" data-testid="confirm-mnemonic-button">
            Continue
          </Button>
        </form>
      </>
    </Page>
  )
}
