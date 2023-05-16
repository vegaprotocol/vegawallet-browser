import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Home } from './home'
import { GetStarted } from './onboarding/get-started'
import { usePersistLocation } from '../hooks/persist-location'
import { ComingSoon } from '../components/coming-soon'
import { CreatePassword } from './onboarding/create-password'
import { Login } from './login'
import { CreateWallet } from './onboarding/create-wallet'
import { SaveMnemonic } from './onboarding/save-mnemonic'
import { Auth } from './auth'
import { Wallets } from './auth/wallets'
import { FULL_ROUTES, ROUTES } from './route-names'
import { Settings } from './auth/settings'

export const Routing = () => {
  usePersistLocation()
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route index path={ROUTES.home} element={<Home />} />
        <Route path={ROUTES.auth} element={<Auth />}>
          <Route path={ROUTES.wallets} element={<Wallets />} />
          <Route path={ROUTES.transactions} element={<ComingSoon />}>
            <Route index element={<ComingSoon />} />
            <Route path={':id'} element={<ComingSoon />} />
          </Route>
          <Route path={ROUTES.connections} element={<ComingSoon />} />
          <Route path={ROUTES.settings} element={<Settings />} />
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
        <Route path={ROUTES.login} element={<Login />} />
      </Route>
    </Routes>
  )
}
