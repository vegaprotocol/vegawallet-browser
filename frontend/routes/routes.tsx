import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { usePersistLocation } from '@/hooks/persist-location'

import { Auth } from './auth'
import { Connections } from './auth/connections'
import { SettingsHome } from './auth/settings/home'
import { NetworkSettings } from './auth/settings/networks'
import { WalletsRoot } from './auth/wallets'
import { Wallets } from './auth/wallets/home'
import { KeyDetails } from './auth/wallets/key-details'
import { Home } from './home'
import { Login } from './login'
import { CreatePassword } from './onboarding/create-password'
import { CreateWallet } from './onboarding/create-wallet'
import { GetStarted } from './onboarding/get-started'
import { ImportWallet } from './onboarding/import-wallet'
import { SaveMnemonic } from './onboarding/save-mnemonic'
import { Telemetry } from './onboarding/telemetry'
import { FULL_ROUTES, ROUTES } from './route-names'

export const Routing = () => {
  usePersistLocation()
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route index path={ROUTES.home} element={<Home />} />
        <Route path={ROUTES.auth} element={<Auth />}>
          <Route path={ROUTES.wallets} element={<WalletsRoot />}>
            <Route index element={<Wallets />} />
            <Route path={':id'} element={<KeyDetails />} />
          </Route>
          <Route path={ROUTES.connections} element={<Connections />} />
          <Route path={ROUTES.settings} element={<Outlet />}>
            <Route index element={<SettingsHome />} />
            <Route path={ROUTES.networkSettings} element={<NetworkSettings />} />
          </Route>
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
