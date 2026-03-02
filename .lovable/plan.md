

## Piano: Documentazione Professionale per Repository GitHub

Il repository attualmente ha solo un README.md generico auto-generato. Creeremo una suite completa di documenti professionali, menzionando che il progetto è stato sviluppato con tecniche di vibe coding e agenti AI, senza citare piattaforme specifiche.

### Documenti da creare

**1. `README.md`** — Completamente riscritto
- Logo/banner del progetto
- Descrizione dettagliata del simulatore (scopo didattico, calcolo combinatorio, probabilità)
- Screenshot/demo link
- Funzionalità principali (schedina interattiva, estrazione animata, pannello probabilità, formule combinatorie, simulazione Monte Carlo, statistiche sessione)
- Stack tecnologico con badge (React, TypeScript, Vite, Tailwind, Framer Motion, Recharts, shadcn/ui)
- Quick start (requisiti, installazione, avvio)
- Struttura del progetto (albero directory commentato)
- Nota sul vibe coding con agenti AI
- Link a CONTRIBUTING, LICENSE, docs
- Sezione matematica: breve spiegazione del modello probabilistico C(90,6)

**2. `LICENSE`** — MIT License
- Licenza MIT standard con anno e nome del progetto

**3. `CONTRIBUTING.md`** — Guida ai contributi
- Come contribuire (fork, branch, PR)
- Convenzioni di codice (TypeScript strict, Tailwind, componenti funzionali)
- Come segnalare bug e proporre feature
- Setup ambiente di sviluppo
- Linee guida per i commit message

**4. `CHANGELOG.md`** — Registro delle modifiche
- Versione iniziale con tutte le feature implementate
- Formato "Keep a Changelog"

**5. `docs/ARCHITECTURE.md`** — Architettura del progetto
- Diagramma dei componenti React
- Flusso dati (state management con useState/useCallback)
- Modulo di logica di gioco (`superenalotto.ts`): funzioni matematiche, generazione estrazioni, simulazione
- Design system (tema scuro, glassmorphism, palette colori)
- Scelte architetturali e motivazioni

**6. `docs/MATH.md`** — Documentazione matematica
- Teoria del calcolo combinatorio applicata
- Coefficiente binomiale e sue proprietà
- Calcolo probabilità per ogni categoria di vincita
- Simulazione Monte Carlo: principi e implementazione
- Valore atteso e analisi del rendimento
- Riferimenti bibliografici

**7. `CODE_OF_CONDUCT.md`** — Codice di condotta
- Contributor Covenant standard v2.1

### Dettagli tecnici
- Tutti i file in formato Markdown
- README con badge shields.io per tecnologie e licenza
- Struttura `docs/` per documentazione estesa
- Lingua: italiano (coerente con il progetto), con termini tecnici in inglese dove appropriato

