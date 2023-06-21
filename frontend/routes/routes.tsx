import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Home } from './home'
import { Login } from './login'

import { GetStarted } from './onboarding/get-started'
import { CreateWallet } from './onboarding/create-wallet'
import { CreatePassword } from './onboarding/create-password'
import { SaveMnemonic } from './onboarding/save-mnemonic'
import { ImportWallet } from './onboarding/import-wallet'
import { Telemetry } from './onboarding/telemetry'

import { Auth } from './auth'
import { Wallets } from './auth/wallets'
import { Settings } from './auth/settings'
import { Connections } from './auth/connections'

import { usePersistLocation } from '../hooks/persist-location'
import { ComingSoon } from '../components/coming-soon'
import { FULL_ROUTES, ROUTES } from './route-names'

export const Routing = () => {
  usePersistLocation()
  return (
    <Routes>
      <Route element={<Telemetry />}>
        <Route index path={ROUTES.home} element={<Home />} />
        <Route path={ROUTES.auth} element={<Auth />}>
          <Route path={ROUTES.wallets} element={<Wallets />} />
          <Route path={ROUTES.transactions} element={<ComingSoon />}>
            <Route index element={<ComingSoon />} />
            <Route path={':id'} element={<ComingSoon />} />
          </Route>
          <Route path={ROUTES.connections} element={<Connections />} />
          <Route path={ROUTES.settings} element={<Settings />} />
        </Route>
        <Route path={ROUTES.onboarding} element={<Outlet />}>
          <Route index element={<Navigate to={FULL_ROUTES.getStarted} />} />
          <Route path={ROUTES.getStarted} element={<GetStarted />} />
          <Route path={ROUTES.createPassword} element={<CreatePassword />} />
          <Route path={ROUTES.createWallet} element={<CreateWallet />} />
          <Route path={ROUTES.saveMnemonic} element={<SaveMnemonic />} />
          <Route path={ROUTES.telemetry} element={<Telemetry />} />
          <Route path={ROUTES.importWallet} element={<ImportWallet />} />
        </Route>
        <Route path={ROUTES.login} element={<Login />} />
      </Route>
    </Routes>
  )
}
