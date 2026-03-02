<p align="center">
  <img src="src/assets/superenalotto-logo.png" alt="SuperEnalotto Simulator" width="120" />
</p>

<h1 align="center">🎰 SuperEnalotto Simulator</h1>

<p align="center">
  <strong>Simulatore interattivo del SuperEnalotto con calcolo combinatorio e analisi probabilistica</strong>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" /></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Framer_Motion-12-FF0055?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Recharts-2.15-22B5BF?style=flat-square" alt="Recharts" /></a>
  <a href="#"><img src="https://img.shields.io/badge/shadcn/ui-latest-000000?style=flat-square" alt="shadcn/ui" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License MIT" /></a>
</p>

<p align="center">
  <a href="https://superenalottosimulator.lovable.app">🌐 Live Demo</a> ·
  <a href="docs/MATH.md">📐 Documentazione Matematica</a> ·
  <a href="docs/ARCHITECTURE.md">🏗️ Architettura</a> ·
  <a href="CONTRIBUTING.md">🤝 Contribuisci</a>
</p>

---

## 📖 Descrizione

**SuperEnalotto Simulator** è un'applicazione web didattica che simula fedelmente il gioco del SuperEnalotto italiano. Il suo scopo principale è **educativo**: dimostrare attraverso la pratica e la visualizzazione interattiva quanto sia statisticamente improbabile vincere alla lotteria, applicando concetti di calcolo combinatorio, teoria della probabilità e simulazione Monte Carlo.

> ⚠️ **Disclaimer**: Questa applicazione è realizzata esclusivamente a scopo didattico e dimostrativo. Non incentiva il gioco d'azzardo. Al contrario, mira a mostrare matematicamente perché il gioco è statisticamente sfavorevole per il giocatore.

### 🧠 Filosofia del Progetto

Il SuperEnalotto offre un caso di studio perfetto per il calcolo combinatorio: scegliere 6 numeri da 90 genera **C(90, 6) = 622.614.630** combinazioni possibili. Questo simulatore rende tangibile questo numero astronomico, permettendo all'utente di sperimentare in prima persona l'estrema improbabilità di centrare il jackpot.

---

## ✨ Funzionalità

### 🎫 Schedina Interattiva
- Compilazione di **1-8 colonne** con selezione di 6 numeri (1-90) ciascuna
- Opzione **SuperStar** per ogni colonna
- Generazione casuale rapida per ogni colonna
- Interfaccia che **replica fedelmente l'estetica della schedina reale** del SuperEnalotto, con sfondo rosa caratteristico e griglia numerica classica

### 🎱 Estrazione Animata
- Animazione fluida dell'estrazione con effetti 3D sulle sfere
- Visualizzazione dei 6 numeri estratti, numero Jolly e SuperStar
- Evidenziazione immediata dei numeri indovinati
- Riepilogo vincite per ogni colonna giocata

### 📊 Pannello Probabilità
- Tabella completa delle probabilità per ogni categoria di vincita (dal "2" al "6")
- Visualizzazione "1 su N" per rendere intuitive le probabilità
- Confronto con eventi della vita reale per contestualizzare le probabilità

### 📐 Formule del Calcolo Combinatorio
- Spiegazione visiva del **coefficiente binomiale** C(n, k) = n! / (k! × (n-k)!)
- Calcolo dettagliato delle combinazioni totali C(90, 6)
- Formule specifiche per ogni categoria di vincita
- Analisi del **valore atteso** e dimostrazione che il banco trattiene ~65%

### ⚡ Simulazione Monte Carlo
- Simulazione veloce di **migliaia o milioni** di estrazioni
- Risultati aggregati con conteggio vincite per categoria
- Bilancio economico cumulativo (speso vs. vinto)
- Dimostrazione empirica della convergenza verso le probabilità teoriche

### 📈 Dashboard Statistiche
- Grafico dell'andamento del bilancio nel tempo (Recharts)
- Conteggio vincite per categoria nella sessione
- Numeri più frequentemente estratti
- Bilancio complessivo con indicatore visivo guadagno/perdita

---

## 🛠️ Stack Tecnologico

| Tecnologia | Utilizzo |
|---|---|
| **React 18** | UI component-based con hooks (useState, useCallback) |
| **TypeScript 5.8** | Type safety su tutta la codebase |
| **Vite 5** | Build tool e dev server con HMR |
| **Tailwind CSS 3.4** | Utility-first styling con design tokens personalizzati |
| **shadcn/ui** | Componenti UI accessibili basati su Radix UI |
| **Framer Motion** | Animazioni fluide e transizioni |
| **Recharts** | Grafici interattivi per la dashboard statistiche |
| **Lucide React** | Iconografia coerente |

---

## 🚀 Quick Start

### Prerequisiti

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0 (o **bun** ≥ 1.0.0)

### Installazione

```bash
# 1. Clona il repository
git clone https://github.com/YOUR_USERNAME/superenalotto-simulator.git

# 2. Entra nella directory del progetto
cd superenalotto-simulator

# 3. Installa le dipendenze
npm install
# oppure con bun:
bun install

# 4. Avvia il server di sviluppo
npm run dev
# oppure:
bun run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

### Script Disponibili

| Comando | Descrizione |
|---|---|
| `npm run dev` | Avvia il dev server con hot reload |
| `npm run build` | Build di produzione |
| `npm run build:dev` | Build in modalità development |
| `npm run preview` | Anteprima della build di produzione |
| `npm run lint` | Linting con ESLint |
| `npm run test` | Esegui i test con Vitest |
| `npm run test:watch` | Test in modalità watch |

---

## 📁 Struttura del Progetto

```
superenalotto-simulator/
├── public/                    # Asset statici
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── assets/                # Asset importati (logo)
│   ├── components/
│   │   ├── ui/                # Componenti shadcn/ui (Button, Card, Tabs, Dialog, ecc.)
│   │   ├── Schedina.tsx       # Componente schedina principale (wrapper colonne)
│   │   ├── SchedinaColumn.tsx # Singola colonna della schedina con griglia numeri
│   │   ├── Estrazione.tsx     # Visualizzazione animata dell'estrazione
│   │   ├── ProbabilitaPanel.tsx       # Tabella probabilità per categoria
│   │   ├── FormuleCombinatorie.tsx    # Formule matematiche e spiegazioni
│   │   ├── SimulazioneVeloce.tsx      # Pannello simulazione Monte Carlo
│   │   ├── StatisticheDashboard.tsx   # Dashboard con grafici e statistiche
│   │   ├── RegoleModal.tsx            # Modale con regole del gioco
│   │   └── NavLink.tsx                # Navigazione
│   ├── hooks/                 # Custom React hooks
│   ├── lib/
│   │   ├── superenalotto.ts   # 🧮 Core: logica di gioco, probabilità, simulazione
│   │   └── utils.ts           # Utility generiche (cn, classnames)
│   ├── pages/
│   │   ├── Index.tsx          # Pagina principale con orchestrazione completa
│   │   └── NotFound.tsx       # Pagina 404
│   ├── test/                  # Test suite
│   ├── App.tsx                # Router principale
│   ├── index.css              # Design system: variabili CSS, tema, glassmorphism
│   └── main.tsx               # Entry point React
├── docs/
│   ├── ARCHITECTURE.md        # Documentazione architetturale
│   └── MATH.md                # Documentazione matematica approfondita
├── CONTRIBUTING.md            # Guida ai contributi
├── CHANGELOG.md               # Registro delle modifiche
├── CODE_OF_CONDUCT.md         # Codice di condotta
├── LICENSE                    # Licenza MIT
└── README.md                  # Questo file
```

### Il Cuore del Progetto: `superenalotto.ts`

Il file `src/lib/superenalotto.ts` contiene tutta la logica matematica e di gioco:

- **`binomial(n, k)`** — Calcolo del coefficiente binomiale con approccio numericamente stabile
- **`calculateProbability(category)`** — Probabilità esatta per ogni categoria di vincita
- **`generateExtraction()`** — Generazione casuale di un'estrazione completa (6 numeri + Jolly + SuperStar)
- **`checkMatches(column, extraction)`** — Verifica delle corrispondenze e determinazione della categoria di vincita
- **`runSimulation(columns, numExtractions)`** — Simulazione Monte Carlo con aggregazione risultati
- **`formatCurrency()` / `formatNumber()`** — Formattazione locale italiana

Per approfondimenti matematici, consulta la [documentazione matematica completa](docs/MATH.md).

---

## 🔢 Il Modello Probabilistico in Breve

Il SuperEnalotto si basa sulla scelta di **6 numeri** da un insieme di **90**. Il numero totale di combinazioni possibili è dato dal coefficiente binomiale:

```
C(90, 6) = 90! / (6! × 84!) = 622.614.630
```

Questo significa che la probabilità di indovinare tutti e 6 i numeri è:

```
P(6) = 1 / 622.614.630 ≈ 0,00000016%
```

Per avere il **50% di probabilità** di vincere almeno una volta, servirebbero circa **431 milioni di giocate**, ovvero spendere oltre **431 milioni di euro**... per un jackpot che in media è di 100 milioni.

👉 Leggi la [documentazione matematica completa](docs/MATH.md) per tutti i dettagli.

---

## 🤖 Nota sullo Sviluppo

Questo progetto è stato sviluppato utilizzando tecniche di **vibe coding** con l'ausilio di **agenti AI**. Il vibe coding è un approccio emergente allo sviluppo software in cui il programmatore collabora con modelli di intelligenza artificiale per generare, iterare e raffinare il codice attraverso un dialogo naturale, concentrandosi sull'intento e sul design piuttosto che sulla scrittura manuale di ogni singola riga.

L'intero processo — dall'architettura dei componenti alla logica matematica, dal design system alle animazioni — è stato guidato attraverso prompt iterativi, con revisione umana continua per garantire correttezza, qualità e coerenza. Il risultato è un esempio concreto di come il vibe coding possa produrre software complesso, ben strutturato e matematicamente rigoroso.

---

## 📄 Licenza

Questo progetto è distribuito sotto licenza **MIT**. Vedi il file [LICENSE](LICENSE) per i dettagli completi.

---

## 🤝 Contribuire

I contributi sono benvenuti! Leggi la [guida ai contributi](CONTRIBUTING.md) per scoprire come partecipare.

---

## 📚 Documentazione Aggiuntiva

- [📐 Documentazione Matematica](docs/MATH.md) — Teoria combinatoria, probabilità e simulazione Monte Carlo
- [🏗️ Architettura del Progetto](docs/ARCHITECTURE.md) — Componenti, flusso dati e design system
- [📋 Changelog](CHANGELOG.md) — Registro delle modifiche
- [📜 Codice di Condotta](CODE_OF_CONDUCT.md) — Standard della community

---

<p align="center">
  <sub>Fatto con 🎲 e matematica. Ricorda: la probabilità è contro di te.</sub>
</p>
