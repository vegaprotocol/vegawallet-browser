import { ReactNode } from 'react'
import { Header } from '../../header'
import { Icon } from '@vegaprotocol/ui-toolkit'
import { useNavigate } from 'react-router-dom'

export const locators = {
  basePageBack: 'base-page-back'
}

export interface BasePageProps {
  dataTestId: string
  title: ReactNode
  children: ReactNode
  backLocation?: string
  className?: string
  onBack?: () => void
}

export const BasePage = ({ className, dataTestId, title, children, backLocation, onBack }: BasePageProps) => {
  const navigate = useNavigate()
  return (
    <section className={className} data-testid={dataTestId}>
      {backLocation ? (
        <Header
          content={
            <div className="flex">
              <button
                data-testid={`${dataTestId}-back`}
                onClick={() => {
                  onBack?.()
                  navigate(backLocation)
                }}
              >
                <div
                  data-testid={locators.basePageBack}
                  className="flex flex-col justify-center mr-2 text-vega-dark-300"
                >
                  <Icon size={6} name="chevron-left" />
                </div>
              </button>
              {title}
            </div>
          }
        />
      ) : (
        <Header content={title} />
      )}
      <div>{children}</div>
    </section>
  )
}
