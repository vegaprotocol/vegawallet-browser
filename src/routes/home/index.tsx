import { Navigate } from "react-router-dom";
import { FULL_ROUTES } from "..";
import { LOCATION_KEY } from "../../hooks/persist-location";

export const Home = () => {
  const path = localStorage.getItem(LOCATION_KEY);
  return <Navigate to={path || FULL_ROUTES.onboarding} />;
};
