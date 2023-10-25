import { ReactNode } from 'react'
import { Header } from '../../header'
import { Icon } from '@vegaprotocol/ui-toolkit'
import { NavLink } from 'react-router-dom'

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
  return (
    <section className={className} data-testid={dataTestId}>
      {backLocation ? (
        <Header
          content={
            <div className="flex">
              <NavLink
                to={{ pathname: backLocation }}
                data-testid={locators.basePageBack}
                onClick={() => {
                  onBack?.()
                }}
                className="flex flex-col justify-center"
              >
                <div className="flex flex-col justify-center mr-2 text-vega-dark-300">
                  <Icon size={6} name="chevron-left" />
                </div>
              </NavLink>
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
