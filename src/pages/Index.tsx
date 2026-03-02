import React, { useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Schedina from '@/components/Schedina';
import Estrazione from '@/components/Estrazione';
import ProbabilitaPanel from '@/components/ProbabilitaPanel';
import FormuleCombinatorie from '@/components/FormuleCombinatorie';
import SimulazioneVeloce from '@/components/SimulazioneVeloce';
import StatisticheDashboard, { type GameRecord } from '@/components/StatisticheDashboard';
import DisclaimerModal from '@/components/DisclaimerModal';
import {
  type ColumnSelection,
  type ExtractionResult,
  generateExtraction,
  checkMatches,
  formatCurrency,
  AVERAGE_PRIZES,
} from '@/lib/superenalotto';

const PANEL_COUNT = 4;
const EMPTY_COL = (): ColumnSelection => ({ numbers: [], superstar: null as number | null });
const normalizeColumns = (cols: ColumnSelection[]): ColumnSelection[] => {
  const safe: ColumnSelection[] = cols.slice(0, PANEL_COUNT).map(c => ({
    numbers: (c.numbers || []).slice(0, 6),
    superstar: c.superstar ?? null,
  } as ColumnSelection));
  while (safe.length < PANEL_COUNT) safe.push(EMPTY_COL());
  return safe;
};

const Index: React.FC = () => {
  const [columns, setColumns] = useState<ColumnSelection[]>(() => normalizeColumns(Array.from({ length: PANEL_COUNT }, EMPTY_COL)));
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [matchedByColumn, setMatchedByColumn] = useState<number[][]>([]);
  const [gameHistory, setGameHistory] = useState<GameRecord[]>([]);
  const [lastResults, setLastResults] = useState<string | null>(null);
  const gameIdRef = useRef(0);

  const handlePlay = useCallback(() => {
    const safeColumns = normalizeColumns(columns);
    const filledColumns = safeColumns.filter((c) => c.numbers.length === 6);
    if (filledColumns.length === 0) return;

    setIsAnimating(true);
    setRevealedCount(0);
    setMatchedByColumn([]);
    setLastResults(null);

    const ext = generateExtraction();
    setExtraction(ext);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setRevealedCount(count);
      if (count >= 8) {
        clearInterval(interval);
        setTimeout(() => {
          const results = safeColumns.map((col, idx) => {
            if (col.numbers.length !== 6) return { columnIndex: idx, matched: [], jollyMatch: false, superstarMatch: false, category: null, prize: 0 };
            return checkMatches(col, ext, idx);
          });

          const matched = safeColumns.map((col) => {
            if (col.numbers.length !== 6) return [];
            return col.numbers.filter((n) => ext.numbers.includes(n));
          });
          setMatchedByColumn(matched);

          const totalWon = results.reduce((sum, r) => sum + r.prize, 0);
          const cost = filledColumns.length;

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
    <main className="min-h-screen pb-12 relative overflow-hidden">
      <DisclaimerModal />
      {/* Background */}
      <div className="fixed inset-0 -z-10" style={{
        background: 'radial-gradient(ellipse at 50% 0%, hsl(225 30% 15%) 0%, hsl(225 25% 8%) 70%)',
      }} />
      <div className="fixed inset-0 -z-10 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 20% 80%, hsl(45 100% 51% / 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(145 60% 42% / 0.06) 0%, transparent 50%)',
      }} />

      {/* Header */}
      <header className="text-center pt-8 pb-6 px-4">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-primary" style={{
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
        }}>
          SIMULATORE
          <span className="block text-lg sm:text-2xl font-medium tracking-widest text-foreground/60 mt-1">
            SUPERENALOTTO
          </span>
        </h1>
        <p className="text-sm mt-3 text-muted-foreground max-w-md mx-auto">
          Strumento didattico per lo studio della probabilità
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 space-y-6">
        {/* Schedina */}
        <Schedina
          columns={columns}
          onColumnsChange={(next) => setColumns(normalizeColumns(next))}
          onPlay={handlePlay}
          matchedByColumn={matchedByColumn}
          disabled={isAnimating}
        />

        {/* Extraction display */}
        {extraction && (
          <div className="glass-card glow-gold p-5">
            <Estrazione
              extraction={extraction}
              isAnimating={isAnimating}
              revealedCount={revealedCount}
            />
            {lastResults && (
              <div
                className="mt-4 text-center text-sm font-semibold p-3 rounded-xl"
                style={{
                  background: lastResults.includes('🎉')
                    ? 'hsl(145 60% 42% / 0.15)'
                    : 'hsl(45 100% 51% / 0.12)',
                  color: lastResults.includes('🎉')
                    ? 'hsl(145 60% 65%)'
                    : 'hsl(45 80% 65%)',
                  border: `1px solid ${lastResults.includes('🎉') ? 'hsl(145 60% 42% / 0.3)' : 'hsl(45 100% 51% / 0.2)'}`,
                }}
              >
                {lastResults}
              </div>
            )}
          </div>
        )}

        {/* Section Buttons */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { icon: '📊', label: 'Probabilità', content: <ProbabilitaPanel /> },
            { icon: '📐', label: 'Formule', content: <FormuleCombinatorie /> },
            { icon: '⚡', label: 'Simulazione', content: <SimulazioneVeloce columns={columns} /> },
            { icon: '📈', label: 'Statistiche', content: <StatisticheDashboard history={gameHistory} /> },
          ].map((item) => (
            <Dialog key={item.label}>
              <DialogTrigger asChild>
                <button className="text-xs sm:text-sm py-2.5 px-3 rounded-xl font-medium bg-secondary/50 backdrop-blur-sm border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:shadow-lg transition-all flex items-center justify-center gap-1.5">
                  {item.icon} {item.label}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0">
                <DialogHeader className="px-6 pt-6 pb-2">
                  <DialogTitle className="text-lg font-bold">
                    {item.icon} {item.label}
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="px-6 pb-6 max-h-[75vh]">
                  {item.content}
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-12 pb-6 text-xs text-muted-foreground/50">
        Simulatore a scopo didattico · Non è un sito di gioco d'azzardo
      </footer>
    </main>
  );
};

export default Index;
