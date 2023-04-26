import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Home } from './home'
import { GetStarted } from './onboarding/get-started'
import { usePersistLocation } from '../hooks/persist-location'
import { ComingSoon } from '../components/coming-soon'
import { CreatePassword } from './onboarding/create-password'
import { CreateWallet } from './onboarding/create-wallet'
import { SaveMnemonic } from './onboarding/save-mnemonic'

const ROUTE_NAMES = {
  auth: 'auth',
  onboarding: 'onboarding',
  connections: 'connections',
  login: 'login',
  settings: 'settings',
  wallets: 'wallets',
  transactions: 'transactions',
  createPassword: 'create-password',
  saveMnemonic: 'save-mnemonic',
  telemetry: 'telemetry',
  createWallet: 'create-wallet',
  getStarted: 'get-started',
  importWallet: 'import-wallet'
}

export const FULL_ROUTES = {
  home: '/',

  onboarding: `/${ROUTE_NAMES.onboarding}`,
  getStarted: `/${ROUTE_NAMES.onboarding}/${ROUTE_NAMES.getStarted}`,
  createPassword: `/${ROUTE_NAMES.onboarding}/${ROUTE_NAMES.createPassword}`,
  saveMnemonic: `/${ROUTE_NAMES.onboarding}/${ROUTE_NAMES.saveMnemonic}`,
  telemetry: `/${ROUTE_NAMES.onboarding}/${ROUTE_NAMES.telemetry}`,
  createWallet: `/${ROUTE_NAMES.onboarding}/${ROUTE_NAMES.createWallet}`,
  importWallet: `/${ROUTE_NAMES.onboarding}/${ROUTE_NAMES.importWallet}`,

  login: `/${ROUTE_NAMES.login}`,

  auth: `/${ROUTE_NAMES.auth}`,
  settings: `/${ROUTE_NAMES.auth}/${ROUTE_NAMES.settings}`,
  wallets: `/${ROUTE_NAMES.auth}/${ROUTE_NAMES.wallets}`,
  transactions: `/${ROUTE_NAMES.auth}/${ROUTE_NAMES.transactions}`,
  connections: `/${ROUTE_NAMES.auth}/${ROUTE_NAMES.connections}`
}

const ROUTES = {
  home: '/',
  auth: `/${ROUTE_NAMES.auth}`,

  login: `/${ROUTE_NAMES.login}`,

  onboarding: `/${ROUTE_NAMES.onboarding}`,
  getStarted: ROUTE_NAMES.getStarted,
  createPassword: ROUTE_NAMES.createPassword,
  saveMnemonic: ROUTE_NAMES.saveMnemonic,
  telemetry: ROUTE_NAMES.telemetry,
  createWallet: ROUTE_NAMES.createWallet,
  importWallet: ROUTE_NAMES.importWallet,

  settings: ROUTE_NAMES.settings,
  wallets: ROUTE_NAMES.wallets,
  transactions: ROUTE_NAMES.transactions,
  connections: ROUTE_NAMES.connections
}

export const Routing = () => {
  usePersistLocation()
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route index path={ROUTES.home} element={<Home />} />
        <Route path={ROUTES.auth} element={<ComingSoon />}>
          <Route path={ROUTES.wallets} element={<ComingSoon />} />
          <Route path={ROUTES.transactions} element={<ComingSoon />}>
            <Route index element={<ComingSoon />} />
            <Route path={':id'} element={<ComingSoon />} />
          </Route>
          <Route path={ROUTES.connections} element={<ComingSoon />} />
          <Route path={ROUTES.settings} element={<ComingSoon />} />
        </Route>
        <Route path={ROUTES.onboarding} element={<Outlet />}>
          <Route index element={<Navigate to={FULL_ROUTES.getStarted} />} />
          <Route path={ROUTES.getStarted} element={<GetStarted />} />
          <Route path={ROUTES.createPassword} element={<CreatePassword />} />
          <Route path={ROUTES.createWallet} element={<CreateWallet />} />
          <Route path={ROUTES.saveMnemonic} element={<SaveMnemonic />} />
          <Route path={ROUTES.telemetry} element={<ComingSoon />} />
          <Route path={ROUTES.importWallet} element={<ComingSoon />} />
        </Route>
        <Route path={ROUTES.login} element={<ComingSoon />} />
      </Route>
    </Routes>
  )
}
