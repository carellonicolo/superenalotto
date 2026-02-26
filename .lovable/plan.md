
Obiettivo: forzare sempre la visualizzazione a 4 pannelli (A-D), anche con stato vecchio/hot-reload.

1) `src/pages/Index.tsx`
- Introdurre una costante unica: `const PANEL_COUNT = 4`.
- Aggiungere helper `normalizeColumns(cols)` che:
  - tiene solo i primi 4 elementi (`slice(0, PANEL_COUNT)`);
  - completa fino a 4 con colonne vuote (`{ numbers: [], superstar: null }`);
  - opzionale: ripulisce colonne invalide (numeri oltre 6).
- Inizializzare lo stato con `useState(() => normalizeColumns(INITIAL_COLUMNS))`.

2) `src/pages/Index.tsx`
- Sostituire il setter passato a `Schedina`:
  - da `onColumnsChange={setColumns}`
  - a `onColumnsChange={(next) => setColumns(normalizeColumns(next))}`
- Questo impedisce che qualsiasi update riporti 8 colonne.

3) `src/pages/Index.tsx`
- Prima di usare `columns` in `handlePlay`, creare `safeColumns = normalizeColumns(columns)` e usare `safeColumns` per:
  - `filledColumns`
  - calcolo risultati/match/costi
- Evita mismatch logici se lo stato era sporco.

4) `src/components/Schedina.tsx`
- Rimuovere codice morto `PANEL_LABELS` (non usato).
- Lasciare il rendering su `columns.map` (con 4 elementi già garantiti da `Index`).

5) Verifica funzionale (manuale)
- Ricarica pagina e conferma: solo pannelli A, B, C, D.
- Testa Auto/Tutte Casuali/Cancella/Gioca: il contatore resta `x/4`.
- Conferma che non compaiono mai E-F-G-H dopo refresh o nuove interazioni.

Sezione tecnica (sintesi)
- Root cause probabile: stato persistito in sessione/hot-reload, non il JSX corrente.
- Fix robusto: “normalizzazione centralizzata” in `Index` su init + ogni update + uso in logica gioco.
- Impatto: nessuna modifica UI invasiva; solo hardening dello stato.
