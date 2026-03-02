import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ShieldCheck, AlertTriangle, Scale, BookOpen } from 'lucide-react';

const STORAGE_KEY = 'superenalotto-disclaimer-accepted';

const DisclaimerModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const wasAccepted = localStorage.getItem(STORAGE_KEY);
    if (!wasAccepted) setOpen(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-2xl w-[95vw] max-h-[90vh] p-0 gap-0 [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 pt-6 pb-3 border-b border-border">
          <div className="flex items-center justify-center gap-2 mb-1">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <DialogTitle className="text-xl font-bold">
              Avviso Legale e Disclaimer
            </DialogTitle>
          </div>
          <DialogDescription className="text-center text-muted-foreground text-xs">
            Si prega di leggere attentamente prima di procedere
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="px-6 py-4 max-h-[60vh]">
          <div className="space-y-5 text-sm text-foreground/90">
            {/* Finalità */}
            <section>
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2 text-primary">
                <BookOpen className="w-4 h-4" />
                Finalità dell'applicazione
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Questa applicazione è uno <strong className="text-foreground">strumento esclusivamente didattico e scientifico</strong>, 
                concepito per lo studio della teoria della probabilità e della combinatoria attraverso un caso d'uso concreto e reale. 
                Non ha <strong className="text-foreground">alcun intento ludopatico</strong>, non promuove né incentiva in alcun modo 
                la partecipazione al gioco del SuperEnalotto o a qualsiasi altra forma di gioco d'azzardo, e non ha 
                <strong className="text-foreground"> alcuna finalità pubblicitaria o commerciale</strong> nei confronti di operatori di gioco.
              </p>
            </section>

            {/* Assenza di gioco reale */}
            <section>
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2 text-primary">
                <AlertTriangle className="w-4 h-4" />
                Assenza di gioco reale
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Il simulatore <strong className="text-foreground">non prevede alcuna transazione economica reale</strong>. 
                Non è possibile puntare denaro, vincere premi o partecipare a estrazioni ufficiali. 
                Tutti i dati generati sono puramente casuali e simulati a scopo illustrativo. 
                L'applicazione non è collegata in alcun modo a Sisal S.p.A., all'Agenzia delle Dogane e dei Monopoli (ADM) 
                o a qualsiasi concessionario di gioco autorizzato.
              </p>
            </section>

            {/* Avvertenza AI */}
            <section className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4" />
                Avvertenza sui calcoli
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Questa applicazione è stata sviluppata con l'ausilio di <strong className="text-foreground">intelligenza artificiale generativa</strong>. 
                I procedimenti di calcolo, le formule matematiche e le simulazioni presentate 
                <strong className="text-foreground"> potrebbero contenere errori, imprecisioni o risultati non perfettamente fedeli alla realtà</strong>. 
                L'utente è invitato a verificare autonomamente i dati e a non considerarli come riferimento assoluto.
              </p>
            </section>

            {/* Riferimenti normativi */}
            <section>
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2 text-primary">
                <Scale className="w-4 h-4" />
                Riferimenti normativi
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="leading-relaxed">
                  <strong className="text-foreground">Art. 9, D.L. 87/2018 (Decreto Dignità)</strong> — Vieta la pubblicità del gioco d'azzardo 
                  ma prevede eccezioni per comunicazioni con finalità esclusivamente informativa, descrittiva e didattica. 
                  Il presente simulatore rientra in tale eccezione.
                </li>
                <li className="leading-relaxed">
                  <strong className="text-foreground">Art. 718 c.p.</strong> — Punisce l'esercizio del gioco d'azzardo. 
                  Il simulatore non configura tale reato in quanto non prevede denaro reale né è accessibile come luogo di gioco.
                </li>
                <li className="leading-relaxed">
                  <strong className="text-foreground">D.L. 158/2012 (Decreto Balduzzi)</strong> — Introduce l'obbligo di informazione 
                  sulle reali probabilità di vincita. Il simulatore adempie a tale finalità mostrando trasparentemente le probabilità.
                </li>
                <li className="leading-relaxed">
                  <strong className="text-foreground">Linee Guida AGCOM</strong> — Come chiarito dal TAR Lazio, non rientrano nel divieto 
                  le comunicazioni aventi esclusiva finalità descrittiva e informativa dell'offerta di gioco legale, 
                  funzionali a consentire una scelta di gioco consapevole.
                </li>
              </ul>
            </section>

            {/* Avvertenza ludopatia */}
            <section className="p-3 rounded-lg bg-accent/50 border border-border">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">⚠️ Il gioco d'azzardo può creare dipendenza.</strong> Se hai un problema di gioco 
                o conosci qualcuno che ne soffre, contatta il <strong className="text-foreground">Telefono Verde Nazionale: 800 558 822</strong> (gratuito, attivo dal lunedì al venerdì, 10:00–16:00). 
                Per maggiori informazioni: <strong>www.adm.gov.it</strong>.
              </p>
            </section>
          </div>
        </ScrollArea>

        {/* Acceptance */}
        <div className="px-6 py-4 border-t border-border space-y-3">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <Checkbox
              checked={accepted}
              onCheckedChange={(v) => setAccepted(v === true)}
              className="mt-0.5"
            />
            <span className="text-xs text-muted-foreground leading-relaxed">
              Dichiaro di aver letto e compreso il presente disclaimer. Confermo che utilizzerò 
              questa applicazione esclusivamente a scopo didattico e di studio della probabilità.
            </span>
          </label>
          <Button
            onClick={handleAccept}
            disabled={!accepted}
            className="w-full font-semibold"
          >
            Ho letto e accetto — Procedi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisclaimerModal;
