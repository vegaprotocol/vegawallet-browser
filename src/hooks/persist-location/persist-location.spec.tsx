import { renderHook } from '@testing-library/react'
import { LOCATION_KEY, usePersistLocation } from '.'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { ReactNode, useEffect } from 'react'

describe('PersistLocation', () => {
  it('sets the current location in local storage', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={['/foo']}>{children}</MemoryRouter>
    )
    let initialRoute: string | null = null
    let secondRoute = null
    renderHook(
      () => {
        const navigate = useNavigate()
        usePersistLocation()
        if (!initialRoute) {
          initialRoute = localStorage.getItem(LOCATION_KEY)
        }
        useEffect(() => {
          navigate('/bar')
        }, [navigate])

        secondRoute = localStorage.getItem(LOCATION_KEY)
      },
      { wrapper }
    )
    // Sets the route initially
    expect(secondRoute).toBe('/bar')
    // Sets the route after navigation
    expect(initialRoute).toBe('/foo')
  })
})
