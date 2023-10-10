import { useMemo } from 'react'
import { BasePage } from '../page'

export interface PageProps {
  name: string
  children: React.ReactElement
  backLocation?: string
  onBack?: () => void
}

export const OnboardingPage = ({ onBack, name, children, backLocation }: PageProps) => {
  const testId = useMemo(() => name.replace(/ /g, '-').toLowerCase(), [name])
  return (
    <BasePage
      title={name}
      onBack={onBack}
      className="pt-14 px-5 h-full pb-8 overflow-y-auto"
      backLocation={backLocation}
      dataTestId={testId}
    >
      <div className="mt-6">{children}</div>
    </BasePage>
  )
}
