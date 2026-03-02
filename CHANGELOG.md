# 📋 Changelog

Tutte le modifiche significative a questo progetto sono documentate in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.1.0/), e questo progetto aderisce al [Semantic Versioning](https://semver.org/lang/it/).

---

## [1.0.0] — 2025-01-01

### 🎉 Release Iniziale

Prima versione pubblica del SuperEnalotto Simulator.

### Aggiunto

#### Schedina Interattiva
- Compilazione di 1-8 colonne con selezione di 6 numeri da 1 a 90
- Opzione SuperStar per ogni colonna (numero 1-90)
- Generazione casuale rapida dei numeri per ogni colonna
- Interfaccia grafica che replica la schedina reale del SuperEnalotto (sfondo rosa, griglia classica)
- Aggiunta e rimozione dinamica delle colonne

#### Estrazione Animata
- Animazione fluida dell'estrazione con effetti 3D sulle sfere numeriche
- Visualizzazione dei 6 numeri estratti in ordine crescente
- Numero Jolly con badge dedicato
- Numero SuperStar con stile dorato
- Evidenziazione in tempo reale dei numeri indovinati sulla schedina
- Riepilogo vincite per colonna con categoria e premio

#### Pannello Probabilità
- Tabella completa delle probabilità per tutte le 6 categorie di vincita
- Visualizzazione in formato "1 su N" per intuizione immediata
- Premi medi indicativi per ogni categoria
- Confronti con eventi della vita reale (probabilità di essere colpiti da un fulmine, ecc.)

#### Formule del Calcolo Combinatorio
- Spiegazione visiva del coefficiente binomiale C(n, k)
- Calcolo dettagliato di C(90, 6) = 622.614.630
- Formula specifica per ogni categoria di vincita
- Analisi del valore atteso E[V] ≈ €0,35 per €1,00 giocato
- Dimostrazione che il banco trattiene circa il 65%

#### Simulazione Monte Carlo
- Simulazione veloce con configurazione del numero di estrazioni
- Supporto per simulazioni da 100 a 10.000.000 di estrazioni
- Risultati aggregati: vincite per categoria, bilancio economico
- Confronto speso vs. vinto con indicatori visivi

#### Dashboard Statistiche di Sessione
- Grafico dell'andamento del bilancio nel tempo (LineChart con Recharts)
- Contatore giocate, totale speso, totale vinto
- Bilancio complessivo con colore adattivo (verde/rosso)
- Conteggio vincite per categoria nella sessione corrente
- Top 10 numeri più frequentemente estratti

#### Design e UX
- Tema scuro con design system glassmorphism
- Palette colori coerente con variabili CSS semantiche
- Font Space Grotesk (UI) e JetBrains Mono (formule e dati)
- Layout responsivo per desktop e mobile
- Animazioni con Framer Motion
- Navigazione a tab (Gioca, Probabilità, Formule, Simulazione, Statistiche)
- Modale regole del gioco

#### Infrastruttura
- Setup Vite + React + TypeScript
- Componenti shadcn/ui con Radix UI
- Tailwind CSS con design tokens personalizzati
- ESLint per linting
- Vitest per testing
- Build ottimizzata per produzione

---

## Convenzioni

- 🎉 **Aggiunto** per nuove funzionalità
- 🔄 **Modificato** per cambiamenti a funzionalità esistenti
- ⚠️ **Deprecato** per funzionalità che verranno rimosse
- 🗑️ **Rimosso** per funzionalità rimosse
- 🐛 **Corretto** per bug fix
- 🔒 **Sicurezza** per vulnerabilità risolte
