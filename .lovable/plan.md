

## Audit Pre-Release: Analisi Completa

Ho esaminato ogni file del progetto, verificato le regole ufficiali sul sito superenalotto.it e identificato problemi in 7 aree. Ecco il piano dettagliato.

---

### 1. Errori di Correttezza nei Calcoli

**BUG CRITICO — Probabilita 5+1 calcolata in modo errato**

Nel file `superenalotto.ts`, la probabilita del "5+1" e calcolata come:
```
prob5 = C(6,5) * C(84,1) / C(90,6)    // = 504/622.614.630
prob = prob5 / 84                        // = 6/622.614.630
```
Questo produce `1 su 103.769.105`, che corrisponde al valore ufficiale. Il calcolo e corretto ma il ragionamento nel commento e fuorviante. Il risultato finale coincide con quello del sito ufficiale, quindi va bene.

**Verifica quote medie attese vs. sito ufficiale:**

| Categoria | Nostro valore | Sito ufficiale |
|-----------|--------------|----------------|
| 6         | €100.000.000 | Jackpot (variabile) |
| 5+1       | €500.000     | **€620.000** |
| 5         | €50.000      | **€32.000** |
| 4         | €300         | €300 |
| 3         | €25          | €25 |
| 2         | €5           | €5 |

**Le quote del 5+1 e del 5 sono errate e devono essere aggiornate ai valori ufficiali.** Questo impatta anche il valore atteso mostrato nel pannello Formule.

**Probabilita — tutte verificate e corrette rispetto al sito ufficiale.**

---

### 2. Errore nelle Regole (RegoleModal)

- Dice "tre volte a settimana: martedi, giovedi e sabato". Il sito ufficiale dice **4 volte a settimana: martedi, giovedi, venerdi e sabato**. Da correggere.
- Dice "fino a 8 colonne giocabili". Il simulatore ne ha 4. Allineare il testo alla realta del simulatore (4 colonne in 4 pannelli).

---

### 3. Costo Schedina — Errore nel Calcolo SuperStar

Nel file `Schedina.tsx` linea 262, il costo SuperStar viene calcolato come `€0,50` per colonna con SuperStar. Questo e **corretto** secondo il sito ufficiale (€0,50 aggiuntivi). Tuttavia, il costo base `TICKET_COST = 1` e corretto. Il calcolo del costo nella schedina sembra giusto.

---

### 4. Problemi di Performance e Ottimizzazione Cloudflare

- **`App.css`** — File residuo del template Vite con stili inutilizzati (`.logo`, `.card`, `.read-the-docs`). Da rimuovere.
- **`index.html`** — Meta tag con "Lovable Generated Project" e `@Lovable`. Da aggiornare con descrizione e autore corretti per il progetto. Lingua `lang="en"` da cambiare a `lang="it"`.
- **Simulazione Monte Carlo** — `runSimulation` blocca il main thread per grandi numeri. Per 100.000 estrazioni con 4 colonne, sono 400.000 iterazioni sincrone. Suggerimento: usare `setTimeout` chunking o Web Worker. Per ora il `setTimeout(..., 50)` in `SimulazioneVeloce` mitiga parzialmente.
- **`generateExtraction`** usa `Array.splice()` ripetutamente, che e O(n) per ogni estrazione. Per la simulazione Monte Carlo con 100k iterazioni, si potrebbe ottimizzare con Fisher-Yates shuffle.
- **Recharts** e una libreria pesante (~200KB). Per Cloudflare, considerare lazy loading dei componenti con grafici.

---

### 5. Sicurezza

- Nessuna vulnerabilita critica (app puramente client-side, no backend, no auth, no dati sensibili).
- `localStorage` usato solo per il disclaimer — accettabile.
- Link GitHub hardcoded — nessun rischio.
- **CSP/Headers**: per Cloudflare Pages, creare un file `public/_headers` con Content-Security-Policy base.

---

### 6. Accessibilita (a11y)

- **Pulsanti nella griglia numeri**: mancano `aria-label` per ogni numero (es. "Numero 42, selezionato").
- **Pulsanti sezione** (Probabilita, Formule, ecc.): mancano `aria-label`.
- **Contrasto colori**: i testi `text-[7px]` e `text-[9px]` sono troppo piccoli per WCAG AA. Minimo raccomandato: 11px.
- **Focus visibile**: i pulsanti della griglia non hanno stili focus visibili (`:focus-visible`).
- **SuperStar picker**: il popup non intrappola il focus (focus trap mancante).
- **Animazioni**: rispettare `prefers-reduced-motion` per le animazioni Framer Motion.

---

### 7. Bug e Problemi Minori

- **`PANEL_LABELS` in Schedina.tsx** (linee 17-21): array duplicato `['PANNELLO A', 'PANNELLO A', 'PANNELLO B', 'PANNELLO B', ...]` — 8 elementi con duplicati. Non viene usato direttamente, ma e codice morto confuso.
- **`checkMatches` restituisce sempre `columnIndex: 0`** — il valore viene sovrascritto in `Index.tsx`, ma il default e fuorviante.
- **Mancanza SuperStar nelle vincite**: il simulatore non implementa le 8 categorie SuperStar (0 Stella, 1 Stella, ecc.). Solo il match base viene verificato. Da documentare nel disclaimer come limitazione, oppure implementare.
- **`StatisticheDashboard` — calcolo cumulativo O(n^2)**: `history.slice(0, idx+1).reduce(...)` dentro un `.map()` — quadratico. Usare un accumulo incrementale.

---

### Piano di Implementazione

**File da modificare:**

1. **`src/lib/superenalotto.ts`**
   - Aggiornare `AVERAGE_PRIZES['5+1']` da 500.000 a 620.000
   - Aggiornare `AVERAGE_PRIZES['5']` da 50.000 a 32.000
   - Ottimizzare `generateExtraction` con Fisher-Yates shuffle
   - Fixare `checkMatches` per restituire il `columnIndex` corretto (parametro)

2. **`src/components/RegoleModal.tsx`**
   - Correggere "tre volte a settimana" in "quattro volte a settimana: martedi, giovedi, venerdi e sabato"
   - Correggere "fino a 8 colonne" in "fino a 4 colonne" (coerente con il simulatore)

3. **`src/components/Schedina.tsx`**
   - Rimuovere `PANEL_LABELS` inutilizzato
   - Aggiungere `aria-label` ai pulsanti
   - Aumentare dimensioni minime testo da 7px a 11px

4. **`src/components/SchedinaColumn.tsx`**
   - Aggiungere `aria-label` ai pulsanti numerici
   - Aggiungere `aria-pressed` per stato selezione
   - Aggiungere focus trap al SuperStar picker

5. **`src/components/StatisticheDashboard.tsx`**
   - Ottimizzare calcolo cumulativo da O(n^2) a O(n)

6. **`src/components/FormuleCombinatorie.tsx`**
   - Aggiornare valore atteso con i nuovi premi corretti

7. **`index.html`**
   - `lang="it"` invece di `lang="en"`
   - Aggiornare meta description e autore
   - Rimuovere riferimenti Lovable dalle meta

8. **`src/App.css`**
   - Svuotare o rimuovere (stili template inutilizzati)

9. **`public/_headers`** (nuovo)
   - Headers di sicurezza per Cloudflare Pages (X-Frame-Options, CSP, etc.)

10. **`src/components/Estrazione.tsx`**
    - Supporto `prefers-reduced-motion`

11. **`src/pages/Index.tsx`**
    - Lazy loading per componenti pesanti (Recharts)

