import { InputError } from '@vegaprotocol/ui-toolkit'
import zxcvbn from 'zxcvbn'
import classNames from 'classnames'

const COLORS = [
  'bg-vega-yellow-650',
  'bg-vega-yellow-600',
  'bg-vega-yellow-550',
  'bg-vega-yellow-500',
  'bg-vega-yellow-450'
]

export const locators = {
  error: 'password-feedback-error',
  feedbackStrength: 'password-feedback-strength'
}

export const PasswordFeedback = ({ password }: { password: string }) => {
  const passwordStrength = zxcvbn(password)
  const combinedFeedback = [passwordStrength.feedback.warning, ...passwordStrength.feedback.suggestions].filter(Boolean)
  const feedback = combinedFeedback.map((s) => s.replace(/\.$/, '')).join('. ')
  return (
    <>
      <div className="grid grid-cols-4 gap-1 mt-1">
        {new Array(4).fill(0).map((_, i) => (
          <div
            data-testid={locators.feedbackStrength}
            key={i}
            className={classNames('h-1 rounded-md', {
              'bg-vega-dark-150': passwordStrength.score < i + 1,
              [COLORS[i]]: passwordStrength.score >= i + 1
            })}
          ></div>
        ))}
      </div>
      {combinedFeedback.length ? (
        <InputError data-testid={locators.error} forInput="password">
          {feedback}.
        </InputError>
      ) : null}
    </>
  )
}
