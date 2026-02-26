import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface SchedinaColumnProps {
  columnIndex: number;
  panelLabel: string;
  selectedNumbers: number[];
  onToggleNumber: (num: number) => void;
  matchedNumbers?: number[];
  disabled?: boolean;
  superstarSelected?: number | null;
  onToggleSuperstar?: (num: number) => void;
}

const SchedinaColumn: React.FC<SchedinaColumnProps> = ({
  columnIndex,
  panelLabel,
  selectedNumbers,
  onToggleNumber,
  matchedNumbers = [],
  disabled = false,
  superstarSelected = null,
  onToggleSuperstar,
}) => {
  const [showSuperstarPicker, setShowSuperstarPicker] = useState(false);
  const isSelected = (n: number) => selectedNumbers.includes(n);
  const isMatched = (n: number) => matchedNumbers.includes(n);

  // 6 rows x 15 columns = 90 numbers, like real ticket
  const rows = [
    Array.from({ length: 15 }, (_, i) => i + 1),
    Array.from({ length: 15 }, (_, i) => i + 16),
    Array.from({ length: 15 }, (_, i) => i + 31),
    Array.from({ length: 15 }, (_, i) => i + 46),
    Array.from({ length: 15 }, (_, i) => i + 61),
    Array.from({ length: 15 }, (_, i) => i + 76),
  ];

  const superstarRows = [
    Array.from({ length: 9 }, (_, i) => i + 1),
    Array.from({ length: 9 }, (_, i) => i + 10),
    Array.from({ length: 9 }, (_, i) => i + 19),
    Array.from({ length: 9 }, (_, i) => i + 28),
    Array.from({ length: 9 }, (_, i) => i + 37),
    Array.from({ length: 9 }, (_, i) => i + 46),
    Array.from({ length: 9 }, (_, i) => i + 55),
    Array.from({ length: 9 }, (_, i) => i + 64),
    Array.from({ length: 9 }, (_, i) => i + 73),
    Array.from({ length: 9 }, (_, i) => i + 82).filter(n => n <= 90),
  ];

  return (
    <div className="flex">
      {panelLabel ? (
        <div
          className="flex items-center justify-center px-0.5 rounded-l"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
            background: '#d42f2f',
            color: '#fff',
            fontFamily: '"Arial Black", Arial, sans-serif',
            fontSize: '8px',
            fontWeight: 900,
            letterSpacing: '0.15em',
            minWidth: '14px',
          }}
        >
          {panelLabel}
        </div>
      ) : null}

      {/* Number grid */}
      <div className="flex-1">
        <div
          className="border border-gray-400"
          style={{ background: '#fff' }}
        >
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex">
              {row.map((num) => {
                const selected = isSelected(num);
                const matched = isMatched(num);
                const cantSelect = !selected && selectedNumbers.length >= 6;

                return (
                  <button
                    key={num}
                    disabled={disabled || cantSelect}
                    onClick={() => onToggleNumber(num)}
                    className={cn(
                      'flex-1 aspect-square flex items-center justify-center border border-gray-200 transition-all duration-75',
                      'hover:bg-green-200 focus:outline-none',
                      'text-[9px] sm:text-[11px] lg:text-[12px] font-medium leading-none',
                      selected && !matched && 'bg-red-600 text-white border-red-600',
                      matched && 'bg-green-500 text-white border-green-600 ring-1 ring-green-400',
                      !selected && !matched && 'text-gray-800 bg-white',
                      cantSelect && !selected && 'opacity-30 cursor-not-allowed',
                    )}
                    style={{
                      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
                      minWidth: '16px',
                      minHeight: '15px',
                      padding: '1px',
                    }}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* SuperStar mini section */}
      <div
        className="relative flex flex-col items-center justify-start px-1 py-1 rounded-r cursor-pointer"
        style={{
          background: 'linear-gradient(180deg, #ffd700 0%, #f0c800 100%)',
          minWidth: '38px',
        }}
        onClick={() => !disabled && setShowSuperstarPicker(!showSuperstarPicker)}
      >
        <div
          className="text-[9px] font-black text-center leading-tight mb-1"
          style={{
            color: '#c41e2a',
            fontFamily: '"Arial Black", Arial, sans-serif',
          }}
        >
          Super
          <br />
          Star
        </div>
        <div className="text-sm text-center text-red-700" style={{ lineHeight: 1 }}>
          ★
        </div>
        {superstarSelected != null && (
          <div
            className="mt-1 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white"
            style={{
              background: 'linear-gradient(135deg, #ff4444, #8b0000)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
            }}
          >
            {superstarSelected}
          </div>
        )}
        {!superstarSelected && (
          <div className="mt-1 text-[7px] text-center font-bold" style={{ color: '#8b0000' }}>
            Scegli
          </div>
        )}

        {/* SuperStar picker popup */}
        {showSuperstarPicker && onToggleSuperstar && (
          <div
            className={cn(
              "absolute right-full mr-1 z-50 p-4 rounded-lg shadow-xl border-2 border-amber-400",
              columnIndex >= 2 ? "bottom-0" : "top-0"
            )}
            style={{
              background: 'linear-gradient(180deg, #fffde7 0%, #fff9c4 100%)',
              width: '360px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm font-black text-center mb-3" style={{ color: '#c41e2a' }}>
              ★ SUPERSTAR ★
            </div>
            <div className="space-y-1.5">
              {superstarRows.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-1.5 justify-center">
                  {row.map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        onToggleSuperstar(num);
                        setShowSuperstarPicker(false);
                      }}
                      className={cn(
                        'w-8 h-8 flex items-center justify-center text-xs font-bold rounded transition-all',
                        num === superstarSelected
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-white text-gray-700 hover:bg-amber-200 border border-gray-300',
                      )}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            {superstarSelected != null && (
              <button
                onClick={() => {
                  onToggleSuperstar(superstarSelected);
                  setShowSuperstarPicker(false);
                }}
                className="mt-1.5 w-full text-[9px] py-1 bg-gray-200 hover:bg-gray-300 rounded text-center font-bold"
              >
                Rimuovi ✕
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedinaColumn;
