import { ReactNode } from 'react'
import { Header } from '../header'

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
      <Header content={title} />
      {children}
    </section>
  )
}
