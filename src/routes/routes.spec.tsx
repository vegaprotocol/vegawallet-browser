import { render } from '@testing-library/react'
import { Routing } from './routes'
import { MemoryRouter } from 'react-router-dom'
import { usePersistLocation } from '../hooks/persist-location'

jest.mock('../hooks/persist-location')
jest.mock('./onboarding/get-started')
jest.mock('./onboarding/create-password')
jest.mock('./onboarding/create-wallet')
jest.mock('./onboarding/save-mnemonic')

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
