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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

const ProbabilitaPanel: React.FC = () => {
  const totalCombinations = binomial(90, 6);

  return (
    <Card className="border-2 border-amber-300 bg-amber-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg" style={{ color: '#1a3a6b' }}>
          <Info className="w-5 h-5" />
          Probabilità di Vincita
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Combinazioni totali: <strong>{formatNumber(totalCombinations)}</strong> (C(90,6))
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-900/10">
                <TableHead className="font-bold text-blue-900">Categoria</TableHead>
                <TableHead className="font-bold text-blue-900">Probabilità</TableHead>
                <TableHead className="font-bold text-blue-900">1 su...</TableHead>
                <TableHead className="font-bold text-blue-900">Premio Medio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {WIN_CATEGORIES.map((cat) => {
                const prob = calculateProbability(cat.category);
                return (
                  <TableRow key={cat.category}>
                    <TableCell className="font-bold">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-black text-white"
                        style={{
                          background:
                            cat.category === '6'
                              ? '#c41e2a'
                              : cat.category === '5+1'
                              ? '#ff6b00'
                              : '#1a3a6b',
                        }}
                      >
                        {cat.description}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {prob.probability.toExponential(4)}
                    </TableCell>
                    <TableCell className="font-bold text-red-700">
                      1 su {formatNumber(prob.oneIn)}
                    </TableCell>
                    <TableCell className="font-semibold text-green-700">
                      {formatCurrency(AVERAGE_PRIZES[cat.category])}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Visual comparison */}
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm font-bold text-red-800 mb-1">💡 Per capire meglio:</p>
          <ul className="text-xs text-red-700 space-y-1">
            <li>
              • Vincere il 6 è come indovinare una persona specifica tra tutti gli abitanti dell'Europa
            </li>
            <li>
              • Hai più probabilità di essere colpito da un fulmine (1 su 1.000.000) che di vincere il 6
            </li>
            <li>
              • Se giocassi 1 schedina al giorno, ci vorrebbero in media <strong>1.7 milioni di anni</strong> per fare 6
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProbabilitaPanel;
