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
import { Wallets } from './auth/wallets/home'
import { Settings } from './auth/settings'
import { Connections } from './auth/connections'

import { usePersistLocation } from '../hooks/persist-location'
import { FULL_ROUTES, ROUTES } from './route-names'
import { KeyDetails } from './auth/wallets/key-details'

export const Routing = () => {
  usePersistLocation()
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route index path={ROUTES.home} element={<Home />} />
        <Route path={ROUTES.auth} element={<Auth />}>
          <Route path={ROUTES.wallets} element={<Outlet />}>
            <Route index element={<Wallets />} />
            <Route path={':id'} element={<KeyDetails />} />
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
