import React from 'react';
import SchedinaColumn from './SchedinaColumn';
import RegoleModal from './RegoleModal';
import { type ColumnSelection } from '@/lib/superenalotto';
import { Shuffle, Trash2, Play } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SchedinaProps {
  columns: ColumnSelection[];
  onColumnsChange: (columns: ColumnSelection[]) => void;
  onPlay: () => void;
  matchedByColumn?: number[][];
  disabled?: boolean;
}

const PANEL_LABELS = [
  'PANNELLO A', 'PANNELLO A',
  'PANNELLO B', 'PANNELLO B',
  'PANNELLO C', 'PANNELLO C',
  'PANNELLO D', 'PANNELLO D',
];

const Schedina: React.FC<SchedinaProps> = ({
  columns,
  onColumnsChange,
  onPlay,
  matchedByColumn = [],
  disabled = false,
}) => {
  const handleToggleNumber = (colIdx: number, num: number) => {
    const newColumns = [...columns];
    const col = { ...newColumns[colIdx] };
    if (col.numbers.includes(num)) {
      col.numbers = col.numbers.filter((n) => n !== num);
    } else if (col.numbers.length < 6) {
      col.numbers = [...col.numbers, num].sort((a, b) => a - b);
    }
    newColumns[colIdx] = col;
    onColumnsChange(newColumns);
  };

  const handleToggleSuperstar = (colIdx: number, num: number) => {
    const newColumns = [...columns];
    const col = { ...newColumns[colIdx] };
    col.superstar = col.superstar === num ? null : num;
    newColumns[colIdx] = col;
    onColumnsChange(newColumns);
  };

  const handleQuickPick = (colIdx: number) => {
    const nums: number[] = [];
    const pool = Array.from({ length: 90 }, (_, i) => i + 1);
    for (let i = 0; i < 6; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      nums.push(pool[idx]);
      pool.splice(idx, 1);
    }
    const newColumns = [...columns];
    newColumns[colIdx] = { numbers: nums.sort((a, b) => a - b), superstar: columns[colIdx].superstar };
    onColumnsChange(newColumns);
  };

  const handleClear = (colIdx: number) => {
    const newColumns = [...columns];
    newColumns[colIdx] = { numbers: [], superstar: null };
    onColumnsChange(newColumns);
  };

  const handleQuickPickAll = () => {
    const newColumns = columns.map(() => {
      const nums: number[] = [];
      const pool = Array.from({ length: 90 }, (_, i) => i + 1);
      for (let i = 0; i < 6; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        nums.push(pool[idx]);
        pool.splice(idx, 1);
      }
      return { numbers: nums.sort((a, b) => a - b), superstar: null };
    });
    onColumnsChange(newColumns);
  };

  const handleClearAll = () => {
    onColumnsChange(columns.map(() => ({ numbers: [], superstar: null })));
  };

  const hasAnySelection = columns.some((c) => c.numbers.length === 6);
  const hasPartial = columns.some((c) => c.numbers.length > 0 && c.numbers.length < 6);
  const filledColumns = columns.filter((c) => c.numbers.length === 6).length;

  const handlePlayWithValidation = () => {
    const partialCols = columns
      .map((c, i) => ({ idx: i + 1, count: c.numbers.length }))
      .filter((c) => c.count > 0 && c.count < 6);

    if (partialCols.length > 0) {
      const colNames = partialCols.map((c) => `Colonna ${c.idx} (${c.count}/6)`).join(', ');
      toast({
        variant: 'destructive',
        title: '⚠️ Pannello incompleto',
        description: `Devi selezionare esattamente 6 numeri per ogni colonna giocata. Incomplete: ${colNames}`,
      });
      return;
    }

    if (!hasAnySelection) {
      toast({
        variant: 'destructive',
        title: '⚠️ Nessuna colonna compilata',
        description: 'Seleziona 6 numeri su almeno una colonna per giocare.',
      });
      return;
    }

    onPlay();
  };

  return (
    <div className="flex flex-col items-center gap-0">
      {/* === SCHEDINA CARD === */}
      <div
        className="w-full max-w-5xl rounded-xl overflow-hidden"
        style={{
          boxShadow: '0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header - Green bar with logo */}
        <div
          className="relative px-4 py-3"
          style={{
            background: 'linear-gradient(180deg, #4caf50 0%, #2e7d32 40%, #1b5e20 100%)',
          }}
        >
          {/* Logo row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: '#a5d6a7', fontFamily: 'Arial, sans-serif' }}
              >
                NUOVO
              </span>
            </div>
            <div className="flex items-center">
              {/* SuperEnalotto logo text */}
              <span
                style={{
                  fontFamily: '"Georgia", "Times New Roman", serif',
                  fontStyle: 'italic',
                  fontWeight: 700,
                  fontSize: 'clamp(20px, 4vw, 32px)',
                  color: '#fff',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                <span style={{ color: '#c41e2a', fontWeight: 900 }}>S</span>
                <span style={{ color: '#fff' }}>uper</span>
                <span style={{ color: '#1a237e', fontWeight: 900 }}>Enalotto</span>
              </span>
            </div>

            {/* SuperStar badge */}
            <div
              className="px-3 py-1 rounded-md flex items-center gap-1"
              style={{
                background: 'linear-gradient(180deg, #fff9c4, #fdd835)',
                border: '2px solid #f9a825',
              }}
            >
              <span
                style={{
                  fontFamily: '"Georgia", serif',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  fontSize: 'clamp(10px, 2vw, 16px)',
                  color: '#333',
                  letterSpacing: '-0.02em',
                }}
              >
                <span style={{ color: '#c41e2a' }}>S</span>uper
                <span style={{ color: '#c41e2a' }}>S</span>tar
              </span>
              <span style={{ color: '#c41e2a', fontSize: '14px' }}>★</span>
            </div>
          </div>

          {/* Instructions text */}
          <div className="flex items-center justify-between mt-1">
            <div />
            <div
              style={{
                color: '#e8f5e9',
                fontSize: '7px',
                fontFamily: 'Arial, sans-serif',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              SCEGLI ALMENO 6 NUMERI SU PRIMO O SU ENTRAMBI I PANNELLI ROSSI
            </div>
            <RegoleModal />
          </div>
        </div>

        {/* Schedina body - green background */}
        <div
          className="px-3 py-3"
          style={{
            background: 'linear-gradient(180deg, #a5d6a7 0%, #81c784 30%, #66bb6a 100%)',
          }}
        >
          {/* Panels: 4 rows, 2 columns each */}
          <div className="space-y-2">
            {[0, 1, 2, 3].map((panelIdx) => {
              const col1Idx = panelIdx * 2;
              const col2Idx = panelIdx * 2 + 1;
              const panelLetter = String.fromCharCode(65 + panelIdx); // A, B, C, D

              return (
                <div key={panelIdx} className="flex gap-1 items-start">
                  {/* Dot marker */}
                  <div className="flex flex-col items-center justify-center gap-1 pt-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: '#1b5e20' }}
                    />
                  </div>

                  {/* Two columns side by side */}
                  <div className="flex-1 grid grid-cols-2 gap-1">
                    {/* Column 1 */}
                    <div className="flex flex-col gap-0.5">
                      <SchedinaColumn
                        columnIndex={col1Idx}
                        panelLabel={`PANNELLO ${panelLetter}`}
                        selectedNumbers={columns[col1Idx].numbers}
                        onToggleNumber={(num) => handleToggleNumber(col1Idx, num)}
                        matchedNumbers={matchedByColumn[col1Idx] || []}
                        disabled={disabled}
                        superstarSelected={columns[col1Idx].superstar}
                        onToggleSuperstar={(num) => handleToggleSuperstar(col1Idx, num)}
                      />
                      {/* Quick actions under each column */}
                      <div className="flex gap-0.5 justify-center">
                        <button
                          onClick={() => handleQuickPick(col1Idx)}
                          disabled={disabled}
                          className="text-[7px] px-1 py-0.5 rounded bg-white/60 hover:bg-white/90 disabled:opacity-40 flex items-center gap-0.5"
                          title="Casuale"
                        >
                          <Shuffle className="w-2 h-2" /> Auto
                        </button>
                        <button
                          onClick={() => handleClear(col1Idx)}
                          disabled={disabled}
                          className="text-[7px] px-1 py-0.5 rounded bg-white/60 hover:bg-white/90 disabled:opacity-40 flex items-center gap-0.5"
                          title="Cancella"
                        >
                          <Trash2 className="w-2 h-2" /> ✕
                        </button>
                        <span className="text-[7px] font-bold px-1 py-0.5" style={{ color: columns[col1Idx].numbers.length === 6 ? '#c41e2a' : '#333' }}>
                          {columns[col1Idx].numbers.length}/6
                        </span>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col gap-0.5">
                      <SchedinaColumn
                        columnIndex={col2Idx}
                        panelLabel=""
                        selectedNumbers={columns[col2Idx].numbers}
                        onToggleNumber={(num) => handleToggleNumber(col2Idx, num)}
                        matchedNumbers={matchedByColumn[col2Idx] || []}
                        disabled={disabled}
                        superstarSelected={columns[col2Idx].superstar}
                        onToggleSuperstar={(num) => handleToggleSuperstar(col2Idx, num)}
                      />
                      <div className="flex gap-0.5 justify-center">
                        <button
                          onClick={() => handleQuickPick(col2Idx)}
                          disabled={disabled}
                          className="text-[7px] px-1 py-0.5 rounded bg-white/60 hover:bg-white/90 disabled:opacity-40 flex items-center gap-0.5"
                        >
                          <Shuffle className="w-2 h-2" /> Auto
                        </button>
                        <button
                          onClick={() => handleClear(col2Idx)}
                          disabled={disabled}
                          className="text-[7px] px-1 py-0.5 rounded bg-white/60 hover:bg-white/90 disabled:opacity-40 flex items-center gap-0.5"
                        >
                          <Trash2 className="w-2 h-2" /> ✕
                        </button>
                        <span className="text-[7px] font-bold px-1 py-0.5" style={{ color: columns[col2Idx].numbers.length === 6 ? '#c41e2a' : '#333' }}>
                          {columns[col2Idx].numbers.length}/6
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - concorso number area (decorative) */}
                  <div
                    className="flex flex-col items-center justify-start pt-1"
                    style={{ minWidth: '24px' }}
                  >
                    <div
                      className="text-[6px] font-bold text-center border border-gray-400 bg-white/80 px-1 py-0.5 rounded-sm"
                      style={{ color: '#333', fontFamily: 'Arial, sans-serif' }}
                    >
                      {panelLetter}{panelIdx + 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="px-4 py-2 flex items-center justify-between"
          style={{
            background: 'linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%)',
            borderTop: '2px solid #bbb',
          }}
        >
          <div className="flex gap-2">
            <button
              onClick={handleQuickPickAll}
              disabled={disabled}
              className="text-[9px] px-2 py-1 rounded font-bold bg-green-700 text-white hover:bg-green-800 disabled:opacity-40 flex items-center gap-1"
            >
              <Shuffle className="w-3 h-3" /> Tutte Casuali
            </button>
            <button
              onClick={handleClearAll}
              disabled={disabled}
              className="text-[9px] px-2 py-1 rounded font-bold bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-40 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Cancella
            </button>
          </div>

          <div className="text-xs font-bold" style={{ color: '#333', fontFamily: 'Arial, sans-serif' }}>
            Colonne: <span style={{ color: '#c41e2a' }}>{filledColumns}/8</span> ·
            Costo: <span style={{ color: '#c41e2a' }}>€{filledColumns + columns.filter(c => c.superstar != null).length * 0.5},00</span>
          </div>

          <div className="flex items-center gap-1" style={{ color: '#999', fontSize: '9px' }}>
            <span style={{ color: '#c41e2a', fontWeight: 900, fontFamily: 'Arial, sans-serif', fontSize: '11px' }}>✱</span>
            <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700 }}>Sisal</span>
          </div>
        </div>
      </div>

      {/* Play button below the schedina */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={onPlay}
          disabled={disabled || !hasAnySelection}
          className="px-10 py-3 rounded-xl font-black text-lg tracking-wider transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          style={{
            background: hasAnySelection
              ? 'linear-gradient(180deg, #4caf50 0%, #2e7d32 50%, #1b5e20 100%)'
              : '#999',
            color: '#fff',
            fontFamily: '"Arial Black", Impact, sans-serif',
            textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
            boxShadow: hasAnySelection
              ? '0 4px 20px rgba(46, 125, 50, 0.5), inset 0 1px 0 rgba(255,255,255,0.3)'
              : 'none',
            border: hasAnySelection ? '2px solid #1b5e20' : '2px solid #999',
          }}
        >
          <Play className="inline w-5 h-5 mr-2 -mt-0.5" />
          GIOCA
        </button>
      </div>
    </div>
  );
};

export default Schedina;
