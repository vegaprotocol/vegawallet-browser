import { Button } from "@vegaprotocol/ui-toolkit";
import { useNavigate } from "react-router-dom";
import { FULL_ROUTES } from "../..";

export const OnboardingHome = () => {
  const navigate = useNavigate();
  return (
    <section className="p-4">
      <h1>Get started</h1>
      <ul className="list-disc">
        <li>Securely connect to Vega dapps</li>
        <li>Trade on Vega's DEX</li>
        <li>Easily deposit and withdraw assets</li>
        <li>Instantly approve and reject transactions</li>
      </ul>
      <Button
        variant="primary"
        onClick={() => {
          navigate(FULL_ROUTES.createPassword);
        }}
        fill={true}
      >
        Create wallet
      </Button>
    </section>
  );
};
