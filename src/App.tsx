import React from "react";
import { Analytics } from "@vercel/analytics/react";
import ScantreeMarketScanner from "./scantreet_market_scanner";
import "./scantreet_market_scanner.css";

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>Omni Trade Scanner</h1>
      </header>
      <main>
        <ScantreeMarketScanner autoStart={false} interval={1200} maxItems={50} />
      </main>
      <Analytics />
    </div>
  );
}
