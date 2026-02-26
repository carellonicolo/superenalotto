import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    // Use setTimeout to allow UI to update
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

  const barColors = ['#c41e2a', '#ff6b00', '#e6a817', '#1a3a6b', '#2d8f3c', '#6c3483'];

  const sliderIndex = EXTRACTION_OPTIONS.indexOf(numExtractions);

  return (
    <Card className="border-2 border-purple-300 bg-purple-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg" style={{ color: '#1a3a6b' }}>
          <Zap className="w-5 h-5" />
          Simulazione Veloce
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {filledColumns.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Compila almeno una colonna nella schedina per avviare la simulazione.
          </p>
        ) : (
          <>
            {/* Controls */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Numero di estrazioni:{' '}
                <span className="text-red-700 font-bold">{formatNumber(numExtractions)}</span>
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
                <strong>{formatCurrency(numExtractions * filledColumns.length)}</strong>
              </p>
            </div>

            <Button
              onClick={handleRun}
              disabled={isRunning}
              className="w-full font-bold"
              style={{
                background: 'linear-gradient(180deg, #1a3a6b, #0d2240)',
                color: '#ffd700',
              }}
            >
              {isRunning ? '⏳ Simulazione in corso...' : '🚀 Avvia Simulazione'}
            </Button>

            {/* Results */}
            {result && (
              <div className="space-y-4 animate-fade-in">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-lg border text-center">
                    <div className="text-xs text-muted-foreground">Totale Speso</div>
                    <div className="text-lg font-bold text-red-700">
                      {formatCurrency(result.totalSpent)}
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border text-center">
                    <div className="text-xs text-muted-foreground">Totale Vinto</div>
                    <div className="text-lg font-bold text-green-700">
                      {formatCurrency(result.totalWon)}
                    </div>
                  </div>
                </div>

                {/* Balance */}
                <div
                  className="p-3 rounded-lg border text-center"
                  style={{
                    background:
                      result.totalWon >= result.totalSpent
                        ? 'linear-gradient(135deg, #d4edda, #c3e6cb)'
                        : 'linear-gradient(135deg, #f8d7da, #f5c6cb)',
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-700" />
                    <div>
                      <div className="text-xs font-semibold">Bilancio</div>
                      <div
                        className="text-xl font-black"
                        style={{
                          color: result.totalWon >= result.totalSpent ? '#155724' : '#721c24',
                        }}
                      >
                        {formatCurrency(result.totalWon - result.totalSpent)}
                      </div>
                      <div className="text-[10px]">
                        Rendimento:{' '}
                        {((result.totalWon / result.totalSpent) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Win distribution chart */}
                <div className="bg-white rounded-lg border p-3">
                  <h4 className="text-sm font-bold mb-2" style={{ color: '#1a3a6b' }}>
                    Distribuzione Vincite
                  </h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="vincite" radius={[4, 4, 0, 0]}>
                          {chartData.map((_, index) => (
                            <Cell key={index} fill={barColors[index]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detail table */}
                <div className="bg-white rounded-lg border p-3">
                  <h4 className="text-sm font-bold mb-2" style={{ color: '#1a3a6b' }}>
                    Dettaglio per Categoria
                  </h4>
                  <div className="space-y-1">
                    {WIN_CATEGORIES.map((cat) => {
                      const count = result.winsByCategory[cat.category];
                      const expectedRate =
                        (count / (result.totalExtractions * filledColumns.length)) * 100;
                      return (
                        <div
                          key={cat.category}
                          className="flex justify-between items-center text-xs p-1.5 rounded bg-gray-50"
                        >
                          <span className="font-semibold">{cat.description}</span>
                          <span>
                            <strong>{formatNumber(count)}</strong> vincite (
                            {expectedRate.toFixed(4)}%)
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
      </CardContent>
    </Card>
  );
};

export default SimulazioneVeloce;
