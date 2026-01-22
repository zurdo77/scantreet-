import React, { useEffect, useState, useRef } from "react";
import { Play, Pause, RefreshCcw } from "lucide-react";

/**
 * ScantreeMarketScanner - componente reutilizable
 */

export type Trade = {
  id: string;
  symbol: string;
  price: number;
  volume: number;
  side: "buy" | "sell";
  time: string;
};

export type ScantreeProps = {
  autoStart?: boolean;
  interval?: number;
  maxItems?: number;
  className?: string;
};

function randomTrade(i: number): Trade {
  const symbols = ["BTC/USD", "ETH/USD", "SOL/USD", "ARB/USD"];
  const side = Math.random() > 0.5 ? "buy" : "sell";
  return {
    id: `t-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`,
    symbol: symbols[Math.floor(Math.random() * symbols.length)],
    price: Number((Math.random() * 10000 + (side === "buy" ? 100 : 0)).toFixed(2)),
    volume: Number((Math.random() * 5).toFixed(3)),
    side,
    time: new Date().toLocaleTimeString()
  };
}

export default function ScantreeMarketScanner({
  autoStart = false,
  interval = 1200,
  maxItems = 50,
  className = ""
}: ScantreeProps): JSX.Element {
  const [running, setRunning] = useState<boolean>(autoStart);
  const [trades, setTrades] = useState<Trade[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      timerRef.current = window.setInterval(() => {
        setTrades((prev) => {
          const next = [randomTrade(prev.length), ...prev].slice(0, maxItems);
          return next;
        });
      }, Math.max(200, interval));
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [running, interval, maxItems]);

  function handleClear() {
    setTrades([]);
  }

  function handleFetchNow() {
    setTrades((prev) => [randomTrade(prev.length), ...prev].slice(0, maxItems));
  }

  return (
    <section className={`scantree-scanner ${className}`}>
      <div className="controls">
        <button className="btn start" onClick={() => setRunning(true)} aria-pressed={running}>
          <Play size={16} /> Iniciar
        </button>
        <button className="btn stop" onClick={() => setRunning(false)} aria-pressed={!running}>
          <Pause size={16} /> Detener
        </button>
        <button className="btn fetch" onClick={handleFetchNow}>
          <RefreshCcw size={16} /> Actualizar
        </button>
        <button className="btn clear" onClick={handleClear}>
          Limpiar
        </button>
      </div>

      <div className="stats">
        <div>Total: {trades.length}</div>
        <div>Estado: {running ? "Corriendo" : "Detenido"}</div>
      </div>

      <table className="trades">
        <thead>
          <tr>
            <th>Hora</th>
            <th>Símbolo</th>
            <th>Precio</th>
            <th>Volumen</th>
            <th>Lado</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t) => (
            <tr key={t.id}>
              <td>{t.time}</td>
              <td>{t.symbol}</td>
              <td>{t.price.toLocaleString()}</td>
              <td>{t.volume}</td>
              <td className={t.side}>{t.side.toUpperCase()}</td>
            </tr>
          ))}
          {trades.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", opacity: 0.7 }}>
                Sin operaciones — pulsa Iniciar o Actualizar
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
