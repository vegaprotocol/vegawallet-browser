import { Icon } from '@vegaprotocol/ui-toolkit'
import { useNavigate } from 'react-router-dom'
import locators from '../locators'
import { useMemo } from 'react'
import { Header } from '../header'

export interface PageProps {
  name: string
  children: React.ReactElement
  backLocation?: string
}

export const Page = ({ name, children, backLocation = '' }: PageProps) => {
  const navigate = useNavigate()
  const testId = useMemo(() => name.replace(/ /g, '-').toLowerCase(), [name])
  return (
    <section className="pt-14 px-5 h-full pb-8 overflow-y-auto" data-testid={testId}>
      {backLocation ? (
        <button data-testid={`${testId}-back`} onClick={() => navigate(backLocation)}>
          <div data-testid={locators.pageBack} className="flex flex-col justify-center mr-2 text-vega-dark-300">
            <Icon size={6} name="chevron-left" />
          </div>
          <Header content={name} />
        </button>
      ) : (
        <Header content={name} />
      )}
      <div className="mt-6">{children}</div>
    </section>
  )
}
