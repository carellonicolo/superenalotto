import React from 'react';
import { cn } from '@/lib/utils';

interface SchedinaColumnProps {
  columnIndex: number;
  selectedNumbers: number[];
  onToggleNumber: (num: number) => void;
  matchedNumbers?: number[];
  disabled?: boolean;
}

const SchedinaColumn: React.FC<SchedinaColumnProps> = ({
  columnIndex,
  selectedNumbers,
  onToggleNumber,
  matchedNumbers = [],
  disabled = false,
}) => {
  const isSelected = (n: number) => selectedNumbers.includes(n);
  const isMatched = (n: number) => matchedNumbers.includes(n);

  return (
    <div className="flex flex-col items-center">
      {/* Column header */}
      <div
        className="w-full text-center font-bold text-xs uppercase tracking-wider py-1 rounded-t-sm"
        style={{
          background: 'linear-gradient(180deg, #c41e2a 0%, #9a1520 100%)',
          color: '#fff',
          fontFamily: '"Arial Black", Arial, sans-serif',
          letterSpacing: '0.1em',
        }}
      >
        {columnIndex + 1}ª
      </div>

      {/* Number grid: 10 rows x 9 columns = 90 numbers */}
      <div
        className="grid gap-0 border border-gray-600"
        style={{
          gridTemplateColumns: 'repeat(9, 1fr)',
          background: '#fffde6',
        }}
      >
        {Array.from({ length: 90 }, (_, i) => i + 1).map((num) => {
          const selected = isSelected(num);
          const matched = isMatched(num);
          const cantSelect = !selected && selectedNumbers.length >= 6;

          return (
            <button
              key={num}
              disabled={disabled || cantSelect}
              onClick={() => onToggleNumber(num)}
              className={cn(
                'w-[22px] h-[20px] sm:w-[26px] sm:h-[22px] text-[9px] sm:text-[10px] font-bold border border-gray-300 transition-all duration-100 flex items-center justify-center',
                'hover:bg-yellow-200 focus:outline-none',
                selected && !matched && 'bg-red-600 text-white border-red-700',
                matched && 'bg-green-500 text-white border-green-700 animate-pulse',
                !selected && !matched && 'text-gray-800',
                cantSelect && !selected && 'opacity-40 cursor-not-allowed',
              )}
              style={{
                fontFamily: '"Arial Narrow", Arial, sans-serif',
              }}
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* Selection counter */}
      <div
        className="w-full text-center text-[10px] py-0.5 font-semibold"
        style={{
          background: selectedNumbers.length === 6 ? '#c41e2a' : '#f0e68c',
          color: selectedNumbers.length === 6 ? '#fff' : '#333',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {selectedNumbers.length}/6
      </div>
    </div>
  );
};

export default SchedinaColumn;
