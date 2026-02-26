import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen } from 'lucide-react';

const RegoleModal: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="text-[10px] sm:text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(180deg, #1a3a6b 0%, #0d2240 100%)',
            color: '#ffd700',
            border: '1px solid #2a5a9b',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Regole
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle
            className="text-xl font-black tracking-wide text-center"
            style={{ color: '#1a3a6b', fontFamily: '"Inter", system-ui, sans-serif' }}
          >
            📋 Regole del SuperEnalotto
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[65vh] pr-4">
          <div className="space-y-5 text-sm" style={{ fontFamily: '"Inter", system-ui, sans-serif' }}>
            {/* Come si gioca */}
            <section>
              <h3 className="font-bold text-base mb-2 flex items-center gap-2" style={{ color: '#c41e2a' }}>
                🎯 Come si gioca
              </h3>
              <ul className="space-y-1.5 text-gray-700 list-disc pl-5">
                <li>Scegli <strong>6 numeri</strong> da <strong>1 a 90</strong> su ciascuna colonna della schedina.</li>
                <li>Ogni schedina ha fino a <strong>8 colonne</strong> giocabili, organizzate in 4 pannelli (A, B, C, D).</li>
                <li>Il costo di ciascuna colonna è di <strong>€1,00</strong>.</li>
                <li>Puoi aggiungere l'opzione <strong>SuperStar</strong> al costo aggiuntivo di <strong>€0,50</strong> per colonna, scegliendo un numero da 1 a 90.</li>
              </ul>
            </section>

            {/* Estrazioni */}
            <section>
              <h3 className="font-bold text-base mb-2 flex items-center gap-2" style={{ color: '#c41e2a' }}>
                🎰 Le Estrazioni
              </h3>
              <ul className="space-y-1.5 text-gray-700 list-disc pl-5">
                <li>Le estrazioni del SuperEnalotto si svolgono <strong>tre volte a settimana</strong>: martedì, giovedì e sabato alle ore 20:00.</li>
                <li>Vengono estratti <strong>6 numeri</strong> principali da 1 a 90.</li>
                <li>Viene poi estratto il <strong>numero Jolly</strong> tra i restanti 84 numeri.</li>
                <li>Infine viene estratto il <strong>numero SuperStar</strong> (un numero da 1 a 90, estratto indipendentemente).</li>
              </ul>
            </section>

            {/* Categorie di vincita */}
            <section>
              <h3 className="font-bold text-base mb-2 flex items-center gap-2" style={{ color: '#c41e2a' }}>
                🏆 Categorie di Vincita
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr style={{ background: '#1a3a6b', color: '#fff' }}>
                      <th className="px-3 py-2 text-left rounded-tl-lg">Categoria</th>
                      <th className="px-3 py-2 text-left">Combinazione</th>
                      <th className="px-3 py-2 text-right rounded-tr-lg">Probabilità</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cat: '6 (Jackpot)', desc: '6 numeri indovinati', prob: '1 su 622.614.630' },
                      { cat: '5+1', desc: '5 numeri + Jolly', prob: '1 su 103.769.105' },
                      { cat: '5', desc: '5 numeri indovinati', prob: '1 su 1.250.230' },
                      { cat: '4', desc: '4 numeri indovinati', prob: '1 su 11.907' },
                      { cat: '3', desc: '3 numeri indovinati', prob: '1 su 327' },
                      { cat: '2', desc: '2 numeri indovinati', prob: '1 su 22' },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                        style={{ borderBottom: '1px solid #e5e7eb' }}
                      >
                        <td className="px-3 py-2 font-bold" style={{ color: '#1a3a6b' }}>{row.cat}</td>
                        <td className="px-3 py-2 text-gray-600">{row.desc}</td>
                        <td className="px-3 py-2 text-right font-mono text-gray-500">{row.prob}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Jackpot */}
            <section>
              <h3 className="font-bold text-base mb-2 flex items-center gap-2" style={{ color: '#c41e2a' }}>
                💰 Il Jackpot
              </h3>
              <ul className="space-y-1.5 text-gray-700 list-disc pl-5">
                <li>Il Jackpot parte da un minimo di <strong>€2.000.000</strong> e cresce ad ogni estrazione senza vincitori con "6".</li>
                <li>Il Jackpot viene assegnato a chi indovina tutti e <strong>6 i numeri estratti</strong>.</li>
                <li>Se nessuno indovina il "6", il montepremi viene accumulato per l'estrazione successiva.</li>
                <li>Il record storico del Jackpot SuperEnalotto è di <strong>€371.100.000</strong> (agosto 2023).</li>
              </ul>
            </section>

            {/* SuperStar */}
            <section>
              <h3 className="font-bold text-base mb-2 flex items-center gap-2" style={{ color: '#c41e2a' }}>
                ⭐ SuperStar
              </h3>
              <ul className="space-y-1.5 text-gray-700 list-disc pl-5">
                <li>Il SuperStar è un'opzione aggiuntiva che <strong>moltiplica le vincite</strong> delle categorie inferiori.</li>
                <li>Se il tuo numero SuperStar coincide con quello estratto, le vincite vengono aumentate.</li>
                <li>Con il SuperStar puoi vincere anche solo indovinando <strong>0 numeri + SuperStar</strong> (vincita di €5) oppure <strong>1 numero + SuperStar</strong> (vincita di €10).</li>
                <li>La vincita massima con 6+SuperStar è il Jackpot <strong>+ €2.000.000</strong>.</li>
              </ul>
            </section>

            {/* Montepremi */}
            <section>
              <h3 className="font-bold text-base mb-2 flex items-center gap-2" style={{ color: '#c41e2a' }}>
                📊 Distribuzione del Montepremi
              </h3>
              <ul className="space-y-1.5 text-gray-700 list-disc pl-5">
                <li>Il <strong>34,4%</strong> della raccolta va al montepremi.</li>
                <li>Il montepremi viene suddiviso tra le varie categorie di vincita in percentuali fisse.</li>
                <li>Se in una categoria non ci sono vincitori, la quota viene ripartita nelle categorie inferiori o accumulata.</li>
              </ul>
            </section>

            {/* Nota didattica */}
            <section
              className="p-3 rounded-lg"
              style={{ background: '#fff3cd', border: '1px solid #ffc107' }}
            >
              <p className="text-xs text-gray-700">
                <strong>⚠️ Nota didattica:</strong> Questo simulatore è creato esclusivamente a scopo educativo per lo studio della probabilità e della statistica.
                Il gioco d'azzardo può creare dipendenza. Il SuperEnalotto è gestito da <strong>Sisal S.p.A.</strong> su concessione dell'Agenzia delle Dogane e dei Monopoli.
                Gioca responsabilmente. Per informazioni: <strong>www.adm.gov.it</strong>.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RegoleModal;
