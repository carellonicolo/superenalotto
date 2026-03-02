import React from 'react';
import {
  WIN_CATEGORIES,
  calculateProbability,
  formatNumber,
  AVERAGE_PRIZES,
  formatCurrency,
  binomial,
} from '@/lib/superenalotto';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Info } from 'lucide-react';

const ProbabilitaPanel: React.FC = () => {
  const totalCombinations = binomial(90, 6);

  return (
    <div className="glass-card p-5 sm:p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Info className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Probabilità di Vincita</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Combinazioni totali: <strong className="text-foreground">{formatNumber(totalCombinations)}</strong> (C(90,6))
      </p>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 border-border">
              <TableHead className="font-semibold text-foreground">Categoria</TableHead>
              <TableHead className="font-semibold text-foreground">Probabilità</TableHead>
              <TableHead className="font-semibold text-foreground">1 su...</TableHead>
              <TableHead className="font-semibold text-foreground">Premio Medio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {WIN_CATEGORIES.map((cat) => {
              const prob = calculateProbability(cat.category);
              return (
                <TableRow key={cat.category} className="border-border hover:bg-secondary/30">
                  <TableCell>
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{
                        background: cat.category === '6' ? 'hsl(0 72% 51%)' : cat.category === '5+1' ? 'hsl(30 90% 50%)' : 'hsl(225 50% 35%)',
                        color: 'white',
                      }}
                    >
                      {cat.description}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {prob.probability.toExponential(4)}
                  </TableCell>
                  <TableCell className="font-bold text-destructive">
                    1 su {formatNumber(prob.oneIn)}
                  </TableCell>
                  <TableCell className="font-semibold text-accent">
                    {formatCurrency(AVERAGE_PRIZES[cat.category])}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
        <p className="text-sm font-bold text-destructive mb-2">💡 Per capire meglio:</p>
        <ul className="text-xs text-foreground/70 space-y-1.5">
          <li>• Vincere il 6 è come indovinare una persona specifica tra tutti gli abitanti dell'Europa</li>
          <li>• Hai più probabilità di essere colpito da un fulmine (1 su 1.000.000) che di vincere il 6</li>
          <li>• Se giocassi 1 schedina al giorno, ci vorrebbero in media <strong>1.7 milioni di anni</strong> per fare 6</li>
        </ul>
      </div>
    </div>
  );
};

export default ProbabilitaPanel;
