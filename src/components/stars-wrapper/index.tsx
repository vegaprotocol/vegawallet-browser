import { VegaIcon } from '../icons/vega-icon'
import { ReactNode } from 'react'
import locators from '../locators'
import { Vega } from '../icons/vega'

export const StarsWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <section
      data-testid={locators.splashWrapper}
      className="text-center h-full"
      style={{
        backgroundImage: 'url(./stars.png)',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="h-full w-full py-6 px-5">
        <div className="flex justify-center mt-16">
          <VegaIcon />
        </div>
        <div className="flex justify-center mt-5 mb-10">
          <div className="px-3 mt-1 border-r border-vega-dark-200 flex flex-col justify-center">
            <Vega />
          </div>
          <div className="calt text-white px-3 text-3xl flex flex-col justify-center">
            wallet
          </div>
        </div>
        {children}
      </div>
    </section>
  )
}
