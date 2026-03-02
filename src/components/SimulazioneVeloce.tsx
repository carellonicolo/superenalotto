import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  type ColumnSelection,
  type SimulationResult,
  runSimulation,
  formatCurrency,
  formatNumber,
  WIN_CATEGORIES,
} from '@/lib/superenalotto';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Zap, TrendingDown } from 'lucide-react';

interface SimulazioneVeloceProps {
  columns: ColumnSelection[];
}

const EXTRACTION_OPTIONS = [100, 1000, 5000, 10000, 50000, 100000];

const SimulazioneVeloce: React.FC<SimulazioneVeloceProps> = ({ columns }) => {
  const [numExtractions, setNumExtractions] = useState(1000);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const filledColumns = columns.filter((c) => c.numbers.length === 6);

  const handleRun = useCallback(() => {
    if (filledColumns.length === 0) return;
    setIsRunning(true);
    setTimeout(() => {
      const res = runSimulation(filledColumns, numExtractions);
      setResult(res);
      setIsRunning(false);
    }, 50);
  }, [filledColumns, numExtractions]);

  const chartData = result
    ? WIN_CATEGORIES.map((cat) => ({
        name: cat.description,
        vincite: result.winsByCategory[cat.category],
      }))
    : [];

  const barColors = ['hsl(0 72% 51%)', 'hsl(30 90% 50%)', 'hsl(45 80% 50%)', 'hsl(225 50% 35%)', 'hsl(145 55% 40%)', 'hsl(270 50% 45%)'];

  const sliderIndex = EXTRACTION_OPTIONS.indexOf(numExtractions);

  return (
    <div className="glass-card p-5 sm:p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Simulazione Veloce</h2>
      </div>

      {filledColumns.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          Compila almeno una colonna nella schedina per avviare la simulazione.
        </p>
      ) : (
        <>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Numero di estrazioni:{' '}
              <span className="text-primary font-bold">{formatNumber(numExtractions)}</span>
            </label>
            <Slider
              value={[sliderIndex >= 0 ? sliderIndex : 1]}
              onValueChange={([v]) => setNumExtractions(EXTRACTION_OPTIONS[v])}
              min={0}
              max={EXTRACTION_OPTIONS.length - 1}
              step={1}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              {EXTRACTION_OPTIONS.map((n) => (
                <span key={n}>{formatNumber(n)}</span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Con {filledColumns.length} colonne · Spesa totale simulata:{' '}
              <strong className="text-foreground">{formatCurrency(numExtractions * filledColumns.length)}</strong>
            </p>
          </div>

          <Button
            onClick={handleRun}
            disabled={isRunning}
            className="w-full font-bold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isRunning ? '⏳ Simulazione in corso...' : '🚀 Avvia Simulazione'}
          </Button>

          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-secondary/50 rounded-xl border border-border text-center">
                  <div className="text-xs text-muted-foreground">Totale Speso</div>
                  <div className="text-lg font-bold text-destructive">{formatCurrency(result.totalSpent)}</div>
                </div>
                <div className="p-3 bg-secondary/50 rounded-xl border border-border text-center">
                  <div className="text-xs text-muted-foreground">Totale Vinto</div>
                  <div className="text-lg font-bold text-accent">{formatCurrency(result.totalWon)}</div>
                </div>
              </div>

              <div
                className="p-3 rounded-xl border text-center"
                style={{
                  background: result.totalWon >= result.totalSpent ? 'hsl(145 60% 42% / 0.12)' : 'hsl(0 72% 51% / 0.12)',
                  borderColor: result.totalWon >= result.totalSpent ? 'hsl(145 60% 42% / 0.3)' : 'hsl(0 72% 51% / 0.3)',
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">Bilancio</div>
                    <div className="text-xl font-bold" style={{ color: result.totalWon >= result.totalSpent ? 'hsl(145 60% 65%)' : 'hsl(0 72% 65%)' }}>
                      {formatCurrency(result.totalWon - result.totalSpent)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Rendimento: {((result.totalWon / result.totalSpent) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/30 rounded-xl border border-border p-4">
                <h4 className="text-sm font-bold mb-3 text-foreground">Distribuzione Vincite</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 15% 20%)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(215 15% 55%)' }} />
                      <YAxis tick={{ fontSize: 10, fill: 'hsl(215 15% 55%)' }} />
                      <Tooltip contentStyle={{ background: 'hsl(225 20% 12%)', border: '1px solid hsl(225 15% 22%)', borderRadius: '8px', color: 'hsl(210 40% 95%)' }} />
                      <Bar dataKey="vincite" radius={[6, 6, 0, 0]}>
                        {chartData.map((_, index) => (
                          <Cell key={index} fill={barColors[index]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-secondary/30 rounded-xl border border-border p-4">
                <h4 className="text-sm font-bold mb-3 text-foreground">Dettaglio per Categoria</h4>
                <div className="space-y-1.5">
                  {WIN_CATEGORIES.map((cat) => {
                    const count = result.winsByCategory[cat.category];
                    const expectedRate = (count / (result.totalExtractions * filledColumns.length)) * 100;
                    return (
                      <div key={cat.category} className="flex justify-between items-center text-xs p-2 rounded-lg bg-background/30 border border-border/50">
                        <span className="font-semibold text-foreground">{cat.description}</span>
                        <span className="text-muted-foreground">
                          <strong className="text-foreground">{formatNumber(count)}</strong> vincite ({expectedRate.toFixed(4)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SimulazioneVeloce;
