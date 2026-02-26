import React, { useState, useCallback, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Schedina from '@/components/Schedina';
import Estrazione from '@/components/Estrazione';
import ProbabilitaPanel from '@/components/ProbabilitaPanel';
import FormuleCombinatorie from '@/components/FormuleCombinatorie';
import SimulazioneVeloce from '@/components/SimulazioneVeloce';
import StatisticheDashboard, { type GameRecord } from '@/components/StatisticheDashboard';
import {
  type ColumnSelection,
  type ExtractionResult,
  generateExtraction,
  checkMatches,
  formatCurrency,
  AVERAGE_PRIZES,
} from '@/lib/superenalotto';

const INITIAL_COLUMNS: ColumnSelection[] = Array.from({ length: 8 }, () => ({ numbers: [] }));

const Index: React.FC = () => {
  const [columns, setColumns] = useState<ColumnSelection[]>(INITIAL_COLUMNS);
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [matchedByColumn, setMatchedByColumn] = useState<number[][]>([]);
  const [gameHistory, setGameHistory] = useState<GameRecord[]>([]);
  const [lastResults, setLastResults] = useState<string | null>(null);
  const gameIdRef = useRef(0);

  const handlePlay = useCallback(() => {
    const filledColumns = columns.filter((c) => c.numbers.length === 6);
    if (filledColumns.length === 0) return;

    setIsAnimating(true);
    setRevealedCount(0);
    setMatchedByColumn([]);
    setLastResults(null);

    const ext = generateExtraction();
    setExtraction(ext);

    // Animate revealing numbers one by one
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setRevealedCount(count);
      if (count >= 8) {
        clearInterval(interval);
        // Calculate matches after all revealed
        setTimeout(() => {
          const results = columns.map((col, idx) => {
            if (col.numbers.length !== 6) return { columnIndex: idx, matched: [], jollyMatch: false, superstarMatch: false, category: null, prize: 0 };
            const result = checkMatches(col, ext);
            return { ...result, columnIndex: idx };
          });

          const matched = columns.map((col) => {
            if (col.numbers.length !== 6) return [];
            return col.numbers.filter((n) => ext.numbers.includes(n));
          });
          setMatchedByColumn(matched);

          const totalWon = results.reduce((sum, r) => sum + r.prize, 0);
          const cost = filledColumns.length;

          // Build results summary
          const winMessages = results
            .filter((r) => r.category)
            .map((r) => `Colonna ${r.columnIndex + 1}: ${r.category} (${formatCurrency(r.prize)})`);
          
          setLastResults(
            winMessages.length > 0
              ? `🎉 ${winMessages.join(' | ')}`
              : '😔 Nessuna vincita questa volta.'
          );

          gameIdRef.current++;
          setGameHistory((prev) => [
            ...prev,
            {
              id: gameIdRef.current,
              extraction: ext,
              results: results as any,
              totalWon,
              cost,
            },
          ]);

          setIsAnimating(false);
        }, 500);
      }
    }, 400);
  }, [columns]);

  return (
    <div
      className="min-h-screen pb-8"
      style={{
        background: 'linear-gradient(180deg, #0d2240 0%, #1a3a6b 20%, #f5f0e1 20.1%)',
      }}
    >
      {/* Top bar */}
      <header className="text-center py-4 px-4">
        <h1
          className="text-3xl sm:text-4xl font-black tracking-widest"
          style={{
            color: '#ffd700',
            fontFamily: '"Arial Black", Impact, sans-serif',
            textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          SIMULATORE SUPERENALOTTO
        </h1>
        <p className="text-xs sm:text-sm mt-1" style={{ color: '#aac4e8' }}>
          Strumento didattico per lo studio della probabilità
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 space-y-4">
        {/* Schedina */}
        <Schedina
          columns={columns}
          onColumnsChange={setColumns}
          onPlay={handlePlay}
          matchedByColumn={matchedByColumn}
          disabled={isAnimating}
        />

        {/* Extraction display */}
        {extraction && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-amber-300 p-4">
            <Estrazione
              extraction={extraction}
              isAnimating={isAnimating}
              revealedCount={revealedCount}
            />
            {lastResults && (
              <div
                className="mt-3 text-center text-sm font-bold p-3 rounded-lg animate-fade-in"
                style={{
                  background: lastResults.includes('🎉')
                    ? 'linear-gradient(135deg, #d4edda, #c3e6cb)'
                    : 'linear-gradient(135deg, #fff3cd, #ffeeba)',
                  color: lastResults.includes('🎉') ? '#155724' : '#856404',
                }}
              >
                {lastResults}
              </div>
            )}
          </div>
        )}

        {/* Tabs for didactic content */}
        <Tabs defaultValue="probabilita" className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-blue-900/10">
            <TabsTrigger value="probabilita" className="text-xs sm:text-sm">
              📊 Probabilità
            </TabsTrigger>
            <TabsTrigger value="formule" className="text-xs sm:text-sm">
              📐 Formule
            </TabsTrigger>
            <TabsTrigger value="simulazione" className="text-xs sm:text-sm">
              ⚡ Simulazione
            </TabsTrigger>
            <TabsTrigger value="statistiche" className="text-xs sm:text-sm">
              📈 Statistiche
            </TabsTrigger>
          </TabsList>

          <TabsContent value="probabilita">
            <ProbabilitaPanel />
          </TabsContent>

          <TabsContent value="formule">
            <FormuleCombinatorie />
          </TabsContent>

          <TabsContent value="simulazione">
            <SimulazioneVeloce columns={columns} />
          </TabsContent>

          <TabsContent value="statistiche">
            <StatisticheDashboard history={gameHistory} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
