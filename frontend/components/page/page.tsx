import { Icon } from '@vegaprotocol/ui-toolkit'
import { useNavigate } from 'react-router-dom'
import locators from '../locators'
import { useMemo } from 'react'

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
          <h1 className="text-2xl flex text-white" data-testid={`${testId}-header`}>
            <div data-testid={locators.pageBack} className="flex flex-col justify-center mr-2 text-vega-dark-300">
              <Icon size={6} name="chevron-left" />
            </div>
            {name}
          </h1>
        </button>
      ) : (
        <h1 className="text-2xl text-white" data-testid={`${testId}-header`}>
          {name}
        </h1>
      )}
      <div className="mt-6">{children}</div>
    </section>
  )
}
