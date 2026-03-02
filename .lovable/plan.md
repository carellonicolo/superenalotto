

## Piano: Disclaimer Legale con Modal in Apertura

### Ricerca Normativa Effettuata

Ho analizzato il quadro normativo italiano rilevante. Ecco i riferimenti chiave che giustificano la pubblicazione di questo tipo di applicazione:

1. **Art. 9 del D.L. 87/2018 (Decreto Dignita)** -- Vieta la pubblicita del gioco d'azzardo, ma prevede eccezioni per comunicazioni con finalita esclusivamente informativa, descrittiva e didattica. Il simulatore non promuove il gioco ne contiene link a piattaforme di gioco reali.

2. **Linee Guida AGCOM sul divieto di pubblicita del gioco d'azzardo** -- Il TAR Lazio ha chiarito che non rientrano nel divieto le "comunicazioni aventi esclusiva finalita descrittiva, informativa e identificativa dell'offerta di gioco legale, funzionali a consentire una scelta di gioco consapevole" e i "servizi informativi di comparazione". Il simulatore rientra nella categoria di strumento educativo.

3. **Art. 718 c.p.** -- Punisce l'esercizio del gioco d'azzardo. Requisiti: denaro reale in gioco + luogo pubblico. Il simulatore non prevede denaro reale, quindi non configura il reato.

4. **D.L. 158/2012 (Decreto Balduzzi)** -- Introduce l'obbligo di informazione sulle probabilita di vincita. Il simulatore fa esattamente questo: mostra le probabilita reali, disincentivando il gioco.

### Implementazione

Creo un nuovo componente `DisclaimerModal` che si apre automaticamente al primo accesso. L'accettazione viene salvata in `localStorage` per non ripresentarlo. Il disclaimer conterra:

- Finalita esclusivamente didattica e scientifica
- Nessuna promozione del gioco d'azzardo
- Nessuna transazione economica reale
- Avvertenza che i calcoli, generati con AI, possono contenere errori
- Riferimenti normativi (Decreto Dignita, Art. 718 c.p., Decreto Balduzzi, Linee Guida AGCOM)
- Pulsante "Ho letto e accetto" per procedere

### File da creare/modificare

- **Nuovo**: `src/components/DisclaimerModal.tsx` -- Modal con Dialog di shadcn/ui, testo legale strutturato in sezioni, checkbox di accettazione, persistenza via localStorage
- **Modifica**: `src/pages/Index.tsx` -- Importare e renderizzare il DisclaimerModal

