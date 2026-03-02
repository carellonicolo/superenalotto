# 🏗️ Architettura del Progetto

Questo documento descrive l'architettura software del SuperEnalotto Simulator, le scelte progettuali e il flusso dati tra i componenti.

---

## 📋 Indice

- [Panoramica](#panoramica)
- [Diagramma dei Componenti](#-diagramma-dei-componenti)
- [Flusso Dati](#-flusso-dati)
- [Modulo Core: superenalotto.ts](#-modulo-core-superenalottots)
- [Componenti React](#-componenti-react)
- [Design System](#-design-system)
- [Scelte Architetturali](#-scelte-architetturali)

---

## Panoramica

L'applicazione è una **Single Page Application (SPA)** costruita con React e organizzata secondo un'architettura a componenti. Non utilizza state management globale (Redux, Zustand, ecc.): tutto lo stato è gestito localmente nel componente principale `Index.tsx` e passato ai figli via props.

Questa scelta è intenzionale: l'applicazione ha un singolo flusso di dati relativamente semplice, e l'uso di hooks nativi (useState, useCallback) è sufficiente per gestire la complessità senza overhead aggiuntivo.

---

## 🗂️ Diagramma dei Componenti

```
App.tsx (Router)
└── Index.tsx (Pagina Principale — State Owner)
    ├── Schedina
    │   └── SchedinaColumn × N (1-8 colonne)
    ├── Estrazione (risultati dell'estrazione)
    ├── ProbabilitaPanel (tabella probabilità)
    ├── FormuleCombinatorie (formule matematiche)
    ├── SimulazioneVeloce (simulazione Monte Carlo)
    ├── StatisticheDashboard (grafici e statistiche)
    └── RegoleModal (modale regole del gioco)
```

### Gerarchia di Responsabilità

| Componente | Responsabilità |
|---|---|
| `App.tsx` | Routing (react-router-dom) |
| `Index.tsx` | Orchestrazione, stato globale, logica di gioco |
| `Schedina` | Gestione colonne e delegazione a SchedinaColumn |
| `SchedinaColumn` | Selezione numeri singola colonna, UI griglia |
| `Estrazione` | Visualizzazione animata risultati |
| `ProbabilitaPanel` | Display probabilità (stateless, dati calcolati) |
| `FormuleCombinatorie` | Display formule (stateless, puramente presentazionale) |
| `SimulazioneVeloce` | UI simulazione + invocazione `runSimulation()` |
| `StatisticheDashboard` | Aggregazione e visualizzazione storico giocate |
| `RegoleModal` | Contenuto statico regole del gioco |

---

## 🔄 Flusso Dati

```
┌─────────────────────────────────────────────┐
│                 Index.tsx                     │
│                                              │
│  State:                                      │
│  ├── columns: ColumnSelection[]              │
│  ├── extraction: ExtractionResult | null     │
│  ├── results: MatchResult[]                  │
│  ├── history: GameRecord[]                   │
│  └── activeTab: string                       │
│                                              │
│  Actions:                                    │
│  ├── handlePlay() → generateExtraction()     │
│  │                → checkMatches()           │
│  │                → update history           │
│  ├── handleColumnsChange()                   │
│  └── handleSimulation()                      │
└──────────┬───────────────────────────────────┘
           │ Props ↓
    ┌──────┴──────┐
    │             │
┌───▼───┐  ┌─────▼─────┐
│Schedina│  │Estrazione │
│       │  │           │
│ cols  │  │extraction │
│onChange│  │results    │
└───┬───┘  └───────────┘
    │
    ▼
┌──────────────┐
│SchedinaColumn│ × N
│              │
│ numbers[]    │
│ superstar    │
│ onChange()   │
└──────────────┘
```

### Ciclo di Gioco

1. L'utente seleziona i numeri nelle colonne della `Schedina`
2. Ogni modifica risale a `Index.tsx` via callback `onChange`
3. L'utente preme "Gioca" → `Index.tsx` chiama `generateExtraction()`
4. I risultati vengono calcolati con `checkMatches()` per ogni colonna
5. `extraction` e `results` vengono passati a `Estrazione` per la visualizzazione
6. Il record viene aggiunto a `history` per `StatisticheDashboard`

---

## 🧮 Modulo Core: `superenalotto.ts`

Questo è il cuore logico dell'applicazione. È un modulo **puro** (nessuna dipendenza React) che esporta funzioni e tipi.

### Tipi Principali

```typescript
interface ColumnSelection {
  numbers: number[];      // 6 numeri da 1-90
  superstar?: number;     // SuperStar opzionale 1-90
}

interface ExtractionResult {
  numbers: number[];      // 6 numeri estratti
  jolly: number;          // Numero Jolly
  superstar: number;      // Numero SuperStar
}

interface MatchResult {
  columnIndex: number;
  matched: number[];      // Numeri indovinati
  jollyMatch: boolean;
  superstarMatch: boolean;
  category: WinCategory | null;  // '6' | '5+1' | '5' | '4' | '3' | '2'
  prize: number;
}
```

### Funzioni Chiave

#### `binomial(n, k): number`
Calcola il coefficiente binomiale C(n,k) con un approccio iterativo numericamente stabile (evita overflow con fattoriali grandi):

```typescript
let result = 1;
for (let i = 0; i < k; i++) {
  result = result * (n - i) / (i + 1);
}
```

#### `calculateProbability(category): { probability, oneIn }`
Calcola la probabilità esatta per ogni categoria di vincita usando il rapporto tra casi favorevoli e casi totali C(90,6).

#### `generateExtraction(): ExtractionResult`
Genera un'estrazione casuale estraendo numeri senza reinserimento da un pool di 90 numeri, poi seleziona il Jolly dal pool rimanente.

#### `runSimulation(columns, numExtractions): SimulationResult`
Esegue N estrazioni consecutive, verificando le corrispondenze per tutte le colonne ad ogni iterazione. Aggrega i risultati per categoria e calcola il bilancio economico.

---

## 🎨 Design System

### Filosofia Visiva

Il design si articola su **due livelli estetici** distinti e intenzionali:

1. **Schedina "classica"**: replica deliberatamente l'estetica della schedina reale del SuperEnalotto (sfondo rosa, griglia numerica tradizionale, font classici) per creare un collegamento emotivo e visivo immediato con il gioco reale.

2. **Interfaccia moderna**: tutto il resto dell'applicazione utilizza un design system scuro e sofisticato con effetti glassmorphism, gradienti, e tipografia contemporanea.

### Variabili CSS (Design Tokens)

Il sistema si basa su variabili CSS HSL definite in `index.css`:

```css
:root {
  --background: 225 25% 8%;       /* Sfondo principale scuro */
  --foreground: 210 40% 95%;      /* Testo principale chiaro */
  --primary: 45 100% 51%;         /* Oro — accento principale */
  --secondary: 225 15% 15%;       /* Superfici elevate */
  --accent: 145 60% 42%;          /* Verde — vincite, successo */
  --destructive: 0 72% 51%;       /* Rosso — perdite, errori */
  --muted: 225 15% 18%;           /* Elementi secondari */
  --border: 225 15% 22%;          /* Bordi */
}
```

### Glassmorphism

La classe `.glass-card` implementa l'effetto glassmorphism:

```css
.glass-card {
  background: hsl(225 20% 12% / 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid hsl(225 15% 25% / 0.5);
  border-radius: 1rem;
}
```

### Tipografia

- **Space Grotesk** — Font principale per UI, titoli e testo
- **JetBrains Mono** — Font monospace per formule, numeri e dati tecnici

---

## 🏛️ Scelte Architetturali

### Perché nessun state manager globale?

L'applicazione ha un singolo contesto di stato (la partita in corso) gestito da `Index.tsx`. Non ci sono flussi asincroni complessi, autenticazione, o dati condivisi tra route diverse. L'uso di useState + props drilling è la soluzione più semplice e performante per questa scala.

### Perché logica separata in `superenalotto.ts`?

Separare la logica di gioco dai componenti React offre:
- **Testabilità**: le funzioni pure possono essere testate unitariamente senza rendering
- **Riutilizzabilità**: la logica potrebbe essere usata in altri contesti (CLI, API, ecc.)
- **Leggibilità**: chiara separazione tra "cosa calcolare" e "come visualizzare"

### Perché simulazione sincrona?

La simulazione Monte Carlo è eseguita in modo sincrono nel main thread. Per il range di simulazioni supportato (fino a 10M), le performance sono accettabili sui browser moderni. Per simulazioni più grandi, si potrebbe migrare a un Web Worker.

### Perché Tailwind + shadcn/ui?

- **Tailwind**: styling rapido e coerente con design tokens, eliminazione del CSS morto in produzione
- **shadcn/ui**: componenti accessibili (Radix UI) con pieno controllo sullo stile, nessun vendor lock-in (i componenti sono copiati nel progetto, non importati da un pacchetto)

### Approccio al Vibe Coding

Questo progetto è stato sviluppato con tecniche di vibe coding, dove agenti AI hanno assistito nella generazione e iterazione del codice. Questo approccio ha permesso:
- Prototipazione rapida dell'intera applicazione
- Iterazione veloce su design e UX
- Implementazione corretta delle formule matematiche con verifica continua
- Documentazione integrata nel flusso di sviluppo

La revisione umana ha garantito la correttezza matematica, la coerenza architetturale e la qualità complessiva del codice.

---

## 📐 Per Approfondire

- [Documentazione Matematica](MATH.md) — Teoria probabilistica e formule dettagliate
- [README principale](../README.md) — Panoramica del progetto
- [Guida ai Contributi](../CONTRIBUTING.md) — Come contribuire al codice

---

<p align="center">
  <sub>Architettura documentata con cura, come i numeri sulla schedina. 🎲</sub>
</p>
