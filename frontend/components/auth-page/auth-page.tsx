import { ReactNode } from 'react'

export const locators = {
  authPageTitle: 'auth-page-title'
}

export interface AuthPageProps {
  dataTestId: string
  title: ReactNode
  children: ReactNode
}

export const AuthPage = ({ dataTestId, title, children }: AuthPageProps) => {
  return (
    <section data-testid={dataTestId}>
      <h1 data-testid={locators.authPageTitle} className="flex justify-center flex-col text-2xl text-white">
        {title}
      </h1>
      {children}
    </section>
  )
}
