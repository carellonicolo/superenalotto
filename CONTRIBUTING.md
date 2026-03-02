# 🤝 Guida ai Contributi

Grazie per il tuo interesse nel contribuire a **SuperEnalotto Simulator**! Questo documento fornisce le linee guida per contribuire al progetto in modo efficace e coerente.

---

## 📋 Indice

- [Come Contribuire](#come-contribuire)
- [Segnalare Bug](#-segnalare-bug)
- [Proporre Nuove Funzionalità](#-proporre-nuove-funzionalità)
- [Setup Ambiente di Sviluppo](#-setup-ambiente-di-sviluppo)
- [Convenzioni di Codice](#-convenzioni-di-codice)
- [Processo di Pull Request](#-processo-di-pull-request)
- [Commit Message](#-commit-message)

---

## Come Contribuire

1. **Fai un fork** del repository
2. **Crea un branch** per la tua feature o fix (`git checkout -b feature/nome-feature`)
3. **Sviluppa** seguendo le convenzioni di codice
4. **Testa** le tue modifiche
5. **Committa** con un messaggio chiaro e descrittivo
6. **Pusha** il branch (`git push origin feature/nome-feature`)
7. **Apri una Pull Request** verso il branch `main`

---

## 🐛 Segnalare Bug

Quando segnali un bug, includi:

- **Descrizione chiara** del problema
- **Passi per riprodurlo** (step-by-step)
- **Comportamento atteso** vs. **comportamento effettivo**
- **Screenshot** se applicabili
- **Browser e sistema operativo** utilizzati
- **Versione di Node.js** (`node --version`)

### Template per Bug Report

```markdown
**Descrizione del Bug**
Una descrizione chiara e concisa del bug.

**Passi per Riprodurlo**
1. Vai a '...'
2. Clicca su '...'
3. Scorri fino a '...'
4. Osserva l'errore

**Comportamento Atteso**
Cosa ti aspettavi che accadesse.

**Screenshot**
Se applicabili, aggiungi screenshot per illustrare il problema.

**Ambiente**
- OS: [es. macOS 14.1]
- Browser: [es. Chrome 120]
- Node.js: [es. 20.10.0]
```

---

## 💡 Proporre Nuove Funzionalità

Prima di implementare una nuova funzionalità:

1. **Apri una Issue** per discutere l'idea con i maintainer
2. **Descrivi il caso d'uso**: perché questa funzionalità è utile?
3. **Proponi un'implementazione**: come vorresti realizzarla?
4. **Attendi feedback** prima di iniziare lo sviluppo

### Idee Benvenute

- Nuove visualizzazioni statistiche
- Miglioramenti alle animazioni
- Ottimizzazioni delle performance nella simulazione Monte Carlo
- Accessibilità (a11y) migliorata
- Internazionalizzazione (i18n)
- Test aggiuntivi

---

## 🔧 Setup Ambiente di Sviluppo

### Prerequisiti

- Node.js ≥ 18.0.0
- npm ≥ 9.0.0 (o bun ≥ 1.0.0)
- Git

### Installazione

```bash
# Clona il tuo fork
git clone https://github.com/TUO_USERNAME/superenalotto-simulator.git
cd superenalotto-simulator

# Installa le dipendenze
npm install

# Avvia il dev server
npm run dev

# In un altro terminale, esegui i test in watch mode
npm run test:watch
```

### Struttura Rilevante

```
src/
├── lib/superenalotto.ts      # Logica di gioco e matematica (CORE)
├── components/               # Componenti React
├── pages/Index.tsx           # Pagina principale (orchestrazione)
└── index.css                 # Design system e variabili CSS
```

---

## 📏 Convenzioni di Codice

### TypeScript

- **Strict mode** abilitato — nessun `any` implicito
- Usa **interfacce** per i props dei componenti
- Usa **type** per union types e utility types
- Esporta i tipi necessari per la composizione tra moduli

```typescript
// ✅ Corretto
interface MyComponentProps {
  title: string;
  onAction: (id: number) => void;
}

// ❌ Evita
const MyComponent = (props: any) => { ... }
```

### React

- **Componenti funzionali** con arrow function e `React.FC<Props>`
- **Hooks** per stato e side effects (useState, useCallback, useMemo)
- **Nessun class component**
- Componenti piccoli e focalizzati (Single Responsibility)

```typescript
// ✅ Pattern standard del progetto
const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  const [state, setState] = useState<string>('');
  
  const handleClick = useCallback(() => {
    onAction(1);
  }, [onAction]);

  return <div onClick={handleClick}>{title}</div>;
};
```

### Tailwind CSS

- Usa i **design tokens** definiti in `index.css` e `tailwind.config.ts`
- **Non usare colori hardcoded** nei componenti — usa le variabili semantiche
- Classi utility Tailwind per lo styling, no CSS inline (tranne casi eccezionali)

```tsx
// ✅ Usa token semantici
<div className="bg-secondary/50 text-foreground border-border">

// ❌ Non usare colori diretti
<div className="bg-blue-500 text-white border-gray-700">
```

### Formattazione

- **2 spazi** per l'indentazione
- **Single quotes** per le stringhe
- **Trailing comma** nelle liste multi-riga
- **Punto e virgola** alla fine delle istruzioni

---

## 🔀 Processo di Pull Request

### Checklist prima di aprire una PR

- [ ] Il codice compila senza errori (`npm run build`)
- [ ] I test passano (`npm run test`)
- [ ] Il linting è OK (`npm run lint`)
- [ ] Le nuove funzionalità hanno test appropriati
- [ ] La documentazione è aggiornata se necessario
- [ ] Il codice segue le convenzioni del progetto

### Template PR

```markdown
## Descrizione
Breve descrizione delle modifiche apportate.

## Tipo di Modifica
- [ ] Bug fix
- [ ] Nuova funzionalità
- [ ] Refactoring
- [ ] Documentazione
- [ ] Performance

## Come Testare
1. ...
2. ...

## Screenshot (se applicabili)
```

### Review

- Ogni PR richiede almeno **1 review** approvata
- I maintainer possono richiedere modifiche
- I commenti devono essere costruttivi e rispettosi
- Risolvi tutti i commenti prima del merge

---

## 📝 Commit Message

Segui la convenzione **Conventional Commits**:

```
<tipo>(<scope>): <descrizione breve>

[corpo opzionale]

[footer opzionale]
```

### Tipi

| Tipo | Descrizione |
|---|---|
| `feat` | Nuova funzionalità |
| `fix` | Correzione di un bug |
| `docs` | Modifiche alla documentazione |
| `style` | Formattazione, nessuna modifica al codice |
| `refactor` | Refactoring senza nuove feature o fix |
| `perf` | Miglioramenti alle performance |
| `test` | Aggiunta o modifica di test |
| `chore` | Modifiche al build, dipendenze, config |

### Esempi

```bash
feat(schedina): aggiungi validazione numero massimo colonne
fix(estrazione): correggi animazione numeri duplicati
docs(readme): aggiorna sezione installazione
perf(simulation): ottimizza loop Monte Carlo per grandi numeri
refactor(probability): estrai funzione calcolo singola categoria
test(superenalotto): aggiungi test per binomial edge cases
```

---

## 🎯 Principi Guida

1. **Correttezza matematica** — Le formule e i calcoli devono essere rigorosamente corretti
2. **Scopo didattico** — Ogni feature deve contribuire a far comprendere le probabilità
3. **Performance** — Le simulazioni devono essere efficienti anche con milioni di iterazioni
4. **Accessibilità** — L'interfaccia deve essere utilizzabile da tutti
5. **Semplicità** — Preferisci soluzioni semplici e leggibili a soluzioni "furbe"

---

## 📜 Codice di Condotta

Partecipando a questo progetto, accetti di rispettare il nostro [Codice di Condotta](CODE_OF_CONDUCT.md).

---

<p align="center">
  <sub>Grazie per contribuire a rendere la matematica più accessibile! 🎲</sub>
</p>
