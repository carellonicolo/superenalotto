import React, { useState } from 'react';
import SchedinaColumn from './SchedinaColumn';
import { type ColumnSelection } from '@/lib/superenalotto';
import { Button } from '@/components/ui/button';
import { Shuffle, Trash2, Play } from 'lucide-react';

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

  const handleQuickPick = (colIdx: number) => {
    const nums: number[] = [];
    const pool = Array.from({ length: 90 }, (_, i) => i + 1);
    for (let i = 0; i < 6; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      nums.push(pool[idx]);
      pool.splice(idx, 1);
    }
    const newColumns = [...columns];
    newColumns[colIdx] = { numbers: nums.sort((a, b) => a - b) };
    onColumnsChange(newColumns);
  };

  const handleClear = (colIdx: number) => {
    const newColumns = [...columns];
    newColumns[colIdx] = { numbers: [] };
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
      return { numbers: nums.sort((a, b) => a - b) };
    });
    onColumnsChange(newColumns);
  };

  const handleClearAll = () => {
    onColumnsChange(columns.map(() => ({ numbers: [] })));
  };

  const hasAnySelection = columns.some((c) => c.numbers.length === 6);
  const filledColumns = columns.filter((c) => c.numbers.length === 6).length;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Schedina header */}
      <div
        className="w-full max-w-5xl rounded-t-lg px-4 py-3 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a3a6b 0%, #0d2240 100%)',
        }}
      >
        <div className="flex items-center justify-center gap-3">
          <div
            className="text-2xl sm:text-3xl font-black tracking-widest"
            style={{
              color: '#ffd700',
              fontFamily: '"Arial Black", Impact, sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            SUPER
          </div>
          <div
            className="text-2xl sm:text-3xl font-black tracking-widest"
            style={{
              color: '#ff0000',
              fontFamily: '"Arial Black", Impact, sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            ENALOTTO
          </div>
        </div>
        <div
          className="text-[10px] tracking-[0.3em] mt-1"
          style={{ color: '#aac4e8', fontFamily: 'Arial, sans-serif' }}
        >
          SIMULATORE DIDATTICO
        </div>

        {/* Stars decoration */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-400 opacity-30 text-lg"
            style={{
              top: `${10 + Math.random() * 60}%`,
              left: `${5 + i * 16}%`,
            }}
          >
            ★
          </div>
        ))}
      </div>

      {/* Schedina body */}
      <div
        className="w-full max-w-5xl rounded-b-lg p-3 sm:p-4 border-2"
        style={{
          background: 'linear-gradient(180deg, #fff8dc 0%, #f5e6a3 50%, #e8d48b 100%)',
          borderColor: '#b8960c',
        }}
      >
        {/* Global actions */}
        <div className="flex gap-2 mb-3 justify-center flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={handleQuickPickAll}
            disabled={disabled}
            className="text-xs border-amber-700 text-amber-800 hover:bg-amber-100"
          >
            <Shuffle className="w-3 h-3 mr-1" /> Tutte Casuali
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleClearAll}
            disabled={disabled}
            className="text-xs border-amber-700 text-amber-800 hover:bg-amber-100"
          >
            <Trash2 className="w-3 h-3 mr-1" /> Cancella Tutto
          </Button>
        </div>

        {/* Columns grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
          {columns.map((col, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <SchedinaColumn
                columnIndex={idx}
                selectedNumbers={col.numbers}
                onToggleNumber={(num) => handleToggleNumber(idx, num)}
                matchedNumbers={matchedByColumn[idx] || []}
                disabled={disabled}
              />
              <div className="flex gap-0.5 justify-center">
                <button
                  onClick={() => handleQuickPick(idx)}
                  disabled={disabled}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-40"
                  title="Casuale"
                >
                  <Shuffle className="w-2.5 h-2.5" />
                </button>
                <button
                  onClick={() => handleClear(idx)}
                  disabled={disabled}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-40"
                  title="Cancella"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cost indicator */}
        <div
          className="mt-3 text-center text-sm font-bold"
          style={{ color: '#5a4800', fontFamily: 'Arial, sans-serif' }}
        >
          Colonne giocate: {filledColumns}/8 · Costo:{' '}
          <span className="text-red-700">€{filledColumns},00</span>
        </div>

        {/* Play button */}
        <div className="mt-3 flex justify-center">
          <button
            onClick={onPlay}
            disabled={disabled || !hasAnySelection}
            className="px-8 py-3 rounded-lg font-black text-lg tracking-wider transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            style={{
              background: hasAnySelection
                ? 'linear-gradient(180deg, #ff4444 0%, #c41e2a 50%, #8b0000 100%)'
                : '#999',
              color: '#fff',
              fontFamily: '"Arial Black", Impact, sans-serif',
              textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
              boxShadow: hasAnySelection
                ? '0 4px 15px rgba(196, 30, 42, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                : 'none',
            }}
          >
            <Play className="inline w-5 h-5 mr-2 -mt-0.5" />
            GIOCA
          </button>
        </div>
      </div>
    </div>
  );
};

export default Schedina;
