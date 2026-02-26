import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { binomial, formatNumber } from '@/lib/superenalotto';
import { BookOpen } from 'lucide-react';

const FormuleCombinatorie: React.FC = () => {
  return (
    <Card className="border-2 border-blue-300 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg" style={{ color: '#1a3a6b' }}>
          <BookOpen className="w-5 h-5" />
          Formule del Calcolo Combinatorio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="p-4 bg-white rounded-lg border shadow-sm">
          <h3 className="font-bold text-sm mb-2" style={{ color: '#1a3a6b' }}>
            Coefficiente Binomiale
          </h3>
          <div
            className="text-center py-3 text-lg font-mono bg-gray-50 rounded border mb-2"
            style={{ fontFamily: '"Times New Roman", serif' }}
          >
            C(n, k) = n! / (k! × (n-k)!)
          </div>
          <p className="text-xs text-gray-600">
            Indica il numero di modi per scegliere <strong>k</strong> elementi da un insieme di{' '}
            <strong>n</strong> elementi, senza considerare l'ordine.
          </p>
        </div>

        <div className="p-4 bg-white rounded-lg border shadow-sm">
          <h3 className="font-bold text-sm mb-2" style={{ color: '#1a3a6b' }}>
            Combinazioni Totali nel SuperEnalotto
          </h3>
          <div className="text-center py-2 font-mono text-sm bg-yellow-50 rounded border mb-2">
            <div>C(90, 6) = 90! / (6! × 84!)</div>
            <div className="text-lg font-bold text-red-700 mt-1">
              = {formatNumber(binomial(90, 6))}
            </div>
          </div>
          <p className="text-xs text-gray-600">
            Ci sono oltre <strong>622 milioni</strong> di combinazioni possibili scegliendo 6 numeri da 90.
          </p>
        </div>

        <div className="p-4 bg-white rounded-lg border shadow-sm">
          <h3 className="font-bold text-sm mb-3" style={{ color: '#1a3a6b' }}>
            Probabilità per Categoria
          </h3>
          <div className="space-y-3 text-xs">
            <FormulaRow label="6 numeri" formula="C(6,6) × C(84,0) / C(90,6)" result={`1 / ${formatNumber(binomial(90, 6))}`} color="#c41e2a" />
            <FormulaRow label="5+1 (con Jolly)" formula="C(6,5) × C(84,1) / C(90,6) × 1/84" result={`6 / ${formatNumber(binomial(90, 6))}`} color="#ff6b00" />
            <FormulaRow label="5 numeri" formula="C(6,5) × C(84,1) / C(90,6)" result={`${formatNumber(binomial(6, 5) * binomial(84, 1))} / ${formatNumber(binomial(90, 6))}`} color="#1a3a6b" />
            <FormulaRow label="4 numeri" formula="C(6,4) × C(84,2) / C(90,6)" result={`${formatNumber(binomial(6, 4) * binomial(84, 2))} / ${formatNumber(binomial(90, 6))}`} color="#1a3a6b" />
            <FormulaRow label="3 numeri" formula="C(6,3) × C(84,3) / C(90,6)" result={`${formatNumber(binomial(6, 3) * binomial(84, 3))} / ${formatNumber(binomial(90, 6))}`} color="#1a3a6b" />
            <FormulaRow label="2 numeri" formula="C(6,2) × C(84,4) / C(90,6)" result={`${formatNumber(binomial(6, 2) * binomial(84, 4))} / ${formatNumber(binomial(90, 6))}`} color="#1a3a6b" />
          </div>
        </div>

        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-bold text-sm mb-2 text-red-800">⚠️ Valore Atteso di una Giocata</h3>
          <p className="text-xs text-red-700 mb-2">
            Il <strong>valore atteso</strong> è la somma dei prodotti tra probabilità e premio per ogni categoria. Se il valore atteso è inferiore al costo della giocata, il gioco è <strong>sfavorevole</strong> per il giocatore.
          </p>
          <div className="text-center font-mono text-sm bg-white rounded border py-2">
            E[V] = Σ P(categoria) × Premio(categoria)
          </div>
          <p className="text-xs text-red-800 font-bold mt-2 text-center">
            Il valore atteso è circa €0,35 per ogni €1,00 giocato.
            <br />
            <span className="text-red-600">Il banco trattiene mediamente il 65% delle giocate!</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const FormulaRow: React.FC<{ label: string; formula: string; result: string; color: string }> = ({ label, formula, result, color }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 p-2 bg-gray-50 rounded">
    <span className="font-bold text-white px-2 py-0.5 rounded text-[10px] self-start" style={{ background: color }}>{label}</span>
    <span className="font-mono text-gray-600 text-[11px]">{formula}</span>
    <span className="font-mono font-bold text-gray-900 text-[11px] sm:ml-auto">= {result}</span>
  </div>
);

export default FormuleCombinатorie;
