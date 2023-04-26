import React from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CopyWithCheckmark } from './copy-with-check'

jest.mock(
  'react-copy-to-clipboard',
  () =>
    ({ children, text, onCopy }: any) =>
      <button onClick={onCopy}>{children}</button>
)

describe('CopyWithCheckmark', () => {
  const text = 'Some code to copy'
  const children = <code>{text}</code>

  it('renders the component with the correct text and icon side', () => {
    render(<CopyWithCheckmark text={text}>{children}</CopyWithCheckmark>)
    const copyButton = screen.getByTestId('copy-with-check')
    const codeElement = screen.getByText(text)

    expect(copyButton).toBeInTheDocument()
    expect(codeElement).toBeInTheDocument()
    expect(copyButton).toHaveTextContent(text)
    expect(screen.getByTestId('copy')).toBeInTheDocument()
    expect(screen.queryByTestId('tick')).not.toBeInTheDocument()

    userEvent.click(copyButton)

    const tick = screen.getByTestId('tick')

    expect(screen.queryByTestId('copy')).not.toBeInTheDocument()
    expect(tick).toBeInTheDocument()
    expect(tick).toHaveClass('text-vega-green-550')
  })

  it('renders the icon on the left hand side if passed left', () => {
    render(
      <CopyWithCheckmark text={text} iconSide="left">
        {children}
      </CopyWithCheckmark>
    )
    const copyButton = screen.getByTestId('copy-with-check')
    expect(screen.getByTestId('copy')).toBeInTheDocument()
    expect(screen.queryByTestId('tick')).not.toBeInTheDocument()

    userEvent.click(copyButton)

    const tick = screen.getByTestId('tick')

    expect(screen.queryByTestId('copy')).not.toBeInTheDocument()
    expect(tick).toBeInTheDocument()
    expect(tick).toHaveClass('text-vega-green-550')
  })

  it('changes back to a copy button after a second', () => {
    jest.useFakeTimers()
    render(
      <CopyWithCheckmark text={text} iconSide="right">
        {children}
      </CopyWithCheckmark>
    )
    const copyButton = screen.getByTestId('copy-with-check')

    userEvent.click(copyButton)

    const tick = screen.getByTestId('tick')

    expect(screen.queryByTestId('copy')).not.toBeInTheDocument()
    expect(tick).toBeInTheDocument()
    expect(tick).toHaveClass('text-vega-green-550')

    act(() => jest.runOnlyPendingTimers())

    expect(screen.getByTestId('copy')).toBeInTheDocument()
    expect(screen.queryByTestId('tick')).not.toBeInTheDocument()
  })
})
