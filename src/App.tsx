// import JSONRPCClient from "./lib/json-rpc-client";
import { HashRouter as Router } from "react-router-dom";
import { Routing } from "./routes";
import { JsonRPCProvider } from "./contexts/json-rpc/json-rpc-provider";
import GlobalErrorBoundary from "./components/global-error-boundary";

function App() {
  return (
    <Router>
      <GlobalErrorBoundary>
        <JsonRPCProvider>
          <main className="w-full h-full bg-black text-white">
            <Routing />
          </main>
        </JsonRPCProvider>
      </GlobalErrorBoundary>
    </Router>
  );
}

export default App;
