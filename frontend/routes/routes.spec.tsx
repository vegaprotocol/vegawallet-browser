import { render } from '@testing-library/react'
import { Routing } from './routes'
import { MemoryRouter } from 'react-router-dom'
import { usePersistLocation } from '../hooks/persist-location'

jest.mock('../hooks/persist-location')

jest.mock('./home')
jest.mock('./login')

jest.mock('./onboarding/get-started')
jest.mock('./onboarding/create-password')
jest.mock('./onboarding/import-wallet')
jest.mock('./onboarding/create-wallet')
jest.mock('./onboarding/save-mnemonic')
jest.mock('./onboarding/telemetry')

jest.mock('./auth')
jest.mock('./auth/wallets/home')
jest.mock('./auth/wallets/key-details')
jest.mock('./auth/settings')
jest.mock('./auth/connections')

describe('Routes', () => {
  it('calls persist location', () => {
    render(
      <MemoryRouter>
        <Routing />
      </MemoryRouter>
    )
    expect(usePersistLocation).toBeCalled()
  })
})
