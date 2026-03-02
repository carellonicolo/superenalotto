import React from 'react';
import {
  type MatchResult,
  type ExtractionResult,
  formatCurrency,
  formatNumber,
  WIN_CATEGORIES,
} from '@/lib/superenalotto';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

export interface GameRecord {
  id: number;
  extraction: ExtractionResult;
  results: MatchResult[];
  totalWon: number;
  cost: number;
}

interface StatisticheDashboardProps {
  history: GameRecord[];
}

const StatisticheDashboard: React.FC<StatisticheDashboardProps> = ({ history }) => {
  const totalSpent = history.reduce((sum, g) => sum + g.cost, 0);
  const totalWon = history.reduce((sum, g) => sum + g.totalWon, 0);

  // O(n) cumulative calculation
  const balanceData: { giocata: number; bilancio: number; speso: number; vinto: number }[] = [];
  let cumSpent = 0;
  let cumWon = 0;
  for (let idx = 0; idx < history.length; idx++) {
    cumSpent += history[idx].cost;
    cumWon += history[idx].totalWon;
    balanceData.push({ giocata: idx + 1, bilancio: cumWon - cumSpent, speso: cumSpent, vinto: cumWon });
  }

  const numFrequency: Record<number, number> = {};
  history.forEach((g) => {
    g.extraction.numbers.forEach((n) => {
      numFrequency[n] = (numFrequency[n] || 0) + 1;
    });
  });

  const topNumbers = Object.entries(numFrequency).sort(([, a], [, b]) => b - a).slice(0, 10);

  const winCounts: Record<string, number> = {};
  history.forEach((g) => {
    g.results.forEach((r) => {
      if (r.category) winCounts[r.category] = (winCounts[r.category] || 0) + 1;
    });
  });

  return (
    <div className="glass-card p-5 sm:p-6 space-y-5">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Statistiche della Sessione</h2>
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          Nessuna giocata effettuata. Gioca per vedere le statistiche!
        </p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-secondary/50 rounded-xl border border-border text-center">
              <div className="text-[10px] text-muted-foreground">Giocate</div>
              <div className="text-lg font-bold text-primary">{history.length}</div>
            </div>
            <div className="p-3 bg-secondary/50 rounded-xl border border-border text-center">
              <div className="text-[10px] text-muted-foreground">Speso</div>
              <div className="text-lg font-bold text-destructive">{formatCurrency(totalSpent)}</div>
            </div>
            <div className="p-3 bg-secondary/50 rounded-xl border border-border text-center">
              <div className="text-[10px] text-muted-foreground">Vinto</div>
              <div className="text-lg font-bold text-accent">{formatCurrency(totalWon)}</div>
            </div>
          </div>

          <div
            className="p-3 rounded-xl text-center font-bold text-lg border"
            style={{
              background: totalWon >= totalSpent ? 'hsl(145 60% 42% / 0.12)' : 'hsl(0 72% 51% / 0.12)',
              borderColor: totalWon >= totalSpent ? 'hsl(145 60% 42% / 0.3)' : 'hsl(0 72% 51% / 0.3)',
              color: totalWon >= totalSpent ? 'hsl(145 60% 65%)' : 'hsl(0 72% 65%)',
            }}
          >
            Bilancio: {formatCurrency(totalWon - totalSpent)}
          </div>

          {history.length > 1 && (
            <div className="bg-secondary/30 rounded-xl border border-border p-4">
              <h4 className="text-sm font-bold mb-3 text-foreground">Andamento Bilancio</h4>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={balanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 15% 20%)" />
                    <XAxis dataKey="giocata" tick={{ fontSize: 10, fill: 'hsl(215 15% 55%)' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(215 15% 55%)' }} />
                    <Tooltip contentStyle={{ background: 'hsl(225 20% 12%)', border: '1px solid hsl(225 15% 22%)', borderRadius: '8px', color: 'hsl(210 40% 95%)' }} formatter={(value: number) => formatCurrency(value)} />
                    <Line type="monotone" dataKey="bilancio" stroke="hsl(0 72% 51%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="bg-secondary/30 rounded-xl border border-border p-4">
            <h4 className="text-sm font-bold mb-3 text-foreground">Vincite per Categoria</h4>
            <div className="space-y-1.5">
              {WIN_CATEGORIES.map((cat) => (
                <div key={cat.category} className="flex justify-between text-xs p-2 bg-background/30 rounded-lg border border-border/50">
                  <span className="font-semibold text-foreground">{cat.description}</span>
                  <span className="font-bold text-primary">{winCounts[cat.category] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          {topNumbers.length > 0 && (
            <div className="bg-secondary/30 rounded-xl border border-border p-4">
              <h4 className="text-sm font-bold mb-3 text-foreground">Numeri Più Estratti</h4>
              <div className="flex flex-wrap gap-2">
                {topNumbers.map(([num, count]) => (
                  <div
                    key={num}
                    className="flex flex-col items-center px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{
                      background: 'linear-gradient(135deg, hsl(225 50% 35%), hsl(225 40% 25%))',
                      color: 'white',
                      minWidth: '40px',
                    }}
                  >
                    <span>{num}</span>
                    <span className="text-[9px] opacity-60">×{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StatisticheDashboard;
