import { render, screen } from '@testing-library/react'
import { ConnectionSuccess } from './connection-success'
import locators from '../locators'

describe('ConnectionSuccess', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  it('renders title and hostname', () => {
    render(<ConnectionSuccess onClose={jest.fn()} hostname="test" />)
    expect(screen.getByTestId(locators.connectionSuccessTitle)).toHaveTextContent('Connected')
    expect(screen.getByTestId(locators.connectionSuccessHostname)).toHaveTextContent('test')
  })
  it('call on close after some time', () => {
    const onClose = jest.fn()
    render(<ConnectionSuccess onClose={onClose} hostname="test" />)
    jest.runAllTimers()
    expect(onClose).toBeCalled()
  })
})
