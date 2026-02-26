import React from 'react';
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
  const isSelected = (n: number) => selectedNumbers.includes(n);
  const isMatched = (n: number) => matchedNumbers.includes(n);

  // 6 rows x 15 columns = 90 numbers, like real ticket
  const rows = [
    Array.from({ length: 15 }, (_, i) => i + 1),      // 1-15
    Array.from({ length: 15 }, (_, i) => i + 16),     // 16-30
    Array.from({ length: 15 }, (_, i) => i + 31),     // 31-45
    Array.from({ length: 15 }, (_, i) => i + 46),     // 46-60
    Array.from({ length: 15 }, (_, i) => i + 61),     // 61-75
    Array.from({ length: 15 }, (_, i) => i + 76),     // 76-90
  ];

  return (
    <div className="flex">
      {/* Panel label on the left - vertical */}
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
                      'text-[8px] sm:text-[9px] lg:text-[10px] font-semibold leading-none',
                      selected && !matched && 'bg-red-600 text-white border-red-600',
                      matched && 'bg-green-500 text-white border-green-600 ring-1 ring-green-400',
                      !selected && !matched && 'text-gray-800 bg-white',
                      cantSelect && !selected && 'opacity-30 cursor-not-allowed',
                    )}
                    style={{
                      fontFamily: '"Arial Narrow", Arial, sans-serif',
                      minWidth: '14px',
                      minHeight: '13px',
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
        className="flex flex-col items-center justify-start px-0.5 py-0.5 rounded-r"
        style={{
          background: 'linear-gradient(180deg, #ffd700 0%, #f0c800 100%)',
          minWidth: '28px',
        }}
      >
        <div
          className="text-[6px] font-black text-center leading-tight mb-0.5"
          style={{
            color: '#c41e2a',
            fontFamily: '"Arial Black", Arial, sans-serif',
          }}
        >
          Super
          <br />
          Star
        </div>
        <div className="text-[5px] text-center text-red-700" style={{ lineHeight: 1 }}>
          ★
        </div>
      </div>
    </div>
  );
};

export default SchedinaColumn;
