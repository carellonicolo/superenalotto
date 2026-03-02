

## Valutazione Approfondita — Aree di Miglioramento

Ho analizzato ogni componente dell'app. Ecco cosa ho trovato, organizzato per priorità.

---

### 1. Bug e Problemi Funzionali

**SuperStar picker non si chiude cliccando fuori** — Il popup SuperStar in `SchedinaColumn.tsx` si apre/chiude solo cliccando sulla barra gialla. Non c'è un click-outside handler, quindi l'utente non ha un modo intuitivo per chiuderlo. Serve un listener `mousedown` esterno o un overlay trasparente.

**Costo SuperStar errato nel calcolo** — In `Schedina.tsx` riga 261, il costo SuperStar conta `columns.filter(c => c.superstar != null)` su tutte le 4 colonne, incluse quelle vuote. Se un utente seleziona SuperStar su una colonna vuota (0 numeri), il costo aumenta senza che la colonna sia giocabile. Il filtro dovrebbe considerare solo le colonne con 6 numeri selezionati.

**Jolly match count nel risultato** — In `checkMatches`, `jollyMatch` verifica se il Jolly è tra i numeri scelti dal giocatore. Ma se il giocatore ha già 5 numeri nei "main", il Jolly aggiuntivo potrebbe anche essere tra i numeri estratti principali (impossibile per regolamento). Il codice è corretto perché il Jolly è estratto dai restanti 84, ma il commento è fuorviante.

**`handleQuickPick` usa splice O(n)** — Nella schedina, la selezione casuale usa ancora `pool.splice()` (non aggiornato come `generateExtraction`). Minore ma incoerente.

---

### 2. UX e Esperienza Utente

**Nessun feedback sonoro/vibrazione** — L'estrazione animata non ha feedback tattile. Su mobile, una breve vibrazione (`navigator.vibrate(50)`) all'uscita di ogni pallina migliorerebbe l'esperienza.

**Manca un reset/nuova partita** — Dopo un'estrazione, non c'è un pulsante "Nuova Estrazione" o "Reset". L'utente deve ri-premere GIOCA, ma i risultati precedenti restano sovrapposti.

**SuperStar picker troppo largo** — Il popup è 360px, ma su mobile esce dallo schermo. Serve un posizionamento responsive o una modal su schermi piccoli.

**Manca la possibilità di rileggere il disclaimer** — Come già suggerito, un link nel footer per riaprire il disclaimer.

**Colori della tabella RegoleModal** — La tabella nelle regole usa `bg-gray-50` e `text-gray-700`, che sono colori light-mode hardcoded. Su un'app dark-theme, appaiono come blocchi bianchi. Dovrebbero usare le variabili CSS del tema.

**Testo "9px" residuo** — In `StatisticheDashboard.tsx` riga 146, c'è ancora `text-[9px]` sotto il WCAG minimum. Anche in `Schedina.tsx` riga 264, il testo del Sisal è `fontSize: '9px'`.

---

### 3. Performance e Ottimizzazione

**Simulazione Monte Carlo blocca il thread** — `runSimulation` con 100k estrazioni blocca il main thread per 1-3 secondi. Soluzione: usare un Web Worker o chunking con `requestIdleCallback`/`setTimeout`.

**Recharts non è lazy-loaded** — `SimulazioneVeloce` e `StatisticheDashboard` importano Recharts staticamente. Dato che sono dentro Dialog, il lazy loading è già parzialmente gestito dal tree-shaking, ma i moduli vengono comunque inclusi nel bundle principale. Wrappare con `React.lazy()`.

**`checkMatches` usa `Array.includes` O(n)** — Per la simulazione Monte Carlo (100k × 4 colonne × 6 numeri), convertire `extraction.numbers` in un `Set` darebbe un boost significativo.

**KaTeX CSS importato globalmente** — `katex/dist/katex.min.css` (25KB) viene caricato sempre, anche se l'utente non apre mai la modal Formule. Lazy-loadare il componente `FormuleCombinatorie`.

---

### 4. Sicurezza e Deploy Cloudflare

**CSP troppo restrittivo** — L'header `connect-src 'self'` bloccherà eventuali chiamate esterne future. Inoltre manca `worker-src` se implementeremo Web Workers. Da aggiungere `worker-src 'self' blob:`.

**Manca `X-DNS-Prefetch-Control`** — Header utile per Cloudflare.

**`_headers` manca newline finale** — Il file non ha una riga vuota alla fine, potrebbe causare problemi di parsing su Cloudflare Pages.

---

### 5. Accessibilità Residua

**SuperStar picker senza focus trap** — Quando il popup si apre, il focus non viene intrappolato. Un utente con tastiera può tabbare fuori dal picker.

**Jolly e SuperStar nell'estrazione mancano `prefers-reduced-motion`** — Solo i 6 numeri principali rispettano la preferenza; Jolly e SuperStar usano sempre l'animazione spring.

**`aria-live` per risultati** — Il messaggio di vittoria/sconfitta (`lastResults`) dovrebbe avere `aria-live="polite"` per essere annunciato dagli screen reader.

---

### 6. Miglioramenti di Contenuto

**Valore atteso calcolato dinamicamente** — Il testo "circa €0,30" è hardcoded. Dovrebbe essere calcolato dalla somma `P(cat) × Premio(cat)` e mostrato come valore preciso.

**Aggiungere numero verde anti-ludopatia nel footer** — `800 558 822` visibile in ogni pagina.

**Link al disclaimer nel footer** — Permettere di rileggere il disclaimer.

---

### Piano di Implementazione

| Priorità | Intervento | File |
|----------|-----------|------|
| Alta | Fix costo SuperStar (solo colonne complete) | `Schedina.tsx` |
| Alta | Fix colori hardcoded light-mode in RegoleModal | `RegoleModal.tsx` |
| Alta | Fix font 9px residui (WCAG) | `Schedina.tsx`, `StatisticheDashboard.tsx` |
| Alta | Click-outside per SuperStar picker | `SchedinaColumn.tsx` |
| Media | SuperStar picker responsive (modal su mobile) | `SchedinaColumn.tsx` |
| Media | `aria-live` per risultati estrazione | `Index.tsx` |
| Media | `prefers-reduced-motion` per Jolly/SuperStar | `Estrazione.tsx` |
| Media | Valore atteso calcolato dinamicamente | `FormuleCombinatorie.tsx` |
| Media | Ottimizza `checkMatches` con Set per simulazione | `superenalotto.ts` |
| Media | Footer con numero verde + link disclaimer | `Index.tsx` |
| Bassa | Fisher-Yates in `handleQuickPick` | `Schedina.tsx` |
| Bassa | Web Worker per simulazione pesante | `SimulazioneVeloce.tsx` + nuovo worker |
| Bassa | Lazy loading KaTeX/Recharts | `Index.tsx` |
| Bassa | Fix `_headers` newline + worker-src | `public/_headers` |

