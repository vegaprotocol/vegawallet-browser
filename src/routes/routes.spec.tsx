import { render } from '@testing-library/react'
import { Routing } from './routes'
import { MemoryRouter } from 'react-router-dom'
import { usePersistLocation } from '../hooks/persist-location'

jest.mock('../hooks/persist-location')

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
