import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const LOCATION_KEY = "location";

export const usePersistLocation = () => {
  let location = useLocation();

  useEffect(() => {
    localStorage.setItem(LOCATION_KEY, location.pathname);
  }, [location]);
};
