import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  // Cumulative balance chart
  const balanceData = history.map((g, idx) => {
    const cumSpent = history.slice(0, idx + 1).reduce((s, x) => s + x.cost, 0);
    const cumWon = history.slice(0, idx + 1).reduce((s, x) => s + x.totalWon, 0);
    return {
      giocata: idx + 1,
      bilancio: cumWon - cumSpent,
      speso: cumSpent,
      vinto: cumWon,
    };
  });

  // Number frequency
  const numFrequency: Record<number, number> = {};
  history.forEach((g) => {
    g.extraction.numbers.forEach((n) => {
      numFrequency[n] = (numFrequency[n] || 0) + 1;
    });
  });

  const topNumbers = Object.entries(numFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  // Win count by category
  const winCounts: Record<string, number> = {};
  history.forEach((g) => {
    g.results.forEach((r) => {
      if (r.category) {
        winCounts[r.category] = (winCounts[r.category] || 0) + 1;
      }
    });
  });

  return (
    <Card className="border-2 border-green-300 bg-green-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg" style={{ color: '#1a3a6b' }}>
          <BarChart3 className="w-5 h-5" />
          Statistiche della Sessione
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nessuna giocata effettuata. Gioca per vedere le statistiche!
          </p>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-white rounded-lg border text-center">
                <div className="text-[10px] text-muted-foreground">Giocate</div>
                <div className="text-lg font-bold" style={{ color: '#1a3a6b' }}>
                  {history.length}
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg border text-center">
                <div className="text-[10px] text-muted-foreground">Speso</div>
                <div className="text-lg font-bold text-red-700">{formatCurrency(totalSpent)}</div>
              </div>
              <div className="p-3 bg-white rounded-lg border text-center">
                <div className="text-[10px] text-muted-foreground">Vinto</div>
                <div className="text-lg font-bold text-green-700">{formatCurrency(totalWon)}</div>
              </div>
            </div>

            {/* Balance */}
            <div
              className="p-3 rounded-lg text-center font-bold text-lg"
              style={{
                background: totalWon >= totalSpent ? '#d4edda' : '#f8d7da',
                color: totalWon >= totalSpent ? '#155724' : '#721c24',
              }}
            >
              Bilancio: {formatCurrency(totalWon - totalSpent)}
            </div>

            {/* Balance chart */}
            {history.length > 1 && (
              <div className="bg-white rounded-lg border p-3">
                <h4 className="text-sm font-bold mb-2" style={{ color: '#1a3a6b' }}>
                  Andamento Bilancio
                </h4>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={balanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="giocata" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Line
                        type="monotone"
                        dataKey="bilancio"
                        stroke="#c41e2a"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Win counts */}
            <div className="bg-white rounded-lg border p-3">
              <h4 className="text-sm font-bold mb-2" style={{ color: '#1a3a6b' }}>
                Vincite per Categoria
              </h4>
              <div className="space-y-1">
                {WIN_CATEGORIES.map((cat) => (
                  <div
                    key={cat.category}
                    className="flex justify-between text-xs p-1.5 bg-gray-50 rounded"
                  >
                    <span className="font-semibold">{cat.description}</span>
                    <span className="font-bold">{winCounts[cat.category] || 0}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top extracted numbers */}
            {topNumbers.length > 0 && (
              <div className="bg-white rounded-lg border p-3">
                <h4 className="text-sm font-bold mb-2" style={{ color: '#1a3a6b' }}>
                  Numeri Più Estratti
                </h4>
                <div className="flex flex-wrap gap-2">
                  {topNumbers.map(([num, count]) => (
                    <div
                      key={num}
                      className="flex flex-col items-center px-2 py-1 rounded-full text-white text-xs font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #1a3a6b, #0d2240)',
                        minWidth: '36px',
                      }}
                    >
                      <span>{num}</span>
                      <span className="text-[9px] opacity-70">×{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticheDashboard;
