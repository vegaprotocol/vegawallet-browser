import { fireEvent, render, screen } from '@testing-library/react'
import GlobalErrorBoundary from '.'
import { MemoryRouter } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useErrorStore } from '../../stores/error'
import { silenceErrors } from '../../test-helpers/silence-errors'

const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate
}))

jest.mock('../error-modal', () => ({
  ErrorModal: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="error-modal">
      <button data-testid="close" onClick={onClose}>
        Button
      </button>
    </div>
  )
}))

const BrokenComponent = () => {
  const [errorThrown, setErrorThrown] = useState(false)
  useEffect(() => {
    if (!errorThrown) {
      setErrorThrown(true)
      throw new Error('Somethings sideways')
    }
  }, [errorThrown])
  return <div data-testid="successful-render" />
}

const SetErrorComponent = () => {
  const { setError } = useErrorStore()
  const [errorThrown, setErrorThrown] = useState(false)
  useEffect(() => {
    if (!errorThrown) {
      setErrorThrown(true)
      setError(new Error('Somethings sideways'))
    }
  }, [errorThrown, setError])
  return <div data-testid="successful-render" />
}

describe('GlobalErrorBoundary', () => {
  it('renders error modal when there is an error', () => {
    silenceErrors()
    render(
      <MemoryRouter>
        <GlobalErrorBoundary>
          <BrokenComponent />
        </GlobalErrorBoundary>
      </MemoryRouter>
    )
    expect(screen.getByTestId('error-modal')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('close'))
    expect(mockedUsedNavigate).toBeCalled()
  })

  it('renders error modal when there is an async error', () => {
    silenceErrors()
    render(
      <MemoryRouter>
        <GlobalErrorBoundary>
          <SetErrorComponent />
        </GlobalErrorBoundary>
      </MemoryRouter>
    )
    expect(screen.getByTestId('error-modal')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('close'))
    expect(mockedUsedNavigate).toBeCalled()
  })
})
