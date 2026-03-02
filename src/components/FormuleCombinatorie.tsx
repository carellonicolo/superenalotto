import React, { useEffect, useRef } from 'react';
import { binomial, formatNumber } from '@/lib/superenalotto';
import { BookOpen } from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const KaTeX: React.FC<{ math: string; display?: boolean; className?: string }> = ({ math, display = false, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(math, ref.current, {
        displayMode: display,
        throwOnError: false,
        output: 'html',
      });
    }
  }, [math, display]);
  return <div ref={ref} className={className} />;
};

const FormuleCombinatorie: React.FC = () => {
  return (
    <div className="glass-card p-5 sm:p-6 space-y-5">
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Formule del Calcolo Combinatorio</h2>
      </div>

      <div className="p-4 rounded-xl bg-secondary/50 border border-border">
        <h3 className="font-bold text-sm mb-2 text-foreground">Coefficiente Binomiale</h3>
        <div className="text-center py-3 bg-background/50 rounded-lg border border-border mb-2">
          <KaTeX math="\binom{n}{k} = \frac{n!}{k! \cdot (n-k)!}" display className="text-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">
          Indica il numero di modi per scegliere <strong className="text-foreground">k</strong> elementi da un insieme di <strong className="text-foreground">n</strong> elementi, senza considerare l'ordine.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-secondary/50 border border-border">
        <h3 className="font-bold text-sm mb-2 text-foreground">Combinazioni Totali nel SuperEnalotto</h3>
        <div className="text-center py-3 bg-primary/10 rounded-lg border border-primary/20 mb-2 space-y-1">
          <KaTeX math="\binom{90}{6} = \frac{90!}{6! \cdot 84!}" display className="text-muted-foreground" />
          <KaTeX math={`= ${formatNumber(binomial(90, 6))}`} display className="text-primary font-bold" />
        </div>
        <p className="text-xs text-muted-foreground">
          Ci sono oltre <strong className="text-foreground">622 milioni</strong> di combinazioni possibili scegliendo 6 numeri da 90.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-secondary/50 border border-border">
        <h3 className="font-bold text-sm mb-3 text-foreground">Probabilità per Categoria</h3>
        <div className="space-y-2 text-xs">
          <FormulaRow
            label="6 numeri"
            formula="\frac{\binom{6}{6} \cdot \binom{84}{0}}{\binom{90}{6}}"
            result={`\\frac{1}{${formatNumber(binomial(90, 6))}}`}
            color="hsl(0 72% 51%)"
          />
          <FormulaRow
            label="5+1 (Jolly)"
            formula="\frac{\binom{6}{5} \cdot 1}{\binom{90}{6}}"
            result={`\\frac{6}{${formatNumber(binomial(90, 6))}}`}
            color="hsl(30 90% 50%)"
          />
          <FormulaRow
            label="5 numeri"
            formula="\frac{\binom{6}{5} \cdot \binom{84}{1}}{\binom{90}{6}}"
            result={`\\frac{${formatNumber(binomial(6, 5) * binomial(84, 1))}}{${formatNumber(binomial(90, 6))}}`}
            color="hsl(225 50% 35%)"
          />
          <FormulaRow
            label="4 numeri"
            formula="\frac{\binom{6}{4} \cdot \binom{84}{2}}{\binom{90}{6}}"
            result={`\\frac{${formatNumber(binomial(6, 4) * binomial(84, 2))}}{${formatNumber(binomial(90, 6))}}`}
            color="hsl(225 50% 35%)"
          />
          <FormulaRow
            label="3 numeri"
            formula="\frac{\binom{6}{3} \cdot \binom{84}{3}}{\binom{90}{6}}"
            result={`\\frac{${formatNumber(binomial(6, 3) * binomial(84, 3))}}{${formatNumber(binomial(90, 6))}}`}
            color="hsl(225 50% 35%)"
          />
          <FormulaRow
            label="2 numeri"
            formula="\frac{\binom{6}{2} \cdot \binom{84}{4}}{\binom{90}{6}}"
            result={`\\frac{${formatNumber(binomial(6, 2) * binomial(84, 4))}}{${formatNumber(binomial(90, 6))}}`}
            color="hsl(225 50% 35%)"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
        <h3 className="font-bold text-sm mb-2 text-destructive">⚠️ Valore Atteso di una Giocata</h3>
        <p className="text-xs text-foreground/70 mb-2">
          Il <strong>valore atteso</strong> è la somma dei prodotti tra probabilità e premio per ogni categoria. Se il valore atteso è inferiore al costo della giocata, il gioco è <strong>sfavorevole</strong> per il giocatore.
        </p>
        <div className="text-center py-3 bg-background/50 rounded-lg border border-border">
          <KaTeX math="E[V] = \sum_{i} P(\text{cat}_i) \cdot \text{Premio}(\text{cat}_i)" display className="text-foreground" />
        </div>
        <p className="text-xs text-destructive font-bold mt-2 text-center">
          Il valore atteso è circa €0,35 per ogni €1,00 giocato.
          <br />
          <span className="opacity-80">Il banco trattiene mediamente il 65% delle giocate!</span>
        </p>
      </div>
    </div>
  );
};

const FormulaRow: React.FC<{ label: string; formula: string; result: string; color: string }> = ({ label, formula, result, color }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-2.5 bg-background/30 rounded-lg border border-border/50">
    <span className="font-bold text-white px-2.5 py-1 rounded-lg text-[10px] self-start shrink-0" style={{ background: color }}>{label}</span>
    <KaTeX math={formula} className="text-muted-foreground [&_.katex]:text-[11px]" />
    <div className="sm:ml-auto shrink-0">
      <KaTeX math={`= ${result}`} className="text-foreground font-bold [&_.katex]:text-[11px]" />
    </div>
  </div>
);

export default FormuleCombinatorie;
