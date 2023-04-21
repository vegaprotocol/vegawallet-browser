import { Outlet, Route, Routes } from "react-router-dom";
import { Auth } from "./auth";
import { Onboarding } from "./onboarding";
import { Wallets } from "./wallets";
import { Transactions } from "./transactions";
import { Settings } from "./settings";
import { Login } from "./login";
import { Home } from "./home";
import { OnboardingHome } from "./onboarding/home";
import { CreatePassword } from "./onboarding/create-password";
import { SaveMnemonic } from "./onboarding/save-mnemonic";
import { Telemetry } from "./onboarding/telemetry";
import { TransactionHomePage } from "./transactions/home";
import { TransactionPage } from "./transactions/:id/transaction";
import { usePersistLocation } from "../hooks/persist-location";
import { Connections } from "./connections";

const ROUTE_NAMES = {
  auth: "auth",
  onboarding: "onboarding",
  connections: "connections",
  login: "login",
  settings: "settings",
  wallets: "wallets",
  transactions: "transactions",
  createPassword: "create-password",
  saveMnemonic: "save-mnemonic",
  telemetry: "telemetry",
};

export const FULL_ROUTES = {
  home: "/",

  onboarding: `/${ROUTE_NAMES.onboarding}`,
  createPassword: `/${ROUTE_NAMES.onboarding}/${ROUTE_NAMES.createPassword}`,
  saveMnemonic: `/${ROUTE_NAMES.onboarding}/${ROUTE_NAMES.saveMnemonic}`,
  telemetry: `/${ROUTE_NAMES.onboarding}/${ROUTE_NAMES.telemetry}`,

  login: `/${ROUTE_NAMES.login}`,

  auth: `/${ROUTE_NAMES.auth}`,
  settings: `/${ROUTE_NAMES.auth}/${ROUTE_NAMES.settings}`,
  wallets: `/${ROUTE_NAMES.auth}/${ROUTE_NAMES.wallets}`,
  transactions: `/${ROUTE_NAMES.auth}/${ROUTE_NAMES.transactions}`,
  connections: `/${ROUTE_NAMES.auth}/${ROUTE_NAMES.connections}`,
};

const ROUTES = {
  home: "/",
  auth: `/${ROUTE_NAMES.auth}`,

  login: `/${ROUTE_NAMES.login}`,

  onboarding: `/${ROUTE_NAMES.onboarding}`,
  createPassword: `${ROUTE_NAMES.createPassword}`,
  saveMnemonic: `${ROUTE_NAMES.saveMnemonic}`,
  telemetry: `${ROUTE_NAMES.telemetry}`,

  settings: ROUTE_NAMES.settings,
  wallets: ROUTE_NAMES.wallets,
  transactions: ROUTE_NAMES.transactions,
  connections: ROUTE_NAMES.connections,
};

export const Routing = () => {
  usePersistLocation();
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route index path={ROUTES.home} element={<Home />} />
        <Route path={ROUTES.auth} element={<Auth />}>
          <Route path={ROUTES.wallets} element={<Wallets />} />
          <Route path={ROUTES.transactions} element={<Transactions />}>
            <Route index element={<TransactionHomePage />} />
            <Route path={":id"} element={<TransactionPage />} />
          </Route>
          <Route path={ROUTES.connections} element={<Connections />} />
          <Route path={ROUTES.settings} element={<Settings />} />
        </Route>
        <Route path={ROUTES.onboarding} element={<Onboarding />}>
          <Route index element={<OnboardingHome />} />
          <Route path={ROUTES.createPassword} element={<CreatePassword />} />
          <Route path={ROUTES.saveMnemonic} element={<SaveMnemonic />} />
          <Route path={ROUTES.telemetry} element={<Telemetry />} />
        </Route>
        <Route path={ROUTES.login} element={<Login />} />
      </Route>
    </Routes>
  );
};
