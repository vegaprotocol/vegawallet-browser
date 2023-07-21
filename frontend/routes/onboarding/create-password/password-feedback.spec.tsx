import { PasswordFeedback, locators } from './password-feedback'
import { screen, render } from '@testing-library/react'

jest.mock('zxcvbn', () => {
  return jest.fn((password: string) => {
    if (password === 'weak') {
      return {
        score: 0,
        feedback: {
          warning: 'Weak password',
          suggestions: ['Add more characters']
        }
      }
    } else if (password === 'strong') {
      return {
        score: 4,
        feedback: {
          warning: '',
          suggestions: []
        }
      }
    }
    return {
      score: 3,
      feedback: {
        warning: 'Weak password',
        suggestions: ['Add more characters']
      }
    }
  })
})

describe('PasswordFeedback component', () => {
  test('renders password feedback strength correctly', () => {
    const password = 'test123'
    render(<PasswordFeedback password={password} />)

    // Assert that the password feedback strength bars are rendered
    const feedbackStrengthElements = screen.getAllByTestId(locators.feedbackStrength)
    expect(feedbackStrengthElements).toHaveLength(4)
    expect(feedbackStrengthElements[0]).toHaveClass('bg-vega-yellow-650')
    expect(feedbackStrengthElements[1]).toHaveClass('bg-vega-yellow-600')
    expect(feedbackStrengthElements[2]).toHaveClass('bg-vega-yellow-550')
    expect(feedbackStrengthElements[3]).toHaveClass('bg-vega-dark-150')
  })

  test('renders password error feedback correctly', () => {
    const password = 'weak'
    render(<PasswordFeedback password={password} />)

    // Assert that the password error feedback is rendered
    const errorElement = screen.getByTestId(locators.error)
    expect(errorElement).toBeInTheDocument()

    // Assert that the error feedback text is correct
    const feedback = 'Weak password. Add more characters.'
    expect(errorElement).toHaveTextContent(feedback)
  })

  test('renders no password error feedback when password is strong', () => {
    const password = 'strong'
    render(<PasswordFeedback password={password} />)

    // Assert that no password error feedback is rendered
    const errorElement = screen.queryByTestId(locators.error)
    expect(errorElement).toBeNull()
  })
})
