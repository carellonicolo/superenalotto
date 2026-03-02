import React from 'react';
import SchedinaColumn from './SchedinaColumn';
import RegoleModal from './RegoleModal';
import { type ColumnSelection } from '@/lib/superenalotto';
import { Shuffle, Trash2, Play, Github } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import superenalottoLogo from '@/assets/superenalotto-logo.png';

interface SchedinaProps {
  columns: ColumnSelection[];
  onColumnsChange: (columns: ColumnSelection[]) => void;
  onPlay: () => void;
  matchedByColumn?: number[][];
  disabled?: boolean;
}



const Schedina: React.FC<SchedinaProps> = ({
  columns,
  onColumnsChange,
  onPlay,
  matchedByColumn = [],
  disabled = false
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
      const j = i + Math.floor(Math.random() * (90 - i));
      [pool[i], pool[j]] = [pool[j], pool[i]];
      nums.push(pool[i]);
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
        const j = i + Math.floor(Math.random() * (90 - i));
        [pool[i], pool[j]] = [pool[j], pool[i]];
        nums.push(pool[i]);
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
    const partialCols = columns.
    map((c, i) => ({ idx: i + 1, count: c.numbers.length })).
    filter((c) => c.count > 0 && c.count < 6);

    if (partialCols.length > 0) {
      const colNames = partialCols.map((c) => `Colonna ${c.idx} (${c.count}/6)`).join(', ');
      toast({
        variant: 'destructive',
        title: '⚠️ Pannello incompleto',
        description: `Devi selezionare esattamente 6 numeri per ogni colonna giocata. Incomplete: ${colNames}`
      });
      return;
    }

    if (!hasAnySelection) {
      toast({
        variant: 'destructive',
        title: '⚠️ Nessuna colonna compilata',
        description: 'Seleziona 6 numeri su almeno una colonna per giocare.'
      });
      return;
    }

    onPlay();
  };

  return (
    <div className="flex flex-col items-center gap-0">
      {/* === SCHEDINA CARD === */}
      <div
        className="w-full rounded-xl overflow-hidden"
        style={{
          boxShadow: '0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)'
        }}>
        
        {/* Header - Green bar with logo */}
        <div
          className="relative px-4 py-3"
          style={{
            background: 'linear-gradient(180deg, #4caf50 0%, #2e7d32 40%, #1b5e20 100%)'
          }}>
          
          {/* Logo row */}
          <div className="flex items-center justify-center">
            <img src={superenalottoLogo} alt="SuperEnalotto" className="h-10 sm:h-14" />
          </div>

          {/* Instructions text */}
          <div className="flex items-center justify-between mt-1">
            <div />
            <div
              style={{
                color: '#e8f5e9',
                fontSize: '11px',
                fontFamily: 'Arial, sans-serif',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
              
              SCEGLI ALMENO 6 NUMERI SU PRIMO O SU ENTRAMBI I PANNELLI ROSSI
            </div>
            <div className="flex items-center gap-2">
              <RegoleModal />
              <a

                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] sm:text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(180deg, #1a3a6b 0%, #0d2240 100%)',
                  color: '#ffd700',
                  border: '1px solid #2a5a9b',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }} href="https://github.com/carellonicolo/superenalotto">
                
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Schedina body - green background */}
        <div
          className="px-3 py-3"
          style={{
            background: 'linear-gradient(180deg, #a5d6a7 0%, #81c784 30%, #66bb6a 100%)'
          }}>
          
          {/* Panels: 2x2 grid */}
          <div className="grid grid-cols-2 gap-2">
            {columns.map((col, colIdx) => {
              const panelLetter = String.fromCharCode(65 + colIdx);

              return (
                <div key={colIdx} className="flex gap-1 items-start">
                  <div className="flex flex-col items-center justify-center gap-1 pt-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: '#1b5e20' }} />
                    
                  </div>

                  <div className="flex-1 flex flex-col gap-0.5">
                    <SchedinaColumn
                      columnIndex={colIdx}
                      panelLabel={`PANNELLO ${panelLetter}`}
                      selectedNumbers={col.numbers}
                      onToggleNumber={(num) => handleToggleNumber(colIdx, num)}
                      matchedNumbers={matchedByColumn[colIdx] || []}
                      disabled={disabled}
                      superstarSelected={col.superstar}
                      onToggleSuperstar={(num) => handleToggleSuperstar(colIdx, num)} />
                    
                    <div className="flex gap-0.5 justify-center">
                      <button
                        onClick={() => handleQuickPick(colIdx)}
                        disabled={disabled}
                        aria-label={`Selezione casuale colonna ${colIdx + 1}`}
                        className="text-[11px] px-1.5 py-0.5 rounded bg-white/60 hover:bg-white/90 disabled:opacity-40 flex items-center gap-0.5 focus-visible:ring-2 focus-visible:ring-primary"
                        title="Casuale">
                        
                        <Shuffle className="w-2.5 h-2.5" /> Auto
                      </button>
                      <button
                        onClick={() => handleClear(colIdx)}
                        disabled={disabled}
                        aria-label={`Cancella colonna ${colIdx + 1}`}
                        className="text-[11px] px-1.5 py-0.5 rounded bg-white/60 hover:bg-white/90 disabled:opacity-40 flex items-center gap-0.5 focus-visible:ring-2 focus-visible:ring-primary"
                        title="Cancella">
                        
                        <Trash2 className="w-2.5 h-2.5" /> ✕
                      </button>
                      <span className={`text-[11px] font-bold px-1 py-0.5 ${col.numbers.length === 6 ? 'text-destructive' : 'text-foreground'}`}>
                        {col.numbers.length}/6
                      </span>
                    </div>
                  </div>
                </div>);

            })}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="px-4 py-2 flex items-center justify-between bg-secondary border-t-2 border-border">
          <div className="flex gap-2">
            <button
              onClick={handleQuickPickAll}
              disabled={disabled}
              aria-label="Selezione casuale per tutte le colonne"
              className="text-[11px] px-2 py-1 rounded font-bold bg-green-700 text-white hover:bg-green-800 disabled:opacity-40 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary">
              <Shuffle className="w-3 h-3" /> Tutte Casuali
            </button>
            <button
              onClick={handleClearAll}
              disabled={disabled}
              aria-label="Cancella tutte le colonne"
              className="text-[11px] px-2 py-1 rounded font-bold bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-40 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary">
              <Trash2 className="w-3 h-3" /> Cancella
            </button>
          </div>

          <div className="text-xs font-bold text-foreground" style={{ fontFamily: 'Arial, sans-serif' }}>
            Colonne: <span className="text-destructive">{filledColumns}/4</span> ·
            Costo: <span className="text-destructive">€{(filledColumns + columns.filter((c) => c.numbers.length === 6 && c.superstar != null).length * 0.5).toFixed(2).replace('.', ',')}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className="text-destructive font-black" style={{ fontFamily: 'Arial, sans-serif' }}>✱</span>
            <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700 }}>Sisal</span>
          </div>
        </div>
      </div>

      {/* Play button below the schedina */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handlePlayWithValidation}
          disabled={disabled}
          className="px-10 py-3 rounded-xl font-black text-lg tracking-wider transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          style={{
            background: hasAnySelection ?
            'linear-gradient(180deg, #4caf50 0%, #2e7d32 50%, #1b5e20 100%)' :
            '#999',
            color: '#fff',
            fontFamily: '"Arial Black", Impact, sans-serif',
            textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
            boxShadow: hasAnySelection ?
            '0 4px 20px rgba(46, 125, 50, 0.5), inset 0 1px 0 rgba(255,255,255,0.3)' :
            'none',
            border: hasAnySelection ? '2px solid #1b5e20' : '2px solid #999'
          }}>
          
          <Play className="inline w-5 h-5 mr-2 -mt-0.5" />
          GIOCA
        </button>
      </div>
    </div>);

};

export default Schedina;